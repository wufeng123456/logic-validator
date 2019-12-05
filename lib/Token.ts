export const TOKE_TYPE_NUMBER = 'number'
export const TOKE_TYPE_OPERATOR = 'operator'
export const TOKE_TYPE_LEFT_BRACKET = 'left_bracket'
export const TOKE_TYPE_RIGHT_BRACKET = 'right_bracket'
export const TOKE_TYPE_NOT = 'not'
export const TOKEN_TYPE_UNKNOW = 'unknow'
export const TOKEN_TYPE_CONTEXT = 'context'

export const ALLOW_SYMBOL = ['a', 'b', '|', '&', '(', ')']
export const REG_OF_NUMBER = /[ab]/
export const REG_OF_OPERATOR = /[&|]/
export const REG_OF_NOT = /[!]/
export const REG_OF_LEFT_BRACKET = /\(/
export const REG_OF_RIGHT_BRACKET = /\)/

export class Token {
    private _type: string = TOKEN_TYPE_UNKNOW
    private _value: any = ''
    private _position: number[] = []
    private _children: Token[] = []


    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

    get position(): number[] {
        return this._position;
    }

    set position(value: number[]) {
        this._position = value;
    }

    get children(): Token[] {
        return this._children;
    }

    set children(value: Token[]) {
        this._children = value;
    }
}

export class NumberToken extends Token {
    constructor() {
        super();
        this.type = TOKE_TYPE_NUMBER
    }
}

export class OperatorToken extends Token {
    constructor(value: string) {
        super()
        this.type = TOKE_TYPE_OPERATOR
        this.value = value
    }
}

export class NotToken extends Token {
    constructor(value: string) {
        super()
        this.type = TOKE_TYPE_NOT
        this.value = value
    }
}

export class LeftBracketToken extends Token {
    constructor() {
        super()
        this.type = TOKE_TYPE_LEFT_BRACKET
        this.value = '('
    }
}

export class RightBracketToken extends Token {
    constructor() {
        super()
        this.type = TOKE_TYPE_RIGHT_BRACKET
        this.value = ')'
    }
}

export class UnknowToken extends Token {
    constructor() {
        super()
    }
}


export class ContextToken extends Token {
    constructor() {
        super()
        this.type = TOKEN_TYPE_CONTEXT
    }
}
