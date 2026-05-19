---
title: OpenClaw Windows 本地部署（最细保姆版）
published: 2026-03-20
updated: 2026-03-20
description: '一份在 Windows 系统上本地部署并运行 OpenClaw AI 智能体的分步教程，包含环境配置、安装流程与基础设置。'
image: ''
tags: [OpenClaw, Windows, 部署, AI智能体, 本地部署, 开源]
category: '教程'
draft: false 
lang: ''
pinned: false
series: 'OpenClaw 部署系列'
---

### **一、安装环境要求：安装nodejs和git** 

###### 1、Git下载安装：下载地址：https://git-scm.com/install/windows

![image-20260320152054792](../_assets/images/image-20260320152054792.png)

###### 2、Node.js下载安装：下载地址：https://nodejs.org/zh-cn/download

![image-20260320152605463](../_assets/images/image-20260320152605463.png)



::link-card{url="https://pengxing.dpdns.org/posts/latest_nodejs_installation_tutorial" title="【保姆级】Node.js 最新安装教程" description="超级详细Windows安装Node.js,一步一截图"}

### 二、OpenClaw一键安装脚本

###### 1.点击电脑左下角图标，输入PowerShell，出现Windows PowerShell项  , 在该选项上点击右键，选择“以管理员身份运行”  

![image-20260320160230413](../_assets/images/image-20260320160230413.png)

###### 2、 脚本命令行一键式安装部署 输入：**npm install -g openclaw@latest 等待安装完成即可**

![image-20260320202414650](../_assets/images/image-20260320202414650.png)

###### 错误：解决办法

```
优先用「HTTPS 替换 SSH」的极简方案（不用配密钥，5 秒搞定）
你已经装了 Git，直接在管理员 PowerShell 里执行以下两条命令，强制 Git 用 HTTPS 访问 GitHub，避开 SSH 认证：
# 把所有 GitHub SSH 地址替换成 HTTPS
git config --global url."https://github.com/".insteadOf git@github.com:
git config --global url."https://github.com/".insteadOf ssh://git@github.com/

# 重新安装 openclaw
npm install -g openclaw@latest
```

![image-20260320172227225](../_assets/images/image-20260320172227225.png)

###### 3、启动openclaw完成配置：

**1.检查openclaw安装版本：openclaw -v**

![image-20260320202559078](../_assets/images/image-20260320202559078.png)

**2. 启动openclaw： openclaw onboard**

![image-20260320202656731](../_assets/images/image-20260320202656731.png)

**3. 一步一步配置openclaw相关参数**

> 暂时先不用配置skill，先能跑起来再说其他配置

**（1）提示选择yes**
**（2）QuickStart**

![image-20260320202946925](../_assets/images/image-20260320202946925.png)

**（3）选择大模型类型：目前小编采用国家超算免费的1千万token，但推荐QWen/minimax, 点击确认即可（需要注册账号登录激活验证）**

###### 4、进入国家超算平台注册

官网地址：https://www.scnet.cn/

![image-20260321211605621](../_assets/images/image-20260321211605621.png)

![image-20260321212028561](../_assets/images/image-20260321212028561.png)

![image-20260321212136224](../_assets/images/image-20260321212136224.png)

###### 5、接入API

接入API地址：https://api.scnet.cn/api/llm/v1

在安装好的OpenClaw设备控制台输入命令

- **MAC/Linxu用户打开终端操作**
- **Windows用户管理员权限打开PowerShell操作**

![image-20260321213740608](../_assets/images/image-20260321213740608.png)

![image-20260321214102492](../_assets/images/image-20260321214102492.png)

![image-20260321214148076](../_assets/images/image-20260321214148076.png)

![image-20260321214328784](../_assets/images/image-20260321214328784.png)

![image-20260321214433084](../_assets/images/image-20260321214433084.png)

![image-20260321214454847](../_assets/images/image-20260321214454847-1774102538010.png)

![image-20260321214643600](../_assets/images/image-20260321214643600.png)

输入模型名称

![image-20260321214708729](../_assets/images/image-20260321214708729.png)

默认回车

![image-20260321214733991](../_assets/images/image-20260321214733991.png)

模型别名留空，这个直接回车就行，不用管

![image-20260321214754923](../_assets/images/image-20260321214754923.png)

 （5）**选择聊天工具选项，可以接入到企业微信，后续就可以通过给企业微信机器人发消息来让他工作，这里先不选：skip for now**

![image-20260321215043126](../_assets/images/image-20260321215043126.png)

（6）默认先不安装相关skill
**Configure skills now? (recommended)：No**

**Enable hooks?：Skip for now**

**Gateway service already installed：Restart**

![image-20260321215207093](../_assets/images/image-20260321215207093.png)

这个时候会自动打开另外一个cmd窗口

![image-20260321215529371](../_assets/images/image-20260321215529371.png)

 **安装完后，就会自动访问：http://127.0.0.1:18789/chat ** **，就可以打开聊天界面对话让它开始工作。**

![image-20260321215930994](../_assets/images/image-20260321215930994.png)

