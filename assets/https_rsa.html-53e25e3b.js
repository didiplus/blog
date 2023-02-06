import{ab as o,G as r,H as l,E as a,S as i,N as n,ad as t,W as g}from"./framework-b31a425c.js";const p={},s=a("h1",{id:"_3-3-https-rsa-握手解析",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#_3-3-https-rsa-握手解析","aria-hidden":"true"},"#"),i(" 3.3 HTTPS RSA 握手解析")],-1),c=a("p",null,"我前面讲，简单给大家介绍了的 HTTPS 握手过程，但是还不够细！",-1),d=a("p",null,[i("只讲了比较基础的部分，所以这次我们再来深入一下 HTTPS，用"),a("strong",null,"实战抓包"),i("的方式，带大家再来窥探一次 HTTPS。")],-1),h=a("figure",null,[a("img",{src:"https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/https提纲.png",alt:"",tabindex:"0",loading:"lazy"}),a("figcaption")],-1),m={href:"https://mp.weixin.qq.com/s/bUy220-ect00N4gnO0697A",target:"_blank",rel:"noopener noreferrer"},f=t('<hr><h2 id="tls-握手过程" tabindex="-1"><a class="header-anchor" href="#tls-握手过程" aria-hidden="true">#</a> TLS 握手过程</h2><p>HTTP 由于是明文传输，所谓的明文，就是说客户端与服务端通信的信息都是肉眼可见的，随意使用一个抓包工具都可以截获通信的内容。</p><p>所以安全上存在以下三个风险：</p><ul><li><em>窃听风险</em>，比如通信链路上可以获取通信内容，用户号容易没。</li><li><em>篡改风险</em>，比如强制植入垃圾广告，视觉污染，用户眼容易瞎。</li><li><em>冒充风险</em>，比如冒充淘宝网站，用户钱容易没。</li></ul><p>HTTP<strong>S</strong> 在 HTTP 与 TCP 层之间加入了 TLS 协议，来解决上述的风险。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/HTTP/19-HTTPS与HTTP.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>TLS 协议是如何解决 HTTP 的风险的呢？</p><ul><li><em>信息加密</em>： HTTP 交互信息是被加密的，第三方就无法被窃取；</li><li><em>校验机制</em>：校验信息传输过程中是否有被第三方篡改过，如果被篡改过，则会有警告提示；</li><li><em>身份证书</em>：证明淘宝是真的淘宝网；</li></ul><p>可见，有了 TLS 协议，能保证 HTTP 通信是安全的了，那么在进行 HTTP 通信前，需要先进行 TLS 握手。TLS 的握手过程，如下图：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/tls握手.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上图简要概述了 TLS 的握手过程，其中每一个「框」都是一个记录（<em>record</em>），记录是 TLS 收发数据的基本单位，类似于 TCP 里的 segment。多个记录可以组合成一个 TCP 包发送，所以<strong>通常经过「四个消息」就可以完成 TLS 握手，也就是需要 2个 RTT 的时延</strong>，然后就可以在安全的通信环境里发送 HTTP 报文，实现 HTTPS 协议。</p><p>所以可以发现，HTTPS 是应用层协议，需要先完成 TCP 连接建立，然后走 TLS 握手过程后，才能建立通信安全的连接。</p><p>事实上，不同的密钥交换算法，TLS 的握手过程可能会有一些区别。</p><p>这里先简单介绍下密钥交换算法，因为考虑到性能的问题，所以双方在加密应用信息时使用的是对称加密密钥，而对称加密密钥是不能被泄漏的，为了保证对称加密密钥的安全性，所以使用非对称加密的方式来保护对称加密密钥的协商，这个工作就是密钥交换算法负责的。</p><p>接下来，我们就以最简单的 <code>RSA</code> 密钥交换算法，来看看它的 TLS 握手过程。</p><hr><h2 id="rsa-握手过程" tabindex="-1"><a class="header-anchor" href="#rsa-握手过程" aria-hidden="true">#</a> RSA 握手过程</h2><p>传统的 TLS 握手基本都是使用 RSA 算法来实现密钥交换的，在将 TLS 证书部署服务端时，证书文件其实就是服务端的公钥，会在 TLS 握手阶段传递给客户端，而服务端的私钥则一直留在服务端，一定要确保私钥不能被窃取。</p><p>在 RSA 密钥协商算法中，客户端会生成随机密钥，并使用服务端的公钥加密后再传给服务端。根据非对称加密算法，公钥加密的消息仅能通过私钥解密，这样服务端解密后，双方就得到了相同的密钥，再用它加密应用消息。</p><p>我用 Wireshark 工具抓了用 RSA 密钥交换的 TLS 握手过程，你可以从下面看到，一共经历了四次握手：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/tls四次握手.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>对应 Wireshark 的抓包，我也画了一幅图，你可以从下图很清晰地看到该过程：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/https_rsa.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>那么，接下来针对每一个 TLS 握手做进一步的介绍。</p><h3 id="tls-第一次握手" tabindex="-1"><a class="header-anchor" href="#tls-第一次握手" aria-hidden="true">#</a> TLS 第一次握手</h3><p>客户端首先会发一个「<strong>Client Hello</strong>」消息，字面意思我们也能理解到，这是跟服务器「打招呼」。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/clienthello.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>消息里面有客户端使用的 TLS 版本号、支持的密码套件列表，以及生成的<strong>随机数（<em>Client Random</em>）</strong>，这个随机数会被服务端保留，它是生成对称加密密钥的材料之一。</p><h3 id="tls-第二次握手" tabindex="-1"><a class="header-anchor" href="#tls-第二次握手" aria-hidden="true">#</a> TLS 第二次握手</h3><p>当服务端收到客户端的「Client Hello」消息后，会确认 TLS 版本号是否支持，和从密码套件列表中选择一个密码套件，以及生成<strong>随机数（<em>Server Random</em>）</strong>。</p><p>接着，返回「<strong>Server Hello</strong>」消息，消息里面有服务器确认的 TLS 版本号，也给出了随机数（Server Random），然后从客户端的密码套件列表选择了一个合适的密码套件。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/serverhello.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以看到，服务端选择的密码套件是 “Cipher Suite: TLS_RSA_WITH_AES_128_GCM_SHA256”。</p><p>这个密码套件看起来真让人头晕，好一大串，但是其实它是有固定格式和规范的。基本的形式是「<strong>密钥交换算法 + 签名算法 + 对称加密算法 + 摘要算法</strong>」， 一般 WITH 单词前面有两个单词，第一个单词是约定密钥交换的算法，第二个单词是约定证书的验证算法。比如刚才的密码套件的意思就是：</p><ul><li>由于 WITH 单词只有一个 RSA，则说明握手时密钥交换算法和签名算法都是使用 RSA；</li><li>握手后的通信使用 AES 对称算法，密钥长度 128 位，分组模式是 GCM；</li><li>摘要算法 SHA256 用于消息认证和产生随机数；</li></ul><p>就前面这两个客户端和服务端相互「打招呼」的过程，客户端和服务端就已确认了 TLS 版本和使用的密码套件，而且你可能发现客户端和服务端都会各自生成一个随机数，并且还会把随机数传递给对方。</p><p>那这个随机数有啥用呢？其实这两个随机数是后续作为生成「会话密钥」的条件，所谓的会话密钥就是数据传输时，所使用的对称加密密钥。</p><p>然后，服务端为了证明自己的身份，会发送「<strong>Server Certificate</strong>」给客户端，这个消息里含有数字证书。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/certificate.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>随后，服务端发了「<strong>Server Hello Done</strong>」消息，目的是告诉客户端，我已经把该给你的东西都给你了，本次打招呼完毕。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/serverhellodone.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="客户端验证证书" tabindex="-1"><a class="header-anchor" href="#客户端验证证书" aria-hidden="true">#</a> 客户端验证证书</h3><p>在这里刹个车，客户端拿到了服务端的数字证书后，要怎么校验该数字证书是真实有效的呢？</p><h4 id="数字证书和-ca-机构" tabindex="-1"><a class="header-anchor" href="#数字证书和-ca-机构" aria-hidden="true">#</a> 数字证书和 CA 机构</h4><p>在说校验数字证书是否可信的过程前，我们先来看看数字证书是什么，一个数字证书通常包含了：</p><ul><li>公钥；</li><li>持有者信息；</li><li>证书认证机构（CA）的信息；</li><li>CA 对这份文件的数字签名及使用的算法；</li><li>证书有效期；</li><li>还有一些其他额外信息；</li></ul><p>那数字证书的作用，是用来认证公钥持有者的身份，以防止第三方进行冒充。说简单些，证书就是用来告诉客户端，该服务端是否是合法的，因为只有证书合法，才代表服务端身份是可信的。</p><p>我们用证书来认证公钥持有者的身份（服务端的身份），那证书又是怎么来的？又该怎么认证证书呢？</p><p>为了让服务端的公钥被大家信任，服务端的证书都是由 CA （<em>Certificate Authority</em>，证书认证机构）签名的，CA 就是网络世界里的公安局、公证中心，具有极高的可信度，所以由它来给各个公钥签名，信任的一方签发的证书，那必然证书也是被信任的。</p><p>之所以要签名，是因为签名的作用可以避免中间人在获取证书时对证书内容的篡改。</p><h4 id="数字证书签发和验证流程" tabindex="-1"><a class="header-anchor" href="#数字证书签发和验证流程" aria-hidden="true">#</a> 数字证书签发和验证流程</h4><p>如下图图所示，为数字证书签发和验证流程：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/证书的校验.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>CA 签发证书的过程，如上图左边部分：</p><ul><li>首先 CA 会把持有者的公钥、用途、颁发者、有效时间等信息打成一个包，然后对这些信息进行 Hash 计算，得到一个 Hash 值；</li><li>然后 CA 会使用自己的私钥将该 Hash 值加密，生成 Certificate Signature，也就是 CA 对证书做了签名；</li><li>最后将 Certificate Signature 添加在文件证书上，形成数字证书；</li></ul><p>客户端校验服务端的数字证书的过程，如上图右边部分：</p><ul><li>首先客户端会使用同样的 Hash 算法获取该证书的 Hash 值 H1；</li><li>通常浏览器和操作系统中集成了 CA 的公钥信息，浏览器收到证书后可以使用 CA 的公钥解密 Certificate Signature 内容，得到一个 Hash 值 H2 ；</li><li>最后比较 H1 和 H2，如果值相同，则为可信赖的证书，否则则认为证书不可信。</li></ul><h4 id="证书链" tabindex="-1"><a class="header-anchor" href="#证书链" aria-hidden="true">#</a> 证书链</h4><p>但事实上，证书的验证过程中还存在一个证书信任链的问题，因为我们向 CA 申请的证书一般不是根证书签发的，而是由中间证书签发的，比如百度的证书，从下图你可以看到，证书的层级有三级：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/baidu证书.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>对于这种三级层级关系的证书的验证过程如下：</p>',62),u={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},S={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},T={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},x=a("li",null,"请求到证书后发现 “GlobalSign Organization Validation CA - SHA256 - G2” 证书是由 “GlobalSign Root CA” 签发的，由于 “GlobalSign Root CA” 没有再上级签发机构，说明它是根证书，也就是自签证书。应用软件会检查此证书有否已预载于根证书清单上，如果有，则可以利用根证书中的公钥去验证 “GlobalSign Organization Validation CA - SHA256 - G2” 证书，如果发现验证通过，就认为该中间证书是可信的。",-1),b={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},H={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},_={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},C={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},A={href:"http://baidu.com",target:"_blank",rel:"noopener noreferrer"},L=t('<figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/用户信任.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>操作系统里一般都会内置一些根证书，比如我的 MAC 电脑里内置的根证书有这么多：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/系统根证书.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这样的一层层地验证就构成了一条信任链路，整个证书信任链验证流程如下图所示：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/证书链.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>最后一个问题，为什么需要证书链这么麻烦的流程？Root CA 为什么不直接颁发证书，而是要搞那么多中间层级呢？</p><p>这是为了确保根证书的绝对安全性，将根证书隔离地越严格越好，不然根证书如果失守了，那么整个信任链都会有问题。</p><h3 id="tls-第三次握手" tabindex="-1"><a class="header-anchor" href="#tls-第三次握手" aria-hidden="true">#</a> TLS 第三次握手</h3><p>客户端验证完证书后，认为可信则继续往下走。</p><p>接着，客户端就会生成一个新的<strong>随机数 (<em>pre-master</em>)</strong>，用服务器的 RSA 公钥加密该随机数，通过「<strong>Client Key Exchange</strong>」消息传给服务端。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/clietnkeyexchange.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>服务端收到后，用 RSA 私钥解密，得到客户端发来的随机数 (pre-master)。</p><p>至此，<strong>客户端和服务端双方都共享了三个随机数，分别是 Client Random、Server Random、pre-master</strong>。</p><p>于是，双方根据已经得到的三个随机数，生成<strong>会话密钥（Master Secret）</strong>，它是对称密钥，用于对后续的 HTTP 请求/响应的数据加解密。</p><p>生成完「会话密钥」后，然后客户端发一个「<strong>Change Cipher Spec</strong>」，告诉服务端开始使用加密方式发送消息。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/cipherspecmessage.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后，客户端再发一个「<strong>Encrypted Handshake Message（Finishd）</strong>」消息，把之前所有发送的数据做个<strong>摘要</strong>，再用会话密钥（master secret）加密一下，让服务器做个验证，验证加密通信「是否可用」和「之前握手信息是否有被中途篡改过」。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/https/encryptd.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以发现，「Change Cipher Spec」之前传输的 TLS 握手数据都是明文，之后都是对称密钥加密的密文。</p><h3 id="tls-第四次握手" tabindex="-1"><a class="header-anchor" href="#tls-第四次握手" aria-hidden="true">#</a> TLS 第四次握手</h3><p>服务器也是同样的操作，发「<strong>Change Cipher Spec</strong>」和「<strong>Encrypted Handshake Message</strong>」消息，如果双方都验证加密和解密没问题，那么握手正式完成。</p><p>最后，就用「会话密钥」加解密 HTTP 请求和响应了。</p><hr><h2 id="rsa-算法的缺陷" tabindex="-1"><a class="header-anchor" href="#rsa-算法的缺陷" aria-hidden="true">#</a> RSA 算法的缺陷</h2><p><strong>使用 RSA 密钥协商算法的最大问题是不支持前向保密</strong>。</p><p>因为客户端传递随机数（用于生成对称加密密钥的条件之一）给服务端时使用的是公钥加密的，服务端收到后，会用私钥解密得到随机数。所以一旦服务端的私钥泄漏了，过去被第三方截获的所有 TLS 通讯密文都会被破解。</p><p>为了解决这个问题，后面就出现了 ECDHE 密钥协商算法，我们现在大多数网站使用的正是 ECDHE 密钥协商算法，关于 ECDHE 握手的过程，将在下一篇揭晓。</p><hr><p>哈喽，我是小林，就爱图解计算机基础，如果文章对你有帮助，别忘记关注哦！</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/其他/公众号介绍.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',30);function y(z,G){const e=g("ExternalLinkIcon");return r(),l("div",null,[s,c,d,h,a("p",null,[i("对于还不知道对称加密和非对称加密的同学，你先复习我以前的这篇文章"),a("a",m,[i("「硬核！30 张图解 HTTP 常见的面试题」，"),n(e)]),i("本篇文章默认大家已经具备了这些知识。")]),f,a("ul",null,[a("li",null,[i("客户端收到 "),a("a",u,[i("baidu.com"),n(e)]),i(" 的证书后，发现这个证书的签发者不是根证书，就无法根据本地已有的根证书中的公钥去验证 "),a("a",S,[i("baidu.com"),n(e)]),i(" 证书是否可信。于是，客户端根据 "),a("a",T,[i("baidu.com"),n(e)]),i(" 证书中的签发者，找到该证书的颁发机构是 “GlobalSign Organization Validation CA - SHA256 - G2”，然后向 CA 请求该中间证书。")]),x,a("li",null,[i("“GlobalSign Organization Validation CA - SHA256 - G2” 证书被信任后，可以使用 “GlobalSign Organization Validation CA - SHA256 - G2” 证书中的公钥去验证 "),a("a",b,[i("baidu.com"),n(e)]),i(" 证书的可信性，如果验证通过，就可以信任 "),a("a",H,[i("baidu.com"),n(e)]),i(" 证书。")])]),a("p",null,[i("在这四个步骤中，最开始客户端只信任根证书 GlobalSign Root CA 证书的，然后 “GlobalSign Root CA” 证书信任 “GlobalSign Organization Validation CA - SHA256 - G2” 证书，而 “GlobalSign Organization Validation CA - SHA256 - G2” 证书又信任 "),a("a",_,[i("baidu.com"),n(e)]),i(" 证书，于是客户端也信任 "),a("a",C,[i("baidu.com"),n(e)]),i(" 证书。")]),a("p",null,[i("总括来说，由于用户信任 GlobalSign，所以由 GlobalSign 所担保的 "),a("a",A,[i("baidu.com"),n(e)]),i(" 可以被信任，另外由于用户信任操作系统或浏览器的软件商，所以由软件商预载了根证书的 GlobalSign 都可被信任。")]),L])}const R=o(p,[["render",y],["__file","https_rsa.html.vue"]]);export{R as default};
