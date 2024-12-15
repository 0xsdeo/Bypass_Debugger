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

(function() {
    'use strict';

    var temp_eval = eval;
    var temp_toString = Function.prototype.toString;

    Function.prototype.toString = function () {
        if (this === eval) {
            return 'function eval() { [native code] }';
        } else if (this === Function) {
            return 'function Function() { [native code] }';
        }
        else if (this === Function.prototype.toString) {
            return 'function toString() { [native code] }';
        }
        return temp_toString.apply(this, arguments);
    }

    window.eval = function () {
        if (typeof arguments[0] == "string") {
            var temp_length = arguments[0].match(/debugger/g);
            if (temp_length != null) {
                temp_length = temp_length.length;
                var reg = /debugger/;
                while (temp_length) {
                    arguments[0] = arguments[0].replace(reg, "");
                    temp_length--;
                }
            }
        }
        return temp_eval(...arguments);
    }

    var Bypass_debugger = Function;

    Function = function () {
        var reg = /debugger/;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                var temp_length = arguments[i].match(/debugger/g);
                if (temp_length != null) {
                    temp_length = temp_length.length;
                    while (temp_length) {
                        arguments[i] = arguments[i].replace(reg, "");
                        temp_length--;
                    }
                }
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype = Bypass_debugger.prototype;

    Function.prototype.constructor = function () {
        var reg = /debugger/;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                var temp_length = arguments[i].match(/debugger/g);
                if (temp_length != null) {
                    temp_length = temp_length.length;
                    while (temp_length) {
                        arguments[i] = arguments[i].replace(reg, "");
                        temp_length--;
                    }
                }
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype.constructor.prototype = Function.prototype;
})();