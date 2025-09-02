import mongoose from "mongoose"
const dbConnection=async()=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("db connected");    
    }).catch((err)=>{
        console.log("db connection failed",err);
    })
}
export default dbConnection