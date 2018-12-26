---
title:          "利用Hugo和Webpack搭建PWA个人网页"
date:           2018-12-23
draft:          false
tags:           ['go', 'js', 'json']
description:    "最近开始着手搭建个人网页， 参考了很多优秀的文章，主要出自 Google Developers 和 Medium，尝试过很多成熟的框架，
                 例如 Jekyll, Hexo, Gatsby 等，最终决定用 Hugo 进行静态网页编译，
                 用 webpack 进行全局资源优化。网页框架尽量遵循最佳实践，最大化增加代码复用，
                 利用 Workbox 实现渐进式Web应用功能 (Progressive Web App, PWA)"
image:          ""
---

最近开始着手搭建个人网页，参考了很多优秀的文章，主要出自 [Google Developers][] 和 [Medium][]，尝试过很多成熟的框架，
例如 [Jekyll][], [Hexo][], [Gatsby][] 等，最终决定用 [Hugo][] 进行静态网页编译，
用 [webpack][] 进行全局资源优化。网页框架尽量遵循最佳实践[^fn1]，最大化增加代码复用，
利用 [Workbox][] 实现渐进式Web应用功能 (Progressive Web App, PWA)[^fn2]<sup>,</sup>[^fn3]。

### 为什么选择 Hugo?

目前有很多出色的静态网页生成工具 (Static Site Generator, SSG) , Hugo 不是最流行的也不是历史最久的，权衡利弊选择它主要出于如下考虑：

- **开源**：Hugo 是一个开源项目，有大量开发人员对其进行维护。

- **高效**：和其他 SSG 相比，Hugo 最大的优势是速度[^fn4]，编译速度和热更新速度。

- **强大**：Hugo 拥有强大的模版引擎，常用的配置命令以及灵活的资源处理机制。

- **简单**：Hugo 利用了 [go][] 优秀的跨平台特性，自身是一个打包好的静态文件。

- **灵活**：用户可以根据自身爱好创建不同类型的主题。

### 为什么用到 webpack?

Hugo 自身完全可以胜任各类静态网页开发，为什么用到 webpack？

- **多种模式**： 合理区分开发和生产环境，有效平衡构建速度和资源大小。

- **配置灵活**： 提供更灵活的资源优化方式，模块化处理各类资源。

_(注：在我搭建个人网页的同时，[victor-hugo][] 已经从 [Gulp][] 完全迁移到 [webpack][] 了，他们的工程更加简洁和灵活，强烈推荐。)_

### 工程目录

```bash
webpack-hugo
  ├── .babelrc                 babel配置文件
  ├── .editorconfig            编辑器配置文件
  ├── .eslintignore            eslint ignore配置文件
  ├── .eslintrc.json           eslint配置文件
  ├── .gitignore               git ignore配置文件
  ├── .prettierrc              prittier配置文件
  ├── netlify.toml             netlify配置文件
  ├── README.md                说明文档
  ├── package.json             npm项目文件
  ├── webpack.common.js        webpack通用配置文件
  ├── webpack.dev.js           webpack开发模式配置文件
  ├── webpack.prod.js          webpack生产模式配置文件
  ├── site                     Hugo标准目录
  │   ├── archetypes/          Hugo模板原型目录
  │   ├── assets/              Hugo资源目录
  │   ├── content/             原始md文件目录
  │   ├── data/                Hugo data目录
  │   ├── i18n/                国际化配置
  │   ├── layouts/             Hugo模板目录
  │   ├── static/              Hugo静态资源
  │   └── config.toml          Hugo配置文件
  └── src                      公共资源目录
       ├── img/                公共图片文件目录
       ├── sass/               公共样式目录
       ├── 404.html            公共404html
       ├── minor.js            副js入口文件
       ├── robots.txt          robots.txt
       ├── sw.js               Service Worker配置
       └── index.js            主js入口文件
```

### 调试及部署

#### 必要依赖

运行工程需要安装最新版的 [Hugo][]， [Node][] 和 [npm][] (或 [yarn][])。

- Mac: `brew install Hugo`

- Ubt: `sudo apt-get install Hugo`

- Win: `choco install Hugo -confirm`

#### 开发模式

```npm
$ yarn dev
```

```bash
▶ webpack --config webpack.dev.js --mode development --watch

...

                   | EN | ZH
+------------------+----+----+
  Pages            | 49 | 49
  Paginator pages  |  4 |  4
  Non-page files   |  0 |  0
  Static files     |  1 |  1
  Processed images |  0 |  0
  Aliases          | 19 |  19
  Sitemaps         |  2 |  2
  Cleaned          |  0 |  0

Total in 57 ms
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)

...

Webpack Bundle Analyzer is started at http://127.0.0.1:8888
```

开发模式下, Hugo 的热更新功能便于内容在线更新， webpack 的 watch 功能便于代码在线调试。

#### 生产模式


```npm
$ yarn build
```

```bash
▶ env HUGO_ENV=production webpack --config webpack.prod.js --mode production

...

Total in 27 ms
```

与开发模式相比，生产模式对所有资源进行了进一步优化，体积上有明显减小。

#### 自动部署

- **Push**: push 代码到 Github 仓库

- **Link**: 在 [Netlify][] 新建工程并指向 Github 仓库

#### 自定义域名

Netlify 会自动赋予项目一个子域名，如果想自定义域名，可以参考官方文档[^fn5]，学生一般可以申请 Github 学生套餐[^fn6]，可以获得一个免费的 [Namecheap][] 域名
以及 SSL 证书，SSL 配置可以参考官方文档[^fn7]，Namecheap 域名关联 Netlify 如下：

![domain](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/domain.webp)

### 性能优化

性能优化主要围绕资源优化和请求优化[^fn8]，遵循 **Pure Text | Unicode Character > CSS | SVG > WebP | JPG > JS**
在一定程度上会对性能有所提升。

#### 减少三方依赖

减少三方依赖主要是尽量降低网络请求成本从而缩短页面加载资源的时间并降低用户可感知的延时。

- **css**: 极简页面用关键 css 替代 [Bootstrap][] , css 是阻塞渲染的资源，下载和解析会造成关键页面呈现的延迟。

- **js**: 简单 DOM 选择可以用原生 js 替代 [jquery][] , js 是一类比较"昂贵"的资源，他们往往会对交互造成较大时延[^fn9]。

- **icon**: 少数 icon 用unicode[^fn10] 字符和 svg sprite 替代 [Font Awesome][]。

- **font**: 利用系统自带字体 (native system font)[^fn11] 可以减少重复代码和请求次数。

```css
body {
  font-family:
    -apple-system,        /* OS X (10.11+), iOS (9+) */
    BlinkMacSystemFont,   /* OS X, Chrome */
    'Segoe UI',           /* Windows */
    Roboto,               /* Android 4.0+ */
    'Ubuntu',             /* Linux, Ubuntu */
    'Helvetica Neue',     /* OS X (10.9) */
    sans-serif;
}
```

#### 减小资源尺寸

配置资源压缩以减少传输文件大小。

- **图片**：图片往往占据了大部分流量[^fn12]<sup>,</sup>[^fn13]，优先考虑 css 或 svg 实现，黑白图片偶尔能达到比较好的呈现效果，格式尽量采用 webp[^fn14] 或 jpg，
  利用 [TinyPNG][], [Compressor.io][] 等网站压缩图片。

- **文本**：越少的文本相对传输就会越快，消除与程序执行无关的字符和注释，减少冗余的 js 代码， 精简 HTML 代码，减小 DOM 树深度，
  webpack 生产模式应用优化资源相关插件。

#### 采用HTTP/2传输协议

HTTP/2[^fn15] 改进了多路复用请求，可以按需进行代码拆分和异步加载。

- **优化加载**：调整资源执行顺序，对初次呈现不重要的脚本应设为异步或延迟加载[^fn16]<sup>,</sup>[^fn17]。

- **拆分资源**：合理拆分与页面关键呈现相关的资源，少数关键脚本采用内联。

#### 避免重定向

重定向会触发额外的 HTTP 请求-响应周期，从而延迟了整个 HTML 文档的下载，导致延缓关键页面的呈现。

#### HTTP 持久连接

HTTP 持久连接 (HTTP persistent connection) 可以重用已建立的 TCP 连接，减少了后续请求的延迟。

```http request
$ http https://www.valleyease.me/

HTTP/1.1 200 OK
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 162
Content-Type: text/html; charset=UTF-8
```

#### 应用服务工作线程

出于安全考虑，服务工作线程需要用于 HTTPS 环境，它的应用增加了主线程的空闲时间，内部主要通过 Promise 实现，可以拦截请求、推送通知以及后台同步，
最有意思的是支持离线体验。

#### 做适当取舍

- **搜索**：[Algolia][] 和 [Autocomplete][] 配合做站内搜索非常强大，但是它们总共占了接近 **70%** 的 js 资源。
斟酌之后决定采用客户端简单搜索，文章标题涵盖核心关键词。

- **字体**：运用系统字体可以改善性能，Github, Medium, Ghost, WordPress 以及 Bootstrap 都采纳了这种字体策略，但是字体效果也少了自定义风格。

- **图片**：WebP 格式的图片在体积上更有优势，缺点是兼容性，目前 Chrome 和 Opera 原生支持静态与动态的WebP格式，Firefox 不久前也支持WebP，
但是 Safari 暂时还未支持，所以如果用 Safari 浏览这篇博文可能会看不到图片。

### 性能测试

Chrome 自带的调试工具可以进行网络调试、性能调试以及服务工作线程调试，正常的网络请求测试如下图，
主要围绕加载顺序、异步加载、资源压缩、代码拆分等做了优化。

![performance](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/performance.webp)

服务工作线程启用后会拦截请求，将浏览器缓存的数据返回给用户，因此几乎等同于本地加载，整个请求延时非常短，并且可以在一定时间范围内实现离线访问。

![serviceworker](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/serviceworker.webp)

最后，运用 lighthouse 进行性能测试，并有针对性的进行优化，主要优化方面包括页面性能、渐进式 (PWA)、可访问性、最佳实践、SEO，
经过循序渐进的优化后达到了满意的程度。

![audits](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/audits.webp)

### 总结

以上便是我搭建个人网页以及进行优化的详细步骤，由于是按个人需求和爱好搭建，可能有很多地方不合理。网页的代码都在 [Github][] 上，欢迎使用。

[^fn1]: [Best Practices for a Faster Web App with HTML5](https://www.html5rocks.com/en/tutorials/speed/quick/)
[^fn2]: [A Tinder Progressive Web App Performance Case Study](https://medium.com/@addyosmani/a-tinder-progressive-web-app-performance-case-study-78919d98ece0)
[^fn3]: [Progressive Web Apps on iOS are here](https://medium.com/@firt/progressive-web-apps-on-ios-are-here-d00430dee3a7)
[^fn4]: [Hugo vs Jekyll: Benchmarked](https://forestry.io/blog/hugo-vs-jekyll-benchmark/)
[^fn5]: [Custom Domains - Netlify](https://www.netlify.com/docs/custom-domains/)
[^fn6]: [Student Developer Pack - GitHub Education](https://education.github.com/pack)
[^fn7]: [Steps to Get SSL Certificate Enabled - Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/794/67/how-do-i-activate-an-ssl-certificate)
[^fn8]: [Web Fundamentals](https://developers.google.com/web/fundamentals/)
[^fn9]: [The Cost Of JavaScript In 2018](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4)
[^fn10]: [List of Unicode characters](https://en.wikipedia.org/wiki/List_of_Unicode_characters)
[^fn11]: [Moving to a System Font Stack in 2018 (How and Why)](https://woorkup.com/system-font/)
[^fn12]: [Automating image optimization](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/automating-image-optimization/)
[^fn13]: [Image Compression for Web Developers](https://www.html5rocks.com/en/tutorials/speed/img-compression/)
[^fn14]: [Converting Images To WebP](https://www.smashingmagazine.com/2018/07/converting-images-to-webp/)
[^fn15]: [Turn-on HTTP/2 today!](https://http2.akamai.com/)
[^fn16]: [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
[^fn17]: [Building the DOM faster: speculative parsing, async, defer and preload](https://hacks.mozilla.org/2017/09/building-the-dom-faster-speculative-parsing-async-defer-and-preload/)

[go]: http://golang.org/
[Google Developers]: https://developers.google.com/
[Medium]: https://medium.com/
[Jekyll]: https://jekyllrb.com/
[Hexo]: https://hexo.io
[Gatsby]: https://www.gatsbyjs.org/
[Hugo]: https://gohugo.io/
[webpack]: https://webpack.js.org/
[Node]: https://nodejs.org/en/download/
[npm]: https://www.npmjs.com/get-npm
[yarn]: https://yarnpkg.com/en/docs/install
[Workbox]: https://developers.google.com/web/tools/workbox/
[Gulp]: https://gulpjs.com
[victor-hugo]: https://github.com/netlify-templates/victor-hugo
[Bootstrap]: https://getbootstrap.com/
[jquery]: https://jquery.com/
[Font Awesome]: https://fontawesome.com/
[Netlify]: https://www.netlify.com/
[Namecheap]: https://www.namecheap.com/
[TinyPNG]: https://tinypng.com/
[Compressor.io]: https://compressor.io
[Algolia]: https://www.algolia.com/
[Autocomplete]: https://github.com/algolia/autocomplete.js/
[Github]: https://github.com/ValleyZw/tiny
