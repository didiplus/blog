# 3.3.9、控制器 - ReplicaSet

Kubernetes 中，ReplicaSet 用来维护一个数量稳定的 Pod 副本集合，可以保证某种定义一样的 Pod 始终有指定数量的副本数在运行。




## ReplicaSet的工作方式

ReplicaSet的定义中，包含：
* `selector`： 用于指定哪些 Pod 属于该 ReplicaSet 的管辖范围
* `replicas`： 副本数，用于指定该 ReplicaSet 应该维持多少个 Pod 副本
* `template`： Pod模板，在 ReplicaSet 使用 Pod 模板的定义创建新的 Pod

ReplicaSet 控制器将通过创建或删除 Pod，以使得当前 Pod 数量达到 `replicas` 指定的期望值。ReplicaSet 创建的 Pod 中，都有一个字段 [metadata.ownerReferences](/learning/k8s-intermediate/workload/gc.html#所有者和从属对象) 用于标识该 Pod 从属于哪一个 ReplicaSet。

ReplicaSet 通过 `selector` 字段的定义，识别哪些 Pod 应该由其管理。如果 Pod 没有 ownerReference 字段，或者 ownerReference 字段指向的对象不是一个控制器，且该 Pod 匹配了 ReplicaSet 的 `selector`，则该 Pod 的 ownerReference 将被修改为 该 ReplicaSet 的引用。

## 何时使用 ReplicaSet

ReplicaSet 用来维护一个数量稳定的 Pod 副本集合。Deployment 是一个更高级别的概念，可以管理 ReplicaSet，并提供声明式的更新，以及其他的许多有用的特性。因此，推荐用户总是使用 Deployment，而不是直接使用 ReplicaSet，除非您需要一些自定义的更新应用程序的方式，或者您完全不更新应用。

这也意味着，您也许永远不会直接操作 ReplicaSet 对象。但是，对其有一定的理解是有必要的，这样您才能更好的理解和使用 Deployment。


## Example
```yaml
# @include(../../../../../.vuepress/public/statics/learning/replicaset/frontend.yaml)
```


执行命令以创建该 YAML 对应的 ReplicaSet
``` sh
kubectl apply -f https://kuboard.cn/statics/learning/replicaset/frontend.yaml
```

执行命令，查看刚才创建的ReplicaSet：
``` sh
kubectl get rs
```

输出结果如下所示：
```
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

执行命令，查看刚才创建的RelicaSet的详情：
``` sh
kubectl describe rs/frontend
```

输出结果如下所示：

```
Name:		frontend
Namespace:	default
Selector:	tier=frontend,tier in (frontend)
Labels:		app=guestbook
		tier=frontend
Annotations:	<none>
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
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----                -------------    --------    ------            -------
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-qhloh
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-dnjpy
  1m           1m          1        {replicaset-controller }
```

执行命令，查看有哪些 Pod 被创建：
```sh
kubectl get pods
```

输出结果如下所示：

```
NAME             READY     STATUS    RESTARTS   AGE
frontend-9si5l   1/1       Running   0          1m
frontend-dnjpy   1/1       Running   0          1m
frontend-qhloh   1/1       Running   0          1m
```

执行命令，查看 Pod 的 ownerReference：
```sh
# 替换成你自己的 Pod 名称
kubectl get pods frontend-9si5l -o yaml
```

输出结果如下所示，其中 `metadata.ownerReferences` 字段指向了 ReplicaSet `frontend`：

``` yaml {10,14,15}
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: 2019-11-08T17:20:41Z
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-9si5l
  namespace: default
  ownerReferences:
  - apiVersion: extensions/v1beta1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: 892a2330-257c-11e9-aecd-025000000001
...
```

