import{ab as u,G as s,H as i,E as l,N as o,ac as e,S as t,W as _}from"./framework-894cff3a.js";const d={},a=l("h1",{id:"图解mysql介绍",tabindex:"-1"},[l("a",{class:"header-anchor",href:"#图解mysql介绍","aria-hidden":"true"},"#"),t(" 图解MySQL介绍")],-1),m=l("p",null,"《图解MySQL》目前还在连载更新中，大家不要催啦😂 ，更新完会第一时间整理 PDF 的。",-1),c=l("p",null,"目前已经更新好的文章：",-1),h=l("p",null,[l("strong",null,"基础篇"),t("👇")],-1),r=l("p",null,[l("strong",null,"索引篇"),t(" 👇")],-1),f=l("p",null,[l("strong",null,"事务篇"),t(" 👇")],-1),y=l("p",null,[l("strong",null,"锁篇"),t(" 👇")],-1),p=l("p",null,[l("strong",null,"日志篇"),t(" 👇")],-1),x=l("p",null,[l("strong",null,"内存篇"),t(" 👇")],-1),q=l("hr",null,null,-1),g=l("p",null,"最新的图解文章都在公众号首发，别忘记关注哦！！如果你想加入百人技术交流群，扫码下方二维码回复「加群」。",-1),k=l("figure",null,[l("img",{src:"https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/其他/公众号介绍.png",alt:"img",tabindex:"0",loading:"lazy"}),l("figcaption",null,"img")],-1);function L(S,Q){const n=_("RouterLink");return s(),i("div",null,[a,m,c,l("ul",null,[l("li",null,[h,l("ul",null,[l("li",null,[o(n,{to:"/mysql/base/how_select.html"},{default:e(()=>[t("执行一条 SQL 查询语句，期间发生了什么？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/base/row_format.html"},{default:e(()=>[t("MySQL 一行记录是怎么存储的？")]),_:1})])])]),l("li",null,[r,l("ul",null,[l("li",null,[o(n,{to:"/mysql/index/index_interview.html"},{default:e(()=>[t("索引常见面试题")]),_:1})]),l("li",null,[o(n,{to:"/mysql/index/page.html"},{default:e(()=>[t("从数据页的角度看 B+ 树")]),_:1})]),l("li",null,[o(n,{to:"/mysql/index/why_index_chose_bpuls_tree.html"},{default:e(()=>[t("为什么 MySQL 采用 B+ 树作为索引？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/index/2000w.html"},{default:e(()=>[t("MySQL 单表不要超过 2000W 行，靠谱吗？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/index/index_lose.html"},{default:e(()=>[t("索引失效有哪些？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/index/index_issue.html"},{default:e(()=>[t("MySQL 使用 like “%x“，索引一定会失效吗？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/index/count.html"},{default:e(()=>[t("count(*) 和 count(1) 有什么区别？哪个性能最好？")]),_:1})])])]),l("li",null,[f,l("ul",null,[l("li",null,[o(n,{to:"/mysql/transaction/mvcc.html"},{default:e(()=>[t("事务隔离级别是怎么实现的？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/transaction/phantom.html"},{default:e(()=>[t("MySQL 可重复读隔离级别，完全解决幻读了吗？")]),_:1})])])]),l("li",null,[y,l("ul",null,[l("li",null,[o(n,{to:"/mysql/lock/mysql_lock.html"},{default:e(()=>[t("MySQL 有哪些锁？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/lock/how_to_lock.html"},{default:e(()=>[t("MySQL 是怎么加锁的？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/lock/update_index.html"},{default:e(()=>[t("update 没加索引会锁全表?")]),_:1})]),l("li",null,[o(n,{to:"/mysql/lock/lock_phantom.html"},{default:e(()=>[t("MySQL 记录锁+间隙锁可以防止删除操作而导致的幻读吗？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/lock/deadlock.html"},{default:e(()=>[t("MySQL 死锁了，怎么办？")]),_:1})]),l("li",null,[o(n,{to:"/mysql/lock/show_lock.html"},{default:e(()=>[t("字节面试：加了什么锁，导致死锁的？")]),_:1})])])]),l("li",null,[p,l("ul",null,[l("li",null,[o(n,{to:"/mysql/log/how_update.html"},{default:e(()=>[t("undo log、redo log、binlog 有什么用？")]),_:1})])])]),l("li",null,[x,l("ul",null,[l("li",null,[o(n,{to:"/mysql/buffer_pool/buffer_pool.html"},{default:e(()=>[t("揭开 Buffer_Pool 的面纱")]),_:1})])]),q,g,k])])])}const b=u(d,[["render",L],["__file","index.html.vue"]]);export{b as default};