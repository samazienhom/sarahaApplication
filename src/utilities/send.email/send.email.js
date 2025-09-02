import nodemailer from 'nodemailer'
import { userModel } from '../../DB/models/user.model.js';
import { findOne } from '../../DB/DBServices.js';
export const sendEmail=async({to,subject,html})=>{
    console.log({
            user:process.env.USER,
            pass:process.env.PASS
        });
    
    const transporter=nodemailer.createTransport({
        host:process.env.HOST,
        port:process.env.PORT,
        secure:true,
        service:"gmail",
        auth:{
            user:process.env.USER,
            pass:"sxmultqubidihree"
        }
    })
    const main=async()=>{
        const info = await transporter.sendMail({
            from:`sarahaApp<${process.env.USER}>`,
            to,
            subject,
            html
        })
       console.log({info});
    }
    main().catch((err)=>{
        console.log({EmailError:err});
    })
}
