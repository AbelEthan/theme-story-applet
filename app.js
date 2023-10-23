//app.js
App({
    onLaunch: function () {
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let capsule = wx.getMenuButtonBoundingClientRect();
                if (capsule) {
                    this.globalData.Custom = capsule;
                    this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
                } else {
                    this.globalData.CustomBar = e.statusBarHeight + 50;
                }
            }
        })
    },
    async call(obj, number = 0) {
        const that = this
        if (that.cloud == null) {
            that.cloud = new wx.cloud.Cloud({
                resourceAppid: 'wxefd322904e8fe89d', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
                resourceEnv: 'prod-0gixsl2ic920f296', // 微信云托管的环境ID
            })
            await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
        }
        try {
            const result = await that.cloud.callContainer({
                path: obj.path, // 填入业务自定义路径和参数，根目录，就是 / 
                method: obj.method || 'GET', // 按照自己的业务开发，选择对应的方法
                // dataType:'text', // 如果返回的不是json格式，需要添加此项
                header: {
                    'X-WX-SERVICE': 'theme-story', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
                    // 其他header参数
                },
                data: obj.data
                // 其余参数同 wx.request
            })
            return result.data // 业务数据在data中
        } catch (e) {
            const error = e.toString()
            // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
            if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
                return new Promise((resolve) => {
                    setTimeout(function () {
                        resolve(that.call(obj, number + 1))
                    }, 300)
                })
            } else {
                throw new Error(`微信云托管调用失败${error}`)
            }
        }
    },
    globalData: {
    }
})