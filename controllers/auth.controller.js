const User = require("../models/User.model");
//para el password
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const { clearRes, createJWT } = require("../utils/utils");

//ocuparemos 3 rutas =>
//login, sigup, logout
//api solo mandamos data en post

//signup controller

exports.signupProcess = (req, res, next) => {
  //params:id
  //query ?
  //frontend al back =>body
  // vamos a sacar el role

  const { role, email, password, confirmPassword, ...restUser } = req.body;

  //validamos campos vacios
  if (!email.length || !password.length || !confirmPassword)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar campos vacios!" });

  //validar si el password > 8 o en una regla REGEX

  //password coincide!
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ errorMessage: "La contraseña no son iguales" });

  //validar si el email existe 1.1
  //{email:email}
  User.findOne({ email })
    .then((found) => {
      //validacion email 1.2
      if (found)
        return res
          .status(400)
          .json({ errorMessage: "Ese correo ya esta registrado" });

      return (
        bcryptjs
          .genSalt(10)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            //crearemos al nuevo usuario
            return User.create({
              email,
              password: hashedPassword,
              ...restUser,
            });
          })
          //then contiene al user ya con password hashed y guardar en la db
          .then((user) => {
            //regresamos al usuario para que entre a la pagina y ademas creamos su token de acceso
            const [header, payload, signature] = createJWT(user);
            //vamos a guardar esos datos en las cookies
            //res.cookie("key_como_se_va_guardar","dato_que_voy_almacenar",{opciones})
            res.cookie("headload", `${header}.${payload}`, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });
            res.cookie("signature", signature, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });

            /**
             *
             *
             * toObject()
             * {} Object || JSON
             * {}BSON => toObject() => Objecto ...,{perro,gato},delete user.password
             *
             *
             */

            //vamos a limpiar la respuesta de mongoose CONVIERTIENDO el BSOn a objeto y eliminar data basura
            const newUser = clearRes(user.toObject());
            res.status(201).json({ user: newUser }); //{data:{user:{}}}
          })
      );
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "el correo electronico ya esta en uso.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.loginProcess = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || !email.length || !password.length)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar campos vacios" });

  //validar la contraseña que contenga 8 caracteres o REDEX

  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res.status(400).json({ errorMessage: "Credenciales invalidas" });

      //validar que la contraseña sea correcta
      return bcryptjs.compare(password, user.password).then((match) => {
        if (!match)
          return res
            .status(400)
            .json({ errorMessage: "Credenciales invalidas" });

        //crear nuestro jwt

        const [header, payload, signature] = createJWT(user);

        res.cookie("headload", `${header}.${payload}`, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        });
        res.cookie("signature", signature, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        });

        //vamos a limpiar el response del usuario

        const newUser = clearRes(user.toObject());
        res.status(200).json({ user: newUser });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "el correo electronico ya esta en uso.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};


exports.logoutProcess= (req,res,next)=>{
    res.clearCookie("headload")
    res.clearCookie("signature")
    res.status(200).json({successMessage:"Bye,Te esperamos pronto :D"})
}