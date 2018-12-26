---
title:          "Create Personal PWA Site With Hugo and Webpack"
date:           2018-12-26
draft:          false
tags:           ["go", "js", "json"]
description:    "Recently I went through the processing of creating my personal site,
                 after reading a lot of excellent articles (most of them come from Google Developers and Medium) and
                 comparing many famous static site generators (SSG), such as Jekyll, Hugo, Hexo and Gatsby,
                 I decided to choose Hugo as static content compiler and webpack as global resource optimizer. When building the site,
                 I tried my best to follow best practices, maximize code reuse and turn it into Progressive Web App (PWA) through Workbox."
image:          ""
---

Recently I went through the processing of creating my personal site,
after reading a lot of excellent articles (most of them come from [Google Developers][] and [Medium][]) and
comparing many famous static site generators (SSG), such as [Jekyll][], [Hugo][], [Hexo][] and [Gatsby][],
I decided to choose Hugo as static content compiler and [webpack][] as global resource optimizer. When building the site,
I tried my best to follow best practices[^fn1], maximize code reuse and turn it into Progressive Web App (PWA)[^fn2]<sup>,</sup>[^fn3] through [Workbox][].

### Why Hugo?

Hugo is neither the most popular nor the most mature one among other SSGs.
After careful consideration, I ultimately chose it because:

- **Open source**: Hugo is an open source project with a huge community of developers and users.

- **Highly efficient**: The major advantage of Hugo comparing with other SSGs is it's speed[^fn4], speed of compile and speed of live-reload.

- **Extremely powerful**: Hugo has excellent template engine,
common configuration commands and flexible resource handling mechanisms.

- **Deadly easy**: Hugo is just one static binary, it's straight-forward for users from different operating systems
to install, maintain and deploy Hugo projects.

- **Fully customizable**: Developers can always create their own themes with little efforts.

### Why webpack?

Hugo is powerful enough to build a full featured static site, so why do even bother with Webpack?

- **Multiple modes**: webpack has well distinction between development and production models,
which effectively balanced the compilation speed and resource size.

- **Flexible configuration**: most importantly, webpack provides more flexible approaches to process resources.

_(While setting up my site，[victor-hugo][] has completely migrated from [Gulp][] to [webpack][], 
their project is more customizable. Highly recommended)_

### Project structure

```bash
webpack-hugo
  ├── .babelrc                 babel configuration file
  ├── .editorconfig            editor configuration file
  ├── .eslintignore            eslint ignore configuration file
  ├── .eslintrc.json           eslint configuration file
  ├── .gitignore               git ignore configuration file
  ├── .prettierrc              prittier configuration file
  ├── netlify.toml             netlify configuration file
  ├── README.md                Documentation
  ├── package.json             npm configuration file
  ├── webpack.common.js        webpack general configuration file
  ├── webpack.dev.js           webpack development mode configuration file
  ├── webpack.prod.js          webpack production mode configuration file
  ├── site                     Hugo standard folder
  │   ├── archetypes/          Hugo prototype folder
  │   ├── assets/              Hugo assets folder
  │   ├── content/             Site content folder
  │   ├── data/                Hugo data folder
  │   ├── i18n/                internationalization folder
  │   ├── layouts/             Hugo templates folder
  │   ├── static/              Hugo static content folder
  │   └── config.toml          Hugo main configuration file
  └── src                      Public resource folder
       ├── img/                Public images folder
       ├── sass/               Public styles folder
       ├── 404.html            Public 404 html
       ├── minor.js            Secondary js file
       ├── robots.txt          robots.txt   
       ├── sw.js               Service Worker configuration file
       └── index.js            Main js file
```
### Develop and Deploy

#### Prerequisites

[Hugo][], [Node][] and [npm][] (or [yarn][]) are required.

- Mac: `brew install Hugo`

- Ubt: `sudo apt-get install Hugo`

- Win: `choco install Hugo -confirm`

#### Development

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

Hugo comes with live-reload built in, it's important for online updating content. 
And webpack provide watch mode to enable hot reloading scripts.

#### Production

```npm
$ yarn build
```

```bash
▶ env HUGO_ENV=production webpack --config webpack.prod.js --mode production

...

Total in 27 ms
```

Production mode triggered additional resource optimizations comparing with development mode.

#### Deployment

- **Push**: push the entire project to Github repository.

- **Link**: create a new [Netlify][] site and link to the Github repository.

#### Custom domain

By default, any site on Netlify is accessible via its subdomain.
There's a step by step tutorial on how to add custom domains[^fn5]. As a student, you can apply for the Student Developer Pack[^fn6], 
which provides a free [Namecheap][] domain and a SSL certificate. Enable the SSL certificate is easy according to the official guidance[^fn7]. 
You can set your custom domain as follows:

![domain](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/domain.webp)

### Performance Optimization

Optimization mainly focus on resource and request[^fn8], and follows
**Pure Text | Unicode Character > CSS | SVG > WebP | JPG > JS** may improve performance to a certain extent.

#### Reduce third-party dependencies

The major benefit of reducing third-party dependencies is decreasing the number of HTTP requests,
therefore shortening the page load time, eventually reducing the delay time for user interaction.


- **css**: Tiny website could use critical css instead of [Bootstrap][],
CSS is treated as a render blocking resource,
which means that constructing the CSSOM will block main render process.

- **js**: Simple DOM selection can employ vanilla js rather than [jquery][], JavaScript is a kind of expensive resource
 as it must not only be downloaded, but parsed, compiled and executed as well.[^fn9]

- **icon**: Few icons could depend on unicode characters[^fn10] and svg sprite instead of [Font Awesome][].

- **font**: Defaulting to the native system font[^fn11] can increase performance because of code and request reductions.

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

#### Minimize resource size

Apply resource compression to minimize transmission size.

- **Image**：Images often account for most of the transmission bytes on a web page[^fn12]<sup>,</sup>[^fn13], consider css or svg effects instead of image where possible.
Black & White images sometimes achieve better results. Convert image types into webp[^fn14] or jpg. Compress image through [TinyPNG][], [Compressor.io][] etc.

- **Text**：The smaller text size, the faster transmission. It's the developer's responsibility to eliminate irrelevant characters and
comments, remove non-critical js scripts, "streamline" HTML code, decrease the depth of DOM tree and enable the webpack
optimization strategies at production mode.

```http request
$ http https://www.valleyease.me/

HTTP/1.1 200 OK
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 162
Content-Type: text/html; charset=UTF-8
```

#### Migrate to HTTP/2

HTTP/2[^fn15] enables full request and response multiplexing, hence it's reasonable to split some code into smaller chunks.

- **Optimize request**：Adjust the order of resources executions, deliver main css as quickly as possible, load
less important resources asynchronously and remove unused js from the critical path.[^fn16]<sup>,</sup>[^fn17]

- **Split resources**：Only load resources needed for the current page, consider lazy-loading for non-critical scripts
 and using inline strategy for critical scripts.

#### Use service workers

For security reasons, service workers can only be registered on pages served over HTTPS.
They already include features like intercept requests, push notifications and background sync etc.
The most exciting feature is that they allow you to support offline experiences. 
What this means is that when a user navigates to your site, there’s a good chance requested resources already in the browser cache,
and so they experience much more reduced costs in terms of booting scripts up and getting interactive.

#### Make some compromise

- **In-site Search**: [Algolia][] together with [Autocomplete][] are powerful for content searching. But they contribute to almost **70%** of total js size.
Hence after serious consideration, I decide to use client-side search depend on article titles which contain critical key words.

- **Font Style**：Using the native system font can boost performance，it is well used by Github, Medium, Ghost, WordPress and Bootstrap, 
The disadvantage is lacking of custom style.

- **Image Type**：With WebP, developers can create smaller images that make the web faster. However, not every browser has WebP support,
 for example, Apple’s Safari browser, along with their iOS Safari browser, both don’t support WebP. So if you read this article
 on Safari, you may not see the images.

### Performance Testing

Chrome DevTools is awesome  for network, performance and service workers testing and debugging. The normal http request is as follows, which revels
the optimizations around execution order, resource compression and code-splitting.

![performance](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/performance.webp)

Service worker has the ability to intercept and handle network requests, and give users response at low delay time by using  cached resources.
Most importantly, it can provide offline experiences within a certain duration.

![service worker](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/serviceworker.webp)

I use Lighthouse to test my site and optimize my site according to the reports, which mainly focus on performance, PWA, accessibility, best practices and SEO.
After step by step repairing, the result is good enough.

![page test](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/pagetest.webp)

![audits](/src/img/posts/20181223_create-personal-PWA-site-with-hugo-and-webpack/audits.webp)

### Summary

This is the first article of my site, mainly focus on performance optimization. 
There may exists unreasonable code because I create it to fulfill
my own needs. The code is on [Github][], please fell free to use them.

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

