const router = require ('express').Router()
const {uploadProcess,deleteImage} = require ('../controllers/upload.controller')


const uploadCloud = require('../helpers/cloudinary.js')

//middleware para verificar si esta logeado
const {verifyToken} = require ('../middleware')

//multiples imagenes
router.post('/uploads',verifyToken,uploadCloud.array('images',5),uploadProcess)

//una sola
router.post('/single',verifyToken,uploadCloud.single('image'),uploadProcess)

//borrar imagen
router.delete('/delete-images/:name',verifyToken,deleteImage)

module.exports = router