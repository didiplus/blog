import{ab as d,G as c,H as r,E as e,S as n,N as s,ac as l,ad as u,W as t}from"./framework-b31a425c.js";const b={},m=e("h1",{id:"_2-2、查看pods-nodes",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_2-2、查看pods-nodes","aria-hidden":"true"},"#"),n(" 2.2、查看Pods/Nodes")],-1),p={href:"https://kubernetes.io/docs/tutorials/kubernetes-basics/explore/explore-intro/",target:"_blank",rel:"noopener noreferrer"},h=e("h2",{id:"目标",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#目标","aria-hidden":"true"},"#"),n(" 目标")],-1),k=e("ul",null,[e("li",null,"了解Kubernetes Pods（容器组）"),e("li",null,"了解Kubernetes Nodes（节点）"),e("li",null,"排查故障")],-1),g=e("h2",{id:"kubernetes-pods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#kubernetes-pods","aria-hidden":"true"},"#"),n(" Kubernetes Pods")],-1),_=e("strong",null,"Pod（容器组）",-1),v=u('<h2 id="pods概述" tabindex="-1"><a class="header-anchor" href="#pods概述" aria-hidden="true">#</a> Pods概述</h2><figure><img src="https://kuboard.cn/assets/img/module_03_pods.ccc5ba54.svg" alt="Kubernetes教程：Pod概念" tabindex="0" loading="lazy"><figcaption>Kubernetes教程：Pod概念</figcaption></figure><p><strong>Pod 容器组</strong> 是一个k8s中一个抽象的概念，用于存放一组 container（可包含一个或多个 container 容器，即图上正方体)，以及这些 container （容器）的一些共享资源。这些资源包括：</p><ul><li>共享存储，称为卷(Volumes)，即图上紫色圆柱</li><li>网络，每个 Pod（容器组）在集群中有个唯一的 IP，pod（容器组）中的 container（容器）共享该IP地址</li><li>container（容器）的基本信息，例如容器的镜像版本，对外暴露的端口等</li></ul><blockquote><p>例如，Pod可能既包含带有Node.js应用程序的 container 容器，也包含另一个非 Node.js 的 container 容器，用于提供 Node.js webserver 要发布的数据。Pod中的容器共享 IP 地址和端口空间（同一 Pod 中的不同 container 端口不能相互冲突），始终位于同一位置并共同调度，并在同一节点上的共享上下文中运行。（同一个Pod内的容器可以使用 localhost + 端口号互相访问）。</p></blockquote><p>Pod（容器组）是 k8s 集群上的<strong>最基本的单元</strong>。当我们在 k8s 上创建 Deployment 时，会在集群上创建包含容器的 Pod (而不是直接创建容器)。每个Pod都与运行它的 worker 节点（Node）绑定，并保持在那里直到终止或被删除。如果节点（Node）发生故障，则会在群集中的其他可用节点（Node）上运行相同的 Pod（从同样的镜像创建 Container，使用同样的配置，IP 地址不同，Pod 名字不同）。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>重要：</p><ul><li>Pod 是一组容器（可包含一个或多个应用程序容器），以及共享存储（卷 Volumes）、IP 地址和有关如何运行容器的信息。</li><li>如果多个容器紧密耦合并且需要共享磁盘等资源，则他们应该被部署在同一个Pod（容器组）中。</li></ul></div><h2 id="node-节点" tabindex="-1"><a class="header-anchor" href="#node-节点" aria-hidden="true">#</a> Node（节点）</h2><p>下图显示一个 Node（节点）上含有4个 Pod（容器组）</p><figure><img src="https://kuboard.cn/assets/img/module_03_nodes.38f0ef71.svg" alt="Kubernetes教程：Node概念" tabindex="0" loading="lazy"><figcaption>Kubernetes教程：Node概念</figcaption></figure><p>Pod（容器组）总是在 <strong>Node（节点）</strong> 上运行。Node（节点）是 kubernetes 集群中的计算机，可以是虚拟机或物理机。每个 Node（节点）都由 master 管理。一个 Node（节点）可以有多个Pod（容器组），kubernetes master 会根据每个 Node（节点）上可用资源的情况，自动调度 Pod（容器组）到最佳的 Node（节点）上。</p><p>每个 Kubernetes Node（节点）至少运行：</p><ul><li>Kubelet，负责 master 节点和 worker 节点之间通信的进程；管理 Pod（容器组）和 Pod（容器组）内运行的 Container（容器）。</li><li>容器运行环境（如Docker）负责下载镜像、创建和运行容器等。</li></ul><h2 id="实战-故障排除" tabindex="-1"><a class="header-anchor" href="#实战-故障排除" aria-hidden="true">#</a> 实战：故障排除</h2>',14),x=e("ul",null,[e("li",null,[e("p",null,[e("strong",null,"kubectl get"),n(" - 显示资源列表")]),e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token comment"},"# kubectl get 资源类型"),n(`

`),e("span",{class:"token comment"},"#获取类型为Deployment的资源列表"),n(`
kubectl get deployments

`),e("span",{class:"token comment"},"#获取类型为Pod的资源列表"),n(`
kubectl get pods

`),e("span",{class:"token comment"},"#获取类型为Node的资源列表"),n(`
kubectl get nodes
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])])]),e("li",null,[e("p",null,[e("strong",null,"kubectl describe"),n(" - 显示有关资源的详细信息")]),e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token comment"},"# kubectl describe 资源类型 资源名称"),n(`

`),e("span",{class:"token comment"},"#查看名称为nginx-XXXXXX的Pod的信息"),n(`
kubectl describe pod nginx-XXXXXX	

`),e("span",{class:"token comment"},"#查看名称为nginx的Deployment的信息"),n(`
kubectl describe deployment nginx	
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])])]),e("li",null,[e("p",null,[e("strong",null,"kubectl logs"),n(" - 查看pod中的容器的打印日志（和命令docker logs 类似）")]),e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token comment"},"# kubectl logs Pod名称"),n(`

`),e("span",{class:"token comment"},"#查看名称为nginx-pod-XXXXXXX的Pod内的容器打印的日志"),n(`
`),e("span",{class:"token comment"},"#本案例中的 nginx-pod 没有输出日志，所以您看到的结果是空的"),n(`
kubectl logs `),e("span",{class:"token parameter variable"},"-f"),n(` nginx-pod-XXXXXXX
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])])]),e("li",null,[e("p",null,[e("strong",null,"kubectl exec"),n(" - 在pod中的容器环境内执行命令(和命令docker exec 类似)")]),e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token comment"},"# kubectl exec Pod名称 操作命令"),n(`

`),e("span",{class:"token comment"},"# 在名称为nginx-pod-xxxxxx的Pod中运行bash"),n(`
kubectl `),e("span",{class:"token builtin class-name"},"exec"),n(),e("span",{class:"token parameter variable"},"-it"),n(` nginx-pod-xxxxxx /bin/bash
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])])])],-1),P=e("p",null,"请尝试在您的集群中执行一下上述的几个命令，了解如何通过 kubectl 操作 kubernetes 集群中的 Node、Pod、Container。",-1),f={class:"hint-container tip"},N=e("p",{class:"hint-container-title"},"名称空间",-1),X=e("code",null,"-A",-1),y=e("code",null,"--all-namespaces",-1),E=e("code",null,"-n",-1),B=e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token comment"},"# 查看所有名称空间的 Deployment"),n(`
kubectl get deployments `),e("span",{class:"token parameter variable"},"-A"),n(`
kubectl get deployments --all-namespaces
`),e("span",{class:"token comment"},"# 查看 kube-system 名称空间的 Deployment"),n(`
kubectl get deployments `),e("span",{class:"token parameter variable"},"-n"),n(` kube-system
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])],-1),D=e("div",{class:"hint-container tip"},[e("p",{class:"hint-container-title"},"提示"),e("p",null,"Worker节点是k8s中的工作计算机，可能是VM或物理计算机，具体取决于群集。多个Pod可以在一个节点上运行。")],-1),K=e("p",null,"~~现在我们已经学会在k8s上部署程序，并且也知道了部署在k8s中涉及的资源和流程，",-1),A=e("p",null,"~~等等，我们的程序还不知道如何访问呢？其实也是一个yaml文件就能实现",-1);function C(V,I){const o=t("ExternalLinkIcon"),a=t("RouterLink"),i=t("Tabs");return c(),r("div",null,[m,e("p",null,[n("本文翻译自 Kubernetes "),e("a",p,[n("Viewing Pods and Nodes"),s(o)]),n(" ，并有所改写")]),h,k,g,e("p",null,[n("在 "),s(a,{to:"/cloud/k8s/k8s-basics/deploy-app.html"},{default:l(()=>[n("部署第一个应用程序")]),_:1}),n(" 中创建 Deployment 后，k8s创建了一个 "),_,n(" 来放置应用程序实例（container 容器）。")]),v,s(i,{id:"113",data:[{title:"使用kubectl"}]},{tab0:l(({title:j,value:w,isActive:L})=>[e("p",null,[n("在"),s(a,{to:"/cloud/k8s/k8s-basics/deploy-app.html"},{default:l(()=>[n("部署第一个应用程序")]),_:1}),n(" 中，我们使用了 kubectl 命令行界面部署了 nginx 并且查看了 Deployment 和 Pod。kubectl 还有如下四个常用命令，在我们排查问题时可以提供帮助：")]),x,P,e("div",f,[N,e("p",null,[n("在命令后增加 "),X,n(" 或 "),y,n(" 可查看所有 "),s(a,{to:"/learning/k8s-intermediate/obj/namespaces.html"},{default:l(()=>[n("名称空间中")]),_:1}),n(" 的对象，使用参数 "),E,n(" 可查看指定名称空间的对象，例如")]),B,e("blockquote",null,[e("p",null,[s(a,{to:"/learning/k8s-intermediate/obj/namespaces.html#%E5%B9%B6%E9%9D%9E%E6%89%80%E6%9C%89%E5%AF%B9%E8%B1%A1%E9%83%BD%E5%9C%A8%E5%90%8D%E7%A7%B0%E7%A9%BA%E9%97%B4%E9%87%8C"},{default:l(()=>[n("并非所有对象都在名称空间里")]),_:1})])])])]),_:1}),D,K,A,e("p",null,[n("~~let‘s go-> "),s(a,{to:"/cloud/k8s/k8s-basics/expose.html"},{default:l(()=>[n("使用 Service（服务）公布您的应用程序")]),_:1})])])}const S=d(b,[["render",C],["__file","explore.html.vue"]]);export{S as default};
