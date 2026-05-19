---
title: Spider编写入门指南
published: 2025-12-10
updated: 2025-12-10
description: ''
image: ''
tags: [java,爬虫]
category: '编程'
draft: false 
lang: ''
pinned: false
series: ''
---

# Spider编写入门指南

# 一、介绍

本篇主要整理网络中流传的CatVodSpider的编写方式、数据格式，需要阅读者有Java编程基础。

一句话总结：猫影视/TVBox的自定义Spider是通过加载外部jar，通过反射来实例化jar包中的Spider类，并调用Spider对象下的方法实现的。

本模板项目可以配合任意符合TVBox源导入使用

本项目打包出的jar可以直接导入TVBox使用，**仅供大家进行技术学习和研究，作者不认可、不支持任何侵犯版权、传播不健康信息或其他违反法律法规的行为，请大家在编写或执行爬虫程序之前，务必确保自己拥有目标数据的版权，或已获得了目标网站或App的官方授权。**

# 二、相关基础类



`com.github.catvod.crawler.Spider`是Spider的基类，你需要继承该类，重写（override）其中的核心方法，来编写你的自定义Spider（一个Spider类对应一个站点），自定义的Spider要与Spider基类在同一个包下。

# 三、Spider类下的各方法及返回数据格式



猫影视规则下，Spider下的所有核心方法均返回`String`（json格式的字符串），编写过程中你可能会发现一些不符合Javaer习惯的行为和规范，不过事到如今这套规则已经成了祖宗之法，为了能编写出通用性强的Spider，你需要遵循这些规则。

编写Spider逻辑时，一般做法是：

1. 利用`com.github.catvod.net.OkHttp`工具类下的方法，从源站点中请求数据，并利用Jsoup等库解析出其中的影视相关数据；
2. 利用`com.github.catvod.bean`下的实体类，将相关数据组装为java对象，并最终把所有对象组装为一个`com.github.catvod.bean.Result`对象；
3. 有了`com.github.catvod.bean.Result`对象后，调用该对象下的`string()`来把对象转为json字符串并返回。（有性能洁癖的，也可以使用`com.github.catvod.utils.Json`工具类中的`toJson`方法）。

下面介绍Spider下的各核心方法。

## 1. homeContent



当用户在软件中点选进入某个影视站点时，该方法被调用。方法返回站点的首页数据，包含影视分类数据、影视筛选数据、首页推荐影视数据等。

该方法的参数作用未知，作者没有用到过，可以忽略。

返回的数据格式示例如下：

```
{
	"class": [{   // 分类
		"type_id": "dianying", // 分类id 
		"type_name": "电影" // 分类名
	}, {
		"type_id": "lianxuju",
		"type_name": "连续剧"
	}],
	"filters": { // 筛选
		"dianying": [{ // 分类id 就是上面class中的分类id
			"key": "0", // 筛选key
			"name": "分类", // 筛选名称
			"value": [{ // 筛选选项 
				"n": "全部", // 选项展示的名称
				"v": "dianying" // 选项最终在url中的展现
			}, {
				"n": "动作片",
				"v": "dongzuopian"
			}]
		}],
		"lianxuju": [{
			"key": 0,
			"name": "分类",
			"value": [{
				"n": "全部",
				"v": "lianxuju"
			}, {
				"n": "国产剧",
				"v": "guochanju"
			}, {
				"n": "港台剧",
				"v": "gangtaiju"
			}]
		}]
	},
	"list": [{ // 首页最近更新视频列表
		"vod_id": "1901", // 视频id
		"vod_name": "判决", // 视频名
		"vod_pic": "https:\/\/pic.imgdb.cn\/item\/614631e62ab3f51d918e9201.jpg", // 展示图片
		"vod_remarks": "6.8" // 视频信息 展示在 视频名上方
	}, {
		"vod_id": "1908",
		"vod_name": "移山的父亲",
		"vod_pic": "https:\/\/pic.imgdb.cn\/item\/6146fab82ab3f51d91c01af1.jpg",
		"vod_remarks": "6.7"
	}]
}
```



其中，每个json属性和实体类的对应关系为：

- `class`：`List<com.github.catvod.bean.Class>`
- `filters`：`Map<String, List<com.github.catvod.bean.Filter>>`
- `list`：`List<com.github.catvod.bean.Vod>`

## 2. categoryContent



当用户在某个站点中点击某个影视分类、进行条件筛选、进行翻页动作时，该方法被调用。方法返回一个影视数据列表和相关的分页信息。

该方法的参数列表如下：

- `tid`：影视的分类id，在`homeContent`部分已有提到；
- `pg`：分页的页号，默认为"1"，随每次翻页递增；
- `filter`：是否使用了条件筛选，如果该项为`false`，则可以无视下面的`extend`属性，不处理条件筛选逻辑；
- `extend`：用户进行条件筛选时，该参数为“filter key”和“filter value”的键值对（关于filter，已经在`homeConent`中介绍过了）。

返回的数据格式示例如下：

```
{
	"page": 1, // 当前页
	"pagecount": 2, // 总共几页
	"limit": 60, // 每页几条数据
	"total": 120, // 总共多少调数据
	"list": [{ // 视频列表 下面的视频结构 同上面homeContent中的
		"vod_id": "1897",
		"vod_name": "北区侦缉队",
		"vod_pic": "https:\/\/pic.imgdb.cn\/item\/6145d4b22ab3f51d91bd98b6.jpg",
		"vod_remarks": "7.3"
	}, {
		"vod_id": "1879",
		"vod_name": "浪客剑心 最终章 人诛篇",
		"vod_pic": "https:\/\/pic.imgdb.cn\/item\/60e3f37e5132923bf82ef95e.jpg",
		"vod_remarks": "8.0"
	}]
}
```



其中，每个json属性和实体类的对应关系为：

- `list`：`List<com.github.catvod.bean.Vod>`

需尽量保证分页信息完整、正确，如若无法获取到完整的分页信息，至少应将`limit`设置为`list`列表的长度，将`pagecount`和`total`设置为一个足够大的数值（如`Integer.MAX_VALUE`），以确保软件通过此数据能够进行正常的分页动作。

## 3. detailContent



当用户点选某个影视，进入影视详情页时，此方法被调用。方法返回影视的详情信息。

该方法的参数列表如下：

- `ids`：影视id。虽然不知道为什么是一个List，一般取第一个元素来用即可。

返回的数据格式示例如下：

```
{
	"list": [{
		"vod_id": "1902",
		"vod_name": "海岸村恰恰恰",
		"vod_pic": "https:\/\/pic.imgdb.cn\/item\/61463fd12ab3f51d91a0f44d.jpg",
		"type_name": "剧情",
		"vod_year": "2021",
		"vod_area": "韩国",
		"vod_remarks": "更新至第8集",
		"vod_actor": "申敏儿,金宣虎,李相二,孔敏晶,徐尚沅,禹美华,朴艺荣,李世亨,边胜泰,金贤佑,金英玉",
		"vod_director": "柳济元",
		"vod_content": "海岸村恰恰恰剧情:　　韩剧海岸村恰恰恰 갯마을 차차차改编自2004年的电影《我的百事通男友洪班长》，海岸村恰恰恰 갯마을 차차차讲述来自大都市的牙医（申敏儿 饰）到充满人情味的海岸村开设牙医诊所，那里住着一位各方面都",
        // 播放源 多个用$$$分隔
		"vod_play_from": "qiepian$$$yun3edu", 
        // 播放列表 注意分隔符 分别是 多个源$$$分隔，源中的剧集用#分隔，剧集的名称和地址用$分隔
		"vod_play_url": "第1集$1902-1-1#第2集$1902-1-2#第3集$1902-1-3#第4集$1902-1-4#第5集$1902-1-5#第6集$1902-1-6#第7集$1902-1-7#第8集$1902-1-8$$$第1集$1902-2-1#第2集$1902-2-2#第3集$1902-2-3#第4集$1902-2-4#第5集$1902-2-5#第6集$1902-2-6#第7集$1902-2-7#第8集$1902-2-8" 
	}]
}
```



其中，每个json属性和实体类的对应关系为：

- `list`：`List<com.github.catvod.bean.Vod>`

（就获取单个影片详情这个场景来说，`list`中只包含一个影片对象即可。）

影片的一些元信息（导演、演员、年份等）可以省略，但至少应确保影片id（`vod_id`），播放源（`vod_play_from`）和播放列表（`vod_play_url`）有数据。

## 4. searchContent



当用户输入关键字进行影视搜索时，该方法会被调用。方法返回一个影视列表。

注意，该方法有参数不同的重载，都需要进行重写，但逻辑一般使用同一个，调用相同的代码即可，

该方法的参数列表如下：

- `key`：搜索关键字；
- `quick`：是否使用了快速搜索。是TVBox中使用到的参数，重要性较低，可以忽略；
- `pg`：分页的页号。固定为"1"，一般在搜索中无需支持翻页，可以忽略。

返回的数据格式示例如下：

```
{
	"list": [{ // 视频列表 下面的视频结构 同上面homeContent中的
		"vod_id": "1606",
		"vod_name": "陪你一起长大",
		"vod_pic": "https:\/\/img.aidi.tv\/img\/upload\/vod\/20210417-1\/e27d4eb86f7cde375171dd324b2c19ae.jpg",
		"vod_remarks": "更新至第37集"
	}]
}
```



其中，每个json属性和实体类的对应关系为：

- `list`：`List<com.github.catvod.bean.Vod>`

## 5. playerContent



用户在影片详情页中点击其中一个剧集，进行影片播放时，该方法被调用。方法返回一个可播放的网络媒体地址（mp4、m3u8等）。

该方法的参数列表如下：

- `flag`：含义未知，作者没用到过，可以忽略；
- `id`：剧集id。在`detailContent`部分中，有列出影片的`vod_play_url`属性，比如`“第1集$1902-1-1#第2集$1902-1-2”`，“第1集”的剧集id就是“1902-1-1”，“第2集”的剧集id就是“1902-1-2”（有的作者喜欢把剧集id直接设置为该剧集播放页面的url，这样获取播放地址比较方便）
- `vipFlags`: 含义未知，作者没用到过，暂时忽略，用到时再考虑完善这个吧。

只有一个`url`属性需要返回，就不列json数据示例了，返回`Result.get().url(url).string()`即可。

# 四、打包和配置



实现了上述核心方法后，Spider就可以打包使用了。

直接调用gradle的jar就能打包了，打包后，你会在build目录下得到一个`spider.jar`，同时得到一个该jar包的md5值。

接下来是根据猫影视规则，编写一个可以被软件导入的json配置文件，并把jar包的地址设置在里面。

以下是一个简洁的示例（假设我们为2个站点写了Spider类，分别为“YingShi01”和“YingShi02”，更多的站点就以此类推）：

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



其中：

- `spider`：我们的jar包地址，除了网络地址之外，也可以设置为“file:///”开头的本地文件地址。至于md5部分，可以设置也可以省略，但推荐设置，可以提升性能。

- ```
  sites
  ```

  ：显示在软件中的影视站点列表

  - `key`：站点key。可以任意设置，但要保证每个站点的key是唯一的；
  - `name`：站点名称。可以任意设置；
  - `type`：固定为3，对应的就是我们编写的Spider类型；
  - `api`：用于反射调用Spider类。固定设置为“csp_类名”，比如Spider类名为“YingShi01”，就设置为“csp_YingShi01”；
  - `searchable`：是否支持影视搜索。如果不支持影视搜索，可以设置为0，软件在搜索影视时就会略过该站点；
  - `spider`：如果该站点需要使用独立的jar包，而非上面统一设置的spider，可以指定该属性。

另外，上面的一些资料中包含了带有注释的json，但仅仅是为了展示方便，在实际情况中大家不要在json文件中书写注释！json是一种数据交换格式，只应该包含数据结构（数组和对象），不应该包含非数据内容。虽然带有注释的json仍可被一些json库解析，但这归根结底是不符合其设计规范的，可能会导致问题。