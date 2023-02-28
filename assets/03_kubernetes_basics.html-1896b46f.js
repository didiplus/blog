import{ab as n,G as s,H as a,ad as e}from"./framework-894cff3a.js";const t={},l=e(`<h1 id="云原生第3课-kubernetes-系统快速入门" tabindex="-1"><a class="header-anchor" href="#云原生第3课-kubernetes-系统快速入门" aria-hidden="true">#</a> 云原生第3课：Kubernetes 系统快速入门</h1><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第3课，由华为云容器批量计算首席架构师马达主讲，介绍云原生技术体系中Kubernetes的相关概念和技术架构。</p></div><h2 id="kubernetes介绍" tabindex="-1"><a class="header-anchor" href="#kubernetes介绍" aria-hidden="true">#</a> Kubernetes介绍</h2><h3 id="云计算的发展历程" tabindex="-1"><a class="header-anchor" href="#云计算的发展历程" aria-hidden="true">#</a> 云计算的发展历程</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110638.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>“云”中的资源在使用者看来是可以无限扩展的，并且可以随时获取，按需使用，随时扩展，按使用付费。这种特性经常被称为像水电一样使用IT基础设施。</p><h3 id="kubernetes架构分层" tabindex="-1"><a class="header-anchor" href="#kubernetes架构分层" aria-hidden="true">#</a> Kubernetes架构分层</h3><p>该图为Kubernetes社区描绘的整个Kubernetes生态里所涉及的几个主要层次：</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110710.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>K8S社区架构中对各层的详细定义</p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227110724.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上图从上往下依次为：</p><ol><li>生态层：不属于K8S范围</li><li>接口层（工具、SDK库、UI等）： <ul><li>K8S官方的项目会提供库、工具、UI等外围工具</li><li>外部可提供自有的实现</li></ul></li><li>治理层：策略执行和自动化编排 <ul><li>对应用运行的可选层，没有这层功能不影响应用的执行</li><li>自动化API：水平弹性伸缩、租户管理、集群管理、动态LB等</li><li>策略API：限速、资源配额、pod可靠性策略、network policy等</li></ul></li><li>应用层：部署（无状态/有状态应用、批处理、集群应用等）和路由（服务发现、DNS解析等） <ul><li>K8S发行版必备功能和API，K8S会提供默认的实现，如Scheduler</li><li>Controller和scheduler可以被替换为各自的实现，但必须通过一致性测试</li><li>业务管理类Controller：daemonset/replicaset/replication/statefulset/cronjob/service/endpoint</li></ul></li><li>内核层：Kubernetes最核心功能，对外提供API构建高层的应用，对内提供插件式应用执行环境 <ul><li>由主流K8S codebase实现（主项目），属于K8S的内核、最小特性集。等同于Linux Kernel</li><li>提供必不可少Controller、Scheduler的默认实现</li><li>集群管理类Controller：Node/gc/podgc/volume/namespace/resourcequota/serviceaccount</li></ul></li></ol><div class="hint-container info"><p class="hint-container-title">总的来说</p><ul><li><strong>内核层</strong>：提供最核心的特性最小集以及API，为必选模块</li><li><strong>内核层之上</strong>：以各种Controller插件方式实现内核层API，支持可替换的实现</li><li><strong>内核层之下</strong>：是各种适配存储、网络、容器、Cloud Provider等</li></ul></div><h2 id="kubernetes基本概念" tabindex="-1"><a class="header-anchor" href="#kubernetes基本概念" aria-hidden="true">#</a> Kubernetes基本概念</h2><h3 id="kubernets概览" tabindex="-1"><a class="header-anchor" href="#kubernets概览" aria-hidden="true">#</a> Kubernets概览</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227111147.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="kubernetes关键概念-pod" tabindex="-1"><a class="header-anchor" href="#kubernetes关键概念-pod" aria-hidden="true">#</a> Kubernetes关键概念-Pod</h3><ul><li>在Kubernetes中，pods是能够创建、调度、和管理的最小部署单元，是一组容器的集合，而不是单独的应用容器</li><li>同一个Pod里的容器共享同一个网络命名空间，IP地址及端口空间。</li><li>从生命周期来说，Pod是短暂的而不是长久的应用。Pods被调度到节点，保持在这个节点上直到被销毁</li></ul><p><strong>POD实例</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token punctuation">{</span>
    <span class="token key atrule">&quot;kind&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;Pod&quot;</span><span class="token punctuation">,</span>
    <span class="token key atrule">&quot;apiVersion&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;v1&quot;</span><span class="token punctuation">,</span>
    <span class="token key atrule">&quot;metadata&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token key atrule">&quot;name&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;redis-django&quot;</span><span class="token punctuation">,</span>
        <span class="token key atrule">&quot;labels&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token key atrule">&quot;app&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;webapp&quot;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token key atrule">&quot;spec&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token key atrule">&quot;containers&quot;</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
            <span class="token key atrule">&quot;name&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;key-value-store&quot;</span><span class="token punctuation">,</span>
            <span class="token key atrule">&quot;image&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;redis&quot;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
            <span class="token key atrule">&quot;name&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;frontend&quot;</span><span class="token punctuation">,</span>
            <span class="token key atrule">&quot;image&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;django&quot;</span>
        <span class="token punctuation">}</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="pod详解-容器-containers" tabindex="-1"><a class="header-anchor" href="#pod详解-容器-containers" aria-hidden="true">#</a> Pod详解-容器（Containers）</h4><ol><li>Infrastructure Container：基础容器 <ul><li>用户不可见，无需感知</li><li>维护整个Pod网络空间</li></ul></li><li>InitContainers：初始化容器，一般用于服务等待处理以及注册Pod信息等 <ul><li>先于业务容器开始执行</li><li>顺序执行，执行成功退出（exit 0），全部执行成功后开始启动业务容器</li></ul></li><li>Containers：业务容器 <ul><li>并行启动，启动成功后一直Running</li></ul></li></ol><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
   <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp<span class="token punctuation">-</span>pod
<span class="token key atrule">labels</span><span class="token punctuation">:</span>
   <span class="token key atrule">app</span><span class="token punctuation">:</span> myapp
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
   <span class="token key atrule">containers</span><span class="token punctuation">:</span>
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myapp<span class="token punctuation">-</span>container
     <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
     <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;sh&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;-c&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;echo The app is running! &amp;&amp; sleep 3600&#39;</span><span class="token punctuation">]</span>
   <span class="token key atrule">initContainers</span><span class="token punctuation">:</span>
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> init<span class="token punctuation">-</span>myservice
     <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
     <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;sh&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;-c&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;until nslookup myservice; do echo waiting for myservice; sleep 2; done;&#39;</span><span class="token punctuation">]</span>
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> init<span class="token punctuation">-</span>mydb
     <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
     <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;sh&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;-c&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;until nslookup mydb; do echo waiting for mydb; sleep 2; done;&#39;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="容器基本组成" tabindex="-1"><a class="header-anchor" href="#容器基本组成" aria-hidden="true">#</a> 容器基本组成</h4><ol><li>镜像部分： <ul><li>镜像地址和拉取策略</li><li>拉取镜像的认证凭据</li></ul></li><li>启动命令： <ul><li>command：替换docker容器的entrypoint</li><li>args：作为docker容器entrypoint的入参</li></ul></li><li>计算资源： <ul><li>请求值：调度依据</li><li>限制值：容器最大能使用的规格</li></ul></li></ol><p><strong>spec:</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">imagePullSecrets</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> default<span class="token punctuation">-</span>secret
<span class="token key atrule">containers</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>dns<span class="token punctuation">:</span>1.0.0
<span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
<span class="token key atrule">command</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> /bin/sh
<span class="token punctuation">-</span> <span class="token punctuation">-</span>c
<span class="token punctuation">-</span> /kube<span class="token punctuation">-</span>dns 1<span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span>/var/log/skydns.log 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>domain=cluster.local. <span class="token punctuation">-</span><span class="token punctuation">-</span>dns<span class="token punctuation">-</span>port=10053
<span class="token punctuation">-</span><span class="token punctuation">-</span>config<span class="token punctuation">-</span>dir=/kube<span class="token punctuation">-</span>dns<span class="token punctuation">-</span>config <span class="token punctuation">-</span><span class="token punctuation">-</span>v=2
<span class="token key atrule">resources</span><span class="token punctuation">:</span>
   <span class="token key atrule">limits</span><span class="token punctuation">:</span>
      <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
      <span class="token key atrule">memory</span><span class="token punctuation">:</span> 512Mi
   <span class="token key atrule">requests</span><span class="token punctuation">:</span>
      <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
      <span class="token key atrule">memory</span><span class="token punctuation">:</span> 100Mi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227170736.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="pod详解-外部输入" tabindex="-1"><a class="header-anchor" href="#pod详解-外部输入" aria-hidden="true">#</a> Pod详解-外部输入</h4><p>Pod可以接收的外部输入方式： 环境变量、配置文件以及密钥。</p><p>环境变量：使用简单，但一旦变更后必须重启容器。</p><ul><li>Key-value自定义</li><li>From 配置文件（configmap）</li><li>From 密钥（Secret）</li></ul><p>以卷形式挂载到容器内使用，权限可控。</p><ul><li>配置文件（configmap）</li><li>密钥（secret）</li></ul><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">env</span><span class="token punctuation">:</span>
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> APP_NAME
     <span class="token key atrule">value</span><span class="token punctuation">:</span> test
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> USER_NAME
     <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
       <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
        <span class="token key atrule">key</span><span class="token punctuation">:</span> username
        <span class="token key atrule">name</span><span class="token punctuation">:</span> secret
     <span class="token key atrule">envFrom</span><span class="token punctuation">:</span>
     <span class="token punctuation">-</span> <span class="token key atrule">configMapRef</span><span class="token punctuation">:</span>
       <span class="token key atrule">name</span><span class="token punctuation">:</span> config
     <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
     <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/local/config
       <span class="token key atrule">name</span><span class="token punctuation">:</span> cfg
     <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/local/secret
       <span class="token key atrule">name</span><span class="token punctuation">:</span> sct
     <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
     <span class="token punctuation">-</span> <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
        <span class="token key atrule">defaultMode</span><span class="token punctuation">:</span> <span class="token number">420</span>
        <span class="token key atrule">items</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> age
          <span class="token key atrule">path</span><span class="token punctuation">:</span> age
         <span class="token key atrule">name</span><span class="token punctuation">:</span> config
       <span class="token key atrule">name</span><span class="token punctuation">:</span> cfg
       <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> sct
         <span class="token key atrule">secret</span><span class="token punctuation">:</span>
           <span class="token key atrule">defaultMode</span><span class="token punctuation">:</span> <span class="token number">420</span>
           <span class="token key atrule">secretName</span><span class="token punctuation">:</span> secret
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="pod与工作负载的关系" tabindex="-1"><a class="header-anchor" href="#pod与工作负载的关系" aria-hidden="true">#</a> Pod与工作负载的关系</h3><ul><li>通过label-selector 和 owerReference 相关联</li><li>Pod通过工作负载实现应用的运维，如伸缩、升级等</li></ul><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227112720.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="关键工作负载-replicaset" tabindex="-1"><a class="header-anchor" href="#关键工作负载-replicaset" aria-hidden="true">#</a> 关键工作负载-ReplicaSet</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227112819.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>ReplicaSet—副本控制器</li><li>确保Pod的一定数量的份数(replica)在运行。如果超过这个数量，控制器会杀死一些，如果少了，控制器会启动一些。</li><li>ReplicaSet用于解决pod的扩容和缩容问题。</li><li>通常用于无状态应用</li></ul><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> extensions/v1beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ReplicaSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
<span class="token key atrule">name</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
<span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
<span class="token key atrule">selector</span><span class="token punctuation">:</span>
<span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
<span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token punctuation">{</span><span class="token key atrule">key</span><span class="token punctuation">:</span> tier<span class="token punctuation">,</span> <span class="token key atrule">operator</span><span class="token punctuation">:</span> In<span class="token punctuation">,</span> <span class="token key atrule">values</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>frontend<span class="token punctuation">]</span><span class="token punctuation">}</span>
<span class="token key atrule">template</span><span class="token punctuation">:</span>
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
<span class="token key atrule">labels</span><span class="token punctuation">:</span>
<span class="token key atrule">app</span><span class="token punctuation">:</span> guestbook
<span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
<span class="token key atrule">containers</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> php<span class="token punctuation">-</span>redis
<span class="token key atrule">image</span><span class="token punctuation">:</span> gcr.io/google_samples/gb<span class="token punctuation">-</span>frontend<span class="token punctuation">:</span>v3
<span class="token key atrule">resources</span><span class="token punctuation">:</span>
<span class="token key atrule">requests</span><span class="token punctuation">:</span>
<span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
<span class="token key atrule">memory</span><span class="token punctuation">:</span> 100Mi
<span class="token key atrule">env</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> GET_HOSTS_FROM
<span class="token key atrule">value</span><span class="token punctuation">:</span> dns
<span class="token key atrule">ports</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关键工作负载-deployment" tabindex="-1"><a class="header-anchor" href="#关键工作负载-deployment" aria-hidden="true">#</a> 关键工作负载-Deployment</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113005.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ol><li>Kubernetes Deployment提供了官方的用于更新Pod和Replica Set（下一代的Replication Controller）的方法，您可以在Deployment对象中只描述您所期望的理想状态（预期的运行状态），Deployment控制器为您将现在的实际状态转换成您期望的状态;</li><li>Deployment集成了上线部署、滚动升级、创建副本、暂停上线任务，恢复上线任务，回滚到以前某一版本（成功/稳定）的Deployment等功能，在某种程度上，Deployment可以帮我们实现无人值守的上线，大大降低我们的上线过程的复杂沟通、操作风险。</li><li>Deployment的典型用例： <ul><li>使用Deployment来启动（上线/部署）一个Pod或者ReplicaSet</li><li>检查一个Deployment是否成功执行</li><li>更新Deployment来重新创建相应的Pods（例如，需要使用一个新的Image）</li><li>如果现有的Deployment不稳定，那么回滚到一个早期的稳定的Deployment版本</li></ul></li></ol><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> extensions/v1beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
<span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>deployment
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
<span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
<span class="token key atrule">template</span><span class="token punctuation">:</span>
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
<span class="token key atrule">labels</span><span class="token punctuation">:</span>
<span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
<span class="token key atrule">containers</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
<span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>1.7.9
<span class="token key atrule">ports</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kubernetes系统组件" tabindex="-1"><a class="header-anchor" href="#kubernetes系统组件" aria-hidden="true">#</a> Kubernetes系统组件</h3><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113243.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="kubernetes总体架构" tabindex="-1"><a class="header-anchor" href="#kubernetes总体架构" aria-hidden="true">#</a> Kubernetes总体架构</h2><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113319.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Kubernetes基于list-watch机制的控制器架构</strong></p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113424.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Kubernetes Controllers</strong></p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113446.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Scheduler：为Pod找到一个合适的Node</strong><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113506.png" alt="" loading="lazy"></p><p><strong>Kubernetes 的 Default scheduler</strong></p><figure><img src="https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227113528.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>基于队列的调度器</li><li>一次调度一个Pod</li><li>调度时刻全局最优</li></ul>`,59),i=[l];function p(c,u){return s(),a("div",null,i)}const r=n(t,[["render",p],["__file","03_kubernetes_basics.html.vue"]]);export{r as default};