export const supplierOnly = (req, res, next) => {
    if (req.user?.role !== 'supplier') {
        return res.status(403).json({ success: false, message: 'Access denied: Suppliers only'});
    }
    next();
};