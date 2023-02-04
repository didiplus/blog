import{ab as s,G as e,H as i,E as a,N as t,ac as p,W as o}from"./framework-11534bf9.js";const l={},c=p(`<h1 id="jvm-基础-java-内存模型引入" tabindex="-1"><a class="header-anchor" href="#jvm-基础-java-内存模型引入" aria-hidden="true">#</a> JVM 基础 - Java 内存模型引入</h1><blockquote><p>很多人都无法区分Java内存模型和JVM内存结构，以及Java内存模型与物理内存之间的关系。本文从堆栈角度引入JMM，然后介绍JMM和物理内存之间的关系, 为后面<code>JMM详解</code>, <code>JVM 内存结构详解</code>, <code>Java 对象模型详解</code>等铺垫。</p></blockquote><h2 id="_0-java内存模型是什么" tabindex="-1"><a class="header-anchor" href="#_0-java内存模型是什么" aria-hidden="true">#</a> 0. Java内存模型是什么</h2><p>Java内存模型规定了<strong>所有的变量都存储在主内存</strong>中，<strong>每条线程还有自己的工作内存</strong>，线程的<strong>工作内存中保存了该线程中是用到的变量的主内存副本拷贝</strong>，线程对变量的所有操作都必须在工作内存中进行，而不能直接读写主内存。不同的线程之间也无法直接访问对方工作内存中的变量，<strong>线程间变量的传递均需要自己的工作内存和主存之间进行数据同步进行</strong>。所以，就<strong>可能出现线程1改了某个变量的值，但是线程2不可见的情况</strong>。</p><h2 id="_1-jmm引入" tabindex="-1"><a class="header-anchor" href="#_1-jmm引入" aria-hidden="true">#</a> 1. JMM引入</h2><h3 id="_1-1-从堆栈说起" tabindex="-1"><a class="header-anchor" href="#_1-1-从堆栈说起" aria-hidden="true">#</a> 1.1 从堆栈说起</h3><p>JVM内部使用的Java内存模型在线程栈和堆之间划分内存。 此图从逻辑角度说明了Java内存模型：</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220821094940201.png" alt="image-20220821094940201" tabindex="0" loading="lazy"><figcaption>image-20220821094940201</figcaption></figure><h3 id="_1-2-堆栈里面放了什么" tabindex="-1"><a class="header-anchor" href="#_1-2-堆栈里面放了什么" aria-hidden="true">#</a> 1.2 堆栈里面放了什么?</h3><p>线程堆栈还包含正在执行的每个方法的所有局部变量(调用堆栈上的所有方法)。 线程只能访问它自己的线程堆栈。 由线程创建的局部变量对于创建它的线程以外的所有其他线程是不可见的。 即使两个线程正在执行完全相同的代码，两个线程仍将在每个自己的线程堆栈中创建该代码的局部变量。 因此，每个线程都有自己的每个局部变量的版本。</p><p>基本类型的所有局部变量(boolean，byte，short，char，int，long，float，double)完全存储在线程堆栈中，因此对其他线程不可见。 一个线程可以将一个基本类型变量的副本传递给另一个线程，但它不能共享原始局部变量本身。</p><p>堆包含了在Java应用程序中创建的所有对象，无论创建该对象的线程是什么。 这包括基本类型的包装类(例如Byte，Integer，Long等)。 无论是创建对象并将其分配给局部变量，还是创建为另一个对象的成员变量，该对象仍然存储在堆上。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220821095216100.png" alt="image-20220821095216100" tabindex="0" loading="lazy"><figcaption>image-20220821095216100</figcaption></figure><p>局部变量可以是基本类型，在这种情况下，它完全保留在线程堆栈上。</p><p>局部变量也可以是对象的引用。 在这种情况下，引用(局部变量)存储在线程堆栈中，但是对象本身存储在堆(Heap)上。</p><p>对象的成员变量与对象本身一起存储在堆上。 当成员变量是基本类型时，以及它是对象的引用时都是如此。</p><p>静态类变量也与类定义一起存储在堆上。</p><h3 id="_1-3-线程栈如何访问堆上对象" tabindex="-1"><a class="header-anchor" href="#_1-3-线程栈如何访问堆上对象" aria-hidden="true">#</a> 1.3 线程栈如何访问堆上对象?</h3><p>所有具有对象引用的线程都可以访问堆上的对象。 当一个线程有权访问一个对象时，它也可以访问该对象的成员变量。 <strong>如果两个线程同时在同一个对象上调用一个方法，它们都可以访问该对象的成员变量，但每个线程都有自己的局部变量副本。</strong></p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220821095443653.png" alt="image-20220821095443653" tabindex="0" loading="lazy"><figcaption>image-20220821095443653</figcaption></figure><p>两个线程有一组局部变量。 其中一个局部变量(局部变量2)指向堆上的共享对象(对象3)。 两个线程各自对同一对象具有不同的引用。 它们的引用是局部变量，因此存储在每个线程的线程堆栈中(在每个线程堆栈上)。 但是，这两个不同的引用指向堆上的同一个对象。</p><p>注意共享对象(对象3)如何将对象2和对象4作为成员变量引用(由对象3到对象2和对象4的箭头所示)。 通过对象3中的这些成员变量引用，两个线程可以访问对象2和对象4.</p><p>该图还显示了一个局部变量，该变量指向堆上的两个不同对象。 在这种情况下，引用指向两个不同的对象(对象1和对象5)，而不是同一个对象。 理论上，如果两个线程都引用了两个对象，则两个线程都可以访问对象1和对象5。 但是在上图中，每个线程只引用了两个对象中的一个。</p><h3 id="_1-4-线程栈访问堆示例" tabindex="-1"><a class="header-anchor" href="#_1-4-线程栈访问堆示例" aria-hidden="true">#</a> 1.4 线程栈访问堆示例</h3><p>那么，什么样的Java代码可以导致上面的内存图? 好吧，代码就像下面的代码一样简单：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyRunnable</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">methodOne</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">methodOne</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> localVariable1 <span class="token operator">=</span> <span class="token number">45</span><span class="token punctuation">;</span>

        <span class="token class-name">MySharedObject</span> localVariable2 <span class="token operator">=</span>
            <span class="token class-name">MySharedObject</span><span class="token punctuation">.</span>sharedInstance<span class="token punctuation">;</span>

        <span class="token comment">//... do more with local variables.</span>

        <span class="token function">methodTwo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">methodTwo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Integer</span> localVariable1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">99</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//... do more with local variable.</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MySharedObject</span> <span class="token punctuation">{</span>

    <span class="token comment">//static variable pointing to instance of MySharedObject</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">MySharedObject</span> sharedInstance <span class="token operator">=</span>
        <span class="token keyword">new</span> <span class="token class-name">MySharedObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token comment">//member variables pointing to two objects on the heap</span>

    <span class="token keyword">public</span> <span class="token class-name">Integer</span> object2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">22</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token class-name">Integer</span> object4 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">44</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">long</span> member1 <span class="token operator">=</span> <span class="token number">12345</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">long</span> member1 <span class="token operator">=</span> <span class="token number">67890</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果两个线程正在执行run()方法，则前面显示的图表将是结果。 run()方法调用methodOne()，methodOne()调用methodTwo()。</p><p>methodOne()声明一个局部基本类型变量(类型为int的localVariable1)和一个局部变量，它是一个对象引用(localVariable2)。</p><p>执行methodOne()的每个线程将在各自的线程堆栈上创建自己的localVariable1和localVariable2副本。 localVariable1变量将完全相互分离，只存在于每个线程的线程堆栈中。 一个线程无法看到另一个线程对其localVariable1副本所做的更改。</p><p>执行methodOne()的每个线程也将创建自己的localVariable2副本。 但是，localVariable2的两个不同副本最终都指向堆上的同一个对象。 代码将localVariable2设置为指向静态变量引用的对象。 静态变量只有一个副本，此副本存储在堆上。 因此，localVariable2的两个副本最终都指向静态变量指向的MySharedObject的同一个实例。 MySharedObject实例也存储在堆上。 它对应于上图中的对象3。</p><p>注意MySharedObject类还包含两个成员变量。 成员变量本身与对象一起存储在堆上。 两个成员变量指向另外两个Integer对象。 这些Integer对象对应于上图中的Object 2和Object 4。</p><p>另请注意methodTwo()如何创建名为localVariable1的局部变量。 此局部变量是对Integer对象的对象引用。 该方法将localVariable1引用设置为指向新的Integer实例。 localVariable1引用将存储在执行methodTwo()的每个线程的一个副本中。 实例化的两个Integer对象将存储在堆上，但由于该方法每次执行该方法时都会创建一个新的Integer对象，因此执行此方法的两个线程将创建单独的Integer实例。 在methodTwo()中创建的Integer对象对应于上图中的Object 1和Object 5。</p><p>另请注意类型为long的MySharedObject类中的两个成员变量，它们是基本类型。 由于这些变量是成员变量，因此它们仍与对象一起存储在堆上。 只有局部变量存储在线程堆栈中。</p><h2 id="_2-jmm与硬件内存结构关系" tabindex="-1"><a class="header-anchor" href="#_2-jmm与硬件内存结构关系" aria-hidden="true">#</a> 2. JMM与硬件内存结构关系</h2><h3 id="_2-1-硬件内存结构简介" tabindex="-1"><a class="header-anchor" href="#_2-1-硬件内存结构简介" aria-hidden="true">#</a> 2.1 硬件内存结构简介</h3><p>现代硬件内存架构与内部Java内存模型略有不同。 了解硬件内存架构也很重要，以了解Java内存模型如何与其一起工作。 本节介绍了常见的硬件内存架构，后面的部分将介绍Java内存模型如何与其配合使用。</p><p>这是现代计算机硬件架构的简化图：</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220821100042636.png" alt="image-20220821100042636" tabindex="0" loading="lazy"><figcaption>image-20220821100042636</figcaption></figure><p>现代计算机通常有2个或更多CPU。 其中一些CPU也可能有多个内核。 关键是，在具有2个或更多CPU的现代计算机上，可以同时运行多个线程。 每个CPU都能够在任何给定时间运行一个线程。 这意味着如果您的Java应用程序是多线程的，线程真的在可能同时运行.</p><p>每个CPU基本上都包含一组在CPU内存中的寄存器。 CPU可以在这些寄存器上执行的操作比在主存储器中对变量执行的操作快得多。 这是因为CPU可以比访问主存储器更快地访问这些寄存器。</p><p>每个CPU还可以具有CPU高速缓存存储器层。 事实上，大多数现代CPU都有一些大小的缓存存储层。 CPU可以比主存储器更快地访问其高速缓存存储器，但通常不会像访问其内部寄存器那样快。 因此，CPU高速缓存存储器介于内部寄存器和主存储器的速度之间。 某些CPU可能有多个缓存层(级别1和级别2)，但要了解Java内存模型如何与内存交互，这一点并不重要。 重要的是要知道CPU可以有某种缓存存储层。</p><p>计算机还包含主存储区(RAM)。 所有CPU都可以访问主内存。 主存储区通常比CPU的高速缓存存储器大得多。同时访问速度也就较慢.</p><p>通常，当CPU需要访问主存储器时，它会将部分主存储器读入其CPU缓存。 它甚至可以将部分缓存读入其内部寄存器，然后对其执行操作。 当CPU需要将结果写回主存储器时，它会将值从其内部寄存器刷新到高速缓冲存储器，并在某些时候将值刷新回主存储器。</p><h3 id="_2-2-jmm与硬件内存连接-引入" tabindex="-1"><a class="header-anchor" href="#_2-2-jmm与硬件内存连接-引入" aria-hidden="true">#</a> 2.2 JMM与硬件内存连接 - 引入</h3><p>如前所述，Java内存模型和硬件内存架构是不同的。 硬件内存架构不区分线程堆栈和堆。 在硬件上，线程堆栈和堆都位于主存储器中。 线程堆栈和堆的一部分有时可能存在于CPU高速缓存和内部CPU寄存器中。 这在图中说明：</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220821100529578.png" alt="image-20220821100529578" tabindex="0" loading="lazy"><figcaption>image-20220821100529578</figcaption></figure><p>当对象和变量可以存储在计算机的各种不同存储区域中时，可能会出现某些问题。 两个主要问题是：</p><ul><li>Visibility of thread updates (writes) to shared variables.</li><li>Race conditions when reading, checking and writing shared variables. 以下各节将解释这两个问题。</li></ul><h3 id="_2-3-jmm与硬件内存连接-对象共享后的可见性" tabindex="-1"><a class="header-anchor" href="#_2-3-jmm与硬件内存连接-对象共享后的可见性" aria-hidden="true">#</a> 2.3 JMM与硬件内存连接 - 对象共享后的可见性</h3><p>如果两个或多个线程共享一个对象，而没有正确使用volatile声明或同步，则一个线程对共享对象的更新可能对其他线程不可见。</p><p>想象一下，共享对象最初存储在主存储器中。 然后，在CPU上运行的线程将共享对象读入其CPU缓存中。 它在那里对共享对象进行了更改。 只要CPU缓存尚未刷新回主内存，共享对象的更改版本对于在其他CPU上运行的线程是不可见的。 这样，每个线程最终都可能拥有自己的共享对象副本，每个副本都位于不同的CPU缓存中。</p><p>下图描绘了该情况。 在左CPU上运行的一个线程将共享对象复制到其CPU缓存中，并将其count变量更改为2.对于在右边的CPU上运行的其他线程，此更改不可见，因为计数更新尚未刷新回主内存中.</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220821100739376.png" alt="image-20220821100739376" tabindex="0" loading="lazy"><figcaption>image-20220821100739376</figcaption></figure><p>要解决此问题，您可以使用Java的volatile关键字。 volatile关键字可以确保直接从主内存读取给定变量，并在更新时始终写回主内存。</p><h3 id="_2-4-jmm与硬件内存连接-竞态条件" tabindex="-1"><a class="header-anchor" href="#_2-4-jmm与硬件内存连接-竞态条件" aria-hidden="true">#</a> 2.4 JMM与硬件内存连接 - 竞态条件</h3><p>如果两个或多个线程共享一个对象，并且多个线程更新该共享对象中的变量，则可能会出现竞态。</p><p>想象一下，如果线程A将共享对象的变量计数读入其CPU缓存中。 想象一下，线程B也做同样的事情，但是进入不同的CPU缓存。 现在，线程A将一个添加到count，而线程B执行相同的操作。 现在var1已经增加了两次，每个CPU缓存一次。</p><p>如果这些增量是按先后顺序执行的，则变量计数将增加两次并将原始值+ 2写回主存储器。</p><p>但是，两个增量同时执行而没有适当的同步。 无论线程A和B中哪一个将其更新后的计数版本写回主存储器，更新的值将仅比原始值高1，尽管有两个增量。</p><p>该图说明了如上所述的竞争条件问题的发生：</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220825210029757.png" alt="image-20220825210029757" tabindex="0" loading="lazy"><figcaption>image-20220825210029757</figcaption></figure><p>要解决此问题，您可以使用Java synchronized块。 同步块保证在任何给定时间只有一个线程可以进入代码的给定关键部分。 同步块还保证在同步块内访问的所有变量都将从主存储器中读入，当线程退出同步块时，所有更新的变量将再次刷新回主存储器，无论变量是不是声明为volatile</p><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>`,63),r={href:"https://pdai.tech/md/java/jvm/java-jvm-x-introduce.html",target:"_blank",rel:"noopener noreferrer"},d=a("strong",null,"JVM 基础 - Java 内存模型引入",-1);function u(m,b){const n=o("ExternalLinkIcon");return e(),i("div",null,[c,a("p",null,[a("a",r,[d,t(n)])])])}const k=s(l,[["render",u],["__file","java-jvm-x-introduce.html.vue"]]);export{k as default};