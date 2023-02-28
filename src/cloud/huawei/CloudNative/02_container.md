# 云原生第2课：云原生技术体系中的基石-容器技术

:::info
本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第2课，由华为云容器技术专家Jarvis Zhou主讲，帮助大家了解容器技术的发展历程；对容器镜像有初步的了解，并能编写简单的Dockerfile；可以完成镜像制作、上传、下载等操作。
:::

## 容器技术发展简介

### 背景
在之前的开发运维中，应用和环境的交付是分离的，较难在开发环境和生产环境无法保持一致，容易出现各种环境问题:

- 对于公司而言，服务器、存储等作为成本之一，希望能追求高效的利用已有的服务资源。在容器之前，可能直接将多应用部署在同一机器上；也可能是采取虚拟机等方式在同一物理服务器上；
- 对于直接部署在同一机器上的场景，就需要考虑应用之间的隔离和资源的抢占问题。
- 而对于使用虚拟机的场景，虚机虽然提供了很好的隔离性，但是虚拟机本身占用了大量的资源，并且启动时间慢。

### 概念

在Linux中，容器技术是一种进程隔离的技术，应用可以运行在一个个相互隔离的容器中，与虚拟机相同的是，可以为这些容器设置计算资源限制，挂载存储，连接网络，而与虚拟机不同的是，这些应用运行时共用着一个Kernel。

这些技术的基础就是Linux的LXC（Linux Container），通过将Cgoups的资源管理能力和Linux Namepsace的隔离能力组合在一起

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227103431.png)


#### Cgroup

Cgroup实现容器资源的限制，包括很多子模块，在容器中，我们主要用到cpu子模块和memory子模块，memory是实现内存的隔离，cpu主要限制进程的 cpu 使用率。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227103505.png)

| 子系统      | 作用 |
| :---        |    :----   |
| blkio      | 为块设备设定输入/输出限制，比如物理设备(磁盘固态硬盘，USB 等等)       |
| cpu      | 使用调度程序提供对CPU的cgroup任务访问       |
| cpuacct      | 自动生成cgroup中任务所使用的CPU报告      |
| cpuset      | 为cgroup中的任务分配独立CPU(在多核系统)和内存节点       |
| devices      | 允许或者拒绝cgroup中的任务访问设备       |
| freezer      | 挂起或者恢复cgroup中的任务       |
| memory      | 设定cgroup中任务使用的内存限制，并自动生成由那些任务使用的内存资源报告       |
| net cls      | 使用等级识别符(classid)标记网络数据包，可允许Linux流量控制程序(tc)识别从具体cgroup中生成的数据包       |

#### Namespace

Linux Namespace提供了一种内核级别隔离系统资源的方法，通过将系统的全局资源放在不同的Namespace中，来实现资源隔离的目的。不同Namespace的程序，可以享有一份独立的系统资源。

| Namespace      | 隔离内容 |
| :---        |    :----   |      
| UTS      | 主机名与域名       |
| IPC   | 信号量、消息队列和共享内存        |
| PID      | 进程编号       |
| Network   | 网络设备，网络栈，端口等       |
| Mount     | 挂载点       |
| User   | 用户和用户组        |


## Docker容器和容器镜像技术介绍


Docker 公司起初是一家名为 dotCloud 的PaaS提供商，是一个用于开发，交付和运行应用程序的开放平台。Docker 能够将应用程序与基础架构分开，从而可以快速交付软件。


![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227104227.png)

借助 Docker，可以与管理应用程序相同的方式来管理基础架构。通过利用 Docker 的方法来快速交付，测试和部署代码，可以大大减少编写代码和在生产环境中运行代码之间的延迟。

### Docker VS VM

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227104302.png)

- **docker启动快速属于秒级别**。虚拟机通常需要几分钟去启动。
- **docker需要的资源更少**，docker在操作系统级别进行虚拟化，docker容器和内核交互，几乎没有性能损耗，性能优于通过Hypervisor层与内核层的虚拟化。
- **docker更轻量**，docker的架构可以共用一个内核与共享应用程序库，所占内存极小。
- **高可用和可恢复性**：docker对业务的高可用支持是通过快速重新部署实现的。
- **快速创建、删除**：虚拟化创建是分钟级别的，Docker容器创建是秒级别的，Docker的快速迭代性，决定了无论是开发、测试、部署都可以节约大量时间。
- **交付、部署**：虚拟机可以通过镜像实现环境交付的一致性，但镜像分发无法体系化；Docker在Dockerfile中记录了容器构建过程，可在集群中实现快速分发和快速部署。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227104457.png)

- 首先开发者在开发环境机器上开发应用并制作镜像。Docker执行命令，构建镜像并存储在机器上。
- 开发者发送上传镜像命令。Docker收到命令后，将本地镜像上传到镜像仓库。
- 开发者向生产环境机器发送运行镜像命令。生产环境机器收到命令后，Docker会从镜像仓库拉取镜像到机器上，然后基于镜像运行容器。



### Docker常用命令
| 选项      | 说明 |
| :---        |    :----   |      
| build      | 根据 Dockerfile 文件构建镜像       |
| exec   | 在已运行的容器中执行命令        |
| images      | 列出本地所有镜像       |
| load   | 导入镜像压缩包       |
| login     | 登录第三方仓库       |
| logout   | 退出第三方仓库        |
| logs     | 打印容器的控制台输出内容       |
| pause   | 暂停容器        |
| ps     | 列出正在运行的容器，-a 选项显示所有容器       |
| pull   | 从镜像仓库拉取镜像        |
| push     | 将镜像推送到镜像仓库       |
| rm   | 删除已停止的容器，-f 选项可强制删除正在运行的容器        |
| rmi   | 删除镜像(必须先删除该镜像构建的所有容器)        |
| run   | 根据镜像生成并进入一个新的容器        |
| save   | 打包本地镜像使用压缩包来完成迁移        |
| search   | 查找镜像        |
| tag   | 修改镜像tag        |

## Docker镜像

一种新型的应用打包、分发和运行机制。容器镜像将应用运行环境，包括代码、依赖库、工具、资源文件和元信息等，打包成一种操作系统发行版无关的不可变更软件包。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227105144.png)

- 容器镜像打包了整个容器运行依赖的环境，以避免依赖运行容器的服务器的操作系统，从而实现 “build once，run anywhere”。
- 容器镜像一旦构建完成，就变成 read only，成为不可变基础设施的一份子。
- 操作系统发行版无关，核心解决的是容器进程对操作系统包含的库、工具、配置的依赖。

### Docker镜像优势与分层结构

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227105244.png)

- 新镜像是从 base 镜像一层一层叠加生成的。每安装一个软件，就在现有镜像的基础上增加一层。
- 镜像分层最大的一个好处就是共享资源。比如说有多个镜像都从相同的 base 镜像构建而来，
- 那么 Docker Host 只需在磁盘上保存一份 base 镜像；同时内存中也只需加载一份 base 镜像，就可以为所有容器服务了。而且镜像的每一层都可以被共享。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227105324.png)

- 只有容器层是可写的，容器层下面的所有镜像层都是只读的
- 叠加文件系统：从上往下依次在各镜像层中查找文件
- Copy-on-Write：只有当需要修改时才复制一份数据


## 镜像仓库介绍

容器镜像服务（Software Repository for Container，简称SWR）是一种支持镜像全生命周期管理的服务， 提供简单易用、安全可靠的镜像管理功能，可快速部署容器化服务。用户可以通过界面、社区CLI和原生API上传、下载和管理容器镜像

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227105826.png)

核心功能：

- 镜像全生命周期管理
- 私有镜像仓库
- 镜像源加速
- 镜像仓库触发器
- 镜像安全扫描

## 如何使用Dockerfile进行镜像构建

Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。Docker通过读取Dockerfile中的指令自动生成映像。可以使用在命令行中调用任何命令。Dockerfile 一般分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227105422.png)

### 如何使用Dockerfile进行构建？

Demo内容：Weather Forecast是一款查询城市的天气信息的应用示例

1. 构建镜像

```shell
docker build -t forecast:v1
```
2. 推送镜像到swr保存，用于下次实验

```shell
docker tag forecast:v2  仓库名称/jarvis/forecast:v2
docker push 仓库名称/jarvis/forecast:v2
```
:::info 提示
推送之前要先登录仓库，执行docker login 仓库地址
:::

### Docker build命令参数详细

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110500.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110512.png)