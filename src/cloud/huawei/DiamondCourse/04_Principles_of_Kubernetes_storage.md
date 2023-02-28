# 云原生钻石课程 | 第4课：Kubernetes存储架构原理深度剖析(上)

从上节课(Kubernetes高级调度器原理详解)中我们了解了高级调度器的原理。K8s为适应不同需求的调度能力，提供了一套调度框架。在生产环境中，存储也是种类繁杂多样的：比如存储产品时不同存储提供商的产品存在差异性；存储性能时不同磁盘的性能存在差异性；存储地域时不同存储池所服务的地域不同等，面对复杂存储环境，k8s是如何应对的呢？这就是我们将要讨论的云原生存储体系。

## Kubernetes容器存储发展历程


K8s初期为存算分离所做的解耦设计Volume，采用强耦合、灵活性差的in-tree模式，虽然已经让用户专注于业务功能设计。但这类存储卷的生命周期是跟随pod的，只能用作存储临时数据，无法做为最终数据使用。

随着k8s的不断成熟，为支持更多的应用场景，提供了一种脱离pod生命周期的、用户可管理的存储抽象设计低耦合、灵活性更强的`PersistentVolume/PersistentVolumeClaim`。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228152318.png)

## Kubernetes容器存储能力简介

主要包含三种类型：

### 配置数据

- **ConfigMap**：用于存储部署在Kubernetes的应用使用的配置数据，类似建议的配置中心。
- **Secret**：用于存储部署在Kubernetes的应用需要的敏感信息，比如密码、token、证书等，提供了一种安全和可扩展的机制。可作为具备加密的ConfigMap使用。
- **Projected**：用于汇聚多个不同卷资源，并挂载到同一个目录，当前支持的卷有：secret、configMap、downwardAPI和serviceAccountToken


### 临时存储

- **EmptyDir**：emptyDir生命周期和POD保持一致，pod删除后，emptyDir中的数据也会被清除。
- **HostPath**：HostPath是将节点本地文件系统的路径映射到pod容器中，供程序使用。pod删除后，HostPath中的数据K8S不会被清除，依赖用户pod配置。
- **In-tree的网络存储**：网络存储跟随pod的生命周期，通过in-tree的存储插件对接不同类型存储；其中FlexVolume虽然允许不同厂商去开发他们自己的驱动来挂载卷到集群节点上供pod使用，但生命周期与pod同步。


### 持久存储声明

- **PersistentVolumeClaim（网络存储）**：存储具有独立的生命周期，可以通过存储提供商提供的out-tree插件，对接其存储。当前支持的存储插件类型有FlexVolume和CSI。

## Kubernetes持久化存储体系

### Kubernetes持久化存储体系介绍

**K8s持久化存储体系包括**：

- **PersistentVolume**：简称pv，持久化存储，是k8s为云原生应用提供一种拥有独立生命周期的、用户可管理的存储抽象设计
- **PersistentVolumeClaim**：简称pvc，持久化存储声明，是K8S为解耦云原生应用和数据存储而设计的，通过PVC可以让资源管控更细更灵活、团队职责分离、应用模板更通用，进一步解除了用户被云平台锁定的顾虑。
- **StorageClass**：简称sc，存储类，是K8S平台为存储提供商提供存储接入的一种声明，通过sc和相应的存储插件(csi)为容器应用提供动态分配存储卷的能力；
- **Driver Plugin**：存储驱驱动插件，由存储提供商提供，能够对接网络存储，并管理持久存储卷的生命周期。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228152645.png)

### 持久化存储优势分析

与临时存储相比，PV具有：

- 每个存储卷可以拥有独立的生命周期，不再跟随pod创建和销毁；
- 使能计算+数据的迁移，也即：存储卷中的数据可以随pod在集群中迁移；
- 多个不同的pod可以共享同一个存储卷（存储卷支持共享）；

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228152724.png)

引入PVC/SC后，带来更大的收益：

- 资源管控更加灵活，可适应资源管控严格、宽松的不同场景；
- 团队职责更加明确，开发人员只需考虑存储需求(IO、容量、访问模式等)，不需要关注存储类型，甚至品牌；
- 灵活的扩展一些增强功能，比如：扩容、快照能力；
- 应用模板更加通用，可通过参数配置，适应不同类型的k8s平台；
- 进一步消除用户被存储提供商、云平台锁定的顾虑。


## PV/PVC的工作原理剖析

**pv/pvc的分配方式如图示**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228152850.png)

静态卷：Volum先有资源，然后通过pv绑定与关联资源，再通过pvc去绑定pv，此时应用可通过pvc使用volum。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228152925.png)

动态卷：pvc先声明，再指定SC,通过pvc与SC最终创建出volum，此时pvc与pv绑定，从而为用户和应用提供存储服务。

**静态卷：pv的状态转换**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228153113.png)

**静态卷：pvc的状态转换**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228153200.png)


**pv/pvc绑定原理分析**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228153225.png)

pvc刷选pv的流程（findBestMatchForClaim）：

- 通过size刷选恰当的pv；
- 通过volumeMode刷选一致的pv；
- 通过Label刷选合适的pv；
- 通过sc刷选符合的pv；
- 通过AccessMode刷选符合条件的pv；
- 返回并绑定符合pvc条件，且size最小的pv。


![pvc绑定pv流程解读](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228153419.png)

**Kubernetes中pv/pvc相关的代码**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228153504.png)


**静态卷：pv/pvc使用场景示例**

pv/pvc适合在资源管理比较严格的场景：

- 开发人员向集群管理员申请存储需求；
- 存储管理员按需求分配存储；
- 集群管理员按照分配的存储创建pv；
- 开发人员创建pvc，pvc关联合适的pv；
- 开发人员创建pod，并且pod使用pvc。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228153547.png)

