// pages/poetry/five.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        poetryList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        //发起网络请求
        const res = await app.call({
            path: '/poetry/list/dynasty',
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            data: {
                dynasty: '五代'
            },
        })

        this.setData({
            poetryList: res.data
        })

        console.log(this.data.poetryList)
    }
})