# llm-journey · 大模型学习旅程

> GitHub 仓库：<https://github.com/RockCohen/llm-journey>
> 互动课程：`llm-journey/web/`（`npm install && npm run dev`）· 实战手册：[AI助学手册](llm-journey/phase0-pytorch/AI助学手册.md)

个人大模型入门学习的总仓：路径规划、互动课程、实验代码、学习笔记与思考延伸统一用 git 管理。

## 仓库结构

```
.
├── README.md                # 本文件：总路径（下方全文）+ 工作区说明
└── llm-journey/             # 实验总仓（代码、笔记、实验记录）
    ├── web/                 # 🌐 互动课程平台（阶段 0/1 共享，npm run dev）
    ├── phase0-pytorch/      # 阶段 0：PyTorch 基础 + micrograd 复现
    │   ├── AI助学手册.md    # 场次制学习流程（S1–S9）
    │   ├── tutor/           # AI 助教材料（prompt 卡、实验卡、题库、坏代码门诊）
    │   └── web/             # Web 互动课程平台（预备课 + 12 章，npm 项目）
    ├── scripts/             # 环境自检脚本
    └── requirements.txt
```

## 使用

- 学习从 [AI助学手册](llm-journey/phase0-pytorch/AI助学手册.md) 开始（阶段 0）；
- 每完成一个实验就 commit，配三五行情式笔记；`git push` 同步远端。

---

以下为完整学习路径文档。

# 大模型入门学习路径

> **适用对象**：大模型零基础入门学习者
> **定制设备**：Apple M2 Pro（16GB 统一内存，10 核 CPU / 16 核 GPU）
> **预计周期**：3～4 个月（每周约 10 小时）
> **编制日期**：2026 年 8 月

---

## 1 学习路径总览

### 1.1 适用对象与学习目标

本文档是一份面向零基础学习者的大模型入门学习路径规划，基于三方面信息定制：当前设备为 Apple M2 Pro 笔记本（16GB 统一内存）；资源主线为中文世界的李沐《动手学深度学习》课程与论文精读系列，配合 Andrej Karpathy 的从零手写系列；学习终点设定为**能够独立完成一个小型模型的指令微调，并部署为可调用的本地服务**。

完成整条路径后应具备三项能力：

1. 能从空文件开始手写一个可训练、能生成文本的 GPT 模型；
2. 能使用工业界主流工具链（Hugging Face、PEFT、MLX 等）完成模型推理与 LoRA 微调；
3. 能独立设计并交付一个端到端的大模型应用项目。

### 1.2 核心学习原则

- **先写代码、再补理论**：每个概念先通过动手实验建立直觉，再回到论文与教材系统化，避免陷入纯数学准备而弃坑。
- **每个阶段必须有产出物**：以可运行的代码仓库和实验记录作为阶段完成的硬性标志，而不是以"看完视频"为准。
- **资源分工明确**：李沐的课程与论文精读负责"看懂"（中文、系统、跟随论文脉络）；Karpathy 的手写系列与 Hugging Face 实操负责"写出来"（英文、代码、从零实现）。两条线交替进行。

### 1.3 路径总览

| 阶段 | 主要内容 | 建议时长 | 关键产出物 | 本机可行性 |
|---|---|---|---|---|
| 阶段 0 | Python 与 PyTorch 基础 | 1～2 周 | micrograd 自动微分引擎复现 | ✅ 完全可行 |
| 阶段 1 | 从零手写 Transformer ⭐ | 2～4 周 | 字符级小 GPT + 中文语料实验 | ✅ 完全可行 |
| 阶段 2 | Hugging Face 生态 | 1～2 周 | 预训练模型推理与采样实验 | ✅ 完全可行 |
| 阶段 3 | LoRA 微调实战 | 2～3 周 | 微调后的专属对话模型 | ⚠️ 可行（看 2.2 节） |
| 阶段 4 | 现代架构与推理基础 | 1～2 周 | 本地部署 + 量化对比报告 | ⚠️ 大部分可行 |
| 阶段 5 | 端到端项目实战 | 2～4 周 | 可部署的完整应用 | ✅ 完全可行 |

---

## 2 硬件环境与工具链

### 2.1 本机硬件评估

学习用机关键配置：**Apple M2 Pro**（10 核 CPU、16 核 GPU，Metal 4）、**16GB 统一内存**、约 **83GB 可用磁盘**。

统一内存架构对本地大模型实验较为友好：GPU 与 CPU 共享同一块内存，16GB 内存推理场景下可容纳 7B 参数的 4-bit 量化模型（约 4.5GB），并可在 **1.5B～4B 参数规模上流畅完成 LoRA 微调**。

三条硬件边界：

1. `bitsandbytes`、`Unsloth` 等主流 QLoRA 工具链仅支持 NVIDIA CUDA，macOS 上装不了 → 本机改用 **MLX** 框架；
2. `vLLM` 推理框架仅支持 NVIDIA GPU → 本机改用 **LM Studio / llama.cpp server**；
3. **FreeToken** 等推理引擎仅支持 RTX 30/40/50 系 → 本机完全无法运行，属进阶期内容（论文阅读不受影响）。

### 2.2 本机与云端双轨策略

| 受限内容 | 原因 | 本机替代方案 | 云端方案 |
|---|---|---|---|
| QLoRA 微调（bitsandbytes/Unsloth） | 仅支持 CUDA | MLX 的 `mlx_lm.lora` | Colab T4 + PEFT |
| 7B 模型微调 | 16GB 内存吃紧 | 不建议本机进行 | Colab/Kaggle QLoRA |
| vLLM 服务部署 | 仅支持 NVIDIA GPU | LM Studio / llama.cpp server | Colab 安装 vLLM |
| FreeToken 推理引擎 | 仅支持 RTX 30/40/50 系 | 论文阅读不受影响 | 云 GPU 或 NVIDIA 设备 |

- **本机路线**：MLX 框架（`pip install mlx-lm`），Apple 官方出品、为 Apple 芯片设计，16GB 内存微调 1.5B～4B 很顺，用于**理解 LoRA 原理**。
- **云端路线**：Google Colab 免费 T4（16GB 显存）或 Kaggle（每周 30 小时免费 GPU），跑 CUDA 生态标准流程（PEFT + bitsandbytes 的 QLoRA、vLLM 部署），用于**体验工业界工具链**、完成 7B 微调。
- 两条路线各安排约一天即可覆盖，互为补充：本机 MLX 让你理解 LoRA 本身，Colab 让你见识工业界标准工具链。

### 2.3 磁盘与环境管理

约 83GB 可用空间足够支撑全程，但需建立两处定期清理习惯：

- Ollama 等工具下载的模型权重（1.5B 约 3GB，7B Q4 约 4.5GB），阶段结束后用 `ollama rm 模型名` 及时删除；
- Hugging Face 缓存目录 `~/.cache/huggingface/` 会随实验膨胀，每完成一个阶段检查一次。

**路径开始时建一个 GitHub 仓库作为实验总仓**，所有阶段的代码、笔记、实验记录统一提交——三个月后它既是最好的复习材料，也是可直接展示的作品集。

---

## 3 阶段 0：环境与 PyTorch 基础（1～2 周）

### 3.1 学习目标

建立深度学习工程基本功：熟练使用 PyTorch 完成张量操作、自动微分与标准训练循环，真正理解反向传播的计算过程。本阶段不求覆盖面，只求把训练循环五件套（数据加载、模型定义、损失计算、反向传播、参数更新）内化为肌肉记忆。

### 3.2 学习内容

- **理论主线**：李沐《动手学深度学习》视频课（B 站[跟李沐学AI](https://space.bilibili.com/1567748478)，配套教材 [zh.d2l.ai](https://zh.d2l.ai) 免费在线阅读）。选看第 01～07 集（课程安排、安装、数据操作、线性回归、softmax 回归），每集约 20 分钟；第 4 章"多层感知机"中**模型选择、欠拟合过拟合、权重衰减、Dropout** 几集建议全看——这是新手最缺的工程直觉。
- **代码主线**：Karpathy 的 [The spelled-out intro to neural networks and backpropagation](https://www.youtube.com/watch?v=VMj-3S51tku)（micrograd）——跟随视频从零实现一个约百行的自动微分引擎，**整个路径中性价比最高的单次练习**。李沐讲"是什么"，micrograd 讲"如何从零实现"，互补不冲突。

> **学习模式说明（2026-08-31 起）**：阶段 0 已细化为「AI 助学」互动模式推进——AI 摸底、预测式实验、禁写区构建、答辩验收，视频与教材降级为按需查阅的字典。场次化操作手册见 `llm-journey/phase0-pytorch/AI助学手册.md`。

### 3.3 动手任务

- [ ] 跟随 micrograd 视频完成自动微分引擎，并合上视频独立重写一遍。
- [x] 本机完成 PyTorch 安装，验证 MPS 后端可用：`torch.backends.mps.is_available()` 返回 `True`。（2026-08-31 已完成，环境位于 `llm-journey/.venv`，自检脚本 `llm-journey/scripts/verify_env.py`）
- [ ] 用 d2l 教材代码在 MNIST / Fashion-MNIST 上完成一次完整训练与验证。
- [ ] 不看教程独立写出：加载数据集 → 定义模型 → 训练循环 → 验证集评估的完整脚本。

### 3.4 资源清单

| 资源 | 形式 | 说明 |
|---|---|---|
| [动手学深度学习](https://zh.d2l.ai)（李沐） | B 站视频 + 在线教材 | 理论主线，免费阅读 |
| [micrograd](https://github.com/karpathy/micrograd) | YouTube 视频 + GitHub | 反向传播从零实现 |
| PyTorch 官方 60 分钟入门 | 官方教程 | 当工具书翻 |
| [Google Colab](https://colab.research.google.com) / [Kaggle](https://www.kaggle.com) | 云端 Notebook | 备用 GPU 环境 |

### 3.5 验收标准

不看任何教程，一小时内独立完成一个完整的小型图像分类脚本；能用自己的语言解释前向传播、损失、梯度与学习率之间的关系。

---

## 4 阶段 1：从零手写 Transformer（2～4 周）⭐ 核心阶段

### 4.1 学习目标

合上所有参考资料，从空文件写出一个可训练、能生成文本的 GPT；能白板画出完整结构图并解释每个模块。**这一步跨过去，后面所有内容都会变容易。**

### 4.2 学习顺序

1. **建立直觉**：李沐 d2l 课程第 10 章"注意力机制"部分视频（注意力评分、自注意力、位置编码）。
2. **读懂架构**：李沐 [《Transformer 论文逐段精读》](https://www.bilibili.com/video/BV1pu41176Yo)（Attention Is All You Need）——中文世界公认最好的 Transformer 讲解。先看这个再读原论文，效率完全不同。
3. **动手实现**：跟随 Karpathy [Let's build GPT: from scratch](https://www.youtube.com/watch?v=kCc8FmEb1nY) 逐行敲出字符级 GPT，然后**合上视频重写一遍**；用 [nanoGPT](https://github.com/karpathy/nanoGPT) 在莎士比亚语料上训练（Colab 或本机均可）。
4. **进阶实验**：换成中文语料（任意小说文本）重新训练，观察中文场景的差异；有余力跟 [minbpe](https://github.com/karpathy/minbpe) 写一个 BPE 分词器。

学习中重点想清楚的问题：Q/K/V 各自的来源与作用；注意力得分为什么除以 √d_k；多头注意力并联了什么；因果掩码（causal mask）如何保证自回归性质；残差连接与 LayerNorm 为什么是深层网络可训练的关键；BPE 为什么让 token 与字符不再一一对应。

### 4.3 双主线分工

| 环节 | 李沐资源 | Karpathy 资源 |
|---|---|---|
| 建立直觉 | d2l 第 10 章注意力机制视频 | — |
| 读懂架构 | ⭐ Transformer 论文逐段精读 | — |
| 动手实现 | — | Let's build GPT + nanoGPT |
| 进阶理解 | — | minbpe 分词器实现（选做） |

### 4.4 动手任务

- [ ] 跟随视频逐行实现字符级 GPT，在莎士比亚语料上训练至损失收敛。
- [ ] 合上视频，从空文件独立重写完整模型并复现训练结果。
- [ ] 用中文语料训练一个字符级模型，对比中英文生成效果。
- [ ] 白板画出 GPT 完整结构图，标注每个模块的张量形状变化。
- [ ] 选做：跟随 minbpe 实现简化版 BPE 分词器。

### 4.5 验收标准

能独立回答：注意力得分为什么除以 √d_k？因果掩码在代码中如何实现？训练与推理时掩码行为有何差异？temperature 参数如何影响生成分布？

---

## 5 阶段 2：Hugging Face 生态（1～2 周）

### 5.1 学习目标

从"自己造轮子"切换到工业界工具：掌握 `transformers`、`datasets`、`tokenizers` 三大库的日常用法，理解预训练模型的加载、推理与采样控制；借助李沐论文精读补齐 GPT 与 BERT 两条技术路线的来龙去脉。

### 5.2 学习内容

**理论部分**（李沐论文精读）：

- [《GPT 系列论文精读》](https://www.bilibili.com/video/BV1AF41137uu)（GPT-1/2/3 一集讲完）：理解预训练 + 少样本范式的演进，解释了为什么模型类叫 causal LM。
- 《BERT 论文逐段精读》：理解双向编码器，以及它与 GPT 的架构分野。

**实操部分**：跟随 [Hugging Face LLM Course](https://huggingface.co/learn)（有中文版）前三章，掌握 `pipeline()` 快速推理与 `AutoModel`/`AutoTokenizer` 精细控制两种方式；了解 `from_pretrained`、safetensors 格式与 ModelScope 国内镜像。

### 5.3 动手任务

- [ ] 用 Qwen2.5-0.5B 完成文本生成、情感分类、翻译三个推理 demo。
- [ ] 对比同一句子在不同 tokenizer 下的切分与 token 数量差异。
- [ ] 固定提示词，扫描 temperature 与 top_p，观察并记录生成结果的变化规律。
- [ ] 看完 GPT 与 BERT 两期精读，各写一段话总结两条路线的分野。

### 5.4 验收标准

不查文档加载任意一个模型完成推理；能说清 temperature 与 top_p 各控制什么、采样时谁先生效。

---

## 6 阶段 3：微调实战（2～3 周）· 入门期毕业项目

### 6.1 学习目标

亲手把一个预训练模型改造成特定用途的对话模型；理解 LoRA 原理与 QLoRA 的显存账本；体验本机 MLX 与云端 CUDA 两套工具链。

### 6.2 理论准备

先读 [LoRA 原论文](https://arxiv.org/abs/2106.09685)（仅 10 余页，此时完全能读懂），重点理解低秩分解为什么能大幅减少可训练参数；再了解 QLoRA 的组合思路——4-bit 量化基座 + LoRA 适配器，以及它如何让单张消费级显卡微调 7B 成为可能。

动手前可先用 [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory)（中文文档友好）跑通一次完整流程建立全局感，**再用纯代码复现一遍**——工具能让你跑通，只有裸写代码才能让你学会。

### 6.3 双轨实操方案

| 维度 | 本机 MLX 路线 | 云端 Colab 路线 |
|---|---|---|
| 模型规模 | Qwen2.5 1.5B～4B | 7B（QLoRA 4-bit） |
| 工具链 | `mlx-lm`（`mlx_lm.lora`） | PEFT + bitsandbytes + TRL |
| 显存/内存 | 16GB 统一内存 | T4 16GB 显存 |
| 学习重点 | LoRA 原理与超参数 | 工业界标准流程 |
| 费用 | 免费 | 免费（有时长限制） |

数据集：公开中文指令数据集（Alpaca-GPT4-zh、BelleGroup 等），也鼓励**自建约 200 条高质量数据**——自建小数据集往往效果更好，还能直观体会"数据质量 > 数据数量"。

### 6.4 动手任务

- [ ] 本机用 MLX 完成 Qwen2.5-1.5B 的 LoRA 微调，做一个特定角色对话模型（如"文言文翻译助手"）。
- [ ] 云端用 PEFT+QLoRA 完成一次 7B 微调，对比与本机流程的异同。
- [ ] 微调前后用同一组测试问题对比模型行为，保存对话记录。
- [ ] 能口头回答：LoRA 的 rank 与 alpha 各控制什么；LoRA 层为什么通常只加在注意力投影矩阵上。

### 6.5 验收标准

提交一份微调实验记录：数据构成、超参数配置、训练损失曲线、微调前后效果对比，并能解释至少一处失败尝试的原因。

---

## 7 阶段 4：现代架构与推理基础（1～2 周）· 通往推理系统的桥梁

### 7.1 学习目标

补齐现代大模型两块关键拼图：**MoE 稀疏架构**与 **KV cache 推理显存问题**。本阶段是通往 FreeToken 这类推理引擎方向的桥梁，李沐两期论文精读是主线材料。

### 7.2 论文精读主线

- **[《MoE 论文精读》](https://www.bilibili.com/video/BV1EM411T7bn)**（Switch Transformer + GLaM）：理解专家网络、稀疏激活与负载均衡——这是理解 FreeToken"专家缓存、CPU-GPU 协同执行"的直接前置知识。
- **《vLLM 论文精读（PagedAttention）》**：理解推理阶段 KV cache 为什么浪费显存、PagedAttention 如何借鉴操作系统虚拟内存思路管理 KV cache——看完再看 FreeToken 的"弹性显存管理"，会发现它正是 vLLM 思想在边缘设备上的延伸。
- 有余力加餐：《Megatron 论文精读》（训练并行策略，了解即可）。

### 7.3 本机实操

- 用 **Ollama** 或 **LM Studio** 运行量化模型（均提供 OpenAI 兼容接口）；
- 对比同一模型 Q4 量化版与 transformers 原精度版的回答质量与速度；
- 观察内存占用，回答：7B 模型 FP16 要约 14GB、Q4 只要约 4.5GB 的原因？KV cache 随什么增长？
- vLLM 亲手部署放到 Colab 上，通过 OpenAI 兼容接口调用测试。

### 7.4 动手任务

- [ ] 观看 MoE 与 vLLM 两期论文精读，各写一页要点笔记。
- [ ] Ollama 拉取一个 7B Q4 模型，测试本机推理速度（tokens/s）。
- [ ] 对比量化与原精度模型的回答，记录两处可感知的质量差异。
- [ ] Colab 上用 vLLM 起服务，用 curl 或 Python 客户端调用成功。

### 7.5 验收标准

能用自己的话回答：MoE 为什么能用更少计算量换更大参数规模？KV cache 显存占用随什么增长？PagedAttention 解决了什么问题？

---

## 8 阶段 5：端到端项目实战（2～4 周）

### 8.1 学习目标

把前五个阶段的能力串联成一个完整作品：可部署、可演示、代码公开。项目同时是复习材料与作品集核心。

### 8.2 选题建议（三选一）

| 选题 | 核心技术组合 | 适合人群 |
|---|---|---|
| 领域问答机器人 | 微调 + RAG（bge 系列 embedding + 轻量向量库） | 想覆盖最全面 |
| 本地知识库助手 | Ollama + RAG，纯本地运行 | 重视隐私与离线可用 |
| 风格模仿写作模型 | 自建语料 + LoRA 微调小模型 | 偏好数据与训练侧 |

无论选哪个，都控制在小而完整的范围：数据准备 → 模型环节 → 服务封装（FastAPI / Streamlit 前端）→ GitHub 仓库 + README，缺一不可。README 写清动机、数据、方法、效果对比与已知限制。

### 8.3 动手任务

- [ ] 完成数据准备，公开数据来源与处理脚本。
- [ ] 完成模型环节，保存可复现的训练/检索配置。
- [ ] 用 FastAPI 封装服务接口，完成一个可交互前端页面。
- [ ] 撰写 README，录制一段不超过两分钟的演示视频。

### 8.4 验收标准

一位不了解项目的同行能在十分钟内依照 README 复现运行效果；仓库有清晰的提交历史，而非一次性上传。

---

## 9 贯穿全程的学习习惯

### 9.1 论文阅读顺序（先代码后论文）

| 阶段 | 推荐阅读 | 阅读重点 |
|---|---|---|
| 阶段 1 后 | Attention Is All You Need | 架构细节与代码逐一对上 |
| 阶段 2 | GPT-2、GPT-3 论文 | 预训练范式与 scaling 现象 |
| 阶段 3 | LLaMA、LoRA 论文 | 开源生态与参数高效微调 |
| 阶段 4 | Mixtral、DeepSeek-V3 技术报告 | MoE 架构与工程实践 |

### 9.2 资源格局：一主一辅一手册

- **主线**：李沐《动手学深度学习》课程 + 论文精读系列（B 站"跟李沐学AI"，配套 [GitHub 仓库](https://github.com/mli/paper-reading)维护全部论文清单与笔记）→ 负责**系统理解**。
- **辅助**：Karpathy 从零手写系列（micrograd → nanoGPT → minbpe）→ 负责**代码实现**。
- **工具书**：d2l 教材 + Hugging Face 官方文档 → 随查随用。

> 说明：李沐论文精读系列录制于 2021～2022 年，所讲论文不新，但 Transformer、MoE、PagedAttention 至今仍是主流架构与推理系统的基石，方法论完全不过时，放心学。

### 9.3 三条避坑提醒

1. **不要先啃数学**：概率论与线性代数够用即可，遇到缺口现查现用——硬啃数学书是最常见的弃坑原因。
2. **不要收藏代替学习**：每阶段的动手任务是硬指标，视频看完 ≠ 学会，产出物才算数。
3. **不要孤立刷教程**：每个实验都提交到实验总仓并配三五行情式笔记，三个月后它就是最好的复习材料与作品集。

### 9.4 周节奏建议

每周约 10 小时：4 小时看视频/读材料，5 小时写代码做实验，1 小时整理笔记提交仓库。**节奏可以慢，但不要断**——连续性比单周时长更能决定三个月后的成果。

---

## 10 进阶衔接：通往推理系统方向

### 10.1 从入门期到进阶期

完成六个阶段后即具备进入推理系统方向的条件。以 [FreeToken](https://github.com/FlashML-org/FreeToken)（[arXiv:2608.16157](https://arxiv.org/abs/2608.16157)，Apache 2.0）为例：它是边缘原生的 MoE 推理引擎，目标是在消费级硬件上高速运行超大 MoE 模型，论文与源码覆盖推理优化几乎所有热点——MoE 专家缓存、CPU-GPU 带宽自适应协同执行、KV cache 管理、MXFP4/NVFP4/FP8 量化、双缓冲流水线。

此时阅读路径：**先精读论文，再对照源码研读专家缓存与调度模块**。注意该引擎仅支持 NVIDIA RTX 30/40/50 系显卡，本机无法运行；论文与源码阅读不受影响。

### 10.2 云端算力建议

进阶期实验超出 16GB 内存或需要 CUDA 时，建议按需租用云 GPU（如 AutoDL 平台 RTX 4090，约 2 元/小时）而非购置硬件；方向明确后再考虑设备投入。本机定位转为：代码开发、论文阅读、小规模验证；重负载实验全部上云。

---

## 附录：常用资源速查

| 资源 | 获取方式 | 用途 |
|---|---|---|
| 动手学深度学习教材 | [zh.d2l.ai](https://zh.d2l.ai) | 全程理论工具书 |
| 跟李沐学AI（B 站） | [space.bilibili.com/1567748478](https://space.bilibili.com/1567748478) | 课程与论文精读 |
| 论文精读清单 | [github.com/mli/paper-reading](https://github.com/mli/paper-reading) | 精读目录与笔记 |
| nanoGPT | [github.com/karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) | 阶段 1 手写实现 |
| minbpe | [github.com/karpathy/minbpe](https://github.com/karpathy/minbpe) | BPE 分词器实现 |
| Hugging Face 课程 | [huggingface.co/learn](https://huggingface.co/learn) | 阶段 2 实操主线 |
| LLaMA-Factory | [github.com/hiyouga/LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) | 阶段 3 图形化微调 |
| MLX (mlx-lm) | `pip install mlx-lm` | 本机 Apple 芯片微调 |
| FreeToken | [github.com/FlashML-org/FreeToken](https://github.com/FlashML-org/FreeToken) | 进阶期衔接材料 |
