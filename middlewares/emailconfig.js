const nodemailer = require('nodemailer');
exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, //SSL: 465 ,TLS : 587
    auth: {
        user: "testascentinfo21@gmail.com",
        pass: "Admin#123"
    }
})


exports.message = {
    from: "testascentinfo21@gmail.com",
    to: "alpesh.parmar@ascentinfo.solutions",
    subject: "Subject",
    text: "Hello SMTP Email"
}