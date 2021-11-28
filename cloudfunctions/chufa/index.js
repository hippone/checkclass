// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
        var d = new Date();
        var yue=d.getMonth()+1;
        var ri=d.getDate();
        var zhou =d.getDay();// 把周几写进去
        var s2 = "2021/"+yue+"/"+ri
        var s1  =  "2021/8/30"    
        let aDate1  =  s1.split("/")
        let oDate1  =  new  Date(aDate1[1]  +  '/'  +  aDate1[2]  +  '/'  +  aDate1[0])    //转换为12-18-2006格式  
        let aDate2  =  s2.split("/")  
        let oDate2  =  new  Date(aDate2[1]  +  '/'  +  aDate2[2]  +  '/'  +  aDate2[0])  
        let  iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24 /7+1 ) //把相差的毫秒数转换为第几周 
            cloud.database().collection('classroom_list')
            .where({
                floor:"1"
            })
            .update({
                data:{
                    kebiao:_.pull({
                        week:iDays,
                        day:zhou
                    })
                }
            })
            cloud.database().collection('classroom_list')
            .where({
                floor:"2"
            })
            .update({
                data:{
                    kebiao:_.pull({
                        week:iDays,
                        day:zhou
                    })
                }
            })
            cloud.database().collection('classroom_list')
            .where({
                floor:"3"
            })
            .update({
                data:{
                    kebiao:_.pull({
                        week:iDays,
                        day:zhou
                    })
                }
            })
            cloud.database().collection('classroom_list')
            .where({
                floor:"4"
            })
            .update({
                data:{
                    kebiao:_.pull({
                        week:iDays,
                        day:zhou
                    })
                }
            })
            cloud.database().collection('classroom_list')
            .where({
                floor:"5"
            })
            .update({
                data:{
                    kebiao:_.pull({
                        week:iDays,
                        day:zhou
                    })
                }
            })
        

}