# S2 实验卡 · autograd：梯度、计算图与手写训练（10 题）

> 用法同 S1：先预测再运行，答案在 [`answers/s2_autograd.md`](answers/s2_autograd.md)。
> 本卡是 S6 坏代码门诊的理论底座——Q3 的结论将直接解释门诊 bug #1。

```python
import torch
```

### Q1 基本求导
```python
x = torch.tensor(2.0, requires_grad=True)
y = x ** 3
y.backward()
print(x.grad)
```
预测：x.grad 是多少？（手算 dy/dx = 3x²）

### Q2 非标量输出报错（预测"会不会报错"类）
```python
x = torch.tensor([1.0, 2.0], requires_grad=True)
y = x * 2
y.backward()
```
预测：正常运行还是报错？为什么 PyTorch 默认只允许标量直接 backward？

### Q3 grad 会累加（本卡最重要的一题）
```python
x = torch.tensor(1.0, requires_grad=True)
y = x * 2
y.backward(retain_graph=True)
print("第一次:", x.grad)
y.backward(retain_graph=True)
print("第二次:", x.grad)
```
预测：两次打印分别是几？——**记住这个行为，S6 门诊第 1 号 bug 的病根就是它。**

### Q4 累加的对策
```python
x = torch.tensor(1.0, requires_grad=True)
for i in range(3):
    y = x * 2
    y.backward()
print(x.grad)
```
预测：x.grad 是 2 还是 6？循环里漏了一句什么才会得到"正确"的 2？

### Q5 no_grad
```python
x = torch.tensor(1.0, requires_grad=True)
with torch.no_grad():
    y = x * 2
print(y.requires_grad, y.grad_fn)
```
预测：两个输出？什么时候你会想用 no_grad（想想：训练完做验证时）？

### Q6 detach
```python
x = torch.tensor(2.0, requires_grad=True)
y = x * 3
z = y.detach()
print(z == y, z.requires_grad)
```
预测：两个输出？z 和 y 的数值关系？z 还连着计算图吗？

### Q7 叶子节点
```python
x = torch.tensor(2.0, requires_grad=True)
z = x * 2
z.backward()
print(x.grad, z.grad)
```
预测：z.grad 是多少还是 None？为什么中间结果默认不存梯度？

### Q8 事后开启梯度
```python
x = torch.tensor([1.0, 2.0])
print(x.requires_grad)
x.requires_grad_()
print(x.requires_grad)
```
预测：两次打印？这个带下划线的方法和 Q1 的 `requires_grad=True` 参数等价吗？

### Q9 ⭐ 手写线性回归（本卡终极实验）
不用 `nn.Linear`、不用 optimizer，只用张量和 autograd，拟合 y = 3x + 1：

```python
torch.manual_seed(0)
x = torch.rand(100, 1)
y = 3 * x + 1 + torch.randn(100, 1) * 0.1

w = torch.randn(1, requires_grad=True)   # 故意从随机值开始
b = torch.zeros(1, requires_grad=True)

for step in range(200):
    pred = w * x + b
    loss = ((pred - y) ** 2).mean()
    loss.backward()
    with torch.no_grad():          # 为什么更新参数要在 no_grad 里？
        w -= 0.1 * w.grad
        b -= 0.1 * b.grad
        w.grad.zero_(); b.grad.zero_()
    if step % 40 == 0:
        print(step, loss.item(), w.item(), b.item())
```
先抄写运行（这一题允许抄），然后回答：
1. `w.grad.zero_()` 对应实验卡哪一题的结论？
2. 参数更新为什么必须包在 `no_grad` 里？不包会怎样（试着去掉跑一次）？
3. `loss.item()` 里的 `.item()` 是 Q8 哪个知识点的应用？

### Q10 gradcheck 预演
```python
def f(x):
    return (x * x).sum()

x = torch.tensor([0.5, -1.2], requires_grad=True, dtype=torch.double)
ok = torch.autograd.gradcheck(f, (x,))
print(ok)
```
预测：输出？gradcheck 在做什么（用数值差分对比解析梯度）？——S3 你造完 micrograd 引擎后，会用同款思路对拍自己的实现。

---

## 自测收尾

合上卡片回答，答不出回查对应题：
1. backward 第二次调用前必须做什么？为什么框架不自动做？
2. `no_grad` 与 `detach` 都"断图"，使用场景差异？
3. 一个完整的手写训练步 = 前向 → `backward()` → `no_grad` 内更新 → `zero_()`，缺一不可的顺序原因？
