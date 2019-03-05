(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.LV = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var TOKE_TYPE_NUMBER = 'number';
    var TOKE_TYPE_OPERATOR = 'operator';
    var TOKE_TYPE_LEFT_BRACKET = 'left_bracket';
    var TOKE_TYPE_RIGHT_BRACKET = 'right_bracket';
    var TOKEN_TYPE_UNKNOW = 'unknow';
    var TOKEN_TYPE_CONTEXT = 'context';
    var ALLOW_SYMBOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '|', '&', '(', ')'];
    var REG_OF_NUMBER = /[1234567890]/;
    var REG_OF_OPERATOR = /[|&]/;
    var REG_OF_LEFT_BRACKET = /\(/;
    var REG_OF_RIGHT_BRACKET = /\)/;
    var Token = /** @class */ (function () {
        function Token() {
            this._type = TOKEN_TYPE_UNKNOW;
            this._value = '';
            this._position = [];
            this._children = [];
        }
        Object.defineProperty(Token.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Token.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Token.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Token.prototype, "children", {
            get: function () {
                return this._children;
            },
            set: function (value) {
                this._children = value;
            },
            enumerable: true,
            configurable: true
        });
        return Token;
    }());
    var NumberToken = /** @class */ (function (_super) {
        __extends(NumberToken, _super);
        function NumberToken() {
            var _this = _super.call(this) || this;
            _this.type = TOKE_TYPE_NUMBER;
            return _this;
        }
        return NumberToken;
    }(Token));
    var OperatorToken = /** @class */ (function (_super) {
        __extends(OperatorToken, _super);
        function OperatorToken(value) {
            var _this = _super.call(this) || this;
            _this.type = TOKE_TYPE_OPERATOR;
            _this.value = value;
            return _this;
        }
        return OperatorToken;
    }(Token));
    var LeftBracketToken = /** @class */ (function (_super) {
        __extends(LeftBracketToken, _super);
        function LeftBracketToken() {
            var _this = _super.call(this) || this;
            _this.type = TOKE_TYPE_LEFT_BRACKET;
            _this.value = '(';
            return _this;
        }
        return LeftBracketToken;
    }(Token));
    var RightBracketToken = /** @class */ (function (_super) {
        __extends(RightBracketToken, _super);
        function RightBracketToken() {
            var _this = _super.call(this) || this;
            _this.type = TOKE_TYPE_RIGHT_BRACKET;
            _this.value = ')';
            return _this;
        }
        return RightBracketToken;
    }(Token));
    var UnknowToken = /** @class */ (function (_super) {
        __extends(UnknowToken, _super);
        function UnknowToken() {
            return _super.call(this) || this;
        }
        return UnknowToken;
    }(Token));
    var ContextToken = /** @class */ (function (_super) {
        __extends(ContextToken, _super);
        function ContextToken() {
            var _this = _super.call(this) || this;
            _this.type = TOKEN_TYPE_CONTEXT;
            return _this;
        }
        return ContextToken;
    }(Token));

    var UnknowTokenException = /** @class */ (function () {
        function UnknowTokenException(token) {
            this.message = "[" + token.position + "]: \u672A\u77E5\u7684\u7B26\u53F7: " + token.value + "\uFF0C\u5141\u8BB8\u7684\u7B26\u53F7\u662F: " + ALLOW_SYMBOL;
            this.token = token;
            this.stack = (new Error()).stack;
        }
        return UnknowTokenException;
    }());
    UnknowTokenException.prototype = Object.create(Error.prototype);
    UnknowTokenException.prototype.constructor = UnknowTokenException;

    var Tokenizer = /** @class */ (function () {
        function Tokenizer() {
            this.tokens = [];
            this.start = 0;
            this.end = 0;
        }
        Tokenizer.prototype.tokenize = function (input) {
            var serializedTokens = new Array();
            this.tokens = input.split('').reverse();
            while (this.tokens.length) {
                var token = this.tokens.pop();
                this.end += 1;
                this.start = this.end;
                if (REG_OF_NUMBER.test(token)) {
                    var numberToken = new NumberToken();
                    numberToken.value += token + this.getNumber();
                    numberToken.position = [this.start, this.end];
                    serializedTokens.push(numberToken);
                    continue;
                }
                if (REG_OF_OPERATOR.test(token)) {
                    var operatorToken = new OperatorToken(token);
                    operatorToken.position = [this.start, this.end];
                    serializedTokens.push(operatorToken);
                    continue;
                }
                if (REG_OF_LEFT_BRACKET.test(token)) {
                    var leftBracketToken = new LeftBracketToken();
                    leftBracketToken.position = [this.start, this.end];
                    serializedTokens.push(leftBracketToken);
                    continue;
                }
                if (REG_OF_RIGHT_BRACKET.test(token)) {
                    var rightBracketToken = new RightBracketToken();
                    rightBracketToken.position = [this.start, this.end];
                    serializedTokens.push(rightBracketToken);
                    continue;
                }
                var unknowToken = new Token();
                unknowToken.value = token;
                unknowToken.position = [this.start, this.end];
                throw new UnknowTokenException(unknowToken);
            }
            return serializedTokens;
        };
        Tokenizer.prototype.getNumber = function () {
            var value = '';
            while (this.tokens.length) {
                var token = this.tokens.pop();
                if (REG_OF_NUMBER.test(token)) {
                    value += token;
                    this.end += 1;
                }
                else {
                    this.tokens.push(token);
                    break;
                }
            }
            return value;
        };
        return Tokenizer;
    }());

    var NotAllowPositionException = /** @class */ (function () {
        function NotAllowPositionException(token, allowToken) {
            this.message = "[" + token.position + "]: \u8BE5\u7B26\u53F7\u4E0D\u5141\u8BB8\u51FA\u73B0\u5728\u8FD9\u513F: " + token.value + "\uFF0C\u5141\u8BB8\u7684\u7B26\u53F7\u662F: [" + allowToken + "]";
            this.token = token;
            this.stack = (new Error()).stack;
        }
        return NotAllowPositionException;
    }());
    NotAllowPositionException.prototype = Object.create(Error.prototype);
    NotAllowPositionException.prototype.constructor = NotAllowPositionException;

    var ContextNotEndException = /** @class */ (function () {
        function ContextNotEndException() {
            this.message = "\u4E0A\u4E0B\u6587\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5 ( ) \u662F\u5426\u5339\u914D";
            this.stack = (new Error()).stack;
        }
        return ContextNotEndException;
    }());
    ContextNotEndException.prototype = Object.create(Error.prototype);
    ContextNotEndException.prototype.constructor = ContextNotEndException;

    var _a, _b;
    var allowBeginType = [
        TOKE_TYPE_NUMBER,
        TOKE_TYPE_LEFT_BRACKET
    ];
    var allowBeginSymbol = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '('
    ];
    var ruleTypeMap = (_a = {},
        _a[TOKE_TYPE_LEFT_BRACKET] = [
            TOKE_TYPE_NUMBER,
            TOKE_TYPE_LEFT_BRACKET
        ],
        _a[TOKE_TYPE_NUMBER] = [
            TOKE_TYPE_OPERATOR,
            TOKE_TYPE_RIGHT_BRACKET
        ],
        _a[TOKE_TYPE_OPERATOR] = [
            TOKE_TYPE_NUMBER,
            TOKE_TYPE_LEFT_BRACKET
        ],
        _a[TOKE_TYPE_RIGHT_BRACKET] = [
            TOKE_TYPE_OPERATOR,
            TOKE_TYPE_RIGHT_BRACKET
        ],
        _a[TOKEN_TYPE_CONTEXT] = [
            TOKE_TYPE_OPERATOR,
            TOKE_TYPE_RIGHT_BRACKET
        ],
        _a);
    var ruleSymbolMap = (_b = {},
        _b[TOKEN_TYPE_CONTEXT] = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 0
        ],
        _b[TOKE_TYPE_NUMBER] = [
            '|', '&'
        ],
        _b[TOKE_TYPE_OPERATOR] = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 0
        ],
        _b);
    var Analyst = /** @class */ (function () {
        function Analyst(serializedTokens) {
            this.serializedTokens = [];
            this.serializedTokens = serializedTokens.reverse();
        }
        Analyst.prototype.analyse = function (isContext) {
            if (isContext === void 0) { isContext = false; }
            var analyzedToken = [];
            while (this.serializedTokens.length) {
                var token = this.serializedTokens.pop();
                if (!analyzedToken.length) {
                    // @ts-ignore
                    if (!allowBeginType.includes(token.type)) {
                        throw new NotAllowPositionException(token, allowBeginSymbol);
                    }
                }
                else {
                    var preTokenType = analyzedToken[analyzedToken.length - 1].type;
                    if (!ruleTypeMap[preTokenType].includes(token.type)) {
                        throw new NotAllowPositionException(token, ruleSymbolMap[preTokenType]);
                    }
                }
                if (token.type === TOKE_TYPE_NUMBER) {
                    analyzedToken.push(token);
                    try {
                        analyzedToken.push(this.getOperator()) && analyzedToken.push(this.getNumber());
                    }
                    catch (e) {
                        if (!(e instanceof NotAllowPositionException)) {
                            throw e;
                        }
                        try {
                            this.getRightBracket();
                            break;
                        }
                        catch (e) {
                            if (!(e instanceof NotAllowPositionException)) {
                                throw e;
                            }
                            this.serializedTokens.push(this.getLeftBracket());
                            continue;
                        }
                    }
                    continue;
                }
                if (token.type === TOKE_TYPE_OPERATOR) {
                    analyzedToken.push(token);
                    continue;
                }
                if (token.type === TOKE_TYPE_LEFT_BRACKET) {
                    var contextToken = new ContextToken();
                    contextToken.children = this.analyse(true);
                    analyzedToken.push(contextToken);
                    continue;
                }
                if (token.type === TOKE_TYPE_RIGHT_BRACKET) {
                    return analyzedToken;
                }
                throw new UnknowTokenException(token);
            }
            if (isContext) {
                throw new ContextNotEndException();
            }
            return analyzedToken;
        };
        Analyst.prototype.getNext = function (type) {
            var token = this.serializedTokens.pop();
            if (!token) {
                return;
            }
            if (token.type === type) {
                return token;
            }
            this.serializedTokens.push(token);
            throw new NotAllowPositionException(token, ruleSymbolMap[token.type]);
        };
        Analyst.prototype.getOperator = function () {
            return this.getNext(TOKE_TYPE_OPERATOR);
        };
        Analyst.prototype.getNumber = function () {
            return this.getNext(TOKE_TYPE_NUMBER);
        };
        Analyst.prototype.getRightBracket = function () {
            return this.getNext(TOKE_TYPE_RIGHT_BRACKET);
        };
        Analyst.prototype.getLeftBracket = function () {
            return this.getNext(TOKE_TYPE_LEFT_BRACKET);
        };
        return Analyst;
    }());

    var NotAllowEndException = /** @class */ (function () {
        function NotAllowEndException(allowSymbol) {
            this.message = "\u4E0D\u80FD\u4EE5\u8BE5\u7B26\u53F7\u7ED3\u675F\uFF0C\u5141\u8BB8\u7684\u7ED3\u675F\u7B26\u53F7\u662F: [" + allowSymbol + "]";
            this.stack = (new Error()).stack;
        }
        return NotAllowEndException;
    }());
    NotAllowEndException.prototype = Object.create(Error.prototype);
    NotAllowEndException.prototype.constructor = NotAllowEndException;

    exports.Tokenizer = Tokenizer;
    exports.Analyst = Analyst;
    exports.ContextNotEndException = ContextNotEndException;
    exports.NotAllowEndException = NotAllowEndException;
    exports.NotAllowPositionException = NotAllowPositionException;
    exports.UnknowTokenException = UnknowTokenException;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
