import Tokenizer from "../lib/Tokenizer";
import {
    TOKE_TYPE_LEFT_BRACKET,
    TOKE_TYPE_NUMBER,
    TOKE_TYPE_OPERATOR,
    TOKE_TYPE_RIGHT_BRACKET, UnknowToken
} from "../lib/Token";
import UnknowTokenException from "../lib/exception/UnknowTokenException";

describe('tokenizer', () => {
    test('empty intput', () => {
        const tokenizer = new Tokenizer()
        expect(tokenizer.tokenize('')).toEqual([])
    })

    test('number', () => {
        const tokenizer = new Tokenizer()
        expect(tokenizer.tokenize('1234')).toEqual([{
            _type: TOKE_TYPE_NUMBER,
            _value: '1234',
            _children: [],
            _position: [1, 4]
        }])
    })
    test('operator', () => {
        const tokenizer = new Tokenizer()
        expect(tokenizer.tokenize('&')).toEqual([{
            _type: TOKE_TYPE_OPERATOR,
            _value: '&',
            _children: [],
            _position: [1, 1]
        }])
    })

    test('left bracket', () => {
        const tokenizer = new Tokenizer()
        expect(tokenizer.tokenize('(')).toEqual([{
            _type: TOKE_TYPE_LEFT_BRACKET,
            _value: '(',
            _children: [],
            _position: [1, 1]
        }])
    })

    test('right bracket', () => {
        const tokenizer = new Tokenizer()
        expect(tokenizer.tokenize(')')).toEqual([{
            _type: TOKE_TYPE_RIGHT_BRACKET,
            _value: ')',
            _children: [],
            _position: [1, 1]
        }])
    })


    test('normal input', () => {
        const tokenizer = new Tokenizer()
        expect(tokenizer.tokenize('(11|22)&(33|44)')).toEqual([
            {
                _type: TOKE_TYPE_LEFT_BRACKET,
                _value: '(',
                _children: [],
                _position: [1, 1]
            },
            {
                _type: TOKE_TYPE_NUMBER,
                _value: '11',
                _children: [],
                _position: [2, 3]
            },
            {
                _type: TOKE_TYPE_OPERATOR,
                _value: '|',
                _children: [],
                _position: [4, 4]
            },
            {
                _type: TOKE_TYPE_NUMBER,
                _value: '22',
                _children: [],
                _position: [5, 6]
            },
            {
                _type: TOKE_TYPE_RIGHT_BRACKET,
                _value: ')',
                _children: [],
                _position: [7, 7]
            },
            {
                _type: TOKE_TYPE_OPERATOR,
                _value: '&',
                _children: [],
                _position: [8, 8]
            },
            {
                _type: TOKE_TYPE_LEFT_BRACKET,
                _value: '(',
                _children: [],
                _position: [9, 9]
            },
            {
                _type: TOKE_TYPE_NUMBER,
                _value: '33',
                _children: [],
                _position: [10, 11]
            },
            {
                _type: TOKE_TYPE_OPERATOR,
                _value: '|',
                _children: [],
                _position: [12, 12]
            },
            {
                _type: TOKE_TYPE_NUMBER,
                _value: '44',
                _children: [],
                _position: [13, 14]
            },
            {
                _type: TOKE_TYPE_RIGHT_BRACKET,
                _value: ')',
                _children: [],
                _position: [15, 15]
            },
        ])
    })


    test('unknow input', () => {
        const unknowToken = new UnknowToken()
        unknowToken.value = 's'
        unknowToken.position = [1, 0]
        const unknowTokenException = new UnknowTokenException(unknowToken)
        expect(() => {
            const tokenizer = new Tokenizer()
            tokenizer.tokenize('sdfsfdasdf')
        }).toThrow('[1,1]: 未知的符号: s，允许的符号是: 1,2,3,4,5,6,7,8,9,0,|,&,(,)')
    })

})
