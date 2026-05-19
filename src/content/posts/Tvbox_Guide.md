---
title: Tvbox使用教程
published: 2025-12-19
updated: 2025-12-19
description: ''
image: ''
tags: [tvbox]
category: '软件'
draft: false 
lang: ''
pinned: false
series: ''
---

# Tvbox简介

TVBox是**一款基于开源项目tvmovie修改的影视APP**，它本身是一个空壳，需要用户自己导入接口才能使用，具有强大的功能和兼容性，完全免费且开源。TVBox可以看作是“猫影视TV”的开源版本，并且完美移植了“猫影视TV”的核心功能。

软件下载：[链接直达](https://github.com/o0HalfLife0o/TVBoxOSC)
安装包的哈希对比对比一下

```
certutil -hashfile TVBox_takagen99_20250706-1456-arm64-generic-java.apk SHA256
```

# tvbox源地址（现成的）

- `http://pandown.pro/tvbox/tvbox.json`
- `https://ghcy.eu.org/https://raw.githubusercontent.com/cyao2q/files/master/m.json`

# tvbox 自定义源地址（手搓）

过程：

1. 使用tvbox配置编辑器，将各个采集站的api，变成tvbox识别的json格式的文件
2. 需要一台服务器搭建http服务，提供json格式的文件访问
3. 在tvbox源地址设置这条服务器的json文件访问地址

## 1. tvbox配置编辑器编辑json文件

- [TVBOX接口配置编辑器](https://www.xyba.cn/tvboxtool)
- [TVBOX接口配置编辑器](https://zhixc.github.io/CatVodTVJsonEditor/)
- [TVBOX接口配置编辑器](https://kvymin.github.io/CatVodTVJsonEditor/)

### XML

1. 访问TVBOX接口配置编辑器
   [![img](https://img.skilladd.org/tvbox/tvbox.png)](https://img.skilladd.org/tvbox/tvbox.png)

复制[采集站](https://lzizy.net/help/)的地址的**xml格式**的地址（更多采集站信息访问[链接直达](https://skilladd.org/2025/04/06/4.影视资源分享/)）
[![img](https://img.skilladd.org/tvbox/tvbox1.png)](https://img.skilladd.org/tvbox/tvbox1.png)

这样就添加好了**一个**TVBOX的源地址了。
[![img](https://img.skilladd.org/tvbox/tvbox8.png)](https://img.skilladd.org/tvbox/tvbox8.png)

### Json

添加第二个[采集站](https://moduzy.com/)的信息，我们点击**采集教程**

[![img](https://img.skilladd.org/tvbox/tvbox9.png)](https://img.skilladd.org/tvbox/tvbox9.png)

复制**json格式**的采集接口的地址

[![img](https://img.skilladd.org/tvbox/tvbox10.png)](https://img.skilladd.org/tvbox/tvbox10.png)

点击 **添加** 的按钮
[![img](https://img.skilladd.org/tvbox/tvbox11.png)](https://img.skilladd.org/tvbox/tvbox11.png)

根据上面依次填入信息，这样就添加好了**两个**采集站的播放源了，需要添加更多的播放源也是相同的操作。
[![img](https://img.skilladd.org/tvbox/tvbox12.png)](https://img.skilladd.org/tvbox/tvbox12.png)

### TVBOX的标题设置

比如需要设置如下图所示的标题
[![img](https://img.skilladd.org/tvbox/tvbox7.png)](https://img.skilladd.org/tvbox/tvbox7.png)

只要在分类中添加，就可以实现。（**如果设置的分类名称和采集站不同是不会显示的**）

[![img](https://img.skilladd.org/tvbox/tvbox13.png)](https://img.skilladd.org/tvbox/tvbox13.png)

### 导出配置

点击“**保存**”-》复制剪贴板的内容，保存一个`tvbox.json`格式的文件
[![img](https://img.skilladd.org/tvbox/tvbox14.png)](https://img.skilladd.org/tvbox/tvbox14.png)

## 2. 搭建http服务

这里我使用[vultr](https://my.vultr.com/)的vps作为演示demo（你也可以在自己的内网部署）

[![img](https://img.skilladd.org/tvbox/tvbox15.png)](https://img.skilladd.org/tvbox/tvbox15.png)

将上面保存的文件（**tvbox.json**）上传到服务器
[![img](https://img.skilladd.org/tvbox/tvbox16.png)](https://img.skilladd.org/tvbox/tvbox16.png)

使用**python3**提供HTTP的服务

```
root@vultr:~# python3 -m http.server 80   
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...

root@vultr:~# sudo nohup python3 -m http.server 80 > /var/log/python-http-server.log 2>&1 &   后台挂起运行
[1] 4595

ps -aux  //查看运行进程信息

kill -9 PID   //结束进程
```

能正常访问到配置的**json**文件。
[![img](https://img.skilladd.org/tvbox/tvbox21.png)](https://img.skilladd.org/tvbox/tvbox21.png)

## 3. tvbox源地址设置

在TVBOX中设置，上面配置好的**json**文件。
[![img](https://img.skilladd.org/tvbox/tvbox17.png)](https://img.skilladd.org/tvbox/tvbox17.png)

等待一会，加载成功了

[![img](https://img.skilladd.org/tvbox/tvbox18.png)](https://img.skilladd.org/tvbox/tvbox18.png)

### 播放源的切换

返回设置，点击**数据源**，这样就可以切换了

[![img](https://img.skilladd.org/tvbox/tvbox19.png)](https://img.skilladd.org/tvbox/tvbox19.png)

[![img](https://img.skilladd.org/tvbox/tvbox20.png)](https://img.skilladd.org/tvbox/tvbox20.png)