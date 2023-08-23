export const isConnected = (req, res, next) => {
    if(req.session.user) return res.redirect("/api/products")
    next();
}

export const isDisconnected = (req, res, next) => {
    if(!req.session.user) return res.redirect("/login")
    next();
}

export const isAdmin = (req, res, next) => {
    if(!req.session.user.role === "Admin") return res.redirect("/current")
    next();
}