import{ab as r,G as c,H as i,E as e,S as n,N as s,ac as l,ad as u,W as o}from"./framework-b31a425c.js";const p={},d=e("h1",{id:"_3-2-1、什么是kubernetes对象",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_3-2-1、什么是kubernetes对象","aria-hidden":"true"},"#"),n(" 3.2.1、什么是Kubernetes对象")],-1),b={href:"https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/",target:"_blank",rel:"noopener noreferrer"},k=e("p",null,[n("本文描述了Kubernetes对象与Kubernetes API的关系，以及您如何在 "),e("code",null,".yaml"),n(" 格式的文件中定义Kubernetes对象。")],-1),m=e("p",null,"Kubernetes对象指的是Kubernetes系统的持久化实体，所有这些对象合起来，代表了你集群的实际情况。常规的应用里，我们把应用程序的数据存储在数据库中，Kubernetes将其数据以Kubernetes对象的形式通过 api server存储在 etcd 中。具体来说，这些数据（Kubernetes对象）描述了：",-1),h=e("ul",null,[e("li",null,"集群中运行了哪些容器化应用程序（以及在哪个节点上运行）"),e("li",null,"集群中对应用程序可用的资源"),e("li",null,"应用程序相关的策略定义，例如，重启策略、升级策略、容错策略"),e("li",null,"其他Kubernetes管理应用程序时所需要的信息")],-1),v=e("strong",null,"目标状态",-1),_=e("p",null,"操作 Kubernetes 对象（创建、修改、删除）的方法主要有：",-1),g={href:"https://kubernetes.io/docs/concepts/overview/kubernetes-api/",target:"_blank",rel:"noopener noreferrer"},y={href:"https://kubernetes.io/docs/reference/using-api/client-libraries/",target:"_blank",rel:"noopener noreferrer"},f=e("h2",{id:"对象的spec和status",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#对象的spec和status","aria-hidden":"true"},"#"),n(" 对象的spec和status")],-1),K=e("p",null,"每一个 Kubernetes 对象都包含了两个重要的字段：",-1),x=e("ul",null,[e("li",null,[e("code",null,"spec"),n(" 必须由您来提供，描述了您对该对象所期望的 "),e("strong",null,"目标状态")]),e("li",null,[e("code",null,"status"),n(" 只能由 Kubernetes 系统来修改，描述了该对象在 Kubernetes 系统中的 "),e("strong",null,"实际状态")])],-1),D=u(`<p>例如，一个 Kubernetes Deployment 对象可以代表一个应用程序在集群中的运行状态。当您创建 Deployment 对象时，您可以通过 Deployment 的 spec 字段指定需要运行应用程序副本数（假设为3）。Kubernetes 从 Deployment 的 spec 中读取这些信息，并为您创建指定容器化应用程序的 3 个副本，再将实际的状态更新到 Deployment 的 status 字段。Kubernetes 系统将不断地比较 <strong>实际状态</strong> staus 和 <strong>目标状态</strong> spec 之间的差异，并根据差异做出对应的调整。例如，如果任何一个副本运行失败了，Kubernetes 将启动一个新的副本，以替代失败的副本。</p><h2 id="描述kubernetes对象" tabindex="-1"><a class="header-anchor" href="#描述kubernetes对象" aria-hidden="true">#</a> 描述Kubernetes对象</h2><p>当您在 Kubernetes 中创建一个对象时，您必须提供</p><ul><li>该对象的 spec 字段，通过该字段描述您期望的 <strong>目标状态</strong></li><li>该对象的一些基本信息，例如名字</li></ul><p>如果使用 kubectl 创建对象，您必须编写 <code>.yaml</code> 格式的文件，如果通过 Kuboard 图形化工具创建，则在Kuboard 对应的界面功能中完成表单填写即可。</p><p>下面是一个 kubectl 可以使用的 <code>.yaml</code> 文件：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>deployment
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span> <span class="token comment"># 运行 2 个容器化应用程序副本</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>1.7.9
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 kube apply 命令可以创建该 <code>.yaml</code> 文件中的 Deployment 对象：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> https://kuboard.cn/statics/learning/obj/deployment.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>输出结果如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>deployment.apps/nginx-deployment created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用 kubectl delete 命令可以删除该 <code>.yaml</code> 文件中的 Deployment 对象：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl delete <span class="token parameter variable">-f</span> https://kuboard.cn/statics/learning/obj/deployment.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="必填字段" tabindex="-1"><a class="header-anchor" href="#必填字段" aria-hidden="true">#</a> 必填字段</h2><p>在上述的 <code>.yaml</code> 文件中，如下字段是必须填写的：</p><ul><li><strong>apiVersion</strong> 用来创建对象时所使用的Kubernetes API版本</li><li><strong>kind</strong> 被创建对象的类型</li><li><strong>metadata</strong> 用于唯一确定该对象的元数据：包括 <code>name</code> 和 <code>namespace</code>，如果 <code>namespace</code> 为空，则默认值为 <code>default</code></li><li><strong>spec</strong> 描述您对该对象的期望状态</li></ul>`,16),j=e("code",null,"spec",-1),w={href:"https://kubernetes.io/docs/reference/#api-reference",target:"_blank",rel:"noopener noreferrer"},I=e("code",null,"spec",-1),P={href:"https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#podspec-v1-core",target:"_blank",rel:"noopener noreferrer"},A=e("code",null,"spec",-1),E={href:"https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#deploymentspec-v1-apps",target:"_blank",rel:"noopener noreferrer"};function L(V,B){const a=o("ExternalLinkIcon"),t=o("RouterLink");return c(),i("div",null,[d,e("blockquote",null,[e("p",null,[n("参考文档： "),e("a",b,[n("Understanding Kubernetes Objects"),s(a)])])]),k,m,h,e("p",null,[n("一个Kubernetes对象代表着用户的一个意图（a record of intent），一旦您创建了一个Kubernetes对象，Kubernetes将持续工作，以尽量实现此用户的意图。创建一个 Kubernetes对象，就是告诉Kubernetes，您需要的集群中的工作负载是什么（集群的 "),v,n("）。请参考 "),s(t,{to:"/cloud/k8s/k8s-intermediate/architecture/controller.html"},{default:l(()=>[n("控制器")]),_:1}),n("、"),s(t,{to:"/learning/k8s-intermediate/workload/wl-deployment/#deployment-%E6%A6%82%E8%BF%B0"},{default:l(()=>[n("声明式配置")]),_:1})]),_,e("ul",null,[e("li",null,[s(t,{to:"/install/install-kubectl.html"},{default:l(()=>[n("kubectl")]),_:1}),n(" 命令行工具")]),e("li",null,[s(t,{to:"/install/install-k8s-dashboard.html"},{default:l(()=>[n("kuboard")]),_:1}),n(" 图形界面工具")])]),e("p",null,[n("kubectl、kuboard 最终都通过调用 "),e("a",g,[n("kubernetes API"),s(a)]),n(" 来实现对 Kubernetes 对象的操作。您也可以直接在自己的程序中调用 Kubernetes API，此时您可能要有用到 "),e("a",y,[n("Client Libraries"),s(a)])]),f,K,x,e("p",null,[n("Kubernetes通过对应的"),s(t,{to:"/cloud/k8s/k8s-intermediate/architecture/controller.html"},{default:l(()=>[n("控制器")]),_:1}),n("，不断地使实际状态趋向于您期望的目标状态。")]),D,e("p",null,[n("不同类型的 Kubernetes，其 "),j,n(" 对象的格式不同（含有不同的内嵌字段），通过 "),e("a",w,[n("API 手册"),s(a)]),n(" 可以查看 Kubernetes 对象的字段和描述。例如，假设您想了解 Pod 的 "),I,n(" 定义，可以在 "),e("a",P,[n("这里"),s(a)]),n("找到，Deployment 的 "),A,n(" 定义可以在 "),e("a",E,[n("这里"),s(a)]),n(" 找到。")])])}const C=r(p,[["render",L],["__file","k8s-object.html.vue"]]);export{C as default};