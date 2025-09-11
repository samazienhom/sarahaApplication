import dbConnection from "./DB/connection.js"
import { userModel } from "./DB/models/user.model.js"
import authRouter from "./modules/auth.module/auth.controller.js"
import messageRouter from "./modules/message.module/message.controller.js"
import userRouter from "./modules/user.module/user.controller.js"
import { NotFoundURLException } from "./utilities/exceptions.js"
import { sendEmail } from "./utilities/send.email/send.email.js"
import cors from 'cors'
const startApp=async(app,express)=>{
    const port=process.env.PORT
    app.use(express.json())
    await dbConnection()
    app.use(cors())
    app.use("/user",userRouter)
    app.use("/message",messageRouter)
    app.use("/auth",authRouter)
    app.all("/*s",(req,res,next)=>{
        return next(new NotFoundURLException())
    })
    app.use((err,req,res,next)=>{
        console.log(err.stack);
        res.status(err.cause||500).json({
            errMsg:err.message,
            status:err.cause
        })
    })
    app.listen(port,()=>{
        console.log("server is running");  
    })
}
export default startApp
