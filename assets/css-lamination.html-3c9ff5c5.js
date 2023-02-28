import{ab as n,G as s,H as a,ad as t}from"./framework-894cff3a.js";const p={},e=t(`<h1 id="css层叠" tabindex="-1"><a class="header-anchor" href="#css层叠" aria-hidden="true">#</a> CSS层叠</h1><h2 id="_1-背景" tabindex="-1"><a class="header-anchor" href="#_1-背景" aria-hidden="true">#</a> 1. 背景</h2><p>自己在项目中对z-index 理解的并不到位，导致在使用过程中与预期效果不一致。</p><blockquote><p>一直认为<code>z-index</code>就是用来描述定义一个元素在屏幕<code>Z轴</code>上的堆叠顺序。<code>z-index</code>值越大在<code>Z轴</code>上就越靠上，也就是离屏幕观察者越近。最后才发现这个认识存在很大的问题：</p></blockquote><ol><li><p>首先，<code>z-index</code>属性值并不是在任何元素上都有效果。它<strong>仅在定位元素（定义了<code>position</code>属性，且属性值为非<code>static</code>值的元素）上有效果</strong>。</p></li><li><p>判断元素在<code>Z轴</code>上的堆叠顺序，不仅仅是直接比较两个元素的<code>z-index</code>值的大小，这个堆叠顺序实际由元素的<strong>层叠上下文</strong>、<strong>层叠等级</strong>共同决定。</p></li></ol><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/image-20220404110849700.png" alt="image-20220404110849700" tabindex="0" loading="lazy"><figcaption>image-20220404110849700</figcaption></figure><h2 id="_2-什么是-层叠上下文" tabindex="-1"><a class="header-anchor" href="#_2-什么是-层叠上下文" aria-hidden="true">#</a> 2. 什么是“层叠上下文”</h2><p>层叠上下文(stacking context)，是HTML中一个三维的概念。在CSS2.1规范中，每个盒模型的位置是三维的，分别是平面画布上的<code>X轴</code>，<code>Y轴</code>以及表示层叠的<code>Z轴</code>。一般情况下，元素在页面上沿<code>X轴Y轴</code>平铺，我们察觉不到它们在<code>Z轴</code>上的层叠关系。而一旦元素发生堆叠，这时就能发现某个元素可能覆盖了另一个元素或者被另一个元素覆盖。</p><p>如果一个元素含有层叠上下文，(也就是说它是层叠上下文元素)，我们可以理解为这个元素在<code>Z轴</code>上就“高人一等”，最终表现就是它离屏幕观察者更近。</p><blockquote><p><strong>具象的比喻</strong>：你可以把层叠上下文元素理解为理解为<strong>该元素当了官</strong>，而其他非层叠上下文元素则可以理解为普通群众。凡是“当了官的元素”就比普通元素等级要高，也就是说元素在<code>Z轴</code>上更靠上，更靠近观察者。</p></blockquote><h2 id="_3-什么是-层叠等级" tabindex="-1"><a class="header-anchor" href="#_3-什么是-层叠等级" aria-hidden="true">#</a> 3.什么是“层叠等级”</h2><p>那么，层叠等级指的又是什么？层叠等级(stacking level，叫“层叠级别”/“层叠水平”也行)</p><ul><li>在同一个层叠上下文中，它描述定义的是该层叠上下文中的层叠上下文元素在<code>Z轴</code>上的上下顺序。</li><li>在其他普通元素中，它描述定义的是这些普通元素在<code>Z轴</code>上的上下顺序。</li></ul><p>说到这，可能很多人疑问了，不论在层叠上下文中还是在普通元素中，层叠等级都表示元素在<code>Z轴</code>上的上下顺序，那就直接说它描述定义了所有元素在<code>Z轴</code>上的上下顺序就OK啊！为什么要分开描述？</p><p>为了说明原因，先举个栗子：</p><blockquote><p><strong>具象的比喻</strong>：我们之前说到，处于层叠上下文中的元素，就像是元素当了官，等级自然比普通元素高。再想象一下，假设一个官员A是个省级领导，他下属有一个秘书a-1，家里有一个保姆a-2。另一个官员B是一个县级领导，他下属有一个秘书b-1，家里有一个保姆b-2。a-1和b-1虽然都是秘书，但是你想一个省级领导的秘书和一个县级领导的秘书之间有可比性么？甚至保姆a-2都要比秘书b-1的等级高得多。谁大谁小，谁高谁低一目了然，所以根本没有比较的意义。只有在A下属的a-1、a-2以及B下属的b-1、b-2中相互比较大小高低才有意义。</p></blockquote><p><strong>再类比回“层叠上下文”和“层叠等级”，就得出一个结论：</strong></p><ol><li>普通元素的层叠等级优先由其所在的层叠上下文决定。</li><li>层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。</li></ol><h2 id="_4-如何产生-层叠上下文" tabindex="-1"><a class="header-anchor" href="#_4-如何产生-层叠上下文" aria-hidden="true">#</a> 4. 如何产生“层叠上下文”</h2><p>前面说了那么多，知道了“层叠上下文”和“层叠等级”，其中还有一个最关键的问题：到底如何产生层叠上下文呢？如何让一个元素变成层叠上下文元素呢？</p><p>其实，层叠上下文也基本上是有一些特定的CSS属性创建的，一般有3种方法：</p><ol><li><code>HTML</code>中的根元素<code>&lt;html&gt;&lt;/html&gt;</code>本身j就具有层叠上下文，称为“根层叠上下文”。</li><li>普通元素设置<code>position</code>属性为<strong>非</strong><code>static</code>值并设置<code>z-index</code>属性为具体数值，产生层叠上下文。</li><li>CSS3中的新属性也可以产生层叠上下文。</li></ol><p>至此，终于可以上代码了，我们用代码说话，来验证上面的结论：</p><p><strong>栗子1:</strong> <strong>有两个div，p.a、p.b被包裹在一个div里，p.c被包裹在另一个盒子里，只为.a、.b、.c设置<code>position</code>和<code>z-index</code>属性</strong></p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">
  <span class="token selector">div</span> <span class="token punctuation">{</span>  
    <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>  
    <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>  
    <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>  
  <span class="token punctuation">}</span>  
  <span class="token selector">p</span> <span class="token punctuation">{</span>  
    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>  
    <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>  
    <span class="token property">width</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>  
    <span class="token property">height</span><span class="token punctuation">:</span> 100px<span class="token punctuation">;</span>  
  <span class="token punctuation">}</span>  
  <span class="token selector">.a</span> <span class="token punctuation">{</span>  
    <span class="token property">background-color</span><span class="token punctuation">:</span> blue<span class="token punctuation">;</span>  
    <span class="token property">z-index</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>  
  <span class="token punctuation">}</span>  
  <span class="token selector">.b</span> <span class="token punctuation">{</span>  
    <span class="token property">background-color</span><span class="token punctuation">:</span> green<span class="token punctuation">;</span>  
    <span class="token property">z-index</span><span class="token punctuation">:</span> 2<span class="token punctuation">;</span>  
    <span class="token property">top</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>  
    <span class="token property">left</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>  
  <span class="token punctuation">}</span>  
  <span class="token selector">.c</span> <span class="token punctuation">{</span>  
    <span class="token property">background-color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>  
    <span class="token property">z-index</span><span class="token punctuation">:</span> 3<span class="token punctuation">;</span>  
    <span class="token property">top</span><span class="token punctuation">:</span> -20px<span class="token punctuation">;</span>  
    <span class="token property">left</span><span class="token punctuation">:</span> 40px<span class="token punctuation">;</span>  
  <span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>  
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>  
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>a<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>a<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>  
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>b<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>b<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>  
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span> 

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>  
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>c<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>c<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>  
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>  
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span> 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25),o=[e];function c(l,i){return s(),a("div",null,o)}const d=n(p,[["render",c],["__file","css-lamination.html.vue"]]);export{d as default};