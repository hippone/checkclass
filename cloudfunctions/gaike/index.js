// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
// 云函数入口函数
exports.main = async (event, context) => {
     //调用云函数修改课表
     switch(event.dijijie){
        case 1: cloud.database().collection('classroom_list')
                .doc(event.roomid)
                .update({
                    data:{
                    'kebiao.0.sw1':1
                    }
                });break
        case 2: cloud.database().collection('classroom_list')
                .doc(event.roomid)
                .update({
                    data:{
                    'kebiao.0.sw2':1
                    }
                });break
        case 3: cloud.database().collection('classroom_list')
                .doc(event.roomid)
                .update({
                    data:{
                    'kebiao.0.xw1':1
                    }
                });break
        case 4: cloud.database().collection('classroom_list')
                .doc(event.roomid)
                .update({
                    data:{
                    'kebiao.0.xw2':1
                    }
                });break
        case 5: cloud.database().collection('classroom_list')
                .doc(event.roomid)
                .update({
                    data:{
                    'kebiao.0.sws':1
                    }
                });break
        default:break;
    }
}