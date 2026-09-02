# 阶段 0 · AI 助学手册（操作级）

> 旧模式：看视频 4h → 跟敲 → 合上重写，反馈靠自我比对。
> 新模式：AI 摸底 → 预测式实验 → 禁写区构建 → 答辩验收。
> **视频与教材降级为字典（卡壳才查），核心产出物仍然必须你亲手写。**
> 所有 AI 交互开场白在 [`tutor/prompts.md`](tutor/prompts.md)，粘贴即用；本机 ZCode、ChatGPT、Cursor 均适用。

## Web 互动课程（每场开动前的 10 分钟预演）

`llm-journey/web/` 下 `npm install && npm run dev` 后访问 http://localhost:5173（平台由阶段 0/1 共享）。**预备课 c00 + 阶段 0 的 12 章**互动课程与本章场次一一对应（零基础先从 c00 的张量阶梯玩起）：
每章 = **阅读视图**（讲透一个机制 + 内嵌预测题）+ **模拟器视图**（在浏览器里玩这个机制）。
建议节奏：先玩对应章节的模拟器建立直觉 → 再来本场的 Python 实战 → 产出物落库。
映射表见 [`web/README.md`](web/README.md)；c06–c08 对应的 S3/S4 是禁写区场次，web 只用于看机制跑起来的样子。

---

## 0 · AI 助教契约（第 ⓪ 号卡，每次新会话先贴）

1. **禁写区**：凡标注"禁写区"的练习（本阶段：micrograd 引擎、脱稿训练脚本），AI 不准输出核心实现代码。引导只有三级，按需升级：L1 概念提问 → L2 指向性提问 → L3 一行伪代码；不主动说"给提示"就停在前一级。
2. **生成先于接收**：新概念先考 2–3 道摸底题，按你的水平讲，跳过已答对的部分。
3. **代码是仲裁者**：概念分歧一律写 5–10 行代码跑一跑，谁输听谁的。
4. **误解记录**：AI 每发现一处理解偏差，输出一行「日期｜误解｜纠正｜复习题」，抄进 [`tutor/misconceptions.md`](tutor/misconceptions.md)。阶段结束时它是最个人化的复习材料。
5. **收尾三件套**：commit 了吗？笔记写了吗？生成 3 道"一周后的我"复习题了吗？

## 场次总表（9 场 ≈ 20h = 2 周 × 10h）

| 场次 | 主题 | 时长 | 完成标志 | 产出落点 |
|---|---|---|---|---|
| S1 | 张量：形状、广播与内存 | 2.5h | 实验卡错题 ≤2 且错题追到根因 | `exercises/01_tensor_basics/` |
| S2 | autograd + 手写线性回归 | 2.5h | 15 行纯 autograd 回归收敛；讲清 grad 累加 / no_grad / detach | 同上 |
| S3 | ⛔禁写区·micrograd Ⅰ：Value 类 | 2.5h | `tutor/gradcheck.py` 对你的引擎全绿 | `exercises/02_micrograd/` |
| S4 | ⛔禁写区·micrograd Ⅱ：网络与训练 | 2.5h | 双月牙数据 loss 收敛、可分 | 同上 |
| S5 | micrograd 答辩 + 补漏 | 1.5h | 10 问过 8；答错的进误解记录本 | `notes.md` |
| S6 | 坏代码门诊（5 例） | 2.5h | 5 例全部独立定位根因 | `exercises/` 门诊笔记 |
| S7 | d2l Fashion-MNIST + 改造实验 | 2.5h | 教材代码跑通 + 3 组变异实验各有结论 | `exercises/03_d2l_mnist/` |
| S8 | 脱稿验收 · AI 考官制 | 2h | 1h 脚本正确 + 附加题 ≥2/3 | `exercises/04_mnist_solo/` |
| S9 | 总答辩 + 沉淀 | 1.5h | 训练循环 10 问过 8；`git tag phase0-graduate` | 阶段笔记 |

---

## 每场操作单

### S1 · 张量直觉（2.5h）
- 开场：先贴 ⓪ 契约，再用 ① 摸底卡（概念：张量形状与广播）。
- 做 [`tutor/experiments_s1_张量.md`](tutor/experiments_s1_张量.md)：每题**先写预测**（形状？数值？会不会报错？）再运行。答错一题，用 ② 卡让 AI 出 2 道同款变体，直到连对。
- 完成后把自己复跑过的实验整理成一个脚本/notebook 放进 `exercises/01_tensor_basics/`，commit。

### S2 · autograd + 手写线性回归（2.5h）
- 做 [`tutor/experiments_s2_autograd.md`](tutor/experiments_s2_autograd.md)，重点盯三件事：**grad 为什么累加、no_grad 干什么、detach 断什么**。
- 终极实验：不用 `nn.Linear`、不用 optimizer，纯张量 + `backward()` 写 15 行线性回归，SGD 收敛到 y≈3x+1。
- 转场语（记进笔记）：你已经用上了 torch 的 autograd——接下来两场，我们把这个 autograd 本身造出来。

### S3 · ⛔禁写区：Value 类（2.5h）
- 开工仪式：③ 卡（禁写区 + 阶梯提示规则），材料：视频**只看前 20 分钟**建立图景，之后按需跳看；[`micrograd/`](micrograd/) 仓库只在你明确请求后对照。
- 路线：`__init__/__repr__` → `__add__/__mul__` → 单节点 `_backward` 闭包 → 全图 `backward()`（拓扑排序）→ 邻接路径累加（`a*b + a*c`）。
- 完成标志：跑 [`tutor/gradcheck.py`](tutor/gradcheck.py)，你的引擎与 PyTorch 梯度误差 < 1e-6 全绿。

### S4 · ⛔禁写区：网络与训练（2.5h）
- ③ 卡继续。在 Value 之上写 `Neuron / Layer / MLP / parameters()`，写训练循环，训练双月牙二分类。
- 数据生成不是练习目标——直接用 [`tutor/data_moons.py`](tutor/data_moons.py)。**脚手架归 AI，核心归你**，这就是方法论的现场示范。
- 完成标志：loss 明显下降、两类可分；跑 ⑤ 答辩卡做一次小答辩。

### S5 · micrograd 答辩 + 补漏（1.5h）
- 把 [`tutor/defense_micrograd_10问.md`](tutor/defense_micrograd_10问.md) 整个发给 AI，让它逐题问你、追问到你讲清。
- 答错的 → 误解记录本 → 针对性小实验修补。
- 可选：此刻再回看 Karpathy 视频对应片段——你会发现 2.5h 的视频 20 分钟就能过完，这就是"先建构、后字典"的效果。

### S6 · 坏代码门诊（2.5h）
- 材料：[`tutor/bug_clinic/`](tutor/bug_clinic/)，5 个可运行脚本，各藏 1 处 bug，症状互不相同。
- 流程（每例）：运行观察症状 → 写下诊断假设 → 改代码验证 → 修复 → 对 [`tutor/bug_clinic/ANSWERS.md`](tutor/bug_clinic/ANSWERS.md) 复核。
- 规则：答案文件只许复核用；卡住时用 ⑥ 卡要"线索"而不是答案。

### S7 · d2l Fashion-MNIST + 改造实验（2.5h）
- 前半：照 [zh.d2l.ai](https://zh.d2l.ai) 3.5–3.7 节跑通（标准范式值得亲手过一遍）。
- 后半 3 组变异实验，每组**先预测再运行**：lr ∈ {0.01, 0.1, 1.0}；batch ∈ {32, 256}；隐藏层宽度 ∈ {8, 256}。
- 每组写一句结论进笔记（例：lr=1.0 时曲线____，说明____）。

### S8 · 脱稿验收 · AI 考官制（2h）
- 规则照旧：不查教程、1 小时、从空文件写完"加载 → 模型 → 训练 → 验证"。
- 新规则：写完**不等于结束**。用 ⑤ 卡让 AI 当考官出 3 道附加题（现出，难度自适应），典型题型：
  - "只加 1 行代码，把准确率再提高一截"；
  - "解释你的 loss 曲线为什么在某处变陡/变平"；
  - "给你的脚本加上可复现性（种子管理）"。
- 通过线：脚本正确 + 附加题 ≥2 道。

### S9 · 总答辩 + 沉淀（1.5h）
- [`tutor/defense_训练循环_10问.md`](tutor/defense_训练循环_10问.md) 全量答辩。
- 回顾误解记录本，把全部复习题拼成一次自测。
- `git tag phase0-graduate` → **阶段 0 毕业 🎓**

## 毕业 → 阶段 1 衔接（S9 完成后做这三件事）

阶段 1（从零手写 Transformer）的材料已就绪，位于 [`../phase1-transformer/`](../phase1-transformer/)：

1. 打开 [阶段 1 · AI助学手册](../phase1-transformer/AI助学手册.md)——场次 S10–S16，约 3 周；
2. Web 课程**不用换地方**：c13–c18 章就是阶段 1 的内容（分词 → 注意力 → GPT → 采样），继续用同一平台；
3. 老规矩"先玩模拟器再动手"：c14 的注意力交互台是阶段 1 最重要的直觉来源。

---

## 与任务清单的关系

[README](README.md) 的四条任务清单**不变**（产出物是同一批），换的只是到达路径。勾选规则照旧：代码落库才算完成，视频看完不算。
