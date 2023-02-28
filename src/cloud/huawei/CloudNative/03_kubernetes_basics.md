# 云原生第3课：Kubernetes 系统快速入门

:::info
本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第3课，由华为云容器批量计算首席架构师马达主讲，介绍云原生技术体系中Kubernetes的相关概念和技术架构。
:::

## Kubernetes介绍

### 云计算的发展历程

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110638.png)

“云”中的资源在使用者看来是可以无限扩展的，并且可以随时获取，按需使用，随时扩展，按使用付费。这种特性经常被称为像水电一样使用IT基础设施。

### Kubernetes架构分层

该图为Kubernetes社区描绘的整个Kubernetes生态里所涉及的几个主要层次：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110710.png)

K8S社区架构中对各层的详细定义

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110724.png)

上图从上往下依次为：

1. 生态层：不属于K8S范围
2. 接口层（工具、SDK库、UI等）：
   - K8S官方的项目会提供库、工具、UI等外围工具
   - 外部可提供自有的实现
3. 治理层：策略执行和自动化编排
   - 对应用运行的可选层，没有这层功能不影响应用的执行
   - 自动化API：水平弹性伸缩、租户管理、集群管理、动态LB等
   - 策略API：限速、资源配额、pod可靠性策略、network policy等
4. 应用层：部署（无状态/有状态应用、批处理、集群应用等）和路由（服务发现、DNS解析等）
   - K8S发行版必备功能和API，K8S会提供默认的实现，如Scheduler
   - Controller和scheduler可以被替换为各自的实现，但必须通过一致性测试
   - 业务管理类Controller：daemonset/replicaset/replication/statefulset/cronjob/service/endpoint
5. 内核层：Kubernetes最核心功能，对外提供API构建高层的应用，对内提供插件式应用执行环境
   - 由主流K8S codebase实现（主项目），属于K8S的内核、最小特性集。等同于Linux Kernel
   - 提供必不可少Controller、Scheduler的默认实现
   - 集群管理类Controller：Node/gc/podgc/volume/namespace/resourcequota/serviceaccount

::: info 总的来说
- **内核层**：提供最核心的特性最小集以及API，为必选模块
- **内核层之上**：以各种Controller插件方式实现内核层API，支持可替换的实现
- **内核层之下**：是各种适配存储、网络、容器、Cloud Provider等
:::

## Kubernetes基本概念

### Kubernets概览

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227111147.png)


### Kubernetes关键概念-Pod

- 在Kubernetes中，pods是能够创建、调度、和管理的最小部署单元，是一组容器的集合，而不是单独的应用容器
- 同一个Pod里的容器共享同一个网络命名空间，IP地址及端口空间。
- 从生命周期来说，Pod是短暂的而不是长久的应用。Pods被调度到节点，保持在这个节点上直到被销毁

**POD实例**
```yml
{
    "kind": "Pod",
    "apiVersion": "v1",
    "metadata": {
        "name": "redis-django",
        "labels": {
            "app": "webapp"
        }
    },
    "spec": {
        "containers": [{
            "name": "key-value-store",
            "image": "redis"
        }, {
            "name": "frontend",
            "image": "django"
        }]
    }
}
```
#### Pod详解-容器（Containers）
1. Infrastructure Container：基础容器
   - 用户不可见，无需感知
   - 维护整个Pod网络空间
2. InitContainers：初始化容器，一般用于服务等待处理以及注册Pod信息等
   - 先于业务容器开始执行
   - 顺序执行，执行成功退出（exit 0），全部执行成功后开始启动业务容器
3. Containers：业务容器
   - 并行启动，启动成功后一直Running

```yml
apiVersion: v1
kind: Pod
metadata:
   name: myapp-pod
labels:
   app: myapp
spec:
   containers:
   - name: myapp-container
     image: busybox
     command: ['sh', '-c', 'echo The app is running! && sleep 3600']
   initContainers:
   - name: init-myservice
     image: busybox
     command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
   - name: init-mydb
     image: busybox
     command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

#### 容器基本组成

1. 镜像部分：
   - 镜像地址和拉取策略
   - 拉取镜像的认证凭据
2. 启动命令：
   - command：替换docker容器的entrypoint
   - args：作为docker容器entrypoint的入参
3. 计算资源：
   - 请求值：调度依据
   - 限制值：容器最大能使用的规格

**spec:**

```yml
imagePullSecrets:
- name: default-secret
containers:
- image: kube-dns:1.0.0
imagePullPolicy: IfNotPresent
command:
- /bin/sh
- -c
- /kube-dns 1>>/var/log/skydns.log 2>&1 --domain=cluster.local. --dns-port=10053
--config-dir=/kube-dns-config --v=2
resources:
   limits:
      cpu: 100m
      memory: 512Mi
   requests:
      cpu: 100m
      memory: 100Mi
```
![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227170736.png)

#### Pod详解-外部输入

Pod可以接收的外部输入方式：
环境变量、配置文件以及密钥。

环境变量：使用简单，但一旦变更后必须重启容器。

- Key-value自定义
- From 配置文件（configmap）
- From 密钥（Secret）
  
以卷形式挂载到容器内使用，权限可控。

- 配置文件（configmap）
- 密钥（secret）


```yml
spec:
  containers:
  - env:
   - name: APP_NAME
     value: test
   - name: USER_NAME
     valueFrom:
       secretKeyRef:
        key: username
        name: secret
     envFrom:
     - configMapRef:
       name: config
     volumeMounts:
     - mountPath: /usr/local/config
       name: cfg
     - mountPath: /usr/local/secret
       name: sct
     volumes:
     - configMap:
        defaultMode: 420
        items:
        - key: age
          path: age
         name: config
       name: cfg
       - name: sct
         secret:
           defaultMode: 420
           secretName: secret
```

### Pod与工作负载的关系

- 通过label-selector  和 owerReference 相关联
- Pod通过工作负载实现应用的运维，如伸缩、升级等

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227112720.png)


### 关键工作负载-ReplicaSet

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227112819.png)

- ReplicaSet—副本控制器
- 确保Pod的一定数量的份数(replica)在运行。如果超过这个数量，控制器会杀死一些，如果少了，控制器会启动一些。
- ReplicaSet用于解决pod的扩容和缩容问题。
- 通常用于无状态应用

```yaml

apiVersion: extensions/v1beta1
kind: ReplicaSet
metadata:
name: frontend
spec:
replicas: 3
selector:
matchLabels:
tier: frontend
matchExpressions:
- {key: tier, operator: In, values: [frontend]}
template:
metadata:
labels:
app: guestbook
tier: frontend
spec:
containers:
- name: php-redis
image: gcr.io/google_samples/gb-frontend:v3
resources:
requests:
cpu: 100m
memory: 100Mi
env:
- name: GET_HOSTS_FROM
value: dns
ports:
- containerPort: 80
```

### 关键工作负载-Deployment

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113005.png)

1. Kubernetes Deployment提供了官方的用于更新Pod和Replica Set（下一代的Replication Controller）的方法，您可以在Deployment对象中只描述您所期望的理想状态（预期的运行状态），Deployment控制器为您将现在的实际状态转换成您期望的状态;
2. Deployment集成了上线部署、滚动升级、创建副本、暂停上线任务，恢复上线任务，回滚到以前某一版本（成功/稳定）的Deployment等功能，在某种程度上，Deployment可以帮我们实现无人值守的上线，大大降低我们的上线过程的复杂沟通、操作风险。
3. Deployment的典型用例：
   - 使用Deployment来启动（上线/部署）一个Pod或者ReplicaSet
   - 检查一个Deployment是否成功执行
   - 更新Deployment来重新创建相应的Pods（例如，需要使用一个新的Image）
   - 如果现有的Deployment不稳定，那么回滚到一个早期的稳定的Deployment版本

```yaml

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
name: nginx-deployment
spec:
replicas: 3
template:
metadata:
labels:
app: nginx
spec:
containers:
- name: nginx
image: nginx:1.7.9
ports:
- containerPort: 80
```

### Kubernetes系统组件

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113243.png)


## Kubernetes总体架构 

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113319.png)

**Kubernetes基于list-watch机制的控制器架构**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113424.png)

**Kubernetes Controllers**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113446.png)

**Scheduler：为Pod找到一个合适的Node**
![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113506.png)

**Kubernetes 的 Default scheduler**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113528.png)

- 基于队列的调度器
- 一次调度一个Pod
- 调度时刻全局最优
