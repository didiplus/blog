import{ab as s,G as u,H as c,E as e,S as l,N as t,ac as o,ad as i,W as d}from"./framework-894cff3a.js";const h={},p=e("h1",{id:"_3-3-2、容器组-生命周期",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_3-3-2、容器组-生命周期","aria-hidden":"true"},"#"),l(" 3.3.2、容器组_生命周期")],-1),_={href:"https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",target:"_blank",rel:"noopener noreferrer"},f=i('<h2 id="pod-phase" tabindex="-1"><a class="header-anchor" href="#pod-phase" aria-hidden="true">#</a> Pod phase</h2><p>Pod phase 代表其所处生命周期的阶段。Pod phase 并不是用来代表其容器的状态，也不是一个严格的状态机。</p><p>phase 的可能取值有：</p><table><thead><tr><th>Phase</th><th>描述</th></tr></thead><tbody><tr><td>Pending</td><td>Kubernetes 已经创建并确认该 Pod。此时可能有两种情况：<li>Pod 还未完成调度（例如没有合适的节点）</li><li>正在从 docker registry 下载镜像</li></td></tr><tr><td>Running</td><td>该 Pod 已经被绑定到一个节点，并且该 Pod 所有的容器都已经成功创建。其中至少有一个容器正在运行，或者正在启动/重启</td></tr><tr><td>Succeeded</td><td>Pod 中的所有容器都已经成功终止，并且不会再被重启</td></tr><tr><td>Failed</td><td>Pod 中的所有容器都已经终止，至少一个容器终止于失败状态：容器的进程退出码不是 0，或者被系统 kill</td></tr><tr><td>Unknown</td><td>因为某些未知原因，不能确定 Pod 的状态，通常的原因是 master 与 Pod 所在节点之间的通信故障</td></tr></tbody></table><h2 id="pod-conditions" tabindex="-1"><a class="header-anchor" href="#pod-conditions" aria-hidden="true">#</a> Pod conditions</h2><p>每一个 Pod 都有一个数组描述其是否达到某些指定的条件。Pod condition 数组在 Kuboard 中的显示如下图所示：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/image-20190907122721669.d6ae74c4.png" alt="Kubernetes教程：容器组的生命周期" tabindex="0" loading="lazy"><figcaption>Kubernetes教程：容器组的生命周期</figcaption></figure><p>该数组的每一行可能有六个字段：</p>',8),b=e("thead",null,[e("tr",null,[e("th",null,"字段名"),e("th",null,"描述")])],-1),g=e("td",null,"type",-1),P=e("strong",null,"PodScheduled：",-1),m=e("strong",null,"Ready：",-1),y=e("strong",null,"Initialized：",-1),k=e("strong",null,"Unschedulable：",-1),x=e("strong",null,"ContainersReady：",-1),K=e("tr",null,[e("td",null,"status"),e("td",null,[l("能的取值有："),e("li",null,"True"),e("li",null,"False"),e("li",null,"Unknown")])],-1),T=e("td",null,"Condition 发生变化的原因，使用一个符合驼峰规则的英文单词描述",-1),S=e("td",null,"Condition 发生变化的原因的详细描述，human-readable",-1),v=e("tr",null,[e("td",null,"lastTransitionTime"),e("td",null,"Condition 发生变化的时间戳")],-1),w=e("td",null,"上一次针对 Pod 做健康检查/就绪检查的时间戳",-1),C=e("h2",{id:"容器的检查",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#容器的检查","aria-hidden":"true"},"#"),l(" 容器的检查")],-1),z=e("p",null,"Probe 是指 kubelet 周期性地检查容器的状况。有三种类型的 Probe：",-1),F=e("p",null,"Probe 有三种可能的结果：",-1),N=e("p",null,"Kubelet 可以在两种情况下对运行中的容器执行 Probe：",-1),A=i('<h3 id="何时使用-健康检查-就绪检查" tabindex="-1"><a class="header-anchor" href="#何时使用-健康检查-就绪检查" aria-hidden="true">#</a> 何时使用 健康检查/就绪检查？</h3><ul><li><p>如果容器中的进程在碰到问题时可以自己 crash，您并不需要执行健康检查；kubelet 可以自动的根据 Pod 的 restart policy（重启策略）执行对应的动作</p></li><li><p>如果您希望在容器的进程无响应后，将容器 kill 掉并重启，则指定一个健康检查 liveness probe，并同时指定 restart policy（重启策略）为 Always 或者 OnFailure</p></li><li><p>如果您想在探测 Pod 确实就绪之后才向其分发服务请求，请指定一个就绪检查 readiness probe。此时，就绪检查的内容可能和健康检查相同。就绪检查适合如下几类容器：</p><ul><li>初始化时需要加载大量的数据、配置文件</li><li>启动时需要执行迁移任务</li><li>其他</li></ul></li></ul><div class="hint-container info"><p class="hint-container-title">tip</p><p>如果您想在删除 Pod 前停止向其分发服务请求，您无需为此而指定就绪检查。在删除 Pod 时，kubelete 自动将 Pod 置于 unready 状态，并等待其中的容器停止。</p></div><h3 id="kuboard-中配置健康检查-就绪检查" tabindex="-1"><a class="header-anchor" href="#kuboard-中配置健康检查-就绪检查" aria-hidden="true">#</a> Kuboard 中配置健康检查/就绪检查</h3><p>Kuboard 可以在工作负载编辑器中配置健康检查/就绪检查，界面如下所示：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/image-20190907141952059.dd1f4a08.png" alt="Kubernetes教程：在Kuboard中配置容器的健康检查/就绪检查" tabindex="0" loading="lazy"><figcaption>Kubernetes教程：在Kuboard中配置容器的健康检查/就绪检查</figcaption></figure><h2 id="容器的状态" tabindex="-1"><a class="header-anchor" href="#容器的状态" aria-hidden="true">#</a> 容器的状态</h2><p>一旦 Pod 被调度到节点上，kubelet 便开始使用容器引擎（通常是 docker）创建容器。容器有三种可能的状态：Waiting / Running / Terminated：</p>',8),R=i('<p>在 Kuboard 的工作负载查看界面中可查看到容器的状态如下图所示：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/image-20190907143026772.5b8a226b.png" alt="Kubernetes教程：在Kuboard中查看容器的状态" tabindex="0" loading="lazy"><figcaption>Kubernetes教程：在Kuboard中查看容器的状态</figcaption></figure><h2 id="重启策略" tabindex="-1"><a class="header-anchor" href="#重启策略" aria-hidden="true">#</a> 重启策略</h2><p>定义 Pod 或工作负载时，可以指定 restartPolicy，可选的值有：</p><ul><li>Always （默认值）</li><li>OnFailure</li><li>Never</li></ul><p>restartPolicy 将作用于 Pod 中的所有容器。kubelete 将在五分钟内，按照递延的时间间隔（10s, 20s, 40s ......）尝试重启已退出的容器，并在十分钟后再次启动这个循环，直到容器成功启动，或者 Pod 被删除。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>控制器 Deployment/StatefulSet/DaemonSet 中，只支持 Always 这一个选项，不支持 OnFailure 和 Never 选项。</p></div><h2 id="容器组的存活期" tabindex="-1"><a class="header-anchor" href="#容器组的存活期" aria-hidden="true">#</a> 容器组的存活期</h2><p>通常，如果没有人或者控制器删除 Pod，Pod 不会自己消失。只有一种例外，那就是 Pod 处于 Scucceeded 或 Failed 的 phase，并超过了垃圾回收的时长（在 kubernetes master 中通过 terminated-pod-gc-threshold 参数指定），kubelet 自动将其删除。</p>',9);function B(E,H){const r=d("ExternalLinkIcon"),n=d("font"),a=d("Badge");return u(),c("div",null,[p,e("p",null,[l("参考文档： Kubernetes 文档 "),e("a",_,[l("Pod Lifecycle"),t(r)])]),f,e("table",null,[b,e("tbody",null,[e("tr",null,[g,e("td",null,[l("type 是最重要的字段，可能的取值有："),e("li",null,[t(n,{color:"#007af5"},{default:o(()=>[P]),_:1}),l(" Pod 已被调度到一个节点")]),e("li",null,[t(n,{color:"#007af5"},{default:o(()=>[m]),_:1}),l(" Pod 已经可以接受服务请求，应该被添加到所匹配 Service 的负载均衡的资源池")]),e("li",null,[t(n,{color:"#007af5"},{default:o(()=>[y]),_:1}),l("Pod 中所有初始化容器已成功执行")]),e("li",null,[t(n,{color:"#007af5"},{default:o(()=>[k]),_:1}),l("不能调度该 Pod（缺少资源或者其他限制）")]),e("li",null,[t(n,{color:"#007af5"},{default:o(()=>[x]),_:1}),l("Pod 中所有容器都已就绪")])])]),K,e("tr",null,[e("td",null,[l("reason "),t(a,{text:"Kuboard 暂不显示",type:"warn"})]),T]),e("tr",null,[e("td",null,[l("message "),t(a,{text:"Kuboard 暂不显示",type:"warn"})]),S]),v,e("tr",null,[e("td",null,[l("lastProbeTime "),t(a,{text:"Kuboard 暂不显示",type:"warn"})]),w])])]),C,z,e("ul",null,[e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("ExecAction：")]),_:1})]),l(" 在容器内执行一个指定的命令。如果该命令的退出状态码为 0，则成功")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("TCPSocketAction：")]),_:1})]),l(" 探测容器的指定 TCP 端口，如果该端口处于 open 状态，则成功")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("HTTPGetAction：")]),_:1})]),l(" 探测容器指定端口/路径上的 HTTP Get 请求，如果 HTTP 响应状态码在 200 到 400（不包含400）之间，则成功")])]),F,e("ul",null,[e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("Success：")]),_:1})]),l(" 容器通过检测")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("Failure：")]),_:1})]),l(" 容器未通过检测")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("Unknown：")]),_:1})]),l(" 检测执行失败，此时 kubelet 不做任何处理")])]),N,e("ul",null,[e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("就绪检查 readinessProbe：")]),_:1})]),l(" 确定容器是否已经就绪并接收服务请求。如果就绪检查失败，kubernetes 将该 Pod 的 IP 地址从所有匹配的 Service 的资源池中移除掉。")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("健康检查 livenessProbe：")]),_:1})]),l(" 确定容器是否正在运行。如果健康检查失败，kubelete 将结束该容器，并根据 restart policy（重启策略）确定是否重启该容器。")])]),A,e("ul",null,[e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("Waiting：")]),_:1})]),l(" 容器的初始状态。处于 Waiting 状态的容器，仍然有对应的操作在执行，例如：拉取镜像、应用 Secrets等。")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("Running：")]),_:1})]),l(" 容器处于正常运行的状态。容器进入 Running 状态之后，如果指定了 postStart hook，该钩子将被执行。")]),e("li",null,[e("strong",null,[t(n,{color:"#007af5"},{default:o(()=>[l("Terminated：")]),_:1})]),l(" 容器处于结束运行的状态。容器进入 Terminated 状态之前，如果指定了 preStop hook，该钩子将被执行。")])]),R])}const L=s(h,[["render",B],["__file","pod-lifecycle.html.vue"]]);export{L as default};