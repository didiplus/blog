import{ab as l,G as t,H as p,E as a,S as e,N as s,ad as i,W as o}from"./framework-894cff3a.js";const r={},c=i(`<h1 id="gc-java-垃圾回收基础知识" tabindex="-1"><a class="header-anchor" href="#gc-java-垃圾回收基础知识" aria-hidden="true">#</a> GC - Java 垃圾回收基础知识</h1><blockquote><p>垃圾收集主要是针对堆和方法区进行；程序计数器、虚拟机栈和本地方法栈这三个区域属于线程私有的，只存在于线程的生命周期内，线程结束之后也会消失，因此不需要对这三个区域进行垃圾回收。</p></blockquote><h2 id="_1-判断一个对象是否可被回收" tabindex="-1"><a class="header-anchor" href="#_1-判断一个对象是否可被回收" aria-hidden="true">#</a> 1. 判断一个对象是否可被回收</h2><h3 id="_1-1-引用计数算法" tabindex="-1"><a class="header-anchor" href="#_1-1-引用计数算法" aria-hidden="true">#</a> 1.1 引用计数算法</h3><p>给对象添加一个引用计数器，当对象增加一个引用时计数器加 1，引用失效时计数器减 1。引用计数为 0 的对象可被回收。</p><p>两个对象出现循环引用的情况下，此时引用计数器永远不为 0，导致无法对它们进行回收。</p><p><strong>正因为循环引用的存在，因此 Java 虚拟机不使用引用计数算法。</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ReferenceCountingGC</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token class-name">Object</span> instance <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ReferenceCountingGC</span> objectA <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReferenceCountingGC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ReferenceCountingGC</span> objectB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReferenceCountingGC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        objectA<span class="token punctuation">.</span>instance <span class="token operator">=</span> objectB<span class="token punctuation">;</span>
        objectB<span class="token punctuation">.</span>instance <span class="token operator">=</span> objectA<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-可达性分析算法" tabindex="-1"><a class="header-anchor" href="#_1-2-可达性分析算法" aria-hidden="true">#</a> 1.2 可达性分析算法</h3><p>通过 GC Roots 作为起始点进行搜索，能够到达到的对象都是存活的，不可达的对象可被回收。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822201955643.png" alt="image-20220822201955643" tabindex="0" loading="lazy"><figcaption>image-20220822201955643</figcaption></figure><p>Java 虚拟机使用该算法来判断对象是否可被回收，在 Java 中 GC Roots 一般包含以下内容:</p><ul><li>虚拟机栈中引用的对象</li><li>本地方法栈中引用的对象</li><li>方法区中类静态属性引用的对象</li><li>方法区中的常量引用的对象</li></ul><h3 id="_1-3-方法区的回收" tabindex="-1"><a class="header-anchor" href="#_1-3-方法区的回收" aria-hidden="true">#</a> 1.3 方法区的回收</h3><p>因为方法区主要存放永久代对象，而永久代对象的回收率比新生代低很多，因此在方法区上进行回收性价比不高。</p><p>主要是对常量池的回收和对类的卸载。</p><p>在大量使用反射、动态代理、CGLib 等 ByteCode 框架、动态生成 JSP 以及 OSGi 这类频繁自定义 ClassLoader 的场景都需要虚拟机具备类卸载功能，以保证不会出现内存溢出。</p><p>类的卸载条件很多，需要满足以下三个条件，并且满足了也不一定会被卸载:</p><ul><li>该类所有的实例都已经被回收，也就是堆中不存在该类的任何实例。</li><li>加载该类的 ClassLoader 已经被回收。</li><li>该类对应的 Class 对象没有在任何地方被引用，也就无法在任何地方通过反射访问该类方法。</li></ul><p>可以通过 -Xnoclassgc 参数来控制是否对类进行卸载。</p><h3 id="_1-4-finalize" tabindex="-1"><a class="header-anchor" href="#_1-4-finalize" aria-hidden="true">#</a> 1.4 finalize()</h3><p>finalize() 类似 C++ 的析构函数，用来做关闭外部资源等工作。但是 try-finally 等方式可以做的更好，并且该方法运行代价高昂，不确定性大，无法保证各个对象的调用顺序，因此最好不要使用。</p><p>当一个对象可被回收时，如果需要执行该对象的 finalize() 方法，那么就有可能通过在该方法中让对象重新被引用，从而实现自救。自救只能进行一次，如果回收的对象之前调用了 finalize() 方法自救，后面回收时不会调用 finalize() 方法。</p><h2 id="_2-引用类型" tabindex="-1"><a class="header-anchor" href="#_2-引用类型" aria-hidden="true">#</a> 2. 引用类型</h2><p>无论是通过引用计算算法判断对象的引用数量，还是通过可达性分析算法判断对象是否可达，判定对象是否可被回收都与引用有关。</p><p>Java 具有四种强度不同的引用类型。</p><h3 id="_2-1-强引用" tabindex="-1"><a class="header-anchor" href="#_2-1-强引用" aria-hidden="true">#</a> 2.1 强引用</h3><p>被强引用关联的对象不会被回收。</p><p>使用 new 一个新对象的方式来创建强引用。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Object</span> obj <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-2-软引用" tabindex="-1"><a class="header-anchor" href="#_2-2-软引用" aria-hidden="true">#</a> 2.2 软引用</h3><p>被软引用关联的对象只有在内存不够的情况下才会被回收。</p><p>使用 SoftReference 类来创建软引用。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Object</span> obj <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">SoftReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> sf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SoftReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
obj <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  <span class="token comment">// 使对象只被软引用关联</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-弱引用" tabindex="-1"><a class="header-anchor" href="#_2-3-弱引用" aria-hidden="true">#</a> 2.3 弱引用</h3><p>被弱引用关联的对象一定会被回收，也就是说它只能存活到下一次垃圾回收发生之前。</p><p>使用 WeakReference 类来实现弱引用。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Object</span> obj <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">WeakReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> wf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
obj <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-虚引用" tabindex="-1"><a class="header-anchor" href="#_2-4-虚引用" aria-hidden="true">#</a> 2.4 虚引用</h3><p>又称为幽灵引用或者幻影引用。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用取得一个对象。</p><p>为一个对象设置虚引用关联的唯一目的就是能在这个对象被回收时收到一个系统通知。</p><p>使用 PhantomReference 来实现虚引用。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Object</span> obj <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">PhantomReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> pf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PhantomReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
obj <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-垃圾回收算法" tabindex="-1"><a class="header-anchor" href="#_3-垃圾回收算法" aria-hidden="true">#</a> 3. 垃圾回收算法</h2><h3 id="_3-1-标记-清除" tabindex="-1"><a class="header-anchor" href="#_3-1-标记-清除" aria-hidden="true">#</a> 3.1 标记 - 清除</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822203143899.png" alt="image-20220822203143899" tabindex="0" loading="lazy"><figcaption>image-20220822203143899</figcaption></figure><p>将存活的对象进行标记，然后清理掉未被标记的对象。</p><p>不足:</p><ul><li>标记和清除过程效率都不高；</li><li>会产生大量不连续的内存碎片，导致无法给大对象分配内存。</li></ul><h3 id="_3-2-标记-整理" tabindex="-1"><a class="header-anchor" href="#_3-2-标记-整理" aria-hidden="true">#</a> 3.2 标记 - 整理</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822203237510.png" alt="image-20220822203237510" tabindex="0" loading="lazy"><figcaption>image-20220822203237510</figcaption></figure><p>让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。</p><h3 id="_3-3-复制" tabindex="-1"><a class="header-anchor" href="#_3-3-复制" aria-hidden="true">#</a> 3.3 复制</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822203308650.png" alt="image-20220822203308650" tabindex="0" loading="lazy"><figcaption>image-20220822203308650</figcaption></figure><p>将内存划分为大小相等的两块，每次只使用其中一块，当这一块内存用完了就将还存活的对象复制到另一块上面，然后再把使用过的内存空间进行一次清理。</p><p>主要不足是只使用了内存的一半。</p><p>现在的商业虚拟机都采用这种收集算法来回收新生代，但是并不是将新生代划分为大小相等的两块，而是分为一块较大的 Eden 空间和两块较小的 Survivor 空间，每次使用 Eden 空间和其中一块 Survivor。在回收时，将 Eden 和 Survivor 中还存活着的对象一次性复制到另一块 Survivor 空间上，最后清理 Eden 和使用过的那一块 Survivor。</p><p>HotSpot 虚拟机的 Eden 和 Survivor 的大小比例默认为 8:1，保证了内存的利用率达到 90%。如果每次回收有多于 10% 的对象存活，那么一块 Survivor 空间就不够用了，此时需要依赖于老年代进行分配担保，也就是借用老年代的空间存储放不下的对象。</p><h3 id="_3-4-分代收集" tabindex="-1"><a class="header-anchor" href="#_3-4-分代收集" aria-hidden="true">#</a> 3.4 分代收集</h3><p>现在的商业虚拟机采用分代收集算法，它根据对象存活周期将内存划分为几块，不同块采用适当的收集算法。</p><p>一般将堆分为新生代和老年代。</p><ul><li>新生代使用: 复制算法</li><li>老年代使用: 标记 - 清除 或者 标记 - 整理 算法</li></ul><h2 id="_4-垃圾收集器" tabindex="-1"><a class="header-anchor" href="#_4-垃圾收集器" aria-hidden="true">#</a> 4. 垃圾收集器</h2><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822203627290.png" alt="image-20220822203627290" tabindex="0" loading="lazy"><figcaption>image-20220822203627290</figcaption></figure><p>以上是 HotSpot 虚拟机中的 7 个垃圾收集器，连线表示垃圾收集器可以配合使用。</p><ul><li>单线程与多线程: 单线程指的是垃圾收集器只使用一个线程进行收集，而多线程使用多个线程；</li><li>串行与并行: 串行指的是垃圾收集器与用户程序交替执行，这意味着在执行垃圾收集的时候需要停顿用户程序；并形指的是垃圾收集器和用户程序同时执行。除了 CMS 和 G1 之外，其它垃圾收集器都是以串行的方式执行。</li></ul><h3 id="_4-1-serial-收集器" tabindex="-1"><a class="header-anchor" href="#_4-1-serial-收集器" aria-hidden="true">#</a> 4.1 Serial 收集器</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822203840445.png" alt="image-20220822203840445" tabindex="0" loading="lazy"><figcaption>image-20220822203840445</figcaption></figure><p>Serial 翻译为串行，也就是说它以串行的方式执行。</p><p>它是单线程的收集器，只会使用一个线程进行垃圾收集工作。</p><p>它的优点是简单高效，对于单个 CPU 环境来说，由于没有线程交互的开销，因此拥有最高的单线程收集效率。</p><p>它是 Client 模式下的默认新生代收集器，因为在用户的桌面应用场景下，分配给虚拟机管理的内存一般来说不会很大。Serial 收集器收集几十兆甚至一两百兆的新生代停顿时间可以控制在一百多毫秒以内，只要不是太频繁，这点停顿是可以接受的。</p><h3 id="_4-2-parnew-收集器" tabindex="-1"><a class="header-anchor" href="#_4-2-parnew-收集器" aria-hidden="true">#</a> 4.2 ParNew 收集器</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822204210688.png" alt="image-20220822204210688" tabindex="0" loading="lazy"><figcaption>image-20220822204210688</figcaption></figure><p>它是 Serial 收集器的多线程版本。</p><p>是 Server 模式下的虚拟机首选新生代收集器，除了性能原因外，主要是因为除了 Serial 收集器，只有它能与 CMS 收集器配合工作。</p><p>默认开启的线程数量与 CPU 数量相同，可以使用 -XX:ParallelGCThreads 参数来设置线程数。</p><h3 id="_4-3-parallel-scavenge-收集器" tabindex="-1"><a class="header-anchor" href="#_4-3-parallel-scavenge-收集器" aria-hidden="true">#</a> 4.3 Parallel Scavenge 收集器</h3><p>与 ParNew 一样是多线程收集器。</p><p>其它收集器关注点是尽可能缩短垃圾收集时用户线程的停顿时间，而它的目标是达到一个可控制的吞吐量，它被称为“吞吐量优先”收集器。这里的吞吐量指 CPU 用于运行用户代码的时间占总时间的比值。</p><p>停顿时间越短就越适合需要与用户交互的程序，良好的响应速度能提升用户体验。而高吞吐量则可以高效率地利用 CPU 时间，尽快完成程序的运算任务，主要适合在后台运算而不需要太多交互的任务。</p><p>缩短停顿时间是以牺牲吞吐量和新生代空间来换取的: 新生代空间变小，垃圾回收变得频繁，导致吞吐量下降。</p><p>可以通过一个开关参数打开 GC 自适应的调节策略(GC Ergonomics)，就不需要手动指定新生代的大小(-Xmn)、Eden 和 Survivor 区的比例、晋升老年代对象年龄等细节参数了。虚拟机会根据当前系统的运行情况收集性能监控信息，动态调整这些参数以提供最合适的停顿时间或者最大的吞吐量。</p><h3 id="_4-4-serial-old-收集器" tabindex="-1"><a class="header-anchor" href="#_4-4-serial-old-收集器" aria-hidden="true">#</a> 4.4. Serial Old 收集器</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822204557247.png" alt="image-20220822204557247" tabindex="0" loading="lazy"><figcaption>image-20220822204557247</figcaption></figure><p>是 Serial 收集器的老年代版本，也是给 Client 模式下的虚拟机使用。如果用在 Server 模式下，它有两大用途:</p><ul><li>在 JDK 1.5 以及之前版本(Parallel Old 诞生以前)中与 Parallel Scavenge 收集器搭配使用。</li><li>作为 CMS 收集器的后备预案，在并发收集发生 Concurrent Mode Failure 时使用。</li></ul><h3 id="_4-5-parallel-old-收集器" tabindex="-1"><a class="header-anchor" href="#_4-5-parallel-old-收集器" aria-hidden="true">#</a> 4.5 Parallel Old 收集器</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822204651394.png" alt="image-20220822204651394" tabindex="0" loading="lazy"><figcaption>image-20220822204651394</figcaption></figure><p>是 Parallel Scavenge 收集器的老年代版本。</p><p>在注重吞吐量以及 CPU 资源敏感的场合，都可以优先考虑 Parallel Scavenge 加 Parallel Old 收集器。</p><h3 id="_4-6-cms-收集器" tabindex="-1"><a class="header-anchor" href="#_4-6-cms-收集器" aria-hidden="true">#</a> 4.6. CMS 收集器</h3><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822204742797.png" alt="image-20220822204742797" tabindex="0" loading="lazy"><figcaption>image-20220822204742797</figcaption></figure><p>CMS(Concurrent Mark Sweep)，Mark Sweep 指的是标记 - 清除算法。</p><p>分为以下四个流程:</p><ul><li>初始标记: 仅仅只是标记一下 GC Roots 能直接关联到的对象，速度很快，需要停顿。</li><li>并发标记: 进行 GC Roots Tracing 的过程，它在整个回收过程中耗时最长，不需要停顿。</li><li>重新标记: 为了修正并发标记期间因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，需要停顿。</li><li>并发清除: 不需要停顿。</li></ul><p>在整个过程中耗时最长的并发标记和并发清除过程中，收集器线程都可以与用户线程一起工作，不需要进行停顿。</p><p>具有以下缺点:</p><ul><li>吞吐量低: 低停顿时间是以牺牲吞吐量为代价的，导致 CPU 利用率不够高。</li><li>无法处理浮动垃圾，可能出现 Concurrent Mode Failure。浮动垃圾是指并发清除阶段由于用户线程继续运行而产生的垃圾，这部分垃圾只能到下一次 GC 时才能进行回收。由于浮动垃圾的存在，因此需要预留出一部分内存，意味着 CMS 收集不能像其它收集器那样等待老年代快满的时候再回收。如果预留的内存不够存放浮动垃圾，就会出现 Concurrent Mode Failure，这时虚拟机将临时启用 Serial Old 来替代 CMS。</li><li>标记 - 清除算法导致的空间碎片，往往出现老年代空间剩余，但无法找到足够大连续空间来分配当前对象，不得不提前触发一次 Full GC。</li></ul><h3 id="_4-7-g1-收集器" tabindex="-1"><a class="header-anchor" href="#_4-7-g1-收集器" aria-hidden="true">#</a> 4.7 G1 收集器</h3><p>G1(Garbage-First)，它是一款面向服务端应用的垃圾收集器，在多 CPU 和大内存的场景下有很好的性能。HotSpot 开发团队赋予它的使命是未来可以替换掉 CMS 收集器。</p><p>堆被分为新生代和老年代，其它收集器进行收集的范围都是整个新生代或者老年代，而 G1 可以直接对新生代和老年代一起回收。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822205120935.png" alt="image-20220822205120935" tabindex="0" loading="lazy"><figcaption>image-20220822205120935</figcaption></figure><p>G1 把堆划分成多个大小相等的独立区域(Region)，新生代和老年代不再物理隔离。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822205156094.png" alt="image-20220822205156094" tabindex="0" loading="lazy"><figcaption>image-20220822205156094</figcaption></figure><p>通过引入 Region 的概念，从而将原来的一整块内存空间划分成多个的小空间，使得每个小空间可以单独进行垃圾回收。这种划分方法带来了很大的灵活性，使得可预测的停顿时间模型成为可能。通过记录每个 Region 垃圾回收时间以及回收所获得的空间(这两个值是通过过去回收的经验获得)，并维护一个优先列表，每次根据允许的收集时间，优先回收价值最大的 Region。</p><p>每个 Region 都有一个 Remembered Set，用来记录该 Region 对象的引用对象所在的 Region。通过使用 Remembered Set，在做可达性分析的时候就可以避免全堆扫描。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220822205320949.png" alt="image-20220822205320949" tabindex="0" loading="lazy"><figcaption>image-20220822205320949</figcaption></figure><p>如果不计算维护 Remembered Set 的操作，G1 收集器的运作大致可划分为以下几个步骤:</p><ul><li>初始标记</li><li>并发标记</li><li>最终标记: 为了修正在并发标记期间因用户程序继续运作而导致标记产生变动的那一部分标记记录，虚拟机将这段时间对象变化记录在线程的 Remembered Set Logs 里面，最终标记阶段需要把 Remembered Set Logs 的数据合并到 Remembered Set 中。这阶段需要停顿线程，但是可并行执行。</li><li>筛选回收: 首先对各个 Region 中的回收价值和成本进行排序，根据用户所期望的 GC 停顿时间来制定回收计划。此阶段其实也可以做到与用户程序一起并发执行，但是因为只回收一部分 Region，时间是用户可控制的，而且停顿用户线程将大幅度提高收集效率。</li></ul><p>具备如下特点:</p><ul><li>空间整合: 整体来看是基于“标记 - 整理”算法实现的收集器，从局部(两个 Region 之间)上来看是基于“复制”算法实现的，这意味着运行期间不会产生内存空间碎片。</li><li>可预测的停顿: 能让使用者明确指定在一个长度为 M 毫秒的时间片段内，消耗在 GC 上的时间不得超过 N 毫秒。</li></ul>`,112),d={href:"http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/G1GettingStarted/index.html",target:"_blank",rel:"noopener noreferrer"},u=i('<h2 id="_5-内存分配与回收策略" tabindex="-1"><a class="header-anchor" href="#_5-内存分配与回收策略" aria-hidden="true">#</a> 5. 内存分配与回收策略</h2><h3 id="_5-1-minor-gc、major-gc、full-gc" tabindex="-1"><a class="header-anchor" href="#_5-1-minor-gc、major-gc、full-gc" aria-hidden="true">#</a> 5.1 Minor GC、Major GC、Full GC</h3><p>JVM 在进行 GC 时，并非每次都对堆内存（新生代、老年代；方法区）区域一起回收的，大部分时候回收的都是指新生代。</p><p>针对 HotSpot VM 的实现，它里面的 GC 按照回收区域又分为两大类：部分收集（Partial GC），整堆收集（Full GC）</p><ul><li>部分收集：不是完整收集整个 Java 堆的垃圾收集。其中又分为： <ul><li>新生代收集（Minor GC/Young GC）：只是新生代的垃圾收集</li><li>老年代收集（Major GC/Old GC）：只是老年代的垃圾收集 <ul><li>目前，只有 CMS GC 会有单独收集老年代的行为</li><li>很多时候 Major GC 会和 Full GC 混合使用，需要具体分辨是老年代回收还是整堆回收</li></ul></li><li>混合收集（Mixed GC）：收集整个新生代以及部分老年代的垃圾收集 <ul><li>目前只有 G1 GC 会有这种行为</li></ul></li></ul></li><li>整堆收集（Full GC）：收集整个 Java 堆和方法区的垃圾</li></ul><h3 id="_5-2-内存分配策略" tabindex="-1"><a class="header-anchor" href="#_5-2-内存分配策略" aria-hidden="true">#</a> 5.2 内存分配策略</h3><h4 id="_5-2-1-对象优先在-eden-分配" tabindex="-1"><a class="header-anchor" href="#_5-2-1-对象优先在-eden-分配" aria-hidden="true">#</a> 5.2.1. 对象优先在 Eden 分配</h4><p>大多数情况下，对象在新生代 Eden 区分配，当 Eden 区空间不够时，发起 Minor GC。</p><h4 id="_5-2-2-大对象直接进入老年代" tabindex="-1"><a class="header-anchor" href="#_5-2-2-大对象直接进入老年代" aria-hidden="true">#</a> 5.2.2. 大对象直接进入老年代</h4><p>大对象是指需要连续内存空间的对象，最典型的大对象是那种很长的字符串以及数组。</p><p>经常出现大对象会提前触发垃圾收集以获取足够的连续空间分配给大对象。</p><p>-XX:PretenureSizeThreshold，大于此值的对象直接在老年代分配，避免在 Eden 区和 Survivor 区之间的大量内存复制。</p><h4 id="_5-2-3-长期存活的对象进入老年代" tabindex="-1"><a class="header-anchor" href="#_5-2-3-长期存活的对象进入老年代" aria-hidden="true">#</a> 5.2.3. 长期存活的对象进入老年代</h4><p>为对象定义年龄计数器，对象在 Eden 出生并经过 Minor GC 依然存活，将移动到 Survivor 中，年龄就增加 1 岁，增加到一定年龄则移动到老年代中。</p><p>-XX:MaxTenuringThreshold 用来定义年龄的阈值。</p><h4 id="_5-2-4-动态对象年龄判定" tabindex="-1"><a class="header-anchor" href="#_5-2-4-动态对象年龄判定" aria-hidden="true">#</a> 5.2.4. 动态对象年龄判定</h4><p>虚拟机并不是永远地要求对象的年龄必须达到 MaxTenuringThreshold 才能晋升老年代，如果在 Survivor 中相同年龄所有对象大小的总和大于 Survivor 空间的一半，则年龄大于或等于该年龄的对象可以直接进入老年代，无需等到 MaxTenuringThreshold 中要求的年龄。</p><h4 id="_5-2-5-空间分配担保" tabindex="-1"><a class="header-anchor" href="#_5-2-5-空间分配担保" aria-hidden="true">#</a> 5.2.5. 空间分配担保</h4><p>在发生 Minor GC 之前，虚拟机先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果条件成立的话，那么 Minor GC 可以确认是安全的。</p><p>如果不成立的话虚拟机会查看 HandlePromotionFailure 设置值是否允许担保失败，如果允许那么就会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次 Minor GC；如果小于，或者 HandlePromotionFailure 设置不允许冒险，那么就要进行一次 Full GC。</p><h3 id="_5-3-full-gc-的触发条件" tabindex="-1"><a class="header-anchor" href="#_5-3-full-gc-的触发条件" aria-hidden="true">#</a> 5.3 Full GC 的触发条件</h3><p>对于 Minor GC，其触发条件非常简单，当 Eden 空间满时，就将触发一次 Minor GC。而 Full GC 则相对复杂，有以下条件:</p><h4 id="_5-3-1-调用-system-gc" tabindex="-1"><a class="header-anchor" href="#_5-3-1-调用-system-gc" aria-hidden="true">#</a> 5.3.1. 调用 System.gc()</h4><p>只是建议虚拟机执行 Full GC，但是虚拟机不一定真正去执行。不建议使用这种方式，而是让虚拟机管理内存。</p><h4 id="_5-3-2-老年代空间不足" tabindex="-1"><a class="header-anchor" href="#_5-3-2-老年代空间不足" aria-hidden="true">#</a> 5.3.2. 老年代空间不足</h4><p>老年代空间不足的常见场景为前文所讲的大对象直接进入老年代、长期存活的对象进入老年代等。</p><p>为了避免以上原因引起的 Full GC，应当尽量不要创建过大的对象以及数组。除此之外，可以通过 -Xmn 虚拟机参数调大新生代的大小，让对象尽量在新生代被回收掉，不进入老年代。还可以通过 -XX:MaxTenuringThreshold 调大对象进入老年代的年龄，让对象在新生代多存活一段时间。</p><h4 id="_5-3-3-空间分配担保失败" tabindex="-1"><a class="header-anchor" href="#_5-3-3-空间分配担保失败" aria-hidden="true">#</a> 5.3.3. 空间分配担保失败</h4><p>使用复制算法的 Minor GC 需要老年代的内存空间作担保，如果担保失败会执行一次 Full GC。具体内容请参考上面的第五小节。</p><h4 id="_5-3-4-jdk-1-7-及以前的永久代空间不足" tabindex="-1"><a class="header-anchor" href="#_5-3-4-jdk-1-7-及以前的永久代空间不足" aria-hidden="true">#</a> 5.3.4. JDK 1.7 及以前的永久代空间不足</h4><p>在 JDK 1.7 及以前，HotSpot 虚拟机中的方法区是用永久代实现的，永久代中存放的为一些 Class 的信息、常量、静态变量等数据。</p><p>当系统中要加载的类、反射的类和调用的方法较多时，永久代可能会被占满，在未配置为采用 CMS GC 的情况下也会执行 Full GC。如果经过 Full GC 仍然回收不了，那么虚拟机会抛出 java.lang.OutOfMemoryError。</p><p>为避免以上原因引起的 Full GC，可采用的方法为增大永久代空间或转为使用 CMS GC。</p><h4 id="_5-3-5-concurrent-mode-failure" tabindex="-1"><a class="header-anchor" href="#_5-3-5-concurrent-mode-failure" aria-hidden="true">#</a> 5.3.5. Concurrent Mode Failure</h4><p>执行 CMS GC 的过程中同时有对象要放入老年代，而此时老年代空间不足(可能是 GC 过程中浮动垃圾过多导致暂时性的空间不足)，便会报 Concurrent Mode Failure 错误，并触发 Full GC。</p><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>',36),h={href:"https://pdai.tech/md/java/jvm/java-jvm-gc.html",target:"_blank",rel:"noopener noreferrer"},g=a("strong",null,"GC - Java 垃圾回收基础知识",-1);function m(b,k){const n=o("ExternalLinkIcon");return t(),p("div",null,[c,a("p",null,[e("更详细内容请参考: "),a("a",d,[e("Getting Started with the G1 Garbage Collector (opens new window)"),s(n)])]),u,a("p",null,[a("a",h,[g,s(n)])])])}const v=l(r,[["render",m],["__file","java-jvm-gc.html.vue"]]);export{v as default};