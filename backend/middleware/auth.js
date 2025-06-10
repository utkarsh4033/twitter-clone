import jwt from "jsonwebtoken"
import users from '../model/Users.js'
export const protect = async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message:'No token provided'})
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
       const user = await users.findByPk(decoded.id, {
            attributes: { exclude: ['users_password'] } 
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; 
        next();
    } catch (error) {
        res.status(401).json({message:'Invalid token'})
    }
}

export const adminOnly = (req,res,next) => {
    if(req.user?.users_role !== 'admin'){
        return res.status(403).json({message:'Access denied. Admins only'})
    }
    next();
}