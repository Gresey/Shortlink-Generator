import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import URL from "./models/urlModel.js";
import cors from 'cors';
import urlExist from "url-exist";

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/urlshortener", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB is connected");
        // Start the server after successful database connection
        
    })
    .catch((error) => {
        console.error("Error connecting with database:", error);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine","ejs");
app.set('views',path.resolve('./views'));



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
    res.render("index.ejs",{id:null});
  
});

// Handle POST requests to shorten URLs
app.post("/url",validateUrl, async (req, res) => {
    const url = req.body.url;
    const id = nanoid(8);
    const newurl = new URL({ url, id });
    try {
        await newurl.save();
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