# 云原生第10课：Istio流量治理与监控管理


## 服务治理介绍

### 微服务发展

- 微服务：互联网高速发展以及传统分布式、SOA架构无法适应快速的开发迭代等多重因素共同推动下的产物。
- 微服务雏形：微服务架构概念最早由Fred George在2012年的一次技术大会上所提出，拆分SOA服务实现解耦
- 微服务发扬光大：2014年，James Lewis和Martin Fowler发表了一篇名为《Microservices》的文章

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228112055.png)


### 服务治理介绍

服务治理主要针对微服务, 究竟治理什么？

- 服务注册和服务发现
- 服务负载均衡、路由、灰度、蓝绿
- 服务降级、熔断
- 服务限流
- 服务监控
微服务框架：SpringCloud、Dubbo

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228112243.png)

### 服务网格与微服务框架流量治理对比

||微服务框架|服务网格|
|--|--|--|
|业务侵入性|SDK,侵入式开发|Sidecar,无侵入|
|开发语言|语言强相关，Java生态支持较好|开发语言无关|
|灵活性|静态配置，更新配置需要重启|非常灵活，动态配置|
|升级|需要业务开发优雅处理服务升级，具体很大难度|优雅升级简单|


## Istio常用的流量治理策略

### 流量治理策略一：服务注册&发现

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113003.png)

- Istio的服务注册发现是由Pilot完成的，Pilot通过K8s list watch接口发8现service、endpoint, 再将service、endpoint转化为Envoy xDS配置，并将配置下发
- Pilot也支持来自K8s、Consul、Eureka、ZooKeeper的服务发现
- 其他方式都是常用的微服务框架所依赖的注册中心，通常需要业务代码集成服务注册于发现机制
- 推荐方式：更加推荐 直接利用 k8s，在托管K8s环境中，直接使用托管服务，不再需要直接管理注册中心，减轻业务开发、运维负担

### 流量治理策略二：负载均衡

支持的负载均衡算法通常有：加权轮询、最少请求、环形Hash、随机、优先级负载均衡以及Locality 加权。

Istio负载均衡的表示方法主要是通过DestinationRule TrafficPolicy, TrafficPolicy支持服务力度及服务的端口力度。

**常用的TrafficPolicy的API:**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113129.png)

LocalityLoadBalancerSetting8主要支持两种：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113149.png)

**流量治理策略二：负载均衡使用说明**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113255.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113303.png)

**高级的Loc8alityLoadBalancerSetting展示**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113317.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113339.png)

### 流量治理策略三：路由（流量切分、灰度发布）

路由匹配过程：请求下发后，根据路由匹配条件设置流量转发权重，主要是通过VirtualService.HTTPRoute API来控制的。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113514.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113531.png)

**流量治理策略三：路由使用说明**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113607.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113619.png)


### 流量治理策略四：熔断、降级

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113647.png)

熔断、降级是通过ConnectionPoolSettings进行设置：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113710.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113719.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113729.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113744.png)

### 流量治理策略五：故障注入

故障注入可以用来识别系统最薄弱的环节，支持的类型：

- HTTP请求响应延时注入
- HTTP、gRPC错误码注入

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113907.png)

**流量治理策略五：故障注入使用说明**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113927.png)

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228113945.png)


### 流量治理策略六：限流

Istio支持两种限流方式：

- 中心集中式限流
- 本地限流

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114023.png)

**流量治理策略六：限流使用说明**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114043.png)


### 流量治理策略七：失败重试

Istio支持失败重试HTTPRetry，提高系统的Resilience

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114137.png)

**流量治理策略七：失败重试使用说明**

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230228114156.png)

































