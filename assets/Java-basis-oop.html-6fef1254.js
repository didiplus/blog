import{ab as o,G as r,H as s,E as a,S as e,N as n,ac as t,W as l}from"./framework-11534bf9.js";const c={},h=t('<h1 id="java-基础-面向对象" tabindex="-1"><a class="header-anchor" href="#java-基础-面向对象" aria-hidden="true">#</a> Java 基础 - 面向对象</h1><h2 id="_1-面向对象三大特性-封装-继承-多态" tabindex="-1"><a class="header-anchor" href="#_1-面向对象三大特性-封装-继承-多态" aria-hidden="true">#</a> 1. 面向对象三大特性：封装 继承 多态</h2><h3 id="_1-1-封装" tabindex="-1"><a class="header-anchor" href="#_1-1-封装" aria-hidden="true">#</a> 1.1 封装</h3><p>隐藏对象的属性和实现细节，仅对外公开访问方法，控制程序中属性的读和写的访问级别。</p><h3 id="_1-2-继承" tabindex="-1"><a class="header-anchor" href="#_1-2-继承" aria-hidden="true">#</a> 1.2 继承</h3><p>在一个现有类的基础之上，增加新的方法或<strong>重写</strong>已有方法，从而产生一个新类。</p><p>关于继承如下3点：</p><ol><li>子类拥有父类对象所有的属性和方法（包括私有属性和私有方法），但是父类的私有属性和方法子类是无法访问的，<strong>只是拥有</strong></li><li>子类可以拥有自己属性和方法，既子类可以对父类进行扩展</li><li>子类可以用自己的方式实现父类的方法（重写）</li></ol><h3 id="_1-3-多态" tabindex="-1"><a class="header-anchor" href="#_1-3-多态" aria-hidden="true">#</a> 1.3 多态</h3><p>对象在不同时刻表现出来的不同状态。在编译时并不能确定，只有在运行期间才能决定</p><blockquote><p>所谓多态就是指程序中定义的引用变量所指向的具体类型和通过该引用变量发出的方法调用在<strong>编程时并不确定</strong>，而是在程序运行期间才确定，既<strong>一个引用变量到底会指向哪个类的实例对象，该引用变量发出的方法调用到底是哪个类中实现的方法，必须在由程序运行期间才能决定</strong></p></blockquote><h4 id="_1-3-1-java-中实现多态的方式" tabindex="-1"><a class="header-anchor" href="#_1-3-1-java-中实现多态的方式" aria-hidden="true">#</a> 1.3.1 Java 中实现多态的方式</h4><ol><li>继承：多个子类对同一方法的重写</li><li>接口：实现接口并覆盖接口的统一方法</li></ol><h2 id="_2-类图" tabindex="-1"><a class="header-anchor" href="#_2-类图" aria-hidden="true">#</a> 2. 类图</h2>',14),d={href:"https://www.planttext.com/",target:"_blank",rel:"noopener noreferrer"},g={href:"http://plantuml.com/",target:"_blank",rel:"noopener noreferrer"},p=t('<h3 id="_2-1-泛化关系-generalization" tabindex="-1"><a class="header-anchor" href="#_2-1-泛化关系-generalization" aria-hidden="true">#</a> 2.1 泛化关系 (Generalization)</h3><p>用来描述继承关系，在 Java 中使用 extends 关键字。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220812205554172.png" alt="image-20220812205554172" tabindex="0" loading="lazy"><figcaption>image-20220812205554172</figcaption></figure><h3 id="_2-2-实现关系-realization" tabindex="-1"><a class="header-anchor" href="#_2-2-实现关系-realization" aria-hidden="true">#</a> 2.2 实现关系 (Realization)</h3><p>用来实现一个接口，在 Java 中使用 implement 关键字。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220812205633633.png" alt="image-20220812205633633" tabindex="0" loading="lazy"><figcaption>image-20220812205633633</figcaption></figure><h3 id="_2-3-聚合关系-aggregation" tabindex="-1"><a class="header-anchor" href="#_2-3-聚合关系-aggregation" aria-hidden="true">#</a> 2.3 聚合关系 (Aggregation)</h3><p>表示整体由部分组成，但是整体和部分不是强依赖的，整体不存在了部分还是会存在。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220812205717745.png" alt="image-20220812205717745" tabindex="0" loading="lazy"><figcaption>image-20220812205717745</figcaption></figure><h3 id="_2-4-组合关系-composition" tabindex="-1"><a class="header-anchor" href="#_2-4-组合关系-composition" aria-hidden="true">#</a> 2.4 组合关系 (Composition)</h3><p>和聚合不同，组合中整体和部分是强依赖的，整体不存在了部分也不存在了。比如公司和部门，公司没了部门就不存在了。但是公司和员工就属于聚合关系了，因为公司没了员工还在。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220812205744643.png" alt="image-20220812205744643" tabindex="0" loading="lazy"><figcaption>image-20220812205744643</figcaption></figure><h3 id="_2-5-关联关系-association" tabindex="-1"><a class="header-anchor" href="#_2-5-关联关系-association" aria-hidden="true">#</a> 2.5 关联关系 (Association)</h3><p>表示不同类对象之间有关联，这是一种静态关系，与运行过程的状态无关，在最开始就可以确定。因此也可以用 1 对 1、多对 1、多对多这种关联关系来表示。比如学生和学校就是一种关联关系，一个学校可以有很多学生，但是一个学生只属于一个学校，因此这是一种多对一的关系，在运行开始之前就可以确定。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220812205816656.png" alt="image-20220812205816656" tabindex="0" loading="lazy"><figcaption>image-20220812205816656</figcaption></figure><h3 id="_2-6-依赖关系-dependency" tabindex="-1"><a class="header-anchor" href="#_2-6-依赖关系-dependency" aria-hidden="true">#</a> 2.6 依赖关系 (Dependency)</h3><p>和关联关系不同的是，依赖关系是在运行过程中起作用的。A 类和 B 类是依赖关系主要有三种形式:</p><ul><li>A 类是 B 类中的(某中方法的)局部变量；</li><li>A 类是 B 类方法当中的一个参数；</li><li>A 类向 B 类发送消息，从而影响 B 类发生变化；</li></ul><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220812205907513.png" alt="image-20220812205907513" tabindex="0" loading="lazy"><figcaption>image-20220812205907513</figcaption></figure><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>',20),_={href:"https://pdai.tech/md/java/basic/java-basic-oop.html",target:"_blank",rel:"noopener noreferrer"},f=a("strong",null,"Java 基础 - 面向对象",-1);function m(b,u){const i=l("ExternalLinkIcon");return r(),s("div",null,[h,a("p",null,[e("以下类图使用 "),a("a",d,[e("PlantUML"),n(i)]),e(" 绘制，更多语法及使用请参考: "),a("a",g,[e("http://plantuml.com/"),n(i)]),e(" 。")]),p,a("p",null,[a("a",_,[f,n(i)])])])}const x=o(c,[["render",m],["__file","Java-basis-oop.html.vue"]]);export{x as default};
