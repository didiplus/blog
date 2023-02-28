# 云原生第4课：Kubernetes 集群管理

:::info
本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第4课，由华为云Kubernetes容器平台技术专家Alan主讲，详细介绍Kubernetes集群和Kubernetes节点的生命周期管理。
:::

## 前言

[第3课Kubernetes快速入门](./03_kubernetes_basics.md)中介绍了Kubernetes的总体架构，其中集群系统组件的部署、节点生命周期管理是第4课关注的重点:

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113748.png)

上节课的这张架构图，比较直观地展示了组件如何部署在Master或者Node节点。

其中Master节点中主要承载了：kubernetes的REST API入口、KV数据库、k8s资源的控制器、负责绑定工作负载到Node的调度器；而Node节点则部署了K8S Agent：kubelet/kubeproxy、容器运行时（CRI）、相关容器存储和网络插件（CNI/CSI）

## Kubernetes集群生命周期管理介绍 

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113820.png)

从部署形态观察Kubernetes集群，可以总结大致有几种部署分类：

1. 自建模式：在拥抱最大的自由度的同时，也必须面临一些庞杂的事务，例如

   - 计算/存储/网络资源的规划与管理需要对接云基础设施
   - Kubernetes的service/ingress需要对接负载均衡服务, storageClass需要对接后端存储
   - Master节点以及组件的参数配置、资源扩容、版本升级以及运维。
   - Node节点需要基于业务变化进行动态的资源预置、组件部署。
2. 托管模式：
   - 相对于自建模式，
   - 把非业务相关的平台对接、Kubernetes控制平面等托管给容器平台，
   - 用户主要聚焦于业务部分，以及承载业务的节点资源的管理。
3. Serverless模式：
   - 更近一步，把资源的问题全交给容器平台。
   - 用户仅关注于自身业务
当前也存在自建与托管之间的其他部署形态，比如Kubernetes控制平面用户可以完全控制及修改，但其本质更接近于自建模式。
- 因为云容器平台由于用户的介入极难保证Kubernetes集群的生命周期及功能可控，最终用户承担较大的风险。
- 同时Kubernetes作为开源发布，框架本身就支持各种非侵入式插件，例如自定义调度器、自定义CRD及Controller等等，控制平面非托管的收益并没有想象中高。


## Kubernetes集群常见部署方式

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227114113.png)

:::info
[Kubernetes部署工具](https://kubernetes.io/zh/docs/setup/production-environment/tools/)

[Turnkey 云解决方案](https://kubernetes.io/zh/docs/setup/production-environment/turnkey-solutions/)
:::

部署形态主要基于分工与需求考虑，而部署方式就理想照进现实，需要脚踏实地的投入！一般Kubernetes开发者，会采用minikube方式部署一个本地的Kubernetes集群，基本能满足个人调试需求；
更进一步，如果对Kubernetes集群有一定的部署要求，则一般通过第三方工具托管集群的生命周期管理。Kubernetes官方就推荐了3种工具，与详细的使用引导，社区也有大量的部署分享。

但即使不以生产可用为标准，此类工具的使用仍然需要使用者：具有一定的容器基础知识，需要一定的动手能力和问题解决能力。例如多实例容灾、自签证书、对接软件仓库，在国内环境中部署，需要考虑外网拉包的问题。从个人看，对初学者并不是部署首选，会极大增大学习成本和门槛。从企业看，作为生产环则需要权衡长期使用的，所以，在Kubernetes的生产部署的文档中，明确指出了优先考虑Turkey云解决方案，即使用认证的云容器平台托管。这也是大部分企业使用的形态。

其实可以发现，平台托管虽然牺牲了灵活度，单在Kubernetes作为实际编排标准的前提下其实是一种非常理智与成熟的决策。由于平台屏蔽了跨云的差异，导致业务跨云迁移和容灾的成本极低，最终容器平台基于统一的Kubernetes聚焦于差异化的竞争力，用户则用脚投票。这对Kubernetes社区与生态的发展是极其有利的。

## Kubernetes集群-生产集群

回顾Kubernetes中对生产集群诉求的总结：
- 高可用的架构设计
- 弹性伸缩的能力
- 对安全与权限管理的更高要求。

基于以上评判标准，就可以发现：从生产集群角度评估，选型/部署只是第一步，真正复杂的是Kubernetes及相关插件的长期监控运维、持续的迭代演进、CVE漏洞的快速分析/修复测试/方案推送等等。

从华为云CCE的实践看，不止一次地碰到过相对棘手的：OS内核缺陷导致的可靠性问题，例如cgroup的kmem泄露，docker的bug导致的稳定性问题。可以发现，生产集群的维护是一个长期的、庞杂的、系统性的任务，如果每一个Kubernetes的使用者都陷入到上述的柴米油盐中，即使Kubernetes作为容器平台事实标准，其光辉也会因此稍显暗淡。

[Kubernetes生产环境](https://kubernetes.io/docs/setup/production-environment/)


## Kuberbetes节点生命周期介绍

**Kubernetes节点介绍-Node定义**

```yaml
{
   "kind": "Node",
   "apiVersion": "v1",
   "metadata": {
       "name": "192.168.0.10",
       "labels": {
           "name": "my-first-k8s-node"
       }
   },
   "spec": {
       "providerID": ""
   },
   "status": {
       "nodeInfo": {
           "machineID": ""
       },
       "capacity": {
           "cpu": "2",
           "memory": "3864020Ki"
       },
       "allocatable": {
           "cpu": "2",
           "memory": "3864020Ki"
       }
   }
}
```

上面是一个有所节选的Kubernetes定义的Node资源对象，从结构上可以发现，大致分成了
- 元数据，节点名与节点标签
- 节点属性
- 节点的状态信息

