# 阶段 3：LoRA 微调实战（2～3 周）· 入门期毕业项目

> 目标：亲手把预训练模型改造成特定用途的对话模型；理解 LoRA/QLoRA 的原理与显存账本；体验 MLX 本机 + Colab 云端双轨。
>
> ⚡ Web 课程 c24–c27 先行（LoRA 探索器 + 量化账本计算器把两笔核心账算明白）。手册 → **[AI助学手册.md](AI助学手册.md)**

## 材料清单

| 材料 | 链接 | 用法 |
|---|---|---|
| LoRA 论文 | [arXiv:2106.09685](https://arxiv.org/abs/2106.09685) | **S22 精读**，重点低秩动机实验 |
| QLoRA 论文 | [arXiv:2305.14314](https://arxiv.org/abs/2305.14314) | NF4/双重量化三件套 |
| MLX + mlx-lm | [GitHub](https://github.com/ml-explore/mlx) | 本机微调（`pip install mlx-lm`） |
| LLaMA-Factory | [GitHub](https://github.com/hiyouga/LLaMA-Factory) | 先图形化跑通全局 |
| 数据集 | Alpaca-GPT4-zh / BelleGroup / 自建 200 条 | 数据先行原则 |

## 任务清单（路径文档 6.4）

- [ ] 本机用 MLX 完成 Qwen2.5-1.5B 的 LoRA 微调，做一个特定角色对话模型（如"文言文翻译助手"）
- [ ] 云端用 PEFT+QLoRA 完成一次 7B 微调，对比与本机流程的异同
- [ ] 微调前后用同一组测试问题对比模型行为，保存对话记录
- [ ] 能口头回答：LoRA 的 rank 与 alpha 各控制什么；LoRA 层为什么通常只加在注意力投影矩阵上

## 场次（S22–S25 ≈ 25h）

验收标准（路径文档 6.5）：提交微调实验记录——数据构成、超参、训练损失曲线、前后对比，并能解释至少一处失败尝试。
