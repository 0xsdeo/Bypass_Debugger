// ==UserScript==
// @name         Bypass_Debugger
// @namespace    https://github.com/0xsdeo/Bypass_Debugger
// @version      2024-12-06
// @description  Bypass new Function --> debugger && constructor --> debugger && eval --> debugger
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let temp_eval = eval;
    let temp_toString = Function.prototype.toString;

    Function.prototype.toString = function () {
        if (this === eval) {
            return 'function eval() { [native code] }';
        } else if (this === Function) {
            return 'function Function() { [native code] }';
        } else if (this === Function.prototype.toString) {
            return 'function toString() { [native code] }';
        } else if (this === Function.prototype.constructor) {
            return 'function Function() { [native code] }';
        }
        return temp_toString.apply(this, arguments);
    }

    window.eval = function () {
        if (typeof arguments[0] == "string") {
            arguments[0] = arguments[0].replaceAll(/debugger/g, '');
        }
        return temp_eval(...arguments);
    }

    let Bypass_debugger = Function;

    Function = function () {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                arguments[i] = arguments[i].replaceAll(/debugger/g, '');
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype = Bypass_debugger.prototype;

    Function.prototype.constructor = function () {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                arguments[i] = arguments[i].replaceAll(/debugger/g, '');
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype.constructor.prototype = Function.prototype;

    // hook setInterval 中的debugger
    const setIntervalHolder = window.setInterval;
    window.setInterval = function () {

        if (arguments.length > 0) {
            const functionBodyCode = getFunctionBody(arguments[0].toString());
            // 复用上面的函数体bypass的逻辑
            arguments[0] = new Function(functionBodyCode);
        }
        return setIntervalHolder.apply(this, arguments);
    }

    /**
     * 获取函数的方法体代码。
     *
     * @param {Function} fullCode - 要提取方法体的函数的代码
     * @return {string} - 返回函数的方法体代码。
     * @throws {TypeError} - 如果传入的参数不是函数，则抛出 TypeError。
     */
    function getFunctionBody(fullCode) {
        // 提取方法体的代码
        const bodyStart = fullCode.indexOf('{') + 1; // 找到方法体的开始位置
        const bodyEnd = fullCode.lastIndexOf('}');   // 找到方法体的结束位置

        // 提取并返回方法体的代码
        return fullCode.slice(bodyStart, bodyEnd).trim();
    }

})();