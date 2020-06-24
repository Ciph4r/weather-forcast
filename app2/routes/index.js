const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')
const redis = require('redis')
const REDIS_PORT = 6379
const client = redis.createClient(REDIS_PORT)
/* GET home page. */

const checkForData =  async (req , res, next) => {

  try {
    const data = await client.get('redisData' , async (err , info) => {
      if (info === null){
        console.log('null call')
        return next()
      }

      const currentDate = await Date.now()
      const newData= await JSON.parse(info)
      const redisDate = newData.date
      

      if(+currentDate < +redisDate + 200 *1000){
        newData.word = 'cache'
        return res.render('index',  {newData})
       
      }
        next()
    })
  } catch (err){
    next(err)
  }


}




router.get('/', controller.home)
router.post('/' , checkForData, controller.zipcode)
router.get('/test',controller.test)



module.exports = router;
