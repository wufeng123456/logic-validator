import {ALLOW_SYMBOL, Token} from "../Token";

class NotAllowPositionException {
    public token: Token
    public message: string
    public stack

    constructor(token: Token, allowToken: string[]) {
        this.message = `[${token.position}]: 该符号不允许出现在这儿: ${token.value}，允许的符号是: [${allowToken}]`
        this.token = token
        this.stack = (new Error()).stack
    }
}

NotAllowPositionException.prototype = Object.create(Error.prototype);
NotAllowPositionException.prototype.constructor = NotAllowPositionException;

export default NotAllowPositionException
