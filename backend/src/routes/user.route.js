import { Router } from 'express';



const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
        // msg test
    ]),
    registerUser
)


export default router