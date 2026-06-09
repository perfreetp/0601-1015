export default defineAppConfig({
  pages: [
    'pages/square/index',
    'pages/skills/index',
    'pages/match/index',
    'pages/chat/index',
    'pages/mine/index',
    'pages/booking/index',
    'pages/credit/index',
    'pages/admin/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '邻里互助',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8FAF5'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#22C55E',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/square/index',
        text: '广场'
      },
      {
        pagePath: 'pages/skills/index',
        text: '技能'
      },
      {
        pagePath: 'pages/match/index',
        text: '匹配'
      },
      {
        pagePath: 'pages/chat/index',
        text: '消息'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
