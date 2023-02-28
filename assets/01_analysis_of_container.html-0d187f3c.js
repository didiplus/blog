import{ab as a,G as t,H as o,E as e,S as i,N as r,ad as s,W as c}from"./framework-894cff3a.js";const p={},l=s('<h1 id="云原生钻石课程-第1课-容器运行时技术深度剖析" tabindex="-1"><a class="header-anchor" href="#云原生钻石课程-第1课-容器运行时技术深度剖析" aria-hidden="true">#</a> 云原生钻石课程 | 第1课：容器运行时技术深度剖析</h1><h2 id="容器引擎和运行时机制原理剖析" tabindex="-1"><a class="header-anchor" href="#容器引擎和运行时机制原理剖析" aria-hidden="true">#</a> 容器引擎和运行时机制原理剖析</h2><h3 id="容器引擎和运行时原理1-cri接口" tabindex="-1"><a class="header-anchor" href="#容器引擎和运行时原理1-cri接口" aria-hidden="true">#</a> 容器引擎和运行时原理1：CRI接口</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114644.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>CRI接口</strong>: kubelet调用容器运行时的grpc接口 <strong>dockershim</strong>：kubernetes对接docker api的CRI接口适配器，kubernetes 1.21版本已经将其标注为废弃接口。 <strong>CRI-containerd</strong>： 通过containerd中的CRI插件实现了CRI接口，让containerd可直接对接containerd启动容器，无需调用docker api。当前使用最广泛的CRI接口接口实现。 <strong>CRI-O</strong>：专注于在kubernetes运行容器的轻量级CRI接口实现(不关注开发态)。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114744.png" alt="CRI接口" tabindex="0" loading="lazy"><figcaption>CRI接口</figcaption></figure><p>CRI接口主要包括RuntimeService和ImageService，RuntimeService主要负责容器运行时的一些接口， 包括负责容器的生命周期管理，包括容器创建，启动、停止、日志和性能采集等接口；ImageService负责容器镜像的管理，包括显示镜像、拉取镜像、删除镜像等接口。</p><h3 id="容器引擎和运行时原理2-oci-runtime-spec" tabindex="-1"><a class="header-anchor" href="#容器引擎和运行时原理2-oci-runtime-spec" aria-hidden="true">#</a> 容器引擎和运行时原理2：OCI runtime spec</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114956.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>OCI组织</strong>: Linux基金会于2015年6月成立OCI（Open Container Initiative）组织，旨在围绕容器格式和运行时制定一个开放的工业化标准。目前主要有两个标准文档：容器运行时标准 （runtime spec）和 容器镜像标准（image spec）</p><p><strong>Runtime spec</strong>：容器运行时标准，定义了容器状态和配置文件格式，容器生命周期管理命令格式和参数等。</p><p><strong>runc</strong>： docker捐献给OCI社区的一个runtime spec的参考实现，docker容器也是基于runc创建的。</p><p><strong>Kata-runtime</strong>：一种基于虚拟化的安全隔离的OCI runtime spec的实现。</p><p><strong>gVisor</strong>： 一种基于系统调用拦截技术的轻量级安全容器实现。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115136.png" alt="OCI文件格式" tabindex="0" loading="lazy"><figcaption>OCI文件格式</figcaption></figure><p>config.json：定义容器运行所需要的所有信息，包括rootfs、mounts、进程、cgroups、namespaces、caps等。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115205.png" alt="容器生命周期管理命令" tabindex="0" loading="lazy"><figcaption>容器生命周期管理命令</figcaption></figure><p>命令：容器生命周期管理命令、包括创建、启动、停止、删除等。</p><h3 id="容器引擎和运行时原理3-runtime-v2" tabindex="-1"><a class="header-anchor" href="#容器引擎和运行时原理3-runtime-v2" aria-hidden="true">#</a> 容器引擎和运行时原理3：runtime v2</h3><p>目的：让运行时更方便维护容器状态和生命周期，减少安全容器实现中，节点的进程数和资源调用。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115249.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>shimv2</strong>: 新的容器运行时接口，基于ttrpc通信。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115312.png" alt="容器生命周期管理命令" tabindex="0" loading="lazy"><figcaption>容器生命周期管理命令</figcaption></figure><h3 id="容器引擎和运行时原理4-runtimeclass" tabindex="-1"><a class="header-anchor" href="#容器引擎和运行时原理4-runtimeclass" aria-hidden="true">#</a> 容器引擎和运行时原理4：RuntimeClass</h3><p>RuntimeClass: kubernetes中的对象类型，定义了在集群中的某种运行时，并且可以通过overhead和nodeSelector定制某种运行时的资源和调度行为。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228115405.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Runtime Plugin</strong>： containerd中的runtime插件配置，定义了runtime名称、二进制路径、传递的annotation、特权容器模式等等。</p><p><strong>runtimeClassName</strong>：pod的中的字段，通过该字段决定用那种运行时启动容器。</p><h3 id="业界主流容器运行时技术架构剖析" tabindex="-1"><a class="header-anchor" href="#业界主流容器运行时技术架构剖析" aria-hidden="true">#</a> 业界主流容器运行时技术架构剖析</h3><h4 id="业界主流容器运行时1-runc" tabindex="-1"><a class="header-anchor" href="#业界主流容器运行时1-runc" aria-hidden="true">#</a> 业界主流容器运行时1：runc</h4><p>Runc其实是最初Docker容器的实现，实际上它的容器就是一个进程，利用了Linux内核的特性对进程进行了许多限制，让进程看起来似乎运行在独立的环境中，主要有以下3种特性来对进程进行限制：</p><ul><li>Namespace: 资源和信息的可见性隔离，通过namespace隔离，容器中的应用只能看到分配到该容器的资源、其他主机上的信息在容器中不可见。常用的namespace有PID（进程号）、MNT（挂载点）、NET（网络）、UTS（主机名）和IPC（跨进程通信）等</li><li>Cgroups：资源使用量的隔离，通过cgroup、限制了容器使用的资源量，通过不同的子系统，限制不同的资源。包括CPU、内存、io带宽、大页、fd数等等</li><li>Capability： 权限限制, 通过对进程的capability定义，限制容器中的进程调用某些系统</li></ul><p>调用，以达到容器进程无法逃逸到主机的目的， 比如容器中的进程是不具有以下<code>capability</code>的：<code>SYS_ADMIN/MKNOD/SYS_RESOURCE/SYS_MODULES </code></p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228130629.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Runc在主机或容器运行时如下图：</p><p>kata containers是基于虚拟化来做的容器隔离，虚拟化隔离是指每个K8s pod都运行在一个独立的虚拟机中，提供虚拟化接口对接不同的虚拟化实现，包括qemu、cloud hypervisor、firecracker等等 。为了达到和容器近似的使用体验，需要对各组件进行裁剪，达到轻量化和启动加速的目的，对于hypervisor，去除通用虚拟化的各种不必要的设备、总线等。对于guest kernel，也裁剪了大量不需要的驱动和文件系统模块。而运行在虚拟机中的1号进程(一般为kata-agent)，资源占用可小于1MB。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228130756.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如下为kata containers运行时主机或容器的情况：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228130825.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="业界主流容器运行时3-gvisor" tabindex="-1"><a class="header-anchor" href="#业界主流容器运行时3-gvisor" aria-hidden="true">#</a> 业界主流容器运行时3：gVisor</h4><p>gVisor是通过拦截进程的系统调用来实现比runc更强的隔离，比kata更轻量。其拦截系统调用的方式有两种，ptrace和kvm。</p>',41),u={class:"hint-container info"},d=e("p",{class:"hint-container-title"},"容器运行技术原理相关参考链接",-1),g={href:"https://kubernetes.io/docs/setup/production-environment/container-runtimes/",target:"_blank",rel:"noopener noreferrer"},h={href:"https://kubernetes.io/docs/concepts/containers/runtime-class/",target:"_blank",rel:"noopener noreferrer"},f={href:"https://github.com/opencontainers/runtime-spec/blob/master/spec.md",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/containerd/containerd#cri",target:"_blank",rel:"noopener noreferrer"},_={href:"https://cri-o.io/",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/opencontainers/runc",target:"_blank",rel:"noopener noreferrer"},k={href:"https://katacontainers.io/",target:"_blank",rel:"noopener noreferrer"},y={href:"https://gvisor.dev/",target:"_blank",rel:"noopener noreferrer"},C={href:"https://www.huaweicloud.com/product/cce.html",target:"_blank",rel:"noopener noreferrer"},x={href:"https://www.huaweicloud.com/product/cci.html",target:"_blank",rel:"noopener noreferrer"};function I(v,z){const n=c("ExternalLinkIcon");return t(),o("div",null,[l,e("div",u,[d,e("p",null,[e("a",g,[i("container-runtimes"),r(n)])]),e("p",null,[e("a",h,[i("runtime-class"),r(n)])]),e("p",null,[e("a",f,[i("spec"),r(n)])]),e("p",null,[e("a",m,[i("containerd"),r(n)])]),e("p",null,[e("a",_,[i("cri-o.io"),r(n)])]),e("p",null,[e("a",b,[i("runc"),r(n)])]),e("p",null,[e("a",k,[i("katacontainer"),r(n)])]),e("p",null,[e("a",y,[i("gvisor"),r(n)])]),e("p",null,[e("a",C,[i("product"),r(n)])]),e("p",null,[e("a",x,[i("cci"),r(n)])])])])}const S=a(p,[["render",I],["__file","01_analysis_of_container.html.vue"]]);export{S as default};
