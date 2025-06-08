const addUserContext = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
    res.locals.isAdmin = req.user.role === 'admin';
    res.locals.isClient = req.user.role === 'client';
  }
  next();
};

const redirectClientToUser = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    // Clients can only access user interface
    if (req.path.startsWith('/admin')) {
      return res.status(403).json({ error: 'Access denied. Clients cannot access admin interface' });
    }
  }
  next();
};

module.exports = {
  addUserContext,
  redirectClientToUser
};
