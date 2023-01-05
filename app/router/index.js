const router = require('express').Router();
const userController = require('../controller/userController');
var multer = require('multer');
//var upload = multer({dest: './uploads/'});
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images/')
    },
    filename: function (req, file, cb) {
      //const name = file.originalname.split('.')[0];
      const ext = file.mimetype.split("/")[1];
      cb(null, file.originalname.split('.')[0] + '_' + Date.now()+"."+ext)
    }
  })
 
var upload = multer({ storage: storage })

router.route('/all-users/:page?/:limit?').get(userController.getAllUsers)
router.route('/get-user/:id').get(userController.getUser)
router.route('/add-user').post(upload.single('image'),userController.addUser)
router.route('/edit-user/:id').put(upload.single('image'),userController.updateUser)
router.route('/delete-user/:id').delete(userController.deleteUser)

module.exports = router;