const express=require('express')
const {createDistributionCtrl,fetchDistributionCtl}=require('../controllers/inventoryCtl')

const inventoryRoute=express.Router()

inventoryRoute.post('/move',createDistributionCtrl)
inventoryRoute.get('/fetchmove',fetchDistributionCtl)
module.exports=inventoryRoute