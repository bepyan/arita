/**
 * Arita 웹폰트 빌드 파이프라인.
 *
 * 원본 TTF(fonts/) → 두 갈래 산출물:
 *   - dist/static/         : 통짜 woff2 + 패밀리별/통합 @font-face CSS
 *   - dist/dynamic-subset/ : cn-font-split이 만든 unicode-range woff2 조각 + CSS
 *
 * 사용법:
 *   node scripts/build.mjs              # 전체
 *   node scripts/build.mjs --only=static
 *   node scripts/build.mjs --only=subset
 *   node scripts/build.mjs --only=demo    # index.template.html → index.html
 *
 * 의존: woff2_compress (brew install woff2), cn-font-split·shiki (devDependency).
 */
import { execFile } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  renameSync,
  readdirSync,
  statSync,
} from 'node:fs';
import os from 'node:os';
import { promisify } from 'node:util';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fontSplit } from 'cn-font-split';
import { codeToHtml } from 'shiki';

const execFileAsync = promisify(execFile);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS_DIR = join(ROOT, 'fonts');
const DIST = join(ROOT, 'dist');
const STATIC_DIR = join(DIST, 'static');
const SUBSET_DIR = join(DIST, 'dynamic-subset');
const DEMO_TEMPLATE = join(ROOT, 'index.template.html');
const DEMO_OUTPUT = join(ROOT, 'index.html');

/**
 * 폰트 인벤토리. weight는 관용 매핑 적용(실측 usWeightClass=250인 Thin/HairLine → 100).
 * family는 폰트 내부 typographicFamily(16) 그대로 사용해 OS/브라우저 매칭과 일치시킴.
 * cssBase: 패밀리별 CSS 파일 스템. group: 통합 CSS 정렬/헤더용 라벨.
 */
const FAMILIES = [
  {
    family: 'Arita Sans LTN',
    cssBase: 'arita-sans-ltn',
    label: '로마자',
    fonts: [
      { stem: 'AritaSansLTN-Thin', weight: 100 },
      { stem: 'AritaSansLTN-Light', weight: 300 },
      { stem: 'AritaSansLTN-Medium', weight: 500 },
      { stem: 'AritaSansLTN-SemiBold', weight: 600 },
      { stem: 'AritaSansLTN-Bold', weight: 700 },
    ],
  },
  {
    family: 'Arita Dotum KR',
    cssBase: 'arita-dotum',
    label: '한글 돋움',
    fonts: [
      { stem: 'AritaDotumKR-Thin', weight: 100 },
      { stem: 'AritaDotumKR-Light', weight: 300 },
      { stem: 'AritaDotumKR-Medium', weight: 500 },
      { stem: 'AritaDotumKR-SemiBold', weight: 600 },
      { stem: 'AritaDotumKR-Bold', weight: 700 },
    ],
  },
  {
    family: 'Arita Buri KR',
    cssBase: 'arita-buri',
    label: '한글 부리',
    fonts: [
      { stem: 'AritaBuriKR-HairLine', weight: 100 },
      { stem: 'AritaBuriKR-Light', weight: 300 },
      { stem: 'AritaBuriKR-Medium', weight: 500 },
      { stem: 'AritaBuriKR-SemiBold', weight: 600 },
      { stem: 'AritaBuriKR-Bold', weight: 700 },
    ],
  },
  {
    family: 'Arita Sans SC',
    cssBase: 'arita-sans-sc',
    label: '중문 간체',
    fonts: [
      { stem: 'AritaSansSC-Light', weight: 300 },
      { stem: 'AritaSansSC-Medium', weight: 500 },
      { stem: 'AritaSansSC-Bold', weight: 700 },
    ],
  },
];

const arg = process.argv.find((a) => a.startsWith('--only='));
const only = arg ? arg.split('=')[1] : 'all';

function fresh(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

/** TTF 크기(bytes)를 사람이 읽는 문자열로. */
function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

// ────────────────────────────────────────────────────────────
// static: 통짜 woff2 + full CSS (woff2_compress 병렬, mtime 증분)
// ────────────────────────────────────────────────────────────
async function compressWoff2(ttf, dest, stem) {
  if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(ttf).mtimeMs) {
    console.log(`  [static] ${stem}.woff2 (skip)`);
    return;
  }
  // woff2_compress는 입력과 같은 폴더에 <stem>.woff2를 생성한다(출력 경로 지정 불가).
  await execFileAsync('woff2_compress', [ttf]);
  renameSync(join(FONTS_DIR, `${stem}.woff2`), dest);
  console.log(`  [static] ${stem}.woff2`);
}

async function buildStatic() {
  const woff2Dir = join(STATIC_DIR, 'woff2');
  mkdirSync(woff2Dir, { recursive: true });
  mkdirSync(STATIC_DIR, { recursive: true });

  const jobs = FAMILIES.flatMap((fam) =>
    fam.fonts.map((f) => ({
      stem: f.stem,
      ttf: join(FONTS_DIR, `${f.stem}.ttf`),
      dest: join(woff2Dir, `${f.stem}.woff2`),
    })),
  );
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(os.availableParallelism(), jobs.length) }, async () => {
      while (next < jobs.length) {
        const job = jobs[next++];
        await compressWoff2(job.ttf, job.dest, job.stem);
      }
    }),
  );

  for (const fam of FAMILIES) {
    const faces = [];
    for (const f of fam.fonts) {
      faces.push(
        [
          '@font-face {',
          `  font-family: "${fam.family}";`,
          `  font-style: normal;`,
          `  font-weight: ${f.weight};`,
          `  font-display: swap;`,
          `  src: local("${fam.family}"), url("./woff2/${f.stem}.woff2") format("woff2");`,
          '}',
        ].join('\n'),
      );
    }
    const css = `/* ${fam.family} (${fam.label}) — Arita webfont, static full */\n${faces.join('\n')}\n`;
    writeFileSync(join(STATIC_DIR, `${fam.cssBase}.css`), css);
    console.log(`  [static] ${fam.cssBase}.css (${fam.fonts.length} faces)`);
  }

  // 통합 CSS: 패밀리별 CSS를 @import.
  const combined = FAMILIES.map((f) => `@import url("./${f.cssBase}.css");`).join('\n');
  writeFileSync(join(STATIC_DIR, 'arita.css'), `/* Arita webfont — all families, static full */\n${combined}\n`);
  console.log('  [static] arita.css (통합)');
}

// ────────────────────────────────────────────────────────────
// dynamic-subset: cn-font-split으로 unicode-range 조각 생성
// ────────────────────────────────────────────────────────────
// CLI(npx) 반복 spawn은 wasm FFI 초기화가 불안정해 SIGABRT가 나므로,
// wasm을 한 프로세스에서 재사용하는 Node API(fontSplit)를 쓴다.
async function cnFontSplit(ttf, outDir, family, weight) {
  await fontSplit({
    input: readFileSync(ttf),
    outDir,
    css: {
      fontFamily: family,
      fontWeight: String(weight),
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fileName: 'result.css',
    },
    reporter: false,
    testHTML: false,
    silent: true,
  });
}

async function buildSubset() {
  fresh(SUBSET_DIR);

  for (const fam of FAMILIES) {
    const famFaces = [];
    for (const f of fam.fonts) {
      const ttf = join(FONTS_DIR, `${f.stem}.ttf`);
      const outDir = join(SUBSET_DIR, f.stem);
      await cnFontSplit(ttf, outDir, fam.family, f.weight);
      // 생성물 정리: 불필요한 부산물 제거, CSS의 상대 URL을 하위폴더 기준으로 재작성.
      for (const junk of ['index.proto', 'preview.svg', 'index.html']) {
        rmSync(join(outDir, junk), { force: true });
      }
      const raw = readFileSync(join(outDir, 'result.css'), 'utf8');
      // @font-face 블록만 추출(상단 주석 제거) 후 url("./ → url("./<stem>/
      const faces = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim()
        .replace(/url\("\.\//g, `url("./${f.stem}/`);
      famFaces.push(`/* ${fam.family} ${f.weight} */\n${faces}`);
      rmSync(join(outDir, 'result.css'), { force: true });
      console.log(`  [subset] ${f.stem} (${countFaces(faces)} chunks)`);
    }
    const css = `/* ${fam.family} (${fam.label}) — Arita webfont, dynamic subset */\n${famFaces.join('\n')}\n`;
    writeFileSync(join(SUBSET_DIR, `${fam.cssBase}-dynamic-subset.css`), css);
  }

  const combined = FAMILIES.map((f) => `@import url("./${f.cssBase}-dynamic-subset.css");`).join('\n');
  writeFileSync(
    join(SUBSET_DIR, 'arita-dynamic-subset.css'),
    `/* Arita webfont — all families, dynamic subset */\n${combined}\n`,
  );
  console.log('  [subset] arita-dynamic-subset.css (통합)');
}

function countFaces(css) {
  return (css.match(/@font-face/g) || []).length;
}

// ────────────────────────────────────────────────────────────
// demo: index.template.html의 코드블록을 Shiki로 미리 하이라이팅해 index.html 생성.
// 런타임 네트워크 의존을 없애 새로고침 시에도 하이라이팅이 안정적이다.
// ────────────────────────────────────────────────────────────
const HTML_ENTITIES = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'" };

function decodeEntities(s) {
  return s.replace(/&(lt|gt|amp|quot|#39);/g, (m) => HTML_ENTITIES[m]);
}

async function buildDemo() {
  if (!existsSync(DEMO_TEMPLATE)) {
    throw new Error(`데모 템플릿이 없습니다: ${DEMO_TEMPLATE}`);
  }
  const template = readFileSync(DEMO_TEMPLATE, 'utf8');

  // <div class="code-block" data-lang="..."> ... <pre class="raw"><code>SRC</code></pre> ... </div>
  // 내가 생성한 고정 구조만 대상으로 하므로 정규식 치환이 안전하다.
  const blockRe =
    /(<div class="code-block" data-lang="([a-z]+)">\s*)<pre class="raw"><code>([\s\S]*?)<\/code><\/pre>/g;

  let count = 0;
  const matches = [...template.matchAll(blockRe)];
  // Shiki 호출은 비동기라 먼저 모든 스니펫을 하이라이팅한 뒤 순서대로 치환.
  const highlighted = await Promise.all(
    matches.map(({ 2: lang, 3: rawCode }) =>
      codeToHtml(decodeEntities(rawCode), { lang, theme: 'github-light' }),
    ),
  );

  const html = template.replace(blockRe, (_m, prefix) => `${prefix}${highlighted[count++]}`);
  writeFileSync(DEMO_OUTPUT, html);
  console.log(`  [demo] index.html (${count} code blocks highlighted)`);
}

// ────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(FONTS_DIR) || readdirSync(FONTS_DIR).filter((f) => f.endsWith('.ttf')).length === 0) {
    throw new Error(`fonts/에 TTF가 없습니다: ${FONTS_DIR}`);
  }
  mkdirSync(DIST, { recursive: true });

  if (only === 'all' || only === 'static') {
    console.log('▶ static 빌드…');
    await buildStatic();
  }
  if (only === 'all' || only === 'subset') {
    console.log('▶ dynamic-subset 빌드…');
    await buildSubset();
  }
  if (only === 'all' || only === 'demo') {
    console.log('▶ demo(index.html) 빌드…');
    await buildDemo();
  }
  console.log('✅ 완료');
}

await main();
