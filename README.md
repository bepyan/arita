# 아리따 글꼴

아모레퍼시픽의 나눔 폰트 [아리따(Arita)](https://design.amorepacific.com/arita/)를
링크 한 줄로 불러오는 **비공식 웹폰트 CDN**입니다.

데모: <https://arita.bepyan.me>

## 사용법

### 1. 글꼴 불러오기

쓰고 싶은 글꼴을 골라 `<head>`에 링크를 추가하세요. 아래는 **아리따 돋움**
예시입니다. 다른 글꼴은 표에서 CSS 파일명만 바꾸면 됩니다. 필요한 글꼴만
불러와야 페이지가 가볍습니다.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@bepyan/arita@latest/dist/dynamic-subset/arita-dotum-dynamic-subset.css"
/>
```

| 글꼴 | `font-family` | `font-weight` | CSS 파일명 |
| --- | --- | --- | --- |
| 아리따 돋움 (한글) | `Arita Dotum KR` | 100 · 300 · 500 · 600 · 700 | `arita-dotum-dynamic-subset.css` |
| 아리따 부리 (한글) | `Arita Buri KR` | 100 · 300 · 500 · 600 · 700 | `arita-buri-dynamic-subset.css` |
| 아리따 산스 (라틴) | `Arita Sans LTN` | 100 · 300 · 500 · 600 · 700 | `arita-sans-ltn-dynamic-subset.css` |
| 아리따 흑체 (중문 간체) | `Arita Sans SC` | 300 · 500 · 700 | `arita-sans-sc-dynamic-subset.css` |

굵기 이름 매핑: Thin/HairLine → **100**, Light → **300**, Medium → **500**,
SemiBold → **600**, Bold → **700**.

### 2. 글꼴 적용하기

CSS에서 글꼴을 적용할 곳에 위 표의 `font-family` 이름을 쓰면 끝입니다.

```css
body {
  font-family: "Arita Dotum KR", sans-serif;
}
```

### 더 알아보기

기본 방식(dynamic subset)은 글꼴 파일 전체 대신 페이지에 실제 쓰인 글자
조각만 내려받습니다. 한글처럼 글자 수가 많은 글꼴에 특히 유리하고, 따로
설정할 것은 없습니다.

| 용도 | 경로 |
| --- | --- |
| 모든 글꼴을 한 번에 | `dist/dynamic-subset/arita-dynamic-subset.css` |
| 글꼴 파일을 통째로 (static) | `dist/static/arita-dotum.css` 등 파일명 규칙 동일 |
| 모든 글꼴을 통째로 | `dist/static/arita.css` |

## 빌드

원본 TTF(`fonts/`)로부터 `dist/`를 재생성합니다.

```bash
pnpm install
pnpm build             # static + dynamic-subset 전체
pnpm build:static      # static만
pnpm build:subset      # dynamic-subset만
```

### 데모 페이지

데모는 [Astro](https://astro.build) 기반이며 소스는 `src/`에 있습니다.
개발 서버는 로컬 폰트 빌드(`dist/`)를 참조하므로 폰트 빌드가 선행돼야 하고,
빌드·배포된 페이지는 jsDelivr CDN의 폰트를 사용합니다.

```bash
pnpm dev               # http://localhost:4321 개발 서버
pnpm build:demo        # .site/ 에 정적 사이트 생성
pnpm preview           # .site/ 로컬 미리보기
pnpm deploy:demo       # .site/ 를 Cloudflare Pages에 배포
```

### 도구

- [`cn-font-split`](https://www.npmjs.com/package/cn-font-split) — TTF를
  `unicode-range` 단위 woff2 조각 + `@font-face` CSS로 분할 (dynamic subset).
- `woff2_compress` (`brew install woff2`) — TTF → woff2 변환 (static).

포맷은 **woff2 단독**입니다. 2017년 이후 모든 최신 브라우저가 지원합니다.

## 라이선스

폰트 저작권은 아모레퍼시픽에 있습니다. [LICENSE](./LICENSE)를 확인하세요.
