import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './public/images')
    },
    filename: function (_req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });
export default upload;
