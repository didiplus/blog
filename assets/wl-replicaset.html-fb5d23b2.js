import{ab as i,G as l,H as t,E as n,S as e,N as d,ac as c,ad as a,W as r}from"./framework-894cff3a.js";const o={},p=a('<h1 id="_3-3-9、控制器-replicaset" tabindex="-1"><a class="header-anchor" href="#_3-3-9、控制器-replicaset" aria-hidden="true">#</a> 3.3.9、控制器 - ReplicaSet</h1><p>Kubernetes 中，ReplicaSet 用来维护一个数量稳定的 Pod 副本集合，可以保证某种定义一样的 Pod 始终有指定数量的副本数在运行。</p><h2 id="replicaset的工作方式" tabindex="-1"><a class="header-anchor" href="#replicaset的工作方式" aria-hidden="true">#</a> ReplicaSet的工作方式</h2><p>ReplicaSet的定义中，包含：</p><ul><li><code>selector</code>： 用于指定哪些 Pod 属于该 ReplicaSet 的管辖范围</li><li><code>replicas</code>： 副本数，用于指定该 ReplicaSet 应该维持多少个 Pod 副本</li><li><code>template</code>： Pod模板，在 ReplicaSet 使用 Pod 模板的定义创建新的 Pod</li></ul>',5),u=n("code",null,"replicas",-1),v=a(`<p>ReplicaSet 通过 <code>selector</code> 字段的定义，识别哪些 Pod 应该由其管理。如果 Pod 没有 ownerReference 字段，或者 ownerReference 字段指向的对象不是一个控制器，且该 Pod 匹配了 ReplicaSet 的 <code>selector</code>，则该 Pod 的 ownerReference 将被修改为 该 ReplicaSet 的引用。</p><h2 id="何时使用-replicaset" tabindex="-1"><a class="header-anchor" href="#何时使用-replicaset" aria-hidden="true">#</a> 何时使用 ReplicaSet</h2><p>ReplicaSet 用来维护一个数量稳定的 Pod 副本集合。Deployment 是一个更高级别的概念，可以管理 ReplicaSet，并提供声明式的更新，以及其他的许多有用的特性。因此，推荐用户总是使用 Deployment，而不是直接使用 ReplicaSet，除非您需要一些自定义的更新应用程序的方式，或者您完全不更新应用。</p><p>这也意味着，您也许永远不会直接操作 ReplicaSet 对象。但是，对其有一定的理解是有必要的，这样您才能更好的理解和使用 Deployment。</p><h2 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example</h2><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>
File not found

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令以创建该 YAML 对应的 ReplicaSet</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> https://kuboard.cn/statics/learning/replicaset/frontend.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>执行命令，查看刚才创建的ReplicaSet：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get rs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>输出结果如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令，查看刚才创建的RelicaSet的详情：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl describe rs/frontend
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>输出结果如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Name:		frontend
Namespace:	default
Selector:	tier=frontend,tier in (frontend)
Labels:		app=guestbook
		tier=frontend
Annotations:	&lt;none&gt;
Replicas:	3 current / 3 desired
Pods Status:	3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=guestbook
                tier=frontend
  Containers:
   php-redis:
    Image:      nginx:latest
    Port:       80/TCP
    Requests:
      cpu:      100m
      memory:   100Mi
    Environment:
      GET_HOSTS_FROM:   dns
    Mounts:             &lt;none&gt;
  Volumes:              &lt;none&gt;
Events:
  FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----                -------------    --------    ------            -------
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-qhloh
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-dnjpy
  1m           1m          1        {replicaset-controller }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令，查看有哪些 Pod 被创建：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>输出结果如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>NAME             READY     STATUS    RESTARTS   AGE
frontend-9si5l   1/1       Running   0          1m
frontend-dnjpy   1/1       Running   0          1m
frontend-qhloh   1/1       Running   0          1m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令，查看 Pod 的 ownerReference：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 替换成你自己的 Pod 名称</span>
kubectl get pods frontend-9si5l <span class="token parameter variable">-o</span> yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果如下所示，其中 <code>metadata.ownerReferences</code> 字段指向了 ReplicaSet <code>frontend</code>：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token datetime number">2019-11-08T17:20:41Z</span>
  <span class="token key atrule">generateName</span><span class="token punctuation">:</span> frontend<span class="token punctuation">-</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
  <span class="token key atrule">name</span><span class="token punctuation">:</span> frontend<span class="token punctuation">-</span>9si5l
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> default
  <span class="token key atrule">ownerReferences</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> extensions/v1beta1
    <span class="token key atrule">blockOwnerDeletion</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">controller</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">kind</span><span class="token punctuation">:</span> ReplicaSet
    <span class="token key atrule">name</span><span class="token punctuation">:</span> frontend
    <span class="token key atrule">uid</span><span class="token punctuation">:</span> 892a2330<span class="token punctuation">-</span>257c<span class="token punctuation">-</span>11e9<span class="token punctuation">-</span>aecd<span class="token punctuation">-</span><span class="token number">025000000001</span>
<span class="token punctuation">...</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line"> </div><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,24);function m(b,k){const s=r("RouterLink");return l(),t("div",null,[p,n("p",null,[e("ReplicaSet 控制器将通过创建或删除 Pod，以使得当前 Pod 数量达到 "),u,e(" 指定的期望值。ReplicaSet 创建的 Pod 中，都有一个字段 "),d(s,{to:"/learning/k8s-intermediate/workload/gc.html#%E6%89%80%E6%9C%89%E8%80%85%E5%92%8C%E4%BB%8E%E5%B1%9E%E5%AF%B9%E8%B1%A1"},{default:c(()=>[e("metadata.ownerReferences")]),_:1}),e(" 用于标识该 Pod 从属于哪一个 ReplicaSet。")]),v])}const g=i(o,[["render",m],["__file","wl-replicaset.html.vue"]]);export{g as default};
