import User from "../models/user.js";
import { setUser } from "../service/auth.js";
import { v4 } from "uuid";
export  async function handleUserSignup(req,res){
    const{name,email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");

}
export  async function handleUserLogin(req,res){
    const{email,password}=req.body;
    const user=await User.findOne({email,password});
    if(!user){
        return res.render("login",{error:"Invalid email or password"});
    }
    const sessionId=v4();
    setUser(sessionId,user);
    res.cookie("uid",sessionId);
    return res.redirect("/");

}
