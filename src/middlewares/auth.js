export const checkUserAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
};


export const showLoginView = (req, res, next) => {
    if (req.user) {
        res.redirect("/profile");
    }
    else {
        next();
    }
};


export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user)
        {
            res.status(401).json({status: "error", message: "Debe realizar el login antes de utilizar esta función."})
        }
        else {
            if (roles.includes(req.user.role)) {
                next();
            }
            else {
                res.status(403).json({status: "error", message: "No tiene permisos para utilizar esta función."})
            }
        }
    }
};