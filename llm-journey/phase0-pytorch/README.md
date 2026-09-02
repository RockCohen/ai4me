# 阶段 0：PyTorch 基础 + micrograd 复现（1～2 周）

> 目标：把训练循环五件套（数据加载 → 模型定义 → 损失计算 → 反向传播 → 参数更新）内化为肌肉记忆，真正理解反向传播的计算过程。
>
> **⚡ 学习模式已切换为「AI 助学」互动式**：按场次推进、预测式实验、禁写区构建、答辩验收。
> 操作手册 → **[AI助学手册.md](AI助学手册.md)**（9 个场次、每场操作单、prompt 卡直达）
> Web 互动课程 → **[web/](web/)**（预备课 c00 + 12 章 × 双视图；`cd web && npm install && npm run dev`，先玩模拟器再进 Python 实战）

## 一、材料清单

### 代码主线（负责"写出来"）

| 材料 | 链接 | 用法 |
|---|---|---|
| Karpathy《Neural networks: zero to hero》第一讲 micrograd | [YouTube](https://www.youtube.com/watch?v=VMj-3S51tku)（约 2.5 小时，开中文字幕） | **字典**：开工前只看前 20 分钟建立图景（S3），之后卡哪个概念跳看哪段。B 站搜「Karpathy micrograd 中文字幕」有搬运 |
| micrograd 仓库 | [GitHub](https://github.com/karpathy/micrograd)（已内置本目录 `micrograd/`，来自上游提交 `7bc720e`，MIT License，仅供学习对照） | 对照用：`micrograd/engine.py`（约百行的 `Value` 自动微分引擎核心）、`micrograd/nn.py`（Neuron/Layer/MLP）、`demo.ipynb`（视频同款笔记本，含完整推导注释）、`trace_graph.ipynb`（计算图可视化） |

> 学习纪律：核心代码在**禁写区**里自己写（AI 只提问不给代码），写完接受 AI 答辩。**AI 能替你写代码，但替不了你长出理解。**

### 理论主线（负责"看懂"）

| 材料 | 链接 | 用法 |
|---|---|---|
| 李沐《动手学深度学习》视频课 | [B 站课程](https://www.bilibili.com/video/BV1if4y147hS) | **字典**：预测实验中暴露的概念缺口，到这里看对应集数补；第 4 章泛化四集（模型选择/欠拟合过拟合/权重衰减/Dropout）值得主动看（S7 前后） |
| d2l 在线教材 | [zh.d2l.ai](https://zh.d2l.ai) | 第 2～4 章对照阅读；S7 按 3.5–3.7 节跑通标准范式 |
| PyTorch 官方 60 分钟入门 | [官方教程](https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html) | 工具书，随查随用 |
| AI 助教 | 本机 ZCode / ChatGPT / Claude / Cursor | **主讲 + 陪练 + 考官**。开场先贴 [tutor/prompts.md](tutor/prompts.md) ⓪ 号契约卡 |

## 二、环境（已就绪 ✅）

- Python 3.11 虚拟环境 `.venv`（在仓库根目录），已装 torch / torchvision / d2l / jupyter
- MPS 后端已验证可用（Apple GPU 加速），自检脚本 `scripts/verify_env.py`
- 日常操作见[根 README](../README.md#环境使用)：`source .venv/bin/activate` 后开工

## 三、任务清单（硬指标，产出物落库才算完成）

- [x] 本机完成 PyTorch 安装，验证 MPS 后端可用（`torch.backends.mps.is_available()` 返回 `True`）
- [ ] 禁写区完成 micrograd 自动微分引擎，通过 `tutor/gradcheck.py` 对拍（`exercises/02_micrograd/`）
- [ ] 用 d2l 教材代码在 MNIST / Fashion-MNIST 上完成一次完整训练与验证（`exercises/03_d2l_mnist/`）
- [ ] 不看教程独立写出：加载数据集 → 定义模型 → 训练循环 → 验证集评估的完整脚本（`exercises/04_mnist_solo/`）

> 场次化推进节奏（S1～S9，共 9 场 ≈ 20 小时）见 [AI助学手册.md](AI助学手册.md) 场次总表。

## 四、验收标准（AI 考官制）

不看任何教程，一小时内独立完成一个完整的小型图像分类脚本；随后由 AI 考官出 3 道现场附加题（如"只加一行代码再提准确率"、"解释 loss 曲线某处为何变陡"），≥2 道通过；能用自己的语言解释**前向传播、损失、梯度与学习率**之间的关系，并经受 [tutor/defense_训练循环_10问.md](tutor/defense_训练循环_10问.md) 答辩（≥8 题讲清）。

## 五、常见卡点速查

| 现象 | 处理 |
|---|---|
| `torch.backends.mps.is_available()` 为 `False` | 确认用的是 `.venv` 里的 python（`which python`），且为 arm64 原生版本 |
| jupyter 找不到本环境内核 | 根目录执行 `python -m ipykernel install --user --name llm-journey` |
| 训练时报错 MPS 不支持某算子 | 该算子回退 CPU 即可：`tensor.cpu()` 或对整段小代码用 `device='cpu'`，不影响学习 |
| matplotlib 中文乱码 / 不出图 | notebook 开头加 `%matplotlib inline`；标签可暂用英文 |

## 六、毕业去向 → 阶段 1

通过验收后：`git tag phase0-graduate`，进入 [../phase1-transformer/](../phase1-transformer/README.md)——从零手写 Transformer（阶段 1 材料已就绪：6 章互动课程 c13–c18 + 场次手册 S10–S16 + 练习骨架）。
