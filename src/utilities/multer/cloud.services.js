import cloudinary from "./cloud.config.js"

export const uploadsingleFile=async({path,dest=""})=>{
     const {secure_url,public_id}=await cloudinary.uploader.upload(path,{
        folder:`${process.env.CLOUD_FOLDER}/${dest}`,
      })    
      return {secure_url,public_id}
} 
export const uploadmultibleFiles=async({paths=[],dest=""})=>{
    if(paths.length==0){
        throw new Error("no files exist")
    }
    const images=[]
    for (const path of paths) {
        const {secure_url,public_id}=await uploadsingleFile({path,dest:`${dest}`})
        images.push({secure_url,public_id})
    }
    return images
}
export const destroySinglefile=async(public_id)=>{
    await cloudinary.uploader.destroy(public_id)
}
export const deleteFolder=async({folder=""})=>{
    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER}/${folder}`)
}
export const deleteByPrefix=async({prefix=""})=>{
    await cloudinary.api.delete_resources_by_prefix(`${process.env.CLOUD_FOLDER}/${prefix}`)
}