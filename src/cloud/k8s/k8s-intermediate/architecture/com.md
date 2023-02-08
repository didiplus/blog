

# 3.1.4、集群内的通信



本文描述了Kubernetes集群和Master节点（实际上是 apiserver）之间的通信路径。用户在自定义集群的安装之前，或者调整集群的网络配置之前必须理解这部分内容。例如：
* 从 [离线安装高可用的Kubernetes集群](../../install/install-k8s.md) 的安装结果调整到 [安装Kubernetes高可用](../../install/install-kubernetes.md) 的安装结果
* 将公网 IP 地址上的机器作为节点加入到 Kubernetes 集群

Master-Node 之间的通信可以分为如下两类：
* [Cluster to Master](#cluster-to-master)
* [Master to Cluster](#master-to-cluster)


## Cluster to Master

所有从集群访问 Master 节点的通信，都是针对 apiserver 的（没有任何其他 master 组件发布远程调用接口）。通常安装 Kubernetes 时，apiserver 监听 HTTPS 端口（443），并且配置了一种或多种 [客户端认证方式 authentication](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)。至少需要配置一种形式的 [授权方式 authorization](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)，尤其是 [匿名访问 anonymous requests](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#anonymous-requests) 或 [Service Account Tokens](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#service-account-tokens) 被启用的情况下。

节点上必须配置集群（apiserver）的公钥根证书（public root certificate），此时，在提供有效的客户端身份认证的情况下，节点可以安全地访问 APIServer。例如，在 Google Kubernetes Engine 的一个默认 Kubernetes 安装里，通过客户端证书为 kubelet 提供客户端身份认证。请参考 [kubelet TLS bootstrapping](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)，了解如何自动为 kubelet 提供客户端证书。

对于需要调用 APIServer 接口的 Pod，应该为其关联 Service Account，此时，Kubernetes将在创建Pod时自动为其注入公钥根证书（public root certificate）以及一个有效的 bearer token（放在HTTP请求头Authorization字段）。所有名称空间中，都默认配置了名为 `kubernetes` Kubernetes Service，该 Service对应一个虚拟 IP（默认为 10.96.0.1），发送到该地址的请求将由 kube-proxy 转发到 apiserver 的 HTTPS 端口上。请参考 [Service连接应用程序](/learning/k8s-intermediate/service/connecting.html) 了解 Kubernetes Service 是如何工作的。

得益于这些措施，默认情况下，从集群（节点以及节点上运行的 Pod）访问 master 的连接是安全的，因此，可以通过不受信的网络或公网连接 Kubernetes 集群


## Master to Cluster



从 master（apiserver）到Cluster存在着两条主要的通信路径：
* apiserver 访问集群中每个节点上的 kubelet 进程
* 使用 apiserver 的 proxy 功能，从 apiserver 访问集群中的任意节点、Pod、Service

### apiserver to kubelet

apiserver 在如下情况下访问 kubelet：
* 抓取 Pod 的日志
* 通过 `kubectl exec -it` 指令（或 kuboard 的终端界面）获得容器的命令行终端
* 提供 `kubectl port-forward` 功能

这些连接的访问端点是 kubelet 的 HTTPS 端口。默认情况下，apiserver 不校验 kubelet 的 HTTPS 证书，这种情况下，连接可能会收到 man-in-the-middle 攻击，因此该连接如果在不受信网络或者公网上运行时，是 **不安全** 的。

如果要校验 kubelet 的 HTTPS 证书，可以通过 `--kubelet-certificate-authority` 参数为 apiserver 提供校验 kubelet 证书的根证书。

如果不能完成这个配置，又需要通过不受信网络或公网将节点加入集群，则需要使用 [SSH隧道](#SSH隧道) 连接 apiserver 和 kubelet。

同时，[Kubelet authentication/authorization](https://kubernetes.io/docs/admin/kubelet-authentication-authorization/) 需要激活，以保护 kubelet API

### apiserver to nodes, pods, services

从 apiserver 到 节点/Pod/Service 的连接使用的是 HTTP 连接，没有进行身份认证，也没有进行加密传输。您也可以通过增加 `https` 作为 节点/Pod/Service 请求 URL 的前缀，但是 HTTPS 证书并不会被校验，也无需客户端身份认证，因此该连接是无法保证一致性的。目前，此类连接如果运行在非受信网络或公网上时，是 **不安全** 的

## SSH隧道

Kubernetes 支持 SSH隧道（tunnel）来保护 Master --> Cluster 访问路径。此时，apiserver 将向集群中的每一个节点建立一个 SSH隧道（连接到端口22的ssh服务）并通过隧道传递所有发向 kubelet、node、pod、service 的请求。

::: warning deprecated
SSH隧道当前已被不推荐使用（deprecated），Kubernetes 正在设计新的替代通信方式。
:::