# 阶段 1：从零手写 Transformer（2～4 周）⭐ 核心阶段

> 目标：合上所有参考资料，从空文件写出一个可训练、能生成文本的字符级 GPT；能白板画出完整结构并解释每个模块。
> **这一步跨过去，后面所有内容都会变容易。**
>
> ⚡ 学习模式与阶段 0 相同：先玩 Web 互动课程（`../web/` 的 c13–c18 章）建立直觉，再进场次实战。操作手册 → **[AI助学手册.md](AI助学手册.md)**

## 一、材料清单

| 材料 | 链接 | 用法 |
|---|---|---|
| 李沐《Transformer 论文逐段精读》 | [B 站 BV1pu41176Yo](https://www.bilibili.com/video/BV1pu41176Yo) | **主线**：读懂架构的最佳中文讲解，先看它再啃原文 |
| Karpathy《Let's build GPT》 | [YouTube](https://www.youtube.com/watch?v=kCc8FmEb1nY)（约 2h） | **跟敲原片**：从 bigram 到多头 GPT，莎翁语料 |
| 《Attention Is All You Need》 | [arXiv:1706.03762](https://arxiv.org/abs/1706.03762) | 精读视频的对照原文，逐段过 |
| karpathy/nanoGPT | [GitHub](https://github.com/karpathy/nanoGPT) | 工程版参照（约 300 行）；毕业重跑中文语料用 |
| karpathy/minbpe | [GitHub](https://github.com/karpathy/minbpe) | 选做：亲手实现 BPE 分词器（约 100 行） |
| The Annotated Transformer | [Harvard NLP](https://nlp.seas.harvard.edu/annotated-transformer/) | 论文逐行代码对照本，重写卡壳时查 |
| Jay Alammar《The Illustrated Transformer》 | [博客](https://jalammar.github.io/illustrated-transformer/) | 图解补充，建立画面感 |
| d2l 第 10 章 · 注意力机制 | [zh.d2l.ai](https://zh.d2l.ai) | 字典：注意力评分/自注意力/位置编码 |

> 学习纪律与阶段 0 相同：核心代码在**禁写区**自己写（AI 只提问不给代码），写完接受 AI 答辩。

## 二、环境（沿用阶段 0 ✅）

同一套 `.venv`（Python 3.11 + torch/torchvision/d2l）。无新依赖——Transformer 用纯 PyTorch 手写即可。

## 三、任务清单（硬指标，来自路径文档 4.4）

- [ ] 跟随视频逐行实现字符级 GPT，在莎士比亚语料上训练至损失收敛
- [ ] 合上视频，从空文件独立重写完整模型并复现训练结果（⛔禁写区）
- [ ] 用中文语料训练一个字符级模型，对比中英文生成效果
- [ ] 白板画出 GPT 完整结构图，标注每个模块的张量形状变化
- [ ] 选做：跟随 minbpe 实现简化版 BPE 分词器

## 四、三周节奏建议（每周约 10 小时）

**第 1 周 · 直觉与读懂**：Web 课程 c13–c15（分词/注意力/多头）→ 手算一遍 4×4 注意力 → 李沐精读 + 对照原文
**第 2 周 · 跟敲与重写**：Karpathy 视频分两场跟敲 → 训练收敛 → ⛔禁写区合上重写
**第 3 周 · 深化与毕业**：中文语料实验 → 白板结构图 → minbpe 选做 → 答辩 10 问

详细场次表（S10–S16）见 [AI助学手册.md](AI助学手册.md)。

## 五、验收标准（路径文档 4.5 + AI 考官制）

能独立回答：注意力得分为什么除以 √d？因果掩码在代码中如何实现？训练与推理时掩码行为有何差异？temperature 参数如何影响生成分布？
外加：重写版代码交 AI 考官 review（prompts.md ⑤ 卡），概念性误解清零 + 附加题 ≥2/3。
