export const roleAuth = (...roles) => {
    return async(req, res, next) => {        
        if (!roles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
    }
};