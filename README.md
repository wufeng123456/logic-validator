# logic-validator
逻辑表达式校验工具，(1|2)&amp;(2|3)
### 使用方式
- 正确
```javascript
let tokens = new LV.Tokenizer().tokenize('1&2')
new LV.Analyst().analyse(tokens) // return ast
```
- 错误
```javascript
let tokens = new LV.Tokenizer().tokenize('(11')
new LV.Analyst().analyse(tokens) // throw error
```

### api
- LV
    - Tokenizer：词法分析器
        - tokenize(input:string):Token[]：词素化
    - Analyst：语法分析器
        - analyse(tokenList:Token[])：Token[]：语法分析
    - ContextNotEndException：上下文异常，一般为括号不匹配
    - NotAllowEndException：不允许的结束符号
    - NotAllowPositionException：不允许在这里出现的符号
    - UnknowTokenException：未知的符号

### 主要数据结构
- Token:
    - type: number|operator|left_bracket|right_bracket
    - value: string
    - position: [start, end]
