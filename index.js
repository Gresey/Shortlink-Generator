import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import URL from "./models/urlModel.js";
import cors from 'cors';
import urlExist from "url-exist";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import { restrictToLoggedinUserOnly } from "./middleware/auth.js";

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/urlshortener", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB is connected");
     
    })
    .catch((error) => {
        console.error("Error connecting with database:", error);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine","ejs");
app.set('views',path.resolve('./views'));


app.use(cookieParser());
dotenv.config();

//middleware to validate url
const validateUrl=async(req,res,next)=>{
    const {url}=req.body;
    const isurlcorrect=await urlExist(url);
    if(!isurlcorrect){
        return res.json({message:"invalid url",type:"failure"});
    }
    next();
}

// Serve the index.html file
app.get("/", async(req, res) => {
    const allUrls=await URL.find({});
    return res.render("index",{url:allUrls,id:null});
    
  
});

app.use("/user",userRoute);

app.get("/signup",(req,res)=>{
    return res.render("signup");
});
app.get("/login",(req,res)=>{
    return res.render("login");
});


// Handle POST requests to shorten URLs
app.post("/url",restrictToLoggedinUserOnly, async (req, res) => {
    const url = req.body.url;
    const id = nanoid(8);
   // const newurl = new URL({ url, id });
   const newurl=await URL.create({
    url:url,
    id:id,
    createdby:req.user._id,
   })
    try {
       // await newurl.save();
        const domain = process.env.PRODUCTION_URL || 'http://localhost:8000/';
       const shorturl= `${domain}${newurl.id}`
        res.render("index.ejs",{id:shorturl});
    } catch (error) {
        console.error("Error saving entry:", error);
        res.status(500).json({ message: "An error occurred. Please try again later.", type: "error" });
    }
});

app.get("/:id",async(req,res)=>{
     const id=req.params.id;
     const idindb=await URL.findOne({id});
     if(!idindb){
       return res.json({message:"url not found",type:"failure"});
     }
     res.redirect(idindb.url);
});
app.listen(8000, () => {
    console.log(`Server is running at http://localhost:8000`);
});