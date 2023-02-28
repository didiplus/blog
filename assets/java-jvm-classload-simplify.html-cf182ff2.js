import{ab as s,G as n,H as e,E as a,S as t,N as i,ad as l,W as o}from"./framework-894cff3a.js";const h={},p=l('<h1 id="类加载过程-精简版" tabindex="-1"><a class="header-anchor" href="#类加载过程-精简版" aria-hidden="true">#</a> 类加载过程(精简版)</h1><h1 id="_1-前言" tabindex="-1"><a class="header-anchor" href="#_1-前言" aria-hidden="true">#</a> 1. 前言</h1><p>一个java文件从编码完成到最终执行，一般主要包含两个过程</p><ul><li>编译</li><li>运行</li></ul><p><strong>编译</strong>，即把我们写好的java文件，通过javac命令编译成字节码，也就是我们常说的.class文件。</p><p><strong>运行</strong>，则是把编译生成的.class文件交给Java虚拟机(JVM)执行。</p><p>而我们所说的类加载过程即是指JVM虚拟机把.class文件中类信息加载进内存，并进行解析生成对应的class对象的过程。</p><p>举个通俗点的例子来说，JVM在执行某段代码时，遇到了class A， 然而此时内存中并没有class A的相关信息，于是JVM就会到相应的class文件中去寻找class A的类信息，并加载进内存中，这就是我们所说的类加载过程。</p><p>由此可见，JVM不是一开始就把所有的类都加载进内存中，而是只有第一次遇到某个需要运行的类时才会加载，且<strong>只加载一次</strong>。</p><h2 id="_2-类加载" tabindex="-1"><a class="header-anchor" href="#_2-类加载" aria-hidden="true">#</a> 2. 类加载</h2><p>类加载的过程主要分为三个部分：</p><ul><li>加载</li><li>链接</li><li>初始化</li></ul><p>而链接又可以细分为三个小部分：</p><ul><li>验证</li><li>准备</li><li>解析</li></ul><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190928231926138.png" alt="image-20190928231926138" tabindex="0" loading="lazy"><figcaption>image-20190928231926138</figcaption></figure><h3 id="_2-1-加载" tabindex="-1"><a class="header-anchor" href="#_2-1-加载" aria-hidden="true">#</a> 2.1 加载</h3><p>简单来说，加载指的是把class字节码文件从各个来源通过类加载器装载入内存中。</p><p>这里有两个重点：</p><ul><li><strong>字节码来源</strong>。一般的加载来源包括从本地路径下编译生成的.class文件，从jar包中的.class文件，从远程网络，以及动态代理实时编译</li><li><strong>类加载器</strong>。一般包括<strong>启动类加载器</strong>，<strong>扩展类加载器</strong>，<strong>应用类加载器</strong>，以及用户的<strong>自定义类加载器</strong>。</li></ul><p><strong>注：为什么会有自定义类加载器？</strong></p><ul><li>一方面是由于java代码很容易被反编译，如果需要对自己的代码加密的话，可以对编译后的代码进行加密，然后再通过实现自己的自定义类加载器进行解密，最后再加载。</li><li>另一方面也有可能从非标准的来源加载代码，比如从网络来源，那就需要自己实现一个类加载器，从指定源进行加载。</li></ul><h3 id="_2-2-链接" tabindex="-1"><a class="header-anchor" href="#_2-2-链接" aria-hidden="true">#</a> 2.2 链接</h3><h4 id="_2-2-1-验证" tabindex="-1"><a class="header-anchor" href="#_2-2-1-验证" aria-hidden="true">#</a> 2.2.1 验证</h4><p>主要是为了保证加载进来的字节流符合虚拟机规范，不会造成安全错误。</p><p>包括对于<strong>文件格式的验证</strong>，比如常量中是否有不被支持的常量？文件中是否有不规范的或者附加的其他信息？</p><p>对于<strong>元数据的验证</strong>，比如该类是否继承了被final修饰的类？类中的字段，方法是否与父类冲突？是否出现了不合理的重载？</p><p>对于<strong>字节码的验证</strong>，保证程序语义的合理性，比如要保证类型转换的合理性。</p><p>对于<strong>符号引用的验证</strong>，比如校验符号引用中通过全限定名是否能够找到对应的类？校验符号引用中的访问性（private，public等）是否可被当前类访问？</p><h4 id="_2-2-2-准备" tabindex="-1"><a class="header-anchor" href="#_2-2-2-准备" aria-hidden="true">#</a> 2.2.2 准备</h4><p>主要是为类变量（注意，不是实例变量）分配内存，并且赋予<strong>初值</strong>。</p><p>特别需要注意，<strong>初值，不是代码中具体写的初始化的值</strong>，而是Java虚拟机根据不同变量类型的默认初始值。</p><p>比如8种<strong>基本类型</strong>的初值，默认为0；<strong>引用类型</strong>的初值则为null；<strong>常量</strong>的初值即为代码中设置的值，final static tmp = 456， 那么该阶段tmp的初值就是456</p><h3 id="_2-2-3-解析" tabindex="-1"><a class="header-anchor" href="#_2-2-3-解析" aria-hidden="true">#</a> 2.2.3 解析</h3><p>将常量池内的符号引用替换为直接引用的过程。</p><p>两个重点：</p><ul><li><strong>符号引用</strong>。即一个字符串，但是这个字符串给出了一些能够唯一性识别一个方法，一个变量，一个类的相关信息。</li><li><strong>直接引用</strong>。可以理解为一个内存地址，或者一个偏移量。比如<strong>类方法，类变量</strong>的直接引用是指向方法区的<strong>指针</strong>；而<strong>实例方法，实例变量</strong>的直接引用则是从实例的头指针开始算起到这个实例变量位置的<strong>偏移量</strong></li></ul><p>举个例子来说，现在调用方法hello()，这个方法的地址是1234567，那么hello就是符号引用，1234567就是直接引用。</p><p>在解析阶段，虚拟机会把所有的类名，方法名，字段名这些符号引用替换为具体的内存地址或偏移量，也就是直接引用。</p><h3 id="_2-3-初始化" tabindex="-1"><a class="header-anchor" href="#_2-3-初始化" aria-hidden="true">#</a> 2.3 初始化</h3><p>这个阶段主要是对<strong>类变量</strong>初始化，是执行类构造器的过程。</p><p>换句话说，只对static修饰的变量或语句进行初始化。</p><p>如果初始化一个类的时候，其父类尚未初始化，则优先初始化其父类。</p><p>如果同时包含多个静态变量和静态代码块，则按照自上而下的顺序依次执行。</p><h2 id="_3-总结" tabindex="-1"><a class="header-anchor" href="#_3-总结" aria-hidden="true">#</a> 3. 总结</h2><p>类加载过程只是一个类生命周期的一部分，在其前，有编译的过程，只有对源代码编译之后，才能获得能够被虚拟机加载的字节码文件；在其后还有具体的类使用过程，当使用完成之后，还会在方法区垃圾回收的过程中进行卸载。</p><p><strong>相关扩展知识点：</strong></p><ul><li>Java虚拟机的基本机构？</li><li>什么是类加载器？</li><li>简单谈一下类加载的双亲委托机制？</li><li>普通Java类的类加载过程和Tomcat的类加载过程是否一样？区别在哪？</li><li>简单谈一下Java堆的垃圾回收机制？</li></ul><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>',48),c={href:"https://zhuanlan.zhihu.com/p/33509426?utm_source=wechat_session&utm_medium=social&utm_oi=52825262391296",target:"_blank",rel:"noopener noreferrer"};function d(g,u){const r=o("ExternalLinkIcon");return n(),e("div",null,[p,a("p",null,[a("a",c,[t("面试官：请你谈谈Java的类加载过程"),i(r)])])])}const m=s(h,[["render",d],["__file","java-jvm-classload-simplify.html.vue"]]);export{m as default};