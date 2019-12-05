import {
    LeftBracketToken,
    NumberToken,
    OperatorToken,
    NotToken,
    REG_OF_LEFT_BRACKET,
    REG_OF_NUMBER,
    REG_OF_OPERATOR, REG_OF_RIGHT_BRACKET, RightBracketToken,
    REG_OF_NOT,
    Token
} from "./Token";
import UnknowTokenException from "./exception/UnknowTokenException";

class Tokenizer {
    private config: object = {}
    private tokens: string[] = []
    private start: number = 0
    private end: number = 0

    constructor(config: object = {}) {
        this.config = config
    }

    public tokenize(input: string): Token[] {
        const serializedTokens = new Array<Token>()
        this.tokens = input.split('').reverse()
        while (this.tokens.length) {
            const token = this.tokens.pop()
            this.end += 1
            this.start = this.end

            if (REG_OF_NUMBER.test(token)) {
                const numberToken = new NumberToken()
                numberToken.value += token + this.getNumber()
                numberToken.position = [this.start, this.end]
                serializedTokens.push(numberToken)
                continue
            }

            if (REG_OF_OPERATOR.test(token)) {
                const operatorToken = new OperatorToken(token)
                operatorToken.position = [this.start, this.end]
                serializedTokens.push(operatorToken)
                continue
            }

            if (REG_OF_NOT.test(token)) {
                const notToken = new NotToken(token)
                notToken.value += token + this.getNot()
                notToken.position = [this.start, this.end]
                serializedTokens.push(notToken)
                continue
            }

            if (REG_OF_LEFT_BRACKET.test(token)) {
                const leftBracketToken = new LeftBracketToken()
                leftBracketToken.position = [this.start, this.end]
                serializedTokens.push(leftBracketToken)
                continue
            }
            if (REG_OF_RIGHT_BRACKET.test(token)) {
                const rightBracketToken = new RightBracketToken()
                rightBracketToken.position = [this.start, this.end]
                serializedTokens.push(rightBracketToken)
                continue
            }

            const unknowToken = new Token()
            unknowToken.value = token
            unknowToken.position = [this.start, this.end]
            throw new UnknowTokenException(unknowToken)
        }

        return serializedTokens
    }

    private getNumber() {
        let value: string = ''
        while (this.tokens.length) {
            const token = this.tokens.pop()
            if (REG_OF_NUMBER.test(token)) {
                value += token
                this.end += 1
            } else {
                this.tokens.push(token)
                break
            }
        }
        return value
    }
    private getNot() {
        let value: string = ''
        while (this.tokens.length) {
            const token = this.tokens.pop()
            if (REG_OF_NOT.test(token)) {
                value += token
                this.end += 1
            } else {
                this.tokens.push(token)
                break
            }
        }
        return value
    }
}

export default Tokenizer
