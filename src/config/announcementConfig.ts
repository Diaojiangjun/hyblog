import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "公告",

	// 公告内容
	content: "欢迎来到我的博客！迅雷APP搜索：【鹏摇星海】，即可获取网盘所有内容",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: false,
		// 链接文本
		text: "",
		// 链接 URL
		url: "",
		// 内部链接
		external: false,
	},
};
