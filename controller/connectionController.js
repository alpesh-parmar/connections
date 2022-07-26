const db = require("../config/db.config");
const dbusers = require("../model");
const ConnectionModel = dbusers.CONNECTIONMODEL;
const GroupModel = dbusers.GROUPSMODEL;

const bcrypt = require("bcrypt");
const { Pool, Client } = require("pg");
const client = new Client(db.dbconfig);
const emailhelper = require('../middlewares/emailHelper');
const emailconfig = require('../middlewares/emailconfig');
var jwt = require('jsonwebtoken');
const req = require("express/lib/request");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

require('dotenv').config();

exports.create = async (req, res, next) => {


    if (req.files != null) {
        var file = req.files.profile_pic
        if (file != null && file != '') {
            var filename = 'profile_pic_' + Date.now() + '_' + file.name
            file.mv('./uploads/' + filename, function (err) {
                if (err) {
                    res.send(err)
                } else {

                }
            })
        }
    }

    const smlData = JSON.parse(req.body.sml);
    if (smlData === undefined) {
    } else {
        var filtered = smlData.filter(function (el) {
            return el != null;
        });
        var socialMediaLinks = filtered.map(function (item) {
            if (item === null) { } else {
                return item['social_media_links'];
            }
        });   
    }


    const connectiondetails = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        about:req.body.about,
        profile_pic:filename,
        website:req.body.website,      
        social_media_links:socialMediaLinks,  
        createddate: Date.now(),
    };    
    // Save Rsvp Settings detail in the database
    await ConnectionModel.create(connectiondetails)
        .then((result) => {

            if (result.id > 0) {

                return res.status(200).send({
                    result,
                    message: "Record saved successfully",
                    success: 1
                });


            }

        })
        .catch(err => {
            //console.log(err.message);
            res.status(500).send({

                message: err.message || "Some error occurred while creating the User.",
                success: 0
            });
        });
}

exports.importConnection = async (req, res, next) => {    


    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    });
    
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        for (var i = 0; i < req.body.length; i++) {
            
            if(req.body[i]['first_name'] != "" && req.body[i]['last_name'] != "" && req.body[i]['email'] != ""){
                //console.log("INSERT INTO public.directorys (first_name, last_name, email) VALUES ('"+req.body[i]['first_name']+"', '"+req.body[i]['last_name']+"', '"+req.body[i]['email']+"')")
                
                const phoneno = req.body[i]['phone_no'] != "" ? req.body[i]['phone_no'] : ''
                client.query("INSERT INTO public.directorys (first_name, last_name, email,phone_no) VALUES ('"+req.body[i]['first_name']+"', '"+req.body[i]['last_name']+"', '"+req.body[i]['email']+"','"+phoneno+"')", async (err, response) => {
        
                    if (err) {
                        return console.error('error running query', err);
                    }                                    
                    
                }); 
            }
        }
        return res.status(200).send({                        
            message: "Record saved successfully",
            success: 1
        })
    });
    


    
    
   

    return false


     
    
    
}

exports.update = async (req, res, next) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    });
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        if (req.files != null) {
            var file = req.files.profile_pic
            if (file != null && file != '') {
                var filename = 'profile_pic_' + Date.now() + '_' + file.name
                file.mv('./uploads/' + filename, function (err) {
                    if (err) {
                        res.send(err)
                    } else {
    
                    }
                })
            }
        }
    
        // const smlData = JSON.parse(req.body.sml);        
        // if (smlData === undefined) {
        // } else {
        //     var filtered = smlData.filter(function (el) {
        //         return el != null;
        //     });
        //     var socialMediaLinks = filtered.map(function (item) {
        //         if (item === null) { } else {
        //             return item['social_media_links'];
        //         }
        //     });   
        // }
    
    
        const connectiondetails = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            about:req.body.about,
            profile_pic:filename,
            website:req.body.website,
            address:req.body.address,                  
            createddate: Date.now(),
        };   

        ConnectionModel.update(connectiondetails, {
            where: { id: req.body.id }
        })
            .then(num => {
                if (num == 1) {
                    res.status(200).send({
                        success: 1,
                        message: "Record updated successfully"

                    })
                } else {
                    res.send({
                        success: 0,
                        message: "Record not updated"
                    })
                }
            })
            .catch(err => {
                res.status(500).send({
                    success: 0,
                    message: "Error updating record"
                })
            })
        client.end();

    });


}
exports.getConnections = async (req, res, next) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    });     
    await client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        
            ConnectionModel.findAll({  
                order: [['id', 'DESC'],]
             })
            .then(result => {
                res.status(200).send({
                    result
                })
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some Error occurred while retriving records"
                })
            })
        client.end();
    });
    // next();
}


exports.deleteConnection = async (req, res,next) => {

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    });

    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } 
        //Custom Form Delete Start
        ConnectionModel.destroy({
            where:{id: req.params.id}   
        })
        .then(num=>{
            if(num ==1){            
                res.status(200).send({
                    id:num,
                    message:"Record deleted successfully",
                    success:1
                })           
            }else{
                res.send({
                    message:"Record not deleted"
                })
            }
        })
        .catch(err=>{
            res.status(500).send({
                message:"Error deleting record"
            })
        })
        // Custom Form Delete End
        client.end(); 

    });

};
