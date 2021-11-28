const db = wx.cloud.database()
const $ = db.command.aggregate
Page({
    data:{

    },
    onLoad:function(option){
    //    wx.cloud.callFunction({
    //        name:'shoudongshanchu',
    //        data:{
    //            week:8,
    //            day:5
    //        }
    //    })
    },
    onShareAppMessage() {
        const promise = new Promise(resolve => {
        setTimeout(() => {
            resolve({
            title: '水院校园便民',
            imageUrl:'/images/logo.png'
            })
        }, 2000)
        })
        return {
        title: '水院校园便民',
        path: '/page/index/index',
        promise 
        }
    },
    onShareTimeline(){
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({
                title: '水院校园便民',
                imageUrl:'/images/logo.png'
                })
            }, 2000)
            })
            return {
            title: '水院校园便民',
            path: '/page/index/index',
            promise 
            }
    }
})