# S2 答案 · autograd 实验卡

> ⚠️ 先跑完全部题目再打开。Q3/Q4 的结论是 S6 门诊 bug #1 的病根，务必搞透。

| 题 | 答案 | 关键点 |
|---|---|---|
| Q1 | `tensor(12.)` | 3x² 在 x=2 处 = 12。`backward()` 把 ∂y/∂x 累加进 `x.grad` |
| Q2 | **RuntimeError**：grad can be implicitly created only for scalar outputs | 反向传播从"一个数"往回推；非标量输出框架不知道拿哪个数当起点，需显式传 `grad_output`。所以训练里 loss 必须约简成标量 |
| Q3 | 第一次 `2.`，第二次 `4.` | **`.grad` 是累加的，不是覆盖的**。框架这么设计是为了多次反向（多任务/梯度检查）可叠加，代价是训练循环必须自己清零 |
| Q4 | `6.`（2 累加 3 次）。缺 `x.grad.zero_()`（实战中即 `optimizer.zero_grad()`） | 直接引出 Q4 与门诊 bug #1 |
| Q5 | `False`、`None` | `no_grad` 内的操作不建图、不记梯度——验证/推理省内存提速度的标准姿势 |
| Q6 | `True`、`False` | `detach` 数值相同但与计算图断开。常用于"拿中间结果当常量用" |
| Q7 | `x.grad=tensor(2.)`，`z.grad=None` | 默认只有**叶子**节点存 `.grad`；中间节点的梯度用完即弃（省内存），确需要就 `z.retain_grad()` |
| Q8 | `False` → `True`；等价 | 带下划线 = 原地开启 requires_grad |
| Q9 | 收敛到 w≈3, b≈1 | 三问见下 |
| Q10 | `True` | gradcheck 用数值差分（(f(x+h)-f(x-h))/2h）对比解析梯度，验证求导实现是否正确——S3 对拍你的 micrograd 引擎用同款思路 |

### Q9 三问

1. **`zero_()` 对应 Q3/Q4**：梯度累加，每步必须清零，否则等效学习率逐迭代增大直至发散。
2. **更新必须在 `no_grad` 里**：直接 `w -= lr * w.grad` 是对叶子张量的原地写，会直接报错 `a leaf Variable that requires grad is being used in an in-place operation`；即便绕过，更新本身也会被记进计算图，下一步 backward 会沿"参数更新"这条不存在的路径求导，且内存持续膨胀。试着去掉跑一次看报错，印象最牢。
3. **`.item()`**：零维张量 → 原生 float。不转的话 loss 历史会拖着整个计算图不释放（内存泄漏）。对应 Q8。

### 自测收尾参考

1. 第二次 backward 前清零 `.grad`（`zero_grad()`）。框架不自动清零是因为累加本身是特性（梯度累积、多损失叠加），训练循环语义下才需要你负起清零责任。
2. `no_grad`：一段代码域内都不建图（推理/更新）；`detach`：从现有图上切下一个常量副本。
3. 顺序原因：先有 loss 才能 backward；先 backward 才有梯度可更新；更新前清零、更新后下轮重新累计——清零放在循环开头与放在 backward 前等价，但**放在 backward 之后、下一轮 backward 之前**就错了。
