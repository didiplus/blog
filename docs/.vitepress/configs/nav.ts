import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [

  {
    text: '数据库', items: [
      { text: 'MySQL', link: '/databases/mysql/index' },
    ]
  },

  {
    text: '数通基础',
    items: [
      { text: "图解网络", link: '/datacom/network/index' },
      { text: "防火墙专栏", link: '/datacom/firewall/index' }
    ]
  },

]