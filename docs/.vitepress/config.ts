
export default {
  title: '前端源码漫游记',
  description: '前端框架源码一网打尽|Vue3|React|Vite|Cli',
  head: [
    ['link', { rel: 'icon', href: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.ico', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/hugsun.png', type: 'image/png', sizes: '16x16' }],
  ],
  // base:"/src/"
  themeConfig: {
    logo: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/hugsun.png',
    nav: [
      { text: 'Vue3', link: '/vue/' },
      { text: 'React', link: '/react/' },
      { text: 'Vite', link: '/vite/' },
      { text: '框架设计基础', link: '/guide/design' },
      { text: '前端架构师指南', link: 'https://web-architect.netlify.app/' },
      { text: '面试刷题', link: 'https://fullstack-challenges.netlify.app/' },

    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/V3ZHdnZErY' },
      { icon: 'github', link: 'https://github.com/course-dasheng/source-tour' },
      { icon: 'twitter', link: 'https://twitter.com/shengxj1' },
    ],
    sidebar: {
      '/': [
        {
          text: '教程',
          items: [
            { text: '开发步骤', link: '/guide/step' },
            { text: '开发规范', link: '/guide/scripts' },
            { text: '框架设计基础知识', link: '/guide/design' },
          ],
        },
        {
          text: 'Vue',
          items: [
            { text: 'Vue3架构', link: '/vue/' },
            { text: '响应式', link: '/vue/reactive/' },
            { text: '路由vue-router', link: '/vue/reactive/' },
          ],
        },
        {
          text: 'React',
          items: [
            { text: 'React架构介绍', link: '/react/' },
            { text: '组件', link: '/react/container/' },
            { text: '路由', link: '/react/container/' },
            { text: '数据管理', link: '/react/container/' },
          ],
        },
        {
          text: '工程化',
          items: [
            { text: 'webpack', link: '/components/badge/' },
            { text: 'rollup', link: '/components/badge/' },
            { text: 'vite（重要）', link: '/components/badge/' },
            { text: '命令行工具cli', link: '/components/badge/' },
          ],
        },
        {
          text: '工具库',
          items: [
            { text: '工具函数', link: '/components/badge/' },
            { text: 'chrome开发工具', link: '/components/badge/' },
            { text: 'Vscode插件', link: '/components/badge/' },
            { text: 'Vscode插件', link: '/components/badge/' },

          ],
        },

      ],
    },
  },
  markdown: {
    config: (md) => {
    },
  },
}
