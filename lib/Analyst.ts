import {
    ContextToken,
    TOKE_TYPE_LEFT_BRACKET,
    TOKE_TYPE_NUMBER,
    TOKE_TYPE_OPERATOR,
    TOKE_TYPE_RIGHT_BRACKET,
    Token, TOKEN_TYPE_CONTEXT
} from "./Token";
import UnknowTokenException from "./exception/UnknowTokenException";
import NotAllowPositionException from "./exception/NotAllowpositionException";
import ContextNotEndException from "./exception/ContextNotEndException";

const allowBeginType = [
    TOKE_TYPE_NUMBER,
    TOKE_TYPE_LEFT_BRACKET
]
const allowBeginSymbol = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '('
]
const ruleTypeMap = {
    [TOKE_TYPE_LEFT_BRACKET]: [
        TOKE_TYPE_NUMBER,
        TOKE_TYPE_LEFT_BRACKET
    ],
    [TOKE_TYPE_NUMBER]: [
        TOKE_TYPE_OPERATOR,
        TOKE_TYPE_RIGHT_BRACKET
    ],
    [TOKE_TYPE_OPERATOR]: [
        TOKE_TYPE_NUMBER,
        TOKE_TYPE_LEFT_BRACKET
    ],
    [TOKE_TYPE_RIGHT_BRACKET]: [
        TOKE_TYPE_OPERATOR,
        TOKE_TYPE_RIGHT_BRACKET
    ],
    [TOKEN_TYPE_CONTEXT]: [
        TOKE_TYPE_OPERATOR,
        TOKE_TYPE_RIGHT_BRACKET
    ]
}
const ruleSymbolMap = {
    [TOKEN_TYPE_CONTEXT]: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0
    ],
    [TOKE_TYPE_NUMBER]: [
        '|', '&'
    ],
    [TOKE_TYPE_OPERATOR]: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0
    ]
}


class Analyst {
    private serializedTokens: Token[] = []
    private config: object = {}
    private bracketArr: Array<String> = []

    constructor(config: object = {}) {
        this.config = config
    }

    public analyse(serializedTokens: Token[]) {
        this.serializedTokens = serializedTokens.reverse()
        return this._analyse()
    }

    private _analyse(isContext = false) {
        if (!this.serializedTokens.length) return []
        const analyzedToken: Token[] = []
        while (this.serializedTokens.length) {
            const token = this.serializedTokens.pop()
            if (!analyzedToken.length) {
                // @ts-ignore
                if (!allowBeginType.includes(token.type)) {
                    throw new NotAllowPositionException(token, allowBeginSymbol)
                }
            } else {
                const preTokenType = analyzedToken[analyzedToken.length - 1].type
                if (!ruleTypeMap[preTokenType].includes(token.type)) {
                    throw new NotAllowPositionException(token, ruleSymbolMap[preTokenType])
                }
            }

            if (token.type === TOKE_TYPE_NUMBER) {
                analyzedToken.push(token)
                try {
                    // analyzedToken.push(this.getOperator()) && analyzedToken.push(this.getNumber())
                    (analyzedToken.push(this.getOperator()) && analyzedToken.push(this.getNumber()))
                    ||
                    (analyzedToken.push(this.getRightBracket()))
                } catch (e) {
                    if (!(e instanceof NotAllowPositionException)) {
                        throw e
                    }
                    try {
                        this.getRightBracket()
                        break
                    } catch (e) {
                        if (!(e instanceof NotAllowPositionException)) {
                            throw e
                        }
                        this.serializedTokens.push(this.getLeftBracket())
                        continue
                    }
                }
                continue
            }
            if (token.type === TOKE_TYPE_OPERATOR) {
                analyzedToken.push(token)
                continue
            }

            if (token.type === TOKE_TYPE_LEFT_BRACKET) {
                this.bracketArr.push(TOKE_TYPE_LEFT_BRACKET)
                const contextToken = new ContextToken()
                contextToken.children = this._analyse(true)
                analyzedToken.push(contextToken)
                continue
            }

            if (token.type === TOKE_TYPE_RIGHT_BRACKET) {
                // return analyzedToken
                if (this.bracketArr.length && this.bracketArr[this.bracketArr.length - 1] === TOKE_TYPE_LEFT_BRACKET) {
                    this.bracketArr.pop()
                    return analyzedToken
                } else {
                    throw new ContextNotEndException()
                }
            }
            throw new UnknowTokenException(token)
        }
        if (isContext) {
            throw new ContextNotEndException()
        }
        return analyzedToken
    }

    private getNext(type: string) {
        let token = this.serializedTokens.pop()
        if (!token) {
            return
        }
        if (token.type === type) {
            return token
        }
        this.serializedTokens.push(token)
        throw new NotAllowPositionException(token, ruleSymbolMap[token.type])
    }

    private getOperator() {
        return this.getNext(TOKE_TYPE_OPERATOR)
    }

    private getNumber() {
        return this.getNext(TOKE_TYPE_NUMBER)
    }

    private getRightBracket() {
        return this.getNext(TOKE_TYPE_RIGHT_BRACKET)
    }

    private getLeftBracket() {
        return this.getNext(TOKE_TYPE_LEFT_BRACKET)
    }
}

export default Analyst
