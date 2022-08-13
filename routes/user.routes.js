const router = require ("express").Router();
const {getLoggedUser, editProfile} = require("../controllers/user.controllers")

//vamos a importar los middleware
const {verifyToken} = require("../middleware")

//CRUD
//Read - perfil
router.get("/my-profile",verifyToken,getLoggedUser);
//Update -Perfil
router.patch("/edit-profile",verifyToken,editProfile);
//delete -user
//router.delete("/delete-user",);

//Read - otro usuario
//router.get("/:id/profile",)


module.exports = router