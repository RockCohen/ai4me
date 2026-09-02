# llm-journey · 大模型学习旅程

> GitHub 仓库：<https://github.com/RockCohen/llm-journey>

个人大模型入门学习的工作区总仓：路径规划、互动课程、实验代码、学习笔记与思考延伸统一用 git 管理。

## 结构

```
ai4me/
├── 大模型入门学习路径.md     # 总路径（6 阶段规划、资源分工、硬件边界）
└── llm-journey/             # 实验总仓（代码、笔记、实验记录）
    ├── phase0-pytorch/      # 阶段 0：PyTorch 基础 + micrograd 复现
    │   ├── AI助学手册.md    # 场次制学习流程（S1–S9）
    │   ├── tutor/           # AI 助教材料（prompt 卡、实验卡、题库、坏代码门诊）
    │   └── web/             # Web 互动课程平台（npm install && npm run dev）
    └── ...
```

## 使用

- 学习从 [llm-journey/phase0-pytorch/AI助学手册.md](llm-journey/phase0-pytorch/AI助学手册.md) 开始；
- 每完成一个实验就 commit，配三五行情式笔记；
- 同步远端：`git push`（远端 `origin` 已指向 `RockCohen/llm-journey`）。
