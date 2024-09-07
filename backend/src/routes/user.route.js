import { Router } from 'express';
import {registerUser} from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js';


const router = Router();

// for multiple files use upload fields
// but here im using it to upload single file now other file can be added 
router.route("/register").post(([
    upload.fields([
        {
            name:"profilePicture",
            maxCount:1
        }
    ])
]),registerUser)
// for single file must learn to use *****
// router.post('/register', upload.single('profilePicture'), registerUser);





export default router