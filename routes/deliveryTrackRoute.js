const express=require('express')

const {createDeliveryCtrl,fetchDeliveryCtrl}=require('../controllers/deliveryCtrl')
 const deliveryRoute=express.Router()


    deliveryRoute.post('/create',createDeliveryCtrl)
    deliveryRoute.get('/fetch',fetchDeliveryCtrl)

module.exports=deliveryRoute