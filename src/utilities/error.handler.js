//for old versions 
export const errorHandling=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            next(new Error(err.message,{cause:err.cause||500}))
        })
    }
}