import{_ as e,c as t,o as a,U as i}from"./chunks/framework.y0HOe2qR.js";const m=JSON.parse('{"title":"MySQL 记录锁+间隙锁可以防止删除操作而导致的幻读吗？","description":"","frontmatter":{},"headers":[],"relativePath":"databases/mysql/lock/lock_phantom.md","filePath":"databases/mysql/lock/lock_phantom.md","lastUpdated":1705029886000}'),l={name:"databases/mysql/lock/lock_phantom.md"},s=i('<h1 id="mysql-记录锁-间隙锁可以防止删除操作而导致的幻读吗" tabindex="-1">MySQL 记录锁+间隙锁可以防止删除操作而导致的幻读吗？ <a class="header-anchor" href="#mysql-记录锁-间隙锁可以防止删除操作而导致的幻读吗" aria-label="Permalink to &quot;MySQL 记录锁+间隙锁可以防止删除操作而导致的幻读吗？&quot;">​</a></h1><p>大家好，我是小林。</p><p>昨天有位读者在美团二面的时候，被问到关于幻读的问题：</p><p><img src="https://img-blog.csdnimg.cn/4c48fe8a02374754b1cf92591ae8d3b4.png" alt=""></p><p>面试官反问的大概意思是，<strong>MySQL 记录锁+间隙锁可以防止删除操作而导致的幻读吗？</strong></p><p>答案是可以的。</p><p>接下来，通过几个小实验来证明这个结论吧，顺便再帮大家复习一下记录锁+间隙锁。</p><h2 id="什么是幻读" tabindex="-1">什么是幻读？ <a class="header-anchor" href="#什么是幻读" aria-label="Permalink to &quot;什么是幻读？&quot;">​</a></h2><p>首先来看看 MySQL 文档是怎么定义幻读（Phantom Read）的:</p><p><em><strong>The so-called phantom problem occurs within a transaction when the same query produces different sets of rows at different times. For example, if a SELECT is executed twice, but returns a row the second time that was not returned the first time, the row is a “phantom” row.</strong></em></p><p>翻译：当同一个查询在不同的时间产生不同的结果集时，事务中就会出现所谓的幻象问题。例如，如果 SELECT 执行了两次，但第二次返回了第一次没有返回的行，则该行是“幻像”行。</p><p>举个例子，假设一个事务在 T1 时刻和 T2 时刻分别执行了下面查询语句，途中没有执行其他任何语句：</p><div class="language-sql vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> t_test </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WHERE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>只要 T1 和 T2 时刻执行产生的结果集是不相同的，那就发生了幻读的问题，比如：</p><ul><li>T1 时间执行的结果是有 5 条行记录，而 T2 时间执行的结果是有 6 条行记录，那就发生了幻读的问题。</li><li>T1 时间执行的结果是有 5 条行记录，而 T2 时间执行的结果是有 4 条行记录，也是发生了幻读的问题。</li></ul><blockquote><p>MySQL 是怎么解决幻读的？</p></blockquote><p>MySQL InnoDB 引擎的默认隔离级别虽然是「可重复读」，但是它很大程度上避免幻读现象（并不是完全解决了，详见这篇<a href="https://xiaolincoding.com/mysql/transaction/phantom.html" target="_blank" rel="noreferrer">文章</a>），解决的方案有两种：</p><ul><li>针对<strong>快照读</strong>（普通 select 语句），是<strong>通过 MVCC 方式解决了幻读</strong>，因为可重复读隔离级别下，事务执行过程中看到的数据，一直跟这个事务启动时看到的数据是一致的，即使中途有其他事务插入了一条数据，是查询不出来这条数据的，所以就很好了避免幻读问题。</li><li>针对<strong>当前读</strong>（select ... for update 等语句），是<strong>通过 next-key lock（记录锁+间隙锁）方式解决了幻读</strong>，因为当执行 select ... for update 语句的时候，会加上 next-key lock，如果有其他事务在 next-key lock 锁范围内插入了一条记录，那么这个插入语句就会被阻塞，无法成功插入，所以就很好了避免幻读问题。</li></ul><h2 id="实验验证" tabindex="-1">实验验证 <a class="header-anchor" href="#实验验证" aria-label="Permalink to &quot;实验验证&quot;">​</a></h2><p>接下来，来验证「 MySQL 记录锁+间隙锁<strong>可以防止</strong>删除操作而导致的幻读问题」的结论。</p><p>实验环境：MySQL 8.0 版本，可重复读隔离级。</p><p>现在有一张用户表（t_user），表里<strong>只有一个主键索引</strong>，表里有以下行数据：</p><p><img src="https://img-blog.csdnimg.cn/75c5c503d7df4ad091bfc35708dce6c4.png" alt="在这里插入图片描述"></p><p>现在有一个 A 事务执行了一条查询语句，查询到年龄大于 20 岁的用户共有 6 条行记录。</p><p><img src="https://img-blog.csdnimg.cn/68dd89fc95aa42cf9b0c4251d4e9226c.png" alt=""></p><p>然后， B 事务执行了一条删除 id = 2 的语句：</p><p><img src="https://img-blog.csdnimg.cn/2332fad58bc548ec917ba7ea44d09d30.png" alt=""></p><p>此时，B 事务的删除语句就陷入了<strong>等待状态</strong>，说明是无法进行删除的。</p><p>因此，MySQL 记录锁+间隙锁<strong>可以防止</strong>删除操作而导致的幻读问题。</p><h3 id="加锁分析" tabindex="-1">加锁分析 <a class="header-anchor" href="#加锁分析" aria-label="Permalink to &quot;加锁分析&quot;">​</a></h3><p>问题来了，A 事务在执行 select ... for update 语句时，具体加了什么锁呢？</p><p>我们可以通过 <code>select * from performance_schema.data_locks\\G;</code> 这条语句，查看事务执行 SQL 过程中加了什么锁。</p><p>输出的内容很多，共有 11 行信息，我删减了一些不重要的信息：</p><p><img src="https://img-blog.csdnimg.cn/90e68bf52b2c4e8a9127cfcbb0f0a322.png" alt="请添加图片描述"></p><p>从上面输出的信息可以看到，共加了两种不同粒度的锁，分别是：</p><ul><li>表锁（<code>LOCK_TYPE: TABLE</code>）：X 类型的意向锁；</li><li>行锁（<code>LOCK_TYPE: RECORD</code>）：X 类型的 next-key 锁；</li></ul><p>这里我们重点关注「行锁」，图中 <code>LOCK_TYPE</code> 中的 <code>RECORD</code> 表示行级锁，而不是记录锁的意思：</p><ul><li>如果 LOCK_MODE 为 <code>X</code>，说明是 next-key 锁；</li><li>如果 LOCK_MODE 为 <code>X, REC_NOT_GAP</code>，说明是记录锁；</li><li>如果 LOCK_MODE 为 <code>X, GAP</code>，说明是间隙锁；</li></ul><p>然后通过 <code>LOCK_DATA</code> 信息，可以确认 next-key 锁的范围，具体怎么确定呢？</p><ul><li>根据我的经验，如果 LOCK_MODE 是 next-key 锁或者间隙锁，那么 <strong>LOCK_DATA 就表示锁的范围最右值</strong>，而锁范围的最左值为 LOCK_DATA 的上一条记录的值。</li></ul><p>因此，此时事务 A 在主键索引（<code>INDEX_NAME : PRIMARY</code>）上加了 10 个 next-key 锁，如下：</p><ul><li>X 型的 next-key 锁，范围：(-∞, 1]</li><li>X 型的 next-key 锁，范围：(1, 2]</li><li>X 型的 next-key 锁，范围：(2, 3]</li><li>X 型的 next-key 锁，范围：(3, 4]</li><li>X 型的 next-key 锁，范围：(4, 5]</li><li>X 型的 next-key 锁，范围：(5, 6]</li><li>X 型的 next-key 锁，范围：(6, 7]</li><li>X 型的 next-key 锁，范围：(7, 8]</li><li>X 型的 next-key 锁，范围：(8, 9]</li><li>X 型的 next-key 锁，范围：(9, +∞]</li></ul><p><strong>这相当于把整个表给锁住了，其他事务在对该表进行增、删、改操作的时候都会被阻塞</strong>。</p><p>只有在事务 A 提交了事务，事务 A 执行过程中产生的锁才会被释放。</p><blockquote><p>为什么只是查询年龄 20 岁以上行记录，而把整个表给锁住了呢？</p></blockquote><p>这是因为事务 A 的这条查询语句是<strong>全表扫描，锁是在遍历索引的时候加上的，并不是针对输出的结果加锁</strong>。</p><p><img src="https://img-blog.csdnimg.cn/e0b2a18daa864306a84ec51c0866d170.png" alt=""></p><p>因此，<strong>在线上在执行 update、delete、select ... for update 等具有加锁性质的语句，一定要检查语句是否走了索引，如果是全表扫描的话，会对每一个索引加 next-key 锁，相当于把整个表锁住了</strong>，这是挺严重的问题。</p><blockquote><p>如果对 age 建立索引，事务 A 这条查询会加什么锁呢？</p></blockquote><p>接下来，我<strong>对 age 字段建立索引</strong>，然后再执行这条查询语句：</p><p><img src="https://img-blog.csdnimg.cn/68dd89fc95aa42cf9b0c4251d4e9226c.png" alt=""></p><p>接下来，继续通过 <code>select * from performance_schema.data_locks\\G;</code> 这条语句，查看事务执行 SQL 过程中加了什么锁。</p><p>具体的信息，我就不打印了，我直接说结论吧。</p><p><strong>因为表中有两个索引，分别是主键索引和 age 索引，所以会分别对这两个索引加锁。</strong></p><p>主键索引会加如下的锁：</p><ul><li>X 型的记录锁，锁住 id = 2 的记录；</li><li>X 型的记录锁，锁住 id = 3 的记录；</li><li>X 型的记录锁，锁住 id = 5 的记录；</li><li>X 型的记录锁，锁住 id = 6 的记录；</li><li>X 型的记录锁，锁住 id = 7 的记录；</li><li>X 型的记录锁，锁住 id = 8 的记录；</li></ul><p>分析 age 索引加锁的范围时，要先对 age 字段进行排序。 <img src="https://img-blog.csdnimg.cn/b93b31af4eec416e9f00c2adc1f7d0c1.png" alt="请添加图片描述"></p><p>age 索引加的锁：</p><ul><li>X 型的 next-key lock，锁住 age 范围 (19, 21] 的记录；</li><li>X 型的 next-key lock，锁住 age 范围 (21, 21] 的记录；</li><li>X 型的 next-key lock，锁住 age 范围 (21, 23] 的记录；</li><li>X 型的 next-key lock，锁住 age 范围 (23, 23] 的记录；</li><li>X 型的 next-key lock，锁住 age 范围 (23, 39] 的记录；</li><li>X 型的 next-key lock，锁住 age 范围 (39, 43] 的记录；</li><li>X 型的 next-key lock，锁住 age 范围 (43, +∞] 的记录；</li></ul><p>化简一下，<strong>age 索引 next-key 锁的范围是 (19, +∞]。</strong></p><p>可以看到，对 age 字段建立了索引后，查询语句是索引查询，并不会全表扫描，因此<strong>不会把整张表给锁住</strong>。</p><p><img src="https://img-blog.csdnimg.cn/2920c60d5a9b42f2a65933fa14761c20.png" alt=""></p><p>总结一下，在对 age 字段建立索引后，事务 A 在执行下面这条查询语句后，主键索引和 age 索引会加下图中的锁。</p><p><img src="https://img-blog.csdnimg.cn/5b9a2d7a2cd240fea47b938364f0b76a.png" alt="请添加图片描述"></p><p>事务 A 加上锁后，事务 B、C、D、E 在执行以下语句都会被阻塞。</p><p><img src="https://img-blog.csdnimg.cn/46c9b44142f14217b39bd973868e732e.png" alt="请添加图片描述"></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在 MySQL 的可重复读隔离级别下，针对当前读的语句会对<strong>索引</strong>加记录锁+间隙锁，这样可以避免其他事务执行增、删、改时导致幻读的问题。</p><p>有一点要注意的是，在执行 update、delete、select ... for update 等具有加锁性质的语句，一定要检查语句是否走了索引，如果是全表扫描的话，会对每一个索引加 next-key 锁，相当于把整个表锁住了，这是挺严重的问题。</p><p>完！</p><hr><p>最新的图解文章都在公众号首发，别忘记关注哦！！如果你想加入百人技术交流群，扫码下方二维码回复「加群」。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/%E5%85%B6%E4%BB%96/%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BB%8B%E7%BB%8D.png" alt=""></p>',73),p=[s];function n(o,c,r,d,g,h){return a(),t("div",null,p)}const b=e(l,[["render",n]]);export{m as __pageData,b as default};