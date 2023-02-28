# 云原生钻石课程 | 第1课：容器运行时技术深度剖析

## 容器引擎和运行时机制原理剖析

### 容器引擎和运行时原理1：CRI接口

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114644.png)


**CRI接口**: kubelet调用容器运行时的grpc接口
**dockershim**：kubernetes对接docker api的CRI接口适配器，kubernetes 1.21版本已经将其标注为废弃接口。
**CRI-containerd**： 通过containerd中的CRI插件实现了CRI接口，让containerd可直接对接containerd启动容器，无需调用docker api。当前使用最广泛的CRI接口接口实现。
**CRI-O**：专注于在kubernetes运行容器的轻量级CRI接口实现(不关注开发态)。

![CRI接口](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114744.png)

CRI接口主要包括RuntimeService和ImageService，RuntimeService主要负责容器运行时的一些接口， 包括负责容器的生命周期管理，包括容器创建，启动、停止、日志和性能采集等接口；ImageService负责容器镜像的管理，包括显示镜像、拉取镜像、删除镜像等接口。

### 容器引擎和运行时原理2：OCI runtime spec

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114956.png)

**OCI组织**: Linux基金会于2015年6月成立OCI（Open Container Initiative）组织，旨在围绕容器格式和运行时制定一个开放的工业化标准。目前主要有两个标准文档：容器运行时标准 （runtime spec）和 容器镜像标准（image spec）

**Runtime spec**：容器运行时标准，定义了容器状态和配置文件格式，容器生命周期管理命令格式和参数等。

**runc**： docker捐献给OCI社区的一个runtime spec的参考实现，docker容器也是基于runc创建的。

**Kata-runtime**：一种基于虚拟化的安全隔离的OCI runtime spec的实现。

**gVisor**： 一种基于系统调用拦截技术的轻量级安全容器实现。

![OCI文件格式](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115136.png)

config.json：定义容器运行所需要的所有信息，包括rootfs、mounts、进程、cgroups、namespaces、caps等。

![容器生命周期管理命令](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115205.png)

命令：容器生命周期管理命令、包括创建、启动、停止、删除等。

### 容器引擎和运行时原理3：runtime v2

目的：让运行时更方便维护容器状态和生命周期，减少安全容器实现中，节点的进程数和资源调用。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115249.png)

**shimv2**: 新的容器运行时接口，基于ttrpc通信。

![容器生命周期管理命令](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115312.png)

### 容器引擎和运行时原理4：RuntimeClass

RuntimeClass: kubernetes中的对象类型，定义了在集群中的某种运行时，并且可以通过overhead和nodeSelector定制某种运行时的资源和调度行为。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115405.png)

**Runtime Plugin**： containerd中的runtime插件配置，定义了runtime名称、二进制路径、传递的annotation、特权容器模式等等。

**runtimeClassName**：pod的中的字段，通过该字段决定用那种运行时启动容器。

### 业界主流容器运行时技术架构剖析

#### 业界主流容器运行时1：runc

Runc其实是最初Docker容器的实现，实际上它的容器就是一个进程，利用了Linux内核的特性对进程进行了许多限制，让进程看起来似乎运行在独立的环境中，主要有以下3种特性来对进程进行限制：

- Namespace: 资源和信息的可见性隔离，通过namespace隔离，容器中的应用只能看到分配到该容器的资源、其他主机上的信息在容器中不可见。常用的namespace有PID（进程号）、MNT（挂载点）、NET（网络）、UTS（主机名）和IPC（跨进程通信）等
- Cgroups：资源使用量的隔离，通过cgroup、限制了容器使用的资源量，通过不同的子系统，限制不同的资源。包括CPU、内存、io带宽、大页、fd数等等
- Capability： 权限限制, 通过对进程的capability定义，限制容器中的进程调用某些系统

调用，以达到容器进程无法逃逸到主机的目的， 比如容器中的进程是不具有以下`capability`的：`SYS_ADMIN/MKNOD/SYS_RESOURCE/SYS_MODULES `

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228130629.png)

Runc在主机或容器运行时如下图：

kata containers是基于虚拟化来做的容器隔离，虚拟化隔离是指每个K8s pod都运行在一个独立的虚拟机中，提供虚拟化接口对接不同的虚拟化实现，包括qemu、cloud hypervisor、firecracker等等 。为了达到和容器近似的使用体验，需要对各组件进行裁剪，达到轻量化和启动加速的目的，对于hypervisor，去除通用虚拟化的各种不必要的设备、总线等。对于guest kernel，也裁剪了大量不需要的驱动和文件系统模块。而运行在虚拟机中的1号进程(一般为kata-agent)，资源占用可小于1MB。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228130756.png)

如下为kata containers运行时主机或容器的情况：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228130825.png)


#### 业界主流容器运行时3：gVisor

gVisor是通过拦截进程的系统调用来实现比runc更强的隔离，比kata更轻量。其拦截系统调用的方式有两种，ptrace和kvm。



:::info 容器运行技术原理相关参考链接

[container-runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

[runtime-class](https://kubernetes.io/docs/concepts/containers/runtime-class/)

[spec](https://github.com/opencontainers/runtime-spec/blob/master/spec.md)

[containerd](https://github.com/containerd/containerd#cri)

[cri-o.io](https://cri-o.io/)

[runc](https://github.com/opencontainers/runc)

[katacontainer](https://katacontainers.io/)

[gvisor](https://gvisor.dev/)

[product](https://www.huaweicloud.com/product/cce.html)

[cci](https://www.huaweicloud.com/product/cci.html)
::::









