const { Teacher } = require("../db/index");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function teacherMiddleware(req,res,next){
    try{
        const token = req.headers.authorization;
        const words = token.split(" ");
        const jwtToken = words[1];

        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if(decodedValue.email){
            req.email = decodedValue.email;
            next();
        }
        else{
            res.status(403).json({
                msg:"You are not authenticated"
            })
        }
    } catch(e){
        res.json({
            msg:"Incorrect inputs"
        })
    }
}

module.exports = teacherMiddleware;