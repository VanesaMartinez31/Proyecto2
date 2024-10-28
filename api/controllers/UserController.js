import { UsuariosModel } from "../model/UsuariosModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export default {
    register: async(req, res)=>{
        try{

            const hash = await bcrypt.hash(req.body.contraseña,10)
            const user = {
                nombre:req.body.name,
                contraseña:hash,
                correo: req.body.correo,
                curp:req.body.curp,
                rol:req.body.rol
            };
            await UsuariosModel.create(user);
            res.status(200).json({msg:"Usuario Registrado"})
        }catch (error){
            res.status(500).json({msg:"Ocurrio un error al registrar"});
            console.log(error)
        }
        
    },

    login: async (req,res)=>{

        try {
            const correo = req.body.correo;
        const contraseña = req.body.contraseña

        if(!correo || !contraseña){
            return res.status(400).json({msg: "Parametros invalidos"})
        }

        const user = await UsuariosModel.findOne({correo});
        if (!user){
            return res.status(400).json({msg: "Usuario no encontrado"})
        }
        if(!bcrypt.compare(contraseña, user.contraseña)){
            return res.status(400).json({msg: "Usuario no encontrado"})
        }

        const load = {id: user.id, correo: user.correo}
        const token = await jwt.sign(load,process.env.PRIVATE_KEY);

        return res.status(200).json({token})

        } catch (error) {
            return res.status(500).json({"Status":"Nooo"})
            console.log(err)
        }

        
    },

    updateProfile: async (req, res)=>{

        try {
            const user = await UsuariosModel.findById(req.params.id);
        if(!user){
            return res.status(400).json({msg: "Usuario no encontrado"})
        }

        user.nombre = req.body.nombre ? req.body.nombre : user.nombre
        user.correo = req.body.correo ? req.body.correo : user.correo
            user.curp = req.body.curp ? req.body.curp : user.curp
            user.rol = req.body.rol ? req.body.rol : user.rol
            user.contraseña = req.body.contraseña ? await bcrypt.hash(req.body.contraseña, 10) : user.contraseña

        await UsuariosModel.findByIdAndUpdate(user._id, user);

        return res.status(200).json({"status": "siiuu"})
        } catch (error) {
            res.status(500).json({ "status": "nooo" })
            console.log(err)
        }

        
    }
}