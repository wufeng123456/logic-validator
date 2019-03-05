import Tokenizer from "../lib/Tokenizer";
import Analyst from "../lib/Analyst";
import {
    TOKE_TYPE_NUMBER,
    TOKE_TYPE_OPERATOR,
    TOKEN_TYPE_CONTEXT
} from "../lib/Token";


describe('analyst',()=>{

    test('empty input', () => {
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(analyst.analyse(tokenize.tokenize(''))).toEqual([])
    })
    test('normal input', () => {
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(analyst.analyse(tokenize.tokenize('(11|22)&(33|44)'))).toEqual([
            {
                _type: TOKEN_TYPE_CONTEXT,
                _value: '',
                _children: [
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
                    },],
                _position: []
            },
            {
                _type: TOKE_TYPE_OPERATOR,
                _value: '&',
                _children: [],
                _position: [8, 8]
            },
            {
                _type: TOKEN_TYPE_CONTEXT,
                _value: '',
                _children: [
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
                    },],
                _position: []
            },
        ])
    })
    test('recursion context', () => {
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(analyst.analyse(tokenize.tokenize('1&(2&(3&4))'))).toEqual([
            {
                _type: TOKE_TYPE_NUMBER,
                _value: '1',
                _children: [],
                _position: [1,1]
            },
            {
                _type: TOKE_TYPE_OPERATOR,
                _value: '&',
                _children: [],
                _position: [2, 2]
            },
            {
                _type: TOKEN_TYPE_CONTEXT,
                _value: '',
                _children: [
                    {
                        _type: TOKE_TYPE_NUMBER,
                        _value: '2',
                        _children: [],
                        _position: [4,4]
                    },
                    {
                        _type: TOKE_TYPE_OPERATOR,
                        _value: '&',
                        _children: [],
                        _position: [5, 5]
                    },
                    {
                        _type: TOKEN_TYPE_CONTEXT,
                        _value: '',
                        _children: [
                            {
                                _type: TOKE_TYPE_NUMBER,
                                _value: '3',
                                _children: [],
                                _position: [7,7]
                            },
                            {
                                _type: TOKE_TYPE_OPERATOR,
                                _value: '&',
                                _children: [],
                                _position: [8, 8]
                            },
                            {
                                _type: TOKE_TYPE_NUMBER,
                                _value: '4',
                                _children: [],
                                _position: [9, 9]
                            }
                        ],
                        _position: []
                    },
                ],
                _position: []
            },
        ])
    })

    test('error input order',()=>{
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(()=>{
            analyst.analyse(tokenize.tokenize('1&&'))
        })
            .toThrowError('[3,3]: 该符号不允许出现在这儿: &，允许的符号是: [1,2,3,4,5,6,7,8,9,0]')
    })
    test('error input begin',()=>{
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(()=>{
            analyst.analyse(tokenize.tokenize('&'))
        }).toThrowError('[1,1]: 该符号不允许出现在这儿: &，允许的符号是: [1,2,3,4,5,6,7,8,9,0,(]')
    })
    test('error input end',()=>{
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(()=>{
            analyst.analyse(tokenize.tokenize('(1'))
        }).toThrowError('上下文错误，请检查 ( ) 是否匹配')
    })

    test('single end',()=>{
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        analyst.analyse(tokenize.tokenize('1'))
    })

    test('error context end',()=>{
        const tokenize = new Tokenizer()
        const analyst = new Analyst()
        expect(()=>{
            analyst.analyse(tokenize.tokenize('(1|1'))
        }).toThrowError('上下文错误，请检查 ( ) 是否匹配')
    })
})
