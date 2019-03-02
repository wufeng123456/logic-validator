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
    [TOKE_TYPE_RIGHT_BRACKET]:[
        TOKE_TYPE_OPERATOR,
        TOKE_TYPE_RIGHT_BRACKET
    ],
    [TOKEN_TYPE_CONTEXT]:[
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
    serializedTokens: Token[]

    constructor(serializedTokens: Token[]) {
        this.serializedTokens = serializedTokens.reverse()
    }

    analyse() {
        const analyzedToken = []
        while (this.serializedTokens.length) {
            const token = this.serializedTokens.pop()
            if (!analyzedToken.length) {

                // @ts-ignore
                if (!Object.keys(ruleTypeMap).includes(token.type)) {
                    throw new NotAllowPositionException(token, Object.keys(ruleTypeMap))
                }
            } else {
                const preTokenType = analyzedToken[analyzedToken.length - 1].type
                console.log(preTokenType,ruleTypeMap[preTokenType])
                if (!ruleTypeMap[preTokenType].includes(token.type)) {
                    throw new NotAllowPositionException(token, ruleSymbolMap[preTokenType])
                }
            }

            if (token.type === TOKE_TYPE_NUMBER) {
                analyzedToken.push(token)
                try {
                    analyzedToken.push(this.getOperator())
                    analyzedToken.push(this.getNumber())
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
                const contextToken = new ContextToken()
                contextToken.children = this.analyse()
                analyzedToken.push(contextToken)
                continue
            }

            if (token.type === TOKE_TYPE_RIGHT_BRACKET) {
                break
            }
            throw new UnknowTokenException(token)
        }
        return analyzedToken
    }

    private getOperator() {
        let token = this.serializedTokens.pop()
        if (token.type === TOKE_TYPE_OPERATOR) {
            return token
        }
        this.serializedTokens.push(token)
        throw new NotAllowPositionException(token, ruleSymbolMap[token.type])
    }

    private getNumber() {
        let token = this.serializedTokens.pop()
        if (token.type === TOKE_TYPE_NUMBER) {
            return token
        }
        this.serializedTokens.push(token)

        throw new NotAllowPositionException(token, ruleSymbolMap[token.type])
    }

    private getRightBracket() {
        let token = this.serializedTokens.pop()
        if (token.type === TOKE_TYPE_RIGHT_BRACKET) {
            return token
        }
        this.serializedTokens.push(token)

        throw new NotAllowPositionException(token, ruleSymbolMap[token.type])
    }

    private getLeftBracket() {
        let token = this.serializedTokens.pop()
        if (token.type === TOKE_TYPE_LEFT_BRACKET) {
            return token
        }
        this.serializedTokens.push(token)

        throw new NotAllowPositionException(token, ruleSymbolMap[token.type])
    }
}

export default Analyst
