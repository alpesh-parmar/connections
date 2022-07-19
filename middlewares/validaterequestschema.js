const express = require('express');
const { validationResult } = require("express-validator/check");
exports.validateRequestschema =  async (req,res,next)=>{
//const validateRequestschema=  (req,res,next)=>{
    const errors= await validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()})
    }
 next();
};


