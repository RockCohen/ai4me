# llm-journey · 大模型入门实验总仓

跟随《大模型入门学习路径》6 个阶段的代码、笔记与实验记录总仓。
三个月后，它既是复习材料，也是作品集。

> 路径文档见同级目录：`大模型入门学习路径.md`

## 目录结构

```
llm-journey/
├── requirements.txt        # 依赖（阶段 0：torch / d2l / jupyter）
├── scripts/
│   └── verify_env.py       # 环境自检脚本（MPS 后端、数据集、训练链路）
├── notes/                  # 跨阶段的通用笔记
├── data/                   # 数据集（已 gitignore，不入库）
└── phase0-pytorch/         # 阶段 0：PyTorch 基础 + micrograd 复现
    ├── AI助学手册.md        # ⚡ 互动式学习操作手册（场次表 + 每场操作单）
    ├── README.md           # 阶段 0 材料清单、任务清单、验收标准
    ├── micrograd/          # Karpathy/micrograd 参考仓库（学习期间只读）
    ├── tutor/              # AI 助教材料：prompt 卡、预测实验卡、答辩题库、坏代码门诊
    ├── exercises/          # 自己的练习代码写在这里
    │   ├── 01_tensor_basics/   # 张量操作练习（S1/S2）
    │   ├── 02_micrograd/       # micrograd 复现（S3/S4 禁写区）
    │   ├── 03_d2l_mnist/       # d2l 教材 MNIST 训练（S7）
    │   └── 04_mnist_solo/      # 脱稿完整脚本（S8 验收）
    ├── web/                 # 🌐 Web 互动课程平台（npm run dev）
    └── notes.md            # 阶段 0 学习笔记
```

## 环境使用

```bash
cd llm-journey
source .venv/bin/activate        # 每次开始学习前激活虚拟环境

python scripts/verify_env.py          # 快速自检（MPS 可用性）
python scripts/verify_env.py --full   # 完整自检（+ 数据集下载与微型训练）

python -m ipykernel install --user --name llm-journey   # 注册 jupyter 内核（一次性）
jupyter notebook                 # 启动笔记本
```

> 环境用 **Python 3.11**（d2l 1.0.3 与 Python 3.12 不兼容，见 requirements.txt 说明）。

## 阶段进度

| 阶段 | 状态 | 产出物 |
|---|---|---|
| 0 · PyTorch 基础 | 🔄 进行中 | micrograd 复现 + MNIST 训练脚本 |
| 1 · 手写 Transformer | ⬜ 未开始 | 字符级小 GPT |
| 2 · Hugging Face | ⬜ 未开始 | 推理与采样实验 |
| 3 · LoRA 微调 | ⬜ 未开始 | 专属对话模型 |
| 4 · 架构与推理 | ⬜ 未开始 | 本地部署 + 量化对比 |
| 5 · 端到端项目 | ⬜ 未开始 | 完整应用 |

## 提交习惯

- 每完成一个小实验就 commit，配三五行情式笔记（做了什么 / 发现了什么 / 卡在哪）；
- 节奏可以慢，但不要断——连续性比单周时长更重要。
