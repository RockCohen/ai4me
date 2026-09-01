"""micrograd 对拍脚本（S3 完成标志）。

把本脚本指向你的引擎文件并运行：
    python tutor/gradcheck.py
    MICROGRAD_FILE=path/to/your_engine.py python tutor/gradcheck.py

判定：三项测试全部 PASS（与 PyTorch 梯度误差 < 1e-6）即 S3 达标。
用法：先改下面的 ENGINE_FILE 为你的文件名（默认假设你写在
exercises/02_micrograd/engine.py 里，且类名是 Value）。
"""

import importlib.util
import os
import pathlib
import sys

import torch

ENGINE_FILE = os.environ.get(
    "MICROGRAD_FILE",
    str(pathlib.Path(__file__).resolve().parents[1] / "exercises" / "02_micrograd" / "engine.py"),
)

spec = importlib.util.spec_from_file_location("my_engine", ENGINE_FILE)
if spec is None or not pathlib.Path(ENGINE_FILE).exists():
    sys.exit(f"找不到你的引擎文件：{ENGINE_FILE}（用 MICROGRAD_FILE 环境变量指定路径）")
my = importlib.util.module_from_spec(spec)
spec.loader.exec_module(my)
Value = my.Value

TOL = 1e-6
results = []


def compare(name, build_mine, build_torch, n_vars=3):
    """同一表达式分别在 micrograd 与 torch 中构建、反向，逐变量对比梯度。"""
    mine_vars = [Value(float(v)) for v in ([2.0, -1.0, 0.5])[:n_vars]]
    out = build_mine(mine_vars)
    out.backward()
    t_vars = [torch.tensor(v, requires_grad=True) for v in ([2.0, -1.0, 0.5])[:n_vars]]
    build_torch(t_vars).backward()
    worst = max(abs(m.grad - t.grad.item()) for m, t in zip(mine_vars, t_vars))
    ok = worst < TOL
    results.append(ok)
    print(f"{'PASS' if ok else 'FAIL'}  {name:28s} 最大梯度误差 = {worst:.2e}")
    return ok


# 测试 1：菱形依赖（必测）——a*b + a*c + b*c，检验 += 累加与拓扑顺序
compare(
    "菱形依赖 a*b+a*c+b*c",
    lambda v: v[0] * v[1] + v[0] * v[2] + v[1] * v[2],
    lambda v: v[0] * v[1] + v[0] * v[2] + v[1] * v[2],
)

# 测试 2：别名使用（必测）——a + a，检验同一节点出现两次时的梯度
compare("别名 a+a", lambda v: v[0] + v[0], lambda v: v[0] + v[0], n_vars=1)

# 测试 3：复合表达式（必测）——(a + b*c) * (a - b)
compare(
    "复合 (a+b*c)*(a-b)",
    lambda v: (v[0] + v[1] * v[2]) * (v[0] - v[1]),
    lambda v: (v[0] + v[1] * v[2]) * (v[0] - v[1]),
)

# 测试 4：tanh（可选）——你的引擎还没实现会自动跳过
try:
    compare(
        "tanh 复合",
        lambda v: ((v[0] * v[1] + v[2]).tanh() * v[0]).tanh(),
        lambda v: torch.tanh(torch.tanh(v[0] * v[1] + v[2]) * v[0]),
    )
except AttributeError:
    print("SKIP  tanh 复合                       你的 Value 还没有 tanh（S4 前用 exp 组合实现即可）")
    results.append(True)

n_pass = sum(results)
print("-" * 50)
print(f"{n_pass}/{len(results)} 项通过", "✅ S3 达标，进入 S4" if n_pass == len(results) else "❌ 未达标，用 ④ 卡向 AI 要 L1 提示")
sys.exit(0 if n_pass == len(results) else 1)
