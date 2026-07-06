# Arita Webfont

아리따(Arita) 글꼴을 **jsDelivr CDN**으로 손쉽게 사용하기 위한 저장소입니다.
CSS 한 줄로 웹에서 아리따를 쓸 수 있습니다.

> 아리따는 아모레퍼시픽의 기업 아이덴티티를 담은 글꼴이자, "나눔의 가치"를
> 실천하기 위해 누구나 무료로 사용하도록 배포하는 나눔 글꼴입니다.
> 저작권·이용 조건은 [LICENSE](./LICENSE)를 참고하세요.

## 글꼴 가족

| `font-family` | 언어 | 지원 `font-weight` |
| --- | --- | --- |
| `Arita Sans LTN` | 로마자 | 100 · 300 · 500 · 600 · 700 |
| `Arita Dotum KR` | 한글 (돋움) | 100 · 300 · 500 · 600 · 700 |
| `Arita Buri KR` | 한글 (부리) | 100 · 300 · 500 · 600 · 700 |
| `Arita Sans SC` | 중문 간체 | 300 · 500 · 700 |

`font-weight` 매핑: Thin/HairLine → **100**, Light → **300**, Medium → **500**,
SemiBold → **600**, Bold → **700**.

## 사용법

`@latest`는 항상 최신 배포 버전을 자동으로 가리킵니다.
프로덕션에서 CDN 캐시를 최대(약 1년, immutable)로 활용하려면
[특정 버전](https://www.npmjs.com/package/arita?activeTab=versions)으로
고정하는 것을 권장합니다 (예: `@0.1.0`).

### 1. Dynamic Subset (권장)

페이지에 실제로 쓰인 글자 범위(`unicode-range`)만 내려받아 가장 가볍습니다.
한글·중문처럼 큰 글꼴에 특히 유리합니다.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/arita@latest/dist/dynamic-subset/arita-dynamic-subset.css"
/>
```

```css
body {
  font-family: "Arita Dotum KR", sans-serif;
}
```

### 2. Static (전체)

글꼴 전체를 한 번에 받는 통짜 방식입니다. 구성이 단순합니다.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/arita@latest/dist/static/arita.css"
/>
```

### 3. 가족별 개별 로드

필요한 가족만 골라 로드하면 트래픽을 더 줄일 수 있습니다.

| 가족 | Dynamic Subset | Static |
| --- | --- | --- |
| Sans LTN | `dist/dynamic-subset/arita-sans-ltn-dynamic-subset.css` | `dist/static/arita-sans-ltn.css` |
| Dotum KR | `dist/dynamic-subset/arita-dotum-dynamic-subset.css` | `dist/static/arita-dotum.css` |
| Buri KR | `dist/dynamic-subset/arita-buri-dynamic-subset.css` | `dist/static/arita-buri.css` |
| Sans SC | `dist/dynamic-subset/arita-sans-sc-dynamic-subset.css` | `dist/static/arita-sans-sc.css` |

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/arita@latest/dist/dynamic-subset/arita-buri-dynamic-subset.css"
/>
```

### CSS `@import`

```css
@import url("https://cdn.jsdelivr.net/npm/arita@latest/dist/static/arita.css");
```

## 예제

```html
<style>
  h1 { font-family: "Arita Buri KR"; font-weight: 700; }
  p  { font-family: "Arita Dotum KR"; font-weight: 300; }
</style>

<h1>아리따 부리</h1>
<p>품격 있는 말씨를 사회와 나누다.</p>
```

## 빌드

원본 TTF(`fonts/`)로부터 `dist/`를, `index.template.html`로부터 `index.html`을 재생성합니다.

```bash
npm install
npm run build          # static + dynamic-subset + demo 전체
npm run build:static   # static만
npm run build:subset   # dynamic-subset만
npm run build:demo     # index.template.html → index.html (코드 하이라이팅)
npm run serve          # http://localhost:8080 에서 index.html 데모 확인
```

> 데모 페이지는 `index.template.html`이 소스입니다. 페이지를 수정하려면
> 템플릿을 고친 뒤 `npm run build:demo`로 `index.html`을 재생성하세요.
> `index.html`을 직접 편집하면 다음 빌드에서 덮어써집니다.

### 도구

- [`cn-font-split`](https://www.npmjs.com/package/cn-font-split) — TTF를
  `unicode-range` 단위 woff2 조각 + `@font-face` CSS로 분할 (dynamic subset).
- `woff2_compress` (`brew install woff2`) — TTF → 통짜 woff2 변환 (static).
- [`shiki`](https://shiki.style) — 데모 코드블록을 **빌드 타임에** 하이라이팅.
  런타임 네트워크 의존이 없어 새로고침에도 안정적이다.

포맷은 **woff2 단독**입니다. 2017년 이후 모든 최신 브라우저가 지원합니다.

## 라이선스

폰트 저작권은 아모레퍼시픽에 있습니다. [LICENSE](./LICENSE)를 확인하세요.
