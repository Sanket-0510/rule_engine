
import jwt from 'jsonwebtoken'

function isStrongPassword(password) {

    const minLength = 8; 
    const minUppercase = 1; 
    const minLowercase = 1; 
    const minNumbers = 1; 
    const minSpecialChars = 1; 
  
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[^A-Za-z0-9]/;
    if (password.length < minLength) {
      return false;
    }
    if (
      password.match(uppercaseRegex).length < minUppercase ||
      password.match(lowercaseRegex).length < minLowercase ||
      password.match(numberRegex).length < minNumbers ||
      password.match(specialCharRegex).length < minSpecialChars
    ) {
      return false;
    }
    return true;
  }
const ZEOTAP_SECRET_KEY = process.env.SECRET_KEY || "zeotap_secret_key"
async function createJwtToken(user){
    console.log("we are here " +ZEOTAP_SECRET_KEY)
    const payload = {
      _id: user.user_id,
      name:user.name,
      email:user.email
    }
    const token = jwt.sign(payload, ZEOTAP_SECRET_KEY)
    
    return token

}
function verifyJwt(token){
     console.log("we are here ")
     const payload = jwt.verify(token, process.env.ZEOTAP_SECRET_KEY)
     console.log("this is the payload " + payload)
     return payload
}

const auth = async (req, res, next) => {
    try {
      console.log(req.headers.authorization)
      const token =req.headers.authorization.replace("Bearer ", "");
      
      console.log(token)
      if (!token) {
        return res.status(401).json({ success: false, message: `Token Missing` });
      }
  
      try {
        const decode =  verifyJwt(token)
        req.user = decode;
        next();
      } catch (error) {
        return res.status(401).json({ success: false, message: "Token is invalid" });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: `Something Went Wrong While Validating the Token`,
      });
    }
  };
  

export {auth , isStrongPassword, createJwtToken, verifyJwt}