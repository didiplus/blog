import{ab as n,G as e,H as a,ad as s}from"./framework-894cff3a.js";const l={},o=s(`<h1 id="线程池的具体实现原理" tabindex="-1"><a class="header-anchor" href="#线程池的具体实现原理" aria-hidden="true">#</a> 线程池的具体实现原理</h1><p>在上一节我们从宏观上介绍了ThreadPoolExecutor，下面我们来深入解析一下线程池的具体实现原理，将从下面几个方面讲解：</p><p><strong>1.线程池状态</strong></p><p><strong>2.任务的执行</strong></p><p><strong>3.线程池中的线程初始化</strong></p><p><strong>4.任务缓存队列及排队策略</strong></p><p><strong>5.任务拒绝策略</strong></p><p><strong>6.线程池的关闭</strong></p><p><strong>7.线程池容量的动态调整</strong></p><h2 id="_1-线程池状态" tabindex="-1"><a class="header-anchor" href="#_1-线程池状态" aria-hidden="true">#</a> 1. 线程池状态</h2><p>在ThreadPoolExecutor中定义了一个volatile变量，另外定义了几个static final变量表示线程池的各个状态：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">volatile</span> <span class="token keyword">int</span> runState<span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">RUNNING</span>    <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">SHUTDOWN</span>   <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">STOP</span>       <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
<span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">TERMINATED</span> <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>runState表示当前线程池的状态，它是一个volatile变量用来保证线程之间的可见性；</p><p>下面的几个static final变量表示runState可能的几个取值。</p><ul><li>当创建线程池后，初始时，线程池处于RUNNING状态；</li><li>如果调用了shutdown()方法，则线程池处于SHUTDOWN状态，<strong>此时线程池不能够接受新的任务，它会等待所有任务执行完毕</strong>；</li><li>如果调用了shutdownNow()方法，则线程池处于STOP状态，<strong>此时线程池不能接受新的任务，并且会去尝试终止正在执行的任务</strong>；</li><li>当线程池<strong>处于SHUTDOWN或STOP状态</strong>，并且<strong>所有工作线程已经销毁</strong>，<strong>任务缓存队列已经清空或执行结束后，线程池被设置为TERMINATED状态</strong>。</li></ul><h2 id="_2-任务的执行" tabindex="-1"><a class="header-anchor" href="#_2-任务的执行" aria-hidden="true">#</a> 2. 任务的执行</h2><p>在了解将任务提交给线程池到任务执行完毕整个过程之前，我们先来看一下ThreadPoolExecutor类中其他的一些比较重要成员变量：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Runnable</span><span class="token punctuation">&gt;</span></span> workQueue<span class="token punctuation">;</span>              <span class="token comment">//任务缓存队列，用来存放等待执行的任务</span>
<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">ReentrantLock</span> mainLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">//线程池的主要状态锁，对线程池状态（比如线程池大小</span>
                                                              <span class="token comment">//、runState等）的改变都要使用这个锁</span>
<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Worker</span><span class="token punctuation">&gt;</span></span> workers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Worker</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//用来存放工作集</span>
 
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">long</span>  keepAliveTime<span class="token punctuation">;</span>    <span class="token comment">//线程存货时间   </span>
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">boolean</span> allowCoreThreadTimeOut<span class="token punctuation">;</span>   <span class="token comment">//是否允许为核心线程设置存活时间</span>
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span>   corePoolSize<span class="token punctuation">;</span>     <span class="token comment">//核心池的大小（即线程池中的线程数目大于这个参数时，提交的任务会被放进任务缓存队列）</span>
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span>   maximumPoolSize<span class="token punctuation">;</span>   <span class="token comment">//线程池最大能容忍的线程数</span>
 
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span>   poolSize<span class="token punctuation">;</span>       <span class="token comment">//线程池中当前的线程数</span>
 
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token class-name">RejectedExecutionHandler</span> handler<span class="token punctuation">;</span> <span class="token comment">//任务拒绝策略</span>
 
<span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token class-name">ThreadFactory</span> threadFactory<span class="token punctuation">;</span>   <span class="token comment">//线程工厂，用来创建线程</span>
 
<span class="token keyword">private</span> <span class="token keyword">int</span> largestPoolSize<span class="token punctuation">;</span>   <span class="token comment">//用来记录线程池中曾经出现过的最大线程数</span>
 
<span class="token keyword">private</span> <span class="token keyword">long</span> completedTaskCount<span class="token punctuation">;</span>   <span class="token comment">//用来记录已经执行完毕的任务个数</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个变量的作用都已经标明出来了，这里要重点解释一下corePoolSize、maximumPoolSize、largestPoolSize三个变量。</p><h3 id="_2-1-线程池例子" tabindex="-1"><a class="header-anchor" href="#_2-1-线程池例子" aria-hidden="true">#</a> 2.1 线程池例子</h3><p>corePoolSize在很多地方被翻译成核心池大小，其实我的理解这个就是线程池的大小。举个简单的例子：</p><p>假如有一个工厂，工厂里面有10个工人，每个工人同时只能做一件任务。</p><p>因此只要当10个工人中有工人是空闲的，来了任务就分配给空闲的工人做；</p><p>当10个工人都有任务在做时，如果还来了任务，就把任务进行排队等待；</p><p>如果说新任务数目增长的速度远远大于工人做任务的速度，那么此时工厂主管可能会想补救措施，比如重新招4个临时工人进来；</p><p>然后就将任务也分配给这4个临时工人做；</p><p>如果说着14个工人做任务的速度还是不够，此时工厂主管可能就要考虑不再接收新的任务或者抛弃前面的一些任务了。</p><p>当这14个工人当中有人空闲时，而新任务增长的速度又比较缓慢，工厂主管可能就考虑辞掉4个临时工了，只保持原来的10个工人，毕竟请额外的工人是要花钱的。</p><p>这个例子中的corePoolSize就是10，而maximumPoolSize就是14（10+4）</p><p>也就是说corePoolSize就是线程池大小，maximumPoolSize在我看来是线程池的一种补救措施，即任务量突然过大时的一种补救措施。</p><p>不过为了方便理解，在本文后面还是将corePoolSize翻译成核心池大小。</p><p>largestPoolSize只是一个用来起记录作用的变量，用来记录线程池中曾经有过的最大线程数目，跟线程池的容量没有任何关系。</p><h3 id="_2-2-提交到最终执行完毕经历了哪些过程" tabindex="-1"><a class="header-anchor" href="#_2-2-提交到最终执行完毕经历了哪些过程" aria-hidden="true">#</a> 2.2 提交到最终执行完毕经历了哪些过程</h3><p>在ThreadPoolExecutor类中，<strong>最核心的任务提交方法是execute()方法</strong>，虽然通过submit也可以提交任务，但是实际上submit方法里面最终调用的还是execute()方法，所以我们只需要研究execute()方法的实现原理即可：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();
    if (poolSize &gt;= corePoolSize || !addIfUnderCorePoolSize(command)) {
        if (runState == RUNNING &amp;&amp; workQueue.offer(command)) {
            if (runState != RUNNING || poolSize == 0)
                ensureQueuedTaskHandled(command);
        }
        else if (!addIfUnderMaximumPoolSize(command))
            reject(command); // is shutdown or saturated
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先，判断提交的任务command是否为null，若是null，则抛出空指针异常；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>if (poolSize &gt;= corePoolSize || !addIfUnderCorePoolSize(command))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>由于是或条件运算符，所以先计算前半部分的值，如果线程池中当前线程数不小于核心池大小，那么就会直接进入下面的if语句块了。</p><p>如果线程池中当前线程数小于核心池大小，则接着执行后半部分，也就是执行</p><p>如果执行完addIfUnderCorePoolSize这个方法返回false，则继续执行下面的if语句块，否则整个方法就直接执行完毕了。</p><p>如果执行完addIfUnderCorePoolSize这个方法返回false，然后接着判断：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>\`if\` \`(runState == RUNNING &amp;&amp; workQueue.offer(command))\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果当前线程池处于RUNNING状态，则将任务放入任务缓存队列；如果当前线程池不处于RUNNING状态或者任务放入缓存队列失败，则执行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>\`addIfUnderMaximumPoolSize(command)\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果执行addIfUnderMaximumPoolSize方法失败，则执行reject()方法进行任务拒绝处理。</p><p>回到前面：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>\`if\` \`(runState == RUNNING &amp;&amp; workQueue.offer(command))\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这句的执行，如果说当前线程池处于RUNNING状态且将任务放入任务缓存队列成功，则继续进行判断：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>\`if\` \`(runState != RUNNING || poolSize == \`\`0\`\`)\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这句判断是为了防止在将此任务添加进任务缓存队列的同时其他线程突然调用shutdown或者shutdownNow方法关闭了线程池的一种应急措施。如果是这样就执行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>\`ensureQueuedTaskHandled(command)\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>进行应急处理，从名字可以看出是保证 添加到任务缓存队列中的任务得到处理。</p><p>...</p><h3 id="_2-3-总结" tabindex="-1"><a class="header-anchor" href="#_2-3-总结" aria-hidden="true">#</a> 2.3 总结</h3><p>1）首先，要清楚corePoolSize和maximumPoolSize的含义；</p><p>2）其次，要知道Worker是用来起到什么作用的；</p><p>3）要知道任务提交给线程池之后的处理策略，这里总结一下主要有4点：</p><ul><li>如果当前线程池中的线程数目小于corePoolSize，则每来一个任务，就会创建一个线程去执行这个任务；</li><li>如果当前线程池中的线程数目&gt;=corePoolSize，则每来一个任务，会尝试将其添加到任务缓存队列当中，若添加成功，则该任务会等待空闲线程将其取出去执行；若添加失败（一般来说是任务缓存队列已满），则会尝试创建新的线程去执行这个任务；</li><li>如果当前线程池中的线程数目达到maximumPoolSize，则会采取任务拒绝策略进行处理；</li><li>如果线程池中的线程数量大于 corePoolSize时，如果某线程空闲时间超过keepAliveTime，线程将被终止，直至线程池中的线程数目不大于corePoolSize；如果允许为核心池中的线程设置存活时间，那么核心池中的线程空闲时间超过keepAliveTime，线程也会被终止。</li></ul><h2 id="_3-线程池中的线程初始化" tabindex="-1"><a class="header-anchor" href="#_3-线程池中的线程初始化" aria-hidden="true">#</a> 3. 线程池中的线程初始化</h2><p>默认情况下，创建线程池之后，线程池中是没有线程的，需要提交任务之后才会创建线程。</p><p>在实际中如果需要线程池创建之后立即创建线程，可以通过以下两个方法办到：</p><ul><li>prestartCoreThread()：初始化一个核心线程；</li><li>prestartAllCoreThreads()：初始化所有核心线程</li></ul><p>下面是这2个方法的实现：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public boolean prestartCoreThread() {
    return addIfUnderCorePoolSize(null); //注意传进去的参数是null
}
 
public int prestartAllCoreThreads() {
    int n = 0;
    while (addIfUnderCorePoolSize(null))//注意传进去的参数是null
        ++n;
    return n;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意上面传进去的参数是null，根据第2小节的分析可知如果传进去的参数为null，则最后执行线程会阻塞在getTask方法中的</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	r = workQueue.take();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>即等待任务队列中有任务。</p><h2 id="_4-任务缓存队列及排队策略" tabindex="-1"><a class="header-anchor" href="#_4-任务缓存队列及排队策略" aria-hidden="true">#</a> 4. <strong>任务缓存队列及排队策略</strong></h2><p>在前面我们多次提到了任务缓存队列，即workQueue，它用来存放等待执行的任务。</p><p>workQueue的类型为<code>BlockingQueue&lt;Runnable&gt;</code>，通常可以取下面三种类型：</p><ul><li><p>ArrayBlockingQueue：基于数组的先进先出队列，此队列创建时必须指定大小；</p></li><li><p>LinkedBlockingQueue：基于链表的先进先出队列，如果创建时没有指定此队列大小，则默认为Integer.MAX_VALUE；</p></li><li><p>synchronousQueue：这个队列比较特殊，它不会保存提交的任务，而是将直接新建一个线程来执行新来的任务。</p></li></ul><h2 id="_5-任务拒绝策略" tabindex="-1"><a class="header-anchor" href="#_5-任务拒绝策略" aria-hidden="true">#</a> 5. 任务拒绝策略</h2><p>当线程池的任务缓存队列已满并且线程池中的线程数目达到maximumPoolSize，如果还有任务到来就会采取任务拒绝策略，通常有以下四种策略：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ThreadPoolExecutor.AbortPolicy:丢弃任务并抛出RejectedExecutionException异常。
ThreadPoolExecutor.DiscardPolicy：也是丢弃任务，但是不抛出异常。
ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后重新尝试执行任务（重复此过程）
ThreadPoolExecutor.CallerRunsPolicy：由调用线程处理该任务
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-线程池的关闭" tabindex="-1"><a class="header-anchor" href="#_6-线程池的关闭" aria-hidden="true">#</a> 6. <strong>线程池的关闭</strong></h2><p>ThreadPoolExecutor提供了两个方法，用于线程池的关闭，分别是shutdown()和shutdownNow()，其中：</p><ul><li>shutdown()：不会立即终止线程池，而是要等所有任务缓存队列中的任务都执行完后才终止，但再也不会接受新的任务</li><li>shutdownNow()：立即终止线程池，并尝试打断正在执行的任务，并且清空任务缓存队列，返回尚未执行的任务</li></ul><h2 id="_7-线程池容量的动态调整" tabindex="-1"><a class="header-anchor" href="#_7-线程池容量的动态调整" aria-hidden="true">#</a> 7. <strong>线程池容量的动态调整</strong></h2><p>ThreadPoolExecutor提供了动态调整线程池容量大小的方法：setCorePoolSize()和setMaximumPoolSize()，</p><ul><li>setCorePoolSize：设置核心池大小</li><li>setMaximumPoolSize：设置线程池最大能创建的线程数目大小</li></ul><p>当上述参数从小变大时，ThreadPoolExecutor进行线程赋值，还可能立即创建新的线程来执行任务。</p>`,81),i=[o];function t(r,p){return e(),a("div",null,i)}const c=n(l,[["render",t],["__file","java-thread-y-threadpool-principle.html.vue"]]);export{c as default};