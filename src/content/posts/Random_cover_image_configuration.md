---
title: 随机封面图配置
published: 2025-11-08
updated: 2025-11-08
description: ''
image: 'api'
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---

# 前言

写文章配插图，文章中的图片好说，这个封面就不太行了，好多时候都会忘记这回事，毕竟写文章的软件是`Typora` 写完我就直接上传了，谁还管封面啊！以前采用的`WordPress` 会自动把文章的第一张图片设置为封面，但是`Astro Fuwari` 没有自动封面这个功能，因此我写下这篇文章作为参考。

两种方案，一种是修改地方少，一种是模块化设计(大改)

# 方案一

修改 `scripts/new-post.js` 文件，为每篇新文章添加从 boxmoe API 获取的随机图片作为封面。

当用户通过`pnpm new-post <fileName>` 时，在新创建的文章 front-matter 中，将 `image` 字段的值设置为这个随机图片 API 地址

```js title="new-post.js" ins={15-20,57}
/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

// Function to get random image from boxmoe API with unique parameter
function getRandomImage() {
	// Generate a random number to make each image URL unique
	const randomParam = Math.random().toString(36).substring(2, 15);
	return `https://api.boxmoe.com/random.php?size=large&t=${randomParam}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
	process.exit(1); // Terminate the script and return error code 1
}

let fileName = args[0];

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

const targetDir = "./src/content/posts/";
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists `);
	process.exit(1);
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}

const content = `---
title: ${args[0]}
published: ${getDate()}
updated: ${getDate()}
description: ''
image: '${getRandomImage()}'
tags: []
category: ''
draft: false 
lang: ''
pinned: false
series: ''
---
`;

fs.writeFileSync(path.join(targetDir, fileName), content);

console.log(`Post ${fullPath} created`);
```

# 方案二

随机封面图功能允许文章使用 API 自动获取随机图片作为封面图。当 API 请求失败时，系统会自动切换到备用图片，确保封面图始终能够正常显示。此功能特别适合想要快速为文章添加封面图的用户。

## 基础配置

```js title="基础配置"
export const coverImageConfig: CoverImageConfig = {
  // 随机封面图功能开关
  enable: true,
  // 封面图API列表
  apis: [
    "https://t.alcy.cc/pc",
    "https://www.dmoe.cc/random.php",
    "https://uapis.cn/api/v1/random/image?category=acg&type=pc",
  ],
  // 备用图片路径
  fallback: "/assets/images/cover.webp",
  
  // 加载指示器配置
  loading: {
    image: "/assets/images/loading.gif",
    backgroundColor: "#fefefe",
  },
  
  // 水印配置
  watermark: {
    enable: true,
    text: "Random Cover",
    position: "bottom-right",
    opacity: 0.6,
    fontSize: "0.75rem",
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
```

## 配置选项详解

### 基础配置

| 选项       | 类型       | 说明                              | 必填 | 默认值 |
| :--------- | :--------- | :-------------------------------- | :--- | :----- |
| `enable`   | `boolean`  | 随机封面图功能开关                | 是   | `true` |
| `apis`     | `string[]` | 封面图API列表，系统会依次尝试     | 是   | `[]`   |
| `fallback` | `string`   | 备用图片路径（API全部失败时使用） | 否   | -      |

### 功能开关说明

- **`enable: true`**：启用随机封面图功能，文章使用 `image: "api"` 时会尝试从 API 获取图片
- **`enable: false`**：禁用随机封面图功能，即使文章设置了 `image: "api"`，也不会显示封面图（也不会显示备用图）

### API 列表配置

系统会按照 `apis` 数组的顺序依次尝试每个 API：



```typescript
apis: [
  "https://api1.example.com/image",  // 首先尝试这个
  "https://api2.example.com/image",  // 如果失败，尝试这个
  "https://api3.example.com/image",  // 如果还失败，尝试这个
]
```

**API 选择逻辑：**

1. 系统按顺序尝试每个 API
2. 如果某个 API 失败，自动尝试下一个
3. 如果所有 API 都失败，使用备用图片（`fallback`）
4. 失败的 API 会被记录到 `localStorage`，避免下次重复请求（F5 刷新会清除记录）

### 备用图片配置

```typescript
fallback: "/assets/images/cover.webp"
```

- 路径相对于 `public` 目录
- 支持相对路径（如 `/assets/images/cover.webp`）
- 当所有 API 都失败时，使用此图片作为封面
- 使用备用图片时，水印文字会自动更新为 "Image API Error"

## 加载指示器配置

### 配置选项

| 选项              | 类型     | 说明                                     | 必填 | 默认值                         |
| :---------------- | :------- | :--------------------------------------- | :--- | :----------------------------- |
| `image`           | `string` | 自定义加载图片路径（相对于 public 目录） | 否   | `"/assets/images/loading.gif"` |
| `backgroundColor` | `string` | 加载指示器背景颜色                       | 否   | `"#fefefe"`                    |

### 使用示例

```typescript
loading: {
  image: "/assets/images/my-loading.gif",  // 自定义加载 GIF
  backgroundColor: "#ffffff",                // 白色背景（与 GIF 背景色一致）
}
```

### 注意事项

- **背景颜色匹配**：`backgroundColor` 应该与加载 GIF 的背景色一致，避免在暗色模式下显得突兀
- **图片路径**：路径相对于 `public` 目录，不需要包含 `public`
- **只对远程 API 图片生效**：本地图片不会显示加载指示器

## 水印配置

### 配置选项

| 选项              | 类型      | 说明              | 必填 | 默认值                 |
| :---------------- | :-------- | :---------------- | :--- | :--------------------- |
| `enable`          | `boolean` | 水印开关          | 是   | `true`                 |
| `text`            | `string`  | 水印文本          | 否   | `"Random Cover"`       |
| `position`        | `string`  | 水印位置          | 否   | `"bottom-right"`       |
| `opacity`         | `number`  | 水印透明度（0-1） | 否   | `0.6`                  |
| `fontSize`        | `string`  | 字体大小          | 否   | `"0.75rem"`            |
| `color`           | `string`  | 文字颜色          | 否   | `"#ffffff"`            |
| `backgroundColor` | `string`  | 背景颜色          | 否   | `"rgba(0, 0, 0, 0.5)"` |

### 水印位置选项

| 位置值           | 说明   | 移动端显示           | 桌面端显示 |
| :--------------- | :----- | :------------------- | :--------- |
| `"top-left"`     | 左上角 | 左上角               | 左上角     |
| `"top-right"`    | 右上角 | 右上角               | 右上角     |
| `"bottom-left"`  | 左下角 | 左上角（避免被裁剪） | 左下角     |
| `"bottom-right"` | 右下角 | 右上角（避免被裁剪） | 右下角     |
| `"center"`       | 居中   | 居中                 | 居中       |

**注意**：`bottom-left` 和 `bottom-right` 在移动端会自动调整到顶部显示，避免水印被裁剪。

### 水印文字规则

- **API 成功时**：显示配置的 `text`（默认 "Random Cover"）
- **API 失败时**：自动更新为 "Image API Error"
- **仅对远程 API 图片显示**：本地图片不显示水印

### 使用示例

```typescript
watermark: {
  enable: true,
  text: "随机封面",           // 中文水印
  position: "bottom-right",   // 右下角
  opacity: 0.8,               // 更高透明度
  fontSize: "0.875rem",       // 稍大字体
  color: "#ff0000",           // 红色文字
  backgroundColor: "rgba(255, 255, 255, 0.9)", // 白色半透明背景
}
```

## 代码修改

### 新建src\config\coverImageConfig.ts

```js title="src\config\coverImageConfig.ts"
import type { CoverImageConfig } from "../types/config";

/**
 * 文章随机封面图配置
 *
 * 使用说明：
 * 1. 在文章的 Frontmatter 中添加 image: "api" 即可使用随机图功能
 * 2. 系统会依次尝试所有配置的 API，全部失败后使用备用图片
 * 3. 如果 enable 为 false，则直接不显示封面图（也不会显示备用图）
 *
 * // 文章 Frontmatter 示例：
 * ---
 * title: 文章标题
 * image: "api"
 * ---
 */
export const coverImageConfig: CoverImageConfig = {
	// 随机封面图功能开关
	enable: true,
	// 封面图API列表
	apis: [
		"https://t.alcy.cc/pc",
		"https://www.dmoe.cc/random.php",
		"https://uapis.cn/api/v1/random/image?category=acg&type=pc",
	],
	// 备用图片路径
	fallback: "/assets/images/cover.webp",

	/**
	 * 加载指示器配置
	 * - 自定义加载图片和背景色，用于在图片加载过程中显示
	 * - 如果不配置，将使用默认的 loading.gif 和 #fefefe 背景色
	 */
	loading: {
		// 自定义加载图片路径（相对于 public 目录）
		image: "/assets/images/loading.gif",
		// 加载指示器背景颜色，应与加载图片的背景色一致，避免在暗色模式下显得突兀
		backgroundColor: "#fefefe",
	},

	/**
	 * 水印配置
	 * - 仅在随机图API成功加载时显示水印
	 * - 当使用备用图片时，水印文字会自动更新为 "Image API Error"
	 * - 移动端会自动调整位置（bottom位置会显示在top，避免被裁剪）
	 */
	watermark: {
		// 水印开关
		enable: true,
		// 水印文本
		text: "鹏星",
		/**
		 * 水印位置
		 * - "top-left": 左上角
		 * - "top-right": 右上角
		 * - "bottom-left": 左下角（移动端显示在左上角，桌面端显示在左下角）
		 * - "bottom-right": 右下角（移动端显示在右上角，桌面端显示在右下角）
		 * - "center": 居中
		 */
		position: "bottom-right",
		// 水印透明度
		opacity: 0.6,
		// 字体大小
		fontSize: "0.75rem",
		// 字体颜色
		color: "#ffffff",
		// 背景颜色
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
};

```

### 新增src\types\config.ts中coverImageConfig类型

```js title="src\types\config.ts"
// 。。。。省略

export type CoverImageConfig = {
	enable: boolean; // 是否启用随机图功能
	apis: string[]; // 随机图API列表，支持 {seed} 占位符，会替换为文章slug或时间戳
	fallback?: string; // 当API请求失败时的备用图片路径
	// 加载指示器配置
	loading?: {
		image?: string; // 自定义加载图片路径（相对于public目录），默认 "/assets/images/loading.gif"
		backgroundColor?: string; // 加载指示器背景颜色，默认与loading.gif背景色一致 (#fefefe)
	};
	watermark?: {
		enable: boolean; // 是否显示水印
		text?: string; // 水印文本，默认为"随机图"
		position?:
			| "top-left"
			| "top-right"
			| "bottom-left"
			| "bottom-right"
			| "center"; // 水印位置
		opacity?: number; // 水印透明度 0-1，默认0.6
		fontSize?: string; // 字体大小，默认"0.75rem"
		color?: string; // 文字颜色，默认为白色
		backgroundColor?: string; // 背景颜色，默认为半透明黑色
	};
};
```

### 新建src\utils\image-utils.ts

```js title="src\utils\image-utils.ts"
import { coverImageConfig } from "@/config/coverImageConfig";

/**
 * 处理文章封面图
 * 当image字段为"api"时，从配置的随机图API获取图片
 * @param image - 文章frontmatter中的image字段值
 * @param seed - 用于生成随机图的种子（通常使用文章slug或id）
 * @returns 处理后的图片URL
 */
export async function processCoverImage(
	image: string | undefined,
	seed?: string,
): Promise<string> {
	// 如果image不存在或为空，直接返回
	if (!image || image === "") {
		return "";
	}

	// 如果image不是"api"，直接返回原始值
	if (image !== "api") {
		return image;
	}

	// 如果未启用随机图功能，直接返回空字符串（不显示封面，也不显示备用图）
	if (
		!coverImageConfig.enable ||
		!coverImageConfig.apis ||
		coverImageConfig.apis.length === 0
	) {
		return "";
	}

	try {
		// 随机选择一个API
		const randomApi =
			coverImageConfig.apis[
				Math.floor(Math.random() * coverImageConfig.apis.length)
			];

		// 生成seed值：使用文章slug或时间戳
		const seedValue = seed || Date.now().toString();

		// 如果API中包含{seed}占位符，替换它
		let apiUrl = randomApi.replace(/{seed}/g, seedValue);

		// 如果API中没有{seed}占位符，需要添加随机参数确保每篇文章获取不同图片
		if (!randomApi.includes("{seed}")) {
			// 将seed转换为数字hash（确保每个不同的slug产生不同的hash）
			const hash = seedValue.split("").reduce((acc, char) => {
				return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
			}, 0);

			// 添加查询参数来确保每篇文章获取不同的图片
			const separator = apiUrl.includes("?") ? "&" : "?";
			// 使用hash确保每篇文章有不同的URL（稳定且唯一，基于文章slug）
			// 注意：如果API不支持查询参数来获取不同图片，可能需要配置支持seed占位符的API
			apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
		}

		// 在构建时直接返回API URL（客户端会请求）
		// 注意：如果API返回的是JSON格式，需要特殊处理
		return apiUrl;
	} catch (error) {
		console.warn("Failed to process random image API:", error);
		// 即使出错，如果enable为false也不返回fallback，直接返回空字符串
		if (!coverImageConfig.enable) {
			return "";
		}
		return coverImageConfig.fallback || "";
	}
}

/**
 * 同步版本（用于不需要异步的场景）
 * 当image字段为"api"时，返回第一个API URL，客户端会依次尝试所有API
 */
export function processCoverImageSync(
	image: string | undefined,
	seed?: string,
): string {
	// 如果image不存在或为空，直接返回
	if (!image || image === "") {
		return "";
	}

	// 如果image不是"api"，直接返回原始值
	if (image !== "api") {
		return image;
	}

	// 如果未启用随机图功能，直接返回空字符串（不显示封面，也不显示备用图）
	if (
		!coverImageConfig.enable ||
		!coverImageConfig.apis ||
		coverImageConfig.apis.length === 0
	) {
		return "";
	}

	try {
		// 返回第一个API，客户端脚本会依次尝试所有API
		const firstApi = coverImageConfig.apis[0];

		// 生成seed值：使用文章slug或时间戳
		const seedValue = seed || Date.now().toString();

		// 如果API中包含{seed}占位符，替换它
		let apiUrl = firstApi.replace(/{seed}/g, seedValue);

		// 如果API中没有{seed}占位符，需要添加随机参数确保每篇文章获取不同图片
		if (!firstApi.includes("{seed}")) {
			// 将seed转换为数字hash（确保每个不同的slug产生不同的hash）
			const hash = seedValue.split("").reduce((acc, char) => {
				return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
			}, 0);

			// 添加查询参数来确保每篇文章获取不同的图片
			const separator = apiUrl.includes("?") ? "&" : "?";
			// 使用hash确保每篇文章有不同的URL（稳定且唯一，基于文章slug）
			// 注意：如果API不支持查询参数来获取不同图片，可能需要配置支持seed占位符的API
			apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
		}

		return apiUrl;
	} catch (error) {
		console.warn("Failed to process random image API:", error);
		// 即使出错，如果enable为false也不返回fallback，直接返回空字符串
		if (!coverImageConfig.enable) {
			return "";
		}
		return coverImageConfig.fallback || "";
	}
}

/**
 * 生成所有API URL列表（用于客户端重试）
 */
export function generateApiUrls(seed?: string): string[] {
	if (
		!coverImageConfig.enable ||
		!coverImageConfig.apis ||
		coverImageConfig.apis.length === 0
	) {
		return [];
	}

	const seedValue = seed || Date.now().toString();
	const hash = seedValue.split("").reduce((acc, char) => {
		return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
	}, 0);

	return coverImageConfig.apis.map((api) => {
		let apiUrl = api.replace(/{seed}/g, seedValue);

		if (!api.includes("{seed}")) {
			const separator = apiUrl.includes("?") ? "&" : "?";
			apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
		}

		return apiUrl;
	});
}

```

### 新建src\components\misc\RandomCoverImage.astro

```js title="src\components\misc\RandomCoverImage.astro"
---
import { Image } from "astro:assets";
import * as path from "node:path";
import { coverImageConfig } from "@/config/coverImageConfig";
import { generateApiUrls } from "@/utils/image-utils";
import { url } from "@/utils/url-utils";

interface Props {
	id?: string;
	src: string;
	class?: string;
	alt?: string;
	position?: string;
	basePath?: string;
	seed?: string; // 用于生成随机图API的种子（文章slug）
	preview?: boolean; // 是否是预览模式（文章列表页），true为预览模式（小尺寸），false为详情页（大尺寸）
	fallback?: string; // 图片加载失败时的备用图片
}

const {
	id,
	src,
	alt,
	position = "center",
	basePath = "/",
	seed,
	preview = false,
	fallback,
} = Astro.props;
const className = Astro.props.class;

const isLocal = !(
	src.startsWith("/") ||
	src.startsWith("http") ||
	src.startsWith("https") ||
	src.startsWith("data:")
);
const isPublic = src.startsWith("/");

// 检查是否是随机图API（包含query参数v=）
const isRandomApiImage =
	(src.startsWith("http://") || src.startsWith("https://")) &&
	src.includes("?v=");

// TODO temporary workaround for images dynamic import
// https://github.com/withastro/astro/issues/3373
// biome-ignore lint/suspicious/noImplicitAnyLet: <check later>
let img;
if (isLocal) {
	const files = import.meta.glob<ImageMetadata>("../../**", {
		import: "default",
	});
	let normalizedPath = path
		.normalize(path.join("../../", basePath, src))
		.replace(/\\/g, "/");
	const file = files[normalizedPath];
	if (!file) {
		console.error(
			`\n[ERROR] Image file not found: ${normalizedPath.replace("../../", "src/")}`,
		);
	}
	img = await file();
}
// 如果是随机图API，生成所有API URL列表用于客户端重试
let allApiUrls: string[] = [];
if (
	isRandomApiImage &&
	coverImageConfig.enable &&
	coverImageConfig.apis &&
	coverImageConfig.apis.length > 0
) {
	allApiUrls = generateApiUrls(seed);
}

// 确定fallback图片路径
let fallbackSrc = "";
if (isRandomApiImage) {
	if (coverImageConfig.enable) {
		fallbackSrc = fallback || coverImageConfig.fallback || "";
	}
} else {
	fallbackSrc = fallback || "";
}

// 处理fallback URL
const getFallbackUrl = (src: string): string => {
	if (!src) return "";
	if (src.startsWith("http://") || src.startsWith("https://")) {
		return src;
	}
	if (src.startsWith("/")) {
		return url(src);
	}
	return url(`/${src}`);
};

// 图片样式
const imageClass = "w-full h-full object-cover";
const imageStyle = `object-position: ${position || "center"}; image-rendering: -webkit-optimize-contrast;`;

// 水印配置
const watermark = coverImageConfig.watermark;
const showWatermark = isRandomApiImage && watermark?.enable;

// 生成水印位置样式和类名
const getWatermarkStyles = (
	pos?: string,
): { classes: string; styles: string } => {
	const position = pos || "bottom-right";
	let classes = "";
	let styles = "";

	switch (position) {
		case "top-left":
			classes = "top-2 left-2";
			break;
		case "top-right":
			classes = "top-2 right-2";
			break;
		case "bottom-left":
			classes = "top-2 left-2 md:top-auto md:bottom-2 md:left-2";
			break;
		case "bottom-right":
			classes = "top-2 right-2 md:top-auto md:bottom-2 md:right-2";
			break;
		case "center":
			classes = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
			break;
		default:
			classes = "top-2 right-2 md:top-auto md:bottom-2 md:right-2";
	}

	styles = `padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: ${watermark?.fontSize || "0.75rem"}; color: ${watermark?.color || "#ffffff"}; background-color: ${watermark?.backgroundColor || "rgba(0, 0, 0, 0.4)"}; opacity: ${watermark?.opacity || 0.6}; pointer-events: none; z-index: 10; white-space: nowrap; user-select: none;`;

	return { classes, styles };
};

const watermarkStyles = showWatermark
	? getWatermarkStyles(watermark?.position)
	: { classes: "", styles: "" };
---

<div id={id} class:list={[
  className,
  'overflow-hidden relative',
  preview ? 'min-h-[150px] md:min-h-0' : 'min-h-[300px]'
]}> 
  <!-- 加载指示器：只对随机图API显示 -->
  {isRandomApiImage && (
    <div 
      class="image-loading-indicator absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-300"
      style={`background-color: ${coverImageConfig.loading?.backgroundColor || '#fefefe'};`}
    >
      <img 
        src={url(coverImageConfig.loading?.image || "/assets/images/loading.gif")} 
        alt="Loading..." 
        class="w-24 h-24 md:w-32 md:h-32 opacity-80" 
      />
    </div>
  )}
  
  <!-- 本地图片：使用 Astro Image 组件 -->
  {isLocal && img && (
    <Image 
      src={img} 
      alt={alt || ""} 
      class:list={[
        imageClass,
        preview ? 'random-cover-preview-image' : 'random-cover-full-image'
      ]}
      style={imageStyle}
      width={preview ? 400 : 1200}
      height={preview ? 300 : 800}
      loading="lazy"
      format="webp"
      quality={preview ? 80 : 90}
      widths={preview ? [200, 400, 600] : [800, 1200, 1600, 2000]}
      sizes={preview ? "(max-width: 768px) 100vw, 28vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"}
    />
  )}
  
  <!-- 远程图片（包括随机图API和普通远程图片） -->
  {!isLocal && (
    <img 
      src={isPublic ? url(src) : src} 
      alt={alt || ""} 
      class:list={[
        imageClass,
        preview ? 'random-cover-preview-image' : 'random-cover-full-image'
      ]}
      style={imageStyle}
      loading="lazy"
      decoding="async"
      data-preview={preview ? "true" : "false"}
      data-seed={seed || ""}
      data-api-urls={allApiUrls.length > 0 ? JSON.stringify(allApiUrls) : ""}
      data-fallback={fallbackSrc ? getFallbackUrl(fallbackSrc) : ""}
      data-api-index={allApiUrls.length > 0 ? "0" : ""}
      data-enable={isRandomApiImage ? (coverImageConfig.enable ? "true" : "false") : ""}
      data-need-check-fallback="true"
    onloadstart={`(function(img){
      const container = img.parentElement;
      if (container) {
        const loadingIndicator = container.querySelector('.image-loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.classList.remove('hidden');
          loadingIndicator.style.removeProperty('opacity');
          loadingIndicator.style.removeProperty('display');
        }
      }
    })(this);`}
    onload={`(function(img){
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setTimeout(function() {
          const container = img.parentElement;
          if (container) {
            const loadingIndicator = container.querySelector('.image-loading-indicator');
            if (loadingIndicator) {
              loadingIndicator.style.setProperty('opacity', '0', 'important');
              loadingIndicator.style.setProperty('transition', 'opacity 0.3s ease-out', 'important');
              setTimeout(function() {
                loadingIndicator.style.setProperty('display', 'none', 'important');
                loadingIndicator.classList.add('hidden');
              }, 300);
            }
            const watermarkEl = container.querySelector('[data-watermark]');
            if (watermarkEl && watermarkEl.getAttribute('data-watermark-visible') !== 'true') {
              watermarkEl.setAttribute('data-watermark-visible', 'true');
              watermarkEl.classList.remove('opacity-0');
              watermarkEl.classList.add('opacity-100');
              const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
              watermarkEl.style.opacity = originalOpacity;
            }
          }
        }, 800);
      }
    })(this);`}
    onerror={`(function(img){
      try {
        const apiUrls = img.dataset.apiUrls ? JSON.parse(img.dataset.apiUrls) : [];
        let currentIndex = parseInt(img.dataset.apiIndex || '0');
        const isEnabled = img.dataset.enable !== 'false';
        const fallbackUrl = img.dataset.fallback;
        
        if (apiUrls.length > 0 && currentIndex < apiUrls.length - 1) {
          currentIndex = currentIndex + 1;
          img.dataset.apiIndex = currentIndex.toString();
          img.src = apiUrls[currentIndex];
        } 
        else if (isEnabled && fallbackUrl && fallbackUrl.length > 0) {
          const seed = img.dataset.seed;
          if (seed) {
            try {
              localStorage.setItem('api_image_failed_' + seed, 'true');
            } catch (e) {}
          }
          const container = img.parentElement;
          if (container) {
            const watermarkEl = container.querySelector('[data-watermark]');
            if (watermarkEl) {
              watermarkEl.textContent = 'Image API Error';
              watermarkEl.setAttribute('data-error', 'true');
            }
          }
          img.onerror = null;
          img.src = fallbackUrl;
          img.addEventListener('load', function() {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              const container = img.parentElement;
              if (container) {
                const loadingIndicator = container.querySelector('.image-loading-indicator');
                if (loadingIndicator) {
                  loadingIndicator.style.opacity = '0';
                  setTimeout(function() {
                    loadingIndicator.style.display = 'none';
                  }, 300);
                }
                const watermarkEl = container.querySelector('[data-watermark]');
                if (watermarkEl && watermarkEl.getAttribute('data-watermark-visible') !== 'true') {
                  watermarkEl.setAttribute('data-watermark-visible', 'true');
                  watermarkEl.classList.remove('opacity-0');
                  watermarkEl.classList.add('opacity-100');
                  const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
                  watermarkEl.style.opacity = originalOpacity;
                  watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
                }
              }
            }
          }, { once: true });
        } 
        else {
          img.onerror = null;
          img.style.display = 'none';
          const container = img.parentElement;
          if (container) {
            const loadingIndicator = container.querySelector('.image-loading-indicator');
            if (loadingIndicator) {
              loadingIndicator.style.opacity = '0';
              setTimeout(function() {
                loadingIndicator.style.display = 'none';
              }, 300);
            }
          }
        }
      } catch(e) {
        const isEnabled = img.dataset.enable !== 'false';
        const fallbackUrl = img.dataset.fallback;
        const seed = img.dataset.seed;
        if (isEnabled && fallbackUrl && fallbackUrl.length > 0) {
          if (seed) {
            try {
              localStorage.setItem('api_image_failed_' + seed, 'true');
            } catch (e) {}
          }
          const container = img.parentElement;
          if (container) {
            const watermarkEl = container.querySelector('[data-watermark]');
            if (watermarkEl) {
              watermarkEl.textContent = 'Image API Error';
              watermarkEl.setAttribute('data-error', 'true');
            }
          }
          img.onerror = null;
          img.src = fallbackUrl;
        } else {
          img.onerror = null;
          img.style.display = 'none';
          const container = img.parentElement;
          if (container) {
            const loadingIndicator = container.querySelector('.image-loading-indicator');
            if (loadingIndicator) {
              loadingIndicator.style.opacity = '0';
              setTimeout(function() {
                loadingIndicator.style.display = 'none';
              }, 300);
            }
          }
        }
      }
    })(this);`}
    />
  )}
  
  {showWatermark && (
    <div 
      data-watermark="true"
      data-watermark-visible="false"
      data-original-opacity={watermark?.opacity || "0.6"}
      class:list={["absolute", watermarkStyles.classes, "pointer-events-none", "z-10"]}
      style={`${watermarkStyles.styles} opacity: 0 !important;`}
    >
      {watermark?.text || "Random Cover"}
    </div>
  )}
</div>

<style>
  .image-loading-indicator {
    opacity: 1 !important;
    display: flex !important;
    visibility: visible !important;
    z-index: 20;
  }
  
  .image-loading-indicator.hidden {
    opacity: 0 !important;
    display: none !important;
    visibility: hidden !important;
  }
  
  img.random-cover-preview-image,
  img[data-preview="true"] {
    min-height: 150px;
    @media (min-width: 768px) {
      min-height: 0;
    }
    image-rendering: -webkit-optimize-contrast !important;
    image-rendering: auto !important;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -ms-interpolation-mode: bicubic;
    object-fit: cover !important;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
  }
  
  img.random-cover-full-image {
    min-height: 300px;
    image-rendering: -webkit-optimize-contrast !important;
    image-rendering: auto !important;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    object-fit: cover !important;
    width: 100%;
    height: 100%;
  }
</style>

<script is:inline>
  (function() {
    function isPageRefresh() {
      try {
        if (window.performance && window.performance.getEntriesByType) {
          const navEntries = window.performance.getEntriesByType('navigation');
          if (navEntries.length > 0) {
            const navType = navEntries[0].type;
            if (navType === 'reload' || navType === 'navigate') {
              return true;
            }
            if (navType === 'back_forward') {
              return false;
            }
          }
        }
        if (window.performance && window.performance.navigation) {
          const navType = window.performance.navigation.type;
          if (navType === 1 || navType === 0) {
            return true;
          }
          if (navType === 2) {
            return false;
          }
        }
        const refreshCheckKey = 'random_cover_image_last_init_time';
        const navigationCheckKey = 'random_cover_image_navigation_type';
        const now = Date.now();
        const lastInitTime = sessionStorage.getItem(refreshCheckKey);
        const lastNavType = sessionStorage.getItem(navigationCheckKey);
        
        if (!lastInitTime || (now - parseInt(lastInitTime)) > 10000) {
          sessionStorage.setItem(refreshCheckKey, now.toString());
          sessionStorage.setItem(navigationCheckKey, 'refresh');
          return true;
        }
        
        if (lastNavType === 'back_forward' && (now - parseInt(lastInitTime)) < 5000) {
          return false;
        }
        
        sessionStorage.setItem(refreshCheckKey, now.toString());
        sessionStorage.setItem(navigationCheckKey, 'refresh');
        return true;
      } catch (e) {
        console.warn('Unable to detect page refresh type, clearing cache as fallback', e);
        return true;
      }
    }
    
    function clearApiFailureCache() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('api_image_failed_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(function(key) {
          localStorage.removeItem(key);
        });
        if (keysToRemove.length > 0) {
          console.log('Cleared ' + keysToRemove.length + ' API failure records on page refresh');
        }
      } catch (e) {
        console.warn('Failed to clear API failure cache', e);
      }
    }
    
    function checkAndUseFallbackForFailedApis() {
      const allApiImages = document.querySelectorAll('img[data-seed][data-fallback][data-enable="true"]');
      
      allApiImages.forEach(function(img) {
        const seed = img.dataset.seed;
        const fallbackUrl = img.dataset.fallback;
        
        if (seed && fallbackUrl) {
          try {
            const failureKey = 'api_image_failed_' + seed;
            if (localStorage.getItem(failureKey) === 'true') {
              if (img.src !== fallbackUrl && !img.src.includes(fallbackUrl.split('?')[0])) {
                img.src = fallbackUrl;
              }
              const container = img.parentElement;
              if (container) {
                const watermarkEl = container.querySelector('[data-watermark]');
                if (watermarkEl) {
                  watermarkEl.textContent = 'Image API Error';
                  watermarkEl.setAttribute('data-error', 'true');
                  const loadingIndicator = container.querySelector('.image-loading-indicator');
                  if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    if (loadingIndicator) {
                      loadingIndicator.style.opacity = '0';
                      setTimeout(function() {
                        loadingIndicator.style.display = 'none';
                      }, 300);
                    }
                    watermarkEl.setAttribute('data-watermark-visible', 'true');
                    watermarkEl.classList.remove('opacity-0');
                    watermarkEl.classList.add('opacity-100');
                    const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
                    watermarkEl.style.opacity = originalOpacity;
                    watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
                  } else {
                    img.addEventListener('load', function() {
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        if (loadingIndicator) {
                          loadingIndicator.style.opacity = '0';
                          setTimeout(function() {
                            loadingIndicator.style.display = 'none';
                          }, 300);
                        }
                        watermarkEl.setAttribute('data-watermark-visible', 'true');
                        watermarkEl.classList.remove('opacity-0');
                        watermarkEl.classList.add('opacity-100');
                        const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
                        watermarkEl.style.opacity = originalOpacity;
                        watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
                      }
                    }, { once: true });
                  }
                }
              }
            }
          } catch (e) {}
        }
      });
    }
    
    function showLoadingIndicator(img) {
      if (!img.dataset.seed && img.dataset.preview !== 'true') {
        return;
      }
      const container = img.closest('[id]') || img.parentElement;
      if (container) {
        const loadingIndicator = container.querySelector('.image-loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.classList.remove('hidden');
          loadingIndicator.style.removeProperty('opacity');
          loadingIndicator.style.removeProperty('display');
        }
      }
    }
    
    function hideLoadingIndicator(img) {
      if (!img.dataset.seed && img.dataset.preview !== 'true') {
        return;
      }
      const container = img.closest('[id]') || img.parentElement;
      if (container) {
        const loadingIndicator = container.querySelector('.image-loading-indicator');
        if (loadingIndicator) {
          setTimeout(function() {
            loadingIndicator.style.setProperty('opacity', '0', 'important');
            loadingIndicator.style.setProperty('transition', 'opacity 0.3s ease-out', 'important');
            setTimeout(function() {
              loadingIndicator.style.setProperty('display', 'none', 'important');
              loadingIndicator.classList.add('hidden');
            }, 300);
          }, 800);
        }
      }
    }
    
    function showWatermark(img) {
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
        return;
      }
      hideLoadingIndicator(img);
      const container = img.closest('[id]') || img.parentElement;
      if (container) {
        const watermarkEl = container.querySelector('[data-watermark]');
        if (watermarkEl && watermarkEl.getAttribute('data-watermark-visible') !== 'true') {
          watermarkEl.setAttribute('data-watermark-visible', 'true');
          watermarkEl.classList.remove('opacity-0');
          watermarkEl.classList.add('opacity-100');
          const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
          watermarkEl.style.opacity = originalOpacity;
          watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
        }
      }
    }
    
    function optimizePreviewImages() {
      const previewImages = document.querySelectorAll('img[data-preview="true"]');
      previewImages.forEach(function(img) {
        if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
          showLoadingIndicator(img);
          img.addEventListener('loadstart', function() {
            showLoadingIndicator(img);
          }, { once: true });
        }
      });
    }
    
    function setupObserver() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              const apiImages = [];
              if (element.tagName === 'IMG' && element.dataset.seed && element.dataset.fallback) {
                apiImages.push(element);
              }
              const childApiImages = element.querySelectorAll ? element.querySelectorAll('img[data-seed][data-fallback]') : [];
              childApiImages.forEach(function(img) {
                if (!apiImages.includes(img)) {
                  apiImages.push(img);
                }
              });
              
              apiImages.forEach(function(img) {
                showLoadingIndicator(img);
                if (img.getAttribute('data-need-check-fallback') === 'true') {
                  checkAndUseFallbackForFailedApis();
                  img.removeAttribute('data-need-check-fallback');
                }
                if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                  hideLoadingIndicator(img);
                  showWatermark(img);
                } else {
                  img.addEventListener('loadstart', function() {
                    showLoadingIndicator(img);
                  }, { once: true });
                  img.addEventListener('load', function() {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                      hideLoadingIndicator(img);
                      showWatermark(img);
                    }
                  }, { once: true });
                  img.addEventListener('error', function() {
                    setTimeout(function() {
                      hideLoadingIndicator(img);
                    }, 500);
                  }, { once: true });
                }
              });
            }
          });
        });
      });
      
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
    }
    
    function initializeImages() {
      if (isPageRefresh()) {
        clearApiFailureCache();
      } else {
        checkAndUseFallbackForFailedApis();
      }
      optimizePreviewImages();
      
      const allApiImages = document.querySelectorAll('img[data-seed][data-fallback]');
      allApiImages.forEach(function(img) {
        showLoadingIndicator(img);
        img.addEventListener('loadstart', function() {
          showLoadingIndicator(img);
        }, { once: true });
        
        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          hideLoadingIndicator(img);
          showWatermark(img);
        } else {
          img.addEventListener('load', function() {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              hideLoadingIndicator(img);
              showWatermark(img);
            }
          }, { once: true });
          img.addEventListener('error', function() {
            setTimeout(function() {
              hideLoadingIndicator(img);
            }, 500);
          }, { once: true });
        }
      });
      
      setupObserver();
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeImages);
    } else {
      initializeImages();
    }
    
    // 监听页面可见性变化（从其他页面返回时重新检查）
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        if (!isPageRefresh()) {
          setTimeout(checkAndUseFallbackForFailedApis, 100);
        }
      }
    });
    
    // 监听popstate事件（浏览器前进/后退）
    window.addEventListener('popstate', function() {
      try {
        sessionStorage.setItem('random_cover_image_navigation_type', 'back_forward');
        sessionStorage.setItem('random_cover_image_last_init_time', Date.now().toString());
      } catch (e) {
        // 忽略错误
      }
      setTimeout(function() {
        checkAndUseFallbackForFailedApis();
      }, 50);
    });
  })();
</script>
```

### 修改src\components\PostCard.astro封面内容

```js title ="src\components\PostCard.astro" ins={5-6,45-50,113-120} del={44,110-112} collapse={13-41,56-98,129-204}
---
import type { CollectionEntry } from "astro:content";
import path from "node:path";
import { Icon } from "astro-icon/components";
import RandomCoverImage from "@/components/misc/RandomCoverImage.astro";
import { processCoverImageSync } from "@/utils/image-utils";
import { statsConfig, umamiConfig } from "../config";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getDir } from "../utils/url-utils";
import ImageWrapper from "./misc/ImageWrapper.astro";
import PostMetadata from "./PostMeta.astro";

interface Props {
	class?: string;
	entry: CollectionEntry<"posts">;
	title: string;
	url: string;
	published: Date;
	updated?: Date;
	tags: string[];
	category: string | null;
	image: string;
	description: string;
	draft: boolean;
	style: string;
	pinned?: boolean;
}
const {
	entry,
	title,
	url,
	published,
	updated,
	tags,
	category,
	image,
	description,
	style,
	pinned,
} = Astro.props;
const className = Astro.props.class;

//const hasCover = image !== undefined && image !== null && image !== "";
// 处理随机图：如果image为"api"，则从配置的API获取随机图
const processedImage = processCoverImageSync(image, entry.slug);
const hasCover =
	processedImage !== undefined &&
	processedImage !== null &&
	processedImage !== "";

const coverWidth = "28%";

const { remarkPluginFrontmatter } = await entry.render();
---
<div class:list={["card-base flex flex-col-reverse md:flex-col w-full rounded-[var(--radius-large)] overflow-hidden relative", className]} style={style}>
    <div class:list={["pl-6 md:pl-9 pr-6 md:pr-2 pt-6 md:pt-7 pb-6 relative", {"w-full md:w-[calc(100%_-_52px_-_12px)]": !hasCover, "w-full md:w-[calc(100%_-_var(--coverWidth)_-_12px)]": hasCover}]}>
        {pinned && <div class="absolute top-2 right-2 text-[var(--primary)] flex items-center gap-1">
           <Icon name="simple-icons:pinboard" class="w-5 h-5" />
            <span class="text-sm hidden md:inline">{i18n(I18nKey.pinned)}</span>
        </div>}
        <a href={url}
           class="transition group w-full block font-bold mb-3 text-3xl text-90
        hover:text-[var(--primary)] dark:hover:text-[var(--primary)]
        active:text-[var(--title-active)] dark:active:text-[var(--title-active)]
        before:w-1 before:h-5 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:top-[35px] before:left-[18px] before:hidden md:before:block
        ">
            {title}
            <Icon class="inline text-[2rem] text-[var(--primary)] md:hidden translate-y-0.5 absolute" name="material-symbols:chevron-right-rounded" ></Icon>
            <Icon class="text-[var(--primary)] text-[2rem] transition hidden md:inline absolute translate-y-0.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" name="material-symbols:chevron-right-rounded"></Icon>
        </a>

        <!-- metadata -->
        <PostMetadata published={published} updated={updated} tags={tags} category={category} hideTagsForMobile={true} hideUpdateDate={true} class="mb-4"></PostMetadata>

        <!-- description -->
        <div class:list={["transition text-75 mb-3.5 pr-4", {"line-clamp-2 md:line-clamp-1": !description}]}>
            { description || remarkPluginFrontmatter.excerpt }
        </div>

        <!-- word count and read time and page views  -->
        <div class="text-sm text-black/30 dark:text-white/30 flex gap-4 transition">
            <div>
                {remarkPluginFrontmatter.words} {" " + i18n(remarkPluginFrontmatter.words === 1 ? I18nKey.wordCount : I18nKey.wordsCount)}
            </div>
            <div>|</div>
            <div>
                {remarkPluginFrontmatter.minutes} {" " + i18n(remarkPluginFrontmatter.minutes === 1 ? I18nKey.minuteCount : I18nKey.minutesCount)}
            </div>
            <div>|</div>
            <div>
                <span class="text-50 text-sm font-medium" id={`page-views-${entry.slug}`}>{statsConfig.loadingText}</span>
            </div>
        </div>

    </div>

    {hasCover && <a href={url} aria-label={title}
                    class:list={["group",
                        "max-h-[20vh] md:max-h-none mx-4 mt-4 -mb-2 md:mb-0 md:mx-0 md:mt-0",
                        "md:w-[var(--coverWidth)] relative md:absolute md:top-3 md:bottom-3 md:right-3 rounded-xl overflow-hidden active:scale-95"
                    ]} >
        <div class="absolute pointer-events-none z-10 w-full h-full group-hover:bg-black/30 group-active:bg-black/50 transition"></div>
        <div class="absolute pointer-events-none z-20 w-full h-full flex items-center justify-center ">
            <Icon name="material-symbols:chevron-right-rounded"
                  class="transition opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 text-white text-5xl">
            </Icon>
        </div>
        {/* <ImageWrapper src={image} basePath={path.join("content/posts/", getDir(entry.id))} alt="Cover Image of the Post"
                  class="w-full h-full">
        </ImageWrapper> */}
        <RandomCoverImage
          src={processedImage}
          basePath={path.join("content/posts/", getDir(entry.id))}
          alt="Cover Image of the Post"
          class="w-full h-full"
          seed={entry.slug}
          preview={true}
        />

    </a>}

    {!hasCover &&
        <a href={url} aria-label={title} class="!hidden md:!flex btn-regular w-[3.25rem]
         absolute right-3 top-3 bottom-3 rounded-xl bg-[var(--enter-btn-bg)]
         hover:bg-[var(--enter-btn-bg-hover)] active:bg-[var(--enter-btn-bg-active)] active:scale-95
        ">
            <Icon name="material-symbols:chevron-right-rounded"
                  class="transition text-[var(--primary)] text-4xl mx-auto">
            </Icon>
        </a>
    }
</div>
<div class="transition border-t-[1px] border-dashed mx-6 border-black/10 dark:border-white/[0.15] last:border-t-0 md:hidden"></div>
<script define:vars={{ entry, umamiConfig, unavailableText: statsConfig.unavailableText, viewsText: statsConfig.viewsText, visitsText: statsConfig.visitsText }}>
    // 客户端统计文案生成函数
    function generateStatsText(pageViews, visits) {
        return `${viewsText} ${pageViews} · ${visitsText} ${visits}`;
    }
    
    // 获取文章浏览量统计
    async function fetchPostCardViews(slug) {
        if (!umamiConfig.enable) {
            return;
        }
        
        try {
            // 调用全局工具获取 Umami 分享数据
            const { websiteId, token } = await getUmamiShareData(umamiConfig.baseUrl, umamiConfig.shareId);
            
            // 第二步：获取统计数据
            const currentTimestamp = Date.now();
            const statsUrl = `${umamiConfig.baseUrl}/analytics/us/api/websites/${websiteId}/stats?startAt=0&endAt=${currentTimestamp}&unit=hour&timezone=${encodeURIComponent(umamiConfig.timezone)}&path=eq.%2Fposts%2F${slug}%2F&compare=false`;
            
            const statsResponse = await fetch(statsUrl, {
                headers: {
                    'x-umami-share-token': token
                }
            });
            
            if (statsResponse.status === 401) {
                clearUmamiShareCache();
                return await fetchPostCardViews(slug);
            }
            
            if (!statsResponse.ok) {
                throw new Error('获取统计数据失败');
            }
            
            const statsData = await statsResponse.json();
            const pageViews = statsData.pageviews || 0;
            const visits = statsData.visits || 0;
            
            const displayElement = document.getElementById(`page-views-${slug}`);
             if (displayElement) {
                 displayElement.textContent = generateStatsText(pageViews, visits);
             }
        } catch (error) {
            console.error('Error fetching page views for', slug, ':', error);
            const displayElement = document.getElementById(`page-views-${slug}`);
            if (displayElement) {
                displayElement.textContent = unavailableText;
            }
        }
    }

    // 页面加载完成后获取统计数据
    function initPostCardStats() {
        const slug = entry.slug;
        if (slug) {
            fetchPostCardViews(slug);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPostCardStats);
    } else {
        initPostCardStats();
    }
</script>
<style define:vars={{coverWidth}}>
</style>

```

### 修改src\pages\posts\[...slug].astro图片显示

```js title="src\pages\posts\[...slug].astro" ins={13,31-32,52,100,105-106} collapse={2-9,21-26,36-48,56-96,109-148}
---
import path from "node:path";
import Giscus from "@components/misc/Giscus.astro";
import License from "@components/misc/License.astro";
import Markdown from "@components/misc/Markdown.astro";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import MainGridLayout from "@layouts/MainGridLayout.astro";
import { getSortedPosts } from "@utils/content-utils";
import { getDir, getPostUrlBySlug } from "@utils/url-utils";
import { Icon } from "astro-icon/components";
import { licenseConfig } from "src/config";
import { processCoverImageSync } from "@/utils/image-utils";
import ImageWrapper from "../../components/misc/ImageWrapper.astro";
import PostMetadata from "../../components/PostMeta.astro";
import { profileConfig, siteConfig } from "../../config";
import { formatDateToYYYYMMDD } from "../../utils/date-utils";
export async function getStaticPaths() {
	const blogEntries = await getSortedPosts();
	return blogEntries.map((entry) => ({
		params: { slug: entry.slug },
		props: { entry },
	}));
}

const { entry } = Astro.props;
const { Content, headings } = await entry.render();

const { remarkPluginFrontmatter } = await entry.render();

// 处理随机图：如果image为"api"，则从配置的API获取随机图
const processedImage = processCoverImageSync(entry.data.image, entry.slug);

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	headline: entry.data.title,
	description: entry.data.description || entry.data.title,
	keywords: entry.data.tags,
	author: {
		"@type": "Person",
		name: profileConfig.name,
		url: Astro.site,
	},
	datePublished: formatDateToYYYYMMDD(entry.data.published),
	inLanguage: entry.data.lang
		? entry.data.lang.replace("_", "-")
		: siteConfig.lang.replace("_", "-"),
	// TODO include cover image here
};
---
<MainGridLayout banner={processedImage} title={entry.data.title} description={entry.data.description} lang={entry.data.lang} setOGTypeArticle={true} headings={headings} series={entry.data.series}>
    <script is:inline slot="head" type="application/ld+json" set:html={JSON.stringify(jsonLd)}></script>
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative mb-4">
        <div id="post-container" class:list={["card-base z-10 px-6 md:px-9 pt-6 pb-4 relative w-full ",
            {}
        ]}>
            <!-- word count and reading time -->
            <div class="flex flex-row text-black/30 dark:text-white/30 gap-5 mb-3 transition onload-animation">
                <div class="flex flex-row items-center">
                    <div class="transition h-6 w-6 rounded-md bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 flex items-center justify-center mr-2">
                        <Icon name="material-symbols:notes-rounded"></Icon>
                    </div>
                    <div class="text-sm">{remarkPluginFrontmatter.words} {" " + i18n(I18nKey.wordsCount)}</div>
                </div>
                <div class="flex flex-row items-center">
                    <div class="transition h-6 w-6 rounded-md bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 flex items-center justify-center mr-2">
                        <Icon name="material-symbols:schedule-outline-rounded"></Icon>
                    </div>
                    <div class="text-sm">
                        {remarkPluginFrontmatter.minutes} {" " + i18n(remarkPluginFrontmatter.minutes === 1 ? I18nKey.minuteCount : I18nKey.minutesCount)}
                    </div>
                </div>
            </div>

            <!-- title -->
            <div class="relative onload-animation">
                <div
                    data-pagefind-body data-pagefind-weight="10" data-pagefind-meta="title"
                    class="transition w-full block font-bold mb-3
                    text-3xl md:text-[2.25rem]/[2.75rem]
                    text-black/90 dark:text-white/90
                    md:before:w-1 before:h-5 before:rounded-md before:bg-[var(--primary)]
                    before:absolute before:top-[0.75rem] before:left-[-1.125rem]
                ">
                    {entry.data.title}
                </div>
            </div>

            <!-- metadata -->
            <div class="onload-animation">
                <PostMetadata
                        class="mb-5"
                        published={entry.data.published}
                        updated={entry.data.updated}
                        tags={entry.data.tags}
                        category={entry.data.category}
                        slug={entry.slug}
                ></PostMetadata>
                {!processedImage && <div class="border-[var(--line-divider)] border-dashed border-b-[1px] mb-5"></div>}
            </div>

            <!-- always show cover as long as it has one -->

            {processedImage &&
                <ImageWrapper id="post-cover" src={processedImage} basePath={path.join("content/posts/", getDir(entry.id))} class="mb-8 rounded-xl banner-container onload-animation"/>
            }


            <Markdown class="mb-6 markdown-content onload-animation">
                <Content />
            </Markdown>

            {licenseConfig.enable && <License title={entry.data.title} slug={entry.slug} pubDate={entry.data.published} class="mb-6 rounded-xl license-container onload-animation"></License>}
            <!-- 评论模块 -->
            <Giscus
            repo="luozhipeng1/fuwari"
            repoId="R_kgDOPvEVqw"
            category="Announcements"
            categoryId="DIC_kwDOPvEVq84CwMEH"
            />
            <br>
        </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between mb-4 gap-4 overflow-hidden w-full">
        <a href={entry.data.nextSlug ? getPostUrlBySlug(entry.data.nextSlug) : "#"}
           class:list={["w-full font-bold overflow-hidden active:scale-95", {"pointer-events-none": !entry.data.nextSlug}]}>
            {entry.data.nextSlug && <div class="btn-card rounded-2xl w-full h-[3.75rem] max-w-full px-4 flex items-center !justify-start gap-4" >
                <Icon name="material-symbols:chevron-left-rounded" class="text-[2rem] text-[var(--primary)]" />
                <div class="overflow-hidden transition overflow-ellipsis whitespace-nowrap max-w-[calc(100%_-_3rem)] text-black/75 dark:text-white/75">
                    {entry.data.nextTitle}
                </div>
            </div>}
        </a>

        <a href={entry.data.prevSlug ? getPostUrlBySlug(entry.data.prevSlug) : "#"}
           class:list={["w-full font-bold overflow-hidden active:scale-95", {"pointer-events-none": !entry.data.prevSlug}]}>
            {entry.data.prevSlug && <div class="btn-card rounded-2xl w-full h-[3.75rem] max-w-full px-4 flex items-center !justify-end gap-4">
                <div class="overflow-hidden transition overflow-ellipsis whitespace-nowrap max-w-[calc(100%_-_3rem)] text-black/75 dark:text-white/75">
                    {entry.data.prevTitle}
                </div>
                <Icon name="material-symbols:chevron-right-rounded" class="text-[2rem] text-[var(--primary)]" />
            </div>}
        </a>
    </div>

</MainGridLayout>

```

## [使用流程](https://docs-firefly.cuteleaf.cn/config/coverImageConfig-usage/#使用流程)

1. **配置 API 列表**：在 `apis` 数组中添加可用的随机图 API
2. **设置备用图片**：准备一个备用图片，放在 `public` 目录下
3. **在文章中使用**：在文章的 Frontmatter 中添加 `image: "api"`
4. **系统自动处理**：
   - 尝试从 API 获取图片
   - 显示加载指示器
   - 成功后显示图片和水印
   - 失败后使用备用图片并更新水印为 "Image API Error"

## 注意事项

### 1. API 可用性

- 确保配置的 API 可以正常访问
- 建议配置多个 API 作为备用
- API 返回的应该是直接的图片 URL，而不是 HTML 页面

### 2. 备用图片准备

- 建议使用 WebP 格式，文件更小
- 备用图片应该放在 `public` 目录下
- 路径要正确（相对于 `public` 目录）

### 3. 加载指示器

- 背景颜色应与加载 GIF 的背景色一致
- 只对远程 API 图片显示，本地图片不显示
- 加载 GIF 建议使用透明背景或与页面背景色一致的背景

### 4. 水印显示

- 只在随机 API 图片成功加载时显示配置的水印文字
- API 失败时会自动更新为 "Image API Error"
- 本地图片不显示水印

### 5. 缓存机制

- 失败的 API 会被记录到 `localStorage`
- 下次访问同一文章时，会直接使用备用图片（避免重复请求）
- F5 刷新会清除失败记录，重新尝试 API

## 常见问题

**Q: 如何启用随机封面图功能？**

A: 在 `coverImageConfig.ts` 中设置 `enable: true`，然后在文章的 Frontmatter 中添加 `image: "api"`。

**Q: 如何添加更多的 API？**

A: 在 `apis` 数组中添加 API URL，系统会按顺序尝试：

```typescript
apis: [
  "https://api1.com/image",
  "https://api2.com/image",
  "https://api3.com/image",
]
```

**Q: API 全部失败怎么办？**

A: 系统会自动使用 `fallback` 配置的备用图片，水印文字会自动更新为 "Image API Error"。

**Q: 如何禁用水印？**

A: 设置 `watermark.enable: false` 即可。

**Q: 如何自定义水印位置？**

A: 修改 `watermark.position` 的值，支持 `"top-left"`、`"top-right"`、`"bottom-left"`、`"bottom-right"`、`"center"`。

**Q: 为什么移动端水印位置不一样？**

A: `bottom-left` 和 `bottom-right` 在移动端会自动调整到顶部显示，避免水印被裁剪。这是设计特性，不是 bug。

**Q: 如何自定义加载 GIF？**

A: 在 `loading.image` 中设置自定义 GIF 路径，并确保 `loading.backgroundColor` 与 GIF 背景色一致。

**Q: 为什么本地图片不显示加载指示器？**

A: 加载指示器只对远程 API 图片显示，本地图片加载较快，不需要显示。

**Q: 如何清除 API 失败记录？**

A: 按 F5 刷新页面会自动清除 `localStorage` 中的失败记录，重新尝试 API。

**Q: 能否只使用一个 API？**

A: 可以，但建议配置多个 API 作为备用，提高可用性。

**Q: API 需要支持哪些参数？**

A: API 应该直接返回图片，支持 GET 请求。不需要任何特殊参数，系统会自动处理图片加载。

**Q: 如何测试 API 是否可用？**

A: 在浏览器中直接访问 API URL，应该能看到图片。如果可以，说明 API 可用。