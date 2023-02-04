import{ab as t,G as o,H as p,E as n,S as s,N as e,ac as c,W as i}from"./framework-11534bf9.js";const l={},u=n("h1",{id:"vue插件",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#vue插件","aria-hidden":"true"},"#"),s(" Vue插件")],-1),r=n("h2",{id:"_1-简介",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#_1-简介","aria-hidden":"true"},"#"),s(" 1. 简介")],-1),d=n("p",null,[s("Vue 插件主要用来添加"),n("strong",null,"全局功能"),s("，功能指的是什么？只是一个全局方法吗？肯定不是。")],-1),v={href:"https://github.com/karol-f/vue-custom-element",target:"_blank",rel:"noopener noreferrer"},k={href:"https://github.com/vuejs/vue-touch",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/vuejs/vue-router",target:"_blank",rel:"noopener noreferrer"},b=n("li",null,[s("添加 Vue 实例方法，通过把它们添加到 "),n("code",null,"Vue.prototype"),s(" 上实现。")],-1),h={href:"https://github.com/vuejs/vue-router",target:"_blank",rel:"noopener noreferrer"},_=c(`<h2 id="_2-使用插件" tabindex="-1"><a class="header-anchor" href="#_2-使用插件" aria-hidden="true">#</a> 2. 使用插件</h2><p>通过全局方法 <code>Vue.use()</code> 使用插件。它需要在你调用 <code>new Vue()</code> 启动应用之前完成：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 调用 \`MyPlugin.install(Vue)\`</span>
Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>MyPlugin<span class="token punctuation">)</span>

<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// ...组件选项</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以传入一个可选的选项对象：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>MyPlugin<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">someOption</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>Vue.use</code> 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。</p><h2 id="_3-开发插件" tabindex="-1"><a class="header-anchor" href="#_3-开发插件" aria-hidden="true">#</a> 3. 开发插件</h2><p>Vue.js 的插件应该暴露一个 <code>install</code> 方法。这个方法的第一个参数是 <code>Vue</code> 构造器，第二个参数是一个可选的选项对象：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>MyPlugin<span class="token punctuation">.</span><span class="token function-variable function">install</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">Vue<span class="token punctuation">,</span> options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 1. 添加全局方法或 property</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">myGlobalMethod</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 逻辑...</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 2. 添加全局资源</span>
  Vue<span class="token punctuation">.</span><span class="token function">directive</span><span class="token punctuation">(</span><span class="token string">&#39;my-directive&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">bind</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> binding<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> oldVnode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逻辑...</span>
    <span class="token punctuation">}</span>
    <span class="token operator">...</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// 3. 注入组件选项</span>
  Vue<span class="token punctuation">.</span><span class="token function">mixin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token function-variable function">created</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 逻辑...</span>
    <span class="token punctuation">}</span>
    <span class="token operator">...</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// 4. 添加实例方法</span>
  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">$myMethod</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">methodOptions</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 逻辑...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9);function f(g,V){const a=i("ExternalLinkIcon");return o(),p("div",null,[u,r,d,n("ol",null,[n("li",null,[s("添加全局方法或者 property。如："),n("a",v,[s("vue-custom-element"),e(a)])]),n("li",null,[s("添加全局资源：指令/过滤器/过渡等。如 "),n("a",k,[s("vue-touch"),e(a)])]),n("li",null,[s("通过全局混入来添加一些组件选项。如 "),n("a",m,[s("vue-router"),e(a)])]),b,n("li",null,[s("一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 "),n("a",h,[s("vue-router"),e(a)])])]),_])}const x=t(l,[["render",f],["__file","vue-plugin.html.vue"]]);export{x as default};
