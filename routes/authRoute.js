const {Router}=require("express");
const router=Router();
const authController=require('../controllers/authController');
console.log("signup_get:", authController.signup_get);
console.log("signup_post:", authController.signup_post);
console.log("login_get:", authController.login_get);
console.log("login_post:", authController.login_post);
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);

router.get('/login',authController.login_get);
router.post('/login',authController.login_post);


module.exports=router;