---
title: TVBOX：DIY 资源库（新手指南）
published: 2025-12-15
updated: 2025-12-15
description: ''
image: ''
tags: [tvbox,资源仓]
category: 'TVBox'
draft: false 
lang: ''
pinned: false
series: ''
---

如何快速简单的制作一个影视仓资源合成库，作为热爱写笔记的小编，在这里分享一下关于个人资源库构建方法的文章。实际上，这个过程相对简单。每个TV源码中都带有相应的示例，只需您稍加细心，依据这些演示示例照虎画猫进行复制即可。言归正传，下面将为大家呈现详细的教程。

> 小编仅展示代码示例，而不包括具体的资源内容。关于资源库的构建，网络上有许多免费的资源可供参考，有需要的朋友可以根据教程自行搭建自己的资源库。

### 详情版

影视仓里的功能组成，依次为爬虫文件地址、前端背景、影视资源、直播源、播放器标签、解析接口、IJK播放器解码、广告拦截，以上都是必备的基础功能，还有一些其他的增强功能就按照自己的需求自定义。

> 影视仓里的功能组成，依次为爬虫文件地址、前端背景、影视资源、直播源、播放器标签、解析接口、IJK播放器解码、广告拦截，以上都是必备的基础功能，还有一些其他的增强功能就按照自己的需求自定义。

```js title=“demo.json”
{
  "spider": "https://tvbox.com/custom_spider.jar", //自己的爬虫文件后台地址
  "wallpaper": "https://tvbox.com/壁纸.png",  //前端背景的图片地址
  "sites": [
	{
	  "key": "茅台", //可默认也可自定义
	  "name": "茅台资源", //前端显示的资源名称自定义
	  "type": 3, //Type 0-xml 1-json 2-爬虫源 3-自定义爬虫 4-服务器爬虫
	  "api": "csp_spider", //默认走爬虫线路都是这个记号不可修改,api必须是csp_开头
	  "searchable": 1,  //可搜索? 0-不可以 1-可以
	  "quickSearch": 1, //可快速搜索? 0-不可以 1-可以
	  "filterable": 1,  //可筛选? 0-不可以 1-可以
	  "ext": "https://tvbox.com/api.php/app/" //爬虫模式的对接地址
	}, //注意增加资源要在逗号之后
	{
	  "key": "红牛",  
	  "name": "红牛资源", //前端显示的资源名称自定义
	  "type": 0, //Type 0-xml 1-json 2-爬虫源 3-自定义爬虫 4-服务器爬虫
	  "api": "https://www.hongniuzy2.com/api.php/provide/vod/at/xml/",//默认苹果CMS资源采集站的地址
	  "playUrl": "https://www.hnjiexi.com/m3u8/?url=", //资源指定JSON解析接口，一般不填写，最好是不要填写
	  "searchable": 1,  ////可搜索? 0-不可以 1-可以
	  "quickSearch": 1, //可筛选? 0-不可以 1-可以
	  "filterable": 1,  //可筛选? 0-不可以 1-可以
	  "categories": [ "电影","剧集","综艺","动漫","短剧"] //可以在前端显示的分类 注意结尾不要带逗号
	},
	//这个地方可以继续添加资源，将你从别处复制过来的代码粘贴到这里即可
	{
	 "key": "push_agent",
	 "name": "前端自定义播放功能", //前端自定义播放链接功能
	 "type": 3,
	 "api": "csp_Push",
	 "searchable": 0,
	 "quickSearch": 0,
	 "changeable": 0,
	 "ext": "http://127.0.0.1:9978/file/MeowTV/token.txt+4k|auto|fhd"
	} //注意结尾不要带逗号
  ],
  "lives": [
		{
			"name": "live", //名字自定义
			"type": 0,
			"url": "http://tvbox.com/zhibo.txt", //这里填写直播源的地址（注意要txt结尾的链接）
			"playerType": 1,
			"ua": "okhttp/3.15",
			"epg": "http://epg.112114.xyz/?ch={name}&amp;date={date}",
			"logo": "https://epg.112114.xyz/logo/{name}.png"
		}
	],
  "flags":["lzm3u8","youku","qq","iqiyi","qiyi","letv","sohu","tudou","mgtv","bilibili"], //添加播放器标识用逗号分割

  "parses":[
			{"name": "聚合","type": 3,"url": "Demo"}, //类型
			{"name": "轮询","type": 2,"url": "Sequence"}, //类型
			{"name": "1号线","type": 0,"url": "https://json解析地址/?url="}, //支持json和普通接口同时使用
			{"name": "2号线","type": 0,"url": "https://普通解析地址/?url="}, //解析接口可以无限添加
			{"name": "3号线","type": 0,"url": "https://无限解析地址/?url="}  //注意结尾不要带逗号
],
"ijk": [{"group": "软解码","options": [
{"category": 4,"name": "opensles","value": "0"}, 
{"category": 4,"name": "overlay-format","value": "842225234"}, 
{"category": 4,"name": "framedrop","value": "1"}, 
{"category": 4,"name": "soundtouch","value": "1"}, 
{"category": 4,"name": "start-on-prepared","value": "1"}, 
{"category": 1,"name": "http-detect-range-support","value": "0"}, 
{"category": 1,"name": "fflags","value": "fastseek"}, 
{"category": 2,"name": "skip_loop_filter","value": "48"}, 
{"category": 4,"name": "reconnect","value": "1"}, 
{"category": 4,"name": "max-buffer-size","value": "5242880"}, 
{"category": 4,"name": "enable-accurate-seek","value": "0"}, 
{"category": 4,"name": "mediacodec","value": "0"}, 
{"category": 4,"name": "mediacodec-auto-rotate","value": "0"}, 
{"category": 4,"name": "mediacodec-handle-resolution-change","value": "0"}, 
{"category": 4,"name": "mediacodec-hevc","value": "0"}, 
{"category": 1,"name": "dns_cache_timeout","value": "600000000"}]}, 
{"group": "硬解码","options": [
{"category": 4,"name": "opensles","value": "0"}, 
{"category": 4,"name": "overlay-format","value": "842225234"}, 
{"category": 4,"name": "framedrop","value": "1"}, 
{"category": 4,"name": "soundtouch","value": "1"}, 
{"category": 4,"name": "start-on-prepared","value": "1"}, 
{"category": 1,"name": "http-detect-range-support","value": "0"}, 
{"category": 1,"name": "fflags","value": "fastseek"}, 
{"category": 2,"name": "skip_loop_filter","value": "48"}, 
{"category": 4,"name": "reconnect","value": "1"}, 
{"category": 4,"name": "max-buffer-size","value": "5242880"}, 
{"category": 4,"name": "enable-accurate-seek","value": "0"}, 
{"category": 4,"name": "mediacodec","value": "1"},
{"category": 4,"name": "mediacodec-auto-rotate","value": "1"}, 
{"category": 4,"name": "mediacodec-handle-resolution-change","value": "1"}, 
{"category": 4,"name": "mediacodec-hevc","value": "1"}, 
{"category": 1,"name": "dns_cache_timeout","value": "600000000"}]}], 
"ads": ["屏蔽广告地址1","屏蔽广告地址2","屏蔽广告地址13"]
}...
```

到这里简单的制作一个自己的影视仓资源合成库就完成了，这里就不提供api.json文件和custom_spider.jar文件了，TVBOX或绿豆TV源码应该都有这个示例文件，如意版本的后台应用里也自带一键生成的影视仓功能，其他也没啥可说的了，自己慢慢的研究哈。

### 极简版

如果是直接使用影视提供的采集接口，例如：无尽，红牛，茅台等资源采集站，那这个配置就非常的简单

```js title="极简版.json"
{
    "sites": [
      {
        "key": "茅台",
        "name": "茅台资源",
        "type": 1,
        "api": "https://caiji.maotaizy.cc/api.php/provide/vod/at/josn/",
		"playUrl": "https://mtjiexi.cc:966/?url=",  // 解析接口最好是不用填写
        "searchable": 1,
        "quickSearch": 1,
        "filterable": 1,
        "categories": [
          "电影",
          "连续剧",
          "综艺片",
          "动漫"
        ]
      },
	{
      "key": "新浪",
      "name": "新浪资源",
      "type": 1,
      "api": "https://api.xinlangapi.com/xinlangapi.php/provide/vod/",
      "searchable": 1,
      "quickSearch": 1,
      "filterable": 1,
      "categories": [
        "电影",
        "电视剧",
        "综艺",
        "动漫",
		"大陆剧",
        "动作片",
        "爱情片",
        "韩剧"
      ]
    }
  ]
}
```

### 总结

如果想要自定义采集站，那么需要自行编写对应网站的爬虫，所谓的本地`jar包`也就是java爬虫所打包构建的

```
{
    "spider": "http://你的网站地址/spider.jar;md5;该jar包的md5值",
    "sites": [
        {
            "key": "YingShi01",
            "name": "影视01",
            "type": 3,
            "api": "csp_YingShi01",
            "searchable": 1
        },
        {
            "key": "YingShi02",
            "name": "影视02",
            "type": 3,
            "api": "csp_YingShi02",
            "searchable": 1,
            "spider": "http://你的网站地址/xxx.jar;md5;该jar包的md5值"
        }
    ]
}
```

我个人认为自己私下弄弄玩还可以，毕竟现在网络上已经有很多大佬已经造好了轮子，我们直接使用就行了

这里给大家提供一个综合源：https://upld.zone.id/uploads/q9iq9e5iq/tvboxlvse.json