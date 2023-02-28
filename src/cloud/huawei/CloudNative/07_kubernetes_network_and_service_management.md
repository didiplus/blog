
# 云原生第7课：Kubernetes 网络与服务管理

:::info
本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第7课，由华为云容器技术专家Luke主讲，详细介绍Kubernetes service和Kubernetes ingress的概念及使用场景。
:::

[上节课](./06_kubernetes_persistent_data_volume.md)我们介绍了kubernetes工作负载管理，包括Deployment 概念及使用场景、Daemonset 概念及使用场景和Job/Cronjob 概念及使用场景。

Kubernetes工作负载部署应用服务，需要通过Service 或者 Ingress暴露给其他服务或者外部用户。

接下来的课程我们将为大家介绍 kubernetes Service 和 Ingress 基本概念和使用场景。

## Kubernetes service 概念及使用场景介绍

### Service基本概念

Kubernetes Service 定义了这样一种抽象：一个 Pod 的逻辑分组，一种可以访问它们的策略-----通常称为微服务。这一组 Pod 能够被 Service 访问到，通常是通过 Label Selector实现的。


介绍两个比较重要的概念：

- ClusterIP: kubernetes集群内部虚拟服务IP，由kube-proxy实现。
- Endpoints: kubernetes 资源对象 Service实际服务后端的集合。手动创建或Endpoints controller 自动生成。

### Service的定义

Service定义的源数据：

```yaml
kind: Service
apiVersion: v1
metadata:
   name: my-service
spec:
   type: ClusterIP
   selector:
      app: MyApp
    port:
    - protocol: TCP
      port: 80
      targetPort: 80
```

下图为通过图示方式展示Client端如何通过ClusterIP来访问后端的服务：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228100502.png)

### Service类型1：Services without selectors

在没有添加Selectors的情况下，需要手动创建Endpoints资源对象，Endpoints资源对象要与Service同名，则会自动进行关联，关联之后Service的后端自动会添加为Endpoint定义的后端，还可以进行服务的转发。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228100759.png)

### Service类型2：Headless Service

通过指定 Cluster IP（spec.clusterIP）的值为 “None” 来创建 Headless ServiceHeadless service 不会分配Cluster IP，kube-proxy 不会处理该类service,  可以通过域名解析直接访问backend pod 一跳直达，具体实现取决于DNS实现。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228101206.png)

### Headless Service 应用场景

- 自主选择权，client 可以自己来决定使用哪个Real Server，可以通过查询DNS来获取 Real Server 的信息
- Headless Service 的对应的每一个 Endpoints，即每一个Pod，都会有对应的DNS域名，这样Pod之间就可以互相访问


### 发布服务 – 服务类型

- **ClusterIP** :通过集群的内部 IP 暴露服务，选择该值，服务只能够在集群内部可以访问
- **NodePort**:通过每个 Node 上的 IP 和静态端口（NodePort）暴露服务。NodePort 服务会路由到 ClusterIP 服务，这个 ClusterIP 服务会自动创建。通过请求:，可以从集群的外部访问一个 NodePort 服务
- **LoadBalancer**:使用云提供商的负载均衡器，可以向外部暴露服务。外部的负载均衡器可以路由到 NodePort 服务和 ClusterIP 服务
- **ExternalName**:通过返回 CNAME 和它的值，可以将服务映射到 externalName 字段的内容（例如， foo.bar.example.com）。没有任何类型代理被创建，这只有 Kubernetes 1.7 或更高版本的 kube-dns 才支持


#### NodePort Service

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
     app: MyApp
  port:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 3036
```

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228102631.png)

#### LoadBalancer Service


```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
     app: MyApp
  port:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 3036
  clusterIp: 10.0.171.239
  loadBalancerIP: 78.11.24.19
  type: LoadBalancer
```

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228103128.png)

#### ExternalName Service

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
  namespace: my-ns
spec:
  type: ExternalName
  externalName: my.app.example.com
```

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228103335.png)

**ExternalName Service 使用场景**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228103400.png)


### Service背后的实现：Kube-proxy

每台机器上都运行一个 kube-proxy 服务，它监听 API server 中 service 和 endpoint 的变化情况，并通过 iptables 等来为服务配置负载均衡。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228103431.png)


## Kubernetes ingress概念及使用场景介绍

### 什么是Ingress？

Ingress 是从Kubernetes集群外部访问集群内部服务的入口。

通常情况下，service和pod仅可在集群内部网络中通过IP地址访问。所有到达边界路由器的流量或被丢弃或被转发到其他地方

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228103556.png)

### Ingress 的定义

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228103618.png)

```yaml
apiVersion: networking.k8s.io/v1
kind: ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
     paths:
     - pathType: Prefix
       path: '/'
       backend:
         service:
           name: service1
           port:
             number: 80
  - host: bar.foo.com
    http:
     paths:
     - pathType: Prefix
       path: "/"
       backend: 
         service:
           name: service2
           port:
            number: 80
```

### Ingress controllers

Ingress controller负责实现Ingress，是k8s Ingress能够生效的先决条件。为了使Ingress正常工作，集群中必须运行Ingress controller。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228104114.png)