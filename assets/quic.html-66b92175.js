import{ab as r,G as o,H as c,E as i,S as e,N as t,ad as n,W as g}from"./framework-b31a425c.js";const p={},l=i("h1",{id:"_4-17-如何基于-udp-协议实现可靠传输",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#_4-17-如何基于-udp-协议实现可靠传输","aria-hidden":"true"},"#"),e(" 4.17 如何基于 UDP 协议实现可靠传输？")],-1),d=i("p",null,"大家好，我是小林。",-1),s=i("p",null,[e("我记得之前在群里看到，有位读者字节一面的时候被问到：「"),i("strong",null,"如何基于 UDP 协议实现可靠传输？"),e("」")],-1),m=i("p",null,"很多同学第一反应就会说把 TCP 可靠传输的特性（序列号、确认应答、超时重传、流量控制、拥塞控制）在应用层实现一遍。",-1),h=i("p",null,[e("实现的思路确实这样没错，但是有没有想过，"),i("strong",null,"既然 TCP 天然支持可靠传输，为什么还需要基于 UDP 实现可靠传输呢？这不是重复造轮子吗？")],-1),f=i("p",null,"所以，我们要先弄清楚 TCP 协议有哪些痛点？而这些痛点是否可以在基于 UDP 协议实现的可靠传输协议中得到改进？",-1),u={href:"https://mp.weixin.qq.com/s/9kHoRk6QIYOFUR_PCmHY6g",target:"_blank",rel:"noopener noreferrer"},T=n('<ul><li>升级 TCP 的工作很困难；</li><li>TCP 建立连接的延迟；</li><li>TCP 存在队头阻塞问题；</li><li>网络迁移需要重新建立 TCP 连接；</li></ul><p>现在市面上已经有基于 UDP 协议实现的可靠传输协议的成熟方案了，那就是 QUIC 协议，已经应用在了 HTTP/3。</p><p>这次，<strong>聊聊 QUIC 是如何实现可靠传输的？又是如何解决上面 TCP 协议四个方面的缺陷</strong>？</p><figure><img src="https://img-blog.csdnimg.cn/605d1026df934f20a5ee12f3c55aa6a7.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="quic-是如何实现可靠传输的" tabindex="-1"><a class="header-anchor" href="#quic-是如何实现可靠传输的" aria-hidden="true">#</a> QUIC 是如何实现可靠传输的？</h2><p>要基于 UDP 实现的可靠传输协议，那么就要在应用层下功夫，也就是要设计好协议的头部字段。</p><p>拿 HTTP/3 举例子，在 UDP 报文头部与 HTTP 消息之间，共有 3 层头部：</p><figure><img src="https://static001.geekbang.org/resource/image/ab/7c/ab3283383013b707d1420b6b4cb8517c.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>整体看的视角是这样的：</p><figure><img src="https://docs.citrix.com/en-us/citrix-adc/media/http3-over-quic-protocol-works.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>接下来，分别对每一个 Header 做个介绍。</p><h3 id="packet-header" tabindex="-1"><a class="header-anchor" href="#packet-header" aria-hidden="true">#</a> Packet Header</h3><p>Packet Header 首次建立连接时和日常传输数据时使用的 Header 是不同的。如下图（<em>注意我没有把 Header 所有字段都画出来，只是画出了重要的字段</em>）：</p><figure><img src="https://img-blog.csdnimg.cn/bcf3ccb6a15c4cdebe1cd0527fdd9a5e.png" alt="Packet Header" tabindex="0" loading="lazy"><figcaption>Packet Header</figcaption></figure><p>Packet Header 细分这两种：</p><ul><li>Long Packet Header 用于首次建立连接。</li><li>Short Packet Header 用于日常传输数据。</li></ul><p>QUIC 也是需要三次握手来建立连接的，主要目的是为了协商连接 ID。协商出连接 ID 后，后续传输时，双方只需要固定住连接 ID，从而实现连接迁移功能。所以，你可以看到日常传输数据的 Short Packet Header 不需要在传输 Source Connection ID 字段了，只需要传输 Destination Connection ID。</p><p>Short Packet Header 中的 <code>Packet Number</code> 是每个报文独一无二的编号，它是<strong>严格递增</strong>的，也就是说就算 Packet N 丢失了，重传的 Packet N 的 Packet Number 已经不是 N，而是一个比 N 大的值。</p><figure><img src="https://img-blog.csdnimg.cn/635813465fbb449882da2e2bee39f24e.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>为什么要这么设计呢？</p></blockquote><p>我们先来看看 TCP 的问题，TCP 在重传报文时的序列号和原始报文的序列号是一样的，也正是由于这个特性，引入了 TCP 重传的歧义问题。</p><figure><img src="https://img-blog.csdnimg.cn/7e4e778413c1452bb6d58ec3d5452316.png" alt="TCP 重传的歧义问题" tabindex="0" loading="lazy"><figcaption>TCP 重传的歧义问题</figcaption></figure><p>比如上图，当 TCP 发生超时重传后，客户端发起重传，然后接收到了服务端确认 ACK 。由于客户端原始报文和重传报文序列号都是一样的，那么服务端针对这两个报文回复的都是相同的 ACK。</p><p>这样的话，客户端就无法判断出是「原始报文的响应」还是「重传报文的响应」，这样在计算 RTT（往返时间） 时应该选择从发送原始报文开始计算，还是重传原始报文开始计算呢？</p><ul><li>如果算成原始报文的响应，但实际上是重传报文的响应（上图左），会导致采样 RTT 变大；</li><li>如果算成重传报文的响应，但实际上是原始报文的响应（上图右），又很容易导致采样 RTT 过小；</li></ul><p>RTO （超时时间）是基于 RTT 来计算的，那么如果 RTT 计算不精准，那么 RTO （超时时间）也会不精确，这样可能导致重传的概率事件增大。</p><p>QUIC 报文中的 Pakcet Number 是严格递增的， 即使是重传报文，它的 Pakcet Number 也是递增的，这样就能更加精确计算出报文的 RTT。</p><figure><img src="https://img-blog.csdnimg.cn/ca91985c9a94487a8a29db1249109717.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果 ACK 的 Packet Number 是 N+M，就根据重传报文计算采样 RTT。如果 ACK 的 Pakcet Number 是 N，就根据原始报文的时间计算采样 RTT，没有歧义性的问题。</p><p>另外，还有一个好处，<strong>QUIC 使用的 Packet Number 单调递增的设计，可以让数据包不再像 TCP 那样必须有序确认，QUIC 支持乱序确认，当数据包Packet N 丢失后，只要有新的已接收数据包确认，当前窗口就会继续向右滑动</strong>（后面讲流量控制的时候，会举例子）。</p><p>待发送端获知数据包Packet N 丢失后，会将需要重传的数据包放到待发送队列，重新编号比如数据包Packet N+M 后重新发送给接收端，对重传数据包的处理跟发送新的数据包类似，这样就不会因为丢包重传将当前窗口阻塞在原地，从而解决了队头阻塞问题。</p><p>所以，Packet Number 单调递增的两个好处：</p><ul><li>可以更加精确计算 RTT，没有 TCP 重传的歧义性问题；</li><li>可以支持乱序确认，因为丢包重传将当前窗口阻塞在原地，而 TCP 必须是顺序确认的，丢包时会导致窗口不滑动；</li></ul><h3 id="quic-frame-header" tabindex="-1"><a class="header-anchor" href="#quic-frame-header" aria-hidden="true">#</a> QUIC Frame Header</h3><p>一个 Packet 报文中可以存放多个 QUIC Frame。</p><figure><img src="https://img-blog.csdnimg.cn/6a94d41ef3d14cb6b7846e73da6c3104.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>每一个 Frame 都有明确的类型，针对类型的不同，功能也不同，自然格式也不同。</p><p>我这里只举例 Stream 类型的 Frame 格式，Stream 可以认为就是一条 HTTP 请求，它长这样：</p><figure><img src="https://img-blog.csdnimg.cn/536298d2c54a43b699026bffe0f85010.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>Stream ID 作用：多个并发传输的 HTTP 消息，通过不同的 Stream ID 加以区别，类似于 HTTP2 的 Stream ID；</li><li>Offset 作用：类似于 TCP 协议中的 Seq 序号，<strong>保证数据的顺序性和可靠性</strong>；</li><li>Length 作用：指明了 Frame 数据的长度。</li></ul><p>在前面介绍 Packet Header 时，说到 Packet Number 是严格递增，即使重传报文的 Packet Number 也是递增的，既然重传数据包的 Packet N+M 与丢失数据包的 Packet N 编号并不一致，我们怎么确定这两个数据包的内容一样呢？</p><p>所以引入 Frame Header 这一层，<strong>通过 Stream ID + Offset 字段信息实现数据的有序性</strong>，通过比较两个数据包的 Stream ID 与 Stream Offset ，如果都是一致，就说明这两个数据包的内容一致。</p><p>举个例子，下图中，数据包 Packet N 丢失了，后面重传该数据包的编号为 Packet N+2，<strong>丢失的数据包和重传的数据包 Stream ID 与 Offset 都一致，说明这两个数据包的内容一致</strong>。这些数据包传输到接收端后，接收端能根据 Stream ID 与 Offset 字段信息将 Stream x 和 Stream x+y 按照顺序组织起来，然后交给应用程序处理。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/Packet丢失.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>总的来说，<strong>QUIC 通过单向递增的 Packet Number，配合 Stream ID 与 Offset 字段信息，可以支持乱序确认而不影响数据包的正确组装</strong>，摆脱了TCP 必须按顺序确认应答 ACK 的限制，解决了 TCP 因某个数据包重传而阻塞后续所有待发送数据包的问题。</p><h2 id="quic-是如何解决-tcp-队头阻塞问题的" tabindex="-1"><a class="header-anchor" href="#quic-是如何解决-tcp-队头阻塞问题的" aria-hidden="true">#</a> QUIC 是如何解决 TCP 队头阻塞问题的？</h2><h3 id="什么是-tcp-队头阻塞问题" tabindex="-1"><a class="header-anchor" href="#什么是-tcp-队头阻塞问题" aria-hidden="true">#</a> 什么是 TCP 队头阻塞问题？</h3><p>TCP 队头阻塞的问题要从两个角度看，一个是<strong>发送窗口的队头阻塞</strong>，另外一个是<strong>接收窗口的队头阻塞</strong>。</p><p><em>1、发送窗口的队头阻塞。</em></p><p>TCP 发送出去的数据，都是需要按序确认的，只有在数据都被按顺序确认完后，发送窗口才会往前滑动。</p><p>举个例子，比如下图的发送方把发送窗口内的数据全部都发出去了，可用窗口的大小就为 0 了，表明可用窗口耗尽，在没收到 ACK 确认之前是无法继续发送数据了。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/计算机网络/TCP-可靠特性/17.jpg?" alt="可用窗口耗尽" tabindex="0" loading="lazy"><figcaption>可用窗口耗尽</figcaption></figure><p>接着，当发送方收到对第 <code>32~36</code> 字节的 ACK 确认应答后，则<strong>滑动窗口往右边移动 5 个字节，因为有 5 个字节的数据被应答确认</strong>，接下来第 <code>52~56</code> 字节又变成了可用窗口，那么后续也就可以发送 <code>52~56</code> 这 5 个字节的数据了。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/计算机网络/TCP-可靠特性/18.jpg" alt="32 ~ 36 字节已确认" tabindex="0" loading="lazy"><figcaption>32 ~ 36 字节已确认</figcaption></figure><p><strong>但是如果某个数据报文丢失或者其对应的 ACK 报文在网络中丢失，会导致发送方无法移动发送窗口，这时就无法再发送新的数据</strong>，只能超时重传这个数据报文，直到收到这个重传报文的 ACK，发送窗口才会移动，继续后面的发送行为。</p><p>举个例子，比如下图，客户端是发送方，服务器是接收方。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/ack丢失.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>客户端发送了第 5～9 字节的数据，但是第 5 字节的 ACK 确认报文在网络中丢失了，那么即使客户端收到第 6～9 字节的 ACK 确认报文，发送窗口也不会往前移动。</p><p><strong>此时的第 5 字节相当于“队头”，因为没有收到“队头”的 ACK 确认报文，导致发送窗口无法往前移动，此时发送方就无法继续发送后面的数据，相当于按下了发送行为的暂停键，这就是发送窗口的队头阻塞问题</strong>。</p><p><em>2、接收窗口的队头阻塞。</em></p><p>接收方收到的数据范围必须在接收窗口范围内，如果收到超过接收窗口范围的数据，就会丢弃该数据，比如下图接收窗口的范围是 32 ～ 51 字节，如果收到第 52 字节以上数据都会被丢弃。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/计算机网络/TCP-可靠特性/20.jpg" alt="接收窗口" tabindex="0" loading="lazy"><figcaption>接收窗口</figcaption></figure><p>接收窗口什么时候才能滑动？当接收窗口收到有序数据时，接收窗口才能往前滑动，然后那些已经接收并且被确认的「有序」数据就可以被应用层读取。</p><p>但是，<strong>当接收窗口收到的数据不是有序的，比如收到第 33～40 字节的数据，由于第 32 字节数据没有收到， 接收窗口无法向前滑动，那么即使先收到第 33～40 字节的数据，这些数据也无法被应用层读取的</strong>。只有当发送方重传了第 32 字节数据并且被接收方收到后，接收窗口才会往前滑动，然后应用层才能从内核读取第 32～40 字节的数据。</p><p>好了，至此发送窗口和接收窗口的队头阻塞问题都说完了，这两个问题的原因都是因为 TCP 必须按序处理数据，也就是 TCP 层为了保证数据的有序性，只有在处理完有序的数据后，滑动窗口才能往前滑动，否则就停留。</p><ul><li><p>停留「发送窗口」会使得发送方无法继续发送数据。</p></li><li><p>停留「接收窗口」会使得应用层无法读取新的数据。</p></li></ul><p>其实也不能怪 TCP 协议，它本来设计目的就是为了保证数据的有序性。</p><h3 id="http-2-的队头阻塞" tabindex="-1"><a class="header-anchor" href="#http-2-的队头阻塞" aria-hidden="true">#</a> HTTP/2 的队头阻塞</h3><p>HTTP/2 通过抽象出 Stream 的概念，实现了 HTTP 并发传输，一个 Stream 就代表 HTTP/1.1 里的请求和响应。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/网络/http2/stream2.png" alt="HTTP/2" tabindex="0" loading="lazy"><figcaption>HTTP/2</figcaption></figure><p>在 HTTP/2 连接上，不同 Stream 的帧是可以乱序发送的（因此可以并发不同的 Stream ），因为每个帧的头部会携带 Stream ID 信息，所以接收端可以通过 Stream ID 有序组装成 HTTP 消息，而同一 Stream 内部的帧必须是严格有序的。</p><p><strong>但是 HTTP/2 多个 Stream 请求都是在一条 TCP 连接上传输，这意味着多个 Stream 共用同一个 TCP 滑动窗口，那么当发生数据丢失，滑动窗口是无法往前移动的，此时就会阻塞住所有的 HTTP 请求，这属于 TCP 层队头阻塞</strong>。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/http2阻塞.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="没有队头阻塞的-quic" tabindex="-1"><a class="header-anchor" href="#没有队头阻塞的-quic" aria-hidden="true">#</a> 没有队头阻塞的 QUIC</h3><p>QUIC 也借鉴 HTTP/2 里的 Stream 的概念，在一条 QUIC 连接上可以并发发送多个 HTTP 请求 (Stream)。</p><p>但是 <strong>QUIC 给每一个 Stream 都分配了一个独立的滑动窗口，这样使得一个连接上的多个 Stream 之间没有依赖关系，都是相互独立的，各自控制的滑动窗口</strong>。</p><p>假如 Stream2 丢了一个 UDP 包，也只会影响 Stream2 的处理，不会影响其他 Stream，与 HTTP/2 不同，HTTP/2 只要某个流中的数据包丢失了，其他流也会因此受影响。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/quic无阻塞.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="quic-是如何做流量控制的" tabindex="-1"><a class="header-anchor" href="#quic-是如何做流量控制的" aria-hidden="true">#</a> QUIC 是如何做流量控制的？</h2><p>TCP 流量控制是通过让「接收方」告诉「发送方」，它（接收方）的接收窗口有多大，从而让「发送方」根据「接收方」的实际接收能力控制发送的数据量。</p><p>QUIC 实现流量控制的方式：</p><ul><li>通过 window_update 帧告诉对端自己可以接收的字节数，这样发送方就不会发送超过这个数量的数据。</li><li>通过 BlockFrame 告诉对端由于流量控制被阻塞了，无法发送数据。</li></ul><p>在前面说到，TCP 的接收窗口在收到有序的数据后，接收窗口才能往前滑动，否则停止滑动；TCP 的发送窗口在收到对已发送数据的顺序确认 ACK后，发送窗口才能往前滑动，否则停止滑动。</p><p>QUIC 是基于 UDP 传输的，而 UDP 没有流量控制，因此 QUIC 实现了自己的流量控制机制，QUIC 的滑动窗口滑动的条件跟 TCP 有一点差别，但是同一个 Stream 的数据也是要保证顺序的，不然无法实现可靠传输，因此同一个 Stream 的数据包丢失了，也会造成窗口无法滑动。</p><p><strong>QUIC 的 每个 Stream 都有各自的滑动窗口，不同 Stream 互相独立，队头的 Stream A 被阻塞后，不妨碍 StreamB、C的读取</strong>。而对于 HTTP/2 而言，所有的 Stream 都跑在一条 TCP 连接上，而这些 Stream 共享一个滑动窗口，因此同一个Connection内，Stream A 被阻塞后，StreamB、C 必须等待。</p><p>QUIC 实现了两种级别的流量控制，分别为 Stream 和 Connection 两种级别：</p><ul><li><strong>Stream 级别的流量控制</strong>：Stream 可以认为就是一条 HTTP 请求，每个 Stream 都有独立的滑动窗口，所以每个 Stream 都可以做流量控制，防止单个 Stream 消耗连接（Connection）的全部接收缓冲。</li><li><strong>Connection 流量控制</strong>：限制连接中所有 Stream 相加起来的总字节数，防止发送方超过连接的缓冲容量。</li></ul><h3 id="stream-级别的流量控制" tabindex="-1"><a class="header-anchor" href="#stream-级别的流量控制" aria-hidden="true">#</a> Stream 级别的流量控制</h3>',88),C={href:"https://docs.google.com/document/d/1F2YfdDXKpy20WVKJueEf4abn_LVZHhMUMS5gX6Pgjl4/mobilebasic",target:"_blank",rel:"noopener noreferrer"},P=n('<figure><img src="https://img-blog.csdnimg.cn/f1070a6eccd24559904815297b07f789.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>接着，接收方收到了发送方发送过来的数据，有的数据被上层读取了，有的数据丢包了，此时的接收窗口状况如下：</p><figure><img src="https://img-blog.csdnimg.cn/77e9a7cf70da4a1b981f61e78db2ad56.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以看到，<strong>接收窗口的左边界取决于接收到的最大偏移字节数</strong>，此时的<code>接收窗口 = 最大窗口数 - 接收到的最大偏移数</code>。</p><p>这里就可以看出 QUIC 的流量控制和 TCP 有点区别了：</p><ul><li>TCP 的接收窗口只有在前面所有的 Segment 都接收的情况下才会移动左边界，当在前面还有字节未接收但收到后面字节的情况下，窗口也不会移动。</li><li>QUIC 的接收窗口的左边界滑动条件取决于接收到的最大偏移字节数。</li></ul><p><em>PS：但是你要问我这么设计有什么好处？我也暂时没想到，因为资料太少了，至今没找到一个合理的说明，如果你知道，欢迎告诉我啊！</em></p><p>那接收窗口右边界触发的滑动条件是什么呢？看下图：</p><figure><img src="https://img-blog.csdnimg.cn/bbde0c66088f439b919a6d18b389aadb.png" alt="接收窗口触发的滑动" tabindex="0" loading="lazy"><figcaption>接收窗口触发的滑动</figcaption></figure><p>当图中的绿色部分数据超过最大接收窗口的一半后，最大接收窗口向右移动，接收窗口的右边界也向右扩展，同时给对端发送「窗口更新帧」，当发送方收到接收方的窗口更新帧后，发送窗口的右边界也会往右扩展，以此达到窗口滑动的效果。</p><p>绿色部分的数据是已收到的顺序的数据，<strong>如果中途丢失了数据包，导致绿色部分的数据没有超过最大接收窗口的一半，那接收窗口就无法滑动了</strong>，这个只影响同一个 Stream，其他 Stream 是不会影响的，因为每个 Stream 都有各自的滑动窗口。</p><p>在前面我们说过 QUIC 支持乱序确认，具体是怎么做到的呢？</p>',12),b={href:"https://juejin.cn/post/7066993430102016037",target:"_blank",rel:"noopener noreferrer"},x=n(`<p>如图所示，当前发送方的缓冲区大小为8，发送方 QUIC 按序（offset顺序）发送 29-36 的数据包：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/乱序确认1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>31、32、34数据包先到达，基于 offset 被优先乱序确认，但 30 数据包没有确认，所以当前已提交的字节偏移量不变，发送方的缓存区不变。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/乱序确认2.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>30 到达并确认，发送方的缓存区收缩到阈值，接收方发送 MAX_STREAM_DATA Frame（协商缓存大小的特定帧）给发送方，请求增长最大绝对字节偏移量。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/乱序确认3.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>协商完毕后最大绝对字节偏移量右移，发送方的缓存区变大，同时发送方发现数据包33超时</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/乱序确认4.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>发送方将超时数据包重新编号为 42 继续发送</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/quic/乱序确认5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>以上就是最基本的数据包发送-接收过程，控制数据发送的唯一限制就是最大绝对字节偏移量，该值是接收方基于当前已经提交的偏移量（连续已确认并向上层应用提交的数据包offset）和发送方协商得出。</p><h3 id="connection-流量控制" tabindex="-1"><a class="header-anchor" href="#connection-流量控制" aria-hidden="true">#</a> Connection 流量控制</h3><p>而对于 Connection 级别的流量窗口，其接收窗口大小就是各个 Stream 接收窗口大小之和。</p><figure><img src="https://img-blog.csdnimg.cn/839501cffa7146cbb8d992264594e61d.png" alt="Connection 流量控制" tabindex="0" loading="lazy"><figcaption>Connection 流量控制</figcaption></figure><p>上图所示的例子，所有 Streams 的最大窗口数为 120，其中：</p><ul><li>Stream 1 的最大接收偏移为 100，可用窗口 = 120 - 100 = 20</li><li>Stream 2 的最大接收偏移为 90，可用窗口 = 120 - 90 = 30</li><li>Stream 3 的最大接收偏移为 110，可用窗口 = 120 - 110 = 10</li></ul><p>那么整个 Connection 的可用窗口 = 20 + 30 + 10 = 60</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>可用窗口 = Stream 1 可用窗口 + Stream 2 可用窗口 + Stream 3 可用窗口
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="quic-对拥塞控制改进" tabindex="-1"><a class="header-anchor" href="#quic-对拥塞控制改进" aria-hidden="true">#</a> QUIC 对拥塞控制改进</h2><p>QUIC 协议当前默认使用了 TCP 的 Cubic 拥塞控制算法（我们熟知的慢开始、拥塞避免、快重传、快恢复策略），同时也支持 CubicBytes、Reno、RenoBytes、BBR、PCC 等拥塞控制算法，相当于将 TCP 的拥塞控制算法照搬过来了。</p><p>QUIC 是如何改进 TCP 的拥塞控制算法的呢？</p><p>QUIC 是处于应用层的，应用程序层面就能实现不同的拥塞控制算法，不需要操作系统，不需要内核支持。这是一个飞跃，因为传统的 TCP 拥塞控制，必须要端到端的网络协议栈支持，才能实现控制效果。而内核和操作系统的部署成本非常高，升级周期很长，所以 TCP 拥塞控制算法迭代速度是很慢的。而 <strong>QUIC 可以随浏览器更新，QUIC 的拥塞控制算法就可以有较快的迭代速度</strong>。</p><p>TCP 更改拥塞控制算法是对系统中所有应用都生效，无法根据不同应用设定不同的拥塞控制策略。但是因为 QUIC 处于应用层，所以就<strong>可以针对不同的应用设置不同的拥塞控制算法</strong>，这样灵活性就很高了。</p><h2 id="quic-更快的连接建立" tabindex="-1"><a class="header-anchor" href="#quic-更快的连接建立" aria-hidden="true">#</a> QUIC 更快的连接建立</h2><p>对于 HTTP/1 和 HTTP/2 协议，TCP 和 TLS 是分层的，分别属于内核实现的传输层、openssl 库实现的表示层，因此它们难以合并在一起，需要分批次来握手，先 TCP 握手（1RTT），再 TLS 握手（2RTT），所以需要 3RTT 的延迟才能传输数据，就算 Session 会话服用，也需要至少 2 个 RTT。</p><p>HTTP/3 在传输数据前虽然需要 QUIC 协议握手，这个握手过程只需要 1 RTT，握手的目的是为确认双方的「连接 ID」，连接迁移就是基于连接 ID 实现的。</p><p>但是 HTTP/3 的 QUIC 协议并不是与 TLS 分层，而是<strong>QUIC 内部包含了 TLS，它在自己的帧会携带 TLS 里的“记录”，再加上 QUIC 使用的是 TLS1.3，因此仅需 1 个 RTT 就可以「同时」完成建立连接与密钥协商，甚至在第二次连接的时候，应用数据包可以和 QUIC 握手信息（连接信息 + TLS 信息）一起发送，达到 0-RTT 的效果</strong>。</p><p>如下图右边部分，HTTP/3 当会话恢复时，有效负载数据与第一个数据包一起发送，可以做到 0-RTT（下图的右下角）：</p><figure><img src="https://img-blog.csdnimg.cn/4cad213f5125432693e0e2a512c2d1a1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="quic-是如何迁移连接的" tabindex="-1"><a class="header-anchor" href="#quic-是如何迁移连接的" aria-hidden="true">#</a> QUIC 是如何迁移连接的？</h2><p>基于 TCP 传输协议的 HTTP 协议，由于是通过四元组（源 IP、源端口、目的 IP、目的端口）确定一条 TCP 连接。</p><figure><img src="https://imgconvert.csdnimg.cn/aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3hpYW9saW5jb2Rlci9JbWFnZUhvc3QyLyVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFNyVCRCU5MSVFNyVCQiU5Qy9UQ1AtJUU0JUI4JTg5JUU2JUFDJUExJUU2JThGJUExJUU2JTg5JThCJUU1JTkyJThDJUU1JTlCJTlCJUU2JUFDJUExJUU2JThDJUE1JUU2JTg5JThCLzEwLmpwZw?x-oss-process=image/format,png" alt="TCP 四元组" tabindex="0" loading="lazy"><figcaption>TCP 四元组</figcaption></figure><p>那么<strong>当移动设备的网络从 4G 切换到 WIFI 时，意味着 IP 地址变化了，那么就必须要断开连接，然后重新建立 TCP 连接</strong>。</p><p>而建立连接的过程包含 TCP 三次握手和 TLS 四次握手的时延，以及 TCP 慢启动的减速过程，给用户的感觉就是网络突然卡顿了一下，因此连接的迁移成本是很高的。</p><p>QUIC 协议没有用四元组的方式来“绑定”连接，而是通过<strong>连接 ID</strong>来标记通信的两个端点，客户端和服务器可以各自选择一组 ID 来标记自己，因此即使移动设备的网络变化后，导致 IP 地址变化了，只要仍保有上下文信息（比如连接 ID、TLS 密钥等），就可以“无缝”地复用原连接，消除重连的成本，没有丝毫卡顿感，达到了<strong>连接迁移</strong>的功能。</p><hr><p>参考资料：</p>`,37),U={href:"https://www.taohui.tech/2021/02/04/%E7%BD%91%E7%BB%9C%E5%8D%8F%E8%AE%AE/%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90HTTP3%E5%8D%8F%E8%AE%AE/",target:"_blank",rel:"noopener noreferrer"},S={href:"https://zhuanlan.zhihu.com/p/32553477",target:"_blank",rel:"noopener noreferrer"},I=i("hr",null,null,-1),k=i("p",null,"最新的图解文章都在公众号首发，别忘记关注哦！！如果你想加入百人技术交流群，扫码下方二维码回复「加群」。",-1),_=i("figure",null,[i("img",{src:"https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/其他/公众号介绍.png",alt:"",tabindex:"0",loading:"lazy"}),i("figcaption")],-1);function H(Q,y){const a=g("ExternalLinkIcon");return o(),c("div",null,[l,d,s,m,h,f,i("p",null,[e("在之前这篇文章："),i("a",u,[e("TCP 就没什么缺陷吗？"),t(a)]),e("，我已经说了 TCP 协议四个方面的缺陷：")]),T,i("p",null,[e("最开始，接收方的接收窗口初始状态如下（网上的讲 QUIC 流量控制的资料太少了，下面的例子我是参考 google 文档的："),i("a",C,[e("Flow control in QUIC"),t(a)]),e("）：")]),P,i("p",null,[e("接下来，举个例子（下面的例子来源于："),i("a",b,[e("QUIC——快速UDP网络连接协议"),t(a)]),e("）：")]),x,i("ul",null,[i("li",null,[i("a",U,[e("https://www.taohui.tech/2021/02/04/网络协议/深入剖析HTTP3协议/"),t(a)])]),i("li",null,[i("a",S,[e("https://zhuanlan.zhihu.com/p/32553477"),t(a)])])]),I,k,_])}const N=r(p,[["render",H],["__file","quic.html.vue"]]);export{N as default};
