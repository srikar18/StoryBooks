module.exports = {
    // Check if user is logged
    // if yes, allow access
    // else redirect to login
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/');
        }
    },
    // check if user is logged
    // if yes, login page should be disabled i.e, redirect to dashboard when / route is hit
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next();
        }
    }
}