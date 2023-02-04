import{ab as a,G as p,H as t,E as n,S as e,N as o,ac as c,W as l}from"./framework-11534bf9.js";const r={},i=c(`<h1 id="首屏优化之-vue路由懒加载和使用懒加载prefetch问题" tabindex="-1"><a class="header-anchor" href="#首屏优化之-vue路由懒加载和使用懒加载prefetch问题" aria-hidden="true">#</a> 首屏优化之-vue路由懒加载和使用懒加载prefetch问题</h1><h2 id="_1-背景" tabindex="-1"><a class="header-anchor" href="#_1-背景" aria-hidden="true">#</a> 1. 背景</h2><p>使用路由懒加载以后 webpack 打包可以根据页面划分来生成文件，根据路由的不同来加载文件，解决了首页一次性加载文件过大导致打开过慢的问题。</p><h2 id="_2-优化操作" tabindex="-1"><a class="header-anchor" href="#_2-优化操作" aria-hidden="true">#</a> 2. 优化操作</h2><h3 id="_2-1-常规引入页面" tabindex="-1"><a class="header-anchor" href="#_2-1-常规引入页面" aria-hidden="true">#</a> 2.1 常规引入页面</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//常规引入页面</span>
<span class="token keyword">import</span> Home <span class="token keyword">from</span> <span class="token string">&#39;./views/Home.vue&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;home&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> Home<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;Home&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-具体优化-实现懒加载" tabindex="-1"><a class="header-anchor" href="#_2-2-具体优化-实现懒加载" aria-hidden="true">#</a> 2.2 具体优化：实现懒加载</h3><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token function-variable function">Home</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;./views/home.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token function-variable function">pageA</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;./views/homeA.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token function-variable function">pageB</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;./views/homeB.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;home&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> Home<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;Home&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/a&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;pageA&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> pageA<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;APage&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/b&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;pageB&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> pageB<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;BPage&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看一下打包之后的效果，会看到打包出了多个chunk异步块。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20200326162422455.png" alt="image-20200326162422455" tabindex="0" loading="lazy"><figcaption>image-20200326162422455</figcaption></figure><h3 id="_2-3-将chunk打包组" tabindex="-1"><a class="header-anchor" href="#_2-3-将chunk打包组" aria-hidden="true">#</a> 2.3 将chunk打包组</h3><p>不指定分组，chunk name会随机生成，我们可以将它指定成chunk name打包到一起</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//引入页面</span>
<span class="token keyword">const</span> <span class="token function-variable function">Home</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;./views/Home.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//把页面进行分组 home-group</span>
<span class="token keyword">const</span> <span class="token function-variable function">pageA</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackChunkName: &quot;home-group&quot; */</span> <span class="token string">&#39;./views/homeA.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token function-variable function">pageB</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackChunkName: &quot;home-group&quot; */</span> <span class="token string">&#39;./views/homeB.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;home&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> Home<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;Home&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/a&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;pageA&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> pageA<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;APage&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">&#39;/b&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;pageB&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> pageB<span class="token punctuation">,</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;BPage&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20200326162720918.png" alt="image-20200326162720918" tabindex="0" loading="lazy"><figcaption>image-20200326162720918</figcaption></figure><h2 id="_3-解决prefetch提前加载导致问题" tabindex="-1"><a class="header-anchor" href="#_3-解决prefetch提前加载导致问题" aria-hidden="true">#</a> 3. 解决prefetch提前加载导致问题</h2><p>实际在浏览器里访问首页的时候也加载了其他chunk的块，是prefetch 提前加载的原因。理论上这个是不影响加载速度的，但是我实际测试还是会影响。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20200326163849626.png" alt="image-20200326163849626" tabindex="0" loading="lazy"><figcaption>image-20200326163849626</figcaption></figure><p>这里请求了1016个请求</p><h3 id="_3-1-通过在vue-config-js里添加以下配置prefetch" tabindex="-1"><a class="header-anchor" href="#_3-1-通过在vue-config-js里添加以下配置prefetch" aria-hidden="true">#</a> 3.1 通过在vue.config.js里添加以下配置Prefetch</h3><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// vue.config.js</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">chainWebpack</span><span class="token operator">:</span> <span class="token parameter">config</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 移除 prefetch 插件</span>
    config<span class="token punctuation">.</span>plugins<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token string">&#39;prefetch&#39;</span><span class="token punctuation">)</span>

    <span class="token comment">// 或者</span>
    <span class="token comment">// 修改它的选项：</span>
    config<span class="token punctuation">.</span><span class="token function">plugin</span><span class="token punctuation">(</span><span class="token string">&#39;prefetch&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">tap</span><span class="token punctuation">(</span><span class="token parameter">options</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      options<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>fileBlacklist <span class="token operator">=</span> options<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>fileBlacklist <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
      options<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>fileBlacklist<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">myasyncRoute(.)+?\\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span>
      <span class="token keyword">return</span> options
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>`,21),u={href:"https://www.jianshu.com/p/45fe75d059e2",target:"_blank",rel:"noopener noreferrer"};function k(d,m){const s=l("ExternalLinkIcon");return p(),t("div",null,[i,n("p",null,[n("a",u,[e("vue路由懒加载，vue首屏加载慢和使用懒加载prefetch问题，新增组件懒加载"),o(s)])])])}const v=a(r,[["render",k],["__file","fe-vue-route-lazy-loading.html.vue"]]);export{v as default};
