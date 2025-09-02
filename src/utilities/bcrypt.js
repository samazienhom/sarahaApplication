import { compareSync, hashSync } from "bcryptjs"

export const hash=(password)=>{
    return hashSync(password,Number(process.env.ROUND))
}
export const compare=(text,hashedText)=>{
    return compareSync(text,hashedText)
}