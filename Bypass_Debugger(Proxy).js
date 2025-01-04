// ==UserScript==
// @name         Bypass_Debugger(Proxy)
// @namespace    https://github.com/0xsdeo/Bypass_Debugger
// @version      2025-1-02
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

    Function.prototype.constructor = function () {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                arguments[i] = arguments[i].replaceAll(/debugger/g, '');
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype.constructor.prototype = Function.prototype;

    let handler = {
        apply: function (target, thisArg, argumentsList) {
            for (let i = 0; i < argumentsList.length; i++) {
                if (typeof argumentsList[i] == "string") {
                    argumentsList[i] = argumentsList[i].replaceAll(/debugger/g, '');
                }
            }
            return Bypass_debugger(...argumentsList);
        },
        construct: function (target, argumentsList, newTarget) {
            for (let i = 0; i < argumentsList.length; i++) {
                if (typeof argumentsList[i] == "string") {
                    argumentsList[i] = argumentsList[i].replaceAll(/debugger/g, '');
                }
            }
            return Bypass_debugger(...argumentsList);
        },
    };

    Function = new Proxy(Function, handler);
})();