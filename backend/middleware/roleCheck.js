export const roleCheck = (req, res, next) => {
    if (req.user?.role !== 'supplier' && req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: admin or supplier only!'});
    }
    next();
};