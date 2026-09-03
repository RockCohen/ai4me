// chapters.js — 互动课程内容（预备课 + 阶段 0 的 13 章 + 阶段 1 的 6 章 = 19 章）
// 形式借鉴 learn-claude-code：每章只加一个机制；阅读视图 + 模拟器视图 + 内嵌预测题。
// 写作原则：真实问题开路 → 机制 → 为什么成立 → 🤔 留给你想 → 🏛 权威佐证（可查证一手资料）。
// 场次映射：阶段 0 见 phase0-pytorch/AI助学手册.md；阶段 1 见 phase1-transformer/AI助学手册.md。
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
<li><b>Goodfellow, Bengio & Courville《Deep Learning》第 2 章</b>（MIT Press，<a href="https://www.deeplearningbook.org" target="_blank">deeplearningbook.org</a> 全书免费）。公认的"深度学习圣经"，作者阵容是三位图灵奖级人物；第 2 章把线性代数讲到"够用即走"，不逼你啃数学系教材——这正是本书成为入门标配的原因。</li>
<li><b>Grant Sanderson（3Blue1Brown）《线性代数的本质》</b>（<a href="https://www.3blue1brown.com/topics/linear-algebra" target="_blank">官方页面</a>）。全 YouTube 公认最直观的矩阵课。看到第 4 集"矩阵乘法 = 变换的复合"，你会发现 c01 的 <code>@</code> 运算从此有了画面——矩阵不是数字方阵，是空间的搬运。</li>
<li><b>Paszke et al.《PyTorch: An Imperative Style, High-Performance Deep Learning Library》</b>（<a href="https://arxiv.org/abs/1912.01703" target="_blank">NeurIPS 2019</a>）。只读引言即可：它解释了研究圈为什么集体选择 PyTorch——"定义即运行"，代码写下来就是计算图，和你的直觉同构。</li>
<li><b>李沐《动手学深度学习》第 2 章</b>（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）。中文世界最好的入门教材，配套视频由李沐亲讲；本书的代码环境就是 Jupyter，和你的 exercises 目录无缝衔接。</li>
<li><b>延伸 · "张量"这个名字的来历</b>：它不是 AI 圈发明的。Ricci 与 Levi-Civita 在 1900 年创立张量演算，爱因斯坦 1915 年用它写下广义相对论场方程。深度学习只是借用了数学家的学究命名——你学的其实是大相对论用过的语言，只是用来搬图片。</li>
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
    id: 'c01', group: '阶段 0 · 张量', title: '形状与广播', mech: 'broadcasting 末维对齐', anim: 'broadcast',
    read: `
<p class="tip">🔗 前置：<b>c00 预备课</b>。"张量""形状 (3,4)"这两个说法还不踏实的话，先回上一章玩 10 分钟张量阶梯。</p>
<p>先把语言钉死。<b>形状</b>是描述"数字怎么摆"的一串数字：<code>(3, 4)</code> 读作"3 行 4 列"。本章说的"维度"，指形状串里的<b>某一个数字</b>（比如那个 3 或 4），而不是"这是几维张量"里的维度——这个歧义坑过无数新人，先填了它。</p>
<p>设想一个真实任务：一万张灰度图，每张都要整体调亮 0.5。图是 <code>(600, 800)</code> 的表格；亮度是一个数，形状是 <code>()</code>。凭什么一张表能加一个数？你的直觉说："把这个数摊给每个像素就行。"——你的直觉就是广播（broadcasting），NumPy 只是把它的<b>执行流程</b>写成了两步。</p>
<h3>两步流程（背下它，形状报错永远查得到原因）</h3>
<pre>第一步：把两串形状【右对齐】，短的那串在左边补 1
第二步：每一位逐对检查 ——
        相等          ✓ 通过
        有一方是 1    ✓ 通过（这一位"拉伸"）
        两个都不满足  ✗ RuntimeError</pre>
<p>拿刚才的任务演算一遍（一个数 vs 一张表）：</p>
<pre>(600, 800)      图
      ()        亮度 → 补 1 → (1, 1)

逐位检查：
  600 vs 1   ✓ 拉伸
  800 vs 1   ✓ 拉伸
结论：结果形状 (600, 800) —— 那个数真的"摊给了每个像素" ✓</pre>
<p>再来一个失败的：(3, 4) 的表格，加 (3,) 的一行数。</p>
<pre>(3, 4)
(1, 3)          补 1

逐位检查：
  4 vs 3   ✗ 不相等，也没有任何一方是 1
→ RuntimeError（报错信息会指认 "dimension 1" 这位肇事者）</pre>
<p>三条推论，直接从流程读出来：</p>
<ol>
<li>两边维度数可以不同——短的在左边补 1 而已；</li>
<li>每一位要么相等、要么有一方是 1（此时该位<b>逻辑拉伸</b>）；</li>
<li>所有位都过不了才报错。</li>
</ol>
<p>最后澄清"逻辑拉伸"：拉伸<b>不是复制</b>。<code>[1,1,1,1]</code> 被拉伸成 3 行时，内存里仍然只有一份——运算时框架重复读同一块数据，<b>假装</b>它有三行。这是性能的魔法，也是下一章"视图与内存共享"的正题。</p>
<p class="tip">为什么从末维开始对齐？因为内存是"一行接一行"平铺的，末维物理上最连续——从最连续处检查与拉伸最省事。这只是实现倾向，不影响使用规则。</p>
<p>右侧模拟器把 ①②③ 三个预设都点一遍：① 和 ② 只差一个维度，命运一个是 (3,4)、一个是报错。演算不过瘾的话，预设 ③ 是"(3,1) + (1,4)"，请先口算两步流程再看答案。</p>
<p class="soul">🤔 留给你想：广播拉伸是"逻辑复制"——不真复制。这个设计让一次 1TB 规模的运算跑进了 8GB 内存。请想想：省的是什么？什么时候它又必须真复制（提示：写结果需要地方放）？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>NumPy 官方文档 · Broadcasting</b>（<a href="https://numpy.org/doc/stable/user/basics.broadcasting.html" target="_blank">numpy.org/doc → broadcasting</a>）。"法条"的原文，配有逐步图例；PyTorch 官方文档明确声明广播语义与 NumPy 一致——学会这里，两个框架通用。</li>
<li><b>Harris et al.《Array programming with NumPy》</b>（<a href="https://www.nature.com/articles/s41586-020-2649-2" target="_blank">Nature 585, 2020</a>）。一个"工具包"上《自然》的罕见案例：评审认定的不是 API，而是它对整个科学计算生态的承重作用。你正在学的正是这堵承重墙。</li>
<li><b>CS231n 课程笔记 · Python/NumPy 教程</b>（<a href="https://cs231n.github.io/" target="_blank">cs231n.github.io</a>）。斯坦福李飞飞团队的入门标配，业内几乎人手读过；其中"广播的坑"一节是面试常客。</li>
<li><b>延伸 · 为什么末维最连续？</b>内存一维平铺，NumPy/PyTorch 默认<b>行优先</b>（C order）：先排完一行再排下一行，所以末维在物理上相邻。Matlab、Julia、Fortran 是列优先——跨框架搬数据（尤其对接 MATLAB 遗产）时的经典暗坑，学术圈称为 C/Fortran order 之争。</li>
<li><b>延伸 · 广播的远亲</b>：数据库的"隐式类型转换"、shell 的通配符，都是同一种设计哲学——"把用户的直觉摊开执行"。广播不是发明，是对直觉的工程化。</li>
</ul></details>`,
    quiz: [
      { code: 'a = torch.ones(3, 4)\nb = torch.ones(4)\nprint((a + b).shape)', q: '输出形状是？', kind: 'choice', options: [{ t: '(3, 4)', correct: true, why: '' }, { t: '(3, 3)', correct: false, why: '' }, { t: '报错', correct: false, why: '' }], why: '(4,) 末维与 a 的末维 4 相等，前面补 1 拉伸 → (3,4)。' },
      { code: 'a = torch.ones(3, 4)\nb = torch.ones(3)\nprint((a + b).shape)', q: '这次输出什么？', kind: 'choice', options: [{ t: '(3, 4)', correct: false, why: '' }, { t: '报错', correct: true, why: '' }, { t: '(4, 4)', correct: false, why: '' }], why: '末维对齐 4 vs 3，既不相等也无人是 1 → RuntimeError。①② 差一个维度，命运完全不同。' },
      { code: 'a = torch.ones(3, 1)\nb = torch.ones(1, 4)\nc = a + b', q: 'c 的形状？c 一共有几个元素？', kind: 'number', answer: 12, why: '形状 (3,4)；广播是逻辑拉伸，但结果张量是真实分配的 12 个元素。' },
    ],
    sim: { type: 'tensor' },
  },
  {
    id: 'c02', group: '阶段 0 · 张量', title: '视图与内存共享', mech: 'view/transpose 零拷贝',
    read: `
<p>调试圈的"都市传说"排行榜上，这一条常年霸榜：<i>"我真的没动它，它自己变的。"</i>破案线索只有一个：<code>view / reshape / t() / 切片</code> 这些形状操作<b>不复制数据</b>——它们返回的"视图"和原张量指向<b>同一块内存</b>。</p>
<p>理解它的钥匙是：一个张量 = 一坨数据 + 一份"怎么看这坨数据"的说明书（形状 + 步长）。<code>view(4,3)</code> 只是重写了说明书，数据原地不动。这既是性能的礼物（深层网络里 reshape 每秒发生千万次，零拷贝），也是 bug 的温床（改视图 = 改原张量）。右侧预设 ④ 是案发现场：<code>b = a.view(4,3)</code> 之后改 <code>b[0,0]</code>，<code>a[0,0]</code> 同步变 99。</p>
<p>顺带一提：NumPy 因为这套设计足够重要，2020 年在《自然》杂志上发了论文——一个"工具包"上 Nature，因为它撑起了大半个科学计算世界。你正在学的不是某个 API，是这条生态地基的承重墙。</p>
<p class="soul">🤔 留给你想：什么时候必须<b>真复制</b>？（<code>.clone()</code>、跨设备 <code>.to('mps')</code>、某些非连续内存的 <code>contiguous()</code>。）工程里"快"和"不出鬼"经常打架，你的取舍原则是什么？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Harris et al.《Array programming with NumPy》</b>（<a href="https://www.nature.com/articles/s41586-020-2649-2" target="_blank">Nature 585, 2020</a>）。视图/步长（stride）机制的源头设计；论文里"一块数据 + 多个解释方式"的图解值得打印贴墙。</li>
<li><b>PyTorch 官方文档 · Tensor Views</b>（pytorch.org/docs → tensor views）。官方枚举了全部视图操作（view/reshape/transpose/expand…）。记住判据一句话：凡是"改说明书"的都免费，凡是"要新内存"的才付费。</li>
<li><b>延伸 · <code>.contiguous()</code> 的存在理由</b>：transpose 之后数据在内存里"跳着走"，某些底层算子（尤其卷积）要求平铺连续——这时 PyTorch 才被迫真复制。这是"视图免费"唯一的账单，也是你未来某天遇到的 <code>.contiguous()</code> 报错的全部剧情。</li>
<li><b>延伸 · 同一哲学的生态复制</b>：pandas 的视图式切片、数据库的物化视图、Git 的轻量分支——"改说明书，不搬数据"是整个软件世界的第一性原理之一。学的是张量，懂的是设计。</li>
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
    id: 'c03', group: '阶段 0 · autograd', title: '计算图与 backward', mech: '动态建图 + 链式法则',
    read: `
<p>1986 年，Rumelhart、Hinton 与 Williams 在《Nature》上发表了一篇短短几页的论文《Learning representations by back-propagating errors》，让"反向传播"一举复活——今天所有神经网络训练，都是这篇论文的续集。它优雅到只有一个数学内核：<b>微积分的链式法则</b>（莱布尼茨时代就有的老规矩）。</p>
<p>PyTorch 的做法是把链式法则"工程化"：每一次运算都在现场搭一张<b>计算图</b>——节点是张量，边是运算。调用 <code>loss.backward()</code> 时，从 loss 出发<b>沿图反向</b>，把梯度逐节点回传，累加进每个叶子张量的 <code>.grad</code>。PyTorch 用的是"动态图"：像即兴爵士，每个迭代现场编曲；与之相对的 TensorFlow 1.x 是"静态图"：先写总谱再演奏。</p>
<p>右侧交互台输入 <code>a*b + a*c + b*c</code> 点「反向传播」，看梯度如何<b>逆拓扑序</b>逐节点点亮——那就是 1986 年那篇论文在浏览器里的样子。</p>
<p>还有一个值得咂摸的经济学问题：求梯度为什么必须从输出往回走？往回走一遍，<b>所有</b>输入的梯度同时到手；顺着走（前向模式微分），每换一个输入就得重走一遍。变量成千上万、输出只有一个——反向，是唯一划算的方向。</p>
<p class="soul">🤔 留给你想：链式法则高中就学过，为什么直到 1986 年才有人想到用它训练多层网络？（提示：差的不数学，是"怎么组织计算"——这也许能让你对'工程'二字肃然起敬。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Rumelhart, Hinton & Williams《Learning representations by back-propagating errors》</b>（<a href="https://www.nature.com/articles/323533a0" target="_blank">Nature 323, 1986</a>）。正文只有 3 页，引用超过 5 万；今天读你会惊讶于它的朴素。续集更精彩：Hinton 因此项工作获 <b>2024 年诺贝尔物理学奖</b>（与 Hopfield 同享，表彰"以人工神经网络实现机器学习的基础性发现"）——当年被符号主义边缘化的想法，四十多年后拿了诺奖。</li>
<li><b>Andrej Karpathy · The spelled-out intro to neural networks and backpropagation</b>（<a href="https://www.youtube.com/watch?v=VMj-3S51tku" target="_blank">YouTube</a>）。本阶段代码主线的"原片"：2.5 小时从空文件到训练网络，全是即兴手敲。禁写区结束后来二刷，你会看到完全不同的东西。</li>
<li><b>3Blue1Brown · 神经网络系列第 3–4 集</b>（<a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank">3blue1brown.com</a>）。Grant Sanderson 用"逐层追责"的比喻讲反向传播；先看动画建立画面，再写代码建立手感，两条记忆通道各管一段。</li>
<li><b>CS231n 课程笔记 · Backprop</b>（<a href="https://cs231n.github.io/optimization-2/" target="_blank">cs231n.github.io/optimization-2</a>）。用"计算图上每个门的局部梯度"教学——和你正在写的 Value 类完全同构，术语可以直接对表。</li>
<li><b>延伸 · 反向传播的前史</b>：它本质是"反向模式自动微分"。芬兰学生 Seppo Linnainmaa 在 1970 年的硕士论文里就提出了任意嵌套函数的自动求导，比神经网络应用早了 16 年——反向传播 = 反向模式微分 × 神经网络。伟大的应用常常不需要发明新数学，只需要把老数学接到新大陆。</li>
<li><b>延伸 · 两个方向的经济学</b>：自动微分有前向/反向两种模式。输入多、输出少（训练场景），反向一遍全出，完胜；输入少、输出多（比如算雅可比行），前向反而占优。JAX 这类库两种都给你——工具不站队，问题说了算。</li>
</ul></details>`,
    quiz: [
      { code: 'x = torch.tensor(2.0, requires_grad=True)\ny = x ** 3\ny.backward()\nprint(x.grad)', q: '打印什么？', kind: 'number', answer: 12, why: 'dy/dx = 3x² = 12。backward 把 ∂y/∂x 累加进 x.grad。' },
      { code: 'x = torch.tensor([1.0, 2.0], requires_grad=True)\ny = x * 2\ny.backward()', q: '正常运行还是报错？', kind: 'choice', options: [{ t: '正常运行', correct: false, why: '' }, { t: '报错：只有标量能隐式 backward', correct: true, why: '' }], why: '反向传播需要"一个数"当起点；非标量要显式传 grad_output。所以训练里 loss 必须约简为标量。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c04', group: '阶段 0 · autograd', title: '梯度累加与清零', mech: '.grad 是 += 语义',
    read: `
<p>先看一段"程序员的禅"——《The Zen of Python》（Python 之禅，Tim Peters 写于 1999 年，PEP 20）第 2 条：<b>Explicit is better than implicit</b>（显式优于隐式）。PyTorch 把这句禅执行到了 .grad 上：<b>梯度是累加的（+=），且框架绝不替你清零</b>。</p>
<p>为什么这是立场而不是疏忽？因为"累加"本身是能力：梯度累积（小显存模拟大 batch）、多个损失合并求和，全靠它。框架要是好心替你清零，这些玩法就全废了。代价是：清零的责任落到训练循环头上（<code>optimizer.zero_grad()</code>）——而新手世界的第一大 bug，就诞生在这份被交还的责任里。</p>
<p>右侧实验：连续点两次「反向传播」，看 grad 变成 2 倍；点「清零梯度」恢复。S6 坏代码门诊的病灶①，病根就是这条禅语。</p>
<p class="soul">🤔 留给你想：一个 API 设计问题——"框架替你做"和"把控制权交给你"，边界应该画在哪？PyTorch 的答案几乎处处是后者，这也是它赢下研究圈的原因之一。你同意吗？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Tim Peters《PEP 20 — The Zen of Python》</b>（<a href="https://peps.python.org/pep-0020/" target="_blank">peps.python.org/pep-0020</a>，1999）。只有 19 行的"社区宪法"，值得全文背下；PyTorch 的 API 品味（处处显式、处处 .grad 交给你管）深谙此道。</li>
<li><b>Andrej Karpathy《A Recipe for Training Neural Networks》</b>（<a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">karpathy.github.io, 2019</a>）。前 Tesla AI 总监的训练手记；"最常见的训练 bug 都是静默的"这一警告的出处级文献。本阶段第二必读，S9 答辩题源。</li>
<li><b>PyTorch 官方文档 · zero_grad()</b>。细节控福利：新版默认 <code>set_to_none=True</code>——把梯度置 None 比置 0 更省一遍内存遍历。看，连"清零"这件事都在演进。</li>
<li><b>延伸 · 累加的实战化身：梯度累积</b>。显存放不下大 batch？先累积 8 个小 batch 的梯度再一次 step，等效 batch ×8——这是大模型训练的日常操作。你今天抱怨的"麻烦特性"，明天是万亿参数模型的救命稻草。</li>
<li><b>延伸 · "显式"的边界</b>：not 所有框架都这么倔——Keras 把清零藏进 fit() 里，好用但黑盒。两种设计哲学没有对错，只有"你在学什么"：Keras 教你用工具，PyTorch 教你工具的原理。本阶段选后者，是有意的。</li>
</ul></details>`,
    quiz: [
      { code: 'x = torch.tensor(1.0, requires_grad=True)\ny = x * 2\ny.backward(retain_graph=True)\ny.backward(retain_graph=True)\nprint(x.grad)', q: 'x.grad 是多少？', kind: 'number', answer: 4, why: '2 + 2 = 4。两次 backward，梯度累加两次。' },
      { q: '一个 for 循环里跑了 3 次 backward 但从不清零，x.grad 等于单次梯度的几倍？', kind: 'number', answer: 3, why: '3 倍。等效学习率被悄悄放大 3 倍——训练后期突然震荡/爆炸的常见根源。' },
      { q: '为什么框架不把"每次 backward 前自动清零"设为默认？', kind: 'text', why: '累加本身是特性：梯度累积（大 batch 模拟）、多个 loss 合并都依赖它。框架把"清零"的责任交给训练循环语义。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c05', group: '阶段 0 · autograd', title: '手写线性回归', mech: '无框架训练循环', anim: 'linreg',
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
<li><b>Galton《Regression towards mediocrity in hereditary stature》</b>（1886）。"回归"的出生证明。有趣的后续：高尔顿研究的本意是遗传规律，却顺手发现了统计里最重要的现象之一——而且"相关不等于因果"这一课，他本人也差点没及格。科学常常如此，瞄准一个答案，捡回另一个。</li>
<li><b>Stephen Stigler《The History of Statistics》</b>（Harvard University Press）。统计学史的权威整理者（统计里还有个"Stigler 定律"：凡以人名命名的定律，都不是那个人先提出的——它自己就是自己的例证）。谷神星那一章讲高斯如何从 41 天的观测外推轨道，普鲁士天文学家据此在除夕夜找回了这颗星。</li>
<li><b>延伸 · 最小二乘的优先权大战</b>：Legendre 1805 年率先发表最小二乘法，高斯回信称自己 1795 年就在用，两位巨匠为此隔空互怼多年。教训绵延至今——<b>发表时间戳</b>在科学界是硬通货（这也是你坚持 git 提交历史的隐秘理由）。</li>
<li><b>延伸 · Anscombe 四重奏（1973）</b>：统计学家 Francis Anscombe 造了四组数据——均值、方差、回归线完全相同，画出来却是四张完全不同的图。它一锤定音地立下规矩：<b>先画图，再算数</b>。右侧训练场的 loss 曲线，就是你的 Anscombe 四重奏。</li>
<li><b>李沐《动手学深度学习》第 3 章</b>（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）。线性回归从"损失函数怎么选"讲到"从零实现到简洁实现"，与本章双线互证。</li>
</ul></details>`,
    quiz: [
      { q: '参数更新为什么必须包在 no_grad 里？', kind: 'text', why: '不包：对叶子张量的原地写直接报错（leaf Variable ... in-place operation）；即便绕过，更新本身也会被记进图，下一步 backward 会沿"参数更新"这条路径乱求导，且内存持续膨胀。' },
      { code: 'w = torch.randn(1, requires_grad=True)\nfor i in range(5):\n    loss = (w * 1).sum()\n    loss.backward()\n    with torch.no_grad():\n        w -= 0.1 * w.grad', q: '这段代码（无清零）跑完，等效学习率被放大了几倍？', kind: 'number', answer: 5, why: '第 k 次迭代时 w.grad 累了 k 份梯度。补上 w.grad.zero_() 才正确。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'fit', lr: 0.1 } },
  },

  // ============ 组 C · micrograd ============
  {
    id: 'c06', group: '阶段 0 · micrograd', title: 'Value：一个节点', mech: 'data + grad + _children + _backward',
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
<li><b>Abelson & Sussman《SICP》</b>（MIT Press，免费在线多处可读）。MIT 传奇课程 6.001 的教材，序言那句"程序是写给人读的"即出于此。第 3 章"模块化、对象与状态"是 <code>_backward</code> 闭包设计的思想老家——读完你会把"闭包"从背下来的词变成想明白的词。</li>
<li><b>karpathy/micrograd 仓库与视频</b>（<a href="https://github.com/karpathy/micrograd" target="_blank">GitHub</a> / <a href="https://www.youtube.com/watch?v=VMj-3S51tku" target="_blank">YouTube</a>）。engine.py 一共约百行。建议隔几周重读一遍：每次你学会新东西，它都会显得更薄——这个"变薄"的速度，就是你入门速度的测量仪。</li>
<li><b>延伸 · Karpathy《Software 2.0》</b>（2017，karpathy.github.io）。他把神经网络权重称为"新的编程方式"：软件 1.0 由人写规则，软件 2.0 喂数据让它长出程序。本阶段你在写 1.0 的代码，目的是看懂 2.0 的产物——这个视角会让你对"训练"二字肃然起敬。</li>
<li><b>李沐论文精读清单</b>（<a href="https://github.com/mli/paper-reading" target="_blank">github.com/mli/paper-reading</a>）。从本阶段毕业后的"论文地图"：每篇都有中文视频笔记，按图索骥即可。</li>
</ul></details>`,
    quiz: [
      { q: '加法节点的 _backward 闭包，为什么必须写 self.grad += out.grad 而不是 = ？', kind: 'text', why: '一个节点可能被多条路径使用（a*b + a*c）。+= 让多路径梯度汇合（乘积求导法则的"相加"项）；= 会被后一条路径覆盖。' },
      { q: '_prev 用 set 还是 list 有讲究吗？a + a 会发生什么？', kind: 'text', why: 'micrograd 用 set：(a,a) 去重后孩子仍能拿到两次累加吗？会——_backward 闭包体写了两句 self.grad += out.grad（self 和 other 是同一个对象），所以 a.grad 正确等于 2×out.grad。去重只影响拓扑序，不影响闭包逻辑。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c07', group: '阶段 0 · micrograd', title: '拓扑排序与全图反向', mech: '逆拓扑序调用 _backward', anim: 'chaindiamond',
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
<li><b>Donald Knuth《The Art of Computer Programming》Vol.1</b>。拓扑排序的经典论述；原书难啃，但这一节配练习可以拿下。Knuth 的原始动机朴素到可爱：给依赖关系排序（先修课、装配线、菜谱），和你今天给计算图排序是同一件事。</li>
<li><b>Goodfellow et al.《Deep Learning》第 6.5 节 · 计算图</b>（<a href="https://www.deeplearningbook.org" target="_blank">deeplearningbook.org</a>）。"计算图"概念的教科书表述；把你手画的 micrograd 图与它对照，术语零障碍互通。</li>
<li><b>延伸 · 一个算法的一生（1960s–2020s）</b>：1970 年 Linnainmaa 提出反向模式自动微分 → 1986 年进入神经网络（反向传播）→ 2012 年 AlexNet 引爆深度学习 → 2017 年 Hinton 公开说"也许该把反向传播扔掉重来"→ 2022 年他真的发表了替代方案 Forward-Forward（arXiv:2212.13345）。祖师爷反叛祖师爷法——算法也有完整的人生剧本。</li>
<li><b>延伸 · 拓扑排序无处不在</b>：构建工具（make/webpack）的依赖编译、包管理器的安装顺序、电子表格的重算次序——全是它。学会"先想清楚谁依赖谁"，你就同时学会了编程与项目管理。</li>
</ul></details>`,
    quiz: [
      { q: '顺序反了（正拓扑序调用 _backward）会怎样？', kind: 'text', why: '上游节点被调用时它的 out.grad 还没被下游写全，回传的是残缺梯度——程序不报错但数值错，比崩溃更难发现。' },
      { code: '# 表达式 f = a*b + a*c + b*c，a=2, b=-1, c=0.5\n# 假设所有 += 都被误写成 =\nprint(a.grad)  # 实际会是多少？正确值是多少？', q: 'a.grad：误写后 / 正确值 分别是？', kind: 'text', why: '三条路径 a*b、a*c、b*c 都给 a 贡献梯度：正确 = b+c = -0.5。误写 = 只剩最后一条路径写的值（c·out.grad），且依赖遍历顺序——必错。用 tutor/gradcheck.py 对拍就能当场抓住。' },
    ],
    sim: { type: 'autograd' },
  },
  {
    id: 'c08', group: '阶段 0 · micrograd', title: '从 Value 到 MLP', mech: 'Neuron / Layer / MLP 组装', anim: 'netflow',
    read: `
<p>神经网络的历史，是一部"捧杀与平反"的连续剧。1958 年，《纽约时报》报道 Rosenblatt 的感知机，用的是这样的句子：电子计算机的胚胎，将来会走路、说话、看见、书写、自我复制。1969 年，Minsky 与 Papert 用一本《Perceptrons》泼来冷水：一层感知机连 XOR（异或）都分不开。经费应声蒸发，史称第一次 AI 寒冬。</p>
<p>平反来得也不快：1989 年 Cybenko、1991 年 Hornik 先后证明<b>万能近似定理</b>——一层足够宽的隐层，能近似任意连续函数。理论赢了，实践还是冷了半截："能近似"不等于"学得动"：要拟合同样的曲线，浅而宽的网络所需宽度往往指数爆炸，而<b>深</b>网络用少量参数层层折叠就做到了。深度学习的"深"，是效率的胜利，不是宽度的胜利。</p>
<p>本章你亲手把这场平反跑起来。引擎（Value）已有，往上组装只是搭积木：<b>Neuron</b>（n 个权重 + 偏置 → 加权和 → 激活）、<b>Layer</b>（一排 Neuron）、<b>MLP</b>（一排 Layer），三者共享 <code>parameters()</code> 接口。训练循环和 c05 手写线性回归<b>一模一样</b>——变的只是 forward 的内容。右侧训练场每个权重都是真 Value 节点：点「训练」，看决策边界怎么长出来。</p>
<p class="soul">🤔 留给你想：Minsky 当年的批评其实是对的（一层就是不行），但结论"此路不通"错了。科学史上这种"对的理由推出错的结论"，还能想到哪次？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>《纽约时报》1958 年感知机报道</b>（"New Navy Device Learns By Doing"）。全文今天读来像科幻小说，却是当时一丝不苟的严肃新闻——科技泡沫的文体学标本。收藏它，下次任何技术被"革命性"形容时拿出来对照。</li>
<li><b>Minsky & Papert《Perceptrons》</b>（MIT Press, 1969）。冷水泼得有理有据：单层感知机确实学不了 XOR。错的是从"一层不行"滑向"此路不通"——这一步滑出了长达十几年的 AI 寒冬。逻辑正确的批评 + 越界的结论，是科学史上最值得警惕的组合。</li>
<li><b>Hornik, Stinchcombe & White《Approximation capabilities of multilayer feedforward networks》</b>（Neural Networks, 1991）。万能近似定理的通用证明。读摘要即可，但请读出两个小字：定理保证"存在这样的网络"，<b>不保证</b>学得到、也不保证宽度可行——"存在"与"可学"之间的鸿沟，正是深度学习三十年。</li>
<li><b>3Blue1Brown · 神经网络第 4 集</b>（<a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank">3blue1brown.com</a>）。梯度下降如何在一万维的"损失地形"里下山；和右侧训练场并排开着看。</li>
<li><b>延伸 · Hinton 的 Forward-Forward</b>（arXiv:2212.13345, 2022）：图灵奖得主试图用"两次前向"替代反向传播，动机是怀疑反向传播在生物大脑里走不通。读新闻稿级别的摘要即可——围观"祖师爷反叛祖师爷法"，是理解一个算法局限性的最佳视角。</li>
</ul></details>`,
    quiz: [
      { q: '隐层 [4] 训练双月牙和 [8,8] 有什么可感知差异？为什么？', kind: 'text', why: '[4] 容量小：边界更"直"，月牙交界处分不开、loss 更高。容量 ↔ 数据复杂度要匹配。' },
      { q: '整个 MLP 的 parameters() 返回的是什么？zero_grad() 又是对什么操作？', kind: 'text', why: '所有 w 和 b（Value 节点）的列表；zero_grad 把每个 p.grad 置 0——c04 的结论在模型层面的落地。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.5 } },
  },

  // ============ 组 D · 训练循环与验收 ============
  {
    id: 'c09', group: '阶段 0 · 训练循环', title: '五件套与单步执行', mech: 'batch → forward → zero_grad → backward → step',
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
<li><b>Andrej Karpathy《A Recipe for Training Neural Networks》</b>（<a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">karpathy.github.io, 2019</a>）。被无数实验室当新员工手册的博客。第一节标题 <b>Don't be a hero</b>：先跑通最小管道，再逐步加复杂度——本阶段的每一次"先跑通再扩展"都是它的回声。</li>
<li><b>fast.ai《Practical Deep Learning for Coders》</b>（<a href="https://course.fast.ai" target="_blank">course.fast.ai</a>）。Jeremy Howard 的"自上而下"教学法：第一课就训出可用模型，原理后补。它与李沐 d2l 的"自下而上"互为镜像——两种顺序都体验过，才算见过学习这件事的全貌。</li>
<li><b>Smith et al.《Don't Decay the Learning Rate, Increase the Batch Size》</b>（<a href="https://arxiv.org/abs/1711.00489" target="_blank">arXiv:1711.00489</a>, 2017）。论证学习率与 batch size 可以互相代偿——这就是为什么大模型训练手册里这两个参数永远成对出现。S7 的变异实验（lr × batch）正是它的微缩版。</li>
<li><b>延伸 · "五件套"的普适性</b>：去翻 GPT 级模型的训练日志，每个 step 依然是取数据 → 前向 → 清零 → 反向 → 更新。规模变了七八个数量级，骨架一个字没动——这就是"最小完备"的分量。</li>
</ul></details>`,
    quiz: [
      { q: 'zero_grad 放在循环开头和放在 backward 前一行，有区别吗？放在 step 之后、下一轮 backward 之前呢？', kind: 'text', why: '前两者等价（关键是"下一次 backward 之前清掉"）；第三种写法语义上会把"刻意梯度累积"误清掉，且习惯上清零属于"为反向做准备"。' },
      { q: 'epoch / batch / step 三个概念的关系一句话说清。', kind: 'text', why: '一个 epoch = 遍历全部训练数据一次；数据被切成若干 batch；每个 batch 做一次参数更新 = 一个 step。steps_per_epoch = ceil(N / batch)。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.5, showStep: true } },
  },
  {
    id: 'c10', group: '阶段 0 · 训练循环', title: '坏代码门诊', mech: '5 个病灶的可视化症状',
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
<li><b>Andrej Karpathy《A Recipe for Training Neural Networks》</b>（<a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">karpathy.github.io, 2019</a>）。本章方法论的原典。其中一招现在就能用：<b>overfit one batch</b>——先让模型死记一个 batch，若都做不到，代码必有 bug；能做到，再谈泛化。把大问题切成"能死的 smaller 问题"，是调试的一切。</li>
<li><b>Srivastava, Hinton et al.《Dropout》</b>（<a href="https://jmlr.org/papers/v15/srivastava14a.html" target="_blank">JMLR 15, 2014</a>）。作者栏横跨 Hinton、Srivastava、Sutskever 一串传奇。数学本质一句话：每次随机丢神经元 = 训练指数多个子网络的共享集成——"合谋"自然无从谈起。</li>
<li><b>Ioffe & Szegedy《Batch Normalization》</b>（arXiv:1502.03167, 2015）。train/eval 模式之分的另一半主角（BN 的训练期统计量与推理期滑动平均）；深度学习史上被引用最多的论文之一。S8 之后你会频繁与它打交道。</li>
<li><b>延伸 · 银行柜员轶事的完整版</b>：Hinton 在多个访谈（如 2014 年 NPR）里讲过——他去银行发现柜员总在轮换，想到"轮换让单个员工难以与其余人合谋作弊"，于是有了随机丢弃。顶级研究者的直觉常常来自生活的比喻，而非论文。</li>
<li><b>延伸 · "静默失败"的通用免疫</b>：先立基线 → 只改一个变量 → 读数说话。这套纪律不止护佑炼丹，任何"复杂系统 + 噪声"的领域（后端压测、A/B 实验、投资复盘）通用。</li>
</ul></details>`,
    quiz: [
      { q: '5 个病灶里哪几个不报任何错？这对排错方法论意味着什么？', kind: 'text', why: '①③⑤（加上症状轻微的④）。深度学习的大部分 bug 是"静默错误"——不崩溃、只变差。所以要有 baseline 对照、要会读 loss 曲线形态，而不是等报错。' },
      { q: '病灶①和②都在"步长过大"，为何曲线形态不同？', kind: 'text', why: '① 是有效步长随迭代线性增长：先正常后恶化，有"蜜月期"；② 从第一步就超标：立即爆炸没有蜜月期。形态差异直接指向根因。' },
    ],
    sim: { type: 'trainer', cfg: { mode: 'classify', dataset: 'moons', hidden: [8, 8], lr: 0.2, bugs: { noZeroGrad: false, bigLr: false, noBackward: false, doubleAct: false, noEvalDropout: false } } },
  },
  {
    id: 'c11', group: '阶段 0 · 训练循环', title: '真实数据：Fashion-MNIST', mech: '数据 → 模型 → 训练 → 验证',
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
<li><b>LeCun, Bottou, Bengio & Haffner《Gradient-based learning applied to document recognition》</b>（<a href="http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf" target="_blank">Proceedings of the IEEE, 1998</a>）。MNIST 出生证明，PDF 至今挂在 LeCun 个人主页。注意作者栏：Bengio 也在——三位后来的图灵奖得主，1998 年就在同框研究"读数字"这种"小事"。</li>
<li><b>Xiao, Rasul & Vollgraf《Fashion-MNIST》</b>（<a href="https://arxiv.org/abs/1708.07747" target="_blank">arXiv:1708.07747</a>, 2017）。Zalando 团队的短论文；附录里有"为什么换掉 MNIST"的用户调研。顺带一提：它的 GitHub README 是开源数据集文案的范本，写文档时值得抄作业。</li>
<li><b>延伸 · Goodhart 定律</b>：经济学家 Charles Goodhart 1975 年提出，人类学家 Strathern 的转述版最流行——<b>"当一个度量变成目标，它就不再是一个好度量。"</b>MNIST 刷到 99.7% 后失去信息量，KPI 压垮团队，算法推荐污染内容……全是它在 ML 之外的投影。</li>
<li><b>延伸 · 数据集也会退休</b>：如今各大榜单位已难觅 MNIST 踪影，而教科书仍在用它。这不是矛盾——教材用经典保证可比性，前沿用真实保证含金量。你从 Fashion-MNIST 毕业、进入阶段 3 的中文指令数据集时，会再经历一次同样的"换代"。</li>
<li><b>李沐《动手学深度学习》3.5–3.7 节</b>（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）。softmax 回归与 Fashion-MNIST 的标准流水线，本章作战地图的详细版。</li>
</ul></details>`,
    quiz: [
      { q: '为什么调参实验必须"先预测再运行"？', kind: 'text', why: '预测 = 强制调用已有心智模型；对错都会立刻校准它。只跑不预测，跑了也白跑——你看不出结果是在印证还是反驳你的理解。' },
      { q: 'batch=32 和 batch=256，同 lr 下 loss 曲线的"锯齿"有什么不同？', kind: 'text', why: '小 batch 噪声大（锯齿粗）但同步数下更新次数多、往往初期降得快；大 batch 曲线平滑但探索性弱。锯齿是梯度噪声的可视化。' },
    ],
    sim: { type: 'mnist' },
  },
  {
    id: 'c12', group: '阶段 0 · 训练循环', title: '脱稿验收', mech: '断 AI 演练 + 考官制',
    read: `
<p>费曼去世后，人们在他在 Caltech 的办公室黑板上，留下了这样一行字：<b>"What I cannot create, I do not understand."</b>（我造不出的东西，就代表我不懂。）这块黑板今天还在。本章的验收制度，就是把这行字变成流程。</p>
<p>整个 AI 助学模式的两道护栏，在此闭合：</p>
<p><b>① 断 AI 演练</b>：不查教程，1 小时，从空文件写完"加载 → 模型 → 训练 → 验证"。规则细节在 <code>exercises/04_mnist_solo/README.md</code>。这不是怀旧，而是学习科学：Roediger 与 Karpicke 2006 年的实验表明，<b>主动提取（回忆并写出）对长期记忆的效果远胜反复阅读</b>——所谓 testing effect。看 AI 写一万行，不如自己闭卷写一百行。</p>
<p><b>② 考官制</b>：写完 ≠ 学会。把代码交给 AI（prompts.md ⑤ 卡）：只找概念性误解、追问 5 个"为什么"、现场出 3 道附加题（"只加一行再提准确率"、"解释曲线某处为何变陡"）。≥2 道通过才算毕业。</p>
<p>最后用 <code>tutor/defense_训练循环_10问.md</code> 全量答辩（≥8 题讲清），然后：</p>
<pre>git tag phase0-graduate</pre>
<p>下一站：阶段 1，从空文件手写一个能生成文本的 GPT。费曼那行黑板的下一个词，你会亲手创造出来。</p>
<p class="tip">🔗 衔接提示：从下一章 c13 起，课程内容就属于<b>阶段 1 · 手写 Transformer</b> 了；Python 实战主场换到 <code>phase1-transformer/</code>（场次手册 S10 起步，材料已就绪）。</p>
<p class="soul">🤔 留给你想：AI 时代，"能查到"和"会"的边界在哪里？一个可操作的定义：当工具不在时你剩下来的东西。你的"剩下来的东西"，现在有多少了？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>费曼的 Caltech 黑板（1988）</b>。那行"我造不出的东西，就代表我不懂"只是黑板上的一句话——旁边还写着另一条未竟清单："Know how to solve every problem that has been solved"（搞懂每一个已被解决的问题）。天才的谦逊，是以"已解决"为下限的。这块黑板的照片至今流传，值得设成壁纸。</li>
<li><b>Roediger & Karpicke《Test-Enhanced Learning》</b>（Psychological Science, 2006）。两组学生：反复阅读 vs 合上书自测。一周后，自测组的记忆保持显著更高——"考试"从测量的手段变成了学习的手段。脱稿演练 = 把自己当实验组。</li>
<li><b>swyx《Learn In Public》</b>（swyx.io 上的名篇）。把学习过程公开成博客、笔记、仓库：既倒逼理解，又积累作品集，还可能帮到陌生人——一鱼三吃。你的 llm-journey 仓库就是它的实践版；本阶段结束去 Push 到 GitHub，就是第一次公开学习。</li>
<li><b>Andrej Karpathy《A Recipe for Training Neural Networks》</b>（<a href="https://karpathy.github.io/2019/04/25/recipe/" target="_blank">karpathy.github.io</a>）。答辩 10 问的一大题源；第三遍读它时，试着挑出一处你不同意的地方——这是超越教材的标志。</li>
</ul></details>`,
    quiz: [
      { q: '为什么"跟 AI 学得很顺"反而是危险信号？', kind: 'text', why: '流畅性错觉：AI 的讲解和补全让每一步都很顺，但生成没发生在你身上。检验标准只有一个：断掉 AI 后你还能不能产出。' },
      { q: '答辩时"讲清"的标准是什么？（提示：不是背定义）', kind: 'text', why: '能从第一性原理推出、能举出反例/边界情况、能把概念落到自己写过的某行代码上。三条缺一，就还有误解没挖出来。' },
    ],
    sim: { type: 'gradetool' },
  },

  // ============ 组 E · 阶段 1：Transformer ============
  {
    id: 'c13', group: '阶段 1 · Transformer', title: '分词：文本如何变成数字', mech: '字符级 / 词级 / BPE',
    read: `
<p class="tip">🚦 从本章起进入<b>阶段 1 · 手写 Transformer</b>——阶段 0 的五件套、禁写区纪律全部沿用。Python 实战主场换到 <code>phase1-transformer/</code>，场次从 S10 起步（见其 AI助学手册）。</p>
<p>阶段 1 的终点是一个"会写文章"的模型。但神经网络只吃数字（c00 的阶梯），于是第一个问题来了：<b>"文章"怎么变成数字？</b>这就是分词（tokenization）——它决定了模型世界的"原子"是什么。</p>
<p>右侧模拟器把同一段中英混排文本分别按<b>字符级</b>和<b>词级</b>切分：字符级把英文拆成单字母（序列很长但没有生词问题），词级切英文不错但中文粘连、"cat / cats"互不相认、生词直接词表外。Karpathy 的<a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank">《Let's build GPT》</a>开篇就选了最朴素的字符级——先跑通，再优化。</p>
<p>GPT 真正用的是 <b>BPE</b>（字节对编码）：高频片段合并成 token、生词自动退回字符，在"序列长度"和"词表大小"之间动态找平衡。S16 的选做练习 minbpe 就是亲手实现它——大约 100 行。</p>
<p class="soul">🤔 留给你想：token 是模型的"世界观单位"。字符级模型眼里没有"词"，只有字符的排列。这对它理解语言是帮助还是阻碍？（提示：想想你背英语单词时"背字母"和"背词根"的区别。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Andrej Karpathy《Let's build GPT》</b>（<a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank">YouTube, 2023</a>）。阶段 1 的原片；开篇 20 分钟讲 bigram 与分词，后面逐行搭出完整 GPT。</li>
<li><b>karpathy/minbpe</b>（<a href="https://github.com/karpathy/minbpe" target="_blank">GitHub</a>）。约百行的极简 BPE 实现，S16 选做材料；README 本身就是一篇好教程。</li>
<li><b>Sennrich et al.《Neural Machine Translation of Rare Words with Subword Units》</b>（<a href="https://arxiv.org/abs/1508.07909" target="_blank">arXiv:1508.07909</a>, 2015）。把 BPE 引入神经翻译的原始论文——"子词"思想的学术起点，比 GPT 早了三年。</li>
<li><b>延伸 · token 是钱</b>：API 按 token 计费、上下文窗口按 token 计长（GPT-4 约 8K–1M）。学完 BPE 你就能自己估算"一段话值多少钱"。</li>
</ul></details>`,
    quiz: [
      { q: '一篇 1000 字的中文文章按字符级分词，大约是多少个 token？', kind: 'number', answer: 1000, tol: 50, why: '字符级下中文 ≈ 一字一 token。这也是为什么同样内容，中文 token 数常比英文少（信息密度更高）。' },
      { q: '词级分词（按空格切）最大的两个问题是什么？', kind: 'text', why: '词表爆炸（每种词形变化都要一个条目）与词表外生词（OOV）无解。中文更是连空格都没有。' },
      { q: 'BPE 的核心思想一句话？', kind: 'text', why: '从字符开始，反复把最高频的相邻对合并成新 token——高频词长成整词，生词退回字符，词表与序列长度自动平衡。' },
    ],
    sim: { type: 'tokenizer' },
  },
  {
    id: 'c14', group: '阶段 1 · Transformer', title: '注意力：Q/K/V', mech: 'softmax(QKᵀ/√d)·V',
    read: `
<p>注意力机制的出生证明其实比 Transformer 早三年：2014 年 Bahdanau 等人在机器翻译论文里提出——翻译每个词时，"回头看"原文的相关词并按相关度加权。2017 年《Attention Is All You Need》走得更狠：<b>把整个模型全部换成注意力</b>，标题即宣言。李沐的论文精读（B 站）就是照着这篇讲的。</p>
<p>机制一句话：每个 token 发出三种向量——<b>Query（我在找什么）</b>、<b>Key（我是什么标签）</b>、<b>Value（我的内容）</b>。Q 与所有 K 做点积 = 相关度打分；除以 √d 缩放后 softmax 成权重；再按权重混合所有 V：<code>out = softmax(QKᵀ/√d)·V</code>。整个公式一个 exel 表格就能算完——右侧交互台算的就是它，真实矩阵运算。</p>
<p>两件事请在交互台里亲手验证：<b>①因果掩码</b>——把 j &gt; i 的打分置 −∞，softmax 后权重为 0，token 看不见未来（GPT 自回归性质的实现处）；<b>②√d 缩放</b>——去掉它，维度一高点积方差膨胀、softmax 饱和成 one-hot、梯度消失。论文里那个"没什么存在感"的 √d，是救命的。</p>
<p class="soul">🤔 留给你想：Q/K/V 为什么要三份不同的向量，而不是用同一个向量"自己跟自己算相似度"？提示：如果 Q=K=V，权重会怎样？（永远最关注自己。）"找什么"和"我是什么"分开，关系才立得起来。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Vaswani et al.《Attention Is All You Need》</b>（<a href="https://arxiv.org/abs/1706.03762" target="_blank">arXiv:1706.03762</a>, 2017）。Transformer 原始论文；3.2 节是注意力的官方定义。引用量十万级的当代经典。</li>
<li><b>Bahdanau et al.《Neural Machine Translation by Jointly Learning to Align and Translate》</b>（<a href="https://arxiv.org/abs/1409.0473" target="_blank">arXiv:1409.0473</a>, 2014）。注意力思想的出生证明——最初为了解决"把整句压成一个向量装不下"。</li>
<li><b>李沐《Transformer 论文逐段精读》</b>（B 站 <a href="https://www.bilibili.com/video/BV1pu41176Yo" target="_blank">BV1pu41176Yo</a>）。中文世界公认的最佳讲解，先看它再啃原文，效率完全不同。</li>
<li><b>Jay Alammar《The Illustrated Transformer》</b>（<a href="https://jalammar.github.io/illustrated-transformer/" target="_blank">jalammar.github.io</a>）。全球流传最广的图解版，配合作业食用。</li>
<li><b>延伸 · "注意力学坏了"</b>：有研究显示注意力热力图并不总是可解释的（注意到的词 ≠ 依据的词），所以别把热力图当因果证据——它更像模型"工作时的监控录像"，不是"动机书"。</li>
</ul></details>`,
    quiz: [
      { q: '注意力输出公式的正确顺序是？', kind: 'choice', options: [{ t: 'softmax(QKᵀ/√d)·V', correct: true, why: '' }, { t: 'softmax(QVᵀ/√d)·K', correct: false, why: '' }, { t: 'Q·softmax(KᵀV/√d)', correct: false, why: '' }], why: '先打分（Q 对 K 点积）、softmax 成权重、再混合 V——"打分→归一→加权取内容"。' },
      { q: '因果掩码在数学上做了什么？为什么 GPT 必须要它？', kind: 'text', why: '把 i 位置对 j>i 的打分置 −∞，softmax 后权重为 0——训练时"预测下一个词"不许偷看答案，推理时才能一个字一个字往外生成（自回归）。' },
      { q: '为什么打分要除以 √d？', kind: 'text', why: '点积的方差随维度 d 线性增大；不缩放则分数巨大、softmax 饱和成 one-hot、梯度近乎为零。√d 把方差拉回 1，保住可训练性。' },
    ],
    sim: { type: 'attention' },
  },
  {
    id: 'c15', group: '阶段 1 · Transformer', title: '多头注意力', mech: 'H 个独立的 Q/K/V 投影',
    read: `
<p>一个注意力头只能"盯一种关系"。多头注意力（multi-head）的解法透着朴素的智慧：<b>与其造一个全知的大头，不如造 H 个各司其职的小头</b>——每个头有独立的 W_q/W_k/W_v 投影，把 C 维通道切成 H 份（每头 C/H 维），各自算注意力，最后拼回来再线性混合。</p>
<p>在右侧交互台切换「头 A / 头 B」：同样的句子、同样的机制，两个头学到的权重模式完全不同——这正是设计意图（真实大模型里，有的头盯语法、有的头盯指代、有的头几乎均匀铺开当"保底"）。工程上还有个妙处：多头<b>不增加计算量</b>——每头维度是 C/H，总量与单头 C 维相同，只是把预算分散投资。</p>
<p class="soul">🤔 留给你想：为什么"并联多个小头"优于"串联加深一个大头"？提示：注意力的本质是"建立 token 间关系"，并联 = 多种关系同时建立、互不干扰；串联 = 关系被层层改写。这与 c08"宽 vs 深"的权衡遥相呼应。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Vaswani et al. 2017</b>（<a href="https://arxiv.org/abs/1706.03762" target="_blank">arXiv:1706.03762</a>）§3.2.2 Multi-Head Attention。原文的表述极简："多头让模型在不同位置关注不同表示子空间的信息。"</li>
<li><b>Sasha Rush 等《The Annotated Transformer》</b>（<a href="https://nlp.seas.harvard.edu/annotated-transformer/" target="_blank">Harvard NLP</a>）。哈佛 NLP 组把原论文逐行变成可运行的 PyTorch 代码——论文与代码的逐行对照读本，阶段 1 后期对照自己实现的神器。</li>
<li><b>李沐《动手学深度学习》第 10 章</b>（<a href="https://zh.d2l.ai" target="_blank">zh.d2l.ai</a>）。注意力评分、自注意力、多头——中文教材线的对应章节。</li>
<li><b>延伸 · 头并不总是"各司其职"</b>：后来的研究发现可以剪掉相当比例的头而几乎不掉点（如 Michel et al. 2019, arXiv:1905.10650）——"每头都有独特作用"更多是浪漫想象，工程真相是冗余也很足。</li>
</ul></details>`,
    quiz: [
      { q: 'C=128、H=4 时，每个注意力头的维度是多少？拼接回后呢？', kind: 'number', answer: 32, why: '每头 C/H = 32 维；4 头拼接回 128 维，再过一次输出投影 W_o 混合各头信息。多头不加总计算量。' },
      { q: '一句话说明"多头并联"在学什么？', kind: 'text', why: '不同投影子空间里的不同关系（语法/指代/位置……每个头一种偏好），彼此独立建立、最后线性融合。' },
    ],
    sim: { type: 'attention' },
  },
  {
    id: 'c16', group: '阶段 1 · Transformer', title: 'Block：残差与 LayerNorm', mech: 'LN → 注意力/MLP → 残差',
    read: `
<p>光有注意力还叠不出深网络。Transformer 的基本积木是 <b>Block</b>，配方固定：<code>x = x + 注意力(LN(x))</code>，再来一遍 <code>x = x + MLP(LN(x))</code>——两个零件（注意力负责 token 间交流，MLP 负责 token 内加工），一个胶水（<b>残差</b>），一个稳定器（<b>LayerNorm</b>）。</p>
<p><b>残差</b>（ResNet, 2015）是深度学习的救命稻草：相加让梯度有了"高速公路"，100 层不再是奢望——你能在 c07 的计算图上亲手验证：加法节点的梯度原样回传。<b>LayerNorm</b>（Ba et al., 2016）按"每个 token 的特征维"归一化（对比 BatchNorm 按批统计——变长序列、batch 内句子互不相干，NLP 天然选 LN）。还有个承前启后的细节：原始论文把 LN 放在子层之后（Post-LN），GPT-2 改成放在之前（Pre-LN）——<b>你 c17 要抄的 GPT 用的是 Pre-LN</b>，深网络下更稳。</p>
<p>以及那个"4 倍扩展"的 MLP：先把通道扩到 4C 再压回来。为什么是 4？没有定理，是工程界的经验共识——大到够用，小到跑得动。</p>
<p class="soul">🤔 留给你想：注意力负责"token 之间"，MLP 负责"token 之内"——如果把模型想成一支团队，这两者分别像团队协作里的什么？（开会交流 vs 各自干活；有研究估计参数与计算的大头都在 MLP——"讨论"贵而少，"干活"多而沉。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>He et al.《Deep Residual Learning》</b>（<a href="https://arxiv.org/abs/1512.03385" target="_blank">arXiv:1512.03385</a>, 2015）。残差的出生证明（ResNet，ImageNet 三冠）；"高速公路"直觉的原始表述。</li>
<li><b>Ba, Kiros & Hinton《Layer Normalization》</b>（<a href="https://arxiv.org/abs/1607.06450" target="_blank">arXiv:1607.06450</a>, 2016）。LN 原论文，作者栏又是 Hinton。</li>
<li><b>Radford et al.《GPT-2》</b>（OpenAI, 2019，《Language Models are Unsupervised Multitask Learners》）。Pre-LN 结构与 GPT 家族配方的一份权威实料——c17 你复现的正是它的微缩版。</li>
<li><b>延伸 · "4"从哪来</b>：MLP 的 4× 扩展自原始论文沿用至今成为默认；近期研究（如 SwiGLU/MoE）在改这个数字——"魔法数字"被挑战的一天，就是架构演化的日常。</li>
</ul></details>`,
    quiz: [
      { q: '残差连接为什么让深层网络变得可训练？', kind: 'text', why: 'x = x + f(x) 使梯度可以沿"+"原样回传（c07：加法梯度直通），每层只需学"修正量"而非完整变换——信息与梯度都有高速公路。' },
      { q: 'NLP 里选 LayerNorm 而非 BatchNorm 的原因？', kind: 'text', why: '序列长度可变、batch 内句子互不相关，按批统计不稳定；LN 对每个 token 自己的特征维归一化，与批大小、长度解耦。' },
      { q: 'GPT 系用的是 Pre-LN 还是 Post-LN？', kind: 'choice', options: [{ t: 'Pre-LN（LN 放在子层之前）', correct: true, why: '' }, { t: 'Post-LN（原始论文的做法）', correct: false, why: '' }], why: 'GPT-2 起改用 Pre-LN，深网络训练更稳；原始 Transformer 论文是 Post-LN——抄论文时要分清抄的是哪一版。' },
    ],
    sim: { type: 'lncalc' },
  },
  {
    id: 'c17', group: '阶段 1 · Transformer', title: '组装：字符级 GPT 全景', mech: '嵌入 → L×Block → LN → lm_head',
    read: `
<p>万事俱备：分词（c13）把文本变成 token id；注意力（c14/c15）让 token 交流；Block（c16）把它们叠深。组装表只有五行：</p>
<ol>
<li>token id 查<b>嵌入表</b> + 位置嵌入 → (B, T, C)；</li>
<li>过 <b>L 层 Block</b>（形状始终 (B, T, C)——深度不改变形，这是残差和"通道恒定"设计的默契）；</li>
<li>最后一层 <b>LayerNorm</b>；</li>
<li><b>lm_head</b>（一个不带偏置的线性层）对词表打分 → (B, T, V)；</li>
<li>与"下一个真实字符"算<b>交叉熵</b> → 标量。训练循环？还是 c09 那五件套，一字不差。</li>
</ol>
<p>右侧形状追踪器把整条流水线握在手里：拖 B/T/C/L/H，看每一站的形状与总参数量。注意观察：C 从 128 加到 384，参数量按<b>平方</b>涨——因为注意力和 MLP 都是 C² 级。这就是"模型大小"的真实手感，也是显存账本的入口。</p>
<p class="soul">🤔 留给你想：位置嵌入为什么必须加？把顺序打乱重排 token，注意力网络会得到一模一样的结果（注意力天生"无视顺序"）——是"集合"不是"序列"。一句话：没有位置信息的 GPT 是个失忆的词袋。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Andrej Karpathy《Let's build GPT》</b>（<a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank">YouTube, 2023</a>）。S12/S13 跟敲的原片：从 bigram 到多头 GPT，全程莎翁语料。</li>
<li><b>karpathy/nanoGPT</b>（<a href="https://github.com/karpathy/nanoGPT" target="_blank">GitHub</a>）。同款架构的工程版（约 300 行训练脚本），阶段 1 毕业后拿它重跑中文语料。</li>
<li><b>Radford et al.《GPT-2》</b>（OpenAI, 2019）。你复现的架构 = GPT-2 的缩水版；论文里的超参表（12 层/12 头/117M）值得对着看一眼。</li>
<li><b>延伸 · 同一张图放大三万倍</b>：形状追踪器里的模型 ~1M 参数，GPT-3 = 175B，今天的前沿模型更大——架构自 2018 年以来出奇地稳定，变的是 scale 与数据。Karpathy 说"Transformer 就是深度学习的 CNN 时刻"，此言不虚。</li>
</ul></details>`,
    quiz: [
      { q: 'B=4、H=4、T=32、C=128 时，单个头的注意力权重矩阵形状是？', kind: 'choice', options: [{ t: '(4, 4, 32, 32)', correct: true, why: '' }, { t: '(4, 32, 128)', correct: false, why: '' }, { t: '(4, 128, 128)', correct: false, why: '' }], why: '(B, H, T, T)：每个 batch、每个头一张 T×T 权重图——右侧形状追踪器可验证。' },
      { q: 'lm_head 输出的形状（B, T, V）中 V 是什么？交叉熵拿它和什么比？', kind: 'text', why: 'V=词表大小；每个位置给出"下一个字符是词表中每个字符"的打分（logits），与真实下一字符的 id 算交叉熵。' },
      { q: '通道 C 从 128 加倍到 256，参数量大约变为几倍？', kind: 'number', answer: 4, tol: 0.5, why: '注意力和 MLP 的参数都 ∝ C²，翻倍 → 4 倍。嵌入虽是线性项，但大头在 Block。' },
    ],
    sim: { type: 'shapes' },
  },
  {
    id: 'c18', group: '阶段 1 · Transformer', title: '生成：温度与 top-k', mech: 'logits ÷ T → softmax → 截断采样',
    read: `
<p>训练好的 GPT 怎么写文章？逐字符循环：<b>喂上文 → 得到词表上的打分（logits）→ 变成概率 → 采一个字 → 拼回上文 → 重复</b>。关键全在"变成概率"这一步的两个旋钮：</p>
<p><b>温度 T</b>：logits ÷ T 再 softmax。T→0：分布尖锐化，永远选最高分（贪心，稳定但车轱辘话）；T=1：原始分布；T&gt;1：分布摊平，冷门字符上位（有创意，也可能胡言乱语）。公式与统计力学的 Boltzmann 分布同源——"温度"是物理学家借来的词。<b>top-k</b>：只保留分数前 k 个候选再归一化，把长尾的"怪字"一刀切掉。</p>
<p>右侧模拟器的语言模型是真的：加载时用 400 字中文小语料现训一个字符 bigram 模型（数频次）。它写得不算好——但正因如此，<b>温度的效果才看得格外清楚</b>：T=0.2 时反复输出"春天花会开"式的安全牌；T=2.5 时开始出现"春蝶树雪"式的梦话。S13 你训练的字符 GPT 接管这个分布后，同样的旋钮立刻产出像样的句子。</p>
<p class="soul">🤔 留给你想：T=0（贪心）与 T=2（放飞）之间，"写得最好"的温度因任务而异——写代码要低温，写诗要高温。这个"确定性↔多样性"的滑杆，是不是一切生成式系统的共同权衡？（想想推荐系统、游戏关卡生成。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Andrej Karpathy《Let's build GPT》</b>（<a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank">YouTube, 2023</a>）结尾的采样演示——generate() 函数约 20 行，S13 你会亲手写它。</li>
<li><b>Holtzman et al.《The Curious Case of Neural Text Degeneration》</b>（<a href="https://arxiv.org/abs/1904.09751" target="_blank">arXiv:1904.09751</a>, 2019）。论证贪心/beam 容易产出"车轱辘话"，提出 top-p（核采样）——阶段 2 你会在 HF 的生成参数里与它重逢。</li>
<li><b>延伸 · 温度的物理学出身</b>：softmax(x/T) 与统计力学的 Boltzmann 分布同构，T 是"系统的混乱程度"——低温结晶、高温气化，语言模型的低温复读、高温胡言，完美同构。</li>
<li><b>延伸 · 采样不是唯一答案</b>：推理解码还有 beam search、对比搜索、受约束解码等流派；对话模型主流仍是"温度 + top-p"的组合——简单、可控、够好。</li>
</ul></details>`,
    quiz: [
      { q: 'temperature = 0.1 时的生成风格是？', kind: 'choice', options: [{ t: '接近贪心：稳定、保守、容易重复', correct: true, why: '' }, { t: '天马行空、大量生僻字', correct: false, why: '' }, { t: '和 T=1 完全一样', correct: false, why: '' }], why: '低温把 logits 差距放大，分布尖锐化——确定性换多样性。' },
      { q: 'top-k = 1 等价于什么解码方式？', kind: 'text', why: '贪心解码（每步取最高分）。它仍可能有不确定性为零的"安全复读"问题。' },
      { q: '一句话说明温度旋钮在权衡什么？', kind: 'text', why: '确定性与多样性：低温可复现、适合代码/事实；高温有创造性、适合头脑风暴——代价是出错率。' },
    ],
    sim: { type: 'sampler' },
  },

  // ============ 组 F · 阶段 2：Hugging Face ============
  {
    id: 'c19', group: '阶段 2 · Hugging Face', title: '预训练模型的解剖', mech: 'config / weights / tokenizer',
    read: `
<p>你在 Hub 上点了 Download，到底下载了什么？很多人用了一年模型都答不上来。答案是一个"装配箱"，以 Qwen2.5-0.5B 为例：</p>
<pre>Qwen2.5-0.5B/
├── config.json               ← 身份证：32 层？16 头？词表多大？
├── model.safetensors         ← 权重本体（0.5B 参数 ≈ 1GB fp16）
├── tokenizer.json            ← 词表 + 切分规则
├── tokenizer_config.json     ← 特殊 token 与预处理配置
└── generation_config.json    ← 生成默认值（温度、top-p 等）</pre>
<p>三个部件各司其职，坏了各有各的死法：没有 config，框架不知道该把权重"装进什么形状的骨架"（c17 形状追踪器里的 L/C/H 就记在这）；缺 tokenizer 或配错词表，模型直接失语——因为同一个 id 在两张词表里指两个完全不同的 token；权重坏一位，输出就是乱码。</p>
<p><code>from_pretrained()</code> 做的就是按名装配的两步：</p>
<pre>from transformers import AutoTokenizer, AutoModelForCausalLM

tok = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B")   # ① 读词表
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B")  # ② 读 config + 权重</pre>
<p>两个工程细节：<b>① 下载位置</b>——缓存在 <code>~/.cache/huggingface/hub/</code>，会随实验膨胀（路径文档的磁盘纪律：每阶段结束检查一次）；<b>② 格式安全</b>——老式 pickle 权重在加载时会<b>执行任意代码</b>（攻击者构造恶意 <code>__reduce__</code> 即可），safetensors 只含张量数据 + JSON 头，想藏代码都藏不了，所以新模型一律用它。</p>
<p class="soul">🤔 留给你想：为什么"权重和 tokenizer 必须成对"？做个思想实验：用 BERT 的词表给 GPT 的输出解码——同一个 id 在两张词表里是两个 token，输出会是什么景象？（顺便理解：为什么微调时连词表都不能随便加新 token——嵌入矩阵的形状是死的。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Hugging Face 官方课程 LLM Course</b>（<a href="https://huggingface.co/learn" target="_blank">huggingface.co/learn</a>，有中文版）。阶段 2 实操主线，前三章覆盖本阶段全部考点。</li>
<li><b>Hugging Face · safetensors</b>（<a href="https://github.com/huggingface/safetensors" target="_blank">GitHub</a>）。为什么快且安全：零拷贝 + 不执行代码。</li>
<li><b>Qwen2.5 技术报告</b>（arXiv:2412.15115）。看一个开源模型家族的 config——0.5B 到 72B 是同一张蓝图缩放。</li>
</ul></details>`,
    quiz: [
      { q: 'config.json 里存的是什么？权重存在哪？', kind: 'text', why: 'config = 架构超参（层数/头数/词表大小）；权重在 model.safetensors（或分片文件）。from_pretrained 两样都要读。' },
      { q: '为什么新模型都用 safetensors 而不是老的 pickle 格式？', kind: 'text', why: 'pickle 加载即执行任意代码（恶意模型可以借此攻击你）；safetensors 是纯数据格式，只能被读，不能被执行。' },
    ],
    sim: { type: 'modelsim' },
  },
  {
    id: 'c20', group: '阶段 2 · Hugging Face', title: 'pipeline 与精细控制', mech: '三行推理 vs AutoModel 组装',
    read: `
<p>HF 给了你两档油门，同一个任务（让 0.5B 模型续写一句诗）各写一遍。</p>
<p><b>傻瓜档 pipeline</b>——三行，连分词都不用你管：</p>
<pre>from transformers import pipeline

pipe = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B", device="mps")
print(pipe("床前明月光，", max_new_tokens=20))</pre>
<p><b>手动档 AutoModel</b>——三步全部摊开：</p>
<pre>from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

tok = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B")
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B").to("mps")

inputs = tok("床前明月光，", return_tensors="pt").to("mps")   # 文字 → id 张量
out = model.generate(**inputs, max_new_tokens=20)             # 逐 token 生成（c18 的循环）
print(tok.decode(out[0], skip_special_tokens=True))           # id → 文字</pre>
<p>对照着读，你会发现 <b>pipeline 没有任何魔法</b>——它就是把"分词 → 模型 → 解码"串起来的胶水函数。S18 的三个 demo（生成/情感分类/翻译）会两档各写一遍：傻瓜档给你全局感，手动档给你推理过程的每一块骨头。</p>
<p>两个工程细节提前记下：<b>① device="mps"</b>——Mac 上不传它就是 CPU 干跑，速度差一个数量级（阶段 0 自检脚本验证过的后端，这里终于派上用场）；<b>② 国内下载卡住</b>——换 ModelScope 魔搭镜像，模型与 HF 同名。</p>
<p class="soul">🤔 留给你想：pipeline 帮你藏了什么？藏起来的部分什么时候变成坑？（提示：预处理/后处理不一致时，模型看到的和你以为它看到的不是同一句话——比如 pipeline 自动加了对话模板，而手动档忘了加。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>HF LLM Course 第 1–3 章</b>（<a href="https://huggingface.co/learn" target="_blank">huggingface.co/learn</a>）。pipeline、AutoModel、tokenizer 三件的官方正解。</li>
<li><b>ModelScope 魔搭社区</b>（<a href="https://modelscope.cn" target="_blank">modelscope.cn</a>）。国内模型镜像与下载提速首选。</li>
<li><b>延伸 · pipeline 的本质</b>：它只是一段"把 tokenizer→model→postprocess 串起来的胶水代码"，读一遍它的源码（几十行）胜过十篇教程。</li>
</ul></details>`,
    quiz: [
      { q: 'pipeline 第一个参数是什么？第二个通常是什么？', kind: 'text', why: '任务名（如 "text-generation"）+ 模型名（Hub id 或本地路径）。可选 device 指定推理设备。' },
      { q: 'AutoTokenizer 和 AutoModel 为什么要"成对"从同一个模型名加载？', kind: 'text', why: 'tokenizer 的词表与模型的嵌入矩阵严格对应（c19），错配 = id 含义全错，模型输出乱码。' },
    ],
    sim: { type: 'pipelinepeek' },
  },
  {
    id: 'c21', group: '阶段 2 · Hugging Face', title: '解码策略全家桶', mech: 'temperature / top-k / top-p',
    read: `
<p>c18 玩过温度与 top-k，现在补上最后一块拼图：<b>top-p（核采样，nucleus sampling）</b>。先把三种策略的算法摆在一起：</p>
<pre>温度 T   ：logits ÷ T → softmax（改分布的"陡峭度"）
top-k    ：只保留分数最大的 k 个，其余 -∞，重新归一化
top-p    ：按概率从大到小累加，加满 p 就"封口"，之后的全部丢弃</pre>
<p>top-p 聪明在哪？用一个小分布演算。假设模型给四个候选词的概率是：</p>
<pre>词A 50% · 词B 30% · 词C 15% · 词D 5%

top-p = 0.8 → 从大到小累加：A(50%) + B(30%) = 80% 达标 → 封口
             保留 {A, B}，C、D 丢弃
top-k = 3   → 保留 {A, B, C}，不管模型多自信</pre>
<p>看到了吗：<b>p 是活门槛，k 是死数字</b>。分布尖锐时（A 占 90%），top-p=0.8 只留 1~2 个候选、自动变保守；分布平缓时（四个词各 25%），同一个 p=0.8 会留下 3~4 个候选、保持多样。k 做不到这种随机应变。</p>
<p>右侧采样模拟器（已加 top-p 滑杆）做三组对照实验，各写一句结论：① T=1 固定，扫 top-k=1/10/50；② top-k=50 固定，扫 T=0.3/1.0/2.0；③ top-p=0.9 在 T=0.5 与 T=1.5 下分别"封口"在几个候选？S19 把同样的扫描搬到真实模型 Qwen2.5-0.5B 上。</p>
<p class="soul">🤔 留给你想：为什么"自适应门槛"（top-p）通常优于"固定门槛"（top-k）？把这个问题推广到生活：固定配额 vs 按需分配，各适合什么场景？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Holtzman et al.《The Curious Case of Neural Text Degeneration》</b>（<a href="https://arxiv.org/abs/1904.09751" target="_blank">arXiv:1904.09751</a>, 2019）。top-p 的原始论文；开头的人造文本对比图是名场面。</li>
<li><b>HF 文档 · Text generation strategies</b>（huggingface.co/docs）。官方把全部解码策略串讲的页面，S19 的查表工具。</li>
<li><b>延伸 · 旋钮的战场</b>：temperature/top-p 后来成了"人机协作的界面"——写代码低温、写文案高温，已成为 prompt 工程的常识配比。</li>
</ul></details>`,
    quiz: [
      { q: 'top-p 和 top-k 的本质区别一句话？', kind: 'text', why: 'top-k 是固定候选数；top-p 是固定累计概率质量、候选数自适应——分布尖时候选少，分布平时候选多。' },
      { q: '写代码补全任务，T 和 top-p 应该往哪边调？为什么？', kind: 'text', why: '低温（0.2~0.4）+ 保守 top-p：代码对确定性要求高，一个"有创意"的错字就是一行 bug。' },
    ],
    sim: { type: 'sampler' },
  },
  {
    id: 'c22', group: '阶段 2 · Hugging Face', title: 'GPT 与 BERT：两条路线', mech: 'CLM 单向生成 vs MLM 双向理解',
    read: `
<p>2018 年，两篇论文分岔出了两条路线：<b>GPT-1</b>（OpenAI，6 月）用"预测下一个词"从左到右训练；<b>BERT</b>（Google，10 月）用"完形填空"（随机遮住 15% 的词让模型猜，MLM）双向训练。同一个 Transformer 底座，看世界的方式相反。拿一个句子看两种训练的眼界差别：</p>
<pre>句子：「北京是中国的 ____」

BERT（双向，MLM）：  两边全看 → 填「首都」/「心脏」（填空题）
GPT（单向，CLM）  ：只看「北京是中国的」→ 预测下一个词（续写题）</pre>
<p>差别落在代码里就是<b>一个掩码</b>：GPT 的注意力带着因果掩码（c14 的上三角 ×，位置 i 看不见 j>i）；BERT 的注意力没有它，双向全通。一张掩码，两种物种。</p>
<p>各自赢得的赛道也由此注定——</p>
<table class="mini-table">
<tr><th></th><th>GPT（CLM）</th><th>BERT（MLM）</th></tr>
<tr><td>训练目标</td><td>预测下一个词</td><td>还原被遮的词</td></tr>
<tr><td>看得多远</td><td>只能看左边</td><td>左右全看</td></tr>
<tr><td>擅长任务</td><td>生成、对话、续写</td><td>分类、检索、抽取</td></tr>
<tr><td>产物形态</td><td>直接当产品用（ChatGPT）</td><td>当底座再加工（搜索排序）</td></tr>
</table>
<p class="soul">🤔 留给你想：BERT 的 MLM"看得到两边"，按理说理解更深，为什么统治生成时代的反而是"偷看不了未来"的 GPT？（提示：MLM 学的是"填空"，自回归学的是"续写"——哪个的产物能直接当产品用？）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Devlin et al.《BERT》</b>（<a href="https://arxiv.org/abs/1810.04805" target="_blank">arXiv:1810.04805</a>, 2018）。MLM 预训练原文。</li>
<li><b>Radford et al.《GPT-2》</b>（OpenAI, 2019）。自回归路线的宣言式论文。</li>
<li><b>李沐论文精读</b>：GPT 系列（<a href="https://www.bilibili.com/video/BV1AF41137uu" target="_blank">BV1AF41137uu</a>）与 BERT 两期——S19 的主材料。</li>
<li><b>延伸 · 殊途同归</b>：今天的前沿模型也在用 BERT 式思想"补课"——比如对齐阶段的双向偏好学习。路线之争的终局往往是融合。</li>
</ul></details>`,
    quiz: [
      { q: 'BERT 为什么天然不适合"生成"？', kind: 'text', why: 'MLM 双向训练：每个位置都看得到全文（包括"未来"）。自回归生成要求严格单向——BERT 的注意力里没有因果掩码。' },
      { q: '[MASK] 在 BERT 里扮演什么角色？', kind: 'text', why: '训练时随机遮 15% 的词强制模型用上下文双向推断——"完形填空"是它的训练信号，也是它理解力的来源。' },
    ],
    sim: { type: 'maskview' },
  },
  {
    id: 'c23', group: '阶段 2 · Hugging Face', title: '上下文窗口与成本', mech: 'context length 与 token 计费',
    read: `
<p>用 API 时有两个数字决定钱包与体验：<b>上下文窗口</b>（模型一次能"看见"的最大 token 数）和<b>单价</b>（每百万 token）。先做一个算术，你就再也不会对账单吃惊了——多轮对话为什么越来越贵：</p>
<pre>假设：每轮你输入 100 token，模型回答 50 token，对话 5 轮

第 1 轮输入 =        100          （新问题）
第 2 轮输入 =  100 +  50 + 100    （历史问题+历史回答+新问题）
第 3 轮输入 =  250 + 100
第 5 轮输入 ≈ 700 …

5 轮的总输入 ≈ 100+200+300+400+500 = 1500 token —— 平方增长，不是 5 倍</pre>
<p>三条由此推出的工程常识：</p>
<ol>
<li>输入和输出<b>都</b>计费，历史每轮重发——长对话成本近似<b>平方</b>陷阱；</li>
<li>"塞得下"不等于"答得好"：长上下文里模型顾两头、忘中间（Lost in the middle, 2023 的实证）；</li>
<li>省钱的顺序永远是：<b>先换小模型 → 再压缩历史 → 最后才上长窗口大模型</b>。</li>
</ol>
<p>建立"一切皆 token"的换算直觉就够用：1 个中文字 ≈ 1~2 token，1 页英文 ≈ 500~600 token。S20 让你用 tokenizer 给自己最常用的一段话标价。</p>
<p class="soul">🤔 留给你想：c29 会告诉你，上下文窗口的本质是 KV cache 的显存上限——"模型能记多长"是个硬件问题，不是智力问题。这如何改变你对"大模型 vs 小模型"的想象？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Liu et al.《Lost in the Middle》</b>（arXiv:2307.03172, 2023）。长上下文里模型"顾两头忘中间"的实证——塞得满 ≠ 用得上。</li>
<li><b>延伸 · 滑动窗口与 RAG</b>：超越窗口的两大流派——截断滑窗（丢历史）与检索注入（只带相关片段，见 c32）。</li>
<li><b>延伸 · 一切皆 token</b>：API 计费、上下文窗口、推理速度、显存占用——四个看似无关的数字，全是同一个单位的不同投影。</li>
</ul></details>`,
    quiz: [
      { q: '十轮对话后 API 成本为什么远超十倍单轮？', kind: 'text', why: '每轮都把全部历史重发一遍：第 n 轮的输入 ≈ 前 n-1 轮的总量 → 总成本随轮数近似平方增长。' },
      { q: '上下文窗口限制的物理本质是什么？（阶段 4 会展开）', kind: 'text', why: 'KV cache 显存：每个 token 的 K/V 都要在显存里住着供注意力查询——窗口 = 显存能养得起多少 token。' },
    ],
    sim: { type: 'chatcost' },
  },

  // ============ 组 G · 阶段 3：微调 ============
  {
    id: 'c24', group: '阶段 3 · 微调', title: 'LoRA：低秩分解', mech: '冻结 W，只训 B·A',
    read: `
<p>全参微调 7B 模型 = 训练 70 亿个参数 = 一台服务器。LoRA（Hu et al., 2021）的洞察轻巧得漂亮：<b>微调要学的"增量"，装在很小的低秩矩阵里就够了</b>。于是冻结全部原权重 W，只训练两个瘦矩阵的乘积去表示修正量：</p>
<p style="text-align:center"><code>W' = W + B·A　　A: C×r　B: r×C　r 通常 8~64</code></p>
<p>代码草图只有十来行（S24 你会在真实框架里遇到它的量产版）：</p>
<pre>class LoRALinear(nn.Module):
    def __init__(self, old: nn.Linear, r=8, alpha=16):
        self.old = old                                   # 原权重，冻结不训
        self.A = nn.Parameter(torch.randn(r, old.in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(old.out_features, r))  # ← B 初始为 0！
        self.scale = alpha / r
    def forward(self, x):
        return self.old(x) + self.scale * (x @ self.A.T @ self.B.T)</pre>
<p>三个细节都值得追问：<b>① B 为什么初始为 0？</b>——保证训练第一步 ΔW=B·A=0，从"完全等于原模型"出发，不破坏预训练知识。<b>② rank r 管什么？</b>——增量 ΔW 的"容量"：r=16、C=4096 时可训练参数只有全参的约 0.8%。<b>③ alpha 管什么？</b>——有效修正 = (alpha/r)·B·A，所以 alpha/r 是"学习强度"旋钮，与容量旋钮 r 别拧混。</p>
<p>为什么只加在注意力投影矩阵上？原论文的消融实验：注意力层的收益最高，MLP 上加反而平平——"参数花在刀刃上"。而推理时 B·A 可合并回 W，<b>零额外延迟</b>，这是它战胜前代 adapter 方法的决定性优势。右侧探索器拖动 r 和 C，亲眼看参数量的悬崖。</p>
<p class="soul">🤔 留给你想：r 的本质是"任务需要多少新知识"的旋钮。给"文言文翻译助手"（改风格）和"教会它一门全新编程语言"（灌知识），你会分别选多大 r？为什么后者 LoRA 本身就不太够？</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Hu et al.《LoRA》</b>（<a href="https://arxiv.org/abs/2106.09685" target="_blank">arXiv:2106.09685</a>, 2021）。十余页的原论文，S22 精读对象；重点看"为什么低秩够用"的动机实验。</li>
<li><b>MLX（Apple 官方）</b>（<a href="https://github.com/ml-explore/mlx" target="_blank">github.com/ml-explore/mlx</a>）。本机微调工具（<code>mlx_lm.lora</code>），16GB Mac 的正解。</li>
<li><b>LLaMA-Factory</b>（<a href="https://github.com/hiyouga/LLaMA-Factory" target="_blank">GitHub</a>）。图形化微调全家桶：先用它跑通全局，再回代码裸写（路径文档 6.2 的顺序）。</li>
<li><b>延伸 · rank 与 alpha</b>：实际代码里还有个 alpha（缩放系数），有效修正 ≈ alpha/r × B·A——alpha/r 是"学习强度"旋钮，r 才是"容量"旋钮，别拧混。</li>
</ul></details>`,
    quiz: [
      { q: 'LoRA 把可训练参数从 C² 降到多少？', kind: 'text', why: '降到 2Cr；r=16、C=4096 时约为原全参的 0.78%。这就是"16GB 显卡微调 7B"的数学门票。' },
      { q: '推理时 LoRA 会拖慢速度吗？', kind: 'text', why: '不会：B·A 可合并回 W，结构与原模型完全一致，零额外延迟——这是它战胜 adapter 等前代方案的关键。' },
    ],
    sim: { type: 'lora' },
  },
  {
    id: 'c25', group: '阶段 3 · 微调', title: 'QLoRA：量化的显存账本', mech: '4-bit 冻结基座 + LoRA',
    read: `
<p>LoRA 解决了"训多少参数"，QLoRA（Dettmers et al., 2023）解决剩下的问题："参数住在多大的房子里"。配方一句话：<b>冻结的基座量化到 4-bit 存储，LoRA 适配器保持 16-bit 精度训练</b>。原论文靠三个技巧把账压到极限：</p>
<ol>
<li><b>NF4（4-bit NormalFloat）</b>：普通 INT4 是均匀刻度，但权重分布是钟形（集中在 0 附近）——NF4 把刻度对准正态分布的分位点，同样 4 bit，误差更小；</li>
<li><b>双重量化</b>：连"量化用的刻度表"本身也再量化一次，省下最后一点零头；</li>
<li><b>分页优化器</b>：训练峰值显存突然飙升时，把优化器状态临时挪到内存，防 OOM。</li>
</ol>
<p>把账算给 7B 模型看：FP16 基座 14GB → NF4 后 <b>3.5GB</b>；梯度与优化器只服务 LoRA 的 ~2000 万参数 ≈ <b>0.2GB</b>；再加激活开销，<b>~6GB 就能微调 7B</b>——16GB 的 Mac 和免费 Colab 的 T4 从此都有入场券。</p>
<p>一个容易忽略的细节：<b>省的是"存"，不是"算"</b>——4-bit 存储的权重在计算时要反量化回 16-bit（compute dtype），所以 QLoRA 省显存但<b>不会更快</b>。做成本估算时，这两个概念必须分开。</p>
<p class="soul">🤔 留给你想：为什么基座敢量化到 4-bit，LoRA 适配器却不敢？（提示：基座是"已学成的知识"，容差大；适配器是"正在学的增量"，梯度对精度敏感。）"哪里能省、哪里不能省"，是所有优化问题的第一问。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Dettmers et al.《QLoRA》</b>（<a href="https://arxiv.org/abs/2305.14314" target="_blank">arXiv:2305.14314</a>, 2023）。4-bit NormalFloat(NF4)、双重量化、分页优化器三件套的原文。</li>
<li><b>bitsandbytes</b>（<a href="https://github.com/TimDettmers/bitsandbytes" target="_blank">GitHub</a>）。QLoRA 的实现库——注意只支持 NVIDIA CUDA，Mac 上对应物是 MLX 的量化接口。</li>
<li><b>延伸 · 存与算的分离</b>：4-bit 存储 + 反量化后 16-bit 计算（compute dtype）是 QLoRA 的隐藏细节——省显存不等于省算力，这个区分在成本估算时值钱。</li>
</ul></details>`,
    quiz: [
      { q: 'QLoRA = 哪两样东西的组合？', kind: 'text', why: '4-bit 量化的冻结基座 + 16-bit 的 LoRA 适配器训练。基座管知识存储，适配器管学习增量。' },
      { q: '7B 模型 FP16 全参微调与 QLoRA 微调的显存门槛分别大约是多少？', kind: 'choice', options: [{ t: '≈56GB 与 ≈6GB', correct: true, why: '' }, { t: '≈14GB 与 ≈2GB', correct: false, why: '' }, { t: '两者差不多', correct: false, why: '' }], why: 'FP16 权重本体就 14GB，训练再乘梯度/优化器状态；QLoRA 基座压到 ~3.5GB 加小 adapter 与激活。' },
    ],
    sim: { type: 'quant' },
  },
  {
    id: 'c26', group: '阶段 3 · 微调', title: '指令数据集', mech: 'instruction / input / output',
    read: `
<p>微调的本质是"用示例告诉模型它的岗位说明书"。数据集格式就是三栏——<b>instruction</b>（要做什么）、<b>input</b>（可选输入）、<b>output</b>（期望回答），一条真实的训练样本长这样：</p>
<pre>{"instruction": "把下面的现代文翻译成文言文。",
 "input":       "我非常想念你。",
 "output":      "吾甚思君。"}</pre>
<p>2023 年的起点是 Stanford Alpaca：用 5.2 万条这样的数据微调 LLaMA，成本不到 600 美元却复现了指令跟随能力。但随后的共识更激进——<b>LIMA 论文用 1000 条精选数据就完成对齐</b>。为什么质量能碾压数量？回到微调的本质：它不灌知识（知识在预训练里），只校准<b>行为模式</b>。模型是最高级的模仿者：你给它 10000 条里混了 50 条敷衍的坏回答，它学会的不是"99.5% 好习惯"，而是"偶尔也可以敷衍"——坏示例的毒性按倍数放大。</p>
<p>所以自建数据的正确姿势（路径文档让你写 200 条的用意）：先亲手写 <b>3 条金标准</b>（你心目中完美回答的样子），再用它当"批改标准"产出其余条目；每条过四道检查——输入多样、输出风格一致、无事实错误、覆盖真实使用场景。</p>
<p class="soul">🤔 留给你想：给"文言文翻译助手"造数据时，同一个现代句你只给一种文言译法还是给多种？——数据里的一对多，会让模型学会"每次随机挑一种"还是"风格漂移"？这个问题的答案，决定了你该在数据层面如何控制随机性。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Taori et al.《Stanford Alpaca》</b>（<a href="https://crfm.stanford.edu/2023/03/13/alpaca.html" target="_blank">crfm.stanford.edu</a>, 2023）。52K 指令数据 + 训练配方全开源，指令微调的全民起点。</li>
<li><b>Zhou et al.《LIMA: Less Is More for Alignment》</b>（<a href="https://arxiv.org/abs/2305.11206" target="_blank">arXiv:2305.11206</a>, 2023）。1000 条精选数据对齐 65B 模型——"质量>数量"的实证巅峰。</li>
<li><b>BelleGroup 中文指令数据</b>（GitHub 搜索 BelleGroup）。中文指令数据的开源集合，S24 数据底料。</li>
</ul></details>`,
    quiz: [
      { q: '指令数据集的三栏格式是？哪一栏可选？', kind: 'text', why: 'instruction（任务）+ input（可选输入）+ output（期望输出）。无输入任务（如"翻译这句话"）input 留空。' },
      { q: '为什么"几百条高质量"能胜过"几万条平庸"？', kind: 'text', why: '微调校准的是行为模式而非知识；坏示例的毒性会放大，模型模仿的是你给的样子，不是你想要的样子。' },
    ],
    sim: { type: 'dsbuilder' },
  },
  {
    id: 'c27', group: '阶段 3 · 微调', title: '双轨工具链', mech: 'MLX 本机 + Colab 云端',
    read: `
<p>路径文档为本阶段设计双轨制，各取所长。两边的第一条命令先摆出来：</p>
<pre># 本机 MLX 轨（Apple GPU，1.5B~4B）
pip install mlx-lm
mlx_lm.lora --model mlx-community/Qwen2.5-1.5B-Instruct-4bit \\
    --data ./data --iters 600 --batch-size 4
mlx_lm.generate --model mlx-community/... --adapter adapters/ \\
    --prompt "把'我非常想你'翻译成文言文"

# 云端 Colab 轨（NVIDIA T4，7B QLoRA 工业栈）
peft.LoraConfig(r=16, target_modules=["q_proj","k_proj","v_proj","o_proj"])
trainer = SFTTrainer(model=..., train_dataset=..., peft_config=...)</pre>
<p>读这两段配置就能看出两条轨道的气质差异：MLX 把"量化的 1.5B + LoRA"打包成一条命令，让你专注<b>数据与效果</b>；Colab 的 PEFT/TRL 是工业界标准栈，target_modules 显式列出 c24 说的"加在注意力投影上"，让你看清<b>每个旋钮</b>。</p>
<p>顺序维持路径文档的定论：<b>先用 LLaMA-Factory 图形界面跑通一次全流程</b>（数据→训练→导出→对话验证，获得端到端全局感），<b>再用裸代码复现</b>——先有能跑的整体，才挂得住局部的理解。这与阶段 0"pipeline 建立全局、AutoModel 理解细节"的安排同构。</p>
<p class="soul">🤔 留给你想：动手前先用 c25 的计算器核一遍"模型 × 量化 × 序列长度"的显存账——为什么"先算账再开机"能省掉大半 OOM 报错？（回忆 c10：大多数失败是静默或事后爆的，事前一笔账是唯一便宜的防御。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>MLX 文档 · LLM 微调</b>（<a href="https://github.com/ml-explore/mlx-examples" target="_blank">github.com/ml-explore/mlx-examples</a>）。<code>mlx_lm.lora</code> 的官方示例与数据格式。</li>
<li><b>Google Colab</b>（<a href="https://colab.research.google.com" target="_blank">colab.research.google.com</a>）。免费 T4（16GB 显存）即可跑 7B QLoRA；注意会话时长限制。</li>
<li><b>延伸 · 显存账本实战</b>：动笔前先用 c25 的计算器核一遍你的模型/量化/长度组合——"先算账再开机"能省掉大半 OOM 报错。</li>
</ul></details>`,
    quiz: [
      { q: '本机 MLX 与 Colab 各自的定位一句话？', kind: 'text', why: 'MLX：小模型、本机、免费随时跑，重在理解原理；Colab：CUDA 工业栈、7B QLoRA，重在见识标准流程。' },
      { q: '为什么建议 LLaMA-Factory 先行、裸代码随后？', kind: 'text', why: '全局感先行：知道端到端有哪些环节，再逐个深挖——避免在第一环就迷失于细节。' },
    ],
    sim: { type: 'cmdgen' },
  },

  // ============ 组 H · 阶段 4：推理 ============
  {
    id: 'c28', group: '阶段 4 · 推理', title: 'MoE：专家分诊', mech: '路由打分 → top-k 激活 → 加权混合',
    read: `
<p>模型要变聪明，最直接的办法是变大——但稠密模型的参数全员参与每次计算，大=慢=贵。MoE（Mixture of Experts）的做法：把每个 Block 里的 <b>FFN 层复制 8 份变成 8 个"专家"</b>（注意力层保持共享），再插一个<b>路由器</b>（一个小线性层）给每个 token 打分——只把 token 送给分数最高的 k 个专家，其余休眠。Switch Transformer 用 top-1，Mixtral 用 top-2。</p>
<p>于是出现了一个反直觉的关键词：<b>参数多 ≠ 计算多</b>。Mixtral 8×7B 总参数 47B，但每个 token 只激活 2 个专家（约 13B 的计算量）——知识容量是 47B 级的，单 token 的电费是 13B 级的。右侧路由模拟器让你亲手当路由器：换不同输入（写诗/算术/代码），看打分如何洗牌、top-k 怎么筛选。</p>
<p>但注意两个代价，它们定义了 MoE 的适用边界：<b>① 省计算不省显存</b>——休眠的专家也得常驻显存（这正是 FreeToken 等边缘推理引擎要解决的核心矛盾：把热门专家缓存到快存储、冷专家放慢存储）；<b>② 负载均衡</b>——若路由器把流量全灌给某个"明星专家"，其余专家学不到东西、算力也浪费，所以训练时要加一项"负载均衡损失"逼着雨露均沾。</p>
<p class="soul">🤔 留给你想：把 MoE 对照"医院分诊"——病人（token）只挂两个科（专家）。分诊台（路由器）误诊会怎样？科室忙闲不均会怎样？MoE 训练的所有难点，几乎都是这两个问题的技术化表述。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Fedus et al.《Switch Transformer》</b>（<a href="https://arxiv.org/abs/2101.03961" target="_blank">arXiv:2101.03961</a>, 2021）。top-1 路由的极简 MoE，李沐 MoE 精读（<a href="https://www.bilibili.com/video/BV1EM411T7bn" target="_blank">BV1EM411T7bn</a>）的主讲对象。</li>
<li><b>Mistral《Mixtral of Experts》</b>（<a href="https://arxiv.org/abs/2401.04088" target="_blank">arXiv:2401.04088</a>, 2024）。开源 MoE 的代表作，8 选 2。</li>
<li><b>延伸 · 与 FreeToken 的连线</b>：路径文档的进阶目标 FreeToken 做的正是"MoE 专家缓存与 CPU-GPU 协同"——c28 是读懂它论文的直接前置。</li>
</ul></details>`,
    quiz: [
      { q: 'MoE 省的是什么、不省的是什么？', kind: 'text', why: '省每 token 的计算量（只激活 k 个专家）；不省显存（全部专家必须常驻）。"大而不慢，但占地"。' },
      { q: '负载均衡损失是干什么的？', kind: 'text', why: '防止路由器把流量全灌给少数明星专家——失衡 = 其余专家白装 + 被冷落的专家学不到东西。' },
    ],
    sim: { type: 'moe' },
  },
  {
    id: 'c29', group: '阶段 4 · 推理', title: 'KV Cache：生成的记账本', mech: '历史 K/V 存起来，新 token 只算自己',
    read: `
<p>生成是逐字循环（c18），但有个隐性的笨拙。逐步演算"生成第 3 个 token"时注意力要做什么：</p>
<pre>无缓存：算 token3 的注意力时，需要 token1、2、3 的 K 和 V
        → K₁V₁、K₂V₂ 明明上一轮算过，又全部重算一遍
        → 生成到第 T 个字时，累计计算量 ≈ T²/2（平方爆炸）</pre>
<p>KV Cache 的解法一眼即懂：<b>历史的 K/V 只由"过去"决定，永远不变——算一次存起来</b>。新 token 只算自己的 Q，去和存好的 K/V 打分。每步代价恒定，总量从 O(T²) 掉到 O(T)。</p>
<p>代价是显存里一张随 T 线性增长的账单。演算 7B 模型（32 层、通道 4096、fp16）每 token 的 KV 开销：</p>
<pre>2（K 和 V）× 32（层）× 4096（通道）× 2 字节（fp16）= 512 KB / token

4K 上下文  →  512KB × 4096 ≈ 2 GB / 每个请求
并发 32 路 →  64 GB —— 这就是为什么"长上下文 + 高并发"是显存噩梦</pre>
<p>而 vLLM 的 PagedAttention 借用操作系统<b>虚拟内存分页</b>的思想：把 KV cache 切成固定小块按需分配，消灭预留浪费与碎片——同一张卡塞下多几倍的并发请求。c23 说"上下文窗口是 KV cache 的预算上限"，现在这本账你亲手会算了。</p>
<p class="soul">🤔 留给你想：KV cache 是"时间换空间"还是"空间换时间"？（用显存换计算——再进一步：当显存成为瓶颈，FreeToken 们把 cache 分层到 CPU 内存——每一层优化都是上一层矛盾的延续。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Kwon et al.《Efficient Memory Management for LLM Serving with PagedAttention》</b>（<a href="https://arxiv.org/abs/2309.06180" target="_blank">arXiv:2309.06180</a>, 2023）。vLLM 原论文。</li>
<li><b>延伸 · 数字标尺</b>：0.5MB/token（7B fp16）——自己乘一乘 8K 上下文与并发 32 路各要多少显存，vLLM 的价值立刻具象。</li>
<li><b>延伸 · 与 c23 的闭环</b>：上下文窗口 = KV cache 的预算上限。"为什么长上下文模型贵"——现在你知道答案在哪本账上。</li>
</ul></details>`,
    quiz: [
      { q: 'KV cache 缓存的是哪些张量？为什么可以缓存？', kind: 'text', why: '历史 token 的 K 与 V。因为它们只由"过去"决定，生成新 token 时不会变化——变的只有新 token 自己的 Q。' },
      { q: 'PagedAttention 借鉴了操作系统的什么机制解决什么问题？', kind: 'text', why: '虚拟内存分页：把 KV cache 切成固定小块管理，消灭碎片、提高显存利用率 → 同卡并发吞吐翻倍以上。' },
    ],
    sim: { type: 'kvcache' },
  },
  {
    id: 'c30', group: '阶段 4 · 推理', title: '部署：本地推理与量化对比', mech: 'Ollama / LM Studio / vLLM',
    read: `
<p>理论收齐，动手三部曲。每一步的真实命令都给你：</p>
<pre>① 本机跑通（Ollama）
   ollama pull qwen2.5:7b-instruct-q4_K_M     # ~4.7GB，Q4 量化
   ollama run qwen2.5:7b-instruct-q4_K_M      # 命令行直接对话

② OpenAI 兼容接口调用（Ollama 自带，端口 11434）
   curl http://localhost:11434/v1/chat/completions \\
     -d '{"model":"qwen2.5:7b-instruct-q4_K_M",
          "messages":[{"role":"user","content":"用一句话介绍你自己"}]}'

③ 云端进阶（Colab + vLLM）
   pip install vllm && vllm serve Qwen/Qwen2.5-7B-Instruct
   # 同样的 curl，换个端口——客户端代码零修改</pre>
<p>"OpenAI 兼容接口"值得单独咂摸：全行业的推理服务（Ollama/vLLM/各家云）都说同一套 HTTP 方言——你的客户端代码写一次，换后端零修改。这是生态的黏合剂，也是你阶段 5 项目敢随便换模型的原因。</p>
<p>量化对比实验（S28 核心）：同一组 20 个问题，Q4 量化版 vs transformers 原精度版各答一遍，记录<b>速度</b>（输出字数 ÷ 秒，MPS 上实测）与<b>质量</b>（两处可感知差异：数学精度？长句连贯性？指令遵循？）。数据写进笔记——这是 S31 答辩要交的作业，也是你第一次拥有"第一手量化对比"而不是"听说量化有损"。</p>
<p class="soul">🤔 留给你想：量化是"压缩知识"——4-bit 丢掉的是权重的精度噪声。由此推：什么任务对量化最不敏感，什么任务最先露馅？（想想：闲聊 vs 心算 7 位数乘法——哪个依赖权重的细微差别？）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Ollama</b>（<a href="https://ollama.com" target="_blank">ollama.com</a>）。一行命令本机跑量化模型，自带 OpenAI 兼容接口；模型用完记得 <code>ollama rm</code> 清理（路径文档的磁盘纪律）。</li>
<li><b>llama.cpp</b>（<a href="https://github.com/ggerganov/llama.cpp" target="_blank">GitHub</a>）。Ollama 与 LM Studio 背后的引擎，GGUF 量化格式的老家；Mac 上 Metal 加速的一线功臣。</li>
<li><b>vLLM</b>（<a href="https://docs.vllm.ai" target="_blank">docs.vllm.ai</a>）。生产级推理服务，S30 的 Colab 实验主角。</li>
</ul></details>`,
    quiz: [
      { q: '"OpenAI 兼容接口"为什么重要？', kind: 'text', why: '统一 HTTP 方言让客户端与推理后端解耦：本地 Ollama、云端 vLLM、商业 API 换着用，代码零修改。' },
      { q: '量化对比实验要记录的两组数据是什么？', kind: 'text', why: '速度（tokens/s，同问题同设备）与质量（可感知差异点：数学/连贯性/指令遵循），各留具体例子。' },
    ],
    sim: { type: 'inferest' },
  },

  // ============ 组 I · 阶段 5：项目 ============
  {
    id: 'c31', group: '阶段 5 · 项目', title: '选题与范围控制', mech: '小而完整 > 大而残缺',
    read: `
<p>阶段 5 最大的风险不是技术，是<b>范围失控</b>。三个选题（领域问答 / 本地知识库 / 风格模仿）的共同点：<b>数据 → 模型 → 服务 → 交付</b>四环都能在一到两周走完。选题前先做一个诚实的小练习——把四环按"我最想练哪环"排序：</p>
<table class="mini-table">
<tr><th>选题</th><th>重心环</th><th>其余三环的"凑合法"</th></tr>
<tr><td>领域问答机器人</td><td>检索（RAG）</td><td>微调用现成 LoRA、前端用 Streamlit 默认皮肤</td></tr>
<tr><td>本地知识库助手</td><td>纯本地部署</td><td>模型用 Ollama 现成的、数据用自己的笔记</td></tr>
<tr><td>风格模仿写作模型</td><td>数据 + 微调</td><td>服务只要一个输入框、演示录屏即可</td></tr>
</table>
<p>两条过来人法则：① <b>数据先行</b>——第一天就确定并放好数据，模型环节卡住时你随时能换方案而不换数据（数据是锚，模型只是可替换的实现）；② <b>砍需求不砍环节</b>——宁可做一个"只能答 20 个问题"的完整项目，不要一个"什么都能答"的半成品。大而残缺的典型死法：第一周想加 RAG、第二周想加微调、第三周想加多模态，第四周项目卒。</p>
<p class="soul">🤔 留给你想：三个选题分别把重心压在"检索""纯本地部署""数据与微调"上。你的工作/兴趣里，哪个问题你真的想问它？——答案决定选题，动力决定完成度。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>路径文档 · 8.2 选题建议表</b>（仓库根 README）。三选题的技术组合与适合人群对照。</li>
<li><b>延伸 · "Scratch your own itch"</b>：解决自己真实痛点的小项目，几乎总是完成度最高——选题会议上一票否决权的来源。</li>
</ul></details>`,
    quiz: [
      { q: '阶段 5 项目不可缺的四环是？', kind: 'text', why: '数据准备 → 模型环节 → 服务封装 → 交付（README + 演示）。砍需求不砍环节。' },
      { q: '"数据先行"防的是什么风险？', kind: 'text', why: '模型环节返工时不牵连数据——数据是项目的锚，模型只是可替换的实现。' },
    ],
    sim: { type: 'topicpick' },
  },
  {
    id: 'c32', group: '阶段 5 · 项目', title: 'RAG：检索增强的骨架', mech: '查询 → 检索 → 拼prompt → 生成',
    read: `
<p>RAG（Retrieval-Augmented Generation）是"领域问答"选题的心脏，机制朴素得令人感动：<b>模型不背答案，开卷考试</b>。四步流水线用 20 行伪代码就能说尽：</p>
<pre>docs   = 切块(加载文档(), 每块≈300字)          # ① 入库前切块
库存   = [embed(d) for d in docs]              # ② 每块算语义向量
q      = embed(用户查询)                        # ③ 查询也算向量
top_k  = 相似度排序(库存, q)[:3]                # ④ 取最相关的 3 块
prompt = f"仅依据以下资料回答：\\n{top_k}\\n\\n问题：{q}"</pre>
<p>右侧模拟器实现的就是这条流水线（用字符重合度充当"语义相似度"）。用它做两个实验：<b>① 查"作者是谁"</b>——看哪篇文档被选中、相关度多少；<b>② 把查询改成含糊的话</b>（如"介绍一下"）——观察检索质量的崩塌。</p>
<p>两个工程判断随之而来：<b>① 检索质量决定上限</b>——模拟器里字符重合度查"显卡"时找不到写"GPU"的文档（字不同义同），真实 RAG 用语义 embedding 模型（路径文档钦点 bge 系列）把"意思相近"变成"几何上相近"；切块多大、切在哪，同样是灵敏度拉满的决策。<b>② RAG 与微调的分界</b>：知识频繁变、要引用来源 → RAG（改知识库即可）；行为风格要改 → 微调；生产系统常组合：微调定风格，RAG 供事实。</p>
<p class="soul">🤔 留给你想：语义向量本质上是在做什么？（把"意思相近"变成"几何上相近"——语言被压进了坐标系。）那么"两个意思在多远的距离内算相近"由谁定义？——由 embedding 模型的训练数据。这就是为什么选型要认真。</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>Lewis et al.《RAG》</b>（<a href="https://arxiv.org/abs/2005.11401" target="_blank">arXiv:2005.11401</a>, 2020）。检索增强生成的原始论文——开卷考试思想的学术化。</li>
<li><b>BAAI/bge 系列 embedding</b>（Hugging Face 搜索 bge）。中文语义检索的常用开源 embedding，路径文档钦点。</li>
<li><b>延伸 · 切块（chunking）</b>：文档切多大、切在哪，是 RAG 里最不起眼却最影响检索质量的决策——先切句子，再按需合并，是稳妥起点。</li>
</ul></details>`,
    quiz: [
      { q: 'RAG 四步流水线是？', kind: 'text', why: '知识切块入库（向量化）→ 查询向量化 → 检索 top-k → 拼进 prompt 让模型依据作答。' },
      { q: '什么时候选 RAG 而不是微调？', kind: 'text', why: '知识频繁更新、需要引用来源、改动成本要低——RAG 改知识库即可；微调改的是行为风格。' },
    ],
    sim: { type: 'rag' },
  },
  {
    id: 'c33', group: '阶段 5 · 项目', title: '交付与作品集', mech: 'FastAPI + README + 演示',
    read: `
<p>项目的最后一公里决定它是"练手的代码"还是"作品集的门面"。三件套按优先级排：</p>
<p><b>① FastAPI 服务封装</b>——核心就一个端点：</p>
<pre>@app.post("/chat")
def chat(req: ChatRequest):
    answer = my_llm(req.question, history=req.history)
    return {"answer": answer}

# 前端：Streamlit 三行输入框，或纯 HTML 一个表单——够用就好</pre>
<p><b>② README 五要素</b>——动机（为什么做）、数据（哪来的、怎么洗）、方法（怎么实现、关键取舍）、效果对比（前后/基线对比，放具体例子）、<b>已知限制</b>（最后一条最加分：诚实的边界比吹嘘的效果更专业）。<b>③ 两分钟演示视频</b>——录屏 + 三句话旁白，挂 README 顶部。</p>
<p>验收标准路径文档已定：一位不了解项目的同行，十分钟内照 README 复现运行效果。自测方法很坏但有效：<b>找一个没参与过的朋友，只给他 README 和仓库链接</b>，计时。卡在哪，README 就改哪——文档的 bug 也是 bug。</p>
<p>走完这一步，入门期正式毕业：六阶段、一条路径、一个公开的 llm-journey。前面是推理系统方向的自由度——从 FreeToken 的论文开始。</p>
<p class="soul">🤔 留给你想：作品集的读者其实是"三个月后的你"和"未来的面试官"——同一份 README 要同时服务这两种人，写作时你会怎么平衡？（提示：给前者写"怎么复现"，给后者写"为什么这样做"。）</p>
<details class="refs"><summary>🏛 权威佐证与延伸</summary><ul>
<li><b>FastAPI 官方文档</b>（<a href="https://fastapi.tiangolo.com" target="_blank">fastapi.tiangolo.com</a>）。自带交互式文档（/docs）——封装 LLM 服务的最短路径。</li>
<li><b>swyx《Learn In Public》</b>（swyx.io）。你的 llm-journey 已经在做的事：把学习公开化，复利来自持续。</li>
<li><b>FreeToken</b>（<a href="https://github.com/FlashML-org/FreeToken" target="_blank">GitHub</a> / arXiv:2608.16157）。毕业后的第一站：先精读论文，再对照源码看专家缓存与调度——路径文档第 10 章的进阶衔接。</li>
</ul></details>`,
    quiz: [
      { q: 'README 五要素是？哪一条最加分？', kind: 'text', why: '动机、数据、方法、效果对比、已知限制。"已知限制"最加分——诚实的边界感是工程成熟度的信号。' },
      { q: '验收的"十分钟复现"测试怎么执行？', kind: 'text', why: '找未参与的人，只给 README + 仓库链接，计时走完全流程；卡点 = README 的修改清单。' },
    ],
    sim: { type: 'delivery' },
  },
];
