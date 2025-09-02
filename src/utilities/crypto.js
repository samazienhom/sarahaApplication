import CryptoJS from "crypto-js";
 export const encryption=(data)=>{
    return CryptoJS.AES.encrypt(data,process.env.ENCRYPT_SECRET).toString()
 }

 export const decryption=(ciphertext)=>{
    const bytes=CryptoJS.AES.decrypt(ciphertext,process.env.ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8)
    return bytes
 }