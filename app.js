const express =require("express");
const path =require("path");
const bcrypt = require("bcrypt");
const app= express();
const collection=require("./config");
const PORT= process.env.PORT ||5000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs');
app.use(express.static("public"));
/*routes start*/
app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/signUp",(req,res)=>{
    res.render("signUp");
});

app.get("/training",(req,res)=>{
    res.render("training");
});

app.get("/nutrition",(req,res)=>{
    res.render("nutrition");
});

app.get("/physio",(req,res)=>{
    res.render("physio");
});

/*routes ends*/

app.post("/signUp",async(req, res)=>{
    const data={
        name: req.body.username,
        password: req.body.password
    }

    const existingUser= await collection.findOne({name:data.name});
    if(existingUser){
        res.send("User Exist");
    }
    else{
        const userdata=await collection.insertMany(data);
        console.log(userdata);
        res.send("You are Succesfully register Now go to Login Page");
    }
});

app.post("/login",async(req,res)=>{
    try {
        const check = await collection.findOne({name:req.body.username});
        if(!check){
            res.send("User Not Exist.")
        }
        const isPasswordMatch=await collection.findOne({password:req.body.password});
        if(isPasswordMatch){
            res.render("home");
        }else{
            req.send("wrong password");
        }
    } catch (error) {
        res.send("Wrong Details Enter");
    }
});

app.post("/logout", (req, res,next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err); // Added logging for error debugging
            return res.redirect("/home");
        }
        res.clearCookie("connect.sid");
        res.redirect("/index"); // Changed from '/' to '/login'
    });
});

try {
    app.listen(PORT,()=>{
        console.log('Yes i am connected ',PORT );
    });
} 
catch (error) {
    console.log(error);
}