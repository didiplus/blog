# 云原生第6课：Kubernetes持久化数据卷管理

:::info
本篇文章来自《华为云云原生王者之路训练营》黄金系列课程第6课，由华为云容器技术专家Jabin主讲，详细介绍有状态应用StagefulSet，PersistentVolume，PersistentVolumeClaim及StorageClass的概念及使用。
:::

主要内容包含2个部分：

- 有状态应用（StatefulSet）介绍
- PV/PVC/SC介绍

## 前言

从上节课程[云原生第5课：Kubernetes工作负载管理](./05.md)我们已经了解无状态应用了。应用是为了某项特殊的任务而编写的程序。程序是由算法和数据组成的。在生产环境中，除了一些无状态应用外，还有一部分应用需要将结果数据(也即：状态)缓存下来，并永久的记录在存储中，以供后续使用。这类应用就是我们将要讨论的“有状态应用”，与“无状态应用”相比，我们期望“有状态应用” 具有哪些能力呢？

1. 计算维度：
   - 每个pod的名字需要是稳定的，不会发生变化的；
   - pods之间的启动、升级、退出可以按照某种顺序控制的；

2. 存储维度：
   - 存储是持久的，拥有独立于pod的生命周期，不会随着pod的生命周期结束而销毁；
   - 每个pod与其使用的存储关系是稳定的，不会因升级等因素而发生变化；

3. 网络维度：
   - 每个pod的有独立、稳定的网络标识；


## 有状态应用(StatefulSet)介绍 

基于社区对有状态应用的通用需求，K8S设计了一种有状态应用对象，也即：StatefulSet。它可以为用户提供一组具有稳定、有序、唯一特性的应用实例集合。如下图所示：

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227133030.png)

1. 稳定：
- 稳定的podName：`{stsName}-{序号[0-n]}`
- 稳定的网络标识：`{podName}. {headless-svcName}.{namespace}.svc.cluster.local`
- 稳定的存储关系：`{volumeClaimTemplatesName}-{podName}`


2. 有序：
- 按照编号从小到大顺序的部署：0 ~ n
- 按照编号从大到小进行删除：n ~ 0
- 支持有序的扩缩容和升级策略


3. 唯一：
- 每个pod拥有一个唯一的网络标识：`{podName}. {headless-svcName}.{namespace}.svc.cluster.local`

从下图可以看出，与Deployment通过ReplicaSet来管理pod生命周期不同，StatefulSet是直接管理pod的。

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227133354.png)


### 有状态应用(StatefulSet)样例模板详解

请观看[课程视频](https://education.huaweicloud.com/courses/course-v1:HuaweiX+CBUCNXI035+Self-paced/about)5分12秒-6分23秒

![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227133430.png)

### 常用操作小结

**创建**

```shell
kubectl create -f mysql-adv-sts.yaml
```
**查询**

```shell
kubectl -n default get sts
kubectl -n default get svc
kubectl get pods -o wide
```

```shell
kubectl -n default get pod

NAME                       READY   STATUS    RESTARTS   AGE
mysql-adv-0                1/1     Running   0          17m
mysql-adv-1                1/1     Running   0          17m
mysql-adv-2                1/1     Running   0          17m
```
**扩容实例**
```shell
kubectl -n default scale statefulset mysql-adv --replicas=1
kubectl -n default scale statefulset mysql-adv --replicas=3
```
**删除**
```shell
kubectl delete sts mysql-adv
```

## PV/PVC/SC介绍

- **PersistentVolume**：简称pv，持久化存储，是k8s为云原生应用提供一种拥有独立生命周期的、用户可管理的存储的抽象设计。
- **PersistentVolumeClaim**：简称pvc，持久化存储声明，是k8s为解耦云原生应用和数据存储而设计的，通过pvc可以让资源管控更细更灵活、应用模板更通用。
- **StorageClass**：简称sc，存储类，是k8s平台为存储提供商提供存储接入的一种声明。通过sc和相应的存储插件(csi)为容器应用提供持久存储卷的能力。


![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227134043.png)

### PVC样例模板详解

PVC中定义应用所需的规格等配置：

```yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
annotations:
everest.io/disk-volume-type: sata
volume.beta.kubernetes.io/storage-provisioner: everest-csi-provisioner
labels:
app: mysql-adv-mgmd
release: mysql-adv
name: mysql-data-mysql-adv-mgmd-0
namespace: default
spec:
accessModes:
- ReadWriteOnce
resources:
requests:
storage: 10Gi
storageClassName: csi-disk
volumeMode: Filesystem
```

:::info  关键参数解析
1. accessModes：
   - ReadWriteOnce：允许以读写能力挂载到一个host上，如：云盘
   - ReadOnlyMany：允许以只读能力挂到多个host上，如：文件存储
   - ReadWriteMany：允许以读写能力挂载到多个host上，如：文件存储
2. volumeMode：
   - Filesystem：将云盘挂载为文件系统
   - Block：将云盘挂载为块设备
3. Resources：
   - Requests：最小容量
   - Limites：最大容量
4. storageClassName：sc名字
5. mountOptions：mount指令中的options
:::

### SC样例模板详解

```yaml

apiVersion: storage.k8s.io/v1

kind: StorageClass
metadata:
name: csi-disk-ssd
parameters:
csi.storage.k8s.io/csi-driver-name: disk.csi.everest.io
csi.storage.k8s.io/fstype: ext4
everest.io/disk-volume-type: SSD
everest.io/passthrough: "true"
provisioner: everest-csi-provisioner
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

:::info 
SC中定义存储类型和驱动等配置：
1. Parameters：插件驱动定义的参数
2. Provisioner：指定存储卷的供应者
3. reclaimPolicy:
   - Retain：保留
   - Delete：删除
4. volumeBindingMode：
   - Immediate：立即绑定
   - WaitForFirstConsumer：延迟绑定
5. allowVolumeExpansion：
   - True：允许扩容
   - False：不允许扩容
:::

### PV样例模板详解

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
name: static-volume
spec:
accessModes:
- ReadWriteOnce
capacity:
storage: 10Gi
csi:
driver: disk.csi.everest.io
fsType: ext4
volumeAttributes:
everest.io/disk-mode: SCSI
everest.io/disk-volume-type: SATA
storage.kubernetes.io/csiProvisionerIdentity: everest-csi-provisioner
volumeHandle: 9a074a5b-a67e-4fae-860e-07c5307594ea
persistentVolumeReclaimPolicy: Delete
storageClassName: csi-disk
volumeMode: Filesystem
```
:::info 
PV中定义应用所需的规格等配置：
1. accessModes：
   - ReadWriteOnce：允许以读写能力挂载到一个host上，如：云盘
   - ReadOnlyMany：允许以只读能力挂到多个host上，如：文件存储
   - ReadWriteMany：允许以读写能力挂载到多个host上，如：文件存储
2. capacity
   - storage：容量大小
3. csi：out-tree驱动类型
   - Driver：驱动名字
   - fstType：磁盘文件类型
   - volumeAttributes：存储驱动定义的参数
   - volumeHandle：存储volume的唯一ID
4. persistentVolumeReclaimPolicy：
   - Retain：保留
   - Delete：删除
5. storageClassName：sc名字
6. volumeMode：
   - Filesystem：将云盘挂载为文件系统
   - Block：将云盘挂载为块设备
:::

### 有状态应用&持久化存储的最佳实践


```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-adv
  namespace: default
spec:
  podManagementPolicy: Parallel
  replicas: 3
  serviceName: mysql-adv-headless
  template:
    spec:
      containers:
        image: mysql:latest
        imagePullPolicy: Always
        name: container-0
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-data
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
  updateStrategy:
    rollingUpdate:
      partition: 2
    type: RollingUpdate
  volumeClaimTemplates:
  - metadata:
      annotations:
        everest.io/disk-volume-type: SATA
      name: mysql-data
    spec:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi
      storageClassName: csi-disk
      volumeMode: Filesystem
```
![](https://didiplus.oss-cn-hangzhou.aliyuncs.com/20230227135643.png)

**kubectl get pvc**

```shell

NAME                      STATUS    VOLUME                                 CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mysql-data-mysql-adv-0   Bound    pvc-b4d21c69-9101-4721-bc97-8d319a5f961e   1Gi        RWO            csi-disk    10h
mysql-data-mysql-adv-1   Bound    pvc-d7387797-8ff5-457a-a2b9-2fb22d5d4e11    1Gi        RWO            csi-disk    10h
mysql-data-mysql-adv-2   Bound    pvc-85fb7ffc-8ca4-4381-8b23-9156dd929fea     1Gi         RWO            csi-disk    10h
```

**kubectl get pv**

```shell
NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM         STORAGECLASS   REASON   AGE
pvc-85fb7ffc-8ca4-4381-8b23-9156dd929fea    1Gi  RWO  Delete    Bound  default/mysql-data-mysql-adv-2 csi-disk   10h
pvc-b4d21c69-9101-4721-bc97-8d319a5f961e  1Gi  RWO  Delete    Bound  default/mysql-data-mysql-adv-0 csi-disk   10h
pvc-d7387797-8ff5-457a-a2b9-2fb22d5d4e11   1Gi  RWO  Delete    Bound  default/mysql-data-mysql-adv-1 csi-disk   10h
```

:::info 常用操作小结

`kubectl create -f pv.yaml` #创建PV

`kubectl get pv | grep static-volume` #查看PV

`kubectl create -f pvc.yaml` #创建PVC


:::
