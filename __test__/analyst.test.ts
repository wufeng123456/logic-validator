import Tokenizer from "../lib/Tokenizer";
import Analyst from "../lib/Analyst";
import {TOKE_TYPE_NUMBER} from "../lib/Token";

test('empty input', () => {
    const tokenize = new Tokenizer()
    const analyst = new Analyst(tokenize.tokenize(''))
    expect(analyst.analyse()).toEqual([])
})
test('normal input', () => {
    const tokenize = new Tokenizer()
    const analyst = new Analyst(tokenize.tokenize('1&(2&(3|4))'))
    expect(analyst.analyse()).toEqual([{
        _type: TOKE_TYPE_NUMBER,
    }])
})
test('error input', () => {
    const tokenize = new Tokenizer()
    const analyst = new Analyst(tokenize.tokenize('1||'))
    analyst.analyse()
})
