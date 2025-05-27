import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startWith('Bearer ')) {
        return req.status(401).json({ success: false, message: 'Unauthorized: No token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Save decoded info (id, role, etc.) in req.user
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
}