// pages/textbook/home/home.js
const app = getApp();
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        list: [],
    },
    methods: {
        async getList() {
            //发起网络请求
            const res = await app.call({
                path: '/poetry/textbook/group',
                method: 'GET'
            })
            const typeList = res.data
            let arr = []
            for (const type in typeList) {
                const elements =  typeList[type]
                const element = elements[0];
                arr.push({
                    'type': type, 
                    'typeValue': element.typeValue, 
                    'elements': elements
                })
            }
            this.setData({
                list: arr,
            })
        },
        tabSelect(e) {
            this.setData({
              TabCur: e.currentTarget.dataset.id,
              MainCur: e.currentTarget.dataset.id,
              VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
            })
          },
          VerticalMain(e) {
            let that = this;
            let list = this.data.list;
            let tabHeight = 0;
            if (this.data.load) {
              for (let i = 0; i < list.length; i++) {
                let view = wx.createSelectorQuery().select("#main-" + list[i].id);
                view.fields({
                  size: true
                }, data => {
                  list[i].top = tabHeight;
                  tabHeight = tabHeight + data.height;
                  list[i].bottom = tabHeight;     
                }).exec();
              }
              that.setData({
                load: false,
                list: list
              })
            }
            let scrollTop = e.detail.scrollTop + 20;
            for (let i = 0; i < list.length; i++) {
              if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                that.setData({
                  VerticalNavTop: (list[i].id - 1) * 50,
                  TabCur: list[i].id
                })
                return false
              }
            }
          }
    },
    async attached() {
        this.getList();
    },
})