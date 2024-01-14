import{_ as e,c as p,o as t,U as a}from"./chunks/framework.y0HOe2qR.js";const m=JSON.parse('{"title":"3.15 TCP Keepalive 和 HTTP Keep-Alive 是一个东西吗？","description":"","frontmatter":{},"headers":[],"relativePath":"datacom/network/3_tcp/3.15.tcp_http_keepalive.md","filePath":"datacom/network/3_tcp/3.15.tcp_http_keepalive.md","lastUpdated":1705029886000}'),i={name:"datacom/network/3_tcp/3.15.tcp_http_keepalive.md"},s=a('<h1 id="_3-15-tcp-keepalive-和-http-keep-alive-是一个东西吗" tabindex="-1">3.15 TCP Keepalive 和 HTTP Keep-Alive 是一个东西吗？ <a class="header-anchor" href="#_3-15-tcp-keepalive-和-http-keep-alive-是一个东西吗" aria-label="Permalink to &quot;3.15 TCP Keepalive 和 HTTP Keep-Alive 是一个东西吗？&quot;">​</a></h1><p>大家好，我是小林。</p><p>之前有读者问了我这么个问题：</p><p><img src="https://img-blog.csdnimg.cn/20210715090027883.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0ODI3Njc0,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述"></p><p>大致问题是，<strong>TCP 的 Keepalive 和 HTTP 的 Keep-Alive 是一个东西吗？</strong></p><p>这是个好问题，应该有不少人都会搞混，因为这两个东西看上去太像了，很容易误以为是同一个东西。</p><p>事实上，<strong>这两个完全是两样不同东西</strong>，实现的层面也不同：</p><ul><li>HTTP 的 Keep-Alive，是由<strong>应用层（用户态）</strong> 实现的，称为 HTTP 长连接；</li><li>TCP 的 Keepalive，是由 <strong>TCP 层（内核态）</strong> 实现的，称为 TCP 保活机制；</li></ul><p>接下来，分别说说它们。</p><h2 id="http-的-keep-alive" tabindex="-1">HTTP 的 Keep-Alive <a class="header-anchor" href="#http-的-keep-alive" aria-label="Permalink to &quot;HTTP 的 Keep-Alive&quot;">​</a></h2><p>HTTP 协议采用的是「请求-应答」的模式，也就是客户端发起了请求，服务端才会返回响应，一来一回这样子。</p><p><img src="https://img-blog.csdnimg.cn/img_convert/6c062074058f40ae65ed722e2d082a90.png" alt="请求-应答"></p><p>由于 HTTP 是基于 TCP 传输协议实现的，客户端与服务端要进行 HTTP 通信前，需要先建立 TCP 连接，然后客户端发送 HTTP 请求，服务端收到后就返回响应，至此「请求-应答」的模式就完成了，随后就会释放 TCP 连接。</p><p><img src="https://img-blog.csdnimg.cn/img_convert/9acbaebbbe07cc870858a350052d9c87.png" alt="一个 HTTP 请求"></p><p>如果每次请求都要经历这样的过程：建立 TCP -&gt; 请求资源 -&gt; 响应资源 -&gt; 释放连接，那么此方式就是 <strong>HTTP 短连接</strong>，如下图：</p><p><img src="https://img-blog.csdnimg.cn/img_convert/d6f6757c02e3afbf113d1048c937f8ee.png" alt="HTTP 短连接"></p><p>这样实在太累人了，一次连接只能请求一次资源。</p><p>能不能在第一个 HTTP 请求完后，先不断开 TCP 连接，让后续的 HTTP 请求继续使用此连接？</p><p>当然可以，HTTP 的 Keep-Alive 就是实现了这个功能，可以使用同一个 TCP 连接来发送和接收多个 HTTP 请求/应答，避免了连接建立和释放的开销，这个方法称为 <strong>HTTP 长连接</strong>。</p><p><img src="https://img-blog.csdnimg.cn/img_convert/d2b20d1cc03936332adb2a68512eb167.png" alt="HTTP 长连接"></p><p>HTTP 长连接的特点是，只要任意一端没有明确提出断开连接，则保持 TCP 连接状态。</p><p>怎么才能使用 HTTP 的 Keep-Alive 功能？</p><p>在 HTTP 1.0 中默认是关闭的，如果浏览器要开启 Keep-Alive，它必须在请求的包头中添加：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Connection: Keep-Alive</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>然后当服务器收到请求，作出回应的时候，它也添加一个头在响应中：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Connection: Keep-Alive</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这样做，连接就不会中断，而是保持连接。当客户端发送另一个请求时，它会使用同一个连接。这一直继续到客户端或服务器端提出断开连接。</p><p><strong>从 HTTP 1.1 开始， 就默认是开启了 Keep-Alive</strong>，如果要关闭 Keep-Alive，需要在 HTTP 请求的包头里添加：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Connection:close</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>现在大多数浏览器都默认是使用 HTTP/1.1，所以 Keep-Alive 都是默认打开的。一旦客户端和服务端达成协议，那么长连接就建立好了。</p><p>HTTP 长连接不仅仅减少了 TCP 连接资源的开销，而且这给 <strong>HTTP 流水线</strong>技术提供了可实现的基础。</p><p>所谓的 HTTP 流水线，是<strong>客户端可以先一次性发送多个请求，而在发送过程中不需先等待服务器的回应</strong>，可以减少整体的响应时间。</p><p>举例来说，客户端需要请求两个资源。以前的做法是，在同一个 TCP 连接里面，先发送 A 请求，然后等待服务器做出回应，收到后再发出 B 请求。HTTP 流水线机制则允许客户端同时发出 A 请求和 B 请求。</p><p><img src="https://img-blog.csdnimg.cn/img_convert/b3fa409edd8aa1dea830af2a69fc8a31.png" alt="右边为 HTTP 流水线机制"></p><p>但是<strong>服务器还是按照顺序响应</strong>，先回应 A 请求，完成后再回应 B 请求。</p><p>而且要等服务器响应完客户端第一批发送的请求后，客户端才能发出下一批的请求，也就说如果服务器响应的过程发生了阻塞，那么客户端就无法发出下一批的请求，此时就造成了「队头阻塞」的问题。</p><p>可能有的同学会问，如果使用了 HTTP 长连接，如果客户端完成一个 HTTP 请求后，就不再发起新的请求，此时这个 TCP 连接一直占用着不是挺浪费资源的吗？</p><p>对没错，所以为了避免资源浪费的情况，web 服务软件一般都会提供 <code>keepalive_timeout</code> 参数，用来指定 HTTP 长连接的超时时间。</p><p>比如设置了 HTTP 长连接的超时时间是 60 秒，web 服务软件就会<strong>启动一个定时器</strong>，如果客户端在完后一个 HTTP 请求后，在 60 秒内都没有再发起新的请求，<strong>定时器的时间一到，就会触发回调函数来释放该连接。</strong></p><p><img src="https://img-blog.csdnimg.cn/img_convert/7e995ecb2e42941342f97256707496c9.png" alt="HTTP 长连接超时"></p><h2 id="tcp-的-keepalive" tabindex="-1">TCP 的 Keepalive <a class="header-anchor" href="#tcp-的-keepalive" aria-label="Permalink to &quot;TCP 的 Keepalive&quot;">​</a></h2><p>TCP 的 Keepalive 这东西其实就是 <strong>TCP 的保活机制</strong>，它的工作原理我之前的文章写过，这里就直接贴下以前的内容。</p><p>如果两端的 TCP 连接一直没有数据交互，达到了触发 TCP 保活机制的条件，那么内核里的 TCP 协议栈就会发送探测报文。</p><ul><li>如果对端程序是正常工作的。当 TCP 保活的探测报文发送给对端, 对端会正常响应，这样 <strong>TCP 保活时间会被重置</strong>，等待下一个 TCP 保活时间的到来。</li><li>如果对端主机宕机（<em>注意不是进程崩溃，进程崩溃后操作系统在回收进程资源的时候，会发送 FIN 报文，而主机宕机则是无法感知的，所以需要 TCP 保活机制来探测对方是不是发生了主机宕机</em>），或对端由于其他原因导致报文不可达。当 TCP 保活的探测报文发送给对端后，石沉大海，没有响应，连续几次，达到保活探测次数后，<strong>TCP 会报告该 TCP 连接已经死亡</strong>。</li></ul><p>所以，TCP 保活机制可以在双方没有数据交互的情况，通过探测报文，来确定对方的 TCP 连接是否存活，这个工作是在内核完成的。</p><p><img src="https://img-blog.csdnimg.cn/img_convert/87e138ae9f2438c8f4e2c9c46ec40b95.png" alt="TCP 保活机制"></p><p>注意，应用程序若想使用 TCP 保活机制需要通过 socket 接口设置 <code>SO_KEEPALIVE</code> 选项才能够生效，如果没有设置，那么就无法使用 TCP 保活机制。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>HTTP 的 Keep-Alive 也叫 HTTP 长连接，该功能是由「应用程序」实现的，可以使得用同一个 TCP 连接来发送和接收多个 HTTP 请求/应答，减少了 HTTP 短连接带来的多次 TCP 连接建立和释放的开销。</p><p>TCP 的 Keepalive 也叫 TCP 保活机制，该功能是由「内核」实现的，当客户端和服务端长达一定时间没有进行数据交互时，内核为了确保该连接是否还有效，就会发送探测报文，来检测对方是否还在线，然后来决定是否要关闭该连接。</p><hr><p>最新的图解文章都在公众号首发，别忘记关注哦！！如果你想加入百人技术交流群，扫码下方二维码回复「加群」。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/%E5%85%B6%E4%BB%96/%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BB%8B%E7%BB%8D.png" alt=""></p>',53),n=[s];function l(o,c,T,r,g,d){return t(),p("div",null,n)}const h=e(i,[["render",l]]);export{m as __pageData,h as default};