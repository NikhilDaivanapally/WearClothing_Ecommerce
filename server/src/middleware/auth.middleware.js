const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Please log in to access this resource" });
};

const ensureAuthenticatedAdmin = (req, res, next) => {
  console.log(req.user.email, req.user.role);
  if (
    req.isAuthenticated() &&
    (req.user.email === process.env.ADMIN || req.user.role == "Admin")
  ) {
    return next();
  }
  res.status(401).json({ error: "only admin can access this resource" });
};

module.exports = { ensureAuthenticated, ensureAuthenticatedAdmin };
