"""阶段 0 环境自检脚本。

用法：
    python scripts/verify_env.py          # 基础检查 + MPS 计算/反向传播冒烟测试
    python scripts/verify_env.py --full   # 额外下载 Fashion-MNIST 并跑一次微型训练
"""

import subprocess
import sys


def main(full: bool) -> None:
    print("=" * 60)
    print("① 基础信息")
    print(f"   Python     : {sys.version.split()[0]}")

    import torch
    import torchvision

    print(f"   torch      : {torch.__version__}")
    print(f"   torchvision: {torchvision.__version__}")

    print("=" * 60)
    print("② MPS 后端（Apple GPU）")
    mps_ok = torch.backends.mps.is_available()
    print(f"   torch.backends.mps.is_available() = {mps_ok}")
    if not mps_ok:
        sys.exit("❌ MPS 不可用，请确认在 Apple 芯片 Mac 的原生 Python 环境中运行")

    device = torch.device("mps")
    x = torch.randn(4, 8, device=device, requires_grad=True)
    w = torch.randn(8, 3, device=device, requires_grad=True)
    y = (x @ w).sum()
    y.backward()
    assert x.grad is not None and w.grad is not None
    print(f"   前向 + 反向传播计算成功：y = {y.item():.4f}，梯度已回传 ✓")

    print("=" * 60)
    print("③ d2l 工具包（《动手学深度学习》）")
    from d2l import torch as d2l  # noqa: F401

    print("   from d2l import torch as d2l 导入成功 ✓")

    if not full:
        print("=" * 60)
        print("✅ 环境自检通过（--full 可加测数据集下载与微型训练）")
        return

    print("=" * 60)
    print("④ Fashion-MNIST 下载与微型训练冒烟测试")
    import os
    import time

    from torch import nn
    from torch.utils.data import DataLoader, Subset
    from torchvision import datasets, transforms

    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    trans = transforms.ToTensor()
    train_set = datasets.FashionMNIST(root=data_dir, train=True, download=True, transform=trans)
    print(f"   数据集就绪：{len(train_set)} 张训练图片 ✓")

    # 只取 4000 张、单层线性网络，只为验证「数据 → 模型 → 训练 → 评估」链路
    subset = Subset(train_set, range(4000))
    loader = DataLoader(subset, batch_size=64, shuffle=True)
    model = nn.Sequential(nn.Flatten(), nn.Linear(28 * 28, 10)).to(device)
    loss_fn = nn.CrossEntropyLoss()
    opt = torch.optim.SGD(model.parameters(), lr=0.1)

    start = time.time()
    for epoch in range(3):
        total_loss = 0.0
        for imgs, labels in loader:
            imgs, labels = imgs.to(device), labels.to(device)
            opt.zero_grad()
            loss = loss_fn(model(imgs), labels)
            loss.backward()
            opt.step()
            total_loss += loss.item()
        print(f"   epoch {epoch + 1}/3  平均 loss = {total_loss / len(loader):.4f}")
    print(f"   在 MPS 上完成 3 轮微型训练，耗时 {time.time() - start:.1f} 秒 ✓")
    mean_loss = total_loss / len(loader)
    assert mean_loss < 1.0, "损失未下降，训练链路可能有问题"
    print("=" * 60)
    print("✅ 全部自检通过，环境就绪，可以开始阶段 0 学习！")


if __name__ == "__main__":
    main(full="--full" in sys.argv)
