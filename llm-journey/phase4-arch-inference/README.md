# 阶段 4：现代架构与推理基础（1～2 周）· 通往推理系统的桥梁

> 目标：补齐 MoE 稀疏架构与 KV cache/推理显存两大拼图——这是通往 FreeToken 这类推理引擎方向的直接前置。李沐两期论文精读是主线。
>
> ⚡ Web 课程 c28–c30（MoE 路由 / KV cache 计算器 / 部署三部曲）。手册 → **[AI助学手册.md](AI助学手册.md)**

## 材料清单

| 材料 | 链接 | 用法 |
|---|---|---|
| 李沐 MoE 论文精读（Switch+GLaM） | [BV1EM411T7bn](https://www.bilibili.com/video/BV1EM411T7bn) | 主线一：专家/稀疏激活/负载均衡 |
| 李沐 vLLM 论文精读（PagedAttention） | B 站搜"李沐 vLLM" | 主线二：KV cache 管理的操作系统思路 |
| Ollama | [ollama.com](https://ollama.com) | 本机跑 7B Q4，OpenAI 兼容接口 |
| vLLM | [docs.vllm.ai](https://docs.vllm.ai) | Colab 起生产级服务 |
| FreeToken | [GitHub](https://github.com/FlashML-org/FreeToken) / [arXiv:2608.16157](https://arxiv.org/abs/2608.16157) | 毕业后的进阶衔接（本机不可运行，论文阅读不受影响） |

## 任务清单（路径文档 7.4）

- [ ] 观看 MoE 与 vLLM 两期论文精读，各写一页要点笔记
- [ ] Ollama 拉取一个 7B Q4 模型，测试本机推理速度（tokens/s）
- [ ] 对比量化与原精度模型的回答，记录两处可感知的质量差异
- [ ] Colab 上用 vLLM 起服务，用 curl 或 Python 客户端调用成功

## 场次（S26–S28 ≈ 15h）

验收标准（路径文档 7.5）：能用自己的话回答——MoE 为什么能用更少计算量换更大参数规模？KV cache 显存占用随什么增长？PagedAttention 解决了什么问题？
