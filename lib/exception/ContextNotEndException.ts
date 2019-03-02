import {ALLOW_SYMBOL, Token} from "../Token";

class ContextNotEndException {
    public message: string
    public stack

    constructor() {
        this.message = `上下文错误，请检查 ( ) 是否匹配`
        this.stack = (new Error()).stack
    }
}

ContextNotEndException.prototype = Object.create(Error.prototype);
ContextNotEndException.prototype.constructor = ContextNotEndException;

export default ContextNotEndException
