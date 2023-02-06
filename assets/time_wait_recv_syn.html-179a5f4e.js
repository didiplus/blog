import{ab as p,G as e,H as o,E as n,S as s,N as c,ad as a,W as i}from"./framework-b31a425c.js";const l={},u=a(`<h1 id="_4-11-在-time-wait-状态的-tcp-连接-收到-syn-后会发生什么" tabindex="-1"><a class="header-anchor" href="#_4-11-在-time-wait-状态的-tcp-连接-收到-syn-后会发生什么" aria-hidden="true">#</a> 4.11 在 TIME_WAIT 状态的 TCP 连接，收到 SYN 后会发生什么？</h1><p>大家好，我是小林。</p><p>周末跟朋友讨论了一些 TCP 的问题，在查阅《Linux 服务器高性能编程》这本书的时候，发现书上写了这么一句话：</p><figure><img src="https://img-blog.csdnimg.cn/img_convert/65739ee668999bda02aa9236aad6437f.png" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>书上说，处于 TIME_WAIT 状态的连接，在收到相同四元组的 SYN 后，会回 RST 报文，对方收到后就会断开连接。</p><p>书中作者只是提了这么一句话，没有给予源码或者抓包图的证据。</p><p>起初，我看到也觉得这个逻辑也挺符合常理的，但是当我自己去啃了 TCP 源码后，发现并不是这样的。</p><p>所以，今天就来讨论下这个问题，「<strong>在 TCP 正常挥手过程中，处于 TIME_WAIT 状态的连接，收到相同四元组的 SYN 后会发生什么？</strong>」</p><p>问题现象如下图，左边是服务端，右边是客户端：</p><figure><img src="https://img-blog.csdnimg.cn/img_convert/74b53919396dcda634cfd5b5795cbf16.png" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h2 id="先说结论" tabindex="-1"><a class="header-anchor" href="#先说结论" aria-hidden="true">#</a> 先说结论</h2><p>在跟大家分析 TCP 源码前，我先跟大家直接说下结论。</p><p>针对这个问题，<strong>关键是要看 SYN 的「序列号和时间戳」是否合法</strong>，因为处于 TIME_WAIT 状态的连接收到 SYN 后，会判断 SYN 的「序列号和时间戳」是否合法，然后根据判断结果的不同做不同的处理。</p><p>先跟大家说明下， 什么是「合法」的 SYN？</p><ul><li><strong>合法 SYN</strong>：客户端的 SYN 的「序列号」比服务端「期望下一个收到的序列号」要<strong>大</strong>，<strong>并且</strong> SYN 的「时间戳」比服务端「最后收到的报文的时间戳」要<strong>大</strong>。</li><li><strong>非法 SYN</strong>：客户端的 SYN 的「序列号」比服务端「期望下一个收到的序列号」要<strong>小</strong>，<strong>或者</strong> SYN 的「时间戳」比服务端「最后收到的报文的时间戳」要<strong>小</strong>。</li></ul><p>上面 SYN 合法判断是基于双方都开启了 TCP 时间戳机制的场景，如果双方都没有开启 TCP 时间戳机制，则 SYN 合法判断如下：</p><ul><li><strong>合法 SYN</strong>：客户端的 SYN 的「序列号」比服务端「期望下一个收到的序列号」要<strong>大</strong>。</li><li><strong>非法 SYN</strong>：客户端的 SYN 的「序列号」比服务端「期望下一个收到的序列号」要<strong>小</strong>。</li></ul><h3 id="收到合法-syn" tabindex="-1"><a class="header-anchor" href="#收到合法-syn" aria-hidden="true">#</a> 收到合法 SYN</h3><p>如果处于 TIME_WAIT 状态的连接收到「合法的 SYN 」后，<strong>就会重用此四元组连接，跳过 2MSL 而转变为 SYN_RECV 状态，接着就能进行建立连接过程</strong>。</p><p>用下图作为例子，双方都启用了 TCP 时间戳机制，TSval 是发送报文时的时间戳：</p><figure><img src="https://img-blog.csdnimg.cn/img_convert/39d0d04adf72fe3d37623acff9ae2507.png" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>上图中，在收到第三次挥手的 FIN 报文时，会记录该报文的 TSval （21），用 ts_recent 变量保存。然后会计算下一次期望收到的序列号，本次例子下一次期望收到的序列号就是 301，用 rcv_nxt 变量保存。</p><p>处于 TIME_WAIT 状态的连接收到 SYN 后，<strong>因为 SYN 的 seq（400） 大于 rcv_nxt（301），并且 SYN 的 TSval（30） 大于 ts_recent（21），所以是一个「合法的 SYN」，于是就会重用此四元组连接，跳过 2MSL 而转变为 SYN_RECV 状态，接着就能进行建立连接过程。</strong></p><h3 id="收到非法的-syn" tabindex="-1"><a class="header-anchor" href="#收到非法的-syn" aria-hidden="true">#</a> 收到非法的 SYN</h3><p>如果处于 TIME_WAIT 状态的连接收到「非法的 SYN 」后，就会<strong>再回复一个第四次挥手的 ACK 报文，客户端收到后，发现并不是自己期望收到确认号（ack num），就回 RST 报文给服务端</strong>。</p><p>用下图作为例子，双方都启用了 TCP 时间戳机制，TSval 是发送报文时的时间戳：</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/network/tcp/tw收到不合法.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上图中，在收到第三次挥手的 FIN 报文时，会记录该报文的 TSval （21），用 ts_recent 变量保存。然后会计算下一次期望收到的序列号，本次例子下一次期望收到的序列号就是 301，用 rcv_nxt 变量保存。</p><p>处于 TIME_WAIT 状态的连接收到 SYN 后，<strong>因为 SYN 的 seq（200） 小于 rcv_nxt（301），所以是一个「非法的 SYN」，就会再回复一个与第四次挥手一样的 ACK 报文，客户端收到后，发现并不是自己期望收到确认号，就回 RST 报文给服务端</strong>。</p><blockquote><p>PS：这里先埋一个疑问，处于 TIME_WAIT 状态的连接，收到 RST 会断开连接吗？</p></blockquote><h2 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析" aria-hidden="true">#</a> 源码分析</h2><p>下面源码分析是基于 Linux 4.2 版本的内核代码。</p><p>Linux 内核在收到 TCP 报文后，会执行 <code>tcp_v4_rcv</code> 函数，在该函数和 TIME_WAIT 状态相关的主要代码如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">tcp_v4_rcv</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">sk_buff</span> <span class="token operator">*</span>skb<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">struct</span> <span class="token class-name">sock</span> <span class="token operator">*</span>sk<span class="token punctuation">;</span>
 <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token comment">//收到报文后，会调用此函数，查找对应的 sock</span>
 sk <span class="token operator">=</span> <span class="token function">__inet_lookup_skb</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>tcp_hashinfo<span class="token punctuation">,</span> skb<span class="token punctuation">,</span> <span class="token function">__tcp_hdrlen</span><span class="token punctuation">(</span>th<span class="token punctuation">)</span><span class="token punctuation">,</span> th<span class="token operator">-&gt;</span>source<span class="token punctuation">,</span>
          th<span class="token operator">-&gt;</span>dest<span class="token punctuation">,</span> sdif<span class="token punctuation">,</span> <span class="token operator">&amp;</span>refcounted<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>sk<span class="token punctuation">)</span>
  <span class="token keyword">goto</span> no_tcp_socket<span class="token punctuation">;</span>

process<span class="token operator">:</span>
  <span class="token comment">//如果连接的状态为 time_wait，会跳转到 do_time_wait</span>
 <span class="token keyword">if</span> <span class="token punctuation">(</span>sk<span class="token operator">-&gt;</span>sk_state <span class="token operator">==</span> TCP_TIME_WAIT<span class="token punctuation">)</span>
  <span class="token keyword">goto</span> do_time_wait<span class="token punctuation">;</span>

<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

do_time_wait<span class="token operator">:</span>
  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token comment">//由tcp_timewait_state_process函数处理在 time_wait 状态收到的报文</span>
 <span class="token keyword">switch</span> <span class="token punctuation">(</span><span class="token function">tcp_timewait_state_process</span><span class="token punctuation">(</span><span class="token function">inet_twsk</span><span class="token punctuation">(</span>sk<span class="token punctuation">)</span><span class="token punctuation">,</span> skb<span class="token punctuation">,</span> th<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果是TCP_TW_SYN，那么允许此 SYN 重建连接</span>
    <span class="token comment">// 即允许TIM_WAIT状态跃迁到SYN_RECV</span>
    <span class="token keyword">case</span> TCP_TW_SYN<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">struct</span> <span class="token class-name">sock</span> <span class="token operator">*</span>sk2 <span class="token operator">=</span> <span class="token function">inet_lookup_listener</span><span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>sk2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
          <span class="token keyword">goto</span> process<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果是TCP_TW_ACK，那么，返回记忆中的ACK</span>
    <span class="token keyword">case</span> TCP_TW_ACK<span class="token operator">:</span>
      <span class="token function">tcp_v4_timewait_ack</span><span class="token punctuation">(</span>sk<span class="token punctuation">,</span> skb<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token comment">// 如果是TCP_TW_RST直接发送RESET包</span>
    <span class="token keyword">case</span> TCP_TW_RST<span class="token operator">:</span>
      <span class="token function">tcp_v4_send_reset</span><span class="token punctuation">(</span>sk<span class="token punctuation">,</span> skb<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">inet_twsk_deschedule_put</span><span class="token punctuation">(</span><span class="token function">inet_twsk</span><span class="token punctuation">(</span>sk<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">goto</span> discard_it<span class="token punctuation">;</span>
     <span class="token comment">// 如果是TCP_TW_SUCCESS则直接丢弃此包，不做任何响应</span>
    <span class="token keyword">case</span> TCP_TW_SUCCESS<span class="token operator">:</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 <span class="token keyword">goto</span> discard_it<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该代码的过程：</p><ol><li>接收到报文后，会调用 <code>__inet_lookup_skb()</code> 函数查找对应的 sock 结构；</li><li>如果连接的状态是 <code>TIME_WAIT</code>，会跳转到 do_time_wait 处理；</li><li>由 <code>tcp_timewait_state_process()</code> 函数来处理收到的报文，处理后根据返回值来做相应的处理。</li></ol><p>先跟大家说下，如果收到的 SYN 是合法的，<code>tcp_timewait_state_process()</code> 函数就会返回 <code>TCP_TW_SYN</code>，然后重用此连接。如果收到的 SYN 是非法的，<code>tcp_timewait_state_process()</code> 函数就会返回 <code>TCP_TW_ACK</code>，然后会回上次发过的 ACK。</p><p>接下来，看 <code>tcp_timewait_state_process()</code> 函数是如何判断 SYN 包的。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">enum</span> <span class="token class-name">tcp_tw_status</span>
<span class="token function">tcp_timewait_state_process</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">inet_timewait_sock</span> <span class="token operator">*</span>tw<span class="token punctuation">,</span> <span class="token keyword">struct</span> <span class="token class-name">sk_buff</span> <span class="token operator">*</span>skb<span class="token punctuation">,</span>
      <span class="token keyword">const</span> <span class="token keyword">struct</span> <span class="token class-name">tcphdr</span> <span class="token operator">*</span>th<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
 <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token comment">//paws_reject 为 false，表示没有发生时间戳回绕</span>
  <span class="token comment">//paws_reject 为 true，表示发生了时间戳回绕</span>
 bool paws_reject <span class="token operator">=</span> false<span class="token punctuation">;</span>

 tmp_opt<span class="token punctuation">.</span>saw_tstamp <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token comment">//TCP头中有选项且旧连接开启了时间戳选项</span>
 <span class="token keyword">if</span> <span class="token punctuation">(</span>th<span class="token operator">-&gt;</span>doff <span class="token operator">&gt;</span> <span class="token punctuation">(</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token operator">*</span>th<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> tcptw<span class="token operator">-&gt;</span>tw_ts_recent_stamp<span class="token punctuation">)</span> <span class="token punctuation">{</span> 
  <span class="token comment">//解析选项</span>
    <span class="token function">tcp_parse_options</span><span class="token punctuation">(</span><span class="token function">twsk_net</span><span class="token punctuation">(</span>tw<span class="token punctuation">)</span><span class="token punctuation">,</span> skb<span class="token punctuation">,</span> <span class="token operator">&amp;</span>tmp_opt<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>tmp_opt<span class="token punctuation">.</span>saw_tstamp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
      <span class="token comment">//检查收到的报文的时间戳是否发生了时间戳回绕</span>
   paws_reject <span class="token operator">=</span> <span class="token function">tcp_paws_reject</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>tmp_opt<span class="token punctuation">,</span> th<span class="token operator">-&gt;</span>rst<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>

<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

  <span class="token comment">//是SYN包、没有RST、没有ACK、时间戳没有回绕，并且序列号也没有回绕，</span>
 <span class="token keyword">if</span> <span class="token punctuation">(</span>th<span class="token operator">-&gt;</span>syn <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>th<span class="token operator">-&gt;</span>rst <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>th<span class="token operator">-&gt;</span>ack <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>paws_reject <span class="token operator">&amp;&amp;</span>
     <span class="token punctuation">(</span><span class="token function">after</span><span class="token punctuation">(</span><span class="token function">TCP_SKB_CB</span><span class="token punctuation">(</span>skb<span class="token punctuation">)</span><span class="token operator">-&gt;</span>seq<span class="token punctuation">,</span> tcptw<span class="token operator">-&gt;</span>tw_rcv_nxt<span class="token punctuation">)</span> <span class="token operator">||</span>
      <span class="token punctuation">(</span>tmp_opt<span class="token punctuation">.</span>saw_tstamp <span class="token operator">&amp;&amp;</span> <span class="token comment">//新连接开启了时间戳</span>
       <span class="token punctuation">(</span>s32<span class="token punctuation">)</span><span class="token punctuation">(</span>tcptw<span class="token operator">-&gt;</span>tw_ts_recent <span class="token operator">-</span> tmp_opt<span class="token punctuation">.</span>rcv_tsval<span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//时间戳没有回绕</span>
    <span class="token comment">// 初始化序列号</span>
    u32 isn <span class="token operator">=</span> tcptw<span class="token operator">-&gt;</span>tw_snd_nxt <span class="token operator">+</span> <span class="token number">65535</span> <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">;</span> 
    <span class="token keyword">if</span> <span class="token punctuation">(</span>isn <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
      isn<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token function">TCP_SKB_CB</span><span class="token punctuation">(</span>skb<span class="token punctuation">)</span><span class="token operator">-&gt;</span>tcp_tw_isn <span class="token operator">=</span> isn<span class="token punctuation">;</span>
    <span class="token keyword">return</span> TCP_TW_SYN<span class="token punctuation">;</span> <span class="token comment">//允许重用TIME_WAIT四元组重新建立连接</span>
 <span class="token punctuation">}</span>


 <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>th<span class="token operator">-&gt;</span>rst<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果时间戳回绕，或者报文里包含ack，则将 TIMEWAIT 状态的持续时间重新延长</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>paws_reject <span class="token operator">||</span> th<span class="token operator">-&gt;</span>ack<span class="token punctuation">)</span>
    <span class="token function">inet_twsk_schedule</span><span class="token punctuation">(</span>tw<span class="token punctuation">,</span> <span class="token operator">&amp;</span>tcp_death_row<span class="token punctuation">,</span> TCP_TIMEWAIT_LEN<span class="token punctuation">,</span>
        TCP_TIMEWAIT_LEN<span class="token punctuation">)</span><span class="token punctuation">;</span>

     <span class="token comment">// 返回TCP_TW_ACK, 发送上一次的 ACK</span>
    <span class="token keyword">return</span> TCP_TW_ACK<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 <span class="token function">inet_twsk_put</span><span class="token punctuation">(</span>tw<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">return</span> TCP_TW_SUCCESS<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果双方启用了 TCP 时间戳机制，就会通过 <code>tcp_paws_reject()</code> 函数来判断时间戳是否发生了回绕，也就是「当前收到的报文的时间戳」是否大于「上一次收到的报文的时间戳」：</p><ul><li>如果大于，就说明没有发生时间戳绕回，函数返回 false。</li><li>如果小于，就说明发生了时间戳回绕，函数返回 true。</li></ul><p>从源码可以看到，当收到 SYN 包后，如果该 SYN 包的时间戳没有发生回绕，也就是时间戳是递增的，并且 SYN 包的序列号也没有发生回绕，也就是 SYN 的序列号「大于」下一次期望收到的序列号。就会初始化一个序列号，然后返回 TCP_TW_SYN，接着就重用该连接，也就跳过 2MSL 而转变为 SYN_RECV 状态，接着就能进行建立连接过程。</p><p>如果双方都没有启用 TCP 时间戳机制，就只需要判断 SYN 包的序列号有没有发生回绕，如果 SYN 的序列号大于下一次期望收到的序列号，就可以跳过 2MSL，重用该连接。</p><p>如果 SYN 包是非法的，就会返回 TCP_TW_ACK，接着就会发送与上一次一样的 ACK 给对方。</p><h2 id="在-time-wait-状态-收到-rst-会断开连接吗" tabindex="-1"><a class="header-anchor" href="#在-time-wait-状态-收到-rst-会断开连接吗" aria-hidden="true">#</a> 在 TIME_WAIT 状态，收到 RST 会断开连接吗？</h2><p>在前面我留了一个疑问，处于 TIME_WAIT 状态的连接，收到 RST 会断开连接吗？</p><p>会不会断开，关键看 <code>net.ipv4.tcp_rfc1337</code> 这个内核参数（默认情况是为 0）：</p><ul><li>如果这个参数设置为 0， 收到 RST 报文会提前结束 TIME_WAIT 状态，释放连接。</li><li>如果这个参数设置为 1， 就会丢掉 RST 报文。</li></ul><p>源码处理如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">enum</span> <span class="token class-name">tcp_tw_status</span>
<span class="token function">tcp_timewait_state_process</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">inet_timewait_sock</span> <span class="token operator">*</span>tw<span class="token punctuation">,</span> <span class="token keyword">struct</span> <span class="token class-name">sk_buff</span> <span class="token operator">*</span>skb<span class="token punctuation">,</span>
      <span class="token keyword">const</span> <span class="token keyword">struct</span> <span class="token class-name">tcphdr</span> <span class="token operator">*</span>th<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token comment">//rst报文的时间戳没有发生回绕</span>
 <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>paws_reject <span class="token operator">&amp;&amp;</span>
     <span class="token punctuation">(</span><span class="token function">TCP_SKB_CB</span><span class="token punctuation">(</span>skb<span class="token punctuation">)</span><span class="token operator">-&gt;</span>seq <span class="token operator">==</span> tcptw<span class="token operator">-&gt;</span>tw_rcv_nxt <span class="token operator">&amp;&amp;</span>
      <span class="token punctuation">(</span><span class="token function">TCP_SKB_CB</span><span class="token punctuation">(</span>skb<span class="token punctuation">)</span><span class="token operator">-&gt;</span>seq <span class="token operator">==</span> <span class="token function">TCP_SKB_CB</span><span class="token punctuation">(</span>skb<span class="token punctuation">)</span><span class="token operator">-&gt;</span>end_seq <span class="token operator">||</span> th<span class="token operator">-&gt;</span>rst<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

      <span class="token comment">//处理rst报文</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>th<span class="token operator">-&gt;</span>rst<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//不开启这个选项，当收到 RST 时会立即回收tw，但这样做是有风险的</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">twsk_net</span><span class="token punctuation">(</span>tw<span class="token punctuation">)</span><span class="token operator">-&gt;</span>ipv4<span class="token punctuation">.</span>sysctl_tcp_rfc1337 <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          kill<span class="token operator">:</span>
          <span class="token comment">//删除tw定时器，并释放tw</span>
          <span class="token function">inet_twsk_deschedule_put</span><span class="token punctuation">(</span>tw<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token keyword">return</span> TCP_TW_SUCCESS<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">//将 TIMEWAIT 状态的持续时间重新延长</span>
        <span class="token function">inet_twsk_reschedule</span><span class="token punctuation">(</span>tw<span class="token punctuation">,</span> TCP_TIMEWAIT_LEN<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
      <span class="token keyword">return</span> TCP_TW_SUCCESS<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TIME_WAIT 状态收到 RST 报文而释放连接，这样等于跳过 2MSL 时间，这么做还是有风险。</p><p>sysctl_tcp_rfc1337 这个参数是在 rfc 1337 文档提出来的，目的是避免因为 TIME_WAIT 状态收到 RST 报文而跳过 2MSL 的时间，文档里也给出跳过 2MSL 时间会有什么潜在问题。</p><p>TIME_WAIT 状态之所以要持续 2MSL 时间，主要有两个目的：</p><ul><li>防止历史连接中的数据，被后面相同四元组的连接错误的接收；</li><li>保证「被动关闭连接」的一方，能被正确的关闭；</li></ul>`,54),r={href:"https://mp.weixin.qq.com/s?__biz=MzUxODAzNDg4NQ==&mid=2247502380&idx=1&sn=7b82818a5fb6f1127d17f0ded550c4bd&scene=21#wechat_redirect",target:"_blank",rel:"noopener noreferrer"},k=a('<p>虽然 TIME_WAIT 状态持续的时间是有一点长，显得很不友好，但是它被设计来就是用来避免发生乱七八糟的事情。</p><p>《UNIX网络编程》一书中却说道：<strong>TIME_WAIT 是我们的朋友，它是有助于我们的，不要试图避免这个状态，而是应该弄清楚它</strong>。</p><p>所以，我个人觉得将 <code>net.ipv4.tcp_rfc1337</code> 设置为 1 会比较安全。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>在 TCP 正常挥手过程中，处于 TIME_WAIT 状态的连接，收到相同四元组的 SYN 后会发生什么？</p><p>如果双方开启了时间戳机制：</p><ul><li>如果客户端的 SYN 的「序列号」比服务端「期望下一个收到的序列号」要<strong>大</strong>，<strong>并且</strong>SYN 的「时间戳」比服务端「最后收到的报文的时间戳」要<strong>大</strong>。那么就会重用该四元组连接，跳过 2MSL 而转变为 SYN_RECV 状态，接着就能进行建立连接过程。</li><li>如果客户端的 SYN 的「序列号」比服务端「期望下一个收到的序列号」要<strong>小</strong>，<strong>或者</strong>SYN 的「时间戳」比服务端「最后收到的报文的时间戳」要<strong>小</strong>。那么就会<strong>再回复一个第四次挥手的 ACK 报文，客户端收到后，发现并不是自己期望收到确认号，就回 RST 报文给服务端</strong>。</li></ul><p>在 TIME_WAIT 状态，收到 RST 会断开连接吗？</p><ul><li>如果 <code>net.ipv4.tcp_rfc1337</code> 参数为 0，则提前结束 TIME_WAIT 状态，释放连接。</li><li>如果 <code>net.ipv4.tcp_rfc1337</code> 参数为 1，则会丢掉该 RST 报文。</li></ul><p>完！</p><hr><p>最新的图解文章都在公众号首发，别忘记关注哦！！如果你想加入百人技术交流群，扫码下方二维码回复「加群」。</p><figure><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/其他/公众号介绍.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>',13);function d(m,v){const t=i("ExternalLinkIcon");return e(),o("div",null,[u,n("p",null,[s("详细的为什么要设计 TIME_WAIT 状态，我在这篇有详细说明："),n("a",r,[s("如果 TIME_WAIT 状态持续时间过短或者没有，会有什么问题？"),c(t)])]),k])}const b=p(l,[["render",d],["__file","time_wait_recv_syn.html.vue"]]);export{b as default};
