# S1 实验卡 · 张量：形状、广播与内存（11 题）

> 用法：每题**先在纸上/注释里写下预测**（输出形状？数值？会不会报错？），再运行验证。
> 答案在 [`answers/s1_张量.md`](answers/s1_张量.md)——跑完再看。答错用 ② 卡要变体题。
> 逐题跑法：`python` 进交互环境，或写进 `exercises/01_tensor_basics/predictions.py` 一次跑完。

```python
import torch
```

### Q1 广播入门
```python
a = torch.ones(3, 4)
b = torch.ones(4)
print((a + b).shape)
```
预测：(a+b) 的形状是？为什么 b 是一维也能加？

### Q2 广播陷阱
```python
a = torch.ones(3, 4)
b = torch.ones(3)
print((a + b).shape)
```
预测：输出什么？和 Q1 差在哪一个维度？

### Q3 广播规则
```python
a = torch.ones(3, 1)
b = torch.ones(1, 4)
print((a + b).shape)
```
预测：形状？此时 `a + b` 一共有几个元素？

### Q4 dtype 变化
```python
t = torch.tensor([1, 2, 3])
print(t.dtype, (t / 2).dtype)
```
预测：两处的 dtype 分别是？

### Q5 内存共享（本卡最重要的一题）
```python
a = torch.arange(12).reshape(3, 4)
b = a.view(4, 3)
b[0, 0] = 99
print(a[0, 0])
```
预测：`a[0,0]` 是几？`reshape` 换成 `a.t()` 再试一次呢？

### Q6 沿哪个维求和
```python
x = torch.ones(2, 3, 4)
print(x.sum(dim=1).shape)
print(x.sum(dim=1, keepdim=True).shape)
```
预测：两个 shape？`keepdim` 存在的意义是什么（提示：想想广播）？

### Q7 matmul vs 逐元素乘
```python
a = torch.ones(3, 4); b = torch.ones(4, 2); c = torch.ones(4)
print((a @ b).shape)
print((a * a).shape)
print((a @ c).shape)
```
预测：三个 shape？`@` 和 `*` 的本质区别一句话是什么？

### Q8 零维张量
```python
x = torch.tensor(3.0)
print(x.shape, x.ndim, type(x.item()))
print((x + x).shape)
```
预测：三个输出分别是什么？标量该用 `x` 还是 `x.item()` 传给纯 Python 代码？

### Q9 原地操作
```python
a = torch.ones(3)
b = a.add_(1)
print(a, b, a is b)
```
预测：a、b 的值？`a is b` 是 True 还是 False？方法名里下划线 `_` 代表什么？

### Q10 NumPy 桥
```python
t = torch.ones(3)
n = t.numpy()
n[0] = 7
print(t)
```
预测：t 被改了吗？这说明两者共享什么？（提示：这题在 CPU 上做）

### Q11 上 GPU（你的机器专属）
```python
x = torch.randn(4, device="mps")
print(x.device)
y = x.cpu()
print(y.device, x.is_leaf)
```
预测：两处 device？搬回 CPU 后 x 还在 MPS 上吗？

---

## 自测收尾

全部跑完后，合上答案自问三句，答不出就回查：
1. 广播从**哪个方向**对齐维度？
2. `view/t/切片` 为什么不复制内存？这既是性能优点也是什么隐患？
3. `a.add_(1)` 与 `a = a + 1` 在「其他变量也引用着 a」时行为有何不同？
