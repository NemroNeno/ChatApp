import JWT from "jsonwebtoken"
export const requiredSignIn = async (req, res, next) => {
    try {
         
  
    
    
  
  
      const decode = JWT.verify(
        req.headers.authorization,
        process.env.key
      );
  
      req.user = decode;
  
      next();
    } catch (error) {
      console.log(error);
    }
  };