"use strict";
var util;
(function (util) {
    var enableDebug = false;
    var logElement;
    util.enableLog = false;
    util.getUrlParame = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var result = location.search.substr(1).match(reg);
        if (result != null) {
            try {
                return decodeURIComponent(result[2]);
            }
            catch (err) {
                return decodeURI(result[2]);
            }
        }
        return '';
    };
    util.getCookie = function (name) {
        var value;
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0; i < cookies.length; i++) {
            var str = cookies[i];
            var separatorIndex = str.indexOf('=');
            separatorIndex = separatorIndex < 0 ? str.length : separatorIndex;
            var key = str.substr(0, separatorIndex);
            var decodedKey = void 0;
            try {
                decodedKey = decodeURIComponent(key);
            }
            catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error("Could not decode cookie with key " + key, e);
                }
                continue;
            }
            if (decodedKey == name) {
                value = decodeURIComponent(str.substr(separatorIndex + 1));
                break;
            }
        }
        return value;
    };
    util.setCookie = function (name, value) {
        document.cookie = generateCookieString(name, value);
    };
    var generateCookieString = function (name, value) {
        name = name.replace(/[^#$&+\^`|]/g, encodeURIComponent);
        name = name.replace(/\(/g, '%28').replace(/\)/g, '%29');
        value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
        var cookieString = name + '=' + value + ';path=/';
        return cookieString;
    };
    util.printLogToScreen = function (message) {
        if (!enableDebug) {
            return;
        }
        var log = document.getElementById('log');
        if (!log) {
            return;
        }
        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        log.innerHTML += "<p class=\"message\">" + time + " - " + message + " </p>";
    };
    util.isEmptyURLParameters = function (str) {
        return str == null || str == '' || str == 'undefiend' || str == 'null';
    };
    var timeroutTimer = -1;
    var onStateChange = function (xhr, success, failure) {
        var state = xhr.readyState;
        if (state != XMLHttpRequest.DONE) {
            return;
        }
        clearTimeout(timeroutTimer);
        timeroutTimer = -1;
        try {
            var response = JSON.parse(xhr.responseText);
            return success(response);
        }
        catch (err) {
            return failure(err);
        }
    };
    var globalParams = {};
    util.setAjaxGlobalParameters = function (params) {
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                globalParams[key] = params[key];
            }
        }
    };
    util.ajax = function (setting) {
        var method = setting.method || "GET";
        var url = setting.url;
        var parametes = setting.parametes;
        var success = setting.success;
        var failure = setting.failure;
        var xhr = new XMLHttpRequest();
        if (method == "GET" && parametes) {
            url = util.appendParametersToURL(url, parametes);
        }
        util.setAjaxGlobalParameters({ version: '2.0.0.AH.0.Release' });
        if (globalParams != null) {
            url = util.appendParametersToURL(url, globalParams);
        }
        url = util.appendParametersToURL(url, { now: "" + new Date().getTime() });
        if (setting.beforeSend != undefined) {
            url = setting.beforeSend(url);
        }
        xhr.open(method, url);
        xhr.onreadystatechange = function () {
            return onStateChange(xhr, success, failure);
        };
        xhr.send(null);
        return xhr;
    };
    util.appendParametersToURL = function (url, parameters) {
        var hasSearch = url.indexOf('?') != -1;
        if (!hasSearch) {
            url += '?';
        }
        else {
            if (url[url.length - 1] != '&') {
                url += '&';
            }
        }
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                url += key + "=" + parameters[key] + "&";
            }
        }
        if (url[url.length - 1] == '&') {
            url = url.substring(0, url.length - 1);
        }
        return url;
    };
    function createLogElement() {
        var el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.top = '0px';
        el.style.left = '0px';
        el.style.right = '0px';
        el.style.padding = '8px';
        el.style.color = '#fff';
        el.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        el.style.fontSize = '18px';
        el.style.zIndex = '10';
        return el;
    }
    util.createLogElement = createLogElement;
    function getLogElement(parent) {
        if (parent === void 0) { parent = document.body; }
        if (logElement == undefined) {
            logElement = parent.appendChild(createLogElement());
        }
        return logElement;
    }
    function log(message) {
        if (util.enableLog) {
            getLogElement().textContent += "[ " + message + " ] ";
        }
    }
    util.log = log;
    function openLotteryPage(entrance, urlParams) {
        var url = "./entrance.html" + urlParams + "&hqpage=lottery&hqentrance=" + entrance + "&";
        return (location.href = url);
    }
    util.openLotteryPage = openLotteryPage;
})(util || (util = {}));

export{util};