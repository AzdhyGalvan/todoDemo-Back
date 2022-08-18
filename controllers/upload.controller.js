const cloudinary = require("cloudinary");

//subir un arreglo de imagmes
exports.uploadProcess = async (req, res, next) => {
  const uploads = (file, folder) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(file, (result) => {
        resolve({
            url:result.url,
            id:result.original_filename
        },{
            resource_type:'auto',
            folder
        })
      }); //end cloudinary
    }); //end new promise
  }; //end uploads
                                          //es la llave del json donde va a contener la imagem 
  const uploader = async(path)=> uploads(path,'images')

  if(req.method === 'POST'){
    const urls =[]
    const files = req.files;
    console.log("si esta el files",req.files,"el req.file",req.file)
    //req.files ==> .array()
    //req.file =>> .single()
    if(!req.file){
        for(const file of files ){ // for of =>>> array[]  //for in =>> objects {}
            const {path}= file
            const newPath= await uploader(path)
            urls.push({uri:newPath.url,id:newPath.id,name:file.originalname})
        }
        res.status(200).json({urls,successMessage:'Imagenes guardadas'})
    }
    else{
        const {path}= req.file
        const newPath= await uploader(path)
        const url ={uri:newPath.url,id:newPath.id,name:req.file.originalname}
        res.status(200).json({url,successMessage:'Imagenes guardada'})
    }
    
  }
  else{
    res.status(400).json({errorMessage:`${req.method} no permitido`})
    }

};

exports.deleteImage =(req,res,next)=>{
    const {name} = req.params

                            //foler/nameImage.ext
    cloudinary.v2.uploader.destroy(`tinder-perritos/${name}`,(error,result)=>{
        if (error){
            return res.status(400).json({errorMessage:'No se pudi eliminar',error})
        }
        res.status(200).json({successMessage:`Se elimino el archivo ${name}`})
    })
}
