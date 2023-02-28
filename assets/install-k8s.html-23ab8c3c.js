import{ab as r,G as o,H as d,E as a,S as e,N as i,ac as l,ad as c,W as n}from"./framework-894cff3a.js";const p={},u=a("h1",{id:"使用-kuboardspray-安装kubernetes-v1-23-1",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#使用-kuboardspray-安装kubernetes-v1-23-1","aria-hidden":"true"},"#"),e(" 使用 KuboardSpray 安装kubernetes_v1.23.1")],-1),h=a("h2",{id:"kuboard-spray",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#kuboard-spray","aria-hidden":"true"},"#"),e(" Kuboard-Spray")],-1),b={href:"https://github.com/eip-work/kuboard-spray",target:"_blank",rel:"noopener noreferrer"},g=c(`<p><strong>安装后的集群版本为</strong></p><ul><li>Kubernetes v1.23.1</li></ul><h3 id="配置要求" tabindex="-1"><a class="header-anchor" href="#配置要求" aria-hidden="true">#</a> 配置要求</h3><p>对于 Kubernetes 初学者，在搭建K8S集群时，推荐在阿里云或腾讯云采购如下配置：（您也可以使用自己的虚拟机、私有云等您最容易获得的 Linux 环境）</p><ul><li>至少 2 台 <strong>2核4G</strong> 的服务器</li><li>本文档中，CPU 必须为 x86 架构，暂时未适配 arm 架构的 CPU</li><li><strong>CentOS 7.8</strong>、 <strong>CentOS 7.9</strong> 或 <strong>Ubuntu 20.04</strong></li></ul><p><strong>操作系统兼容性</strong></p><table><thead><tr><th>CentOS 版本</th><th>本文档是否兼容</th><th>备注</th></tr></thead><tbody><tr><td>CentOS 7.9</td><td><span style="font-size:24px;">😄</span></td><td>已验证</td></tr><tr><td>CentOS 7.8</td><td><span style="font-size:24px;">😄</span></td><td>已验证</td></tr><tr><td>Ubuntu 20.04</td><td><span style="font-size:24px;">😄</span></td><td>已验证</td></tr></tbody></table><h2 id="安装-kuboard-spray" tabindex="-1"><a class="header-anchor" href="#安装-kuboard-spray" aria-hidden="true">#</a> 安装 Kuboard-Spray</h2><ul><li><p>取一台服务器或虚拟机，执行一条命令，即可完成 Kuboard-Spray 的安装。</p><p>对这台服务器的最低要求为：</p><div style="font-size:13px;margin-left:40px;"><ul><li>1核2G</li><li>不少于 10G 磁盘空余空间</li><li>已经安装好 docker</li></ul></div><p>待执行的命令如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--privileged</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--restart</span><span class="token operator">=</span>unless-stopped <span class="token punctuation">\\</span>
  <span class="token parameter variable">--name</span><span class="token operator">=</span>kuboard-spray <span class="token punctuation">\\</span>
  <span class="token parameter variable">-p</span> <span class="token number">80</span>:80/tcp <span class="token punctuation">\\</span>
  <span class="token parameter variable">-v</span> /var/run/docker.sock:/var/run/docker.sock <span class="token punctuation">\\</span>
  <span class="token parameter variable">-v</span> ~/kuboard-spray-data:/data <span class="token punctuation">\\</span>
  eipwork/kuboard-spray:latest-amd64
  <span class="token comment"># 如果抓不到这个镜像，可以尝试一下这个备用地址：</span>
  <span class="token comment"># swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard-spray:latest-amd64</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">持久化</p><ul><li>KuboardSpray 的信息保存在容器的 <code>/data</code> 路径，请将其映射到一个您认为安全的地方，上面的命令中，将其映射到了 <code>~/kuboard-spray-data</code> 路径；</li><li>只要此路径的内容不受损坏，重启、升级、重新安装 Kuboard-Spray，或者将数据及 Kuboard-Spray 迁移到另外一台机器上，您都可以找回到原来的信息。</li></ul></div></li><li><p>在浏览器打开地址 <code>http://这台机器的IP</code>，输入用户名 <code>admin</code>，默认密码 <code>Kuboard123</code>，即可登录 Kuboard-Spray 界面。</p></li></ul><h2 id="加载离线资源包" tabindex="-1"><a class="header-anchor" href="#加载离线资源包" aria-hidden="true">#</a> 加载离线资源包</h2><ul><li>在 Kuboard-Spray 界面中，导航到 <code>系统设置</code> --&gt; <code>资源包管理</code> 界面，可以看到已经等候您多时的 <code>Kuboard-Spray 离线资源包</code>，如下图所示：</li></ul><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kuboard-spray-01.png" alt="加载 Kuboard-Spray 资源包" tabindex="0" loading="lazy"><figcaption>加载 Kuboard-Spray 资源包</figcaption></figure><ul><li><p>点击 <code>导 入</code> 按钮，在界面的引导下完成资源包的加载。</p><div class="hint-container tip"><p class="hint-container-title">重要</p><ul><li>权限问题 <ul><li>导入资源包时，可能会碰到 <code>no such file or directory</code> 或者 <code>permission denied</code> 之类的错误提示，通常是因为您开启了 SELinux，导致 kuboard-spray 不能读取映射到容器 <code>/data</code> 的路径</li></ul></li><li>离线导入 <ul><li>如果您处在内网环境，上图中的列表默认将是空的，请注意其中的 <code>离线加载资源包</code> 按钮，它可以引导您轻松完成资源包的离线加载过程。</li></ul></li></ul></div></li></ul><h2 id="规划并安装集群" tabindex="-1"><a class="header-anchor" href="#规划并安装集群" aria-hidden="true">#</a> 规划并安装集群</h2><ul><li><p>在 Kuboard-Spray 界面中，导航到 <code>集群管理</code> 界面，点击界面中的 <code>添加集群安装计划</code> 按钮，填写表单如下：</p><ul><li>集群名称： 自定义名称，本文中填写为 kuboard123，此名称不可以修改；</li><li>资源包：选择前面步骤中导入的离线资源包。</li></ul><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kuboard-spray-02.png" alt="创建集群安装计划" tabindex="0" loading="lazy"><figcaption>创建集群安装计划</figcaption></figure></li><li><p>点击上图对话框中的 <code>确定</code> 按钮后，将进入集群规划页面，在该界面中添加您每个集群节点的连接参数并设置节点的角色，如下图所示：</p><p>重要： kuboard-spray 所在机器不能当做 K8S 集群的一个节点，因为安装过程中会重启集群节点的容器引擎，这会导致 kuboard-spray 被重启掉。</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kuboard-spray-03.png" alt="集群规划" tabindex="0" loading="lazy"><figcaption>集群规划</figcaption></figure><div class="hint-container tip"><p class="hint-container-title">注意事项</p><ul><li>最少的节点数量是 1 个；</li><li>ETCD 节点、控制节点的总数量必须为奇数；</li><li>在 <code>全局设置</code> 标签页，可以设置节点的通用连接参数，例如所有的节点都使用相同的 ssh 端口、用户名、密码，则共同的参数只在此处设置即可；</li><li>在节点标签页，如果该节点的角色包含 <code>etcd</code> 则必须填写 <code>ETCD 成员名称</code> 这个字段；</li><li>如果您 KuboardSpray 所在节点不能直接访问到 Kubernetes 集群的节点，您可以设置跳板机参数，使 KuboardSpray 可以通过 ssh 访问集群节点。</li><li>集群安装过程中，除了已经导入的资源包以外，还需要使用 yum 或 apt 指令安装一些系统软件，例如 curl, rsync, ipvadm, ipset, ethtool 等，此时要用到操作系统的 apt 软件源或者 yum 软件源。<code>全局设置</code> 标签页中，可以引导您完成 apt / yum 软件源的设置，您可以： <ul><li>使用节点操作系统已经事先配置的 apt / yum 源，或者</li><li>在安装过程中自动配置节点的操作系统使用指定的软件源</li></ul></li><li>如果您使用 docker 作为集群的容器引擎，还需要在 <code>全局设置</code> 标签页指定安装 docker 用的 apt / yum 源。 <blockquote><p>如果您使用 containerd 作为容器引擎，则无需配置 docker 的 apt / yum 源，containerd 的安装包已经包含在 KuboardSpray 离线资源包中。</p></blockquote></li></ul></div></li><li><p>点击上图的 <code>保存</code> 按钮，再点击 <code>执行</code> 按钮，可以启动集群的离线安装过程，如下图所示：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kuboard-spray-04.png" alt="集群安装" tabindex="0" loading="lazy"><figcaption>集群安装</figcaption></figure></li><li><p>取决于您机器的性能和网络访问速度，大概喝一杯茶的功夫，集群就安装好了，安装成功时，日志界面的显示如下图所示：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kuboard-spray-05.png" alt="集群日志" tabindex="0" loading="lazy"><figcaption>集群日志</figcaption></figure></li></ul><h2 id="访问集群" tabindex="-1"><a class="header-anchor" href="#访问集群" aria-hidden="true">#</a> 访问集群</h2><ul><li><p>如果集群日志界面提示您集群已经安装成功，此时您可以返回到集群规划页面，此界面将自动切换到 <code>访问集群</code> 标签页，如下图所示：</p><p>界面给出了三种方式可以访问 kubernetes 集群：</p><div style="font-size:13px;margin-left:40px;"><ul><li>在集群主节点上执行 kubectl 命令</li><li>获取集群的 .kubeconfig 文件</li><li>将集群导入到 kuboard管理界面</li></ul></div><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/kuboard-spray-06.png" alt="访问集群" tabindex="0" loading="lazy"><figcaption>访问集群</figcaption></figure></li></ul><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步" aria-hidden="true">#</a> 下一步</h2>`,18),k=a("p",null,"🎉 🎉 🎉",-1),y=a("p",null,"您已经完成了 Kubernetes 集群的安装.",-1);function m(v,f){const s=n("ExternalLinkIcon"),t=n("RouterLink");return o(),d("div",null,[u,h,a("p",null,[e("Kuboard-Spray 是一款可以在图形界面引导下完成 Kubernetes 高可用集群离线安装的工具，开源仓库的地址为 "),a("a",b,[e("Kuboard-Spray"),i(s)])]),g,a("p",null,[e("如果您使用自己笔记本上的虚拟机安装的集群，将来打算重启虚拟机，请参考 "),i(t,{to:"/cloud/k8s/install/k8s-restart.html"},{default:l(()=>[e("重启Kubernetes集群")]),_:1})]),k,y])}const _=r(p,[["render",m],["__file","install-k8s.html.vue"]]);export{_ as default};