const db = require("../config/db.config");
const dbusers = require("../model");
const GroupModel = dbusers.GROUPSMODEL;
const GroupMemberModel = dbusers.GROUPMEMBERSSMODEL;

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

    const memberData = req.body.members;    
    const groupdetails = {
        group_name: req.body.group_name,
        event_mode: req.body.event_mode,
        event_id: req.body.event_id,        
        createddate: Date.now(),
    };    
    // Save Rsvp Settings detail in the database
    await GroupModel.create(groupdetails)
        .then((result) => {

            if (result.id > 0) {

                for (var i = 0; i < memberData.length; i++) {
                    if (memberData[i].id != '' && memberData[i].id != '') {

                        const groupmemberdetail = {      
                            group_id: result.id,
                            member_id: memberData[i].id,
                            createddate: Date.now(),
                        };                        
                        GroupMemberModel.create(groupmemberdetail)
                        .then((response) => {  
                            
                            

        
                        }).catch(err => {                            
                            res.status(500).send({            
                                message: err.message || "Some error occurred while creating the User.",
                                success:0
                            });
                        });
                        
                    }
                }

                


            }

            if(result.id > 0){
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

                        
                        client.query('SELECT G.id,G.key,G.group_name, E.p_event_title AS event_title,(SELECT COUNT(*) FROM public.group_members as GM WHERE GM.group_id = G.id) AS membercounts FROM public.groups as G inner join public.event_parents as E on G.event_id = E.id WHERE G.id ='+ result.id, async (err, response) => {
                
                            if (err) {
                            return console.error('error running query', err);
                        }
                        
                        const datas = response.rows['0']
                        
                        return res.status(200).send({
                                result:datas,
                                message: "Record saved successfully",
                                success: 1
                        })
            
                    }); 
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
exports.updateGroup = async (req, res, next) => {
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

        const groupdetails = {
            group_name: req.body.group_name,
            event_mode: req.body.event_mode,
            event_id: req.body.event_id,        
            createddate: Date.now(),
        };

        GroupModel.update(groupdetails, {
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
exports.getGroups = async (req, res, next) => {
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
        client.query('SELECT G.id,G.event_mode,G.event_id,G.key,G.group_name, E.p_event_title AS event_title,(SELECT COUNT(*) FROM public.group_members as GM WHERE GM.group_id = G.id) AS membercounts FROM public.groups as G inner join public.event_parents as E on G.event_id = E.id ORDER BY G.id DESC', async (err, response) => {
           if (err) {
                return console.error('error running query', err);
            }           
           const datas = response.rows
            return res.status(200).send({
                result:datas
            })
        }); 
    });
    // next();
}
exports.deleteGroup = async (req, res,next) => {

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


        const groupId = req.params.id
        if(groupId !== "" && groupId > 0){
            client.query('SELECT GM.id,GM.member_id,GM.group_id, D.first_name, D.last_name,D.email,D.phone_no  FROM public.group_members as GM inner join public.directorys as D on GM.member_id = D.id WHERE GM.group_id = '+groupId+' ORDER BY GM.id DESC', async (err, response) => {
                if (err) {
                    return console.error('error running query', err);
                }           
                const  datas = response.rows                
                if(datas.length > 0){                    
                    res.status(200).send({                        
                        message:"Member already exists in this group",
                        success:0,
                        member:'exist'
                    })  
                }else{

                    //Custom Form Delete Start
                    GroupModel.destroy({
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
                    
                    client.end();

                }
                
            });
        }

         

    });

};

exports.getGroupListById = async (req, res, next) => {
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
        const eventId = req.params.id        
        if(eventId !== "" && eventId > 0){
            client.query('SELECT * FROM public.groups WHERE event_id = '+eventId+' ORDER BY id DESC', async (err, response) => {
                if (err) {
                     return console.error('error running query', err);
                 }           
                const datas = response.rows
                 return res.status(200).send({
                     result:datas,
                     success: 1,
                     status:200
                 })
            });
        }
         
    });
    // next();
}


exports.getGroupMembers = async (req, res, next) => {
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
        const groupId = req.params.id
        if(groupId !== "" && groupId > 0){
            client.query('SELECT GM.id,GM.member_id,GM.group_id, D.first_name, D.last_name,D.email,D.phone_no  FROM public.group_members as GM inner join public.directorys as D on GM.member_id = D.id WHERE GM.group_id = '+groupId+' ORDER BY GM.id DESC', async (err, response) => {
                if (err) {
                     return console.error('error running query', err);
                 }           
                const datas = response.rows
                 return res.status(200).send({
                     result:datas,
                     success: 1
                 })
            });
        }
         
    });
    // next();
}

exports.deleteGroupMember = async (req, res,next) => {

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
        GroupMemberModel.destroy({
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
