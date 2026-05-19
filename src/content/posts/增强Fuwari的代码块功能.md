---
title: 增强Fuwari的代码块功能
published: 2025-09-17
updated: 2025-09-17
description: ''
image: ''
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---

> 使用现在最新的🍥Fuwari博客已经引入了`astro-expressive-code`包，不需要额外安装了，直接使用就完事了
>
> 折叠与行数都已经配置好了，``@expressive-code/plugin-collapsible-sections`` 与 ``@expressive-code/plugin-line-numbers`` 不用额外安装



# 使用格式方法

## 标题

```js  title="标题"
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
```

## 高亮指定行

```js  {2,4-5} ins={3,7}
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 新增/删除指定行

```js   ins={3,7} del={6}
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 高亮块

```js  "a + b" del="let g = 7"
​```js  "a + b" del="let g = 7"
//{2,4-5}高亮 ins={3,7}新增 del={6}删除
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 折叠代码/代码行数

```js   collapse={8-13, 15-16} startLineNumber=7
//collapse={8-13, 15-16} 折叠 startLineNumber=7
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 代码块标识

这是一个`Expressive Code`的插件，增加代码块的语言标识图标

```js title="安装依赖包"
# 使用 npm
npm install @xt0rted/expressive-code-file-icons --save

# 如果用 pnpm（从报错中的 .pnpm 来看可能是你的包管理器）
pnpm add @xt0rted/expressive-code-file-icons
```

这是博主的设置，修改样式后需**删除**项目里的`📁.astro`，并**重启项目**才能看到效果

```js title="astro.config.mjs"  ins={1,10-13}
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";

export default defineConfig({
  // ...
  integrations: [
    // ...
    expressiveCode({
    themes: ["catppuccin-frappe", "light-plus"],
    plugins: [pluginCollapsibleSections(), pluginLineNumbers(),
      pluginFileIcons({
        iconClass: "text-4 w-5 inline mr-1 mb-1",
        titleClass: ""
      })
    ],
  }),
  ]
})
```

:::tip[**提醒**]

不过有些标识图标不适用双主题，比如 Astro
下面是博主的临时解决办法（针对Astro）

:::

```js title="src\components\LightDarkSwitch.svelte" ins={3,22,24-37}
onMount(() => {
	mode = getStoredTheme();
    updateAstroSvg(mode);
	const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
	const changeThemeWhenSchemeChanged: Parameters<
		typeof darkModePreference.addEventListener<"change">
	>[1] = (_e) => {
		applyThemeToDocument(mode);
	};
	darkModePreference.addEventListener("change", changeThemeWhenSchemeChanged);
	return () => {
		darkModePreference.removeEventListener(
			"change",
			changeThemeWhenSchemeChanged,
		);
	};
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
    updateAstroSvg(mode);
}
function updateAstroSvg(mode: LIGHT_DARK_MODE) {
  const spans = document.querySelectorAll('figcaption > .title')
  spans.forEach(span => {
    if (!span || !span.innerHTML.includes('astro')) return

    const paths = span.querySelectorAll('svg > path')
    if (mode === DARK_MODE){
      paths[1].setAttribute('fill', '#fff')
    }
    else{
      paths[1].setAttribute('fill', '#000')
    }
  })
}
```

