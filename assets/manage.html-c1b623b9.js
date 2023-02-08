import{ab as s,G as r,H as i,E as e,S as a,N as t,ad as l,W as d}from"./framework-b31a425c.js";const c={},o=e("h1",{id:"_3-2-2、管理kubernetes对象",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_3-2-2、管理kubernetes对象","aria-hidden":"true"},"#"),a(" 3.2.2、管理Kubernetes对象")],-1),u={href:"https://kubernetes.io/docs/concepts/overview/working-with-objects/object-management/",target:"_blank",rel:"noopener noreferrer"},b={href:"https://kubectl.docs.kubernetes.io/",target:"_blank",rel:"noopener noreferrer"},p=l(`<h2 id="管理方式" tabindex="-1"><a class="header-anchor" href="#管理方式" aria-hidden="true">#</a> 管理方式</h2><table><thead><tr><th>管理方式</th><th>操作对象</th><th>推荐的环境</th><th>参与编辑的人数</th><th>学习曲线</th></tr></thead><tbody><tr><td>指令性的命令行</td><td>Kubernetes对象</td><td>开发环境</td><td>1+</td><td>最低</td></tr><tr><td>指令性的对象配置</td><td>单个 yaml 文件</td><td>生产环境</td><td>1</td><td>适中</td></tr><tr><td>声明式的对象配置</td><td>包含多个 yaml 文件的多个目录</td><td>生产环境</td><td>1+</td><td>最高</td></tr></tbody></table><div class="hint-container danger"><p class="hint-container-title">警告</p><p>同一个Kubernetes对象应该只使用一种方式管理，否则可能会出现不可预期的结果</p></div><div class="hint-container tip"><p class="hint-container-title">Kuboard</p><ul><li>kubectl 是 Kubernetes 官方的管理工具，由于命令行 + yaml 文件这个特性，其操作难度和学习曲线都是很高的，作为 Kubernetes 的资深用户，是需要学会如何使用 kubectl 的。在实际生产环境的使用中，作者推荐大家使用 Kuboard，Kuboard 是一款免费的基于Kubernetes的微服务管理界面，已经在许多的生产环境中得到了检验。</li><li>Kuboard 可以和 kubectl 配合使用，但是您必须对两者都有所了解。</li></ul></div><h2 id="指令性的命令行" tabindex="-1"><a class="header-anchor" href="#指令性的命令行" aria-hidden="true">#</a> 指令性的命令行</h2><p>当使用指令性的命令行（imperative commands）时，用户通过向 <code>kubectl</code> 命令提供参数的方式，直接操作集群中的 Kubernetes 对象。此时，用户无需编写或修改 <code>.yaml</code> 文件。</p><p>这是在 Kubernetes 集群中执行一次性任务的一个简便的办法。由于这种方式直接修改 Kubernetes 对象，也就无法提供历史配置查看的功能。</p><h3 id="例子" tabindex="-1"><a class="header-anchor" href="#例子" aria-hidden="true">#</a> 例子</h3><p>创建一个 Deployment 对象，以运行一个 nginx 实例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl run nginx <span class="token parameter variable">--image</span> nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>下面的命令完成了相同的任务，但是命令格式不同：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create deployment nginx <span class="token parameter variable">--image</span> nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="优缺点" tabindex="-1"><a class="header-anchor" href="#优缺点" aria-hidden="true">#</a> 优缺点</h3><p>与编写 <code>.yaml</code> 文件进行配置的方式相比的优势：</p><ul><li>命令简单，易学易记</li><li>只需要一个步骤，就可以对集群执行变更</li></ul><p>缺点：</p><ul><li>使用命令，无法进行变更review的管理</li><li>不提供日志审计</li><li>没有创建新对象的模板</li></ul><h2 id="指令性的对象配置" tabindex="-1"><a class="header-anchor" href="#指令性的对象配置" aria-hidden="true">#</a> 指令性的对象配置</h2><p>使用指令性的对象配置（imperative object configuration）时，需要向 kubectl 命令指定具体的操作（create,replace,apply,delete等），可选参数以及至少一个配置文件的名字。配置文件中必须包括一个完整的对象的定义，可以是 yaml 格式，也可以是 json 格式。</p><div class="hint-container warning"><p class="hint-container-title">注意</p><p><code>replace</code> 指令将直接使用对象中新的 spec 内容替换原有的 spec 内容，如果原有spec中存在配置文件中没有定义的字段，都将被丢弃。这种方法不能够应用在那些 spec 对象独立于配置文件进行更新的情况。例如 <code>LoadBalancer</code> 类型的 Service，其 spec 中的 <code>externalIPs</code> 字段由集群更新。</p></div><h3 id="例子-1" tabindex="-1"><a class="header-anchor" href="#例子-1" aria-hidden="true">#</a> 例子</h3><p>通过配置文件创建对象</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create <span class="token parameter variable">-f</span> nginx.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>删除两个配置文件中的对象</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl delete <span class="token parameter variable">-f</span> nginx.yaml <span class="token parameter variable">-f</span> redis.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>直接使用配置文件中的对象定义，替换Kubernetes中对应的对象：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl replace <span class="token parameter variable">-f</span> nginx.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="优缺点-1" tabindex="-1"><a class="header-anchor" href="#优缺点-1" aria-hidden="true">#</a> 优缺点</h3><p>与指令性命令行相比的优点：</p><ul><li>对象配置文件可以存储在源代码管理系统中，例如 git</li><li>对象配置文件可以整合进团队的变更管理流程，并进行审计和复核</li><li>对象配置文件可以作为一个模板，直接用来创建新的对象</li></ul><p>与指令性命令行相比的缺点：</p><ul><li>需要理解对象配置文件的基本格式</li><li>需要额外编写 yaml 文件</li></ul><p>与声明式的对象配置相比的优点：</p><ul><li>指令性的对象配置更简单更易于理解</li><li>指令性的对象配置更成熟</li></ul><p>与声明式的对象配置相比的缺点：</p><ul><li>指令性的对象配置基于文件进行工作，而不是目录</li><li>如果直接更新 Kubernetes 中对象，最好也同时修改配置文件，否则在下一次替换时，这些更新将丢失</li></ul><h2 id="声明式的对象配置" tabindex="-1"><a class="header-anchor" href="#声明式的对象配置" aria-hidden="true">#</a> 声明式的对象配置</h2><p>当使用声明式的对象配置时，用户操作本地存储的Kubernetes对象配置文件，然而，在将文件传递给 kubectl 命令时，并不指定具体的操作，由 kubectl 自动检查每一个对象的状态并自行决定是创建、更新、还是删除该对象。使用这种方法时，可以直接针对一个或多个文件目录进行操作（对不同的对象可能需要执行不同的操作）。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>声明式对象配置将保留其他用户对Kubernetes对象的更新，即使这些更新没有合并到对象配置文件中。因为当Kubernetes中已经存在该对象时，声明式对象配置使用 <code>patch</code> API接口，此时会把变化的内容更新进去，而不是使用 <code>replace</code> API接口，该接口替换整个 spec 信息。</p></div><h3 id="例子-2" tabindex="-1"><a class="header-anchor" href="#例子-2" aria-hidden="true">#</a> 例子</h3><p>处理 <code>configs</code> 目录中所有配置文件中的Kubernetes对象，根据情况创建对象、或更新Kubernetes中已经存在的对象。可以先执行 <code>diff</code> 指令查看具体的变更，然后执行 <code>apply</code> 指令执行变更：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token function">diff</span> <span class="token parameter variable">-f</span> configs/
kubectl apply <span class="token parameter variable">-f</span> configs/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>递归处理目录中的内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token function">diff</span> <span class="token parameter variable">-R</span> <span class="token parameter variable">-f</span> configs/
kubectl apply <span class="token parameter variable">-R</span> <span class="token parameter variable">-f</span> configs/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优缺点-2" tabindex="-1"><a class="header-anchor" href="#优缺点-2" aria-hidden="true">#</a> 优缺点</h3><p>与指令性的对象配置相比，优点有：</p><ul><li>直接针对Kubernetes已有对象的修改将被保留，即使这些信息没有合并到配置文件中。（译者注：也许这是一个缺点？因为我不敢相信我的配置文件了，或者我要禁止使用其他手段修改Kubernetes中已有的对象）</li><li>声明式的对象配置可以支持多文件目录的处理，可以自动探测应该对具体每一个对象执行什么操作（创建、更新、删除）</li></ul><p>缺点：</p><ul><li>声明式的对象配置复杂度更高，Debug更困难</li><li>部分更新对象时，带来复杂的合并操作</li></ul><h2 id="延伸阅读" tabindex="-1"><a class="header-anchor" href="#延伸阅读" aria-hidden="true">#</a> 延伸阅读</h2>`,50),h={href:"https://kubernetes.io/docs/tasks/manage-kubernetes-objects/imperative-command/",target:"_blank",rel:"noopener noreferrer"},m={href:"https://kubernetes.io/docs/tasks/manage-kubernetes-objects/imperative-config/",target:"_blank",rel:"noopener noreferrer"},g={href:"https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/",target:"_blank",rel:"noopener noreferrer"},v={href:"https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/",target:"_blank",rel:"noopener noreferrer"},f={href:"https://kubectl.docs.kubernetes.io/",target:"_blank",rel:"noopener noreferrer"},_={href:"https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/",target:"_blank",rel:"noopener noreferrer"},K={class:"hint-container tip"},x=e("p",{class:"hint-container-title"},"提示",-1),y={href:"https://github.com/kubernetes-sigs/kustomize",target:"_blank",rel:"noopener noreferrer"},j=e("p",null,"从更好地学习和理解 Kubernetes 的角度来说，是一定要学会如何使用 kubectl 的，实际在 Kubernetes 上部署微服务应用时，您会发现 Kuboard 用起来更顺手。",-1);function I(M,O){const n=d("ExternalLinkIcon");return r(),i("div",null,[o,e("blockquote",null,[e("p",null,[a("参考文档： "),e("a",u,[a("Kubernetes Object Management"),t(n)])])]),e("p",null,[a("kubectl 命令行工具支持多种途径以创建和管理 Kubernetes 对象。本文档描述了3种不同的方式。更多的细节，请参考 "),e("a",b,[a("Kubectl book"),t(n)])]),p,e("ul",null,[e("li",null,[e("a",h,[a("Managing Kubernetes Objects Using Imperative Commands"),t(n)])]),e("li",null,[e("a",m,[a("Managing Kubernetes Objects Using Object Configuration (Imperative)"),t(n)])]),e("li",null,[e("a",g,[a("Managing Kubernetes Objects Using Object Configuration (Declarative)"),t(n)])]),e("li",null,[e("a",v,[a("Managing Kubernetes Objects Using Kustomize (Declarative)"),t(n)])]),e("li",null,[e("a",k,[a("Kubectl Command Reference"),t(n)])]),e("li",null,[e("a",f,[a("Kubectl Book"),t(n)])]),e("li",null,[e("a",_,[a("Kubernetes API Reference"),t(n)])])]),e("div",K,[x,e("p",null,[a("作者在实际部署一个 30+ 微服务部署单元的 Spring Cloud 应用时，编写了 40 多个 YAML 文件，每个 YAML 文件多达 100-500 行配置。为了使同一套 YAML 文件能够适应开发、测试、生产环境，将其分成 base、dev、test、staging、prod 等目录，使用 "),e("a",y,[a("kustomize"),t(n)]),a(" 将公共部分提取到 base 中。在经历了如此这般的痛苦之后，编写了 Kuboard。")]),j])])}const C=s(c,[["render",I],["__file","manage.html.vue"]]);export{C as default};
