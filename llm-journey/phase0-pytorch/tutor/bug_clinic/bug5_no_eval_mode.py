"""bug #5：训练 Fashion-MNIST 子集。本文件恰好有 1 处 bug（一行代码的缺失）。

运行：python bug5_no_eval_mode.py
观察重点：train acc 与 val acc 的对比、val acc 是否逐轮波动。
提示：健康基线（补上那行缺失代码，p=0.7）：val acc ≈ 66%～69%，且逐轮上升。
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
    correct = total = 0
    for x, y in val:
        x, y = x.to(DEV), y.to(DEV)
        correct += (model(x).argmax(1) == y).sum().item()
        total += len(y)
    return correct / total


model = nn.Sequential(
    nn.Flatten(), nn.Linear(784, 128), nn.ReLU(), nn.Dropout(0.7), nn.Linear(128, 10)
).to(DEV)
opt = torch.optim.SGD(model.parameters(), lr=0.1)
lossfn = nn.CrossEntropyLoss()

for epoch in range(3):
    correct = total = 0
    for x, y in train:
        x, y = x.to(DEV), y.to(DEV)
        opt.zero_grad()
        logits = model(x)
        correct += (logits.argmax(1) == y).sum().item()
        total += len(y)
        loss = lossfn(logits, y)
        loss.backward()
        opt.step()
    print(f"epoch {epoch}: train acc = {correct / total:.2%}, val acc = {evaluate():.2%}")
