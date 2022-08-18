const router = require ("express").Router();
const {getLoggedUser, editProfile, getUserById,onlyAdminRead,deleteAccount} = require("../controllers/user.controllers")

//vamos a importar los middleware
const {verifyToken,checkRole} = require("../middleware")

//CRUD
//Read - perfil
router.get("/my-profile",verifyToken,getLoggedUser);
//Update -Perfil
router.patch("/edit-profile",verifyToken,editProfile);
//delete -user
router.delete("/delete-user",verifyToken,deleteAccount);

//Read - otro usuario
router.get("/:id/profile",verifyToken,getUserById)

//Read all user (Admin Staff)
router.get("/admin/users",verifyToken,checkRole(['Admin']),onlyAdminRead)


module.exports = router