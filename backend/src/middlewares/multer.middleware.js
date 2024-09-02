import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';  // For generating unique filenames

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
        // call back 
        // we are not handling error 
        // file storing we are using public temp
    },
    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);  // Get file extension
        const uniqueFilename = `${uuidv4()}${ext}`;  // Generate unique filename
        cb(null, uniqueFilename);
        // documentation read for this 
        // file.original name should be changed as it can have error when 2 same name person enter
    }
})

export const upload = multer({
    storage,
})