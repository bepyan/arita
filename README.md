## Artia

![og](https://arita.bepyan.me/og.png)

아모레퍼시픽의 나눔 글꼴 [아리따(Arita)](https://design.amorepacific.com/arita/)를 링크 한 줄로 불러오는 **비공식 웹폰트 CDN**입니다.

데모: <https://arita.bepyan.me>

## Overview

> **Note**
>
> 포맷은 **woff2 단독 지원**입니다.   
> 2017년 이후 출시된 주요 브라우저는 모두 지원합니다.
> 
> 기본 방식(dynamic subset)은 글꼴 파일 전체 대신 페이지에 실제 쓰인 글자 조각만 내려받습니다.   
> 한글처럼 글자 수가 많은 글꼴에 특히 유리하고, 따로 설정할 것은 없습니다.

| 글꼴 | `font-family` | `font-weight` | CSS 파일명 |
| --- | --- | --- | --- |
| 아리따 돋움 (한글 고딕체) | `Arita Dotum KR` | 100 · 300 · 500 · 600 · 700 | `arita-dotum-dynamic-subset.css` |
| 아리따 부리 (한글 명조체) | `Arita Buri KR` | 100 · 300 · 500 · 600 · 700 | `arita-buri-dynamic-subset.css` |
| 아리따 산스 (라틴) | `Arita Sans LTN` | 100 · 300 · 500 · 600 · 700 | `arita-sans-ltn-dynamic-subset.css` |
| 아리따 흑체 (중문 간체) | `Arita Sans SC` | 300 · 500 · 700 | `arita-sans-sc-dynamic-subset.css` |

## Quick Start

### 1. 글꼴 불러오기

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@bepyan/arita@1.0.0/dist/dynamic-subset/arita-dotum-dynamic-subset.css"
/>
```

혹은

```css
@import url("https://cdn.jsdelivr.net/npm/@bepyan/arita@1.0.0/dist/dynamic-subset/arita-dotum-dynamic-subset.css");
```

### 2.글꼴 적용하기

> **Note**
>
> 기본 굵기로는 `font-weight: 500`(Medium)을 권장합니다

```css
body {
  font-family: "Arita Dotum KR", sans-serif;
  font-weight: 500;
}
```

## Contributor

- Edward Kim ([@bepyan](https://github.com/bepyan))

## LICENSE

글꼴 저작권은 아모레퍼시픽에 있습니다. 자세한 내용은 [LICENSE](./LICENSE)를 확인하세요.
