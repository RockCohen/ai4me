# 03 · d2l 教材代码：Fashion-MNIST 完整训练

跟随 [zh.d2l.ai](https://zh.d2l.ai) 第 3.5～3.7 节（softmax 回归，图像分类数据集）的代码，
在 Fashion-MNIST 上完成：数据加载 → 模型定义（softmax 回归 / 简单 MLP 均可）→ 训练 → 验证集评估。

提示：
- 数据集会自动下载到仓库根目录 `data/`（已 gitignore）
- `from d2l import torch as d2l` 可用其 `Animator`、`Accumulator` 等辅助类
- 记录训练损失曲线与验证集准确率，存一份图到本目录
