import "dotenv/config";
import jwt from "jsonwebtoken";

const { sign, verify } = jwt;

const createToken = (user) => {
  return sign(
    {
      emailAdd: user.emailAdd,
      pwd: user.pwd,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" } 
  );
};

const verifyAToken = (req, res, next) => {
    /**
     * the question mark after req is to prevent the "undefined" error 
     * the token is taken from the frontend, and if it exists, it will be passed to the verify function
     * */
    const token = req?.headers["authorization"]
    if(token){
        /**
         * if both the token and secret key are correct, then next() is called
         */
        if(verify(token, process.env.SECRET_KEY)){
            next()
        } else {
            res?.json({
                status: res.statusCode,
                msg: "Please provide the correct credentials."
            })
        }
    } else {
        res?.json({
            status: res.statusCode,
            msg: "Please log in."
        })
    }
}

export {
    createToken,
    verifyAToken
}