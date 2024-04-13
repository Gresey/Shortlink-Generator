//statefull authentication(sessionid vala)
/*const sessionIdToUserMap=new Map();
export function setUser(id,user){
    sessionIdToUserMap.set(id,user);
}
export function getUser(id){
    return sessionIdToUserMap.get(id);
}*/

//stateless authentication(based on tokens)
import pkg from "jsonwebtoken";
//const {jwt}=pkg;
const secret="Greseytoken";

export function setUser(user){ //this function will make the tokens

   return pkg.sign({
    _id:user._id,
    email:user.email,
   },secret);
}
export function getUser(token){
    if(!token){
        return null;
    }
    try{
        return pkg.verify(token,secret); //user ka token frontend se aayga or verify hoga yaha pr secret key se
    }catch(error){
        return null;
    }
   
}