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
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const credentials = {
    user: process.env.USER,//  "postgres",
    host: process.env.HOST,//"localhost",
    database: process.env.DB_NAME,//"Triage",
    password: process.env.PASS,// "Admin@123",
    port: 5432,
};


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


    const client = new Client(credentials);
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

exports.updateSettings = async (req, res, next) => {
    const client = new Client(credentials);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        const rsvpsettingsdetails = {
            rsvp_event_id: req.body.rsvp_event_id,
            rsvp_event_mode: req.body.rsvp_event_mode,
            rsvp_event_id: req.body.rsvp_event_id,
            rsvp_by_date: req.body.rsvp_by_date,
            rsvp_by_time: req.body.rsvp_by_time,
            rsvp_individual: req.body.rsvp_individual,
            rsvp_individual_set_guest_limit: req.body.rsvp_individual_set_guest_limit,
            rsvp_individual_allow_invitee_to_name: req.body.rsvp_individual_allow_invitee_to_name,
            rsvp_group: req.body.rsvp_group,
            rsvp_status: req.body.rsvp_status,
            rsvp_event_capacity: req.body.rsvp_event_capacity,
            rsvp_group_set_guest_limit: req.body.rsvp_group_set_guest_limit,
            rsvp_group_allow_invitee_to_name: req.body.rsvp_group_allow_invitee_to_name,
            rsvp_support_email_address: req.body.rsvp_support_email_address,
            rsvp_support_contact_no: req.body.rsvp_support_contact_no,
            rsvp_guest_first_reminder: req.body.rsvp_guest_first_reminder,
            rsvp_guest_second_reminder: req.body.rsvp_guest_second_reminder,
            rsvp_guest_first_reminder_date: req.body.rsvp_guest_first_reminder_date ? req.body.rsvp_guest_first_reminder_date : null,
            rsvp_guest_second_reminder_date: req.body.rsvp_guest_second_reminder_date ? req.body.rsvp_guest_second_reminder_date : null,
            updatedby: req.body.updatedby,
            updateddate: Date.now(),
        };

        RsvpSettingsModel.update(rsvpsettingsdetails, {
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
    const client = await new Client(credentials);
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

    const client = await new Client(credentials);

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