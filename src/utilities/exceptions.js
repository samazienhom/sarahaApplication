export class NotFoundURLException extends Error {
    constructor(){
        super("not found URL",{cause:404})
    }
}
export class NotValidEmail extends Error{
    constructor(){
        super("not valid email",{cause:400})
    }
}
export class InvalidCredentials extends Error{
    constructor(){
        super("invalid credentials",{cause:400})
    }
}
export class InvalidTokeExceotion extends Error{
    constructor(){
        super("invalid token,please send it",{cause:400})
    }
}
export class UserNotFound extends Error{
    constructor(){
        super("user not found",{cause:400})
    }
}