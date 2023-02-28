import{ab as s,G as n,H as a,ad as t}from"./framework-894cff3a.js";const e={},o=t(`<h1 id="类加载器" tabindex="-1"><a class="header-anchor" href="#类加载器" aria-hidden="true">#</a> 类加载器</h1><h2 id="_1-回顾类加载过程" tabindex="-1"><a class="header-anchor" href="#_1-回顾类加载过程" aria-hidden="true">#</a> 1. 回顾类加载过程</h2><p>类加载过程：<strong>加载-&gt;连接-&gt;初始化</strong>。连接过程由可以分成三步：<strong>验证-&gt;准备-&gt;解析</strong></p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190929170059337.png" alt="image-20190929170059337" tabindex="0" loading="lazy"><figcaption>image-20190929170059337</figcaption></figure><p>一个非数组类的加载阶段（加载阶段获取类的二进制字节流的动作）是可控最强的阶段，这一步我们可以去完成还可以自定义类加载器去控制字节流的获取方式（重写一个类加载器的 <code>loadClass()</code> 方法）。数组类型不通过类加载器创建，他由Java虚拟机直接创建</p><p>所有的类都是由类加载器加载，加载的作用就是将.class文件加载到内存</p><h2 id="_2-类加载器总结" tabindex="-1"><a class="header-anchor" href="#_2-类加载器总结" aria-hidden="true">#</a> 2. 类加载器总结</h2><p>JVM中内置了三个重要的ClassLoader，除了BootstrapClassLoader 其他类加载器均有 Java 实现且全部继承自<code>java.lang.ClassLoader</code>：</p><ul><li><strong>BootstrapClassLoader(启动类加载器)</strong>：最顶层的加载类，由C++实现。负责加载<code>%JAVA_HOME%/lib</code>目录下的jar包和类或者或被 <code>-Xbootclasspath</code>参数指定的路径中的所有类。</li><li><strong>ExtClassLoader（扩展类加载器）</strong>：主要负责加载目录 <code>%JRE_HOME%/lib/ext</code> 目录下的jar包和类，或被 <code>java.ext.dirs</code> 系统变量所指定的路径下的jar包。</li><li><strong>AppClassLoader(应用程序类加载器)</strong> ：面向我们用户的加载器，负责加载当前应用classpath下的所有jar包和类</li></ul><h2 id="_3-双亲委派模型" tabindex="-1"><a class="header-anchor" href="#_3-双亲委派模型" aria-hidden="true">#</a> 3. 双亲委派模型</h2><h3 id="_3-1-介绍" tabindex="-1"><a class="header-anchor" href="#_3-1-介绍" aria-hidden="true">#</a> 3.1 介绍</h3><p>每一个类都有一个对应他的类加载器。系统中的ClassLoader 在协同工作的时候会默认使用 <strong>双亲委派模型</strong>。既在类加载的时候，系统会首先判断当前类是否被加载过。已经被加载的类会直接返回，否则才会尝试加载。加载的时候，首先会把该请求委派该父类加载器的 <code>loadClass()</code> 处理，因此所有的请求最终都应该传送到顶层的启动类加载器 <code>BootstrapClassLoader</code> 中。当父类加载器无法处理时，才由自己来处理。当父类加载器为null时，会使用启动类加载器 <code>BootstrapClassLoader</code> 作为父类加载器。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190929215241442.png" alt="image-20190929215241442" tabindex="0" loading="lazy"><figcaption>image-20190929215241442</figcaption></figure><p>每个类加载都有一个父类加载器，我们通过下面的程序来验证。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ClassLoaderDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;ClassLodarDemo&#39;s ClassLoader is &quot;</span> <span class="token operator">+</span> <span class="token class-name">ClassLoaderDemo</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getClassLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;The Parent of ClassLodarDemo&#39;s ClassLoader is &quot;</span> <span class="token operator">+</span> <span class="token class-name">ClassLoaderDemo</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getClassLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;The GrandParent of ClassLodarDemo&#39;s ClassLoader is &quot;</span> <span class="token operator">+</span> <span class="token class-name">ClassLoaderDemo</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getClassLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ClassLodarDemo&#39;s ClassLoader is sun.misc.Launcher$AppClassLoader@18b4aac2
The Parent of ClassLodarDemo&#39;s ClassLoader is sun.misc.Launcher$ExtClassLoader@1b6d3586
The GrandParent of ClassLodarDemo&#39;s ClassLoader is null
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>AppClassLoader</code>的父类加载器为<code>ExtClassLoader</code> <code>ExtClassLoader</code>的父类加载器为null，<strong>null并不代表ExtClassLoader没有父类加载器，而是 BootstrapClassLoader</strong> 。</p><p>其实这个双亲翻译的容易让别人误解，我们一般理解的双亲都是父母，这里的双亲更多地表达的是“父母这一辈”的人而已，并不是说真的有一个 Mother ClassLoader 和一个 Father ClassLoader 。另外，类加载器之间的“父子”关系也不是通过继承来体现的，是由“优先级”来决定。官方API文档对这部分的描述如下:</p><blockquote><p>The Java platform uses a delegation model for loading classes. <strong>The basic idea is that every class loader has a &quot;parent&quot; class loader.</strong> When loading a class, a class loader first &quot;delegates&quot; the search for the class to its parent class loader before attempting to find the class itself.</p></blockquote><h3 id="_3-2-双亲委派模型源码分析" tabindex="-1"><a class="header-anchor" href="#_3-2-双亲委派模型源码分析" aria-hidden="true">#</a> 3.2 双亲委派模型源码分析</h3><p>双亲委派模型的实现代码非常简单，逻辑非常清晰，都集中在 <code>java.lang.ClassLoader</code> 的 <code>loadClass()</code> 中，相关代码如下所示。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">ClassLoader</span> parent<span class="token punctuation">;</span> 
<span class="token keyword">protected</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> <span class="token function">loadClass</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span> <span class="token keyword">boolean</span> resolve<span class="token punctuation">)</span>
        <span class="token keyword">throws</span> <span class="token class-name">ClassNotFoundException</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token function">getClassLoadingLock</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 首先，检查请求的类是否已经被加载过</span>
            <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> c <span class="token operator">=</span> <span class="token function">findLoadedClass</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">long</span> t0 <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">nanoTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>parent <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//父加载器不为空，调用父加载器loadClass()方法处理</span>
                        c <span class="token operator">=</span> parent<span class="token punctuation">.</span><span class="token function">loadClass</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span><span class="token comment">//父加载器为空，使用启动类加载器 BootstrapClassLoader 加载</span>
                        c <span class="token operator">=</span> <span class="token function">findBootstrapClassOrNull</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">ClassNotFoundException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                   <span class="token comment">//抛出异常说明父类加载器无法完成加载请求</span>
                <span class="token punctuation">}</span>
                
                <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">long</span> t1 <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">nanoTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token comment">//自己尝试加载</span>
                    c <span class="token operator">=</span> <span class="token function">findClass</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>

                    <span class="token comment">// this is the defining class loader; record the stats</span>
                    <span class="token class-name"><span class="token namespace">sun<span class="token punctuation">.</span>misc<span class="token punctuation">.</span></span>PerfCounter</span><span class="token punctuation">.</span><span class="token function">getParentDelegationTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addTime</span><span class="token punctuation">(</span>t1 <span class="token operator">-</span> t0<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name"><span class="token namespace">sun<span class="token punctuation">.</span>misc<span class="token punctuation">.</span></span>PerfCounter</span><span class="token punctuation">.</span><span class="token function">getFindClassTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addElapsedTimeFrom</span><span class="token punctuation">(</span>t1<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name"><span class="token namespace">sun<span class="token punctuation">.</span>misc<span class="token punctuation">.</span></span>PerfCounter</span><span class="token punctuation">.</span><span class="token function">getFindClasses</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>resolve<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token function">resolveClass</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">return</span> c<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-双亲委派模型的好处" tabindex="-1"><a class="header-anchor" href="#_3-3-双亲委派模型的好处" aria-hidden="true">#</a> 3.3 双亲委派模型的好处</h3><ul><li><p>双亲委派模型保证了Java程序的稳定运行，可以避免类的重复加载</p><p>（JVM 区分不同类的方式不仅仅根据类名，相同的类文件被不同的类加载器加载产生的是两个不同的类）</p></li><li><p>保证了 Java 的核心 API 不被篡改</p><p>如果没有使用双亲委派模型，而是每个类加载器加载自己的话就会出现一些问题，比如我们编写一个称为 <code>java.lang.Object</code> 类的话，那么程序运行的时候，系统就会出现多个不同的 <code>Object</code> 类。</p></li></ul><h2 id="_4-不使用双亲委派模型" tabindex="-1"><a class="header-anchor" href="#_4-不使用双亲委派模型" aria-hidden="true">#</a> 4. 不使用双亲委派模型</h2><h3 id="如果我们不想用双亲委派模型怎么办" tabindex="-1"><a class="header-anchor" href="#如果我们不想用双亲委派模型怎么办" aria-hidden="true">#</a> 如果我们不想用双亲委派模型怎么办？</h3><p>为了避免双亲委托机制，我们可以自己定义一个类加载器，然后重载 <code>loadClass()</code> 即可。</p><h2 id="_5-自定义类加载器" tabindex="-1"><a class="header-anchor" href="#_5-自定义类加载器" aria-hidden="true">#</a> 5. 自定义类加载器</h2><p>除了 <code>BootstrapClassLoader</code> 其他类加载器均由 Java 实现且全部继承自<code>java.lang.ClassLoader</code>。如果我们要自定义自己的类加载器，很明显需要继承 <code>ClassLoader</code>。</p>`,30),p=[o];function c(l,i){return n(),a("div",null,p)}const d=s(e,[["render",c],["__file","java-jvm-classload1.html.vue"]]);export{d as default};