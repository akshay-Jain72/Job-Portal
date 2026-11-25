
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // User authentication check
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    // Role check
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
