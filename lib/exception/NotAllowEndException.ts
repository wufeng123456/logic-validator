
class NotAllowEndException {
    public message: string
    public stack

    constructor(allowSymbol:string[]) {
        this.message = `不能以该符号结束，允许的结束符号是: [${allowSymbol}]`
        this.stack = (new Error()).stack
    }
}

NotAllowEndException.prototype = Object.create(Error.prototype);
NotAllowEndException.prototype.constructor = NotAllowEndException;

export default NotAllowEndException
