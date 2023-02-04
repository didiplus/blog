import{ab as a,G as e,H as t,E as n,S as p,N as o,ac as c,W as i}from"./framework-11534bf9.js";const l={},u=c(`<h1 id="前后端分离项目跨域解决" tabindex="-1"><a class="header-anchor" href="#前后端分离项目跨域解决" aria-hidden="true">#</a> 前后端分离项目跨域解决</h1><h2 id="_1-什么是跨域" tabindex="-1"><a class="header-anchor" href="#_1-什么是跨域" aria-hidden="true">#</a> 1. 什么是跨域</h2><blockquote><p><strong>跨域</strong>是指 不同域名之间相互访问。即浏览器控制当前网页下不能执行其他网站的脚本，这是由浏览器的同源策略造成的，是浏览器对JavaScript施加的安全限制。</p></blockquote><p>也就是如果在A网站中，我们希望使用Ajax来获得B网站中的特定内容 如果A网站与B网站不在同一个域中，那么就出现了跨域访问问题。</p><p><strong>跨域的安全限制都是对浏览器端来说的，服务器端是不存在跨域安全限制的。</strong></p><h2 id="_2-同源策略" tabindex="-1"><a class="header-anchor" href="#_2-同源策略" aria-hidden="true">#</a> 2. 同源策略</h2><p>同源策略/SOP（Same origin policy）是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指&quot;协议+域名+端口&quot;三者相同，即便两个不同的域名指向同一个ip地址，也非同源。 前端发起的请求只要不符合同源策略就会出现跨域问题。</p><p><strong>案例分析</strong></p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/image-20211017111604402.png" alt="image-20211017111604402" tabindex="0" loading="lazy"><figcaption>image-20211017111604402</figcaption></figure><h2 id="_3-为什么前后端分离后会导致跨域问题" tabindex="-1"><a class="header-anchor" href="#_3-为什么前后端分离后会导致跨域问题" aria-hidden="true">#</a> 3. 为什么前后端分离后会导致跨域问题？</h2><p>前后端分离后，前端代码和后端代码都是独立部署的，一般前端采用Nginx作为web服务器部署，后端spring boot由于内置了tomcat，一般都是通过jar包直接启动。</p><ul><li>假设前后端部署在同一台服务器上，那么2者访问的端口必定不一致，不符合同源策略，所以出现跨域问题。</li><li>如果前后端部署在不同服务器上，那么访问的ip或者域名必然不一致，也会出现跨域问题。</li></ul><h2 id="_4-解决" tabindex="-1"><a class="header-anchor" href="#_4-解决" aria-hidden="true">#</a> 4. 解决</h2><h3 id="_4-1-利用nginx解决跨域" tabindex="-1"><a class="header-anchor" href="#_4-1-利用nginx解决跨域" aria-hidden="true">#</a> 4.1 利用Nginx解决跨域</h3><p>通过反向代理服务器监听同端口，同域名的访问，不同路径映射到不同的地址，比如，在nginx服务器中，监听同一个域名和端口，不同路径转发到客户端和服务器，把不同端口和域名的限制通过反向代理，来解决跨域的问题。</p><p>通过Nginx反向代理，将跨域请求转变为非跨域请求，不同请求路径代理到不同的地址：</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code>    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>          <span class="token number">80</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server_name</span>     www.mysite.com</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token comment">#allow all;</span>
            <span class="token directive"><span class="token keyword">root</span>   /mysite/my-web/</span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">index</span>  index.html index.htm</span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">try_files</span> <span class="token variable">$uri</span> <span class="token variable">$uri</span>/ /index.html</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token directive"><span class="token keyword">location</span> /prod-api/</span> <span class="token punctuation">{</span>
            <span class="token comment">#allow all;</span>
            <span class="token directive"><span class="token keyword">rewrite</span>  ^/prod-api/(.*)$ /<span class="token variable">$1</span> break</span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:9602</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-服务端不设置跨域" tabindex="-1"><a class="header-anchor" href="#_4-2-服务端不设置跨域" aria-hidden="true">#</a> 4.2 服务端不设置跨域</h3><p>违法了跨域原则，不安全。但是非常好用，快速解决</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Bean</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Configuration</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>cors<span class="token punctuation">.</span></span><span class="token class-name">CorsConfiguration</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>cors<span class="token punctuation">.</span></span><span class="token class-name">UrlBasedCorsConfigurationSource</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>filter<span class="token punctuation">.</span></span><span class="token class-name">CorsFilter</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Arrays</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CorsConfig</span> <span class="token punctuation">{</span>


    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">CorsFilter</span> <span class="token function">corsFilter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">final</span> <span class="token class-name">UrlBasedCorsConfigurationSource</span> source <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">UrlBasedCorsConfigurationSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">final</span> <span class="token class-name">CorsConfiguration</span> config <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CorsConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        config<span class="token punctuation">.</span><span class="token function">setAllowCredentials</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// SpringBoot 2.4.0后 此方法已失效</span>
<span class="token comment">//        config.setAllowedOrigins(Arrays.asList(&quot;*&quot;)); //http:www.a.com</span>
        <span class="token comment">// 新版本的springboot 采用此方法</span>
        config<span class="token punctuation">.</span><span class="token function">setAllowedOriginPatterns</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        config<span class="token punctuation">.</span><span class="token function">setAllowedHeaders</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        config<span class="token punctuation">.</span><span class="token function">setAllowedMethods</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        config<span class="token punctuation">.</span><span class="token function">setMaxAge</span><span class="token punctuation">(</span><span class="token number">300L</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        source<span class="token punctuation">.</span><span class="token function">registerCorsConfiguration</span><span class="token punctuation">(</span><span class="token string">&quot;/**&quot;</span><span class="token punctuation">,</span> config<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CorsFilter</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>`,21),r={href:"https://blog.csdn.net/w1014074794/article/details/106226429",target:"_blank",rel:"noopener noreferrer"};function d(k,m){const s=i("ExternalLinkIcon");return e(),t("div",null,[u,n("p",null,[n("a",r,[p("Spring boot前后端分离后，跨域问题怎么解决？"),o(s)])])])}const b=a(l,[["render",d],["__file","fe-lib-cross-domain.html.vue"]]);export{b as default};
