const db = wx.cloud.database()
const $ = db.command.aggregate
Page({
    data:{
       tabs:[],
       tabCur:0,
       lefts:[],
       leftCur:0,
       scrollLeft:0,
       rights:{},
       dijizhou:'',
       zhouji:'',
       dijijie:0
    },
    onLoad:function(option){
    this.weeknum()// 算出现在是第几周 周几 第几节
    this.labor()// 加载教学楼
    },
    //加载出顶部教学楼
    labor(){
        db.collection('classroom_list').aggregate()
        .group({
            _id: '$alaborary'
        })
        .end()
        .then(res => {
            console.log('楼列表', res)
            this.setData({
                tabs: res.list
            })
            this.floor(res.list[0]._id)
        })
    },
    //加载当前所有的楼层   
    floor() {
    let louhao = this.data.tabs[this.data.tabCur]._id
    console.log(louhao)
    db.collection('classroom_list').aggregate()
        .match({
            alaborary:louhao
        })
        .group({
            _id: '$floor'
        })
        .sort({
            _id:-1
        })
        .end()
        .then(res => {
            console.log(louhao + '楼层列表', res)
            this.setData({
                lefts: res.list,
            })
            this.jiaoshihao()
        })
    },
    //每个楼层的教室列表 赋给rights
    jiaoshihao() {
    let louhao = this.data.tabs[this.data.tabCur]._id
    let louceng = this.data.lefts[this.data.leftCur]._id
    let date=this.data.zhouji*1
    let weekd=this.data.dijizhou*1
    db.collection('classroom_list').aggregate()
    .match({
      alaborary:louhao,
      floor:louceng
    })
    .project({
        name:true,
        kebiao: $.filter({
        input: '$kebiao',
        as: 'item',
        cond:   $.eq(['$$item.day', date])
    }),
  }) 
    .project({
        name:true,
        kebiao: $.filter({
        input: '$kebiao',
        as: 'item',
        cond:   $.eq(['$$item.week', weekd])
    }),
    })
  
  .end()
  .then(res => {
      console.log('返回right', res.list)
      this.setData({
        rights:res.list
      })
  })
    },
    //计算天数差的函数，通用  
    weeknum(){
    var d = new Date();
    var yue=d.getMonth()+1;
    var ri=d.getDate();
    var zhou =d.getDay();// 把周几写进去
    console.log('周几',zhou)
    this.setData({
        zhouji:zhou
    })
    var s2 = "2021/"+yue+"/"+ri
    var s1  =  "2021/8/30"    
    this.DateDiff(s1,s2)
    },
    //计算天数差的函数，通用  
    DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式   
    let aDate1  =  sDate1.split("/")
    let oDate1  =  new  Date(aDate1[1]  +  '/'  +  aDate1[2]  +  '/'  +  aDate1[0])    //转换为12-18-2006格式  
    console.log('计算',aDate1)
    let aDate2  =  sDate2.split("/")  
    let oDate2  =  new  Date(aDate2[1]  +  '/'  +  aDate2[2]  +  '/'  +  aDate2[0])  
    let  iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24 /7+1 ) //把相差的毫秒数转换为第几周 
    console.log('计算',aDate2)
    console.log('计算出第几周',iDays)
    this.timeke()   // 算出今天是第几节课
    this.setData({
        dijizhou:iDays
    })//算出第几周
    },
    //查询是第几节课 写入dijijie里边
    timeke(){
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    console.log('获取小时',hour)
    console.log('获取分钟',min)
    switch(hour){
        case 8:this.setData({
            dijijie: 1
        }); break;
        case 9:if(min<40)this.setData({
            dijijie: 1
        });else this.setData({
            dijijie: 2
        }); break;
        case 10:this.setData({
            dijijie: 2
        }); break;
        case 11:this.setData({
            dijijie: 2
        }); break;
        case 14:this.setData({
            dijijie: 3
        }); break;
        case 15:this.setData({
            dijijie: 3
        }); break;
        case 16:if(min<10)this.setData({
            dijijie: 3
        });else this.setData({
            dijijie: 4
        }); break;
        case 17:this.setData({
            dijijie: 4
        }); break;
        case 19:this.setData({
            dijijie: 5
        }); break;
        case 20:if(min<40)this.setData({
            dijijie: 5
        }); break;
            default:this.setData({
                dijijie: 10
            });break;
    }
    console.log(this.data.dijijie)
   
    },//顶部选择分类条目
    tabSelect(e) {
    this.setData({
        tabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 2) * 200
    }, success => {
        this.floor()
    })
    },
    switchLeftTab(e) {
    let index = e.target.dataset.index;
    this.setData({
        leftCur: index,
    }, success => {
        this.jiaoshihao()
    })
    },
    GoToCheck:function(e){
        console.log(e.currentTarget.dataset.now);
        console.log(e.currentTarget.dataset.next);
    wx.navigateTo({
              url: '/pages/check/check?now='+e.currentTarget.dataset.now+'&next='+e.currentTarget.dataset.next+'&week='+e.currentTarget.dataset.week+'&id='+e.currentTarget.dataset.id+'&day='+e.currentTarget.dataset.day
    })
    },
    //分享
    onShareAppMessage() {
        const promise = new Promise(resolve => {
        setTimeout(() => {
            resolve({
            title: '水院校园便民',
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
