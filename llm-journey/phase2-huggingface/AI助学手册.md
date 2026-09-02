# 阶段 2 · AI 助学手册（S17–S20 ≈ 15h）

> Web 课程 c19–c23 先行；契约与 prompt 卡沿用 `../phase0-pytorch/tutor/prompts.md`。

## 场次总表

| 场次 | 主题 | 时长 | 完成标志 | 产出 |
|---|---|---|---|---|
| S17 | 模型解剖 + pipeline 三连 demo | 4h | 生成/分类/翻译三个 demo 跑通（pipeline 版 + AutoModel 版各一遍） | `exercises/pipeline_demos/` |
| S18 | 解码策略扫描 | 3h | T/top-k/top-p 三组对照实验 + 每组一句结论 | `experiments.md` |
| S19 | GPT vs BERT 精读 | 4h | 两段总结各 200 字 + 答辩通过 | `notes.md` |
| S20 | tokenizer 对比 + token 计费直觉 | 4h | 同句多 tokenizer 对比表 + 自己常用文本的"标价" | `exercises/tokenizer_lab/` |

## 要点

- 遇到下载慢：换 ModelScope 镜像；模型缓存在 `~/.cache/huggingface/`（阶段结束检查体积，路径文档的磁盘纪律）。
- Mac 推理记得 `device='mps'`；0.5B 模型 fp16 约 1GB，MPS 毫无压力。
- 精读笔记用"费曼式"：每篇写 200 字讲给外行听，写不出来 = 没懂，回看对应段。
