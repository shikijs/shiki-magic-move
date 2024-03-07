# shiki-magic-move

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Smoothly animated code blocks with Shiki. [Online Demo](https://shiki-magic-move.netlify.app/).

## Usage

This is a rather low-level library, you usually want to use it with a high-level integrations like [Slidev](https://sli.dev/guide/syntax#shiki-magic-move).

If you want to integrate it into your own project, you might want to read the source code a bit.

This package provides framework-agnostic [core](./src/core.ts) and [renderer](./src/renderer.ts), as well as framework wrappers like [Vue](./src/vue) and [React](./src/react).

## How it works

Check [this blog post](https://antfu.me/posts/shiki-magic-move).

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/shiki-magic-move?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/shiki-magic-move
[npm-downloads-src]: https://img.shields.io/npm/dm/shiki-magic-move?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/shiki-magic-move
[bundle-src]: https://img.shields.io/bundlephobia/minzip/shiki-magic-move?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=shiki-magic-move
[license-src]: https://img.shields.io/github/license/shikijs/shiki-magic-move.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/shikijs/shiki-magic-move/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/shiki-magic-move
