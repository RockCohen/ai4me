"""双月牙二分类数据生成（S4 用，不依赖 scikit-learn）。

用法：
    from data_moons import make_moons
    X, y = make_moons(n=200, noise=0.15, seed=0)   # X:(200,2) float, y:(200,) 0/1

数据本身不是 S4 的练习目标（目标是你手写的 micrograd 引擎），
直接用它训练即可。运行本文件可看数据概貌。
"""

import numpy as np


def make_moons(n: int = 200, noise: float = 0.15, seed: int = 0):
    rng = np.random.default_rng(seed)
    half = n // 2
    t1 = rng.uniform(0, np.pi, half)            # 上月牙参数角
    t2 = rng.uniform(0, np.pi, n - half)        # 下月牙参数角
    x1 = np.stack([np.cos(t1), np.sin(t1)], axis=1)
    x2 = np.stack([1 - np.cos(t2), 0.5 - np.sin(t2)], axis=1)
    X = np.concatenate([x1, x2], axis=0)
    X = X + rng.normal(0, noise, X.shape)
    y = np.concatenate([np.zeros(half), np.ones(n - half)])
    return X.astype(np.float32), y.astype(np.float32)


if __name__ == "__main__":
    X, y = make_moons()
    print(f"X: {X.shape}, y: {y.shape}, 正类占比: {y.mean():.0%}")
    print(f"x 范围 [{X[:,0].min():.2f}, {X[:,0].max():.2f}]，y 范围 [{X[:,1].min():.2f}, {X[:,1].max():.2f}]")
    print("两类中心：", X[y == 0].mean(0).round(2), X[y == 1].mean(0).round(2))
