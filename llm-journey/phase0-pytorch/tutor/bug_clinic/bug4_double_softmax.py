"""bug #4：训练 Fashion-MNIST 子集。本文件恰好有 1 处 bug（一行多余/位置错误的代码）。

运行：python bug4_double_softmax.py
观察重点：loss 是否下降、val acc 的绝对水平。
提示：健康基线（同款 lr=0.1、去掉那行多余代码）：val acc ≈ 73%。
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
        correct += (torch.softmax(model(x), dim=1).argmax(1) == y).sum().item()
        total += len(y)
    return correct / total


model = nn.Sequential(nn.Flatten(), nn.Linear(784, 64), nn.ReLU(), nn.Linear(64, 10)).to(DEV)
opt = torch.optim.SGD(model.parameters(), lr=0.1)
lossfn = nn.CrossEntropyLoss()

for epoch in range(3):
    for x, y in train:
        x, y = x.to(DEV), y.to(DEV)
        opt.zero_grad()
        probs = torch.softmax(model(x), dim=1)
        loss = lossfn(probs, y)
        loss.backward()
        opt.step()
    print(f"epoch {epoch}: 最后一步 loss = {loss.item():.4f}, val acc = {evaluate():.2%}")
