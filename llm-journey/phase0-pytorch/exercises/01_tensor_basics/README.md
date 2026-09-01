# 01 · 张量操作热身

对应 d2l 教材第 2.1～2.5 节（数据操作 → 自动微分）。

练习目标（做完在笔记里记一笔）：
- 创建、变形、广播、切片张量；`requires_grad=True` 时做一次前向 + `backward()`，检查 `.grad`
- 对比 NumPy 与 torch 的 API 差异
- 把张量在 CPU / MPS 设备间移动：`.to("mps")`

自己的代码写在本目录，命名随意（如 `tensor_warmup.py` 或 notebook）。
