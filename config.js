const mongoose=require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login-Signup")

connect.then(()=>{
    console.log("Database connect succesfully");
})
.catch(()=>{
    console.log("Database cannot be connected");
});
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});

const collection = new mongoose.model("users",LoginSchema);
module.exports= collection;