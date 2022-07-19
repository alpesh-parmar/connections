const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'createUser': {
         return [ 
            body('username', 'userName doesnt exists').exists().isLength({min:2,max:100}),
            body('firstname',"firstname required").exists().isLength({min:5 ,max:100}),
            body('lastname',"lastname required").exists().isLength({min:5 ,max:100}),
            body('password',"password must be 5 character long").exists().isLength({min: 5, max:30}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
            body('password',"a password must be 5 characters including one uppercase letter, one special character and alphanumeric characters").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
            body('email', 'Invalid email').exists().isEmail(),
            body('phone').optional().isInt(),
            body('enabled').isIn(['true','false']),
            body('usertypeid',"usertype is required").exists(),

            body('roleId',"userrole required").exists(),
            body('companyid',"company name required.").exists()


           ]   
        }
    }
}

