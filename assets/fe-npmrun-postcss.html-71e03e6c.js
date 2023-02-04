import{ab as a,G as s,H as r,E as e,S as d,N as i,ac as t,W as o}from"./framework-11534bf9.js";const c={},l=t(`<h1 id="npm-运行项目时-error-postcss-received-undefined-instead-of-css-string" tabindex="-1"><a class="header-anchor" href="#npm-运行项目时-error-postcss-received-undefined-instead-of-css-string" aria-hidden="true">#</a> npm 运行项目时 Error: PostCSS received undefined instead of CSS string</h1><h2 id="_1-背景" tabindex="-1"><a class="header-anchor" href="#_1-背景" aria-hidden="true">#</a> 1. 背景</h2><p>新拉下来的项目，启动项目 npm run dev 的时候就报错：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token literal-property property">Error</span><span class="token operator">:</span> PostCSS received <span class="token keyword">undefined</span> instead <span class="token keyword">of</span> <span class="token constant">CSS</span> string
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_2-原因" tabindex="-1"><a class="header-anchor" href="#_2-原因" aria-hidden="true">#</a> 2. 原因</h2><p>我的node的版本影响了node-sass的应用。</p><h2 id="_3-解决办法" tabindex="-1"><a class="header-anchor" href="#_3-解决办法" aria-hidden="true">#</a> 3. 解决办法</h2><p>卸载当前版本，安装最新版本的node-sass</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm uninstall node-sass

npm install node-sass --save-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>删除依赖，重新安装又依赖</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>rimraf node_modules

npm install
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后再重新启动项目就成功了</p><h1 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h1>`,13),p={href:"https://blog.csdn.net/Sunday97/article/details/116492447",target:"_blank",rel:"noopener noreferrer"};function u(h,v){const n=o("ExternalLinkIcon");return s(),r("div",null,[l,e("p",null,[e("a",p,[d("Error: PostCSS received undefined instead of CSS string"),i(n)])])])}const f=a(c,[["render",u],["__file","fe-npmrun-postcss.html.vue"]]);export{f as default};
