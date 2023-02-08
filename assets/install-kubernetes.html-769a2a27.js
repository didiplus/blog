import{ab as m,G as b,H as v,E as n,S as s,N as e,ac as a,L as k,ad as o,W as d}from"./framework-b31a425c.js";const h={},g=n("h1",{id:"安装kubernetes高可用",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装kubernetes高可用","aria-hidden":"true"},"#"),s(" 安装Kubernetes高可用")],-1),f={class:"hint-container tip"},y=n("p",{class:"hint-container-title"},"提示",-1),x=o(`<h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h2><p>kubernetes 安装有多种选择，本文档描述的集群安装具备如下特点：</p><ul><li>Kubernetes 1.16.2 <ul><li>calico 3.9</li><li>nginx-ingress 1.5.3</li></ul></li><li>Docker 18.09.7</li><li>三个 master 组成主节点集群，通过内网 loader balancer 实现负载均衡；至少需要三个 master 节点才可组成高可用集群，否则会出现 <em><strong>脑裂</strong></em> 现象</li><li>多个 worker 组成工作节点集群，通过外网 loader balancer 实现负载均衡</li></ul><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kubernetes.png" alt="Kubernetes安装：拓扑结构" tabindex="0" loading="lazy"><figcaption>Kubernetes安装：拓扑结构</figcaption></figure><h2 id="检查-centos-hostname" tabindex="-1"><a class="header-anchor" href="#检查-centos-hostname" aria-hidden="true">#</a> 检查 centos / hostname</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 在 master 节点和 worker 节点都要执行</span>
<span class="token function">cat</span> /etc/redhat-release

<span class="token comment"># 此处 hostname 的输出将会是该机器在 Kubernetes 集群中的节点名字</span>
<span class="token function">hostname</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>操作系统兼容性</strong></p><table><thead><tr><th>CentOS 版本</th><th>本文档是否兼容</th><th>备注</th></tr></thead><tbody><tr><td>7.7</td><td><span style="font-size:24px;">😄</span></td><td>已验证</td></tr><tr><td>7.6</td><td><span style="font-size:24px;">😄</span></td><td>已验证</td></tr><tr><td>7.5</td><td><span style="font-size:24px;">😞</span></td><td>已证实会出现 kubelet 无法启动的问题</td></tr><tr><td>7.4</td><td><span style="font-size:24px;">😞</span></td><td>同上</td></tr><tr><td>7.3</td><td><span style="font-size:24px;">😞</span></td><td>同上</td></tr><tr><td>7.2</td><td><span style="font-size:24px;">😞</span></td><td>同上</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">修改 hostname</p><p>如果您需要修改 hostname，可执行如下指令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 修改 hostname</span>
hostnamectl set-hostname your-new-host-name
<span class="token comment"># 查看修改结果</span>
hostnamectl status
<span class="token comment"># 设置 hostname 解析</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;127.0.0.1   <span class="token variable"><span class="token variable">$(</span><span class="token function">hostname</span><span class="token variable">)</span></span>&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h2 id="检查网络" tabindex="-1"><a class="header-anchor" href="#检查网络" aria-hidden="true">#</a> 检查网络</h2><p>在所有节点执行命令</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[root@demo-master-a-1 ~]$ ip route show
default via 172.21.0.1 dev eth0 
169.254.0.0/16 dev eth0 scope link metric 1002 
172.21.0.0/20 dev eth0 proto kernel scope link src 172.21.0.12 

[root@demo-master-a-1 ~]$ ip address
1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:12:a4:1b brd ff:ff:ff:ff:ff:ff
    inet 172.17.216.80/20 brd 172.17.223.255 scope global dynamic eth0
       valid_lft 305741654sec preferred_lft 305741654sec
</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><div class="highlight-line"> </div><br><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),R={class:"hint-container tip"},_=n("p",{class:"hint-container-title"},"kubelet使用的IP地址",-1),U=n("code",null,"ip route show",-1),V=n("code",null,"eth0",-1),N=n("li",null,[n("code",null,"ip address"),s(" 命令中，可显示默认网卡的 IP 地址，Kubernetes 将使用此 IP 地址与集群内的其他节点通信，如 "),n("code",null,"172.17.216.80")],-1),E=n("li",null,"所有节点上 Kubernetes 所使用的 IP 地址必须可以互通（无需 NAT 映射、无安全组或防火墙隔离）",-1),T=n("h2",{id:"安装-docker-kubelet",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装-docker-kubelet","aria-hidden":"true"},"#"),s(" 安装 docker / kubelet")],-1),S=o('<h2 id="初始化api-server" tabindex="-1"><a class="header-anchor" href="#初始化api-server" aria-hidden="true">#</a> 初始化API Server</h2><h3 id="创建-apiserver-的-load-balancer-私网" tabindex="-1"><a class="header-anchor" href="#创建-apiserver-的-load-balancer-私网" aria-hidden="true">#</a> 创建 ApiServer 的 Load Balancer（私网）</h3><p>监听端口：6443 / TCP</p><p>后端资源组：包含 demo-master-a-1, demo-master-a-2, demo-master-a-3</p><p>后端端口：6443</p><p>开启 按源地址保持会话</p><p>假设完成创建以后，Load Balancer的 ip 地址为 x.x.x.x</p><blockquote><p>根据每个人实际的情况不同，实现 LoadBalancer 的方式不一样，本文不详细阐述如何搭建 LoadBalancer，请读者自行解决，可以考虑的选择有：</p><ul><li>nginx</li><li>haproxy</li><li>keepalived</li><li>云供应商提供的负载均衡产品</li></ul></blockquote><h3 id="初始化第一个master节点" tabindex="-1"><a class="header-anchor" href="#初始化第一个master节点" aria-hidden="true">#</a> 初始化第一个master节点</h3><div class="hint-container tip"><p class="hint-container-title">提示</p><ul><li>以 root 身份在 demo-master-a-1 机器上执行</li><li>初始化 master 节点时，如果因为中间某些步骤的配置出错，想要重新初始化 master 节点，请先执行 <code>kubeadm reset</code> 操作</li></ul></div><div class="hint-container danger"><p class="hint-container-title">关于初始化时用到的环境变量</p><ul><li><strong>APISERVER_NAME</strong> 不能是 master 的 hostname</li><li><strong>APISERVER_NAME</strong> 必须全为小写字母、数字、小数点，不能包含减号</li><li><strong>POD_SUBNET</strong> 所使用的网段不能与 <em><strong>master节点/worker节点</strong></em> 所在的网段重叠。该字段的取值为一个 <a href="/glossary/cidr.html" target="_blank">CIDR</a> 值，如果您对 CIDR 这个概念还不熟悉，请不要修改这个字段的取值 10.100.0.1/16</li></ul></div>',11),F=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token comment"},"#在第一个 master 节点 demo-master-a-1 上执行"),s(`
`),n("span",{class:"token comment"},"# 只在第一个 master 节点执行"),s(`
`),n("span",{class:"token comment"},"# 替换 apiserver.demo 为 您想要的 dnsName"),s(`
`),n("span",{class:"token builtin class-name"},"export"),s(),n("span",{class:"token assign-left variable"},"APISERVER_NAME"),n("span",{class:"token operator"},"="),s(`apiserver.demo
`),n("span",{class:"token comment"},"# Kubernetes 容器组所在的网段，该网段安装完成后，由 kubernetes 创建，事先并不存在于您的物理网络中"),s(`
`),n("span",{class:"token builtin class-name"},"export"),s(),n("span",{class:"token assign-left variable"},"POD_SUBNET"),n("span",{class:"token operator"},"="),n("span",{class:"token number"},"10.100"),s(`.0.1/16
`),n("span",{class:"token builtin class-name"},"echo"),s(),n("span",{class:"token string"},[s('"127.0.0.1    '),n("span",{class:"token variable"},"${APISERVER_NAME}"),s('"')]),s(),n("span",{class:"token operator"},">>"),s(` /etc/hosts
`),n("span",{class:"token function"},"curl"),s(),n("span",{class:"token parameter variable"},"-sSL"),s(" https://kuboard.cn/install-script/v1.16.2/init_master.sh "),n("span",{class:"token operator"},"|"),s(),n("span",{class:"token function"},"sh"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),Z=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token comment"},"# 只在第一个 master 节点执行"),s(`
`),n("span",{class:"token comment"},"# 替换 apiserver.demo 为 您想要的 dnsName"),s(`
`),n("span",{class:"token builtin class-name"},"export"),s(),n("span",{class:"token assign-left variable"},"APISERVER_NAME"),n("span",{class:"token operator"},"="),s(`apiserver.demo
`),n("span",{class:"token comment"},"# Kubernetes 容器组所在的网段，该网段安装完成后，由 kubernetes 创建，事先并不存在于您的物理网络中"),s(`
`),n("span",{class:"token builtin class-name"},"export"),s(),n("span",{class:"token assign-left variable"},"POD_SUBNET"),n("span",{class:"token operator"},"="),n("span",{class:"token number"},"10.100"),s(`.0.1/16
`),n("span",{class:"token builtin class-name"},"echo"),s(),n("span",{class:"token string"},[s('"127.0.0.1    '),n("span",{class:"token variable"},"${APISERVER_NAME}"),s('"')]),s(),n("span",{class:"token operator"},">>"),s(` /etc/hosts
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),w=o(`<p><em><strong>执行结果</strong></em></p><p>执行结果中：</p><ul><li>第15、16、17行，用于初始化第二、三个 master 节点</li><li>第25、26行，用于初始化 worker 节点</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>Your Kubernetes control-plane has initialized successfully<span class="token operator">!</span>

To start using your cluster, you need to run the following as a regular user:

  <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube
  <span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config
  <span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config

You should now deploy a pod network to the cluster.
Run <span class="token string">&quot;kubectl apply -f [podnetwork].yaml&quot;</span> with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now <span class="token function">join</span> any number of the control-plane <span class="token function">node</span> running the following <span class="token builtin class-name">command</span> on each as root:

  kubeadm <span class="token function">join</span> apiserver.k8s:6443 <span class="token parameter variable">--token</span> 4z3r2v.2p43g28ons3b475v <span class="token punctuation">\\</span>
    --discovery-token-ca-cert-hash sha256:959569cbaaf0cf3fad744f8bd8b798ea9e11eb1e568c15825355879cf4cdc5d6 <span class="token punctuation">\\</span>
    --control-plane --certificate-key 41a741533a038a936759aff43b5680f0e8c41375614a873ea49fde8944614dd6

Please note that the certificate-key gives access to cluster sensitive data, keep it secret<span class="token operator">!</span>
As a safeguard, uploaded-certs will be deleted <span class="token keyword">in</span> two hours<span class="token punctuation">;</span> If necessary, you can use 
<span class="token string">&quot;kubeadm init phase upload-certs --upload-certs&quot;</span> to reload certs afterward.

Then you can <span class="token function">join</span> any number of worker nodes by running the following on each as root:

kubeadm <span class="token function">join</span> apiserver.k8s:6443 <span class="token parameter variable">--token</span> 4z3r2v.2p43g28ons3b475v <span class="token punctuation">\\</span>
    --discovery-token-ca-cert-hash sha256:959569cbaaf0cf3fad744f8bd8b798ea9e11eb1e568c15825355879cf4cdc5d6 

</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>检查 master 初始化结果</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 只在第一个 master 节点执行</span>

<span class="token comment"># 执行如下命令，等待 3-10 分钟，直到所有的容器组处于 Running 状态</span>
<span class="token function">watch</span> kubectl get pod <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">-o</span> wide

<span class="token comment"># 查看 master 节点初始化结果</span>
kubectl get nodes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container danger"><p class="hint-container-title">警告</p><p>请等到所有容器组（大约9个）全部处于 Running 状态，才进行下一步</p></div><h3 id="初始化第二、三个master节点" tabindex="-1"><a class="header-anchor" href="#初始化第二、三个master节点" aria-hidden="true">#</a> 初始化第二、三个master节点</h3><p><strong>获得 master 节点的 join 命令</strong></p><blockquote><p>可以和第一个Master节点一起初始化第二、三个Master节点，也可以从单Master节点调整过来，只需要</p><ul><li>增加Master的 LoadBalancer</li><li>将所有节点的 /etc/hosts 文件中 apiserver.demo 解析为 LoadBalancer 的地址</li><li>添加第二、三个Master节点</li><li>初始化 master 节点的 token 有效时间为 2 小时</li></ul></blockquote>`,10),W=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[s("  kubeadm "),n("span",{class:"token function"},"join"),s(" apiserver.k8s:6443 "),n("span",{class:"token parameter variable"},"--token"),s(" 4z3r2v.2p43g28ons3b475v "),n("span",{class:"token punctuation"},"\\"),s(`
    --discovery-token-ca-cert-hash sha256:959569cbaaf0cf3fad744f8bd8b798ea9e11eb1e568c15825355879cf4cdc5d6 `),n("span",{class:"token punctuation"},"\\"),s(`
    --control-plane --certificate-key 41a741533a038a936759aff43b5680f0e8c41375614a873ea49fde8944614dd6
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),M=n("p",null,[n("strong",null,"获得 certificate key")],-1),z=n("p",null,"在 demo-master-a-1 上执行",-1),Q=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token comment"},"# 只在 第一个 master 节点 demo-master-a-1 上执行"),s(`
kubeadm init phase upload-certs --upload-certs
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),j=n("p",null,"输出结果如下：",-1),C=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token punctuation"},"["),s("root@demo-master-a-1 ~"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token comment"},"# kubeadm init phase upload-certs --upload-certs"),s(`
W0902 09:05:28.355623    `),n("span",{class:"token number"},"1046"),s(" version.go:98"),n("span",{class:"token punctuation"},"]"),s(" could not fetch a Kubernetes version from the internet: unable to get URL "),n("span",{class:"token string"},'"https://dl.k8s.io/release/stable-1.txt"'),n("span",{class:"token builtin class-name"},":"),s(" Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled "),n("span",{class:"token keyword"},"while"),s(" waiting "),n("span",{class:"token keyword"},"for"),s(" connection "),n("span",{class:"token punctuation"},"("),s("Client.Timeout exceeded "),n("span",{class:"token keyword"},"while"),s(" awaiting headers"),n("span",{class:"token punctuation"},")"),s(`
W0902 09:05:28.355718    `),n("span",{class:"token number"},"1046"),s(" version.go:99"),n("span",{class:"token punctuation"},"]"),s(" falling back to the "),n("span",{class:"token builtin class-name"},"local"),s(` client version: v1.16.2
`),n("span",{class:"token punctuation"},"["),s("upload-certs"),n("span",{class:"token punctuation"},"]"),s(" Storing the certificates "),n("span",{class:"token keyword"},"in"),s(" Secret "),n("span",{class:"token string"},'"kubeadm-certs"'),s(),n("span",{class:"token keyword"},"in"),s(" the "),n("span",{class:"token string"},'"kube-system"'),s(` Namespace
`),n("span",{class:"token punctuation"},"["),s("upload-certs"),n("span",{class:"token punctuation"},"]"),s(` Using certificate key:
70eb87e62f052d2d5de759969d5b42f372d0ad798f98df38f7fe73efdf63a13c
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("br"),n("br"),n("br"),n("br"),n("div",{class:"highlight-line"}," ")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),I=n("p",null,[n("strong",null,"获得 join 命令")],-1),Y=n("p",null,"在 demo-master-a-1 上执行",-1),q=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token comment"},"# 只在 第一个 master 节点 demo-master-a-1 上执行"),s(`
kubeadm token create --print-join-command
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),B=n("p",null,"输出结果如下：",-1),P=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token punctuation"},"["),s("root@demo-master-a-1 ~"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token comment"},"# kubeadm token create --print-join-command"),s(`
kubeadm `),n("span",{class:"token function"},"join"),s(" apiserver.demo:6443 "),n("span",{class:"token parameter variable"},"--token"),s(` bl80xo.hfewon9l5jlpmjft     --discovery-token-ca-cert-hash sha256:b4d2bed371fe4603b83e7504051dcfcdebcbdcacd8be27884223c4ccc13059a4 
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("div",{class:"highlight-line"}," ")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),A=n("p",null,"则，第二、三个 master 节点的 join 命令如下：",-1),J=n("ul",null,[n("li",null,"命令行中，蓝色部分来自于前面获得的 join 命令，红色部分来自于前面获得的 certificate key")],-1),G={style:{"background-color":"#ddd",padding:"20px","line-height":"20px"}},D=n("br",null,null,-1),K=n("br",null,null,-1),O=o(`<p><strong>初始化第二、三个 master 节点</strong></p><p>在 demo-master-b-1 和 demo-master-b-2 机器上执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 只在第二、三个 master 节点 demo-master-b-1 和 demo-master-b-2 执行</span>
<span class="token comment"># 替换 x.x.x.x 为 ApiServer LoadBalancer 的 IP 地址</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">APISERVER_IP</span><span class="token operator">=</span>x.x.x.x
<span class="token comment"># 替换 apiserver.demo 为 前面已经使用的 dnsName</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">APISERVER_NAME</span><span class="token operator">=</span>apiserver.demo
<span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${APISERVER_IP}</span>    <span class="token variable">\${APISERVER_NAME}</span>&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts
<span class="token comment"># 使用前面步骤中获得的第二、三个 master 节点的 join 命令</span>
kubeadm <span class="token function">join</span> apiserver.demo:6443 <span class="token parameter variable">--token</span> ejwx62.vqwog6il5p83uk7y <span class="token punctuation">\\</span>
--discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303 <span class="token punctuation">\\</span>
--control-plane --certificate-key 70eb87e62f052d2d5de759969d5b42f372d0ad798f98df38f7fe73efdf63a13c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">常见问题</p><p>如果一直停留在 pre-flight 状态，请在第二、三个节点上执行命令检查：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-ik</span> https://apiserver.demo:6443/version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>输出结果应该如下所示</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HTTP/1.1 200 OK
Cache-Control: no-cache, private
Content-Type: application/json
Date: Wed, 30 Oct 2019 08:13:39 GMT
Content-Length: 263

{
  &quot;major&quot;: &quot;1&quot;,
  &quot;minor&quot;: &quot;16&quot;,
  &quot;gitVersion&quot;: &quot;v1.16.2&quot;,
  &quot;gitCommit&quot;: &quot;2bd9643cee5b3b3a5ecbd3af49d09018f0773c77&quot;,
  &quot;gitTreeState&quot;: &quot;clean&quot;,
  &quot;buildDate&quot;: &quot;2019-09-18T14:27:17Z&quot;,
  &quot;goVersion&quot;: &quot;go1.12.9&quot;,
  &quot;compiler&quot;: &quot;gc&quot;,
  &quot;platform&quot;: &quot;linux/amd64&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>否则，请您检查一下您的 Loadbalancer 是否设置正确</p></div><p><strong>检查 master 初始化结果</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 只在第一个 master 节点 demo-master-a-1 执行</span>
<span class="token comment"># 查看 master 节点初始化结果</span>
kubectl get nodes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),L=n("h2",{id:"初始化-worker节点",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#初始化-worker节点","aria-hidden":"true"},"#"),s(" 初始化 worker节点")],-1),H=n("h3",{id:"获得-join命令参数",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#获得-join命令参数","aria-hidden":"true"},"#"),s(" 获得 join命令参数")],-1),X=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[s("  kubeadm "),n("span",{class:"token function"},"join"),s(" apiserver.k8s:6443 "),n("span",{class:"token parameter variable"},"--token"),s(" 4z3r2v.2p43g28ons3b475v "),n("span",{class:"token punctuation"},"\\"),s(`
    --discovery-token-ca-cert-hash sha256:959569cbaaf0cf3fad744f8bd8b798ea9e11eb1e568c15825355879cf4cdc5d6
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),$=n("p",null,[n("strong",null,"在第一个 master 节点 demo-master-a-1 节点执行")],-1),nn=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token comment"},"# 只在第一个 master 节点 demo-master-a-1 上执行"),s(`
kubeadm token create --print-join-command
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),sn=n("p",null,"可获取kubeadm join 命令及参数，如下所示",-1),en=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[s("kubeadm "),n("span",{class:"token function"},"join"),s(" apiserver.demo:6443 "),n("span",{class:"token parameter variable"},"--token"),s(` mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),an=n("p",null,null,-1),tn=o(`<div class="hint-container tip"><p class="hint-container-title">有效时间</p><p>该 token 的有效时间为 2 个小时，2小时内，您可以使用此 token 初始化任意数量的 worker 节点。</p></div><h3 id="初始化worker" tabindex="-1"><a class="header-anchor" href="#初始化worker" aria-hidden="true">#</a> 初始化worker</h3><p><strong>针对所有的 worker 节点执行</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 只在 worker 节点执行</span>
<span class="token comment"># 替换 x.x.x.x 为 ApiServer LoadBalancer 的 IP 地址</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">MASTER_IP</span><span class="token operator">=</span>x.x.x.x
<span class="token comment"># 替换 apiserver.demo 为初始化 master 节点时所使用的 APISERVER_NAME</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">APISERVER_NAME</span><span class="token operator">=</span>apiserver.demo
<span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${MASTER_IP}</span>    <span class="token variable">\${APISERVER_NAME}</span>&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts

<span class="token comment"># 替换为前面 kubeadm token create --print-join-command 的输出结果</span>
kubeadm <span class="token function">join</span> apiserver.demo:6443 <span class="token parameter variable">--token</span> mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="检查-worker-初始化结果" tabindex="-1"><a class="header-anchor" href="#检查-worker-初始化结果" aria-hidden="true">#</a> 检查 worker 初始化结果</h3><p>在第一个master节点 demo-master-a-1 上执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 只在第一个 master 节点 demo-master-a-1 上执行</span>
kubectl get nodes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="移除-worker-节点" tabindex="-1"><a class="header-anchor" href="#移除-worker-节点" aria-hidden="true">#</a> 移除 worker 节点</h2><div class="hint-container warning"><p class="hint-container-title">注意</p><p>正常情况下，您无需移除 worker 节点</p></div><p>在准备移除的 worker 节点上执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubeadm reset
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在第一个 master 节点 demo-master-a-1 上执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl delete <span class="token function">node</span> demo-worker-x-x
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><ul><li>将 demo-worker-x-x 替换为要移除的 worker 节点的名字</li><li>worker 节点的名字可以通过在第一个 master 节点 demo-master-a-1 上执行 kubectl get nodes 命令获得</li></ul></blockquote><h2 id="安装-ingress-controller" tabindex="-1"><a class="header-anchor" href="#安装-ingress-controller" aria-hidden="true">#</a> 安装 Ingress Controller</h2>`,15),ln={href:"https://github.com/nginxinc/kubernetes-ingress",target:"_blank",rel:"noopener noreferrer"},cn={class:"hint-container info"},on=n("p",{class:"hint-container-title"},"参考文档",-1),rn={href:"https://kubernetes.io/docs/concepts/services-networking/ingress/",target:"_blank",rel:"noopener noreferrer"},un={href:"https://kubernetes.io/docs/concepts/services-networking/ingress/",target:"_blank",rel:"noopener noreferrer"},dn={href:"https://github.com/nginxinc/kubernetes-ingress",target:"_blank",rel:"noopener noreferrer"},pn=n("p",null,[n("strong",null,"在 master 节点上执行")],-1),kn=n("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[n("pre",{class:"language-bash"},[n("code",null,[n("span",{class:"token comment"},"# 只在第一个 master 节点 demo-master-a-1 上执行"),s(`
kubectl apply `),n("span",{class:"token parameter variable"},"-f"),s(` https://kuboard.cn/install-script/v1.16.2/nginx-ingress.yaml
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),mn=n("div",{class:"language-yaml line-numbers-mode","data-ext":"yml"},[n("pre",{class:"language-yaml"},[n("code",null,[n("span",{class:"token comment"},"# 如果打算用于生产环境，请参考 https://github.com/nginxinc/kubernetes-ingress/blob/v1.5.5/docs/installation.md 并根据您自己的情况做进一步定制"),s(`

`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` v1
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` Namespace
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress

`),n("span",{class:"token punctuation"},"---"),s(`
`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` v1
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` ServiceAccount
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress 
  `),n("span",{class:"token key atrule"},"namespace"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress

`),n("span",{class:"token punctuation"},"---"),s(`
`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` v1
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` Secret
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" default"),n("span",{class:"token punctuation"},"-"),s("server"),n("span",{class:"token punctuation"},"-"),s(`secret
  `),n("span",{class:"token key atrule"},"namespace"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
`),n("span",{class:"token key atrule"},"type"),n("span",{class:"token punctuation"},":"),s(` Opaque
`),n("span",{class:"token key atrule"},"data"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"tls.crt"),n("span",{class:"token punctuation"},":"),s(` LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN2akNDQWFZQ0NRREFPRjl0THNhWFhEQU5CZ2txaGtpRzl3MEJBUXNGQURBaE1SOHdIUVlEVlFRRERCWk8KUjBsT1dFbHVaM0psYzNORGIyNTBjbTlzYkdWeU1CNFhEVEU0TURreE1qRTRNRE16TlZvWERUSXpNRGt4TVRFNApNRE16TlZvd0lURWZNQjBHQTFVRUF3d1dUa2RKVGxoSmJtZHlaWE56UTI5dWRISnZiR3hsY2pDQ0FTSXdEUVlKCktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUwvN2hIUEtFWGRMdjNyaUM3QlBrMTNpWkt5eTlyQ08KR2xZUXYyK2EzUDF0azIrS3YwVGF5aGRCbDRrcnNUcTZzZm8vWUk1Y2Vhbkw4WGM3U1pyQkVRYm9EN2REbWs1Qgo4eDZLS2xHWU5IWlg0Rm5UZ0VPaStlM2ptTFFxRlBSY1kzVnNPazFFeUZBL0JnWlJVbkNHZUtGeERSN0tQdGhyCmtqSXVuektURXUyaDU4Tlp0S21ScUJHdDEwcTNRYzhZT3ExM2FnbmovUWRjc0ZYYTJnMjB1K1lYZDdoZ3krZksKWk4vVUkxQUQ0YzZyM1lma1ZWUmVHd1lxQVp1WXN2V0RKbW1GNWRwdEMzN011cDBPRUxVTExSakZJOTZXNXIwSAo1TmdPc25NWFJNV1hYVlpiNWRxT3R0SmRtS3FhZ25TZ1JQQVpQN2MwQjFQU2FqYzZjNGZRVXpNQ0F3RUFBVEFOCkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQWpLb2tRdGRPcEsrTzhibWVPc3lySmdJSXJycVFVY2ZOUitjb0hZVUoKdGhrYnhITFMzR3VBTWI5dm15VExPY2xxeC9aYzJPblEwMEJCLzlTb0swcitFZ1U2UlVrRWtWcitTTFA3NTdUWgozZWI4dmdPdEduMS9ienM3bzNBaS9kclkrcUI5Q2k1S3lPc3FHTG1US2xFaUtOYkcyR1ZyTWxjS0ZYQU80YTY3Cklnc1hzYktNbTQwV1U3cG9mcGltU1ZmaXFSdkV5YmN3N0NYODF6cFErUyt1eHRYK2VBZ3V0NHh3VlI5d2IyVXYKelhuZk9HbWhWNThDd1dIQnNKa0kxNXhaa2VUWXdSN0diaEFMSkZUUkk3dkhvQXprTWIzbjAxQjQyWjNrN3RXNQpJUDFmTlpIOFUvOWxiUHNoT21FRFZkdjF5ZytVRVJxbStGSis2R0oxeFJGcGZnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
  `),n("span",{class:"token key atrule"},"tls.key"),n("span",{class:"token punctuation"},":"),s(` LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBdi91RWM4b1JkMHUvZXVJTHNFK1RYZUprckxMMnNJNGFWaEMvYjVyYy9XMlRiNHEvClJOcktGMEdYaVN1eE9ycXgrajlnamx4NXFjdnhkenRKbXNFUkJ1Z1B0ME9hVGtIekhvb3FVWmcwZGxmZ1dkT0EKUTZMNTdlT1l0Q29VOUZ4amRXdzZUVVRJVUQ4R0JsRlNjSVo0b1hFTkhzbysyR3VTTWk2Zk1wTVM3YUhudzFtMApxWkdvRWEzWFNyZEJ6eGc2clhkcUNlUDlCMXl3VmRyYURiUzc1aGQzdUdETDU4cGszOVFqVUFQaHpxdmRoK1JWClZGNGJCaW9CbTVpeTlZTW1hWVhsMm0wTGZzeTZuUTRRdFFzdEdNVWozcGJtdlFmazJBNnljeGRFeFpkZFZsdmwKMm82MjBsMllxcHFDZEtCRThCay90elFIVTlKcU56cHpoOUJUTXdJREFRQUJBb0lCQVFDZklHbXowOHhRVmorNwpLZnZJUXQwQ0YzR2MxNld6eDhVNml4MHg4Mm15d1kxUUNlL3BzWE9LZlRxT1h1SENyUlp5TnUvZ2IvUUQ4bUFOCmxOMjRZTWl0TWRJODg5TEZoTkp3QU5OODJDeTczckM5bzVvUDlkazAvYzRIbjAzSkVYNzZ5QjgzQm9rR1FvYksKMjhMNk0rdHUzUmFqNjd6Vmc2d2szaEhrU0pXSzBwV1YrSjdrUkRWYmhDYUZhNk5nMUZNRWxhTlozVDhhUUtyQgpDUDNDeEFTdjYxWTk5TEI4KzNXWVFIK3NYaTVGM01pYVNBZ1BkQUk3WEh1dXFET1lvMU5PL0JoSGt1aVg2QnRtCnorNTZud2pZMy8yUytSRmNBc3JMTnIwMDJZZi9oY0IraVlDNzVWYmcydVd6WTY3TWdOTGQ5VW9RU3BDRkYrVm4KM0cyUnhybnhBb0dCQU40U3M0ZVlPU2huMVpQQjdhTUZsY0k2RHR2S2ErTGZTTXFyY2pOZjJlSEpZNnhubmxKdgpGenpGL2RiVWVTbWxSekR0WkdlcXZXaHFISy9iTjIyeWJhOU1WMDlRQ0JFTk5jNmtWajJTVHpUWkJVbEx4QzYrCk93Z0wyZHhKendWelU0VC84ajdHalRUN05BZVpFS2FvRHFyRG5BYWkyaW5oZU1JVWZHRXFGKzJyQW9HQkFOMVAKK0tZL0lsS3RWRzRKSklQNzBjUis3RmpyeXJpY05iWCtQVzUvOXFHaWxnY2grZ3l4b25BWlBpd2NpeDN3QVpGdwpaZC96ZFB2aTBkWEppc1BSZjRMazg5b2pCUmpiRmRmc2l5UmJYbyt3TFU4NUhRU2NGMnN5aUFPaTVBRHdVU0FkCm45YWFweUNweEFkREtERHdObit3ZFhtaTZ0OHRpSFRkK3RoVDhkaVpBb0dCQUt6Wis1bG9OOTBtYlF4VVh5YUwKMjFSUm9tMGJjcndsTmVCaWNFSmlzaEhYa2xpSVVxZ3hSZklNM2hhUVRUcklKZENFaHFsV01aV0xPb2I2NTNyZgo3aFlMSXM1ZUtka3o0aFRVdnpldm9TMHVXcm9CV2xOVHlGanIrSWhKZnZUc0hpOGdsU3FkbXgySkJhZUFVWUNXCndNdlQ4NmNLclNyNkQrZG8wS05FZzFsL0FvR0FlMkFVdHVFbFNqLzBmRzgrV3hHc1RFV1JqclRNUzRSUjhRWXQKeXdjdFA4aDZxTGxKUTRCWGxQU05rMXZLTmtOUkxIb2pZT2pCQTViYjhibXNVU1BlV09NNENoaFJ4QnlHbmR2eAphYkJDRkFwY0IvbEg4d1R0alVZYlN5T294ZGt5OEp0ek90ajJhS0FiZHd6NlArWDZDODhjZmxYVFo5MWpYL3RMCjF3TmRKS2tDZ1lCbyt0UzB5TzJ2SWFmK2UwSkN5TGhzVDQ5cTN3Zis2QWVqWGx2WDJ1VnRYejN5QTZnbXo5aCsKcDNlK2JMRUxwb3B0WFhNdUFRR0xhUkcrYlNNcjR5dERYbE5ZSndUeThXczNKY3dlSTdqZVp2b0ZpbmNvVlVIMwphdmxoTUVCRGYxSjltSDB5cDBwWUNaS2ROdHNvZEZtQktzVEtQMjJhTmtsVVhCS3gyZzR6cFE9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=

`),n("span",{class:"token punctuation"},"---"),s(`
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` ConfigMap
`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` v1
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`config
  `),n("span",{class:"token key atrule"},"namespace"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
`),n("span",{class:"token key atrule"},"data"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"server-names-hash-bucket-size"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token string"},'"1024"'),s(`


`),n("span",{class:"token punctuation"},"---"),s(`
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` ClusterRole
`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` rbac.authorization.k8s.io/v1beta1
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
`),n("span",{class:"token key atrule"},"rules"),n("span",{class:"token punctuation"},":"),s(`
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token string"},'""'),s(`
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` services
  `),n("span",{class:"token punctuation"},"-"),s(` endpoints
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` get
  `),n("span",{class:"token punctuation"},"-"),s(` list
  `),n("span",{class:"token punctuation"},"-"),s(` watch
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token string"},'""'),s(`
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` secrets
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` get
  `),n("span",{class:"token punctuation"},"-"),s(` list
  `),n("span",{class:"token punctuation"},"-"),s(` watch
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token string"},'""'),s(`
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` configmaps
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` get
  `),n("span",{class:"token punctuation"},"-"),s(` list
  `),n("span",{class:"token punctuation"},"-"),s(` watch
  `),n("span",{class:"token punctuation"},"-"),s(` update
  `),n("span",{class:"token punctuation"},"-"),s(` create
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token string"},'""'),s(`
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` pods
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` list
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token string"},'""'),s(`
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` events
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` create
  `),n("span",{class:"token punctuation"},"-"),s(` patch
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` extensions
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` ingresses
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` list
  `),n("span",{class:"token punctuation"},"-"),s(` watch
  `),n("span",{class:"token punctuation"},"-"),s(` get
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token string"},'"extensions"'),s(`
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` ingresses/status
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` update
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"apiGroups"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` k8s.nginx.org
  `),n("span",{class:"token key atrule"},"resources"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` virtualservers
  `),n("span",{class:"token punctuation"},"-"),s(` virtualserverroutes
  `),n("span",{class:"token key atrule"},"verbs"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token punctuation"},"-"),s(` list
  `),n("span",{class:"token punctuation"},"-"),s(` watch
  `),n("span",{class:"token punctuation"},"-"),s(` get

`),n("span",{class:"token punctuation"},"---"),s(`
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` ClusterRoleBinding
`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` rbac.authorization.k8s.io/v1beta1
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
`),n("span",{class:"token key atrule"},"subjects"),n("span",{class:"token punctuation"},":"),s(`
`),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` ServiceAccount
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
  `),n("span",{class:"token key atrule"},"namespace"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
`),n("span",{class:"token key atrule"},"roleRef"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` ClusterRole
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
  `),n("span",{class:"token key atrule"},"apiGroup"),n("span",{class:"token punctuation"},":"),s(` rbac.authorization.k8s.io

`),n("span",{class:"token punctuation"},"---"),s(`
`),n("span",{class:"token key atrule"},"apiVersion"),n("span",{class:"token punctuation"},":"),s(` apps/v1
`),n("span",{class:"token key atrule"},"kind"),n("span",{class:"token punctuation"},":"),s(` DaemonSet
`),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
  `),n("span",{class:"token key atrule"},"namespace"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
  `),n("span",{class:"token key atrule"},"annotations"),n("span",{class:"token punctuation"},":"),s(`
    `),n("span",{class:"token key atrule"},"prometheus.io/scrape"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token string"},'"true"'),s(`
    `),n("span",{class:"token key atrule"},"prometheus.io/port"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token string"},'"9113"'),s(`
`),n("span",{class:"token key atrule"},"spec"),n("span",{class:"token punctuation"},":"),s(`
  `),n("span",{class:"token key atrule"},"selector"),n("span",{class:"token punctuation"},":"),s(`
    `),n("span",{class:"token key atrule"},"matchLabels"),n("span",{class:"token punctuation"},":"),s(`
      `),n("span",{class:"token key atrule"},"app"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
  `),n("span",{class:"token key atrule"},"template"),n("span",{class:"token punctuation"},":"),s(`
    `),n("span",{class:"token key atrule"},"metadata"),n("span",{class:"token punctuation"},":"),s(`
      `),n("span",{class:"token key atrule"},"labels"),n("span",{class:"token punctuation"},":"),s(`
        `),n("span",{class:"token key atrule"},"app"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
    `),n("span",{class:"token key atrule"},"spec"),n("span",{class:"token punctuation"},":"),s(`
      `),n("span",{class:"token key atrule"},"serviceAccountName"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
      `),n("span",{class:"token key atrule"},"containers"),n("span",{class:"token punctuation"},":"),s(`
      `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"image"),n("span",{class:"token punctuation"},":"),s(" nginx/nginx"),n("span",{class:"token punctuation"},"-"),s("ingress"),n("span",{class:"token punctuation"},":"),s(`1.5.5
        `),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(" nginx"),n("span",{class:"token punctuation"},"-"),s(`ingress
        `),n("span",{class:"token key atrule"},"ports"),n("span",{class:"token punctuation"},":"),s(`
        `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(` http
          `),n("span",{class:"token key atrule"},"containerPort"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token number"},"80"),s(`
          `),n("span",{class:"token key atrule"},"hostPort"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token number"},"80"),s(`
        `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(` https
          `),n("span",{class:"token key atrule"},"containerPort"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token number"},"443"),s(`
          `),n("span",{class:"token key atrule"},"hostPort"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token number"},"443"),s(`
        `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(` prometheus
          `),n("span",{class:"token key atrule"},"containerPort"),n("span",{class:"token punctuation"},":"),s(),n("span",{class:"token number"},"9113"),s(`
        `),n("span",{class:"token key atrule"},"env"),n("span",{class:"token punctuation"},":"),s(`
        `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(` POD_NAMESPACE
          `),n("span",{class:"token key atrule"},"valueFrom"),n("span",{class:"token punctuation"},":"),s(`
            `),n("span",{class:"token key atrule"},"fieldRef"),n("span",{class:"token punctuation"},":"),s(`
              `),n("span",{class:"token key atrule"},"fieldPath"),n("span",{class:"token punctuation"},":"),s(` metadata.namespace
        `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token key atrule"},"name"),n("span",{class:"token punctuation"},":"),s(` POD_NAME
          `),n("span",{class:"token key atrule"},"valueFrom"),n("span",{class:"token punctuation"},":"),s(`
            `),n("span",{class:"token key atrule"},"fieldRef"),n("span",{class:"token punctuation"},":"),s(`
              `),n("span",{class:"token key atrule"},"fieldPath"),n("span",{class:"token punctuation"},":"),s(` metadata.name
        `),n("span",{class:"token key atrule"},"args"),n("span",{class:"token punctuation"},":"),s(`
          `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token punctuation"},"-"),s("nginx"),n("span",{class:"token punctuation"},"-"),s("configmaps=$(POD_NAMESPACE)/nginx"),n("span",{class:"token punctuation"},"-"),s(`config
          `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token punctuation"},"-"),s("default"),n("span",{class:"token punctuation"},"-"),s("server"),n("span",{class:"token punctuation"},"-"),s("tls"),n("span",{class:"token punctuation"},"-"),s("secret=$(POD_NAMESPACE)/default"),n("span",{class:"token punctuation"},"-"),s("server"),n("span",{class:"token punctuation"},"-"),s(`secret
         `),n("span",{class:"token comment"},"#- -v=3 # Enables extensive logging. Useful for troubleshooting."),s(`
         `),n("span",{class:"token comment"},"#- -report-ingress-status"),s(`
         `),n("span",{class:"token comment"},"#- -external-service=nginx-ingress"),s(`
         `),n("span",{class:"token comment"},"#- -enable-leader-election"),s(`
          `),n("span",{class:"token punctuation"},"-"),s(),n("span",{class:"token punctuation"},"-"),s("enable"),n("span",{class:"token punctuation"},"-"),s("prometheus"),n("span",{class:"token punctuation"},"-"),s(`metrics
         `),n("span",{class:"token comment"},"#- -enable-custom-resources"),s(`

`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),bn={class:"hint-container warning"},vn=n("p",{class:"hint-container-title"},"注意",-1),hn={href:"https://github.com/nginxinc/kubernetes-ingress/blob/v1.5.3/docs/installation.md",target:"_blank",rel:"noopener noreferrer"},gn=o('<h3 id="在-iaas-层完成如下配置-公网load-balancer" tabindex="-1"><a class="header-anchor" href="#在-iaas-层完成如下配置-公网load-balancer" aria-hidden="true">#</a> 在 IaaS 层完成如下配置（<strong>公网Load Balancer</strong>）</h3><p>创建负载均衡 Load Balancer：</p><ul><li>监听器 1：80 / TCP， SOURCE_ADDRESS 会话保持</li><li>服务器资源池 1： demo-worker-x-x 的所有节点的 80端口</li><li>监听器 2：443 / TCP， SOURCE_ADDRESS 会话保持</li><li>服务器资源池 2： demo-worker-x-x 的所有节点的443端口</li></ul><p>假设刚创建的负载均衡 Load Balancer 的 IP 地址为： z.z.z.z</p><h3 id="配置域名解析" tabindex="-1"><a class="header-anchor" href="#配置域名解析" aria-hidden="true">#</a> 配置域名解析</h3><p>将域名 *.demo.yourdomain.com 解析到地址负载均衡服务器 的 IP 地址 z.z.z.z</p><h3 id="验证配置" tabindex="-1"><a class="header-anchor" href="#验证配置" aria-hidden="true">#</a> 验证配置</h3>',7),fn={href:"http://a.demo.yourdomain.com",target:"_blank",rel:"noopener noreferrer"},yn=n("h2",{id:"下一步",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#下一步","aria-hidden":"true"},"#"),s(" 下一步")],-1),xn=n("p",null,"🎉 🎉 🎉",-1),Rn=n("p",null,"您已经完成了 Kubernetes 集群的安装，下一步请：",-1);function _n(Un,Vn){const p=d("RouterLink"),r=d("font"),u=d("Tabs"),c=d("ExternalLinkIcon");return b(),v("div",null,[g,n("div",f,[y,n("p",null,[s("推荐初学者按照 "),e(p,{to:"/cloud/k8s/install/install-k8s.html"},{default:a(()=>[s("安装Kubernetes 单Master节点")]),_:1}),s(" 文档进行 Kubernetes 集群搭建")])]),x,n("div",R,[_,n("ul",null,[n("li",null,[U,s(" 命令中，可以知道机器的默认网卡，通常是 "),V,s("，如 "),n("em",null,[n("strong",null,[s("default via 172.21.0.23 dev "),e(r,{color:"blue",weight:"500"},{default:a(()=>[s("eth0")]),_:1})])])]),N,E])]),T,k(` </div>

<div slot="step3"> `),S,e(u,{id:"261",data:[{title:"快速初始化"},{title:"手动初始化"}]},{tab0:a(({title:t,value:l,isActive:i})=>[F]),tab1:a(({title:t,value:l,isActive:i})=>[Z]),_:1}),w,e(u,{id:"330",data:[{title:"和第一个Master节点一起初始化"},{title:"第一个Master节点初始化2个小时后再初始化"}],active:0},{tab0:a(({title:t,value:l,isActive:i})=>[n("p",null,[s("初始化第一个 master 节点时的输出内容中，第15、16、17行就是用来初始化第二、三个 master 节点的命令，如下所示："),e(r,{color:"red"},{default:a(()=>[s("此时请不要执行该命令")]),_:1})]),W]),tab1:a(({title:t,value:l,isActive:i})=>[M,z,Q,j,C,I,Y,q,B,P,A,J,n("div",G,[e(r,{color:"blue"},{default:a(()=>[s("kubeadm join apiserver.demo:6443 --token ejwx62.vqwog6il5p83uk7y \\"),D,s(" --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303 ")]),_:1}),s("\\"),K,s(" --control-plane --certificate-key "),e(r,{color:"red"},{default:a(()=>[s("70eb87e62f052d2d5de759969d5b42f372d0ad798f98df38f7fe73efdf63a13c")]),_:1})])]),_:1}),O,k(` </div>

<div slot="step4"> `),L,H,e(u,{id:"404",data:[{title:"和第一个Master节点一起初始化"},{title:"第一个Master节点初始化2个小时后再初始化"}]},{tab0:a(({title:t,value:l,isActive:i})=>[n("p",null,[s("初始化第一个 master 节点时的输出内容中，第25、26行就是用来初始化 worker 节点的命令，如下所示："),e(r,{color:"red"},{default:a(()=>[s("此时请不要执行该命令")]),_:1})]),X]),tab1:a(({title:t,value:l,isActive:i})=>[$,nn,sn,en,an]),_:1}),tn,n("p",null,[s("kubernetes支持多种Ingress Controllers (traefic / Kong / Istio / Nginx 等)，本文推荐使用 "),n("a",ln,[s("https://github.com/nginxinc/kubernetes-ingress"),e(c)])]),n("div",cn,[on,n("p",null,[n("a",rn,[s("Ingress官方文档"),e(c)])]),n("p",null,[n("a",un,[s("Ingress Controllers介绍"),e(c)])]),n("p",null,[s("kubernetes支持多种Ingress Controllers (traefic / Kong / Istio / Nginx 等)，本文推荐使用 "),n("a",dn,[s("https://github.com/nginxinc/kubernetes-ingress"),e(c)])])]),e(u,{id:"491",data:[{title:"快速安装"},{title:"YAML文件"}],active:0},{tab0:a(({title:t,value:l,isActive:i})=>[pn,kn]),tab1:a(({title:t,value:l,isActive:i})=>[mn]),_:1}),n("div",bn,[vn,n("p",null,[s("如果您打算将 Kubernetes 用于生产环境，请参考此文档 "),n("a",hn,[s("Installing Ingress Controller"),e(c)]),s("，完善 Ingress 的配置")])]),gn,n("p",null,[s("在浏览器访问 "),n("a",fn,[s("a.demo.yourdomain.com"),e(c)]),s("，将得到 404 NotFound 错误页面")]),yn,xn,Rn,n("p",null,[e(p,{to:"/learning/"},{default:a(()=>[s("获取 Kubernetes 免费教程")]),_:1})])])}const En=m(h,[["render",_n],["__file","install-kubernetes.html.vue"]]);export{En as default};
