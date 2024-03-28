import mongoose from "mongoose";

const urlSchema=new mongoose.Schema({
url:{
    type:String,
    required:true,
    unique:true,
 },
id:{
    unique:true,
    type:String,
 },
 createdby:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"users",
 }

});

const urlmodel=mongoose.model("URL",urlSchema);
export default urlmodel;
