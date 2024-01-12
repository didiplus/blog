import{_ as e,c as o,o as i,U as s}from"./chunks/framework.y0HOe2qR.js";const A=JSON.parse('{"title":"3.2 TCP 重传、滑动窗口、流量控制、拥塞控制","description":"","frontmatter":{},"headers":[],"relativePath":"datacom/network/3_tcp/3.2.tcp_feature.md","filePath":"datacom/network/3_tcp/3.2.tcp_feature.md","lastUpdated":1705029886000}'),p={name:"datacom/network/3_tcp/3.2.tcp_feature.md"},l=s(`<h1 id="_3-2-tcp-重传、滑动窗口、流量控制、拥塞控制" tabindex="-1">3.2 TCP 重传、滑动窗口、流量控制、拥塞控制 <a class="header-anchor" href="#_3-2-tcp-重传、滑动窗口、流量控制、拥塞控制" aria-label="Permalink to &quot;3.2 TCP 重传、滑动窗口、流量控制、拥塞控制&quot;">​</a></h1><p>TCP <strong>巨复杂</strong>，它为了保证可靠性，用了巨多的机制来保证，真是个「伟大」的协议，写着写着发现这水太深了。。。</p><p>本文的全部图片都是小林绘画的，非常的辛苦且累，不废话了，直接进入正文，Go！</p><p>相信大家都知道 TCP 是一个可靠传输的协议，那它是如何保证可靠的呢？</p><p>为了实现可靠性传输，需要考虑很多事情，例如数据的破坏、丢包、重复以及分片顺序混乱等问题。如不能解决这些问题，也就无从谈起可靠传输。</p><p>那么，TCP 是通过序列号、确认应答、重发控制、连接管理以及窗口控制等机制实现可靠性传输的。</p><p>今天，将重点介绍 TCP 的<strong>重传机制、滑动窗口、流量控制、拥塞控制。</strong></p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/3.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt=""></p><hr><h2 id="重传机制" tabindex="-1">重传机制 <a class="header-anchor" href="#重传机制" aria-label="Permalink to &quot;重传机制&quot;">​</a></h2><p>TCP 实现可靠传输的方式之一，是通过序列号与确认应答。</p><p>在 TCP 中，当发送端的数据到达接收主机时，接收端主机会返回一个确认应答消息，表示已收到消息。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/4.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="正常的数据传输"></p><p>但在错综复杂的网络，并不一定能如上图那么顺利能正常的数据传输，万一数据在传输过程中丢失了呢？</p><p>所以 TCP 针对数据包丢失的情况，会用<strong>重传机制</strong>解决。</p><p>接下来说说常见的重传机制：</p><ul><li>超时重传</li><li>快速重传</li><li>SACK</li><li>D-SACK</li></ul><h3 id="超时重传" tabindex="-1">超时重传 <a class="header-anchor" href="#超时重传" aria-label="Permalink to &quot;超时重传&quot;">​</a></h3><p>重传机制的其中一个方式，就是在发送数据时，设定一个定时器，当超过指定的时间后，没有收到对方的 <code>ACK</code> 确认应答报文，就会重发该数据，也就是我们常说的<strong>超时重传</strong>。</p><p>TCP 会在以下两种情况发生超时重传：</p><ul><li>数据包丢失</li><li>确认应答丢失</li></ul><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/5.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="超时重传的两种情况"></p><blockquote><p>超时时间应该设置为多少呢？</p></blockquote><p>我们先来了解一下什么是 <code>RTT</code>（Round-Trip Time 往返时延），从下图我们就可以知道：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/6.jpg?" alt="RTT"></p><p><code>RTT</code> 指的是<strong>数据发送时刻到接收到确认的时刻的差值</strong>，也就是包的往返时间。</p><p>超时重传时间是以 <code>RTO</code> （Retransmission Timeout 超时重传时间）表示。</p><p>假设在重传的情况下，超时时间 <code>RTO</code> 「较长或较短」时，会发生什么事情呢？</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/7.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="超时时间较长与较短"></p><p>上图中有两种超时时间不同的情况：</p><ul><li>当超时时间 <strong>RTO 较大</strong>时，重发就慢，丢了老半天才重发，没有效率，性能差；</li><li>当超时时间 <strong>RTO 较小</strong>时，会导致可能并没有丢就重发，于是重发的就快，会增加网络拥塞，导致更多的超时，更多的超时导致更多的重发。</li></ul><p>精确的测量超时时间 <code>RTO</code> 的值是非常重要的，这可让我们的重传机制更高效。</p><p>根据上述的两种情况，我们可以得知，<strong>超时重传时间 RTO 的值应该略大于报文往返 RTT 的值</strong>。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/8.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="RTO 应略大于 RTT"></p><p>至此，可能大家觉得超时重传时间 <code>RTO</code> 的值计算，也不是很复杂嘛。</p><p>好像就是在发送端发包时记下 <code>t0</code> ，然后接收端再把这个 <code>ack</code> 回来时再记一个 <code>t1</code>，于是 <code>RTT = t1 – t0</code>。没那么简单，<strong>这只是一个采样，不能代表普遍情况</strong>。</p><p>实际上「报文往返 RTT 的值」是经常变化的，因为我们的网络也是时常变化的。也就因为「报文往返 RTT 的值」 是经常波动变化的，所以「超时重传时间 RTO 的值」应该是一个<strong>动态变化的值</strong>。</p><p>我们来看看 Linux 是如何计算 <code>RTO</code> 的呢？</p><p>估计往返时间，通常需要采样以下两个：</p><ul><li>需要 TCP 通过采样 RTT 的时间，然后进行加权平均，算出一个平滑 RTT 的值，而且这个值还是要不断变化的，因为网络状况不断地变化。</li><li>除了采样 RTT，还要采样 RTT 的波动范围，这样就避免如果 RTT 有一个大的波动的话，很难被发现的情况。</li></ul><p>RFC6289 建议使用以下的公式计算 RTO：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/9.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="RFC6289 建议的 RTO 计算 "></p><p>其中 <code>SRTT</code> 是计算平滑的RTT ，<code>DevRTR</code> 是计算平滑的RTT 与 最新 RTT 的差距。</p><p>在 Linux 下，<strong>α = 0.125，β = 0.25， μ = 1，∂ = 4</strong>。别问怎么来的，问就是大量实验中调出来的。</p><p>如果超时重发的数据，再次超时的时候，又需要重传的时候，TCP 的策略是<strong>超时间隔加倍。</strong></p><p>也就是<strong>每当遇到一次超时重传的时候，都会将下一次超时时间间隔设为先前值的两倍。两次超时，就说明网络环境差，不宜频繁反复发送。</strong></p><p>超时触发重传存在的问题是，超时周期可能相对较长。那是不是可以有更快的方式呢？</p><p>于是就可以用「快速重传」机制来解决超时重发的时间等待。</p><h3 id="快速重传" tabindex="-1">快速重传 <a class="header-anchor" href="#快速重传" aria-label="Permalink to &quot;快速重传&quot;">​</a></h3><p>TCP 还有另外一种<strong>快速重传（Fast Retransmit）机制</strong>，它<strong>不以时间为驱动，而是以数据驱动重传</strong>。</p><p>快速重传机制，是如何工作的呢？其实很简单，一图胜千言。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/10.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="快速重传机制"></p><p>在上图，发送方发出了 1，2，3，4，5 份数据：</p><ul><li>第一份 Seq1 先送到了，于是就 Ack 回 2；</li><li>结果 Seq2 因为某些原因没收到，Seq3 到达了，于是还是 Ack 回 2；</li><li>后面的 Seq4 和 Seq5 都到了，但还是 Ack 回 2，因为 Seq2 还是没有收到；</li><li><strong>发送端收到了三个 Ack = 2 的确认，知道了 Seq2 还没有收到，就会在定时器过期之前，重传丢失的 Seq2。</strong></li><li>最后，收到了 Seq2，此时因为 Seq3，Seq4，Seq5 都收到了，于是 Ack 回 6 。</li></ul><p>所以，快速重传的工作方式是当收到三个相同的 ACK 报文时，会在定时器过期之前，重传丢失的报文段。</p><p>快速重传机制只解决了一个问题，就是超时时间的问题，但是它依然面临着另外一个问题。就是<strong>重传的时候，是重传一个，还是重传所有的问题。</strong></p><p>举个例子，假设发送方发了 6 个数据，编号的顺序是 Seq1 ~ Seq6 ，但是 Seq2、Seq3 都丢失了，那么接收方在收到 Seq4、Seq5、Seq6 时，都是回复 ACK2 给发送方，但是发送方并不清楚这连续的 ACK2 是接收方收到哪个报文而回复的， 那是选择重传 Seq2 一个报文，还是重传 Seq2 之后已发送的所有报文呢（Seq2、Seq3、 Seq4、Seq5、 Seq6） 呢？</p><ul><li><p>如果只选择重传 Seq2 一个报文，那么重传的效率很低。因为对于丢失的 Seq3 报文，还得在后续收到三个重复的 ACK3 才能触发重传。</p></li><li><p>如果选择重传 Seq2 之后已发送的所有报文，虽然能同时重传已丢失的 Seq2 和 Seq3 报文，但是 Seq4、Seq5、Seq6 的报文是已经被接收过了，对于重传 Seq4 ～Seq6 折部分数据相当于做了一次无用功，浪费资源。</p></li></ul><p>可以看到，不管是重传一个报文，还是重传已发送的报文，都存在问题。</p><p>为了解决不知道该重传哪些 TCP 报文，于是就有 <code>SACK</code> 方法。</p><h3 id="sack-方法" tabindex="-1">SACK 方法 <a class="header-anchor" href="#sack-方法" aria-label="Permalink to &quot;SACK 方法&quot;">​</a></h3><p>还有一种实现重传机制的方式叫：<code>SACK</code>（ Selective Acknowledgment）， <strong>选择性确认</strong>。</p><p>这种方式需要在 TCP 头部「选项」字段里加一个 <code>SACK</code> 的东西，它<strong>可以将已收到的数据的信息发送给「发送方」</strong>，这样发送方就可以知道哪些数据收到了，哪些数据没收到，知道了这些信息，就可以<strong>只重传丢失的数据</strong>。</p><p>如下图，发送方收到了三次同样的 ACK 确认报文，于是就会触发快速重发机制，通过 <code>SACK</code> 信息发现只有 <code>200~299</code> 这段数据丢失，则重发时，就只选择了这个 TCP 段进行重复。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/11.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="选择性确认"></p><p>如果要支持 <code>SACK</code>，必须双方都要支持。在 Linux 下，可以通过 <code>net.ipv4.tcp_sack</code> 参数打开这个功能（Linux 2.4 后默认打开）。</p><h3 id="duplicate-sack" tabindex="-1">Duplicate SACK <a class="header-anchor" href="#duplicate-sack" aria-label="Permalink to &quot;Duplicate SACK&quot;">​</a></h3><p>Duplicate SACK 又称 <code>D-SACK</code>，其主要<strong>使用了 SACK 来告诉「发送方」有哪些数据被重复接收了。</strong></p><p>下面举例两个栗子，来说明 <code>D-SACK</code> 的作用。</p><p><em>栗子一号：ACK 丢包</em></p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/12.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="ACK 丢包"></p><ul><li>「接收方」发给「发送方」的两个 ACK 确认应答都丢失了，所以发送方超时后，重传第一个数据包（3000 ~ 3499）</li><li><strong>于是「接收方」发现数据是重复收到的，于是回了一个 SACK = 3000~3500</strong>，告诉「发送方」 3000~3500 的数据早已被接收了，因为 ACK 都到了 4000 了，已经意味着 4000 之前的所有数据都已收到，所以这个 SACK 就代表着 <code>D-SACK</code>。</li><li>这样「发送方」就知道了，数据没有丢，是「接收方」的 ACK 确认报文丢了。</li></ul><p><em>栗子二号：网络延时</em></p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/13.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="网络延时"></p><ul><li>数据包（1000~1499） 被网络延迟了，导致「发送方」没有收到 Ack 1500 的确认报文。</li><li>而后面报文到达的三个相同的 ACK 确认报文，就触发了快速重传机制，但是在重传后，被延迟的数据包（1000~1499）又到了「接收方」；</li><li><strong>所以「接收方」回了一个 SACK=1000~1500，因为 ACK 已经到了 3000，所以这个 SACK 是 D-SACK，表示收到了重复的包。</strong></li><li>这样发送方就知道快速重传触发的原因不是发出去的包丢了，也不是因为回应的 ACK 包丢了，而是因为网络延迟了。</li></ul><p>可见，<code>D-SACK</code> 有这么几个好处：</p><ol><li>可以让「发送方」知道，是发出去的包丢了，还是接收方回应的 ACK 包丢了;</li><li>可以知道是不是「发送方」的数据包被网络延迟了;</li><li>可以知道网络中是不是把「发送方」的数据包给复制了;</li></ol><p>在 Linux 下可以通过 <code>net.ipv4.tcp_dsack</code> 参数开启/关闭这个功能（Linux 2.4 后默认打开）。</p><hr><h2 id="滑动窗口" tabindex="-1">滑动窗口 <a class="header-anchor" href="#滑动窗口" aria-label="Permalink to &quot;滑动窗口&quot;">​</a></h2><blockquote><p>引入窗口概念的原因</p></blockquote><p>我们都知道 TCP 是每发送一个数据，都要进行一次确认应答。当上一个数据包收到了应答了， 再发送下一个。</p><p>这个模式就有点像我和你面对面聊天，你一句我一句。但这种方式的缺点是效率比较低的。</p><p>如果你说完一句话，我在处理其他事情，没有及时回复你，那你不是要干等着我做完其他事情后，我回复你，你才能说下一句话，很显然这不现实。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/14.jpg?" alt="按数据包进行确认应答"></p><p>所以，这样的传输方式有一个缺点：数据包的<strong>往返时间越长，通信的效率就越低</strong>。</p><p>为解决这个问题，TCP 引入了<strong>窗口</strong>这个概念。即使在往返时间较长的情况下，它也不会降低网络通信的效率。</p><p>那么有了窗口，就可以指定窗口大小，窗口大小就是指<strong>无需等待确认应答，而可以继续发送数据的最大值</strong>。</p><p>窗口的实现实际上是操作系统开辟的一个缓存空间，发送方主机在等到确认应答返回之前，必须在缓冲区中保留已发送的数据。如果按期收到确认应答，此时数据就可以从缓存区清除。</p><p>假设窗口大小为 <code>3</code> 个 TCP 段，那么发送方就可以「连续发送」 <code>3</code> 个 TCP 段，并且中途若有 ACK 丢失，可以通过「下一个确认应答进行确认」。如下图：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/15.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="用滑动窗口方式并行处理"></p><p>图中的 ACK 600 确认应答报文丢失，也没关系，因为可以通过下一个确认应答进行确认，只要发送方收到了 ACK 700 确认应答，就意味着 700 之前的所有数据「接收方」都收到了。这个模式就叫<strong>累计确认</strong>或者<strong>累计应答</strong>。</p><blockquote><p>窗口大小由哪一方决定？</p></blockquote><p>TCP 头里有一个字段叫 <code>Window</code>，也就是窗口大小。</p><p><strong>这个字段是接收端告诉发送端自己还有多少缓冲区可以接收数据。于是发送端就可以根据这个接收端的处理能力来发送数据，而不会导致接收端处理不过来。</strong></p><p>所以，通常窗口的大小是由接收方的窗口大小来决定的。</p><p>发送方发送的数据大小不能超过接收方的窗口大小，否则接收方就无法正常接收到数据。</p><blockquote><p>发送方的滑动窗口</p></blockquote><p>我们先来看看发送方的窗口，下图就是发送方缓存的数据，根据处理的情况分成四个部分，其中深蓝色方框是发送窗口，紫色方框是可用窗口：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/16.jpg?" alt=""></p><ul><li>#1 是已发送并收到 ACK确认的数据：1~31 字节</li><li>#2 是已发送但未收到 ACK确认的数据：32~45 字节</li><li>#3 是未发送但总大小在接收方处理范围内（接收方还有空间）：46~51字节</li><li>#4 是未发送但总大小超过接收方处理范围（接收方没有空间）：52字节以后</li></ul><p>在下图，当发送方把数据「全部」都一下发送出去后，可用窗口的大小就为 0 了，表明可用窗口耗尽，在没收到 ACK 确认之前是无法继续发送数据了。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/17.jpg?" alt="可用窗口耗尽"></p><p>在下图，当收到之前发送的数据 <code>32~36</code> 字节的 ACK 确认应答后，如果发送窗口的大小没有变化，则<strong>滑动窗口往右边移动 5 个字节，因为有 5 个字节的数据被应答确认</strong>，接下来 <code>52~56</code> 字节又变成了可用窗口，那么后续也就可以发送 <code>52~56</code> 这 5 个字节的数据了。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/18.jpg" alt="32 ~ 36 字节已确认"></p><blockquote><p>程序是如何表示发送方的四个部分的呢？</p></blockquote><p>TCP 滑动窗口方案使用三个指针来跟踪在四个传输类别中的每一个类别中的字节。其中两个指针是绝对指针（指特定的序列号），一个是相对指针（需要做偏移）。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/19.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="SND.WND、SND.UN、SND.NXT"></p><ul><li><p><code>SND.WND</code>：表示发送窗口的大小（大小是由接收方指定的）；</p></li><li><p><code>SND.UNA</code>（<em>Send Unacknoleged</em>）：是一个绝对指针，它指向的是已发送但未收到确认的第一个字节的序列号，也就是 #2 的第一个字节。</p></li><li><p><code>SND.NXT</code>：也是一个绝对指针，它指向未发送但可发送范围的第一个字节的序列号，也就是 #3 的第一个字节。</p></li><li><p>指向 #4 的第一个字节是个相对指针，它需要 <code>SND.UNA</code> 指针加上 <code>SND.WND</code> 大小的偏移量，就可以指向 #4 的第一个字节了。</p></li></ul><p>那么可用窗口大小的计算就可以是：</p><p><strong>可用窗口大小 = SND.WND -（SND.NXT - SND.UNA）</strong></p><blockquote><p>接收方的滑动窗口</p></blockquote><p>接下来我们看看接收方的窗口，接收窗口相对简单一些，根据处理的情况划分成三个部分：</p><ul><li>#1 + #2 是已成功接收并确认的数据（等待应用进程读取）；</li><li>#3 是未收到数据但可以接收的数据；</li><li>#4 未收到数据并不可以接收的数据；</li></ul><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/20.jpg" alt="接收窗口"></p><p>其中三个接收部分，使用两个指针进行划分:</p><ul><li><code>RCV.WND</code>：表示接收窗口的大小，它会通告给发送方。</li><li><code>RCV.NXT</code>：是一个指针，它指向期望从发送方发送来的下一个数据字节的序列号，也就是 #3 的第一个字节。</li><li>指向 #4 的第一个字节是个相对指针，它需要 <code>RCV.NXT</code> 指针加上 <code>RCV.WND</code> 大小的偏移量，就可以指向 #4 的第一个字节了。</li></ul><blockquote><p>接收窗口和发送窗口的大小是相等的吗？</p></blockquote><p>并不是完全相等，接收窗口的大小是<strong>约等于</strong>发送窗口的大小的。</p><p>因为滑动窗口并不是一成不变的。比如，当接收方的应用进程读取数据的速度非常快的话，这样的话接收窗口可以很快的就空缺出来。那么新的接收窗口大小，是通过 TCP 报文中的 Windows 字段来告诉发送方。那么这个传输过程是存在时延的，所以接收窗口和发送窗口是约等于的关系。</p><hr><h2 id="流量控制" tabindex="-1">流量控制 <a class="header-anchor" href="#流量控制" aria-label="Permalink to &quot;流量控制&quot;">​</a></h2><p>发送方不能无脑的发数据给接收方，要考虑接收方处理能力。</p><p>如果一直无脑的发数据给对方，但对方处理不过来，那么就会导致触发重发机制，从而导致网络流量的无端的浪费。</p><p>为了解决这种现象发生，<strong>TCP 提供一种机制可以让「发送方」根据「接收方」的实际接收能力控制发送的数据量，这就是所谓的流量控制。</strong></p><p>下面举个栗子，为了简单起见，假设以下场景：</p><ul><li>客户端是接收方，服务端是发送方</li><li>假设接收窗口和发送窗口相同，都为 <code>200</code></li><li>假设两个设备在整个传输过程中都保持相同的窗口大小，不受外界影响</li></ul><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/21.png?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="流量控制"></p><p>根据上图的流量控制，说明下每个过程：</p><ol><li>客户端向服务端发送请求数据报文。这里要说明下，本次例子是把服务端作为发送方，所以没有画出服务端的接收窗口。</li><li>服务端收到请求报文后，发送确认报文和 80 字节的数据，于是可用窗口 <code>Usable</code> 减少为 120 字节，同时 <code>SND.NXT</code> 指针也向右偏移 80 字节后，指向 321，<strong>这意味着下次发送数据的时候，序列号是 321。</strong></li><li>客户端收到 80 字节数据后，于是接收窗口往右移动 80 字节，<code>RCV.NXT</code> 也就指向 321，<strong>这意味着客户端期望的下一个报文的序列号是 321</strong>，接着发送确认报文给服务端。</li><li>服务端再次发送了 120 字节数据，于是可用窗口耗尽为 0，服务端无法再继续发送数据。</li><li>客户端收到 120 字节的数据后，于是接收窗口往右移动 120 字节，<code>RCV.NXT</code> 也就指向 441，接着发送确认报文给服务端。</li><li>服务端收到对 80 字节数据的确认报文后，<code>SND.UNA</code> 指针往右偏移后指向 321，于是可用窗口 <code>Usable</code> 增大到 80。</li><li>服务端收到对 120 字节数据的确认报文后，<code>SND.UNA</code> 指针往右偏移后指向 441，于是可用窗口 <code>Usable</code> 增大到 200。</li><li>服务端可以继续发送了，于是发送了 160 字节的数据后，<code>SND.NXT</code> 指向 601，于是可用窗口 <code>Usable</code> 减少到 40。</li><li>客户端收到 160 字节后，接收窗口往右移动了 160 字节，<code>RCV.NXT</code> 也就是指向了 601，接着发送确认报文给服务端。</li><li>服务端收到对 160 字节数据的确认报文后，发送窗口往右移动了 160 字节，于是 <code>SND.UNA</code> 指针偏移了 160 后指向 601，可用窗口 <code>Usable</code> 也就增大至了 200。</li></ol><h3 id="操作系统缓冲区与滑动窗口的关系" tabindex="-1">操作系统缓冲区与滑动窗口的关系 <a class="header-anchor" href="#操作系统缓冲区与滑动窗口的关系" aria-label="Permalink to &quot;操作系统缓冲区与滑动窗口的关系&quot;">​</a></h3><p>前面的流量控制例子，我们假定了发送窗口和接收窗口是不变的，但是实际上，发送窗口和接收窗口中所存放的字节数，都是放在操作系统内存缓冲区中的，而操作系统的缓冲区，会<strong>被操作系统调整</strong>。</p><p>当应用进程没办法及时读取缓冲区的内容时，也会对我们的缓冲区造成影响。</p><blockquote><p>那操作系统的缓冲区，是如何影响发送窗口和接收窗口的呢？</p></blockquote><p><em>我们先来看看第一个例子。</em></p><p>当应用程序没有及时读取缓存时，发送窗口和接收窗口的变化。</p><p>考虑以下场景：</p><ul><li>客户端作为发送方，服务端作为接收方，发送窗口和接收窗口初始大小为 <code>360</code>；</li><li>服务端非常的繁忙，当收到客户端的数据时，应用层不能及时读取数据。</li></ul><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/22.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt=""></p><p>根据上图的流量控制，说明下每个过程：</p><ol><li>客户端发送 140 字节数据后，可用窗口变为 220 （360 - 140）。</li><li>服务端收到 140 字节数据，<strong>但是服务端非常繁忙，应用进程只读取了 40 个字节，还有 100 字节占用着缓冲区，于是接收窗口收缩到了 260 （360 - 100）</strong>，最后发送确认信息时，将窗口大小通告给客户端。</li><li>客户端收到确认和窗口通告报文后，发送窗口减少为 260。</li><li>客户端发送 180 字节数据，此时可用窗口减少到 80。</li><li>服务端收到 180 字节数据，<strong>但是应用程序没有读取任何数据，这 180 字节直接就留在了缓冲区，于是接收窗口收缩到了 80 （260 - 180）</strong>，并在发送确认信息时，通过窗口大小给客户端。</li><li>客户端收到确认和窗口通告报文后，发送窗口减少为 80。</li><li>客户端发送 80 字节数据后，可用窗口耗尽。</li><li>服务端收到 80 字节数据，<strong>但是应用程序依然没有读取任何数据，这 80 字节留在了缓冲区，于是接收窗口收缩到了 0</strong>，并在发送确认信息时，通过窗口大小给客户端。</li><li>客户端收到确认和窗口通告报文后，发送窗口减少为 0。</li></ol><p>可见最后窗口都收缩为 0 了，也就是发生了窗口关闭。当发送方可用窗口变为 0 时，发送方实际上会定时发送窗口探测报文，以便知道接收方的窗口是否发生了改变，这个内容后面会说，这里先简单提一下。</p><p><em>我们先来看看第二个例子。</em></p><p>当服务端系统资源非常紧张的时候，操作系统可能会直接减少了接收缓冲区大小，这时应用程序又无法及时读取缓存数据，那么这时候就有严重的事情发生了，会出现数据包丢失的现象。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/23.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt=""></p><p>说明下每个过程：</p><ol><li>客户端发送 140 字节的数据，于是可用窗口减少到了 220。</li><li><strong>服务端因为现在非常的繁忙，操作系统于是就把接收缓存减少了 120 字节，当收到 140 字节数据后，又因为应用程序没有读取任何数据，所以 140 字节留在了缓冲区中，于是接收窗口大小从 360 收缩成了 100</strong>，最后发送确认信息时，通告窗口大小给对方。</li><li>此时客户端因为还没有收到服务端的通告窗口报文，所以不知道此时接收窗口收缩成了 100，客户端只会看自己的可用窗口还有 220，所以客户端就发送了 180 字节数据，于是可用窗口减少到 40。</li><li>服务端收到了 180 字节数据时，<strong>发现数据大小超过了接收窗口的大小，于是就把数据包丢失了。</strong></li><li>客户端收到第 2 步时，服务端发送的确认报文和通告窗口报文，尝试减少发送窗口到 100，把窗口的右端向左收缩了 80，此时可用窗口的大小就会出现诡异的负值。</li></ol><p>所以，如果发生了先减少缓存，再收缩窗口，就会出现丢包的现象。</p><p><strong>为了防止这种情况发生，TCP 规定是不允许同时减少缓存又收缩窗口的，而是采用先收缩窗口，过段时间再减少缓存，这样就可以避免了丢包情况。</strong></p><h3 id="窗口关闭" tabindex="-1">窗口关闭 <a class="header-anchor" href="#窗口关闭" aria-label="Permalink to &quot;窗口关闭&quot;">​</a></h3><p>在前面我们都看到了，TCP 通过让接收方指明希望从发送方接收的数据大小（窗口大小）来进行流量控制。</p><p><strong>如果窗口大小为 0 时，就会阻止发送方给接收方传递数据，直到窗口变为非 0 为止，这就是窗口关闭。</strong></p><blockquote><p>窗口关闭潜在的危险</p></blockquote><p>接收方向发送方通告窗口大小时，是通过 <code>ACK</code> 报文来通告的。</p><p>那么，当发生窗口关闭时，接收方处理完数据后，会向发送方通告一个窗口非 0 的 ACK 报文，如果这个通告窗口的 ACK 报文在网络中丢失了，那麻烦就大了。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/24.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="窗口关闭潜在的危险"></p><p>这会导致发送方一直等待接收方的非 0 窗口通知，接收方也一直等待发送方的数据，如不采取措施，这种相互等待的过程，会造成了死锁的现象。</p><blockquote><p>TCP 是如何解决窗口关闭时，潜在的死锁现象呢？</p></blockquote><p>为了解决这个问题，TCP 为每个连接设有一个持续定时器，<strong>只要 TCP 连接一方收到对方的零窗口通知，就启动持续计时器。</strong></p><p>如果持续计时器超时，就会发送<strong>窗口探测 ( Window probe ) 报文</strong>，而对方在确认这个探测报文时，给出自己现在的接收窗口大小。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/25.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="窗口探测"></p><ul><li>如果接收窗口仍然为 0，那么收到这个报文的一方就会重新启动持续计时器；</li><li>如果接收窗口不是 0，那么死锁的局面就可以被打破了。</li></ul><p>窗口探测的次数一般为 3 次，每次大约 30-60 秒（不同的实现可能会不一样）。如果 3 次过后接收窗口还是 0 的话，有的 TCP 实现就会发 <code>RST</code> 报文来中断连接。</p><h3 id="糊涂窗口综合症" tabindex="-1">糊涂窗口综合症 <a class="header-anchor" href="#糊涂窗口综合症" aria-label="Permalink to &quot;糊涂窗口综合症&quot;">​</a></h3><p>如果接收方太忙了，来不及取走接收窗口里的数据，那么就会导致发送方的发送窗口越来越小。</p><p>到最后，<strong>如果接收方腾出几个字节并告诉发送方现在有几个字节的窗口，而发送方会义无反顾地发送这几个字节，这就是糊涂窗口综合症</strong>。</p><p>要知道，我们的 <code>TCP + IP</code> 头有 <code>40</code> 个字节，为了传输那几个字节的数据，要搭上这么大的开销，这太不经济了。</p><p>就好像一个可以承载 50 人的大巴车，每次来了一两个人，就直接发车。除非家里有矿的大巴司机，才敢这样玩，不然迟早破产。要解决这个问题也不难，大巴司机等乘客数量超过了 25 个，才认定可以发车。</p><p>现举个糊涂窗口综合症的栗子，考虑以下场景：</p><p>接收方的窗口大小是 360 字节，但接收方由于某些原因陷入困境，假设接收方的应用层读取的能力如下：</p><ul><li>接收方每接收 3 个字节，应用程序就只能从缓冲区中读取 1 个字节的数据；</li><li>在下一个发送方的 TCP 段到达之前，应用程序还从缓冲区中读取了 40 个额外的字节；</li></ul><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/26.png?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="糊涂窗口综合症"></p><p>每个过程的窗口大小的变化，在图中都描述的很清楚了，可以发现窗口不断减少了，并且发送的数据都是比较小的了。</p><p>所以，糊涂窗口综合症的现象是可以发生在发送方和接收方：</p><ul><li>接收方可以通告一个小的窗口</li><li>而发送方可以发送小数据</li></ul><p>于是，要解决糊涂窗口综合症，就要同时解决上面两个问题就可以了：</p><ul><li>让接收方不通告小窗口给发送方</li><li>让发送方避免发送小数据</li></ul><blockquote><p>怎么让接收方不通告小窗口呢？</p></blockquote><p>接收方通常的策略如下:</p><p>当「窗口大小」小于 min( MSS，缓存空间/2 ) ，也就是小于 MSS 与 1/2 缓存大小中的最小值时，就会向发送方通告窗口为 <code>0</code>，也就阻止了发送方再发数据过来。</p><p>等到接收方处理了一些数据后，窗口大小 &gt;= MSS，或者接收方缓存空间有一半可以使用，就可以把窗口打开让发送方发送数据过来。</p><blockquote><p>怎么让发送方避免发送小数据呢？</p></blockquote><p>发送方通常的策略如下:</p><p>使用 Nagle 算法，该算法的思路是延时处理，只有满足下面两个条件中的任意一个条件，才可以发送数据：</p><ul><li>条件一：要等到窗口大小 &gt;= <code>MSS</code> 并且 数据大小 &gt;= <code>MSS</code>；</li><li>条件二：收到之前发送数据的 <code>ack</code> 回包；</li></ul><p>只要上面两个条件都不满足，发送方一直在囤积数据，直到满足上面的发送条件。</p><p>Nagle 伪代码如下：</p><div class="language-c vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 有数据要发送 {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 可用窗口大小 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MSS and 可发送的数据 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MSS {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    	立刻发送MSS大小的数据</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 有未确认的数据 {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            将数据放入缓存等待接收ACK</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            立刻发送数据</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>注意，如果接收方不能满足「不通告小窗口给发送方」，那么即使开了 Nagle 算法，也无法避免糊涂窗口综合症，因为如果对端 ACK 回复很快的话（达到 Nagle 算法的条件二），Nagle 算法就不会拼接太多的数据包，这种情况下依然会有小数据包的传输，网络总体的利用率依然很低。</p><p>所以，<strong>接收方得满足「不通告小窗口给发送方」+ 发送方开启 Nagle 算法，才能避免糊涂窗口综合症</strong>。</p><p>另外，Nagle 算法默认是打开的，如果对于一些需要小数据包交互的场景的程序，比如，telnet 或 ssh 这样的交互性比较强的程序，则需要关闭 Nagle 算法。</p><p>可以在 Socket 设置 <code>TCP_NODELAY</code> 选项来关闭这个算法（关闭 Nagle 算法没有全局参数，需要根据每个应用自己的特点来关闭）</p><div class="language-c vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setsockopt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sock_fd, IPPROTO_TCP, TCP_NODELAY, (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">char</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><hr><h2 id="拥塞控制" tabindex="-1">拥塞控制 <a class="header-anchor" href="#拥塞控制" aria-label="Permalink to &quot;拥塞控制&quot;">​</a></h2><blockquote><p>为什么要有拥塞控制呀，不是有流量控制了吗？</p></blockquote><p>前面的流量控制是避免「发送方」的数据填满「接收方」的缓存，但是并不知道网络的中发生了什么。</p><p>一般来说，计算机网络都处在一个共享的环境。因此也有可能会因为其他主机之间的通信使得网络拥堵。</p><p><strong>在网络出现拥堵时，如果继续发送大量数据包，可能会导致数据包时延、丢失等，这时 TCP 就会重传数据，但是一重传就会导致网络的负担更重，于是会导致更大的延迟以及更多的丢包，这个情况就会进入恶性循环被不断地放大....</strong></p><p>所以，TCP 不能忽略网络上发生的事，它被设计成一个无私的协议，当网络发送拥塞时，TCP 会自我牺牲，降低发送的数据量。</p><p>于是，就有了<strong>拥塞控制</strong>，控制的目的就是<strong>避免「发送方」的数据填满整个网络。</strong></p><p>为了在「发送方」调节所要发送数据的量，定义了一个叫做「<strong>拥塞窗口</strong>」的概念。</p><blockquote><p>什么是拥塞窗口？和发送窗口有什么关系呢？</p></blockquote><p><strong>拥塞窗口 cwnd</strong>是发送方维护的一个的状态变量，它会根据<strong>网络的拥塞程度动态变化的</strong>。</p><p>我们在前面提到过发送窗口 <code>swnd</code> 和接收窗口 <code>rwnd</code> 是约等于的关系，那么由于加入了拥塞窗口的概念后，此时发送窗口的值是swnd = min(cwnd, rwnd)，也就是拥塞窗口和接收窗口中的最小值。</p><p>拥塞窗口 <code>cwnd</code> 变化的规则：</p><ul><li>只要网络中没有出现拥塞，<code>cwnd</code> 就会增大；</li><li>但网络中出现了拥塞，<code>cwnd</code> 就减少；</li></ul><blockquote><p>那么怎么知道当前网络是否出现了拥塞呢？</p></blockquote><p>其实只要「发送方」没有在规定时间内接收到 ACK 应答报文，也就是<strong>发生了超时重传，就会认为网络出现了拥塞。</strong></p><blockquote><p>拥塞控制有哪些控制算法？</p></blockquote><p>拥塞控制主要是四个算法：</p><ul><li>慢启动</li><li>拥塞避免</li><li>拥塞发生</li><li>快速恢复</li></ul><h3 id="慢启动" tabindex="-1">慢启动 <a class="header-anchor" href="#慢启动" aria-label="Permalink to &quot;慢启动&quot;">​</a></h3><p>TCP 在刚建立连接完成后，首先是有个慢启动的过程，这个慢启动的意思就是一点一点的提高发送数据包的数量，如果一上来就发大量的数据，这不是给网络添堵吗？</p><p>慢启动的算法记住一个规则就行：<strong>当发送方每收到一个 ACK，拥塞窗口 cwnd 的大小就会加 1。</strong></p><p>这里假定拥塞窗口 <code>cwnd</code> 和发送窗口 <code>swnd</code> 相等，下面举个栗子：</p><ul><li>连接建立完成后，一开始初始化 <code>cwnd = 1</code>，表示可以传一个 <code>MSS</code> 大小的数据。</li><li>当收到一个 ACK 确认应答后，cwnd 增加 1，于是一次能够发送 2 个</li><li>当收到 2 个的 ACK 确认应答后， cwnd 增加 2，于是就可以比之前多发2 个，所以这一次能够发送 4 个</li><li>当这 4 个的 ACK 确认到来的时候，每个确认 cwnd 增加 1， 4 个确认 cwnd 增加 4，于是就可以比之前多发 4 个，所以这一次能够发送 8 个。</li></ul><p>慢启动算法的变化过程如下图：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/27.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="慢启动算法"></p><p>可以看出慢启动算法，发包的个数是<strong>指数性的增长</strong>。</p><blockquote><p>那慢启动涨到什么时候是个头呢？</p></blockquote><p>有一个叫慢启动门限 <code>ssthresh</code> （slow start threshold）状态变量。</p><ul><li>当 <code>cwnd</code> &lt; <code>ssthresh</code> 时，使用慢启动算法。</li><li>当 <code>cwnd</code> &gt;= <code>ssthresh</code> 时，就会使用「拥塞避免算法」。</li></ul><h3 id="拥塞避免算法" tabindex="-1">拥塞避免算法 <a class="header-anchor" href="#拥塞避免算法" aria-label="Permalink to &quot;拥塞避免算法&quot;">​</a></h3><p>前面说道，当拥塞窗口 <code>cwnd</code> 「超过」慢启动门限 <code>ssthresh</code> 就会进入拥塞避免算法。</p><p>一般来说 <code>ssthresh</code> 的大小是 <code>65535</code> 字节。</p><p>那么进入拥塞避免算法后，它的规则是：<strong>每当收到一个 ACK 时，cwnd 增加 1/cwnd。</strong></p><p>接上前面的慢启动的栗子，现假定 <code>ssthresh</code> 为 <code>8</code>：</p><ul><li>当 8 个 ACK 应答确认到来时，每个确认增加 1/8，8 个 ACK 确认 cwnd 一共增加 1，于是这一次能够发送 9 个 <code>MSS</code> 大小的数据，变成了<strong>线性增长。</strong></li></ul><p>拥塞避免算法的变化过程如下图：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/28.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="拥塞避免"></p><p>所以，我们可以发现，拥塞避免算法就是将原本慢启动算法的指数增长变成了线性增长，还是增长阶段，但是增长速度缓慢了一些。</p><p>就这么一直增长着后，网络就会慢慢进入了拥塞的状况了，于是就会出现丢包现象，这时就需要对丢失的数据包进行重传。</p><p>当触发了重传机制，也就进入了「拥塞发生算法」。</p><h3 id="拥塞发生" tabindex="-1">拥塞发生 <a class="header-anchor" href="#拥塞发生" aria-label="Permalink to &quot;拥塞发生&quot;">​</a></h3><p>当网络出现拥塞，也就是会发生数据包重传，重传机制主要有两种：</p><ul><li>超时重传</li><li>快速重传</li></ul><p>这两种使用的拥塞发送算法是不同的，接下来分别来说说。</p><blockquote><p>发生超时重传的拥塞发生算法</p></blockquote><p>当发生了「超时重传」，则就会使用拥塞发生算法。</p><p>这个时候，ssthresh 和 cwnd 的值会发生变化：</p><ul><li><code>ssthresh</code> 设为 <code>cwnd/2</code>，</li><li><code>cwnd</code> 重置为 <code>1</code> （是恢复为 cwnd 初始化值，我这里假定 cwnd 初始化值 1）</li></ul><blockquote><p>怎么查看系统的 cwnd 初始化值？</p></blockquote><p>Linux 针对每一个 TCP 连接的 cwnd 初始化值是 10，也就是 10 个 MSS，我们可以用 ss -nli 命令查看每一个 TCP 连接的 cwnd 初始化值，如下图</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/cwnd.png" alt=""></p><p>拥塞发生算法的变化如下图：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/TCP-%E5%8F%AF%E9%9D%A0%E7%89%B9%E6%80%A7/29.jpg?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="拥塞发送 —— 超时重传"></p><p>接着，就重新开始慢启动，慢启动是会突然减少数据流的。这真是一旦「超时重传」，马上回到解放前。但是这种方式太激进了，反应也很强烈，会造成网络卡顿。</p><p>就好像本来在秋名山高速漂移着，突然来个紧急刹车，轮胎受得了吗。。。</p><blockquote><p>发生快速重传的拥塞发生算法</p></blockquote><p>还有更好的方式，前面我们讲过「快速重传算法」。当接收方发现丢了一个中间包的时候，发送三次前一个包的 ACK，于是发送端就会快速地重传，不必等待超时再重传。</p><p>TCP 认为这种情况不严重，因为大部分没丢，只丢了一小部分，则 <code>ssthresh</code> 和 <code>cwnd</code> 变化如下：</p><ul><li><code>cwnd = cwnd/2</code> ，也就是设置为原来的一半;</li><li><code>ssthresh = cwnd</code>;</li><li>进入快速恢复算法</li></ul><h3 id="快速恢复" tabindex="-1">快速恢复 <a class="header-anchor" href="#快速恢复" aria-label="Permalink to &quot;快速恢复&quot;">​</a></h3><p>快速重传和快速恢复算法一般同时使用，快速恢复算法是认为，你还能收到 3 个重复 ACK 说明网络也不那么糟糕，所以没有必要像 <code>RTO</code> 超时那么强烈。</p><p>正如前面所说，进入快速恢复之前，<code>cwnd</code> 和 <code>ssthresh</code> 已被更新了：</p><ul><li><code>cwnd = cwnd/2</code> ，也就是设置为原来的一半;</li><li><code>ssthresh = cwnd</code>;</li></ul><p>然后，进入快速恢复算法如下：</p><ul><li>拥塞窗口 <code>cwnd = ssthresh + 3</code> （ 3 的意思是确认有 3 个数据包被收到了）；</li><li>重传丢失的数据包；</li><li>如果再收到重复的 ACK，那么 cwnd 增加 1；</li><li>如果收到新数据的 ACK 后，把 cwnd 设置为第一步中的 ssthresh 的值，原因是该 ACK 确认了新的数据，说明从 duplicated ACK 时的数据都已收到，该恢复过程已经结束，可以回到恢复之前的状态了，也即再次进入拥塞避免状态；</li></ul><p>快速恢复算法的变化过程如下图：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/%E6%8B%A5%E5%A1%9E%E5%8F%91%E7%94%9F-%E5%BF%AB%E9%80%9F%E9%87%8D%E4%BC%A0.drawio.png?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt="快速重传和快速恢复"></p><p>也就是没有像「超时重传」一夜回到解放前，而是还在比较高的值，后续呈线性增长。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>很多人问题，快速恢复算法过程中，为什么收到新的数据后，cwnd 设置回了 ssthresh ？</p><p>我在评论区看到@<a href="https://github.com/muum641651" target="_blank" rel="noreferrer">muum641651</a>回答的不错，这里贴出来给大家。</p><p>我的理解是：</p><ol><li>在快速恢复的过程中，首先 ssthresh = cwnd/2，然后 cwnd = ssthresh + 3，表示网络可能出现了阻塞，所以需要减小 cwnd 以避免，加 3 代表快速重传时已经确认接收到了 3 个重复的数据包；</li><li>随后继续重传丢失的数据包，如果再收到重复的 ACK，那么 cwnd 增加 1。加 1 代表每个收到的重复的 ACK 包，都已经离开了网络。这个过程的目的是尽快将丢失的数据包发给目标。</li><li>如果收到新数据的 ACK 后，把 cwnd 设置为第一步中的 ssthresh 的值，恢复过程结束。</li></ol><p><strong>首先，快速恢复是拥塞发生后慢启动的优化，其首要目的仍然是降低 cwnd 来减缓拥塞，所以必然会出现 cwnd 从大到小的改变。</strong></p><p><strong>其次，过程2（cwnd逐渐加1）的存在是为了尽快将丢失的数据包发给目标，从而解决拥塞的根本问题（三次相同的 ACK 导致的快速重传），所以这一过程中 cwnd 反而是逐渐增大的。</strong></p></div><hr><p>参考资料：</p><p>[1] 趣谈网络协议专栏.刘超.极客时间</p><p>[2] Web协议详解与抓包实战专栏.陶辉.极客时间</p><p>[3] TCP/IP详解 卷1：协议.范建华 译.机械工业出版社</p><p>[4] 图解TCP/IP.竹下隆史.人民邮电出版社</p><p>[5] The TCP/IP Guide.Charles M. Kozierok.</p><p>[6] TCP那些事（上）.陈皓.酷壳博客. <a href="https://coolshell.cn/articles/11564.html" target="_blank" rel="noreferrer">https://coolshell.cn/articles/11564.html</a></p><p>[7] TCP那些事（下）.陈皓.酷壳博客.<a href="https://coolshell.cn/articles/11609.html" target="_blank" rel="noreferrer">https://coolshell.cn/articles/11609.html</a></p><hr><h2 id="读者问答" tabindex="-1">读者问答 <a class="header-anchor" href="#读者问答" aria-label="Permalink to &quot;读者问答&quot;">​</a></h2><blockquote><p>读者问：“整个看完收获很大，下面是我的一些疑问（稍后 会去确认）： 1.拥塞避免这一段，蓝色字体：每当收到一个 ACK时，cwnd增加1/cwnd。是否应该是 1/ssthresh?否则不符合线性增长。 2.快速重传的拥塞发生算法，步骤一和步骤2是 否写反了？否则快速恢复算法中最后一步【如果 收到新数据的ACK后，设置cwnd为 ssthresh,接看就进入了拥塞避免算法】没什么 意义。 3.对ssthresh的变化介绍的比较含糊。”</p></blockquote><ol><li>是 1/cwnd，你可以在 RFC2581 第 3 页找到答案</li><li>没有写反，同样你可以在 RFC2581 第 5 页找到答案</li><li>ssthresh 就是慢启动门限，我觉得 ssthresh 我已经说的很清楚了，当然你可以找其他资料补充你的疑惑</li></ol><hr><p>是吧？ TCP 巨复杂吧？看完很累吧？</p><p>但这还只是 TCP 冰山一脚，它的更深处就由你们自己去探索啦。</p><p><strong>小林是专为大家图解的工具人，Goodbye，我们下次见！</strong></p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E5%85%B6%E4%BB%96/%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BB%8B%E7%BB%8D.png?image_process=watermark,text_5YWs5LyX5Y-377ya5bCP5p6XY29kaW5n,type_ZnpsdHpoaw,x_10,y_10,g_se,size_20,color_0000CD,t_70,fill_0" alt=""></p>`,281),a=[l];function t(c,n,r,d,E,g){return i(),o("div",null,a)}const _=e(p,[["render",t]]);export{A as __pageData,_ as default};
