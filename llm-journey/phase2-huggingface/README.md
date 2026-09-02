# 阶段 2：Hugging Face 生态（1～2 周）

> 目标：从"自己造轮子"切换到工业界工具——`transformers`/`datasets`/`tokenizers` 的日常用法，预训练模型的加载、推理与采样控制；借李沐精读补齐 GPT 与 BERT 两条路线。
>
> ⚡ 沿用同一模式：Web 课程 c19–c23 建立概念直觉 → 本文件夹场次实战。手册 → **[AI助学手册.md](AI助学手册.md)**

## 材料清单

| 材料 | 链接 | 用法 |
|---|---|---|
| HF LLM Course（有中文版） | [huggingface.co/learn](https://huggingface.co/learn) | **实操主线**，前三章覆盖本阶段 |
| 李沐 GPT 系列精读 | [BV1AF41137uu](https://www.bilibili.com/video/BV1AF41137uu) | 预训练范式演进 |
| 李沐 BERT 精读 | B 站搜"李沐 BERT" | 双向路线 |
| ModelScope 魔搭 | [modelscope.cn](https://modelscope.cn) | 国内模型下载镜像 |
| Qwen2.5-0.5B | HF / 魔搭 | 本阶段实操模型（16GB Mac 轻松推理） |

## 任务清单（路径文档 5.3）

- [ ] 用 Qwen2.5-0.5B 完成文本生成、情感分类、翻译三个推理 demo
- [ ] 对比同一句话在不同 tokenizer 下的切分与 token 数量差异
- [ ] 固定提示词，扫描 temperature 与 top_p，观察并记录生成结果的变化规律
- [ ] 看完 GPT 与 BERT 两期精读，各写一段话总结两条路线的分野

## 场次（S17–S20 ≈ 15h）

详见手册。验收标准（路径文档 5.5）：不查文档加载任意模型完成推理；能说清 temperature 与 top_p 各控制什么、采样时谁先生效。
