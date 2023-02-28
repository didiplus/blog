# 云原生钻石课程 | 第2课：Kubernetes 技术架构深度剖析

## Kubernetes总体架构

Kubernetes是Google开源的容器集群管理系统，它构建在容器技术之上，为容器化的应用提供资源调度，部署运行，服务发现，扩容缩容等一整套功能，本质上是基于容器技术的Micro-PaaS平台，Kubernetes的灵感来源于Google内部的Borg系统。

主要目的是将容器宿主机组成集群，统一进行资源调度，自动管理容器生命周期，提供跨节点服务发现和负载均衡；更好的支持微服务理念，划分、细分服务之间的边界，比如lablel、pod等概念的引入。目前主要的发展方向是可插件化和可扩展性进行引进，框架越来越轻量化，插件可定制化的东西也越来越多等。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228131503.png)

Kubernetes主要包括管控面和数据面，管控面主要涉及用户接触很少的用于管理K8s资源的核心组件，数据面主要是实际运行用户的业务。涉及的核心组件有API server、controller、kubelet等。

## Kubernetes 核心组件

### 控制面上的组件

#### etcd
etcd 是兼具一致性和高可用性的键值数据库，可以作为保存 Kubernetes 所有集群数据的后台数据库。etcd支持watch，这样组件很容易得到系统状态的变化，从而快速响应和协调工作

#### kube-apiserver
主要提供Kubernetes API，提供对Pods，Services，ReplicationController等对象的CRUD处理REST操作，验证它们，在etcd中更新相应的对象API不仅仅是面向最终用户的，同时也是面向工具和扩展开发者的，是开放生态系统的基础

#### kube-scheduler

通过访问Kubernetes中/binding API, Scheduler负责Pods在各个节点上的分配，Scheduler是插件式的，Kubernetes将来可以支持用户自定义的scheduler

#### kube-controller-manager

控制器循环监听集群中资源状态，按照预期状态对资源进行管理。每个控制器就是将对应的资源牵引到期望的状态，Kubernetes将来可以把这些控制器拆分并提供可插拔的组件

#### cloud-controller-manager

云控制器管理器是指嵌入特定云的控制逻辑的 控制平面组件。云控制器管理器允许您链接聚合到云提供商的应用编程接口中， 并分离出相互作用的组件与您的集群交互的组件。

### 数据面节点上的组件

#### Kubelet

Kubelet管理pods和它们的容器、镜像、卷等


#### Kube-proxy

Kube-proxy是一个简单的网络代理和负载均衡器，它具体实现Service模型，每个Service都会在所有的Kube-Proxy节点上体现，根据Service的selector所覆盖的Pods, 对这些Pods做负载均衡来服务于Service的访问者


#### 容器运行时（Container Runtime）

容器运行环境是负责运行容器的软件。Kubernetes 支持多个容器运行环境: Docker、 containerd、CRI-O 以及任何实现 Kubernetes CRI (容器运行环境接口)。


### 插件（Addons）：

**DNS**：集群 DNS 是一个 DNS 服务器，和环境中的其他 DNS 服务器一起工作，它为 Kubernetes 服务提供 DNS 记录。Kubernetes 启动的容器自动将此 DNS 服务器包含在其 DNS 搜索列表中。

## controller控制器原理详解

### Kubernetes Controller Manager原理解析

Controller Manager 是集群内部的管理控制中心，负责统一管理与运行不同的 Controller ，实现对集群内的 Node、Pod 等所有资源的管理。比如当通过 Deployment 创建的某个 Pod 发生异常退出时，RS Controller 便会接受并处理该退出事件，并创建新的 Pod 来维持预期副本数。

**controller manager的作用**：

k8s内部几乎每种特定资源都有特定的 Controller 维护管理，而 Controller Manager 的职责便是把所有的 Controller 聚合起来：

- 提供基础设施降低 Controller 的实现复杂度
- 启动和维持 Controller 的正常运行，watch api-server，然后对不同的 Controller 分发事件通知。

K8s中有几十种 Controller，这里列举一些相对重要的Controller：

- **部署控制器（Deployment Controller）**：负责pod的滚动更新、回滚以及支持副本的水平扩容等。
- **节点控制器（Node Controller）**: 负责在节点出现故障时进行通知和响应。
- **副本控制器（Replication Controller）**: 负责为系统中的每个副本控制器对象维护正确数量的 Pod。
- **端点控制器（Endpoints Controller）**: 填充端点(Endpoints)对象(即加入 Service 与 Pod)。
- **服务帐户和令牌控制器（Service Account & Token Controllers）**: 为新的命名空间创建默认帐户和 API 访问令牌

### Controller 工作流程

Controller Manager 主要提供了一个分发事件的能力，而不同的 Controller 只需要注册对应的 Handler 来等待接收和处理事件。

在 Controller Manager 的帮助下，Controller 的逻辑可以做的非常纯粹，只需要实现相应的 EventHandler 即可。以Deployment controller为例：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228134354.png)

**List & Watch**：

- Controller manager与api-server的通信主要通过两种方式：List 和 Watch。
- List是短连接实现，用于获取该资源的所有object；
- Watch是长连接实现，用于监听在List中获取的资源的变换。
- api-server检测到资源产生变更时，会主动通知到Controller manager（利用分块传输编码）。


**client-go**：

- client-go实现统一管理每种 Controller 的List和Watch。
- 将收到的event事件放到缓存中，异步分发给每个 Controller 的注册的eventHandler。

### Controller中的eventHandler如何注册？

在`pkg/controller/deployment/deployment_controller.go` 的`NewDeploymentController`方法中，便包括了 Event Handler 的注册，对于 Deployment Controller 来说，只需要根据不同的事件实现不同的处理逻辑，便可以实现对相应资源的管理。

AddEventHandler被封装成ProcessListener并添加到数组中，并且调用了ProcessListener的run方法。

```go
// NewDeploymentController creates a new DeploymentController.
func NewDeploymentController(dInformer appsinformers.DeploymentInformer, rsInformer appsinformers.ReplicaSetInformer, podInformer coreinformers.PodInformer, client clientset.Interface) (*DeploymentController, error) {
... ...
   dInformer.Informer().AddEventHandler(cache.ResourceEventHandlerFuncs{
      AddFunc:    dc.addDeployment,
      UpdateFunc: dc.updateDeployment,
      // This will enter the sync loop and no-op, because the deployment has been deleted from the store.
      DeleteFunc: dc.deleteDeployment,
   })
   rsInformer.Informer().AddEventHandler(cache.ResourceEventHandlerFuncs{
      AddFunc:    dc.addReplicaSet,
      UpdateFunc: dc.updateReplicaSet,
      DeleteFunc: dc.deleteReplicaSet,
   })
   podInformer.Informer().AddEventHandler(cache.ResourceEventHandlerFuncs{
      DeleteFunc: dc.deletePod,
   })

   dc.syncHandler = dc.syncDeployment
   dc.enqueueDeployment = dc.enqueue

   dc.dLister = dInformer.Lister()
   dc.rsLister = rsInformer.Lister()
   dc.podLister = podInformer.Lister()
   dc.dListerSynced = dInformer.Informer().HasSynced
   dc.rsListerSynced = rsInformer.Informer().HasSynced
   dc.podListerSynced = podInformer.Informer().HasSynced
   return dc, nil
}
```

### client-go under the hood

kubernetes 在 github 上提供了一张 client-go 的架构图，从中可以看出，Controller 正是下半部分（CustomController）描述的内容，而client-go主要完成的是上半部分。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228134712.png)

**client-go组件**:

- **Reflector**：reflector用来watch特定的k8s API资源。具体的实现是通过ListAndWatch的方法，watch可以是k8s内建的资源或者是自定义的资源。当reflector通过watch API接收到有关新资源实例存在的通知时，它使用相应的列表API获取新创建的对象，并将其放入watchHandler函数内的Delta Fifo队列中。
- **Informer**：informer从Delta Fifo队列中弹出对象。执行此操作的功能是processLoop。base controller的作用是保存对象以供以后检索，并调用我们的控制器将对象传递给它。
- **Indexer**：索引器提供对象的索引功能。典型的索引用例是基于对象标签创建索引。Indexer可以根据多个索引函数维护索引。Indexer使用线程安全的数据存储来存储对象及其键。在Store中定义了一个名为MetaNamespaceKeyFunc的默认函数，该函数生成对象的键作为该对象的 / 组合。

**自定义controller组件**:

- **Informer reference**：指的是Informer实例的引用，定义如何使用自定义资源对象。自定义控制器代码需要创建对应的Informer。
- **Indexer reference**: 自定义控制器对Indexer实例的引用。自定义控制器需要创建对应的Indexer。client-go中提供NewIndexerInformer函数可以创建Informer 和 Indexer。
- **Resource Event Handlers**：资源事件回调函数，当它想要将对象传递给控制器时，它将被调用。编写这些函数的典型模式是获取调度对象的key，并将该key排入工作队列以进行进一步处理。
- **Workqueue**：任务队列。编写资源事件处理程序函数以提取传递的对象的key并将其添加到任务队列。
- **Process Item**：处理任务队列中对象的函数， 这些函数通常使用Indexer引用或Listing包装器来重试与该key对应的对象。

## list-watch机制原理详解

### Informer封装list-watch

K8s的informer模块封装list-watch API，用户只需要指定资源，编写事件处理函数，AddFunc,UpdateFunc和DeleteFunc等。

Informer是Client-go中的一个核心工具包。为了让Client-go更快地返回List/Get请求的结果、减少对Kubenetes API的直接调用，Informer被设计实现为一个依赖Kubernetes List/Watch API、可监听事件并触发回调函数的二级缓存工具包。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228135012.png)

### Informer设计实现

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228135102.png)

**Informer组件**：

- Controller 用于处理收到的事情，触发Processor中的回调函数
- Reflector：通过Kubernetes Watch API监听resource下的所有事件
- Lister：用来被调用List/Get方法
- Processor：记录并触发回调函数
- DeltaFIFO和LocalStore：DeltaFIFO和LocalStore是Informer的两级缓存。DeltaFIFO用来存储Watch API返回的各种事件，LocalStore是Lister的List/Get方法访问

### Kubernetes 核心机制list-watch

List-watch是K8S统一的异步消息处理机制，各组件间协同都采用该机制进行通信。List-watch机制保证了消息的实时性，可靠性，顺序性，性能等等，为声明式风格的API奠定了良好的基础，它是优雅的通信方式，是K8S 架构的精髓。对系统的性能、数据一致性起到关键性的作用。

list-watch操作主要完成以下几个事情：

- Watch核心数据存储是etcd，是典型的发布-订阅模式。但不直接访问etcd，通过apiserver发起请求，在组件启动时进行订阅。
- 可以带条件向apiserver发起的watch请求。例如，scheduler想要watch的是所有未被调度的Pod来进行调度操作；而kubelet只关心自己节点上的Pod列表。apiserver向etcd发起的watch是没有条件的，只能知道某个数据发生了变化或创建、删除，但不能过滤具体的值。也就是说对象数据的条件过滤必须在apiserver端而不是etcd端完成。
- list是watch失败，数据太过陈旧后的弥补手段，这方面详见 基于list-watch的Kubernetes异步事件处理框架详解-客户端部分。list本身是一个简单的列表操作。

Watch 体验，通过curl命令watch pods资源：

```shell
[root@xxx-xxx-0-148 xxx]# curl -i http://127.0.0.1:8080/api/v1/watch/services?watch=yes
HTTP/1.1 200 OK
Cache-Control: no-cache, private
Content-Type: application/json
Date: Wed, 16 Jun 2021 09:38:27 GMT
Transfer-Encoding: chunked

{"type":"ADDED","object":{"kind":"Service","apiVersion":"v1","metadata":{"name":"coredns","namespace":"kube-system","selfLink":"/api/v1/namespaces/kube-system/services/coredns","uid":"ea75ccb1-fab5-44be-9382-ac36d18e39d9","resourceVersion":"763","creationTimestamp":"2021-06-15T08:29:36Z","labels":{"app":"coredns","k8s-app":"coredns","kubernetes.io/cluster-service":"true","kubernetes.io/name":"CoreDNS","release":"cceaddon-coredns"},"annotations":{"prometheus.io/port":"9153","prometheus.io/scrape":"true"},"managedFields":[{"manager":"Go-http-client","operation":"Update","apiVersion":"v1","time":"2021-06-15T08:29:36Z","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:prometheus.io/port":{},"f:prometheus.io/scrape":{}},"f:labels":{".":{},"f:app":{},"f:k8s-app":{},"f:kubernetes.io/cluster-service":{},"f:kubernetes.io/name":{},"f:release":{}}},"f:spec":{"f:clusterIP":{},"f:ports":{".":{},"k:{\"port\":53,\"protocol\":\"TCP\"}":{".":{},"f:name":{},"f:port":{},"f:protocol":{},"f:targetPort":{}},"k:{\"port\":53,\"protocol\":\"UDP\"}":{".":{},"f:name":{},"f:port":{},"f:protocol":{},"f:targetPort":{}},"k:{\"port\":8080,\"protocol\":\"TCP\"}":{".":{},"f:name":{},"f:port":{},"f:protocol":{},"f:targetPort":{}}},"f:selector":{".":{},"f:app":{},"f:k8s-app":{}},"f:sessionAffinity":{},"f:type":{}}}}]},"spec":{"ports":[{"name":"dns","protocol":"UDP","port":53,"targetPort":5353},{"name":"dns-tcp","protocol":"TCP","port":53,"targetPort":5353},{"name":"health","protocol":"TCP","port":8080,"targetPort":8080}],"selector":{"app":"coredns","k8s-app":"coredns"},"clusterIP":"10.247.3.10","type":"ClusterIP","sessionAffinity":"None"},"status":{"loadBalancer":{}}}}
{"type":"ADDED","object":{"kind":"Service","apiVersion":"v1","metadata":{"name":"kubernetes","namespace":"default","selfLink":"/api/v1/namespaces/default/services/kubernetes","uid":"99e80360-402a-4368-8710-fa67a2c4a778","resourceVersion":"157","creationTimestamp":"2021-06-15T08:27:36Z","labels":{"component":"apiserver","provider":"kubernetes"},"managedFields":[{"manager":"kube-apiserver","operation":"Update","apiVersion":"v1","time":"2021-06-15T08:27:36Z","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:labels":{".":{},"f:component":{},"f:provider":{}}},"f:spec":{"f:clusterIP":{},"f:ports":{".":{},"k:{\"port\":443,\"protocol\":\"TCP\"}":{".":{},"f:name":{},"f:port":{},"f:protocol":{},"f:targetPort":{}}},"f:sessionAffinity":{},"f:type":{}}}}]},"spec":{"ports":[{"name":"https","protocol":"TCP","port":443,"targetPort":5444}],"clusterIP":"10.247.0.1","type":"ClusterIP","sessionAffinity":"None"},"status":{"loadBalancer":{}}}}
```

### Watch 是如何实现的？

Watch的核心是长链接，通过HTTP 长链接接收apiserver发来的资源变更事件呢，秘诀是Chunked transfer encoding(分块传输编码)，它首次出现在HTTP/1.1。

HTTP 分块传输编码允许服务器为动态生成的内容维持 HTTP 持久链接。通常，持久链接需要服务器在开始发送消息体前发送Content-Length消息头字段，但是对于动态生成的内容来说，在内容创建完之前是不可知的。使用分块传输编码，数据分解成一系列数据块，并以一个或多个块发送，这样服务器可以发送数据而不需要预先知道发送内容的总大小。

当客户端调用watch API时，apiserver 在response的HTTP Header中设置Transfer-Encoding的值为chunked，表示采用分块传输编码，客户端收到该信息后，便和服务端该链接，并等待下一个数据块，即资源的事件信息，直到客户主动断链。
### List-Watch 的设计理念

一个异步消息的系统时，对消息机制有至少如下四点要求 ：

- **消息可靠性**：首先消息必须是可靠的，list和watch一起保证了消息的可靠性，避免因消息丢失而造成状态不一致场景。具体而言，list API可以查询当前的资源及其对应的状态(即期望的状态)，客户端通过拿期望的状态和实际的状态进行对比，纠正状态不一致的资源。Watch API和apiserver保持一个长链接，接收资源的状态变更事件并做相应处理。如果仅调用watch API，若某个时间点连接中断，就有可能导致消息丢失，所以需要通过list API解决消息丢失的问题。从另一个角度出发，我们可以认为list API获取全量数据，watch API获取增量数据。虽然仅仅通过轮询list API，也能达到同步资源状态的效果，但是存在开销大，实时性不足的问题。

- **消息实时性**：消息必须是实时的，list-watch机制下，每当apiserver的资源产生状态变更事件，都会将事件及时的推送给客户端，从而保证了消息的实时性。

- **消息顺序性**：消息的顺序性也是非常重要的，在并发的场景下，客户端在短时间内可能会收到同一个资源的多个事件，对于关注最终一致性的K8S来说，它需要知道哪个是最近发生的事件，并保证资源的最终状态如同最近事件所表述的状态一样。K8S在每个资源的事件中都带一个resourceVersion的标签，这个标签是递增的数字，所以当客户端并发处理同一个资源的事件时，它就可以对比resourceVersion来保证最终的状态和最新的事件所期望的状态保持一致。

- **高性能**：List-watch还具有高性能的特点，虽然仅通过周期性调用list API也能达到资源最终一致性的效果，但是周期性频繁的轮询大大的增大了开销，增加apiserver的压力。而watch作为异步消息通知机制，复用一条长链接，保证实时性的同时也保证了性能。

### list-watch 实现机制

1. List-watch的API处理, kube-apiserver API注册代码`pkg/apiserver/api_installer.go`
   - rest.Storage对象会被转换为watcher和lister对象
   - 提供list和watch服务的入口是同一个，在API接口中通过 GET /xxx/services?watch=ture来区分
   - API处理函数是统一通过ListResource完成

```go

func (a *APIInstaller) registerResourceHandlers(path string, storage rest.Storage, ws *restful.WebService) (*metav1.APIResource, error) {
... ...
// what verbs are supported by the storage, used to know what verbs we support per path
creater, isCreater := storage.(rest.Creater)
namedCreater, isNamedCreater := storage.(rest.NamedCreater)
lister, isLister := storage.(rest.Lister)
... ...
watcher, isWatcher := storage.(rest.Watcher)
... ...
case "LIST": // List all resources of a kind.
   doc := "list objects of kind " + kind
   if isSubresource {
      doc = "list " + subresource + " of objects of kind " + kind
   }
   handler := metrics.InstrumentRouteFunc(action.Verb, group, version, resource, subresource, requestScope, metrics.APIServerComponent, deprecated, removedRelease, restfulListResource(lister, watcher, reqScope, false, a.minRequestTimeout))
   if enableWarningHeaders {
      handler = utilwarning.AddWarningsHandler(handler, warnings)
   }
... ...
```
2. ListResource()的具体实现

每次有一个watch的url请求过来，都会调用rw.Watch()创建一个watcher，然后使用serveWatch()来处理这个请求。watcher的生命周期是每个http请求的，这一点非常重要

```go
func ListResource(r rest.Lister, rw rest.Watcher, scope *RequestScope, forceWatch bool, minRequestTimeout time.Duration) http.HandlerFunc {
... ...
      if opts.Watch || forceWatch {
... ...
         defer cancel()
         watcher, err := rw.Watch(ctx, &opts)
         if err != nil {
            scope.err(err, w, req)
            return
         }
         requestInfo, _ := request.RequestInfoFrom(ctx)
         metrics.RecordLongRunning(req, requestInfo, metrics.APIServerComponent, func() {
            serveWatch(watcher, scope, outputMediaType, req, w, timeout)
         })
         return
      }
... ...
}
```
3. 响应http请求的过程serveWatch()的代码在/pkg/apiserver/watch.go里面

watcher的结果channel中读取一个event对象，然后持续不断的编码写入到http response的流当中。

```go

// serveWatch will serve a watch response.
// TODO: the functionality in this method and in WatchServer.Serve is not cleanly decoupled.
func serveWatch(watcher watch.Interface, scope *RequestScope, mediaTypeOptions …) {
... ...
   server.ServeHTTP(w, req)
}
```

```go

// ServeHTTP serves a series of encoded events via HTTP with Transfer-Encoding: chunked
// or over a websocket connection.
func (s *WatchServer) ServeHTTP(w http.ResponseWriter, req *http.Request) {
... ...
   for {
      select {

      case event, ok := <-ch:
         if !ok {
            // End of results.
            return
         }
         metrics.WatchEvents.WithLabelValues(kind.Group, kind.Version, kind.Kind).Inc()

         obj := s.Fixup(event.Object)
         if err := s.EmbeddedEncoder.Encode(obj, buf); err != nil {
            // unexpected error
            utilruntime.HandleError(fmt.Errorf("unable to encode watch object %T: %v", obj, err))
            return
         }
... ...         
         buf.Reset()
      }
   }
}
```



### list-watch 实现机制总结

list-watch客户端从调用到响应的整个流程：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228135441.png)