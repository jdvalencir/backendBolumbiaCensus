const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next) => {
    
    if(req.headers && req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decode.userId);
            

            if(!user){
                return res.json({success: false, message: 'Acceso no autorizado'});         
            }
            
            req.user = user;
            next();
        } catch (error) {
            if(error.name === 'JsonWebTokenError'){
                return res.json({ success: false, message: 'Acceso no autorizado'})
            }
            if(error.name === 'TokenExpiredError'){
                return res.json({ success: false, message: 'Sesion expirada, ingresa nuevamente'})
            }

            res.res.json({ success: false, message: 'error en el servidor'})
        }
        

    }else{
        res.json({success: false, message:'Acceso no autorizado'});
    }
    
};