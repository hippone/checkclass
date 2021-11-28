// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let openid=wxContext.OPENID
    cloud.database().collection('booking')
    .where({
        _id:event.id,
    }) .update({
        data:{
           reservations:{
               "qty":_.inc(1),
               "attendees":_.push([openid])
           }
       }
   })

}