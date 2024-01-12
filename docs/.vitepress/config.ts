import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
import { head, nav } from './configs'
import { defineConfig } from 'vitepress';
export default defineConfig({
    lang: 'zh-CN',
    title: "攻城狮",
    description: "深掘前沿，分享实用经验",
    head,
    lastUpdated: true,
    cleanUrls: true,
    vite: {
        plugins: [AutoSidebar({
            ignoreList: ["index.md"],
            ignoreIndexItem: true,
            collapsed: true,
            titleFromFile: true,

        })]
    },
    /* markdown 配置 */
    markdown: {
        lineNumbers: true
    },

    /* 主题配置 */
    themeConfig: {
        i18nRouting: false,
        nav,
        /* 右侧大纲配置 */
        outline: {
            level: 'deep',
            label: '本页目录'
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/maomao1996/vitepress-fe-nav' }],

        footer: {
          message: '如有转载或 CV 的请标注本站原文地址',
          copyright: 'Copyright © 2019-present didiplus'
        },
    
        darkModeSwitchLabel: '外观',
        returnToTopLabel: '返回顶部',
        lastUpdatedText: '上次更新',
    
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        }

    }
}) 