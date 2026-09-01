// chapters.js — 阶段 0 的 12 章课程内容
// 形式借鉴 learn-claude-code：每章只加一个机制；阅读视图 + 模拟器视图 + 内嵌预测题。
// 章节对应 Python 实战场次（S1–S9，见 ../AI助学手册.md）。
export const CHAPTERS = [
  // ============ 组 0 · 预备课 ============
  {
    id: 'c00', group: '预备课', title: '张量、形状与 PyTorch', mech: '数据的最小单位：多维表格',
    read: `
<p>10 分钟，补齐后面所有章节的地基。<b>遇到任何看不懂的词，别硬啃</b>——回对话问 AI 助教（<code>tutor/prompts.md</code> 的 ① 号摸底卡），每个概念的补课成本是分钟级。</p>
<h3>张量 = 一堆数字摆成的规整形状</h3>
<p>名字唬人，本质是"多维表格"。去右侧模拟器把阶梯从 0 维一路升到 4 维：</p>
<ol>
<li><b>0 维</b>：一个数——某个像素的亮度；</li>
<li><b>1 维</b>：一行数（向量）——Excel 里的一列；</li>
<li><b>2 维</b>：一张表（矩阵）——一张 28×28 的灰度图；</li>
<li><b>3 维</b>：一摞表——RGB 彩图 = 3 张亮度表叠起来；</li>
<li><b>4 维</b>：一摞"一摞表"——一批 100 张图同时送进模型。</li>
</ol>
<p>深度学习的一切数据（文字、图片、声音）进模型前都被转成张量；"模型处理数据"就是"对这些表格做乘法和加法"。听到"128 维张量"不用慌——那只是一串很长的数。</p>
<h3>形状：这摞数字的摆放说明</h3>
<p><code>(3, 4)</code> 读作"3 行 4 列的表格"；<code>(2, 3, 28, 28)</code> 读作"2 张、3 通道、28×28"——一批 2 张 RGB 彩图。"维度"就是有几个方向可以索引。</p>
<h3>PyTorch 是什么</h3>
<p>一个 <b>Python 库</b>（别人写好的工具包，<code>pip install</code> 装进来、<code>import torch</code> 就能用）。它干三件事：</p>
<ul>
<li><b>张量运算</b>：加强版 Excel，一行代码做矩阵乘法，还能调用 Mac 的 GPU 提速；</li>
<li><b>自动求导</b>：你算 y，它自动算梯度——c03 开始的主题；</li>
<li>把这两样拼成训练神经网络的标准零件（c09 的训练循环）。</li>
</ul>
<p class="tip">类比：Python 是厨房，PyTorch 是自动料理机。阶段 0 = 拆开看它怎么炒菜；阶段 1 = 自己掌勺。准备好了就去 c01——看两张表格运算时"形状怎么配"。</p>`,
    quiz: [
      { q: '一张 28×28 的灰度图，用张量表示形状是？', kind: 'choice', options: [{ t: '(28, 28)', correct: true, why: '' }, { t: '(28, 1)', correct: false, why: '' }, { t: '28', correct: false, why: '' }], why: '2 维：高 × 宽，每个元素是一个亮度值。' },
      { q: '一批 100 张 RGB 彩图（每张 28×28），形状是？', kind: 'choice', options: [{ t: '(100, 3, 28, 28)', correct: true, why: '' }, { t: '(3, 28, 28)', correct: false, why: '' }, { t: '(100, 28, 28)', correct: false, why: '' }], why: '批 × 通道 × 高 × 宽（惯例叫 NCHW）：100 张图，每张 3 个颜色通道，每个通道 28×28。' },
      { q: '给这批 100 张彩图的每一个像素统一加 0.1，最省事的写法是？', kind: 'choice', options: [{ t: 't + 0.1（广播自动摊到所有元素）', correct: true, why: '' }, { t: '写四重循环逐个加', correct: false, why: '' }, { t: '先造一个 (100,3,28,28) 的 0.1 张量再相加', correct: false, why: '' }], why: '标量会广播到每个元素——这就是广播存在的意义：用直觉写法，框架负责展开。' },
      { q: '用自己的话说：PyTorch 是什么？', kind: 'text', why: '参考：一个 Python 库，提供张量运算（可用 GPU）+ 自动求导，两者拼成训练神经网络的标准零件。能说到"它帮我自动算梯度"就算过关。' },
    ],
    sim: { type: 'ladder' },
  },

  // ============ 组 A · 张量 ============
  {
    id: 'c01', group: '张量', title: '形状与广播', mech: 'broadcasting 末维对齐',
    read: `
<p class="tip">🔗 前置：<b>c00 预备课</b>。"张量""形状 (3,4)"这两个说法还不踏实的话，先回上一章玩 10 分钟张量阶梯。</p>
<p>深度学习里所有数据都是张量。多数"形状报错"都源于同一个规则没吃透：<b>广播（broadcasting）</b>。</p>
<p>两个张量运算时，PyTorch 从<b>最后一个维度起向前逐对比较</b>：</p>
<ol>
<li>两边维度数可以不同——缺的维度当作 1；</li>
<li>每一对维度，要么<b>相等</b>，要么<b>有一方是 1</b>（此时逻辑拉伸，不复制内存）；</li>
<li>任何一对都不满足 → <code>RuntimeError</code>。</li>
</ol>
<p>在右侧模拟器里把 ①②③ 三个预设都点一遍：① 和 ② 只差一个维度，结果一个是 (3,4)、一个是报错。</p>
<p class="tip">Python 实战：这些题的完整版在 <code>tutor/experiments_s1_张量.md</code>（11 题），模拟器只是预演——真正跑 <code>torch</code> 的手感要在终端里建立。</p>`,
    quiz: [
      { code: 'a = torch.ones(3, 4)\nb = torch.ones(4)\nprint((a + b).shape)', q: '输出形状是？', kind: 'choice', options: [{ t: '(3, 4)', correct: true, why: '' }, { t: '(3, 3)', correct: false, why: '' }, { t: '报错', correct: false, why: '' }], why: '(4,) 末维与 a 的末维 4 相等，前面补 1 拉伸 → (3,4)。' },
      { code: 'a = torch.ones(3, 4)\nb = torch.ones(3)\nprint((a + b).shape)', q: '这次输出什么？', kind: 'choice', options: [{ t: '(3, 4)', correct: false, why: '' }, { t: '报错', correct: true, why: '' }, { t: '(4, 4)', correct: false, why: '' }], why: '末维对齐 4 vs 3，既不相等也无人是 1 → RuntimeError。①② 差一个维度，命运完全不同。' },
      { code: 'a = torch.ones(3, 1)\nb = torch.ones(1, 4)\nc = a + b', q: 'c 的形状？c 一共有几个元素？', kind: 'number', answer: 12, why: '形状 (3,4)；广播是逻辑拉伸，但结果张量是真实分配的 12 个元素。' },
    ],
    sim: { type: 'tensor' },
  },
  {
    id: 'c02', group: '张量', title: '视图与内存共享', mech: 'view/transpose 零拷贝',
    read: `
<p><code>view / reshape / t() / 切片</code> 这些形状操作<b>不复制数据</b>——它们返回的"视图"和原张量指向同一块内存。</p>
<p>这是一把双刃剑：</p>
<ul>
<li>✅ 快、省内存（深层网络里 reshape 每秒发生千万次）；</li>
<li>⚠️ 改视图 = 改原张量。"我没动它啊"类 bug 一半源于此。</li>
</ul>
<p>右侧预设 ④ 演示了最经典的一幕：<code>b = a.view(4,3)</code> 后改 <code>b[0,0]</code>，<code>a[0,0]</code> 同步变 99。</p>
<p class="tip">什么时候会真复制？<code>contiguous()</code> 被迫执行时、<code>.clone()</code>、跨设备 <code>.to('mps')</code>。</p>`,
    quiz: [
      { code: 'a = torch.arange(12).reshape(3, 4)\nb = a.view(4, 3)\nb[0, 0] = 99\nprint(a[0, 0])', q: '打印什么？', kind: 'number', answer: 99, why: 'view 共享内存。想独立副本要 a.clone().view(4,3)。' },
      { code: 'x = torch.ones(3)\nn = x.numpy()\nn[0] = 7\nprint(x[0].item())', q: '打印什么？', kind: 'number', answer: 7, why: 'torch ↔ numpy（CPU）同样零拷贝共享。' },
      { q: '训练循环里 loss_history.append(loss)（不带 .item()）会有什么隐患？', kind: 'text', why: '每个 loss 拖着整张计算图不释放 → 内存持续增长。.item() 取出原生 float 即与图脱钩。' },
    ],
    sim: { type: 'tensor', preset: 3 },
  },

  // ============ 组 B · autograd ============
  {
    id: 'c03', group: 'autograd', title: '计算图与 backward', mech: '动态建图 + 链式法则',
    read: `
<p>PyTorch 的每一次运算都在现场搭建一张<b>计算图</b>：节点是张量，边是运算。调用 <code>loss.backward()</code> 时，框架从 loss 出发<b>沿图反向</b>，用链式法则把梯度逐节点回传，累加进每个叶子张量的 <code>.grad</code>。</p>
<p>右侧交互台输入一个表达式试试，比如 <code>a*b + a*c + b*c</code>：</p>
<ul>
<li>点「反向传播」，看梯度如何<b>逆拓扑序</b>逐节点点亮；</li>
<li>把 a 的值改一改再反向，观察梯度怎么随之变化——这就是"动态图"：图是每个迭代现场搭的。</li>
</ul>
<p>本章的 Python 对应物：你要在 S3 禁写区里亲手把这个引擎造出来（micrograd，约百行）。</p>`,
    quiz: [
      { code: 'x = torch.tensor(2.0, requires_grad=True)\ny = x ** 3\ny.backward()\nprint(x.grad)', q: '打印什么？', kind: 'number', answer: 12, why: 'dy/dx = 3x² = 12。backward 把 ∂y/∂x 写进 x.grad。' },
      { code: 'x = torch.tensor([1.0, 2.0], requires_grad=True)\ny = x * 2\ny.backward()', q: '正常运行还是报错？', kind: 'choice', options: [{ t: '正常运行', correct: false, why: '' }, { t: '报错：只有标量能隐式 backward', correct: true, why: '' }], why: '反向传播需要"一个数"当起点；非标量要显式传 grad_output。所以训练里 loss 必须约简为标量。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c04', group: 'autograd', title: '梯度累加与清零', mech: '.grad 是 += 语义',
    read: `
<p>本章只有一个结论，但它是阶段 0 出现率第一的 bug 的病根：</p>
<p style="text-align:center" class="callout"><code>.grad</code> 是<b>累加</b>的，不是覆盖的。</p>
<p>设计原因：多次反向叠加是合法需求（梯度累积、多损失合并）。代价是训练循环必须<b>自己清零</b>（<code>optimizer.zero_grad()</code>）。</p>
<p>右侧实验：连续点两次「反向传播」，看 grad 变成 2 倍；再点「清零梯度」恢复。S6 坏代码门诊的病灶①就是忘了这件事。</p>`,
    quiz: [
      { code: 'x = torch.tensor(1.0, requires_grad=True)\ny = x * 2\ny.backward(retain_graph=True)\ny.backward(retain_graph=True)\nprint(x.grad)', q: 'x.grad 是多少？', kind: 'number', answer: 4, why: '2 + 2 = 4。两次 backward，梯度累加两次。' },
      { q: '一个 for 循环里跑了 3 次 backward 但从不清零，x.grad 等于单次梯度的几倍？', kind: 'number', answer: 3, why: '3 倍。等效学习率被悄悄放大 3 倍——训练后期突然震荡/爆炸的常见根源。' },
      { q: '为什么框架不把"每次 backward 前自动清零"设为默认？', kind: 'text', why: '累加本身是特性：梯度累积（大 batch 模拟）、多个 loss 合并都依赖它。框架把"清零"的责任交给训练循环语义。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c05', group: 'autograd', title: '手写线性回归', mech: '无框架训练循环',
    read: `
<p>把 c03/c04 拼起来，就是训练循环的雏形。不用 <code>nn.Linear</code>、不用 optimizer，15 行拟合 y = 3x + 1：</p>
<pre>for step in range(200):
    pred = w * x + b                 # ① 前向
    loss = ((pred - y) ** 2).mean()  # ② 损失
    loss.backward()                  # ③ 反向（梯度自动就位）
    with torch.no_grad():            # ④ 更新（不要建图！）
        w -= lr * w.grad
        b -= lr * b.grad
        w.grad.zero_(); b.grad.zero_()  # ⑤ 清零</pre>
<p>右侧模拟器就是这个循环的实时可视化：点「训练」或「单步」，看绿线如何逼近黄点、w/b 如何爬向 3.00 / 1.00。把学习率调到 10 试试——这就是"步长过大"的手感。</p>`,
    quiz: [
      { q: '参数更新为什么必须包在 no_grad 里？', kind: 'text', why: '不包：对叶子张量的原地写直接报错（leaf Variable ... in-place operation）；即便绕过，更新本身也会被记进图，下一步 backward 会沿"参数更新"这条路径乱求导，且内存持续膨胀。' },
      { code: 'w = torch.randn(1, requires_grad=True)\nfor i in range(5):\n    loss = (w * 1).sum()\n    loss.backward()\n    with torch.no_grad():\n        w -= 0.1 * w.grad', q: '这段代码（无清零）跑完，等效学习率被放大了几倍？', kind: 'number', answer: 5, why: '第 k 次迭代时 w.grad 累了 k 份梯度。补上 w.grad.zero_() 才正确。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'fit', lr: 0.1 } },
  },

  // ============ 组 C · micrograd ============
  {
    id: 'c06', group: 'micrograd', title: 'Value：一个节点', mech: 'data + grad + _children + _backward',
    read: `
<p>现在开始造引擎。一个 <code>Value</code> 只需要四样东西：</p>
<pre>class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data            # 数值本身
        self.grad = 0               # d(loss)/d(self)，backward 时填充
        self._backward = lambda: None  # 如何把自己的 grad 传给孩子（闭包）
        self._prev = set(_children)    # 我从哪些节点算出来的
        self._op = op                  # 用什么运算（调试/建图用）</pre>
<p>关键设计：<code>_backward</code> 是<b>建图现场</b>定义的闭包——<code>__add__</code> 创建 out 时，顺手把"out 的梯度如何分给 self 和 other"写进 out 的口袋里。之后 <code>backward()</code> 只需按顺序掏出口袋里的函数挨个调用。</p>
<p>右侧交互台就是这套机制跑起来的样子：每个节点口袋里存着 data / grad / 运算名。</p>
<p class="tip">S3 禁写区规则：AI 只准提问不准给代码。打开 <code>tutor/prompts.md</code> 贴 ③ 号卡开工。</p>`,
    quiz: [
      { q: '加法节点的 _backward 闭包，为什么必须写 self.grad += out.grad 而不是 = ？', kind: 'text', why: '一个节点可能被多条路径使用（a*b + a*c）。+= 让多路径梯度汇合（乘积求导法则的"相加"项）；= 会被后一条路径覆盖。' },
      { q: '_prev 用 set 还是 list 有讲究吗？a + a 会发生什么？', kind: 'text', why: 'micrograd 用 set：(a,a) 去重后孩子仍能拿到两次累加吗？会——_backward 闭包体写了两句 self.grad += out.grad（self 和 other 是同一个对象），所以 a.grad 正确等于 2×out.grad。去重只影响拓扑序，不影响闭包逻辑。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c07', group: 'micrograd', title: '拓扑排序与全图反向', mech: '逆拓扑序调用 _backward',
    read: `
<p>有了单节点的 <code>_backward</code>，全图反向只剩一个顺序问题：<b>必须保证一个节点的 _backward 在它所有消费者都处理完之后才执行</b>——否则它读到的 out.grad 还不完整。</p>
<p>这就是<b>拓扑排序</b>：深度优先后序遍历，再<b>倒过来</b>调用。约 8 行：</p>
<pre>def backward(self):
    topo, visited = [], set()
    def build(v):
        if v not in visited:
            visited.add(v)
            for child in v._prev:
                build(child)
            topo.append(v)
    build(self)
    self.grad = 1
    for v in reversed(topo):
        v._backward()</pre>
<p>右侧交互台的「反向传播」动画，亮灯顺序就是 reversed(topo)。</p>`,
    quiz: [
      { q: '顺序反了（正拓扑序调用 _backward）会怎样？', kind: 'text', why: '上游节点被调用时它的 out.grad 还没被下游写全，回传的是残缺梯度——程序不报错但数值错，比崩溃更难发现。' },
      { code: '# 表达式 f = a*b + a*c + b*c，a=2, b=-1, c=0.5\n# 假设所有 += 都被误写成 =\nprint(a.grad)  # 实际会是多少？正确值是多少？', q: 'a.grad：误写后 / 正确值 分别是？', kind: 'text', why: '三条路径 a*b、a*c、b*c 都给 a 贡献梯度：正确 = b+c = -0.5。误写 = 只剩最后一条路径写的值（c·out.grad），且依赖遍历顺序——必错。用 tutor/gradcheck.py 对拍就能当场抓住。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c08', group: 'micrograd', title: '从 Value 到 MLP', mech: 'Neuron / Layer / MLP 组装',
    read: `
<p>引擎有了，往上搭神经网络只是"把 Value 组装起来"：</p>
<ul>
<li><b>Neuron</b>：n 个权重 w + 1 个偏置 b，前向 = Σ wᵢxᵢ + b → 激活；</li>
<li><b>Layer</b>：一排 Neuron；<b>MLP</b>：一排 Layer。三者共享 <code>parameters()</code> 接口；</li>
<li>训练循环和 c05 手写线性回归<b>一模一样</b>——只是 forward 换成了 MLP。</li>
</ul>
<p>右侧训练场：整张神经网络的每一个权重都是真的用 Value 引擎算的（就是你在 S3/S4 写的那套）。点「训练」，看决策边界怎么长出来。试试把隐层从 [8,8] 换成 [4]，或把激活换掉，感受"容量"与"激活函数"对边界形状的影响。</p>
<p class="tip">Python 实战：S4 用你的引擎在 <code>tutor/data_moons.py</code> 的双月牙上复现同款结果。</p>`,
    quiz: [
      { q: '隐层 [4] 训练双月牙和 [8,8] 有什么可感知差异？为什么？', kind: 'text', why: '[4] 容量小：边界更"直"，月牙交界处分不开、loss 更高。容量 ↔ 数据复杂度要匹配。' },
      { q: '整个 MLP 的 parameters() 返回的是什么？zero_grad() 又是对什么操作？', kind: 'text', why: '所有 w 和 b（Value 节点）的列表；zero_grad 把每个 p.grad 置 0——c04 的结论在模型层面的落地。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.5 } },
  },

  // ============ 组 D · 训练循环与验收 ============
  {
    id: 'c09', group: '训练循环', title: '五件套与单步执行', mech: 'batch → forward → zero_grad → backward → step',
    read: `
<p>标准训练循环五件套，顺序固定：</p>
<pre>for epoch in range(epochs):          # 遍历全数据几轮
    for x, y in loader:              # ① 取一个 batch
        opt.zero_grad()              # ③ 清零（放前面也行，必须在 backward 前）
        logits = model(x)            # ② 前向
        loss = lossfn(logits, y)
        loss.backward()              # ④ 反向
        opt.step()                   # ⑤ 更新</pre>
<p>右侧训练场打开「单步」按钮：每按一次只跑一个 batch，五件套面板高亮当前阶段。盯着它走 10 步，五件套就从"背下来的顺序"变成"手上的肌肉记忆"。</p>
<p class="tip">loss 曲线开始是锯齿——那是 batch 间噪声，正常；看趋势不看单点。</p>`,
    quiz: [
      { q: 'zero_grad 放在循环开头和放在 backward 前一行，有区别吗？放在 step 之后、下一轮 backward 之前呢？', kind: 'text', why: '前两者等价（关键是"下一次 backward 之前清掉"）；第三种写法语义上会把"刻意梯度累积"误清掉，且习惯上清零属于"为反向做准备"。' },
      { q: 'epoch / batch / step 三个概念的关系一句话说清。', kind: 'text', why: '一个 epoch = 遍历全部训练数据一次；数据被切成若干 batch；每个 batch 做一次参数更新 = 一个 step。steps_per_epoch = ceil(N / batch)。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.5, showStep: true } },
  },
  {
    id: 'c10', group: '训练循环', title: '坏代码门诊', mech: '5 个病灶的可视化症状',
    read: `
<p>阶段 0 出现率最高的 5 个 bug，全部做成了可勾选的"病灶"——勾上再训练，实时观察症状：</p>
<table class="mini-table">
<tr><th>病灶</th><th>症状指纹</th></tr>
<tr><td>① 忘 zero_grad</td><td>前十几步正常下降，随后震荡、后期恶化（等效步长被偷偷放大）</td></tr>
<tr><td>② 学习率 ×50</td><td>第一步就爆炸，loss 在数量级间乱跳，acc 停在随机水平</td></tr>
<tr><td>③ 忘 backward</td><td>loss 恒定 2.30（=ln10），acc 冻结——step() 对空梯度静默跳过，<b>不报错</b></td></tr>
<tr><td>④ 输出双重激活</td><td>能学但极慢（对应 Python 版"先 softmax 再喂 CrossEntropyLoss"）</td></tr>
<tr><td>⑤ 忘 eval()（Dropout 仍在）</td><td>test acc 卡在低位且回落波动，train acc 却正常上升</td></tr>
</table>
<p>⚠️ 浏览器版用 tanh+MSE、纯 JS MLP 模拟，症状与你的 Python/Fashion-MNIST 版<b>同型不同值</b>。精确的数字指纹（如 bug2 第 2 步 6258）在 <code>tutor/bug_clinic/</code> 的 Python 脚本里——那里才是正式门诊。</p>`,
    quiz: [
      { q: '5 个病灶里哪几个不报任何错？这对排错方法论意味着什么？', kind: 'text', why: '①③⑤（加上症状轻微的④）。深度学习的大部分 bug 是"静默错误"——不崩溃、只变差。所以要有 baseline 对照、要会读 loss 曲线形态，而不是等报错。' },
      { q: '病灶①和②都在"步长过大"，为何曲线形态不同？', kind: 'text', why: '① 是有效步长随迭代线性增长：先正常后恶化，有"蜜月期"；② 从第一步就超标：立即爆炸没有蜜月期。形态差异直接指向根因。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.2, bugs: { noZeroGrad: false, bigLr: false, noBackward: false, doubleAct: false, noEvalDropout: false } } },
  },
  {
    id: 'c11', group: '训练循环', title: '真实数据：Fashion-MNIST', mech: '数据 → 模型 → 训练 → 验证',
    read: `
<p>浏览器模拟到此为止——真实数据集要回 Python 打。本章没有模拟器，只有一张作战地图：</p>
<ol>
<li><b>照教材跑通</b>：[zh.d2l.ai](https://zh.d2l.ai) 3.5–3.7 节，softmax 回归吃 Fashion-MNIST（代码在 <code>exercises/03_d2l_mnist/</code>）；</li>
<li><b>变异实验 ×3</b>（先预测再运行）：lr ∈ {0.01, 0.1, 1.0}；batch ∈ {32, 256}；隐层宽度 ∈ {8, 256}。本机实测基线：lr=0.1、3 epoch、2000 样本 → val acc ≈ 73%；</li>
<li><b>每组写一句结论</b>进笔记（例：lr=1.0 时曲线____，说明____）。</li>
</ol>
<p>你在 c05–c10 建立的所有直觉（累加、步长、静默 bug、容量）都会在真实数据上得到印证——只是每次训练从毫秒变成分钟。</p>`,
    quiz: [
      { q: '为什么调参实验必须"先预测再运行"？', kind: 'text', why: '预测 = 强制调用已有心智模型；对错都会立刻校准它。只跑不预测，跑了也白跑——你看不出结果是在印证还是反驳你的理解。' },
      { q: 'batch=32 和 batch=256，同 lr 下 loss 曲线的"锯齿"有什么不同？', kind: 'text', why: '小 batch 噪声大（锯齿粗）但同步数下更新次数多、往往初期降得快；大 batch 曲线平滑但探索性弱。锯齿是梯度噪声的可视化。' },
    ],
    sim: null,
  },
  {
    id: 'c12', group: '训练循环', title: '脱稿验收', mech: '断 AI 演练 + 考官制',
    read: `
<p>整个 AI 助学模式的两道护栏，在本章闭合：</p>
<p><b>① 断 AI 演练</b>：不查教程，1 小时，从空文件写完"加载 → 模型 → 训练 → 验证"。AI 时代学习的最大风险是"AI 代写 = 零学习"，定期脱稿是唯一的防依赖疫苗。规则细节在 <code>exercises/04_mnist_solo/README.md</code>。</p>
<p><b>② 考官制</b>：写完 ≠ 学会。写完把代码交给 AI（prompts.md ⑤ 卡）：只找概念性误解、追问 5 个"为什么"、现场出 3 道附加题（"只加一行再提准确率"、"解释曲线某处为何变陡"）。≥2 道通过才算毕业。</p>
<p>最后用 <code>tutor/defense_训练循环_10问.md</code> 全量答辩（≥8 题讲清），然后：</p>
<pre>git tag phase0-graduate</pre>
<p>下一站：阶段 1，从空文件手写一个能生成文本的 GPT。到那时你会发现，这里的每一步都在给它铺路。</p>`,
    quiz: [
      { q: '为什么"跟 AI 学得很顺"反而是危险信号？', kind: 'text', why: '流畅性错觉：AI 的讲解和补全让每一步都很顺，但生成没发生在你身上。检验标准只有一个：断掉 AI 后你还能不能产出。' },
      { q: '答辩时"讲清"的标准是什么？（提示：不是背定义）', kind: 'text', why: '能从第一性原理推出、能举出反例/边界情况、能把概念落到自己写过的某行代码上。三条缺一，就还有误解没挖出来。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'xor', hidden: [8], lr: 0.5 } },
  },
];
