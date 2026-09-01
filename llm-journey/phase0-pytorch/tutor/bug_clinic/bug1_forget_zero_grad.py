"""bug #1：训练 Fashion-MNIST 子集。本文件恰好有 1 处 bug（一行代码的缺失）。

运行：python bug1_forget_zero_grad.py
观察重点：loss 曲线的形态（前 20 步逐批打印，之后按 epoch 汇总）。
提示：健康基线（lr=0.05）：3 个 epoch 后 val acc ≈ 68%，且 loss 应平滑下降。
"""

import pathlib

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Subset
from torchvision import datasets, transforms

torch.manual_seed(0)
DEV = "mps" if torch.backends.mps.is_available() else "cpu"
DATA = pathlib.Path(__file__).resolve().parents[3] / "data"

tf = transforms.ToTensor()
train_set = datasets.FashionMNIST(DATA, train=True, download=True, transform=tf)
train = DataLoader(Subset(train_set, range(2000)), batch_size=64, shuffle=True)
val_set = datasets.FashionMNIST(DATA, train=False, download=True, transform=tf)
val = DataLoader(Subset(val_set, range(500)), batch_size=256)


@torch.no_grad()
def evaluate():
    model.eval()
    correct = total = 0
    for x, y in val:
        x, y = x.to(DEV), y.to(DEV)
        correct += (model(x).argmax(1) == y).sum().item()
        total += len(y)
    return correct / total


model = nn.Sequential(nn.Flatten(), nn.Linear(784, 64), nn.ReLU(), nn.Linear(64, 10)).to(DEV)
opt = torch.optim.SGD(model.parameters(), lr=0.05)
lossfn = nn.CrossEntropyLoss()

step = 0
for epoch in range(3):
    for x, y in train:
        x, y = x.to(DEV), y.to(DEV)
        loss = lossfn(model(x), y)
        loss.backward()
        opt.step()
        if step < 20:
            print(f"  step {step:2d}  loss = {loss.item():.4f}")
        step += 1
    print(f"epoch {epoch}: 最后一步 loss = {loss.item():.4f}, val acc = {evaluate():.2%}")
