const jwt = require("jsonwebtoken");

//para limpiar la respueata de mongoose 
exports.clearRes = (data) => {
    const {password,createdAt,updatedAt,__v,...restData} = data
    return restData
};


exports.createJWT = (user) => {
    //jwt.sign({valorAEncriptar},palabraSecreta,{opciones})
    ///todo eso retorna => wdcbbciubicub.12313dewd.12132344423 =>["wdcbbciubicub","12313dewd","12132344423"]
    return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role
        //username:user.username
    },process.env.SECRET,{expiresIn:"24h"}).split(".")
};