const router = require("express").Router();
const connectioncontroller = require('../controller/connectionController');
const groupcontroller = require('../controller/groupController');

const middlewareevent = require('../middlewares/connectionSchema');
const validaterequestschema = require('../middlewares/validaterequestschema');
const res = require("express/lib/response");

router.post("/create", connectioncontroller.create);
router.post("/updatesettings", connectioncontroller.updateSettings);
router.get("/getconnections", connectioncontroller.getConnections);
router.get("/deleteconnection/:id", connectioncontroller.deleteConnection);
router.post("/importconnection", connectioncontroller.importConnection);


router.post("/creategroup", groupcontroller.create);
router.post("/updategroup", groupcontroller.updateGroup);

router.get("/getgrouplist", groupcontroller.getGroups);
router.get("/deletegroup/:id", groupcontroller.deleteGroup);

router.get("/getgroupmemberlist/:id", groupcontroller.getGroupMembers);
router.get("/deletegroupmember/:id", groupcontroller.deleteGroupMember);






module.exports = router;
