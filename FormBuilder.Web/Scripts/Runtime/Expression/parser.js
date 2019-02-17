window.Page.ExpressParser = (function (parser, model, ui, win, $) {

    var ParserManger = function () {

    }

    var variableParserRegisterOptions = [{
        type: "session", // session
        matchExpression: /\{Session.(\w+)\}/,
        parser: "sessionParser"
    }, {
        type: "formState", // 界面状态
        matchExpression: /\{FormState.(\w+)\}/,
        parser: "formStateParser"
    }, {
        type: "data",// 数据模型
        matchExpression: /\{Data:(\w+).(\w+)\}/,
        parser: "dataParser"
    }
    ]; 
    ParserManger.prototype = {
        init: function () {
        },
        getParser: function (express) {
            var self = this;
            var matchedParser;
            $.each(variableParserRegisterOptions, function (i, parser) {
                matchResult = express.match(parser.matchExpression);
                if (matchResult && matchResult.length) {
                    matchedParser = self[parser.parser];
                }
            });
            return matchedParser;
        },
        parser: function (express) {
            var parser = this.getParser(express);
            if (parser) {
                return parser(express);
            }
            return express;
        },
        sessionParser: function (express) {
            var matchExpression = /\{Session.(\w+)\}/;
            var matchKeys, sessionKey, parsedResult = express;
            if (typeof express === "string") {
                matchKeys = express.match(matchExpression);
                if (matchKeys && matchKeys.length === 2) {
                    sessionKey = matchKeys[1];
                    value = Page.Context.get(sessionKey);
                    if (value === undefined || value === null) {
                        value = '';
                    }
                    parsedResult = express.replace(matchExpression, value);// 替换表达式的数据
                }
            }
            return parsedResult;
        },
        formStateParser: function (express) {
            var matchExpression = /\{FormState.(\w+)\}/;
            var matchKeys, formKey, parsedResult = express;
            if (typeof express === "string") {
                matchKeys = express.match(matchExpression);
                if (matchKeys && matchKeys.length === 2) {
                    formKey = matchKeys[1];
                    value = Page.FormSate.get(formKey);
                    if (value === undefined || value === null) {
                        value = '';
                    }
                    parsedResult = express.replace(matchExpression, value);// 替换表达式的数据
                }
            }
            return parsedResult;
        },
        dataParser: function (express) {
            var matchExpression = /\{Data:(\w+).(\w+)\}/;
            var matchKeys, sessionKey, parsedResult = express;
            if (typeof express === "string") {
                matchKeys = express.match(matchExpression);
                while (matchKeys && matchKeys.length === 3) {
                    sessionKey = matchKeys[1];
                    value = model.getMainObjectValue(matchKeys[2]);

                    if (value === undefined || value === null) {
                        value = '';
                    }
                    express = express.replace(matchExpression, value);// 替换表达式的数据
                    matchKeys = express.match(matchExpression);
                }
            }
            return express;
        },
        eval: function (express) {
            // 动态计算表达式 支持复杂js语法

            var self = this;
            var matchedParser;
            $.each(variableParserRegisterOptions, function (i, parser) {
                matchResult = express.match(parser.matchExpression);
                if (matchResult && matchResult.length) {
                    matchedParser = self[parser.parser];
                    express = matchedParser(express);// 处理表达式
                }
            });


            if (express.indexOf("return") == 0) {
                var func = new Function(express);
                return func.call(window, []);
            } else {
                return eval(express);
            }
        }
    };

    parser = new ParserManger();
    return parser;
})(Page.ExpressParser, Page.Model, Page.UI, window, $);