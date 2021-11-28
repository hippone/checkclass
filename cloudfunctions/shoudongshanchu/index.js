// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
        cloud.database().collection('classroom_list').where({
            floor:"1"
        })
        .update({
            data:{
                kebiao:_.pull({
                    week:event.week,
                    day:event.day
                })
            }
        })
        cloud.database().collection('classroom_list').where({
            floor:"2"
        })
        .update({
            data:{
                kebiao:_.pull({
                    week:event.week,
                    day:event.day
                })
            }
        })
        cloud.database().collection('classroom_list').where({
            floor:"3"
        })
        .update({
            data:{
                kebiao:_.pull({
                    week:event.week,
                    day:event.day
                })
            }
        })
        cloud.database().collection('classroom_list').where({
            floor:"4"
        })
        .update({
            data:{
                kebiao:_.pull({
                    week:event.week,
                    day:event.day
                })
            }
        })
        cloud.database().collection('classroom_list').where({
            floor:"5"
        })
        .update({
            data:{
                kebiao:_.pull({
                    week:event.week,
                    day:event.day
                })
            }
        })

}