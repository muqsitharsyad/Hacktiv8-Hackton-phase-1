const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const uploadMulter = multer({ storage });

module.exports = uploadMulter