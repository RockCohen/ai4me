# 阶段 0 · Web 互动课程平台

形式借鉴 [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)：
**每章只加一个机制、按顺序递进、Web 多视图**（阅读 + 模拟器）。
区别：learn-claude-code 的 web 需要 `npm install`，本平台**零依赖纯静态**——双击 `index.html` 即可，离线可用，进度存本机浏览器。

## 打开方式

```bash
cd phase0-pytorch/web
npm install
npm run dev        # 开发模式（改内容热更新），访问 http://localhost:5173
npm run build      # 生产构建 → dist/（48KB，可静态托管）
npm run preview    # 预览构建产物
```

> 改用 ES modules 后不再支持双击 file:// 直接打开；`npm run dev` 即可（Node ≥18）。

## 结构

```
web/
├── index.html          # 入口
├── css/style.css
└── js/
    ├── micrograd.js    # 浏览器版 Value 引擎（Python micrograd 的 JS 移植）+ 表达式解析 + SVG 计算图
    ├── tensorsim.js    # 张量形状/广播可视化器（6 个预设，含报错案例）
    ├── autogradsim.js  # autograd 交互台（表达式 → 计算图 → 反向动画 → 累加演示）
    ├── trainer.js      # 迷你训练场（Value 引擎搭 MLP，实时决策边界 + loss 曲线 + 病灶开关 + 五件套单步）
    ├── quiz.js         # 预测题组件（先预测 → 揭示 → 记录）
    ├── chapters.js     # 12 章课程内容
    └── app.js          # 路由 / 侧栏 / 进度
```

## 章节 ↔ Python 实战场次映射

| 章节 | 机制 | 模拟器 | 对应场次 |
|---|---|---|---|
| c01 形状与广播 | broadcasting 末维对齐 | TensorSim | S1 |
| c02 视图与内存共享 | view 零拷贝 | TensorSim | S1 |
| c03 计算图与 backward | 动态建图 | AutogradSim | S2 |
| c04 梯度累加与清零 | `.grad` 是 += | AutogradSim | S2 |
| c05 手写线性回归 | 无框架训练循环 | TrainerSim(拟合) | S2 |
| c06 Value：一个节点 | data/grad/_backward | AutogradSim | S3 ⛔禁写区 |
| c07 拓扑排序与全图反向 | 逆拓扑序 | AutogradSim | S3 ⛔禁写区 |
| c08 从 Value 到 MLP | Neuron/Layer/MLP | TrainerSim(分类) | S4 ⛔禁写区 |
| c09 五件套与单步 | 训练循环顺序 | TrainerSim(单步) | S7 |
| c10 坏代码门诊 | 5 病灶开关 | TrainerSim(病灶) | S6 |
| c11 真实数据 Fashion-MNIST | 全流程 | （回 Python） | S7 |
| c12 脱稿验收 | 断 AI + 考官制 | （回 Python） | S8·S9 |

## 边界说明（诚实条款）

- 模拟器是**预演**，用来低成本建立直觉；真正手感来自 `exercises/` 与 `tutor/` 的 Python 实战，产出物落库才算完成。
- c10 的病灶在 JS 里用 tanh+MSE 模拟，症状与 Python/Fashion-MNIST 版**同型不同值**；精确数字指纹以 `tutor/bug_clinic/` 的实测为准。
- trainer.js 中的随机数仅用于训练数据抖动与参数初始化，无任何安全用途。
