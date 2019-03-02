import {ALLOW_SYMBOL, Token} from "../Token";

class UnknowTokenException {
    public token: Token
    public message: string
    public stack

    constructor(token: Token) {
        this.message = `[${token.position}]: 未知的符号: ${token.value}，允许的符号是: ${ALLOW_SYMBOL}`
        this.token = token
        this.stack=(new Error()).stack
    }
}
UnknowTokenException.prototype = Object.create(Error.prototype);
UnknowTokenException.prototype.constructor = UnknowTokenException;

export default UnknowTokenException
