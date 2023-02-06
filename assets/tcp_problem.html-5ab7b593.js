import{ab as i,G as a,H as p,ad as e}from"./framework-b31a425c.js";const t={},T=e('<h1 id="_4-16-tcp-协议有什么缺陷" tabindex="-1"><a class="header-anchor" href="#_4-16-tcp-协议有什么缺陷" aria-hidden="true">#</a> 4.16 TCP 协议有什么缺陷？</h1><p>大家好，我是小林。</p><p>写的多了后，忽然思考一个问题，TCP 通过序列号、确认应答、超时重传、流量控制、拥塞控制等方式实现了可靠传输，看起来它很完美，事实真的是这样吗？TCP 就没什么缺陷吗？</p><p>所以，今天就跟大家聊聊，TCP 协议有哪些缺陷？主要有四个方面：</p><ul><li>升级 TCP 的工作很困难；</li><li>TCP 建立连接的延迟；</li><li>TCP 存在队头阻塞问题；</li><li>网络迁移需要重新建立 TCP 连接；</li></ul><p>接下来，针对这四个方面详细说一下。</p><h2 id="升级-tcp-的工作很困难" tabindex="-1"><a class="header-anchor" href="#升级-tcp-的工作很困难" aria-hidden="true">#</a> 升级 TCP 的工作很困难</h2><p>TCP 协议是诞生在 1973 年，至今 TCP 协议依然还在实现更多的新特性。</p><p>但是 TCP 协议是在内核中实现的，应用程序只能使用不能修改，如果要想升级 TCP 协议，那么只能升级内核。</p><p>而升级内核这个工作是很麻烦的事情，麻烦的事情不是说升级内核这个操作很麻烦，而是由于内核升级涉及到底层软件和运行库的更新，我们的服务程序就需要回归测试是否兼容新的内核版本，所以服务器的内核升级也比较保守和缓慢。</p><p>很多 TCP 协议的新特性，都是需要客户端和服务端同时支持才能生效的，比如 TCP Fast Open 这个特性，虽然在2013 年就被提出了，但是 Windows 很多系统版本依然不支持它，这是因为 PC 端的系统升级滞后很严重，W indows Xp 现在还有大量用户在使用，尽管它已经存在快 20 年。</p><p>所以，即使 TCP 有比较好的特性更新，也很难快速推广，用户往往要几年或者十年才能体验到。</p><h2 id="tcp-建立连接的延迟" tabindex="-1"><a class="header-anchor" href="#tcp-建立连接的延迟" aria-hidden="true">#</a> TCP 建立连接的延迟</h2><p>基于 TCP 实现的应用协议，都是需要先建立三次握手才能进行数据传输，比如 HTTP 1.0/1.1、HTTP/2、HTTPS。</p><p>现在大多数网站都是使用 HTTPS 的，这意味着在 TCP 三次握手之后，还需要经过 TLS 四次握手后，才能进行 HTTP 数据的传输，这在一定程序上增加了数据传输的延迟。</p><p>TCP 三次握手和 TLS 握手延迟，如图：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/http3/TCP%2BTLS.gif" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>TCP 三次握手的延迟被 TCP Fast Open （快速打开）这个特性解决了，这个特性可以在「第二次建立连接」时减少 TCP 连接建立的时延。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/TCP-Wireshark/45.jpg" alt="常规 HTTP 请求 与 Fast  Open HTTP 请求" tabindex="0" loading="lazy"><figcaption>常规 HTTP 请求 与 Fast Open HTTP 请求</figcaption></figure><p>过程如下：</p><ul><li>在第一次建立连接的时候，服务端在第二次握手产生一个 <code>Cookie</code> （已加密）并通过 SYN、ACK 包一起发给客户端，于是客户端就会缓存这个 <code>Cookie</code>，所以第一次发起 HTTP Get 请求的时候，还是需要 2 个 RTT 的时延；</li><li>在下次请求的时候，客户端在 SYN 包带上 <code>Cookie</code> 发给服务端，就提前可以跳过三次握手的过程，因为 <code>Cookie</code> 中维护了一些信息，服务端可以从 <code>Cookie</code> 获取 TCP 相关的信息，这时发起的 HTTP GET 请求就只需要 1 个 RTT 的时延；</li></ul><p>TCP Fast Open 这个特性是不错，但是它需要服务端和客户端的操作系统同时支持才能体验到，而 TCP Fast Open 是在 2013 年提出的，所以市面上依然有很多老式的操作系统不支持，而升级操作系统是很麻烦的事情，因此 TCP Fast Open 很难被普及开来。</p><p>还有一点，针对 HTTPS 来说，TLS 是在应用层实现的握手，而 TCP 是在内核实现的握手，这两个握手过程是无法结合在一起的，总是得先完成 TCP 握手，才能进行 TLS 握手。</p><p>也正是 TCP 是在内核实现的，所以 TLS 是无法对 TCP 头部加密的，这意味着 TCP 的序列号都是明文传输，所以就存安全的问题。</p><p>一个典型的例子就是攻击者伪造一个的 RST 报文强制关闭一条 TCP 连接，而攻击成功的关键则是 TCP 字段里的序列号位于接收方的滑动窗口内，该报文就是合法的。</p><p>为此 TCP 也不得不进行三次握手来同步各自的序列号，而且初始化序列号时是采用随机的方式（不完全随机，而是随着时间流逝而线性增长，到了 2^32 尽头再回滚）来提升攻击者猜测序列号的难度，以增加安全性。</p><p>但是这种方式只能避免攻击者预测出合法的 RST 报文，而无法避免攻击者截获客户端的报文，然后中途伪造出合法 RST 报文的攻击的方式。</p><figure><img src="https://gw.alipayobjects.com/mdn/rms_1c90e8/afts/img/A*po6LQIBU7zIAAAAAAAAAAAAAARQnAQ" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>大胆想一下，如果 TCP 的序列号也能被加密，或许真的不需要三次握手了，客户端和服务端的初始序列号都从 0 开始，也就不用做同步序列号的工作了，但是要实现这个要改造整个协议栈，太过于麻烦，即使实现出来了，很多老的网络设备未必能兼容。</p><h2 id="tcp-存在队头阻塞问题" tabindex="-1"><a class="header-anchor" href="#tcp-存在队头阻塞问题" aria-hidden="true">#</a> TCP 存在队头阻塞问题</h2><p>TCP 是字节流协议，<strong>TCP 层必须保证收到的字节数据是完整且有序的</strong>，如果序列号较低的 TCP 段在网络传输中丢失了，即使序列号较高的 TCP 段已经被接收了，应用层也无法从内核中读取到这部分数据。如下图：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/http3/tcp队头阻塞.gif" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>图中发送方发送了很多个 packet，每个 packet 都有自己的序号，你可以认为是 TCP 的序列号，其中 <code>packet #3</code> 在网络中丢失了，即使 <code>packet #4-6</code> 被接收方收到后，由于内核中的 TCP 数据不是连续的，于是接收方的应用层就无法从内核中读取到，只有等到 <code>packet #3</code> 重传后，接收方的应用层才可以从内核中读取到数据。</p><p>这就是 TCP 队头阻塞问题，但这也不能怪 TCP ，因为只有这样做才能保证数据的有序性。</p><p>HTTP/2 多个请求是跑在一个 TCP 连接中的，那么当 TCP 丢包时，整个 TCP 都要等待重传，那么就会阻塞该 TCP 连接中的所有请求，所以 HTTP/2 队头阻塞问题就是因为 TCP 协议导致的。</p><figure><img src="https://pic2.zhimg.com/80/v2-2dd2a9fb8693489b9a0b24771c8a40a1_1440w.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="网络迁移需要重新建立-tcp-连接" tabindex="-1"><a class="header-anchor" href="#网络迁移需要重新建立-tcp-连接" aria-hidden="true">#</a> 网络迁移需要重新建立 TCP 连接</h2><p>基于 TCP 传输协议的 HTTP 协议，由于是通过四元组（源 IP、源端口、目的 IP、目的端口）确定一条 TCP 连接。</p><figure><img src="https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzEwLmpwZw?x-oss-process=image/format,png" alt="TCP 四元组" tabindex="0" loading="lazy"><figcaption>TCP 四元组</figcaption></figure><p>那么<strong>当移动设备的网络从 4G 切换到 WIFI 时，意味着 IP 地址变化了，那么就必须要断开连接，然后重新建立 TCP 连接</strong>。</p><p>而建立连接的过程包含 TCP 三次握手和 TLS 四次握手的时延，以及 TCP 慢启动的减速过程，给用户的感觉就是网络突然卡顿了一下，因此连接的迁移成本是很高的。</p><h2 id="结尾" tabindex="-1"><a class="header-anchor" href="#结尾" aria-hidden="true">#</a> 结尾</h2><p>我记得之前在群里看到，有位读者字节一面的时候被问到：「<strong>如何基于 UDP 协议实现可靠传输？</strong>」</p><p>很多同学第一反应就会说把 TCP 可靠传输的特性（序列号、确认应答、超时重传、流量控制、拥塞控制）在应用层实现一遍。</p><p>实现的思路确实这样没错，但是有没有想过，<strong>既然 TCP 天然支持可靠传输，为什么还需要基于 UDP 实现可靠传输呢？这不是重复造轮子吗？</strong></p><p>所以，我们要先弄清楚 TCP 协议有哪些痛点？而这些痛点是否可以在基于 UDP 协议实现的可靠传输协议中得到改进？</p><p>现在市面上已经有基于 UDP 协议实现的可靠传输协议的成熟方案了，那就是 QUIC 协议，<strong>QUIC 协议把我本文说的 TCP 的缺点都给解决了</strong>，而且已经应用在了 HTTP/3。</p><figure><img src="https://miro.medium.com/max/1400/1*uk5OZPL7gtUwqRLwaoGyFw.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><hr><p>最新的图解文章都在公众号首发，别忘记关注哦！！如果你想加入百人技术交流群，扫码下方二维码回复「加群」。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/其他/公众号介绍.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>',51),o=[T];function c(n,d){return a(),p("div",null,o)}const g=i(t,[["render",c],["__file","tcp_problem.html.vue"]]);export{g as default};
