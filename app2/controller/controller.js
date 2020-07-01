require('dotenv').config()
const axios = require('axios')
const zipKey = process.env.ZIPCODEKEY
const weatherKey = process.env.DARKKEY
const redis = require('redis')
const REDIS_PORT = 6379
const client = redis.createClient(REDIS_PORT)
const moment = require('moment')
module.exports = {
    home: (req,res, next) => {
        const newData = {
            data:{
                data:[]
            }
        }
     
            res.render('index',{newData})
    },

    zipcode: async (req,res , next) => {

        try {
            const zipUrl = `https://www.zipcodeapi.com/rest/${zipKey}/info.json/${req.body.zipcode}/degrees`
            const zipResult = await axios.get(zipUrl)
            const lat = zipResult.data.lat
            const lng = zipResult.data.lng
            const weatherUrl = `https://api.darksky.net/forecast/${weatherKey}/${lat},${lng}`
            const weatherResult = await axios.get(weatherUrl)
            const data = weatherResult.data.daily
            const currentDate = await Date.now()
            let newData = {}
            newData.date = currentDate
            newData.data = data
            newData.word = 'db'

            newData.data.data.forEach(data => {
                console.log(data.time)
                data.time = moment.unix(data.time).format('MMMM Do YYYY, h:mm a')
                
            })

            await client.setex(`${req.body.zipcode}` , 18000 , JSON.stringify(newData))
            console.log('db')
           

            return  res.render('index',{newData})
          }catch (err){
            console.log(err)
          }

    }





    
}