import { UserModel } from "../models/UsersModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export default {
    register: async(req, res)=>{
        try{

            const hash = await bcrypt.hash(req.body.password,10)
            const user = {
                name: req.body.name,
                password: hash,
                email: req.body.email,
                curp: req.body.curp,
                rol: req.body.rol
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
            const email = req.body.email
        const password = req.body.password

        if(!email || !password){

            return res.status(400).json({msg: "parametros invalidos"})
        }

        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({msg: "credenciales invalidas"})
        }

       if (bcrypt.compare(password,user.password)){
        return res.status(400).json({msg:"credenciales invalidas"})

       }


       const token = await jwt.sign(user,process.env.PRIVATE_KEY)

       return res.status(200).json({token})
        } catch (error) {
            return res.status(500).json({"Status":"Nooo"})
            
        }
    },
    
    updateProfile: async (req,res)=>{

        try {
            const user = await UserModel.findById(req.params.id)

            if (!user){
                return res.status(400).json({msg:"usuario no encontrado"})
            }
    
            user.name = req.body.name ? req.body.name : user.name
    
            user.email = req.body.email ? req.body.email : user.email
    
            user.curp = req.body.curp ? req.body.curp : user.curp

            user.rol = req.body.rol ? req.body.rol : user.rol

            user.password = req.body.password ? await bcrypt.hash(req.body.password,10) : user.password

            await UserModel.create.findOneAndUpdate(user._id,user)
            res.status(201).json({msg:"usuario actualizado con exito"})


        } catch (error) {
             res.status(500).json({msg: "ocurrio un error ala registrarte"})

            console.log(error)
        }

       

    }

}