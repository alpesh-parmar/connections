const nodemailer = require('nodemailer');

exports.sendmail=async (subject,body,emailto)=>{

  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAILHOST,//"smtp.gmail.com",  // enter host name
    port: 465, //enter port name
    secure: true, // true for 465, false for other ports    
    auth: {
      user: process.env.EMAILID,//'testascentinfo21@gmail.com', // write your smtp account user name
      pass: 'gjlhnycxsyvhqrrt'//process.env.EMAILPASS//'Admin#123' // write your smtp account user password
    },
    tls: {
      rejectUnauthorized: false
    },
  });  

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'testascentinfo21@gmail.com', // sender address
      to: emailto, // list of receivers
      subject: subject, // Subject line
      text: "test mail", // plain text body
      html: body // html body
    });  

    console.log("Message sent: %s", info.messageId);
  }
