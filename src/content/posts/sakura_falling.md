---
title: 樱花特效配置
published: 2025-10-28
updated: 2025-10-28
description: ''
image: ''
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---

## 概述

樱花特效配置用于在网站中添加动态的樱花飘落效果，营造浪漫的视觉氛围。

## 前言

最近想要添加的功能有点多，我把整个config.ts配置文件拆分为多个模块化文件，创建独立的siteConfig、navBarConfig等模块

## 基础配置

```js title="sakuraConfig.ts"
import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
  enable: true, // 默认关闭樱花特效
  type: 'canvas', // 樱花特效类型：'canvas' 或 'css'
  sakuraNum: 30, // 樱花数量
  limitTimes: -1, // 樱花越界限制次数，-1为无限循环
  size: {
    min: 0.4, // 樱花最小尺寸倍数
    max: 1.2, // 樱花最大尺寸倍数
  },
  opacity: {
    min: 0.5, // 樱花最小不透明度
    max: 1, // 樱花最大不透明度
  },
  speed: {
    horizontal: {
      min: -1.7, // 水平移动速度最小值
      max: -1.2, // 水平移动速度最大值
    },
    vertical: {
      min: 1.5, // 垂直移动速度最小值
      max: 2.2, // 垂直移动速度最大值
    },
    rotation: 0.03, // 旋转速度
    fadeSpeed: 0.03, // 消失速度，不应大于最小不透明度
  },
  zIndex: 100, // 层级，确保樱花在合适的层级显示
};
```

### 基础设置

| 选项         | 类型               | 说明                           | 默认值   |
| :----------- | :----------------- | :----------------------------- | :------- |
| `enable`     | `boolean`          | 是否启用樱花特效               | `true`   |
| `type`       | `'canvas' | 'css'` | 樱花特效类型：'canvas' 或 'css | `canvas` |
| `sakuraNum`  | `number`           | 樱花数量                       | `21`     |
| `limitTimes` | `number`           | 越界限制次数，-1为无限         | `-1`     |

### 尺寸设置

| 选项       | 类型     | 说明             | 默认值 |
| :--------- | :------- | :--------------- | :----- |
| `size.min` | `number` | 樱花最小尺寸倍数 | `0.5`  |
| `size.max` | `number` | 樱花最大尺寸倍数 | `1.1`  |

### 透明度设置

| 选项          | 类型     | 说明             | 默认值 |
| :------------ | :------- | :--------------- | :----- |
| `opacity.min` | `number` | 樱花最小不透明度 | `0.3`  |
| `opacity.max` | `number` | 樱花最大不透明度 | `0.9`  |

### 速度设置

| 选项                   | 类型     | 说明                           | 默认值 |
| :--------------------- | :------- | :----------------------------- | :----- |
| `speed.horizontal.min` | `number` | 水平移动速度最小值             | `-1.7` |
| `speed.horizontal.max` | `number` | 水平移动速度最大值             | `-1.2` |
| `speed.vertical.min`   | `number` | 垂直移动速度最小值             | `1.5`  |
| `speed.vertical.max`   | `number` | 垂直移动速度最大值             | `2.2`  |
| `speed.rotation`       | `number` | 旋转速度                       | `0.03` |
| `speed.fadeSpeed`      | `number` | 消失速度，不应大于最小不透明度 | `0.03` |

### 层级设置

| 选项     | 类型     | 说明     | 默认值 |
| :------- | :------- | :------- | :----- |
| `zIndex` | `number` | 樱花层级 | `100`  |

## 使用场景

### 1. 浪漫主题网站

```js title="SakuraConfig"
export const sakuraConfig: SakuraConfig = {
  enable: true,
  type: 'canvas',
  sakuraNum: 30, // 更多樱花
  limitTimes: -1,
  size: {
    min: 0.8,
    max: 1.5, // 更大的樱花
  },
  opacity: {
    min: 0.4,
    max: 0.95, // 更高的透明度
  },
  speed: {
    horizontal: {
      min: -2.0,
      max: -1.0, // 更慢的飘落
    },
    vertical: {
      min: 1.0,
      max: 1.8,
    },
    rotation: 0.02, // 更慢的旋转
    fadeSpeed: 0.02, // 更慢的消失
  },
  zIndex: 100,
};
```

### 2. 简约风格

```js title="SakuraConfig"
export const sakuraConfig: SakuraConfig = {
  enable: true,
  type: 'canvas',
  sakuraNum: 10, // 少量樱花
  limitTimes: -1,
  size: {
    min: 0.3,
    max: 0.8, // 较小的樱花
  },
  opacity: {
    min: 0.2,
    max: 0.7, // 较低的透明度
  },
  speed: {
    horizontal: {
      min: -1.0,
      max: -0.5,
    },
    vertical: {
      min: 2.0,
      max: 3.0, // 较快的飘落
    },
    rotation: 0.05,
    fadeSpeed: 0.05, // 较快的消失
  },
  zIndex: 100,
};
```

### 3. 节日主题

```js title="SakuraConfig"
export const sakuraConfig: SakuraConfig = {
  enable: true,
  type: 'canvas',
  sakuraNum: 50, // 大量樱花营造节日氛围
  limitTimes: -1,
  size: {
    min: 0.4,
    max: 1.2,
  },
  opacity: {
    min: 0.5,
    max: 1.0, // 完全不透明
  },
  speed: {
    horizontal: {
      min: -2.5,
      max: -1.5,
    },
    vertical: {
      min: 1.2,
      max: 2.5,
    },
    rotation: 0.04,
    fadeSpeed: 0.04,
  },
  zIndex: 100,
};
```

## 性能优化

### 根据设备调整

```js title="SakuraConfig"
// 根据设备性能调整樱花数量
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export const sakuraConfig: SakuraConfig = {
  enable: true,
  type: 'canvas',
  sakuraNum: isMobile ? 10 : 21, // 移动端减少樱花数量
  size: {
    min: 0.5,
    max: 1.1,
  },
  opacity: {
    min: 0.3,
    max: 0.9,
  },
  speed: {
    horizontal: { min: -1.7, max: -1.2 },
    vertical: { min: 1.5, max: 2.2 },
    rotation: 0.03,
    fadeSpeed: 0.03,
  },
  zIndex: 100,
};
```

### 条件启用

```js title="SakuraConfig"
// 只在特定页面启用
export const sakuraConfig: SakuraConfig = {
  enable: process.env.NODE_ENV === 'production', // 只在生产环境启用
  // ... 其他配置
};
```

## 新建代码

### src\types\config.ts

```js title="src\types\config.ts" ins={3-29}
// ....其他配置

export type SakuraConfig = {
	enable: boolean; // 是否启用樱花特效
	type?: 'canvas' | 'css'; // 樱花特效类型：'canvas' 或 'css
	sakuraNum: number; // 樱花数量，默认21
	limitTimes: number; // 樱花越界限制次数，-1为无限循环
	size: {
	  min: number; // 樱花最小尺寸倍数
	  max: number; // 樱花最大尺寸倍数
	};
	opacity: {
	  min: number; // 樱花最小不透明度
	  max: number; // 樱花最大不透明度
	};
	speed: {
	  horizontal: {
		min: number; // 水平移动速度最小值
		max: number; // 水平移动速度最大值
	  };
	  vertical: {
		min: number; // 垂直移动速度最小值
		max: number; // 垂直移动速度最大值
	  };
	  rotation: number; // 旋转速度
	  fadeSpeed: number; // 消失速度，不应大于最小不透明度
	};
	zIndex: number; // 层级，确保樱花在合适的层级显示
  };
```

### src\components\effects\SakuraEffect.astro

新建`effects` 文件夹，创建`SakuraEffect.astro`文件

```js title="src\components\effects\SakuraEffect.astro"
---
import { sakuraConfig } from "@/config";

const config = sakuraConfig;
---

{sakuraConfig?.enable && sakuraConfig.type === 'canvas' && (
	<script define:vars={{ sakuraConfig: config }}>
		// 樱花对象类
		class Sakura {
			constructor(x, y, s, r, a, fn, idx, img, limitArray, config) {
				this.x = x;
				this.y = y;
				this.s = s;
				this.r = r;
				this.a = a;
				this.fn = fn;
				this.idx = idx;
				this.img = img;
				this.limitArray = limitArray;
				this.config = config;
			}

			draw(cxt) {
				cxt.save();
				cxt.translate(this.x, this.y);
				cxt.rotate(this.r);
				cxt.globalAlpha = this.a;
				cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s);
				cxt.restore();
			}

			update() {
				this.x = this.fn.x(this.x, this.y);
				this.y = this.fn.y(this.y, this.y);
				this.r = this.fn.r(this.r);
				this.a = this.fn.a(this.a);
				// 如果樱花越界，重新调整位置
				if (
					this.x > window.innerWidth ||
					this.x < 0 ||
					this.y > window.innerHeight ||
					this.y < 0 ||
					this.a <= 0
				) {
					// 如果樱花不做限制
					if (this.limitArray[this.idx] === -1) {
						this.resetPosition();
					}
					// 否则樱花有限制
					else {
						if (this.limitArray[this.idx] > 0) {
							this.resetPosition();
							this.limitArray[this.idx]--;
						}
					}
				}
			}

			resetPosition() {
				this.r = getRandom('fnr', this.config);
				if (Math.random() > 0.4) {
					this.x = getRandom('x', this.config);
					this.y = 0;
					this.s = getRandom('s', this.config);
					this.r = getRandom('r', this.config);
					this.a = getRandom('a', this.config);
				} else {
					this.x = window.innerWidth;
					this.y = getRandom('y', this.config);
					this.s = getRandom('s', this.config);
					this.r = getRandom('r', this.config);
					this.a = getRandom('a', this.config);
				}
			}
		}

		// 樱花列表类
		class SakuraList {
			constructor() {
				this.list = [];
			}

			push(sakura) {
				this.list.push(sakura);
			}

			update() {
				for (let i = 0, len = this.list.length; i < len; i++) {
					this.list[i].update();
				}
			}

			draw(cxt) {
				for (let i = 0, len = this.list.length; i < len; i++) {
					this.list[i].draw(cxt);
				}
			}

			get(i) {
				return this.list[i];
			}

			size() {
				return this.list.length;
			}
		}

		// 获取随机值的函数
		function getRandom(option, config) {
			let ret;
			let random;

			switch (option) {
				case 'x':
					ret = Math.random() * window.innerWidth;
					break;
				case 'y':
					ret = Math.random() * window.innerHeight;
					break;
				case 's':
					ret = config.size.min + Math.random() * (config.size.max - config.size.min);
					break;
				case 'r':
					ret = Math.random() * 6;
					break;
				case 'a':
					ret = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
					break;
				case 'fnx':
					random = config.speed.horizontal.min + Math.random() * (config.speed.horizontal.max - config.speed.horizontal.min);
					ret = function (x, y) {
						return x + random;
					};
					break;
				case 'fny':
					random = config.speed.vertical.min + Math.random() * (config.speed.vertical.max - config.speed.vertical.min);
					ret = function (x, y) {
						return y + random;
					};
					break;
				case 'fnr':
					ret = function (r) {
						return r + config.speed.rotation;
					};
					break;
				case 'fna':
					ret = function (alpha) {
						return alpha - config.speed.fadeSpeed * 0.01;
					};
					break;
			}
			return ret;
		}

		// 樱花管理器类
		class SakuraManager {
			constructor(config) {
				this.config = config;
				this.canvas = null;
				this.ctx = null;
				this.sakuraList = null;
				this.animationId = null;
				this.img = null;
				this.isRunning = false;
			}

			// 初始化樱花特效
			async init() {
				if (!this.config.enable || this.isRunning) {
					return;
				}

				// 创建图片对象
				this.img = new Image();
				this.img.src = '/donate/sakura.png'; // 使用樱花图片

				// 等待图片加载完成
				await new Promise((resolve, reject) => {
					if (this.img) {
						this.img.onload = () => resolve();
						this.img.onerror = () => reject(new Error('Failed to load sakura image'));
					}
				});

				this.createCanvas();
				this.createSakuraList();
				this.startAnimation();
				this.isRunning = true;
			}

			// 创建画布
			createCanvas() {
				this.canvas = document.createElement('canvas');
				this.canvas.height = window.innerHeight;
				this.canvas.width = window.innerWidth;
				this.canvas.setAttribute('style', `position: fixed; left: 0; top: 0; pointer-events: none; z-index: ${this.config.zIndex};`);
				this.canvas.setAttribute('id', 'canvas_sakura');
				document.body.appendChild(this.canvas);
				this.ctx = this.canvas.getContext('2d');

				// 监听窗口大小变化
				window.addEventListener('resize', this.handleResize.bind(this));
			}

			// 创建樱花列表
			createSakuraList() {
				if (!this.img || !this.ctx) return;

				this.sakuraList = new SakuraList();
				const limitArray = new Array(this.config.sakuraNum).fill(this.config.limitTimes);

				for (let i = 0; i < this.config.sakuraNum; i++) {
					const randomX = getRandom('x', this.config);
					const randomY = getRandom('y', this.config);
					const randomS = getRandom('s', this.config);
					const randomR = getRandom('r', this.config);
					const randomA = getRandom('a', this.config);
					const randomFnx = getRandom('fnx', this.config);
					const randomFny = getRandom('fny', this.config);
					const randomFnR = getRandom('fnr', this.config);
					const randomFnA = getRandom('fna', this.config);

					const sakura = new Sakura(
						randomX,
						randomY,
						randomS,
						randomR,
						randomA,
						{
							x: randomFnx,
							y: randomFny,
							r: randomFnR,
							a: randomFnA,
						},
						i,
						this.img,
						limitArray,
						this.config
					);

					sakura.draw(this.ctx);
					this.sakuraList.push(sakura);
				}
			}

			// 开始动画
			startAnimation() {
				if (!this.ctx || !this.canvas || !this.sakuraList) return;

				const animate = () => {
					if (!this.ctx || !this.canvas || !this.sakuraList) return;

					this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.sakuraList.update();
					this.sakuraList.draw(this.ctx);
					this.animationId = requestAnimationFrame(animate);
				};

				this.animationId = requestAnimationFrame(animate);
			}

			// 处理窗口大小变化
			handleResize() {
				if (this.canvas) {
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
				}
			}

			// 停止樱花特效
			stop() {
				if (this.animationId) {
					cancelAnimationFrame(this.animationId);
					this.animationId = null;
				}

				if (this.canvas) {
					document.body.removeChild(this.canvas);
					this.canvas = null;
				}

				window.removeEventListener('resize', this.handleResize.bind(this));
				this.isRunning = false;
			}

			// 切换樱花特效
			toggle() {
				if (this.isRunning) {
					this.stop();
				} else {
					this.init();
				}
			}

			// 更新配置
			updateConfig(newConfig) {
				const wasRunning = this.isRunning;
				if (wasRunning) {
					this.stop();
				}
				this.config = newConfig;
				if (wasRunning && newConfig.enable) {
					this.init();
				}
			}

			// 获取运行状态
			getIsRunning() {
				return this.isRunning;
			}
		}

		// 创建全局樱花管理器实例
		let globalSakuraManager = null;

		// 初始化樱花特效
		function initSakura(config) {
			if (globalSakuraManager) {
				globalSakuraManager.updateConfig(config);
			} else {
				globalSakuraManager = new SakuraManager(config);
				if (config.enable) {
					globalSakuraManager.init();
				}
			}
		}

		// 樱花特效初始化
		(function() {
			// 全局标记，确保樱花特效只初始化一次
			if (window.sakuraInitialized) {
				return;
			}
			
			// 初始化樱花特效的函数
			const setupSakura = () => {
				if (sakuraConfig.enable && !window.sakuraInitialized) {
					initSakura(sakuraConfig);
					window.sakuraInitialized = true;
				}
			};
			
			// 页面加载完成后初始化樱花特效
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', setupSakura);
			} else {
				setupSakura();
			}
		})();
	</script>
)}

{sakuraConfig?.enable && sakuraConfig.type === 'css' && (
	<div class="sakura-container">
		<script define:vars={{ sakuraConfig: config }}>
			function createCSSSakura() {
				const container = document.querySelector('.sakura-container');
				const sakuraCount = sakuraConfig?.sakuraNum || 50;
				
				for (let i = 0; i < sakuraCount; i++) {
					const sakura = document.createElement('div');
					sakura.classList.add('sakura');
					
					// 随机大小
					const sizes = ['small', 'medium', 'large'];
					const size = sizes[Math.floor(Math.random() * sizes.length)];
					sakura.classList.add(size);
					
					// 随机方向
					const directions = ['left', 'center', 'right'];
					const direction = directions[Math.floor(Math.random() * directions.length)];
					sakura.classList.add(direction);
					
					// 随机位置
					const startX = Math.random() * 100;
					sakura.style.left = `${startX}vw`;
					
					// 随机延迟
					const delay = Math.random() * 5;
					sakura.style.animationDelay = `${delay}s`;
					
					// 随机动画时长
					const fallDuration = 10 + Math.random() * 20;
					const swingDuration = 2 + Math.random() * 3;
					sakura.style.setProperty('--fall-duration', `${fallDuration}s`);
					sakura.style.setProperty('--swing-duration', `${swingDuration}s`);
					
					container.appendChild(sakura);
				}
			}
			
			// 页面加载完成后创建樱花
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', createCSSSakura);
			} else {
				createCSSSakura();
			}
		</script>
	</div>
)}


<style scoped>
/* 樱花容器 */
.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}

/* 单个樱花 */
.sakura {
  position: absolute;
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #ffb3ba 0%, #ff9a9e 100%);
  border-radius: 50% 0 50% 0;
  opacity: 0;
  box-shadow: 0 0 2px rgba(255, 188, 198, 0.8);
  filter: blur(0.5px);
  top: -20px;
  animation: 
    sakura-fall linear infinite,
    sakura-swing ease-in-out infinite,
    sakura-fade var(--fade-duration, 5s) forwards;
}

/* 樱花飘落动画 */
@keyframes sakura-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

/* 樱花摆动动画 */
@keyframes sakura-swing {
  0%, 100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  25% {
    transform: translateX(5px) translateY(calc(25vh)) rotate(90deg);
  }
  50% {
    transform: translateX(0) translateY(calc(50vh)) rotate(180deg);
  }
  75% {
    transform: translateX(-5px) translateY(calc(75vh)) rotate(270deg);
  }
}

/* 樱花淡入淡出效果 */
@keyframes sakura-fade {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
  }
}

/* 不同大小的樱花 */
.sakura.small {
  width: 6px;
  height: 6px;
  --fall-duration: 15s;
  --swing-duration: 3s;
  --fade-duration: 15s;
}

.sakura.medium {
  width: 10px;
  height: 10px;
  --fall-duration: 20s;
  --swing-duration: 4s;
  --fade-duration: 20s;
}

.sakura.large {
  width: 14px;
  height: 14px;
  --fall-duration: 25s;
  --swing-duration: 5s;
  --fade-duration: 25s;
}

/* 粉色樱花 */
.sakura.pink {
  background: radial-gradient(circle, #ffb3ba 0%, #ff9a9e 100%);
}

/* 白色樱花 */
.sakura.white {
  background: radial-gradient(circle, #ffffff 0%, #f0f0f0 100%);
}

/* 渐变樱花 */
.sakura.gradient {
  background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

/* 樱花飘落方向 */
.sakura.left {
  animation: 
    sakura-fall-left var(--fall-duration, 15s) linear infinite,
    sakura-swing var(--swing-duration, 3s) ease-in-out infinite,
    sakura-fade var(--fade-duration, 15s) forwards;
}

.sakura.right {
  animation: 
    sakura-fall-right var(--fall-duration, 15s) linear infinite,
    sakura-swing var(--swing-duration, 4s) ease-in-out infinite,
    sakura-fade var(--fade-duration, 15s) forwards;
}

.sakura.center {
  animation: 
    sakura-fall var(--fall-duration, 15s) linear infinite,
    sakura-swing var(--swing-duration, 2s) ease-in-out infinite,
    sakura-fade var(--fade-duration, 15s) forwards;
}

/* 樱花飘落动画 - 左侧 */
@keyframes sakura-fall-left {
  to {
    transform: translateY(100vh) translateX(-20vw) rotate(360deg);
  }
}

/* 樱花飘落动画 - 右侧 */
@keyframes sakura-fall-right {
  to {
    transform: translateY(100vh) translateX(20vw) rotate(360deg);
  }
}

/* 樱花飘落动画 - 中间 */
@keyframes sakura-fall-center {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}
</style>

```

### 自定义sakura.css

这个css写的不是很好，我个人没有用css样式生成的樱花，而是采用canvas图片绘画而成的

```js title="src\styles\sakura.css"
/* 樱花容器 */
.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}

/* 单个樱花 */
.sakura {
  position: absolute;
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #ffb3ba 0%, #ff9a9e 100%);
  border-radius: 50% 0 50% 0;
  opacity: 0;
  box-shadow: 0 0 2px rgba(255, 188, 198, 0.8);
  filter: blur(0.5px);
  top: -20px;
  animation: 
    sakura-fall linear infinite,
    sakura-swing ease-in-out infinite,
    sakura-fade var(--fade-duration, 5s) forwards;
}

/* 樱花飘落动画 */
@keyframes sakura-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

/* 樱花摆动动画 */
@keyframes sakura-swing {
  0%, 100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  25% {
    transform: translateX(5px) translateY(calc(25vh)) rotate(90deg);
  }
  50% {
    transform: translateX(0) translateY(calc(50vh)) rotate(180deg);
  }
  75% {
    transform: translateX(-5px) translateY(calc(75vh)) rotate(270deg);
  }
}

/* 樱花淡入淡出效果 */
@keyframes sakura-fade {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
  }
}

/* 不同大小的樱花 */
.sakura.small {
  width: 6px;
  height: 6px;
  --fall-duration: 15s;
  --swing-duration: 3s;
  --fade-duration: 15s;
}

.sakura.medium {
  width: 10px;
  height: 10px;
  --fall-duration: 20s;
  --swing-duration: 4s;
  --fade-duration: 20s;
}

.sakura.large {
  width: 14px;
  height: 14px;
  --fall-duration: 25s;
  --swing-duration: 5s;
  --fade-duration: 25s;
}

/* 粉色樱花 */
.sakura.pink {
  background: radial-gradient(circle, #ffb3ba 0%, #ff9a9e 100%);
}

/* 白色樱花 */
.sakura.white {
  background: radial-gradient(circle, #ffffff 0%, #f0f0f0 100%);
}

/* 渐变樱花 */
.sakura.gradient {
  background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

/* 樱花飘落方向 */
.sakura.left {
  animation: 
    sakura-fall-left var(--fall-duration, 15s) linear infinite,
    sakura-swing var(--swing-duration, 3s) ease-in-out infinite,
    sakura-fade var(--fade-duration, 15s) forwards;
}

.sakura.right {
  animation: 
    sakura-fall-right var(--fall-duration, 15s) linear infinite,
    sakura-swing var(--swing-duration, 4s) ease-in-out infinite,
    sakura-fade var(--fade-duration, 15s) forwards;
}

.sakura.center {
  animation: 
    sakura-fall var(--fall-duration, 15s) linear infinite,
    sakura-swing var(--swing-duration, 2s) ease-in-out infinite,
    sakura-fade var(--fade-duration, 15s) forwards;
}

/* 樱花飘落动画 - 左侧 */
@keyframes sakura-fall-left {
  to {
    transform: translateY(100vh) translateX(-20vw) rotate(360deg);
  }
}

/* 樱花飘落动画 - 右侧 */
@keyframes sakura-fall-right {
  to {
    transform: translateY(100vh) translateX(20vw) rotate(360deg);
  }
}

/* 樱花飘落动画 - 中间 */
@keyframes sakura-fall-center {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}
```

`SakuraEffect.astro`组件在`src\layouts\MainGridLayout.astro`引用

```js title="src\layouts\MainGridLayout.astro" ins={5,23-24}
import BackToTop from "@components/control/BackToTop.astro";
import Footer from "@components/Footer.astro";
import Navbar from "@components/Navbar.astro";
import SideBar from "@components/widget/SideBar.astro";
import SakuraEffect from "@/components/effects/SakuraEffect.astro";
import type { MarkdownHeading } from "astro";
import { Icon } from "astro-icon/components";
import ImageWrapper from "../components/misc/ImageWrapper.astro";
import TOC from "../components/widget/TOC.astro";
import { siteConfig } from "../config";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "../constants/constants";
import Layout from "./Layout.astro";

// ....省略



<Layout title={title} banner={banner} description={description} lang={lang} setOGTypeArticle={setOGTypeArticle}>
<!-- 樱花特效 -->
<SakuraEffect/>
<!-- Navbar -->
    
// ....省略
```

## 注意事项

1. **性能影响**：樱花特效会消耗一定的 CPU 和内存资源
2. **用户体验**：过多的樱花可能影响用户阅读内容
3. **设备兼容**：在低性能设备上可能影响页面流畅度
4. **可访问性**：动画可能对某些用户造成不适
5. **透明度设置**：`opacity.min` 和 `opacity.max` 控制樱花的透明度范围
6. **消失速度**：`fadeSpeed` 不应大于 `opacity.min`，否则樱花可能不会完全消失

## 常见问题

**Q: 如何禁用樱花特效？** A: 将 `enable` 设置为 `false`

**Q: 樱花数量多少合适？** A: 建议在 10-30 个之间，根据网站性能调整

**Q: 如何调整樱花飘落速度？** A: 修改 `speed` 配置中的数值，数值越大速度越快

**Q: 樱花会影响页面性能吗？** A: 会有一定影响，建议在低性能设备上减少樱花数量

**Q: 如何自定义樱花颜色？** A: 通过 CSS 覆盖 `.sakura` 类的背景样式

**Q: 樱花在哪些页面显示？** A: 默认在所有页面显示，可以通过代码控制特定页面显示

**Q: 如何调整樱花层级？** A: 修改 `zIndex` 值，确保樱花在合适的层级显示

**Q: 如何调整樱花透明度？** A: 修改 `opacity.min` 和 `opacity.max` 值，控制樱花的透明度范围

**Q: 樱花消失太快怎么办？** A: 减小 `fadeSpeed` 的值，让樱花消失得更慢

**Q: 樱花不消失怎么办？** A: 确保 `fadeSpeed` 不大于 `opacity.min`，否则樱花可能不会完全消失