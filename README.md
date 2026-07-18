# 아리따 글꼴

[아리따(Arita)](https://www.apgroup.com/int/ko/about-us/visual-identity/arita-typeface/arita-typeface.html)는
아모레퍼시픽이 만들어 누구나 무료로 쓸 수 있게 배포하는 나눔 글꼴입니다.
이 저장소는 아리따를 **jsDelivr CDN**으로 제공해, 설치나 파일 다운로드 없이
CSS 한 줄로 웹에서 쓸 수 있게 합니다.

## 사용법

### 1. 쓰고 싶은 글꼴을 골라 `<head>`에 추가

필요한 글꼴만 불러와야 페이지가 가볍습니다. 아래는 **아리따 돋움** 예시입니다.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@bepyan/arita@latest/dist/dynamic-subset/arita-dotum-dynamic-subset.css"
/>
```

다른 글꼴은 CSS 파일명만 바꾸면 됩니다.

| 글꼴 | `font-family` | `font-weight` | CSS 파일명 |
| --- | --- | --- | --- |
| 아리따 돋움 (한글) | `Arita Dotum KR` | 100 · 300 · 500 · 600 · 700 | `arita-dotum-dynamic-subset.css` |
| 아리따 부리 (한글) | `Arita Buri KR` | 100 · 300 · 500 · 600 · 700 | `arita-buri-dynamic-subset.css` |
| 아리따 산스 (로마자) | `Arita Sans LTN` | 100 · 300 · 500 · 600 · 700 | `arita-sans-ltn-dynamic-subset.css` |
| 아리따 흑체 (중문 간체) | `Arita Sans SC` | 300 · 500 · 700 | `arita-sans-sc-dynamic-subset.css` |

굵기 이름 매핑: Thin/HairLine → **100**, Light → **300**, Medium → **500**,
SemiBold → **600**, Bold → **700**.

### 2. CSS에서 `font-family` 지정

```css
body {
  font-family: "Arita Dotum KR", sans-serif;
}
```

이걸로 끝입니다. 기본 방식(dynamic subset)은 글꼴 파일 전체 대신 페이지에
실제 쓰인 글자 조각만 내려받으므로, 한글처럼 글자 수가 많은 글꼴에 특히
유리합니다. 따로 설정할 것은 없습니다.

### 더 알아보기

| 용도 | 경로 |
| --- | --- |
| 모든 글꼴을 한 번에 | `dist/dynamic-subset/arita-dynamic-subset.css` |
| 글꼴 파일을 통째로 (static) | `dist/static/arita-dotum.css` 등 파일명 규칙 동일 |
| 모든 글꼴을 통째로 | `dist/static/arita.css` |

`@latest`는 항상 최신 배포 버전을 가리킵니다. 프로덕션에서는
[특정 버전](https://www.npmjs.com/package/@bepyan/arita?activeTab=versions)으로
고정하면 CDN 캐시를 최대(약 1년, immutable)로 활용할 수 있습니다 (예: `@1.0.0`).

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
- `woff2_compress` (`brew install woff2`) — TTF → woff2 변환 (static).

포맷은 **woff2 단독**입니다. 2017년 이후 모든 최신 브라우저가 지원합니다.

## 라이선스

폰트 저작권은 아모레퍼시픽에 있습니다. [LICENSE](./LICENSE)를 확인하세요.
