// pages/check/check.js
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command
let downtime   //预约结束时间
let intro='换个教室'  //预约目的
let dijijie=6       //第几节课
let adduser='' //这是选中的预约的_id
let today = new Date()
let sw1 = new Date(today.getFullYear(),today.getMonth(),today.getDate(),9,40,0)
let sw2 = new Date(today.getFullYear(),today.getMonth(),today.getDate(),12,0,0)
let xw1 = new Date(today.getFullYear(),today.getMonth(),today.getDate(),16,10,0)
let xw2 = new Date(today.getFullYear(),today.getMonth(),today.getDate(),18,0,0)
let ws = new Date(today.getFullYear(),today.getMonth(),today.getDate(),20,40,0)
let useropen
Page({
    data: {
        now:'',
        next:'',
        day:0,
        week:0,
        id:'',//教室的id
        todaylist:{},
        jilu:[],
        sw1:true,
        sw2:true,
        xw1:true,
        xw2:true,
        ws:true,
        meike:false,  //没课的提示是否显示
        vacation:false,
        xianshi:true, //页面上方显示列表是否显示
        using: ["想换教室了", "开个小会", "自习","其他","上边有了，但我跟他不是一队"],
        usingIndex: 0,
    },
    onLoad: function (options) {
       //进入页面刷新缓存
        adduser=''
        dijijie=6
        intro='换个教室'
        downtime
        //获取openid
        this.getopen()

        let day=options.day*1//传过来的参数属性变为number 
        let next=options.next
        let now=options.now
        let id=options.id //教室id
        let week=options.week*1 //传过来的参数属性变为number 
        //传过来的参数赋值给data
        this.setData({
            next:next,
            now:now,
            day:day,
            id:id,
            week:week
        })
        console.log(options)
        this.checkkebiao(id,week,day)
        this.getlist()
    },
    //判断时间过了没有  
    checkkebiao(id,week,day){
        db.collection('classroom_list').aggregate()
        .match({
            _id:id
        }) .project({
            kebiao: $.filter({
            input: '$kebiao',
            as: 'item',
            cond:   $.eq(['$$item.day', day])
        }),
      }) 
        .project({
            kebiao: $.filter({
            input: '$kebiao',
            as: 'item',
            cond:   $.eq(['$$item.week', week])
        }),
        })
      .end()
      .then(res => {
        console.log('返回课程信息', res.list[0])
        this.setData({
            todaylist:res.list
        })
        if(res.list[0].kebiao[0]==null){
            this.setData({
                vacation:true
            })
        }
        this.panduan()
    })
    
    },
    //检查是否有重复的预约(目的 时间 教室都重复) ，如果没有添加新预约
    addbooking(){
        let id=this.data.id
        let week=this.data.week
        let day=this.data.day
        if(dijijie==6){
            wx.showToast({
                icon:'none',
                title: '选第几节啊？瞎啊',
                })
        }else{
            db.collection('booking').where({
                roomid:id,
                intro:intro,
                week:week,
                day:day,
                dijijie:dijijie
            }).get()
            .then(res=>{  
                console.log('查询结果',res.data)
                //检查到没有相同的预约，添加一条
                if(res.data[0]==null){  
                    switch(dijijie){
                        case 1:  downtime=sw1; break;
                        case 2:  downtime=sw2; break;
                        case 3:  downtime=xw1; break;
                        case 4:  downtime=xw2; break;
                        case 5:  downtime=ws; break;
                        default: downtime=new Date(today.getFullYear(),today.getMonth(),today.getDate(),21,0,0);break;
                    }          
                    db.collection('booking')
                    .add({
                        data:{
                        roomid:id,
                        intro:intro,
                        week:week,
                        day:day,
                        downtime:downtime,
                        dijijie:dijijie,
                        reservations: {
                            "qty": 1, // 已预订人数
                            "attendees": [useropen] // 参与人员ID
                        },
                        }
                    }).then(res=>{
                        console.log('添加成功',res)
                        this.getlist()
                    })
                }else{
                    wx.showToast({
                        icon:'none',
                        title: '你这上边有了，不行你就跟他用一个教室得了 反正你俩都是干这个',
                        })
                    this.getlist()
                }   
            })
        }
    },  
    //获取已有的预约记录
    getlist(){
        let id=this.data.id
        db.collection('booking').where({
            roomid:id,
            downtime: _.gt(new Date()),
            reservations:{
                "qty":_.lt(5)
            },
        }).get().then(res=>{
            console.log('查询已经有预约记录的',res.data)
            if(res.data[0]==null){
                this.setData({
                    xianshi:false
                })
            }
            this.setData({
                jilu:res.data
            })
        })
    },
    //判断今天是第几节课 让已经上过的课不显示
    panduan(){
        let todke=this.data.todaylist
        // console.log('测试对不对',todke[0].kebiao[0].sw1)
        //日期的大小判断
        console.log('第一节课的时间',sw1)
        console.log('第二节课的时间',sw2)
        console.log('第三节课的时间',xw1)
        console.log('第四节课的时间',xw2)
        console.log('第五节课的时间',ws)
        console.log('today',today)
//       this.chenggong()//看有没有成功预约的，成功预约的记作有课   
        //如果时间过了不能选 时间没过并且没课的才能选
        if(this.data.vacation){
            this.setData({
                sw1:false,
                sw2:false,
                xw1:false,
                xw2:false,
                ws:false,
            })
        }
        else{
            if (sw1>today)
            {
                if(todke[0].kebiao[0].sw1==1){
                console.log("今天是9点40之前");
                this.setData({
                    sw1:false
                })}
            }else{
                console.log("今天是9点40之后");
                this.setData({
                    sw1:false
                })
            }
            if (sw2>today)
            {
                if(todke[0].kebiao[0].sw2==1){
                console.log("今天是12点之前");
                this.setData({
                    sw2:false
                })}
            }else{
                console.log("今天是12点之后");
                this.setData({
                    sw2:false
                })
            }
            if (xw1>today)
            {
                if(todke[0].kebiao[0].xw1==1){
                console.log("今天是16点10分之前");
                this.setData({
                    xw1:false
                })}
            }else{
                console.log("今天是16点10分之后");
                this.setData({
                    xw1:false
                })
            }
            if (xw2>today)
            {
                if(todke[0].kebiao[0].xw2==1){
                console.log("今天是18点之前");
                this.setData({
                    xw2:false
                })}
            }else{
                console.log("今天是18点之后");
                this.setData({
                    xw2:false
                })
            }
            if (ws>today)
            {
                if(todke[0].kebiao[0].ws==1){
                console.log("今天是21点之前");
                this.setData({
                    ws:false
                })}
            }else{
                console.log("今天是21点之后");
                this.setData({
                    ws:false
                })
            }
        }
        if(this.data.sw1==false&&this.data.sw2==false&&this.data.xw1==false&&this.data.xw2==false&&this.data.ws==false){
            console.log('满房')
            this.setData({
                meike:true
            })
        }
    }, 
    //获取预约用途
    getIntro(e){
        console.log('picker account 发生选择改变，携带值为', e.detail.value);
        this.setData({
            usingIndex:e.detail.value
        })
        if(e.detail.value==0){
            intro="换教室"
        }else if(e.detail.value==1){
            intro="开小会"
        }else if(e.detail.value==2){
            intro="自习"
        }else if(e.detail.value==3){
            intro="其他"
        }else if(e.detail.value==4){
            intro="上边有了，但我跟他不是一队"
        }
    },
    //获取预约第几节课
    timeChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
            dijijie=parseInt(e.detail.value)
        switch(dijijie){
            case 1: downtime=sw1;break;
            case 2: downtime=sw2;break;
            case 3: downtime=xw1;break;
            case 4: downtime=xw2;break;
            case 5: downtime=ws;break;
        }
    },
    //选择上边的预约记录
    juluchange(e){
        console.log('我的值是', e.detail.value)
        adduser=e.detail.value
    },
    //未验证一人只能操作一次
    existed(){
        if (adduser=='') {
            wx.showToast({
                icon:'none',
                title: '你先选',
                })
        }else{
            db.collection('booking').where({
                _id:adduser,
                'reservations.attendees':useropen
            }).get().then(res=>{
                console.log('查询到这个人有没有预约过',res)
                //如果没有预约 则给这个人选中预约 人数加一
                if(res.data[0]==null){
                    wx.cloud.callFunction({
                        name:'tianjia',
                        data:{
                            id:adduser
                        }
                    })
                    .then(res=>{
                        console.log('人数增长成功',res)
                        this.getlist()
                        this.upkebiao()
                    })
                }else{
                    wx.showToast({
                        icon:'none',
                        title: '大哥，你已经申请预约了，别重选了'
                        })
                }
            })
       
    }
    },
    //查询成功，修改课表 
    upkebiao(){
        db.collection('booking').where({
            _id:adduser
        }).get().then(res=>{
            console.log('查询增长后的值',res.data)
            if(res.data[0].reservations.qty==5)
            {
                //调用云函数修改课表
                wx.cloud.callFunction({
                    name:'gaike',
                    data:{
                        roomid:this.data.id,
                        dijijie:res.data[0].dijijie
                    }
                }).then(res=>{
                    console.log('我修改课表成功了')
                })
                //   跳转
                    wx.navigateTo({
                    url: '/pages/success/success'
                    })
            }
        }) 
    },
    //获取openid
    getopen(){
        //获取openid
        wx.cloud.callFunction({
            name:"updata"
        }).then(res=>{
            console.log('调用成功',res.result.openid)
            useropen=res.result.openid
        })
    },
    // onShareAppMessage() {
    //     const promise = new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve({
    //         title: '水院校园便民',
    //         imageUrl:'/images/logo.png'
    //         })
    //     }, 2000)
    //     })
    //     return {
    //     title: '水院校园便民',
    //     path: '/page/index/index',
    //     promise 
    //     }
    // },
})