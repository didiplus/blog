# 云原生第5课：Kubernetes工作负载管理

:::info
 本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第5课，由华为云容器技术专家Jessia Ding主讲，帮你了解工作负载的概念以及Kubernetes提供的内置工作负载的信息；Deployment/ DaemonSet/ Job/ CronJob概念以及使用场景。
:::

## Kubernetes 工作负载（Workload）介绍

工作负载是在 Kubernetes 上运行的应用程序。无论你的负载是单一组件还是由多个一同工作的组件构成，在 Kubernetes 中你 可以在一组 Pods 中运行它。 在 Kubernetes 中，Pod 代表的是集群上处于运行状态的一组容器。Pod 有确定的生命周期，如果该Pod所在的节点出现了致命的错误时，所有该节点的Pod都会失败。Kubernetes提供一些负载资源来替你管理一组Pod，让用户没有必要管理每个Pod。

Kubernetes提供以下几类工作负载：

1. **无状态工作负载**: 管理的Pod集合是相互等价的，需要的时候可以被替换。
   - Deployment
   - ReplicaSet
   - ReplicationController
Deployment/RS/RC的区别，RS/RC能保证指定数量的pod在集群中运行，Deployment提供的升级，回滚，暂停恢复等功能。
2. **有状态工作负载**: 为每个 Pod 维护了一个唯一的ID, 能够保证 Pod 的顺序性和唯一性，每个Pod是不可替代的。可使用持久存储来保存服务产生的状态。
   - StatefulSet：StatefulSet 为它们的每个 Pod 维护了一个唯一的ID，该序列号会在 StatefulSet 存在的时间内保持不变，哪怕 Pod 被重启或者重新调度，也不会出现任何的改变。StatefulSet 引入了 PV 和 PVC 对象来持久存储服务产生的状态，Zookeeper、Kafka，etcd等。
3. **守护进程工作负载**: 保证每个节点上运行着这样一个守护进程
   - DaemonSet
4. **批处理工作负载**: 一次性的任务
   - Job
   - CronJob


## 工作负载类型1-Deployment

Deployment是一组不具有唯一标识的多个Pod的集合：
- 确保集群中有期望数量的Pod运行
- 提供多种升级策略以及一键回滚能力。
- 提供暂停/恢复的能力

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227115110.png)

典型使用场景：Web Server等无状态应用

### Deployment 语法

**Deployment 升级策略**：
- **RollingUpdate**: 滚动升级策略中可以配置以下两个参数
  - maxUnavailable 表示在更新过程中能够进入不可用状态的 Pod 的最大值；
  - maxSurge 表示能够额外创建的 Pod 个数
  - 滚动更新的过程中是启动一个新的ReplicaSet，创建一部分新Pod，并缩减历史的ReplicaSet的数量，一直循环往复，以达到期望状态，步长由以上两个参数控制。
- **Recreate**: 先将老的ReplicaSet期望实例数改成0，等所有Pod终止以后，再创建新的ReplicaSet
- **RevisonHistoryLimit**: 指定保留的历史ReplicaSet数量。
- **Pause**: 当Deployment暂停后，Deployment发生了改动，也不会被Controller同步，触发更新。
```yaml

apiVersion: apps/v1
kind: Deployment
metadata:
name: nginx-deployment
spec:
strategy:
rollingUpdate:
maxSurge: 0
maxUnavailable: 1
type: RollingUpdate
selector:
matchLabels:
app: nginx
replicas: 2 # tells deployment to run 2 pods matching the template
template:
metadata:
labels:
app: nginx
spec:
containers:
- name: nginx
image: nginx:1.14.2
ports:
- containerPort: 80
```

### Deployment 常用操作

**创建Deployement**
```shell
kubectl create deploy nginx-test --image nginx --replicas=3
kubectl create –f nginx.yaml
```
**查询Deployement**
```shell
kubectl get deploy
NAME    READY      UP-TO-DATE         AVAILABLE        AGE
nginx           1/1               1                          1               17d
```
:::info
- READY: 对应status.readyReplicas/spec.replicas
- UP-TO-DATE:对应status.updatedReplicas, 表示根据新模板创建的pod数量
- AVAILABLE: 对应status.availableReplicas, 表示在minReadySeconds Pod的Container没有重启的Running Pod数量。
:::
**更新Deployement**
```shell
kubectl edit deploy/nginx
kubectl set image deploy/nginx nginx=nginx:1.9.1
kubectl apply -f nginx.yaml
```
**监视Deployment滚动更新情况**
```shell
kubectl rollout status deploy/nginx
```

**查询升级历史**

```
kubectl rollout history deploy/nginx
```

**回滚**
```
kubectl rollout undo deployment/nginx  --to-revision=2 #不指定的话默认回滚到上一个版本
```

**暂停/恢复**
```
kubectl rollout pause deployment/nginx
kubectl rollout pause deployment/nginx
```

:::info Deployment 使用小结
- 选择所需的升级策略，合理配置升级参数，例如maxUnavailable以及maxSurge
- 合理设置历史版本数量，系统默认情况下会保留10个历史版本。
- 回滚时，只有Deployment 模板部分会被回滚，手动/自动扩缩Deployment数量是不会被回滚的。
- 暂停过程中，模板更新不会触发Deployment滚动更新。
:::

##  工作负载类型2-Job/CronJob

Job 主要处理一些短暂的一次性任务：
- 保证指定数量Pod成功运行结束
- 支持并发执行
- 支持错误自动重试
- 支持暂停/恢复Job

典型使用场景：

- 计算以及训练任务, 如批量计算，AI训练任务等

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227125921.png)

CronJob 主要处理周期性或者重复性的任务：

- 基于Crontab格式的时间调度
- 可以暂停/恢复CronJob

典型的使用场景：

- 周期性的数据分析服务
- 周期性的资源回收服务

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227130007.png)

### Job/CronJob 语法

**Job关键字段：**
- Parallelism: 在同一时间运行的最大的Pod的数量
- Completions: 指定Job成功需要运行成功的Pod的数量
- BackoffLimit: 重试次数，当超过该重试次数时，该Job标记为Failed
- CompletionMode: 1.21引入，如果设置为Indexed，创建的`Pod annotation`会带上`batch.kubernetes.io/job-completion-index`，index值为`0~spec.completions-1`，并且仅当每index的pod都有一个成功的时候，这时Job才会被认为是成功的。controller会给pod中注入JOB_COMPLETION_INDEX的环境变量
- Suspend: 1.21引入，等于true时，用户暂停了Job，controller会删除所有正在运行的Pod。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
name: pi
spec:
template:
spec:
containers:
- name: pi
image: perl
command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
restartPolicy: Never
backoffLimit: 4
completions: 1
parallelism: 1
```

**CronJob关键字段：**

- Schedule: 设置Job的周期策略
- ConcurrencyPolicy:  指定 CronJob 创建的任务执行时发生重叠如何处理, Allow是允许并发执行任务, Forbid是不允许并发执行，Replace是会用新任务替换正在运行的任务。
- startingDeadlineSeconds: 表示统计错过调度次数开始的时间,默认从上一次调度时间开始统计。
- successfulJobsHistoryLimit，failedJobsHistoryLimit: 可以指定保留的成功和失败的任务个数。
- Suspend: 是否暂停

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
name: hello
spec:
schedule: "*/1 * * * *"
successfulJobsHistoryLimit: 3
failedJobsHistoryLimit: 1
concurrencyPolicy: Allow
jobTemplate:
spec:
template:
spec:
containers:
- name: hello
image: busybox
imagePullPolicy: IfNotPresent
command:
- /bin/sh
- -c
- date; echo Hello from the Kubernetes cluster
restartPolicy: OnFailure
```

### Job/CronJob 常用操作

**创建CronJob**
```shell
kubectl create cronjob hello --image=busybox --schedule="*/1 * * * *"
kubectl create –f cronjob.yaml
```

**查询CronJob**
```shell
# kubectl get cronjob
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello        */1 * * * *           False            1                57s                 73s
```

>- SUSPEND : 显示已经该Cronjob是否暂停
>-  ACTIVE : 显示的是正在执行的Job的数量
>- LAST SCHEDULE: 显示的是上一次触发任务执行的时间


:::info Job/CronJob 使用小结

- 合理设置Job 的并发度，和所需的完成数量
- 合理设置失败重试次数，当前系统默认值为6
- Job 中的Pod Restart Policy 只能为Never 或者 OnFailure
- 合理设置历史Job保留时间
- 合理设置CronJob的周期策略，以及并发策略
- CronJob 当在一个时间窗内（上一次调度的时间点到现在）所错过的调度次数超过100次以后，那么就不会再启动这个任务了。
:::


## 工作负载类型3-DaemonSet 

### DaemonSet 概述

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227130908.png)

DaemonSet（守护进程集）功能：
- 确保每一个节点或者期望的节点上运行一个Pod
- 新增节点时自动部署一个Pod
- 移除节点时自动删除Pod


典型使用场景：
- 日志监控采集进程，如fluentd, icagent,
- 节点运维进程，等Node Problem Detector, OS-Operator-Agent
- Kubernetes 必要运行组件，如Everest Driver, Calico等
- Device Plugin：GPU Device Plugin，运行在GPU节点上

### DaemonSet 语法

**DaemonSet 升级策略**：

- RollingUpdate:更新了DaemonSet的配置时，会自动删除老的Pod，删除完成后，创建新的Pods，并发滚动更新的节点数可以通过maxUnavailable控制.
- OnDelete: 更新了DaemonSet的配置，不会自动删除并重建Pod; 通过删除Pod，触发Pod的更新。


DaemonSet Template中RestartPolicy必须为Always

**RevisionHistoryLimit**: 指定保留的历史revision数量。

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
name: fluentd-elasticsearch
namespace: kube-system
labels:
k8s-app: fluentd-logging
spec:
revisionHistoryLimit: 10
updateStrategy:
rollingUpdate:
maxUnavailable: 10
type: RollingUpdate
selector:
matchLabels:
name: fluentd-elasticsearch
template:
metadata:
labels:
name: fluentd-elasticsearch
spec:
containers:
- name: fluentd-elasticsearch
image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
```

### DaemonSet 常用操作

**创建DaemonSet**
```shell
kubectl create –f daemonset.yaml
```

**查询DaemonSet** 
```shell
kubectl get daemonset –nkube-system
NAME                 DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
everest-csi-driver   1                  1                   1               1                         133d
```
:::info
- DESIRED: 对应status.desiredNumberScheduled,表示集群中需要部署ds pod的节点数量
- CURRENT:对应status.currentNumberScheduled, 表示集群中已经有调度ds pod的节点数量
- READY:对应status.NumberReady, 表示集群中已经有Running ds pod的节点数量
- UP-TO-DATE:对应status.updatedNumberScheduled, 表示集群中已经启动最新的ds版本pod的节点数量
- AVAILABLE: 对应status.numberAvailable, 表示集群中有running ds pod,并且在minReadySeconds容器没有重启的节点数量
::::

**更新DaemonSet** 
```
kubectl edit ds/fluentd-elasticsearch -n kube-system
kubectl set image ds/fluentd-elasticsearch fluentd-elasticsearch=quay.io/fluentd_elasticsearch/fluentd:v2.6.0 -n kube-system
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset-update.yaml
```


**监视DaemonSet滚动更新情况**

```shell
kubectl rollout status ds/fluentd-elasticsearch
```


**查询更新历史**
```shell
kubectl rollout history ds/fluentd-elasticsearch
```


**回滚**

```shell
kubectl rollout undo ds/fluentd-elasticsearch  --to-revision=2 #不指定的话默认回滚到上一个版本
```

:::info DaemonSet使用小结
- 合理设置DaemonSet升级策略
- 可以通过设置节点亲和性或者节点选择器来选择部分节点部署。
- 合理设置DaemonSet的RevisionHistoryLimit,默认值为10
:::