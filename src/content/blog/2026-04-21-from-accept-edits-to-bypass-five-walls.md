---
title: '从 Accept Edits 到 Bypass,我还差几堵墙'
description: '升到 Bypass 不是勇气问题,是工程进度问题。信任不是一个按钮,是一个架构。'
pubDate: '2026-04-21'
---

我现在用 Claude Code 的 Accept Edits 模式。

不是最保守的 Default(每步问我),也不是最激进的 Bypass(全不问)。停在中间的一档——AI 可以自动改文件,但涉及 Bash、删东西、动外部的事,还是要弹我一下再放行。

我的 Leader 用 Bypass。他每周烧完 Max 额度,我用不完。昨天我还在想"差距是信任",今天换个问法:

**从 Accept Edits 升到 Bypass,我到底还差什么?**

## 不是勇气问题

一开始我以为这是心态问题——"你要再大胆一点"。后来发现不是。

你不敢升到 Bypass,不是因为保守,是因为**你知道自己还没建好让 AI 撒野的笼子**。这是一种合理的谨慎。

问题不是"我够不够信任 AI",是"我的环境够不够兜得住 AI 犯错"。

**升级不是换开关,是搭架子。**

## 五堵墙

如果 Bypass = 让 AI 不问就干,那我得先确保五件事都到位:

### 墙 1 — 物理边界

让 AI 在有边的盒子里工作,不是你的主工作区:
- `git worktree` 开一个分支副本,搞砸了 remove 扔掉
- Docker / Devcontainer 隔离文件系统
- 远程 dev box 更彻底

核心:**炸了也炸不出这个盒子**。

### 墙 2 — 数据边界

AI 不该摸的东西,物理上让它摸不到:
- 生产 credential 不在 AI 的 env / PATH(`.env.production`、`~/.aws/credentials`、`gh token`)
- 要给数据就给只读副本,不给生产连接
- 外部写动作(发消息、推 PR、调生产 API)单独走审批通道,绕过 Bypass

核心:**能炸的东西,根本不给 AI 碰的机会**。

### 墙 3 — 回滚兜底

- 关键改动打 checkpoint commit
- 配置 / 数据库定时快照
- 操作幂等,多跑一次不会翻倍伤害

核心:**能退回昨天**。

### 墙 4 — 监理兜底

这是今天我真的焊出来的那堵墙,所以多说两句。

Claude Code 有 `PreToolUse` hook——AI 每次要调 tool 之前,先跑一个你写的脚本。如果脚本 `exit 2`,tool 被硬拦下,AI 拿到的是失败。**它绕不过去,不管它多想说服自己这没事。**

我今天花了半小时写了个 84 行的 `guardian.sh`,挂在这个 hook 上。规则很朴素,就是一堆 regex:

- Bash 里出现 `rm -rf /` / `~` / `$HOME` → block
- `git push --force` 到 main/master/develop → block(`--force-with-lease` 放行)
- `git reset --hard` → block
- `gh repo delete` → block
- SQL 里出现 `DROP TABLE` / `TRUNCATE` → block
- 写入 `~/.ssh/` / `.env.production*` / `~/.aws/credentials` → block
- MCP 飞书发消息 → block(强制先在对话里预览)

这不是模型的自我约束。模型层也有"不要过度破坏"的 prompt,但那是 soft guideline,AI 会判断错,也会被说服。hook 是外部脚本,AI 看到的就是失败。**一个是员工培训,一个是门禁卡**。

关键是 —— **hook 是我掌控的**。Anthropic 的 Auto Mode 规则未来可能变,我这 84 行代码只有我改它才会变。

核心:**发现裂缝的机制**。

### 墙 5 — 目标可验证

AI 不是司机,是发动机。你得给它方向盘:
- 有测试套件 → AI 改完自己知道通没通
- 有明确的输出 schema → AI 改完能验证
- 有"改完该长什么样"的判据 → AI 有锚点

"改成 dark mode"能 Bypass。"让它更好看"不能——没有方向盘。

核心:**AI 有锚,不是凭感觉开**。

## 反转:五堵墙都建好了,Bypass 和 Accept Edits 没啥区别

这是个有点扫兴的发现。

如果物理、数据、回滚、监理、目标五件事都到位,**Bypass 能造成的伤害已经被结构性堵住了**。AI 不问就干,但它能干的都是安全的;它想干不安全的,hook 会拦。

那 Accept Edits 和 Bypass 的差别,从"有没有危险"变成了"**你想不想被问**":

- Accept Edits:AI 改文件不问,做其他都问
- Bypass(墙内):AI 什么都不问,但有护栏

前者多一些"确认一下"的心理安全感,后者让你少敲几次回车。

## 真正的最后一步

所以障碍是:**你还习不习惯"我不在那一刻也行"**。

Accept Edits 的本质是你要**在场**——每个 Bash、每个外部动作,都想让你按一下回车。Bypass 的本质是你**缺席**——AI 独立推进,你晚点回来 check。

这一跳,不是信任 AI,是**信任你自己搭的系统**。

你不在场,不代表你没防备。护栏在场,日志在场,监理 agent 在场,checkpoint 在场。你让渡的不是控制权,是"事事过目"的职业自我。

## 收束

回到"我为什么还停在 Accept Edits"。

不是我怕 AI 翻车,是我五堵墙还没全立起来——物理边界这个项目有 worktree,另一个没有;数据边界家里机器隔了,公司机器还没有;监理 hook 今天刚焊完,还没跑满一周。

**升级到 Bypass 不是勇气问题,是工程进度问题。**

当五堵墙都立起来,Bypass 会变成一个**自然结论**,不是一个勇敢决定。

**信任不是一个按钮,是一个架构。**
