import{ab as a,G as i,H as e,ac as g}from"./framework-11534bf9.js";const t={},n=g('<h1 id="垃圾收集器垃圾收集算法" tabindex="-1"><a class="header-anchor" href="#垃圾收集器垃圾收集算法" aria-hidden="true">#</a> 垃圾收集器垃圾收集算法</h1><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190925225149527.png" alt="image-20190925225149527" tabindex="0" loading="lazy"><figcaption>image-20190925225149527</figcaption></figure><h2 id="_1-标记-清除算法" tabindex="-1"><a class="header-anchor" href="#_1-标记-清除算法" aria-hidden="true">#</a> 1. 标记-清除算法</h2><p>该算法分为“标记”和“清除”阶段：首先标记出所有需要回收的对象，在标记完成后统一回收所有被标记的对象。它是最基础的收集算法，后续的算法都是对其不足进行改进得到。这种垃圾收集算法会带来两个明显的问题：</p><ol><li><strong>效率问题</strong></li><li><strong>空间问题（标记清除后会产生大量不连续的碎片）</strong></li></ol><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190925225333900.png" alt="image-20190925225333900" tabindex="0" loading="lazy"><figcaption>image-20190925225333900</figcaption></figure><h2 id="_2-复制算法" tabindex="-1"><a class="header-anchor" href="#_2-复制算法" aria-hidden="true">#</a> 2. 复制算法</h2><p>为了解决效率问题，“复制”收集算法出现了。它可以将内存分为大小相同的两块，每次使用其中的一块。当这一块的内存使用完后，就将还存活的对象复制到另一块去，然后再把使用的空间一次清理掉。这样就使每次的内存回收都是对内存区间的一半进行回收。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190925225448917.png" alt="image-20190925225448917" tabindex="0" loading="lazy"><figcaption>image-20190925225448917</figcaption></figure><h2 id="_3-标记-整理算法" tabindex="-1"><a class="header-anchor" href="#_3-标记-整理算法" aria-hidden="true">#</a> 3. 标记-整理算法</h2><p>根据老年代的特点提出的一种标记算法，标记过程仍然与“标记-清除”算法一样，但后续步骤不是直接对可回收对象回收，而是让所有存活的对象向一端移动，然后直接清理掉端边界以外的内存。</p><figure><img src="https://zszblog.oss-cn-beijing.aliyuncs.com/zszblog/blogimage-master/img/image-20190925225549662.png" alt="image-20190925225549662" tabindex="0" loading="lazy"><figcaption>image-20190925225549662</figcaption></figure><h2 id="_4-分代收集算法" tabindex="-1"><a class="header-anchor" href="#_4-分代收集算法" aria-hidden="true">#</a> 4. 分代收集算法</h2><p>当前虚拟机的垃圾收集都采用分代收集算法，这种算法没有什么新的思想，只是根据对象存活周期的不同将内存分为几块。一般将 java 堆分为新生代和老年代，这样我们就可以根据各个年代的特点选择合适的垃圾收集算法。</p><p><strong>比如在新生代中，每次收集都会有大量对象死去，所以可以选择复制算法，只需要付出少量对象的复制成本就可以完成每次垃圾收集。而老年代的对象存活几率是比较高的，而且没有额外的空间对它进行分配担保，所以我们必须选择“标记-清除”或“标记-整理”算法进行垃圾收集。</strong></p><p><strong>延伸面试问题：</strong> HotSpot 为什么要分为新生代和老年代？</p>',16),o=[n];function s(r,c){return i(),e("div",null,o)}const h=a(t,[["render",s],["__file","java-jvm-gc-orth.html.vue"]]);export{h as default};
