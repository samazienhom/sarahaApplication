

export const validation=(schema)=>{
    return (req,res,next)=>{
        const data={
            ...req.body,
            ...req.params,
            ...req.query
        }

        const resualt=schema.validate(data,{abortEarly:false})
        console.log({resualt});
        if(resualt.error){
            return next(new Error(resualt.error,{cause:422}))
        }
        next()
        
    }
}