function isAuthenticated (req, res, next) {
    if (req.session.loggedIn) return next()
    else res.redirect('/login?notification=Anda Harus Login 🤪')
}

module.exports = isAuthenticated