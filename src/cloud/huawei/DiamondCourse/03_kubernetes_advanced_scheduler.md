# 云原生钻石课程 | 第3课：Kubernetes高级调度器原理详解

## Kubernetes的调度流程原理与算法详解

众所周知，Kubernetes 是为了管理大规模的集群，当集群的计算节点非常多时，如何为pod寻找合适的node，这也是Kubernetes调度器的工作职责所在。Kubernetes调度器的输入是再调度的pod,经过一系列算法执行之后，为pod选择了合适的node，其输出对于pod资源对象变化而言，yaml文件里spark node name里添加了一个node的值。



Kubernetes default scheduler 的特点：

- 基于队列的调度器
- 一次只调度一个Pod
- 调度时刻全局最优

**Kubernetes scheduler架构和调度流程**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228141748.png)

图中虚线部分为Kubernetes的主要组件 ，包含Informer、调度队列、调度器的cache以及调度主循环。

- Informer通过 list/watch机制获取资源信息变化，更新queue和 cache；
- NextPod() 从待调度队列获取队首的Pod；
- 从cache中获取Node列表；
- 针对Pod和NodeList执行Predicate算法，过滤掉不合适的节点；
- 针对Pod和NodeList执行Priority算法，给节点打分；
- 根据打分，计算出得分最高的节点；
- 当高优先级的Pod没有找到合适的节点时，调度器尝试为其抢占优先级低的Pod；
- 当调度器为Pod选择了一个合适的节点时，通过Bind将Pod和节点进行绑定；

### Kubernetes的调度策略与算法

主要有两类算法：Predicate和Priority。Predicate是对于所有的node进行筛选，滤除不合格的节点，Priority是对于Predicate筛选过的node进行打分，挑选最优的节点。通过Predicate策略筛选符合条件的Node，主要是node上不同的pod会存在资源冲突，Predicate主要的目的是为了避免资源冲突、节点超载、端口的冲突等。

### 典型Predicate算法

|算法名称       |功能       |
|:-------------|:----------|
|GeneralPredicates|包含3项基本检查:节点、端口和规则，例如节点上Pod资源对象数量上限以及CPU/MEM/GPU等资源是否符合要求|
|NoDiskConflict|检查Node是否满足Pod对硬盘的需求，如检查Pod使用卷和节点上其他Pod使用的卷是否冲突|
|CheckVolumeBinding|检查节点是否满足Pod资源对象的PVC挂载需求|
|NoVolumeZoneConflict|单集群跨AZ部署时，检查Pod资源对象挂载PVC是否属于跨区域挂载|
|CheckNodeMemorvPressure|检查Pod资源对象是否可以调度到MemoryPresure的节点上|
|CheckNodePIDPressure|检查Pod资源对象是否可以调度到PIDPressure的节点上|
|PodToleratesNodeTaints|检查Pod是否能够容忍node上所有的taints|
|CheckNodeMemoryPressure|当Pod QoS为besteffort时，检查node剩余内存量，排除内存压力过大的node|
|MatchInterPodAffinity|检查node是否满足pod的亲和性、反亲和性需求|



### 典型Priority算法


|算法名称       |功能       |
|:-------------|:----------|
|LeastRequestedPriority|按node计算资源(CPU/MEM)剩余量排序，挑选最空闲的node|
|MostRequestedPriority|按node计算资源(CPU/MEM)剩余量排序，挑选消耗最大的node|
|BalancedResourceAllocation|补充LeastRequestedPriority，在cpu和mem的剩余量取平衡|
|SelectorSpreadPriority|同一个Service/RC下的Pod尽可能的分散在集群中。Node上运行的同个Service/RC下的Pod数目越少，分数越高。|
|NodeAffinityPriority|按soft(preferred)NodeAffinity规则匹配情况排序，规则命中越多，分数越高|
|TaintTolerationPriority|按pod tolerations与node taints的匹配情况排序，越多的taints不匹配，分数越低|
|InterPodAffinityPriority|按soft(preferred) Pod Affinity/Anti-Affinity规则匹配情况排序，规则命中越多，分数越高/低|
|mageLocalityPriority|当Pod 基于节点上是否已经下拉了运行Pod资源对象的镜像计算分数|


## Kubernetes高级调度算法详解

**Kubernetes中的Label、Selector机制**

很多高级的调度特性都是依赖Selector机制去实现的，Kubernetes通过Label、Selector机制对于集群中的资源对象进行过滤、分类、筛选，类似在SQL使用select语句的效果。

案例：下图有4个pod，每个pod都进行了标记，比如APP=MyApp，代表pod属于哪个App；Phase代表pod属于哪个阶段，是prod还是test；Role代表pod是前端的pod还是后端的pod。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143239.png)

通过”APP=My APP”简单的selector，即可筛选出MyApp应用下的所有pod：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143330.png)

还可以通过”APP=My APP，Role=FE”筛选出MyApp应用里所有前端的pod：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143347.png)


### Node Affinity

Node Affinity特性是让Pod在一组指定的Node上运行，下图案例是通过简单的selector机制希望pod能运行在label-key为zone，Value是central的node上,node2与node3都匹配这样的规则，因此pod可以调度在node2与node3上。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143446.png)

### Pod Affinity

Pod Affinity是让Pod与指定Service的一组Pod在相同Node上运行，下图案例是希望serviceA 的pod和serviceB的pod能够调度在同一个区域，区域指定的是topologyKey“zone”，希望serviceA和serviceB的pod能够调度在同一个zone，在node1、node2、node3里，按照zone的value划分，node1属于一个组，node2与node3属于一个区域，因为node2的资源余量不足，serviceA 的pod最终调度在node3上，如此也符合serviceA 和serviceB在zone级别亲和的规则。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143528.png)

若将topologyKey从zone改成hostname,我们希望serviceA 的pod和serviceB的pod能够运行在同一个host上，因为node2没有剩余资源，serviceA没有办法按照这个规则筛选出合适的节点，则serviceA处于不可调度的状态。

### Taints-tolerations

Taints-tolerations 是来自Node的反亲和配置，在一些场景里是非常实用的。

案例: 有3个节点，node1有GPU资源，首先在集群提交一个普通的node，此时它是可以调度到node 1、node2、node3任意一个节点。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143630.png)

假设调度到node1,然后提交一个GPU需求的pod，因为node2与node2没有GPU资源，node1有GPU资源，但node1的memory已经耗尽，此时GPU的pod处于不可调度的状态。这个案例其实是不合理的，我们希望能够把有GPU的node1资源留给GPU的pod使用，但并没有达到预期效果。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143703.png)

在这个场景下，非常适合使用Taints-tolerations机制，在node1进行taint标记，node2与node3不满足资源的基本需求已经被过滤，node1可以满足pod的资源需求量，配置了软性的Taint-toleration，Priority算法对node1打了一个比较低的分，但其是一个软性的亲和，虽然分数比较低但是是唯一满足pod资源需求的，最终GPU的pod被调度到node1的节点上，达到预期效果。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228143736.png)

