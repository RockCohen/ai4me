# 阶段 4 · AI 助学手册（S26–S28 ≈ 15h）

> Web 课程 c28（MoE 路由）/ c29（KV cache 计算器）把机制先玩明白——特别是 0.5MB/token 这把标尺。

## 场次总表

| 场次 | 主题 | 时长 | 完成标志 | 产出 |
|---|---|---|---|---|
| S26 | MoE 精读 + 要点笔记 | 4h | 一页笔记讲清专家/路由/负载均衡 | `notes-moe.md` |
| S27 | vLLM 精读 + 要点笔记 | 4h | 一页笔记讲清 KV cache 账本与分页 | `notes-vllm.md` |
| S28 | 本机部署 + 量化对比 + vLLM 云端 | 7h | tokens/s 实测、两处质量差异、curl 调通 vLLM | `benchmarks.md` |

## 部署实验清单（S28）

1. `ollama pull qwen2.5:7b-instruct-q4_K_M` → 计时 20 个问题的 tokens/s；
2. 同样问题问 transformers 原精度版（0.5B 对照亦可），记录两处可感知差异；
3. Colab + vLLM：起服务 → `curl http://localhost:8000/v1/chat/completions ...` 成功 → 记录并发前后吞吐。
4. 磁盘纪律：实验完 `ollama rm` 清模型（路径文档 2.3）。
