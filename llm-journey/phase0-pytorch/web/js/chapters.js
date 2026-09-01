// chapters.js — 阶段 0 的 13 章课程内容
// 形式借鉴 learn-claude-code：每章只加一个机制；阅读视图 + 模拟器视图 + 内嵌预测题。
// 写作原则：真实问题开路 → 机制 → 为什么成立 → 🤔 留给你想 → 🏛 权威佐证（可查证一手资料）。
// 章节对应 Python 实战场次（S1–S9，见 ../AI助学手册.md）。
export const CHAPTERS = [
  // ============ 组 0 · 预备课 ============
  {
    id: 'c00', group: '预备课', title: '张量、形状与 PyTorch', mech: '数据的最小单位：多维表格',
    read: `
<p>有一句在圈子里流传甚广、略显暴躁的总结：<b>深度学习，本质上就是大规模的线性代数。</b>《Deep Learning》教材（Goodfellow、Bengio、Courville 著，MIT Press）整整第二章只讲一件事——线性代数，并把它称作深度学习的数学地基。所以你的第一课不是"网络"，而是这门学科全部数据的居所：<b>张量</b>。</p>
<p>名字唬人，本质是"多维表格"。去右侧模拟器把阶梯从 0 维一路升到 4 维，每升一级，问自己一个问题：这东西我在现实里见过吗？</p>
<ol>
<li><b>0 维</b>：一个数——某个像素的亮度；</li>
<li><b>1 维</b>：一行数（向量）——Excel 里的一列；</li>
<li><b>2 维</b>：一张表（矩阵）——一张 28×28 的灰度图；</li>
<li><b>3 维</b>：一摞表——RGB 彩图 = 3 张亮度表叠起来；</li>
<li><b>4 维</b>：一摞"一摞表"——一批 100 张图同时送进模型。</li>
</ol>
<p>想通这个阶梯，你就明白了为什么深度学习的一切——文字、图片、声音——进模型前都被转成张量：因为模型做的全部事情，就是<b>对这些表格反复做乘法和加法</b>。听到"128 维张量"不用慌，那只是一串很长的数。</p>
<h3>形状：这摞数字的摆放说明</h3>
<p><code>(3, 4)</code> 读作"3 行 4 列的表格"；<code>(2, 3, 28, 28)</code> 读作"2 张、3 通道、28×28"——一批 2 张 RGB 彩图。"维度"就是有几个方向可以索引，仅此而已。</p>
<h3>PyTorch 在这个厨房里的位置</h3>
<p>Python 是厨房，PyTorch 是自动料理机——一个 <b>Python 库</b>（别人写好的工具包，<code>pip install</code> 装进来、<code>import torch</code> 就能用）。它干三件事：<b>张量运算</b>（加强版 Excel，还能调用 Mac 的 GPU）；<b>自动求导</b>（你算 y，它自动算梯度——c03 的主角）；把这两样拼成训练神经网络的标准零件（c09 的训练循环）。2019 年 PyTorch 团队在 NeurIPS 发表的论文标题起得很诚实：《PyTorch: An Imperative Style, High-Performance Deep Learning Library》——一个"命令式风格的高性能深度学习<b>库</b>"，不玄，就是库。</p>
<p class="soul">🤔 留给你想：深度学习偏偏选中了"表格"（线性代数）作为母语，而不是别的数学分支。提示：想想"加法"和"乘法"在显卡上有多快。这个问题想通了，后面所有章节都会顺一点。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Goodfellow, Bengio & Courville,《Deep Learning》第 2 章（MIT Press，官网 <a href="https://www.deeplearningbook.org" target="_blank">deeplearningbook.org</a> 全书免费）</li>
<li>Grant Sanderson（3Blue1Brown），《线性代数的本质》视频系列——全 YouTube 公认最直观的矩阵直觉课（<a href="https://www.3blue1brown.com/topics/linear-algebra" target="_blank">官方页面</a>）</li>
<li>Paszke et al., <a href="https://arxiv.org/abs/1912.01703" target="_blank">PyTorch: An Imperative Style, High-Performance Deep Learning Library</a>, NeurIPS 2019</li>
<li>李沐《动手学深度学习》第 2 章"预备知识"（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>，免费在线）</li>
</ul></details>`,
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
<p>设想一个真实任务：一万张图，每张都要减去自己的平均亮度。笨办法是再造一万张"平均图"来相减；而你脑内的直觉说的是另一句话——<b>"把这一个数，摊给每个像素就行。"</b>恭喜，你的直觉就是广播（broadcasting）。NumPy 官方文档做的，只是把这条直觉写成了法律条文。</p>
<p>法条全文三条（从最后一个维度起，向前逐对比较）：</p>
<ol>
<li>两边维度数可以不同——缺的维度当作 1；</li>
<li>每一对维度，要么<b>相等</b>，要么<b>有一方是 1</b>（此时逻辑拉伸，不复制内存）；</li>
<li>任何一对都不满足 → <code>RuntimeError</code>。</li>
</ol>
<p>为什么偏偏从末维开始对齐？因为内存是"一行接一行"平铺的，<b>最后一个维度是物理上最连续的方向</b>——从最连续的地方做对齐检查，拉伸起来最省事。右侧模拟器把 ①②③ 三个预设都点一遍：① 和 ② 只差一个维度，命运一个是 (3,4)、一个是报错。</p>
<p class="soul">🤔 留给你想：广播拉伸是"逻辑复制"——不真复制。这个设计让一次 1TB 规模的运算跑进了 8GB 内存。请想想：省的是什么？什么时候它又必须真复制（提示：写结果需要地方放）？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>NumPy 官方文档·Broadcasting（<a href="https://numpy.org/doc/stable/user/basics.broadcasting.html" target="_blank">numpy.org/doc → broadcasting</a>），PyTorch 广播语义与之一脉相承</li>
<li>Harris et al., <a href="https://www.nature.com/articles/s41586-020-2649-2" target="_blank">Array programming with NumPy</a>, Nature 585 (2020)——NumPy 登上《自然》的正名之作</li>
<li>CS231n（斯坦福）课程笔记 · Python/NumPy 教程（<a href="https://cs231n.github.io/" target="_blank">cs231n.github.io</a>）</li>
<li>李沐《动手学深度学习》2.1 节·数据操作</li>
</ul></details>`,
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
<p>调试圈的"都市传说"排行榜上，这一条常年霸榜：<i>"我真的没动它，它自己变的。"</i>破案线索只有一个：<code>view / reshape / t() / 切片</code> 这些形状操作<b>不复制数据</b>——它们返回的"视图"和原张量指向<b>同一块内存</b>。</p>
<p>理解它的钥匙是：一个张量 = 一坨数据 + 一份"怎么看这坨数据"的说明书（形状 + 步长）。<code>view(4,3)</code> 只是重写了说明书，数据原地不动。这既是性能的礼物（深层网络里 reshape 每秒发生千万次，零拷贝），也是 bug 的温床（改视图 = 改原张量）。右侧预设 ④ 是案发现场：<code>b = a.view(4,3)</code> 之后改 <code>b[0,0]</code>，<code>a[0,0]</code> 同步变 99。</p>
<p>顺带一提：NumPy 因为这套设计足够重要，2020 年在《自然》杂志上发了论文——一个"工具包"上 Nature，因为它撑起了大半个科学计算世界。你正在学的不是某个 API，是这条生态地基的承重墙。</p>
<p class="soul">🤔 留给你想：什么时候必须<b>真复制</b>？（<code>.clone()</code>、跨设备 <code>.to('mps')</code>、某些非连续内存的 <code>contiguous()</code>。）工程里"快"和"不出鬼"经常打架，你的取舍原则是什么？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Harris et al., <a href="https://www.nature.com/articles/s41586-020-2649-2" target="_blank">Array programming with NumPy</a>, Nature 585 (2020)——视图/步长（stride）机制的源头设计</li>
<li>PyTorch 官方文档 · Tensor Views（pytorch.org/docs → tensor view）</li>
<li>李沐《动手学深度学习》2.1 节·内存开销讨论</li>
</ul></details>`,
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
<p>1986 年，Rumelhart、Hinton 与 Williams 在《Nature》上发表了一篇短短几页的论文《Learning representations by back-propagating errors》，让"反向传播"一举复活——今天所有神经网络训练，都是这篇论文的续集。它优雅到只有一个数学内核：<b>微积分的链式法则</b>（莱布尼茨时代就有的老规矩）。</p>
<p>PyTorch 的做法是把链式法则"工程化"：每一次运算都在现场搭一张<b>计算图</b>——节点是张量，边是运算。调用 <code>loss.backward()</code> 时，从 loss 出发<b>沿图反向</b>，把梯度逐节点回传，累加进每个叶子张量的 <code>.grad</code>。PyTorch 用的是"动态图"：像即兴爵士，每个迭代现场编曲；与之相对的 TensorFlow 1.x 是"静态图"：先写总谱再演奏。</p>
<p>右侧交互台输入 <code>a*b + a*c + b*c</code> 点「反向传播」，看梯度如何<b>逆拓扑序</b>逐节点点亮——那就是 1986 年那篇论文在浏览器里的样子。</p>
<p>还有一个值得咂摸的经济学问题：求梯度为什么必须从输出往回走？往回走一遍，<b>所有</b>输入的梯度同时到手；顺着走（前向模式微分），每换一个输入就得重走一遍。变量成千上万、输出只有一个——反向，是唯一划算的方向。</p>
<p class="soul">🤔 留给你想：链式法则高中就学过，为什么直到 1986 年才有人想到用它训练多层网络？（提示：差的不数学，是"怎么组织计算"——这也许能让你对'工程'二字肃然起敬。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Rumelhart, Hinton & Williams, <a href="https://www.nature.com/articles/323533a0" target="_blank">Learning representations by back-propagating errors</a>, Nature 323 (1986)</li>
<li>Andrej Karpathy（前 Tesla AI 总监）· <a href="https://www.youtube.com/watch?v=VMj-3S51tku" target="_blank">The spelled-out intro to neural networks and backpropagation</a>——本阶段代码主线的原片</li>
<li>3Blue1Brown · 反向传播系列视频（神经网络第 3–4 集，官方页 <a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank">3blue1brown.com</a>）</li>
<li>CS231n 课程笔记 · Backprop（<a href="https://cs231n.github.io/optimization-2/" target="_blank">cs231n.github.io/optimization-2</a>）</li>
</ul></details>`,
    quiz: [
      { code: 'x = torch.tensor(2.0, requires_grad=True)\ny = x ** 3\ny.backward()\nprint(x.grad)', q: '打印什么？', kind: 'number', answer: 12, why: 'dy/dx = 3x² = 12。backward 把 ∂y/∂x 累加进 x.grad。' },
      { code: 'x = torch.tensor([1.0, 2.0], requires_grad=True)\ny = x * 2\ny.backward()', q: '正常运行还是报错？', kind: 'choice', options: [{ t: '正常运行', correct: false, why: '' }, { t: '报错：只有标量能隐式 backward', correct: true, why: '' }], why: '反向传播需要"一个数"当起点；非标量要显式传 grad_output。所以训练里 loss 必须约简为标量。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c04', group: 'autograd', title: '梯度累加与清零', mech: '.grad 是 += 语义',
    read: `
<p>先看一段"程序员的禅"——《The Zen of Python》（Python 之禅，Tim Peters 写于 1999 年，PEP 20）第 2 条：<b>Explicit is better than implicit</b>（显式优于隐式）。PyTorch 把这句禅执行到了 .grad 上：<b>梯度是累加的（+=），且框架绝不替你清零</b>。</p>
<p>为什么这是立场而不是疏忽？因为"累加"本身是能力：梯度累积（小显存模拟大 batch）、多个损失合并求和，全靠它。框架要是好心替你清零，这些玩法就全废了。代价是：清零的责任落到训练循环头上（<code>optimizer.zero_grad()</code>）——而新手世界的第一大 bug，就诞生在这份被交还的责任里。</p>
<p>右侧实验：连续点两次「反向传播」，看 grad 变成 2 倍；点「清零梯度」恢复。S6 坏代码门诊的病灶①，病根就是这条禅语。</p>
<p class="soul">🤔 留给你想：一个 API 设计问题——"框架替你做"和"把控制权交给你"，边界应该画在哪？PyTorch 的答案几乎处处是后者，这也是它赢下研究圈的原因之一。你同意吗？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Tim Peters, <a href="https://peps.python.org/pep-0020/" target="_blank">PEP 20 — The Zen of Python</a>（1999）</li>
<li>Andrej Karpathy, <a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">A Recipe for Training Neural Networks</a>（2019）——"大多数训练 bug 是静默的"这一警告的出处级文献</li>
<li>PyTorch 官方文档 · Optimizer zero_grad()（pytorch.org/docs）</li>
</ul></details>`,
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
<p>"回归"这个词，是维多利亚时代一位绅士的失误。1886 年，弗朗西斯·高尔顿（达尔文的表弟）研究父母身高与子女身高的关系，发现子女身高会向平均值缩——他称之为 <i>regression towards mediocrity</i>（向平庸回归）。"回归分析法"从此得名，尽管今天的回归早已不管平庸不平庸。更早，1801 年高斯用最小二乘法从寥寥几笔观测中算出了失踪谷神星的轨道，震动天文界——"用一条直线去拟合散点"这件事，比神经网络早了整整两个世纪。</p>
<p>把 c03/c04 拼起来，你就在做高斯当年做的事，只是求导交给了 autograd：</p>
<pre>for step in range(200):
    pred = w * x + b                 # ① 前向
    loss = ((pred - y) ** 2).mean()  # ② 损失
    loss.backward()                  # ③ 反向（梯度自动就位）
    with torch.no_grad():            # ④ 更新（不要建图！）
        w -= lr * w.grad
        b -= lr * b.grad
        w.grad.zero_(); b.grad.zero_()  # ⑤ 清零</pre>
<p>右侧模拟器是这个循环的实时可视化：点「训练」或「单步」，看绿线如何逼近黄点、w/b 如何爬向 3.00 / 1.00。把学习率调到 10——你会亲眼看到"步子太大"的高斯会怎么摔跤。</p>
<p class="soul">🤔 留给你想：为什么是"平方"损失，而不是绝对值损失或四次方损失？（提示：平方在极值处可导、处处凸、还暗合"误差服从高斯分布"的最大似然假设——三个理由凑齐，它才坐稳了两百年。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Galton, <i>Regression towards mediocrity in hereditary stature</i>, 1886——"回归"一词的出生证明</li>
<li>Stephen Stigler,《The History of Statistics》(Harvard University Press)——最小二乘与谷神星的故事，史料的权威整理者</li>
<li>李沐《动手学深度学习》第 3 章·线性回归（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）</li>
</ul></details>`,
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
<p>SICP（《计算机程序的构造和解释》，MIT 传奇教材）序言里有一句话：<b>"程序是写给人读的，只是顺便让机器执行。"</b>本章就是一个绝佳的检验品：Karpathy 的 micrograd 只有约百行，却能训练出真的神经网络。它敢这么短，是因为它找到了<b>最小完备原语</b>——一个叫 <code>Value</code> 的类，四件东西：</p>
<pre>class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data            # 数值本身
        self.grad = 0               # d(loss)/d(self)，backward 时填充
        self._backward = lambda: None  # 如何把自己的 grad 传给孩子（闭包）
        self._prev = set(_children)    # 我从哪些节点算出来的
        self._op = op                  # 用什么运算（调试/建图用）</pre>
<p>最妙的设计是 <code>_backward</code> 这个<b>闭包</b>：<code>__add__</code> 创建 out 的<b>现场</b>，顺手把"out 的梯度如何分给 self 和 other"写进 out 的口袋。之后 <code>backward()</code> 只需按顺序掏出口袋里的函数挨个调用——数据与"如何回传"的知识绑在同一个对象身上，这正是面向对象的本质，也是"计算图"三个字第一次变成可以触摸的东西。</p>
<p>右侧交互台就是这套机制跑起来的样子：每个节点口袋里装着 data / grad / 运算名。</p>
<p class="soul">🤔 留给你想：为什么不写一个巨大的 switch（加法走加法梯度、乘法走乘法梯度），而要让每个节点自带 _backward？——提示：哪个版本加一种新运算时不用改旧代码？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Abelson & Sussman,《Structure and Interpretation of Computer Programs》(MIT Press) 序言——"写给人读的程序"</li>
<li>Andrej Karpathy · <a href="https://github.com/karpathy/micrograd" target="_blank">karpathy/micrograd</a> 仓库与<a href="https://www.youtube.com/watch?v=VMj-3S51tku" target="_blank">配套视频</a>（本仓库已内置副本）</li>
<li>李沐论文精读系列（<a href="https://github.com/mli/paper-reading" target="_blank">github.com/mli/paper-reading</a>）——下一步读论文时的中文地图</li>
</ul></details>`,
    quiz: [
      { q: '加法节点的 _backward 闭包，为什么必须写 self.grad += out.grad 而不是 = ？', kind: 'text', why: '一个节点可能被多条路径使用（a*b + a*c）。+= 让多路径梯度汇合（乘积求导法则的"相加"项）；= 会被后一条路径覆盖。' },
      { q: '_prev 用 set 还是 list 有讲究吗？a + a 会发生什么？', kind: 'text', why: 'micrograd 用 set：(a,a) 去重后孩子仍能拿到两次累加吗？会——_backward 闭包体写了两句 self.grad += out.grad（self 和 other 是同一个对象），所以 a.grad 正确等于 2×out.grad。去重只影响拓扑序，不影响闭包逻辑。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c07', group: 'micrograd', title: '拓扑排序与全图反向', mech: '逆拓扑序调用 _backward',
    read: `
<p>有了单节点的 <code>_backward</code>，全图反向只剩一个看起来人畜无害的问题：<b>按什么顺序调用？</b>答案藏在一个 1962 年就解决的问题里——拓扑排序（ Knuth《计算机程序设计艺术》第一卷里有经典论述，它原本的用场是装配线和菜谱：先切菜，再下锅）。</p>
<p>规则一句话：<b>一个节点的 _backward，必须在它所有的下游消费者都处理完之后才执行</b>——否则它读到的 out.grad 还不完整。深度优先后序遍历，再倒过来调用，约 8 行：</p>
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
<p>右侧交互台的「反向传播」动画，亮灯顺序就是 reversed(topo)。请特别留意一件事：如果顺序错了，程序<b>不报错</b>，只是梯度悄悄错掉——"静默错误"这个词，你在 c10 还会再见到。</p>
<p class="soul">🤔 留给你想：反向传播 = 链式法则（数学）+ 拓扑排序（调度）。为什么"伟大的算法"经常 = 一个老数学 + 一个朴素调度？你还能想到别的例子吗？（提示：FFT、动态规划。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Donald Knuth,《The Art of Computer Programming》Vol.1——拓扑排序的经典论述</li>
<li>Goodfellow et al.,《Deep Learning》第 6.5 节·计算图（<a href="https://www.deeplearningbook.org" target="_blank">deeplearningbook.org</a>）</li>
<li>Andrej Karpathy · micrograd 视频（<a href="https://www.youtube.com/watch?v=VMj-3S51tku" target="_blank">YouTube</a>）第 40 分钟起对拓扑序的可视化讲解</li>
</ul></details>`,
    quiz: [
      { q: '顺序反了（正拓扑序调用 _backward）会怎样？', kind: 'text', why: '上游节点被调用时它的 out.grad 还没被下游写全，回传的是残缺梯度——程序不报错但数值错，比崩溃更难发现。' },
      { code: '# 表达式 f = a*b + a*c + b*c，a=2, b=-1, c=0.5\n# 假设所有 += 都被误写成 =\nprint(a.grad)  # 实际会是多少？正确值是多少？', q: 'a.grad：误写后 / 正确值 分别是？', kind: 'text', why: '三条路径 a*b、a*c、b*c 都给 a 贡献梯度：正确 = b+c = -0.5。误写 = 只剩最后一条路径写的值（c·out.grad），且依赖遍历顺序——必错。用 tutor/gradcheck.py 对拍就能当场抓住。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c08', group: 'micrograd', title: '从 Value 到 MLP', mech: 'Neuron / Layer / MLP 组装',
    read: `
<p>神经网络的历史，是一部"捧杀与平反"的连续剧。1958 年，《纽约时报》报道 Rosenblatt 的感知机，用的是这样的句子：电子计算机的胚胎，将来会走路、说话、看见、书写、自我复制。1969 年，Minsky 与 Papert 用一本《Perceptrons》泼来冷水：一层感知机连 XOR（异或）都分不开。经费应声蒸发，史称第一次 AI 寒冬。</p>
<p>平反来得也不快：1989 年 Cybenko、1991 年 Hornik 先后证明<b>万能近似定理</b>——一层足够宽的隐层，能近似任意连续函数。理论赢了，实践还是冷了半截："能近似"不等于"学得动"：要拟合同样的曲线，浅而宽的网络所需宽度往往指数爆炸，而<b>深</b>网络用少量参数层层折叠就做到了。深度学习的"深"，是效率的胜利，不是宽度的胜利。</p>
<p>本章你亲手把这场平反跑起来。引擎（Value）已有，往上组装只是搭积木：<b>Neuron</b>（n 个权重 + 偏置 → 加权和 → 激活）、<b>Layer</b>（一排 Neuron）、<b>MLP</b>（一排 Layer），三者共享 <code>parameters()</code> 接口。训练循环和 c05 手写线性回归<b>一模一样</b>——变的只是 forward 的内容。右侧训练场每个权重都是真 Value 节点：点「训练」，看决策边界怎么长出来。</p>
<p class="soul">🤔 留给你想：Minsky 当年的批评其实是对的（一层就是不行），但结论"此路不通"错了。科学史上这种"对的理由推出错的结论"，还能想到哪次？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>《纽约时报》1958 年对 Rosenblatt 感知机的报道（"New Navy Device Learns By Doing"）</li>
<li>Minsky & Papert,《Perceptrons》(MIT Press, 1969)——XOR 批评的原始文献</li>
<li>Hornik, Stinchcombe & White, <i>Approximation capabilities of multilayer feedforward networks</i>, Neural Networks (1991)——万能近似定理</li>
<li>3Blue1Brown · 神经网络系列第 4 集"网络如何学习"（<a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank">3blue1brown.com</a>）</li>
</ul></details>`,
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
<p>Karpathy 写过一篇被反复引用的博客，《A Recipe for Training Neural Networks》（训练神经网络的食谱）。顶配研究员把毕生经验写成"菜谱"这个行为，透露了一个本质：<b>训练循环就是一个仪式，步骤固定、顺序神圣</b>：</p>
<pre>for epoch in range(epochs):          # 遍历全数据几轮
    for x, y in loader:              # ① 取一个 batch
        opt.zero_grad()              # ③ 清零（放前面也行，必须在 backward 前）
        logits = model(x)            # ② 前向
        loss = lossfn(logits, y)
        loss.backward()              # ④ 反向
        opt.step()                   # ⑤ 更新</pre>
<p>为什么值得当成"仪式"？试着问：JAX 的训练循环和 PyTorch 长得几乎一样，是巧合吗？不是——五件套是"训练"这个概念的最小完备集：数据 → 预测 → 打分 → 求责 → 改错。任何框架、任何规模的模型（包括 GPT），每个 step 都在做这五件事，只是 batch 变了几百万 token。你不是在学一个 API 的用法，是在学所有训练的骨架。</p>
<p>右侧训练场打开「单步」：每按一次只跑一个 batch，五件套面板高亮当前阶段。先看慢动作，再看直播——学动作的标准顺序，反了就懂不了。</p>
<p class="soul">🤔 留给你想：loss 曲线满是锯齿，正常吗？（正常——那是 batch 间噪声。）由此推一步：曲线"看趋势不看单点"，这个读法能否推广到生活里一切含噪声的过程？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Andrej Karpathy, <a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">A Recipe for Training Neural Networks</a>（2019）</li>
<li>Jeremy Howard & fast.ai《Practical Deep Learning for Coders》——训练循环教学法的另一所名门（<a href="https://course.fast.ai" target="_blank">course.fast.ai</a>）</li>
<li>李沐《动手学深度学习》第 4–5 章（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）</li>
</ul></details>`,
    quiz: [
      { q: 'zero_grad 放在循环开头和放在 backward 前一行，有区别吗？放在 step 之后、下一轮 backward 之前呢？', kind: 'text', why: '前两者等价（关键是"下一次 backward 之前清掉"）；第三种写法语义上会把"刻意梯度累积"误清掉，且习惯上清零属于"为反向做准备"。' },
      { q: 'epoch / batch / step 三个概念的关系一句话说清。', kind: 'text', why: '一个 epoch = 遍历全部训练数据一次；数据被切成若干 batch；每个 batch 做一次参数更新 = 一个 step。steps_per_epoch = ceil(N / batch)。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.5, showStep: true } },
  },
  {
    id: 'c10', group: '训练循环', title: '坏代码门诊', mech: '5 个病灶的可视化症状',
    read: `
<p>Karpathy 那篇《食谱》的第一节标题叫 <b>Don't be a hero</b>（别逞英雄）：训练中最重要的能力不是写出惊天架构，而是<b>盯着数字、相信读数、别脑补</b>。本章是这句话的实操课——深度学习与"传统软件"最大的分歧在此：传统程序坏了会崩（抛异常），<b>神经网络坏了只会变差</b>。它不崩溃，只堕落。</p>
<p>所以医生思路是最好的思路：先记健康人的体征（基线），再看病人哪里偏离。右侧训练场给你 5 个可勾选的"病灶"，勾上再训练，对照观察症状：</p>
<table class="mini-table">
<tr><th>病灶</th><th>症状指纹</th></tr>
<tr><td>① 忘 zero_grad</td><td>前十几步正常下降，随后震荡、后期恶化（等效步长被偷偷放大）</td></tr>
<tr><td>② 学习率 ×50</td><td>第一步就爆炸，loss 在数量级间乱跳，acc 停在随机水平</td></tr>
<tr><td>③ 忘 backward</td><td>loss 恒定 2.30（=ln10），acc 冻结——step() 对空梯度静默跳过，<b>不报错</b></td></tr>
<tr><td>④ 输出双重激活</td><td>能学但极慢（对应 Python 版"先 softmax 再喂 CrossEntropyLoss"）</td></tr>
<tr><td>⑤ 忘 eval()（Dropout 仍在）</td><td>test acc 卡在低位且回落波动，train acc 却正常上升</td></tr>
</table>
<p>病灶⑤里的 Dropout，本身是一段有趣的科学史：Hinton 在访谈里讲过灵感来源——他去银行办事，发现柜员总在换人，心想"员工频繁轮换，单个出纳就很难和其余人合谋作弊；大脑会不会也这样？"于是有了随机丢弃神经元的正则化（Srivastava 等 2014 年 JMLR 论文）。一个银行业观察，变成了一种防"神经元合谋"的技术。</p>
<p>⚠️ 浏览器版用 tanh+MSE、纯 JS MLP 模拟，症状与你的 Python/Fashion-MNIST 版<b>同型不同值</b>。精确的数字指纹（如 bug2 第 2 步 6258）在 <code>tutor/bug_clinic/</code> 的 Python 脚本里——那里才是正式门诊。</p>
<p class="soul">🤔 留给你想：5 个病灶里 3 个不报任何错。"静默失败"如何改变了工程方法论？（基线、可视化、单元验证、不相信"看起来在跑"。）这套方法论在你的本职工作里成立吗？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Andrej Karpathy, <a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">A Recipe for Training Neural Networks</a>（2019）——" Neuroscience of debugging"级的必读</li>
<li>Srivastava, Hinton et al., <a href="https://jmlr.org/papers/v15/srivastava14a.html" target="_blank">Dropout: A Simple Way to Prevent Neural Networks from Overfitting</a>, JMLR 2014</li>
<li>Ioffe & Szegedy, Batch Normalization (arXiv:1502.03167, 2015)——eval/train 模式之分的另一半主角</li>
</ul></details>`,
    quiz: [
      { q: '5 个病灶里哪几个不报任何错？这对排错方法论意味着什么？', kind: 'text', why: '①③⑤（加上症状轻微的④）。深度学习的大部分 bug 是"静默错误"——不崩溃、只变差。所以要有 baseline 对照、要会读 loss 曲线形态，而不是等报错。' },
      { q: '病灶①和②都在"步长过大"，为何曲线形态不同？', kind: 'text', why: '① 是有效步长随迭代线性增长：先正常后恶化，有"蜜月期"；② 从第一步就超标：立即爆炸没有蜜月期。形态差异直接指向根因。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.2, bugs: { noZeroGrad: false, bigLr: false, noBackward: false, doubleAct: false, noEvalDropout: false } } },
  },
  {
    id: 'c11', group: '训练循环', title: '真实数据：Fashion-MNIST', mech: '数据 → 模型 → 训练 → 验证',
    read: `
<p>先讲一个数据集的"人事更迭"。MNIST 手写数字，1998 年 LeCun 团队为邮件分拣与支票识别而造（那篇论文后来成了《Proceedings of the IEEE》的名篇）。此后二十多年，它被全人类反复刷榜——直到 2017 年，电商 Zalando 的研究团队发了一篇短文宣布：MNIST 太简单、太旧、被"洗"得太熟了，我们造了 Fashion-MNIST：同尺寸、同格式、换成 10 类服饰，肉眼更难。你要用的就是它。</p>
<p>这个故事有个经济学注脚，叫 <b>Goodhart 定律</b>：当一个指标变成目标，它就不再是个好指标。MNIST 99% 的准确率早已没有信息量——数据集本身也会"老化"。</p>
<p>浏览器模拟到此为止——真实数据集要回 Python 打。本章没有模拟器，只有一张作战地图：</p>
<ol>
<li><b>照教材跑通</b>：[zh.d2l.ai](https://zh.d2l.ai) 3.5–3.7 节，softmax 回归吃 Fashion-MNIST（代码在 <code>exercises/03_d2l_mnist/</code>）；</li>
<li><b>变异实验 ×3</b>（先预测再运行）：lr ∈ {0.01, 0.1, 1.0}；batch ∈ {32, 256}；隐层宽度 ∈ {8, 256}。本机实测基线：lr=0.1、3 epoch、2000 样本 → val acc ≈ 73%；</li>
<li><b>每组写一句结论</b>进笔记（例：lr=1.0 时曲线____，说明____）。</li>
</ol>
<p class="soul">🤔 留给你想：你在 c05–c10 建立的直觉（累加、步长、静默 bug、容量）马上要接受"分钟级训练"的检验。预测一下：哪个直觉会在真实数据上最走样？为什么？（预测本身就是本章要练的能力。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>LeCun, Bottou, Bengio & Haffner, <i>Gradient-based learning applied to document recognition</i>, Proceedings of the IEEE (1998)——MNIST 出生证明</li>
<li>Xiao, Rasul & Vollgraf, <a href="https://arxiv.org/abs/1708.07747" target="_blank">Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms</a> (2017)</li>
<li>李沐《动手学深度学习》3.5–3.7 节（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）</li>
</ul></details>`,
    quiz: [
      { q: '为什么调参实验必须"先预测再运行"？', kind: 'text', why: '预测 = 强制调用已有心智模型；对错都会立刻校准它。只跑不预测，跑了也白跑——你看不出结果是在印证还是反驳你的理解。' },
      { q: 'batch=32 和 batch=256，同 lr 下 loss 曲线的"锯齿"有什么不同？', kind: 'text', why: '小 batch 噪声大（锯齿粗）但同步数下更新次数多、往往初期降得快；大 batch 曲线平滑但探索性弱。锯齿是梯度噪声的可视化。' },
    ],
    sim: null,
  },
  {
    id: 'c12', group: '训练循环', title: '脱稿验收', mech: '断 AI 演练 + 考官制',
    read: `
<p>费曼去世后，人们在他在 Caltech 的办公室黑板上，留下了这样一行字：<b>"What I cannot create, I do not understand."</b>（我造不出的东西，就代表我不懂。）这块黑板今天还在。本章的验收制度，就是把这行字变成流程。</p>
<p>整个 AI 助学模式的两道护栏，在此闭合：</p>
<p><b>① 断 AI 演练</b>：不查教程，1 小时，从空文件写完"加载 → 模型 → 训练 → 验证"。规则细节在 <code>exercises/04_mnist_solo/README.md</code>。这不是怀旧，而是学习科学：Roediger 与 Karpicke 2006 年的实验表明，<b>主动提取（回忆并写出）对长期记忆的效果远胜反复阅读</b>——所谓 testing effect。看 AI 写一万行，不如自己闭卷写一百行。</p>
<p><b>② 考官制</b>：写完 ≠ 学会。把代码交给 AI（prompts.md ⑤ 卡）：只找概念性误解、追问 5 个"为什么"、现场出 3 道附加题（"只加一行再提准确率"、"解释曲线某处为何变陡"）。≥2 道通过才算毕业。</p>
<p>最后用 <code>tutor/defense_训练循环_10问.md</code> 全量答辩（≥8 题讲清），然后：</p>
<pre>git tag phase0-graduate</pre>
<p>下一站：阶段 1，从空文件手写一个能生成文本的 GPT。费曼那行黑板的下一个词，你会亲手创造出来。</p>
<p class="soul">🤔 留给你想：AI 时代，"能查到"和"会"的边界在哪里？一个可操作的定义：当工具不在时你剩下来的东西。你的"剩下来的东西"，现在有多少了？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li>Richard Feynman 的黑板留言（Caltech，1988）——"What I cannot create, I do not understand"</li>
<li>Roediger & Karpicke, <i>Test-Enhanced Learning</i>, Psychological Science (2006)——testing effect 的标志性实验</li>
<li>Andrej Karpathy · <a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">A Recipe for Training Neural Networks</a>——答辩问题的一大题源</li>
</ul></details>`,
    quiz: [
      { q: '为什么"跟 AI 学得很顺"反而是危险信号？', kind: 'text', why: '流畅性错觉：AI 的讲解和补全让每一步都很顺，但生成没发生在你身上。检验标准只有一个：断掉 AI 后你还能不能产出。' },
      { q: '答辩时"讲清"的标准是什么？（提示：不是背定义）', kind: 'text', why: '能从第一性原理推出、能举出反例/边界情况、能把概念落到自己写过的某行代码上。三条缺一，就还有误解没挖出来。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'xor', hidden: [8], lr: 0.5 } },
  },
];
