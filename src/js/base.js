//工具方法--------------------------------------------------------------
/**
 * 工具
 */
var Util = (function (win) {
    var ajaxRequestObj = function () {
        this.xmlHttpRequest = null
        this.timeoutID = -1
        this.requestCallBack = null
        this.requestNum = 3
        this.requestUrl = ""
        var self = this

        this.sendRequestGet = function (url, callBack) {
            this.requestCallBack = callBack
            this.requestUrl = url
            var isSupportAjax = this.createXMLHttpRequest()

            if (isSupportAjax) {
                this.requestNum--
                clearTimeout(this.timeoutID)
                this.timeoutID = setTimeout(function () {
                    clearTimeout(self.timeoutID)
                    self.xmlHttpRequest.abort()
                    if (self.requestNum > 0) {
                        self.sendRequestGet(url, callBack)
                    }
                }, 10000)
                this.xmlHttpRequest.open("GET", url, true)
                this.xmlHttpRequest.onreadystatechange = this.processResponse
                this.xmlHttpRequest.send(null)
            } else {
                if (this.requestCallBack) {
                    var res = {
                        header: "504"
                    }
                    this.requestCallBack(res)
                } else {
                    return
                }
            }
        }
        this.sendRequestPost = function (url, params, callBack) {
            this.requestCallBack = callBack
            this.requestUrl = url
            var isSupportAjax = this.createXMLHttpRequest()

            if (isSupportAjax) {
                this.requestNum--
                clearTimeout(this.timeoutID)
                this.timeoutID = setTimeout(function () {
                    clearTimeout(self.timeoutID)
                    self.xmlHttpRequest.abort()
                    if (self.requestNum > 0) {
                        self.sendRequestPost(url, params, callBack)
                    }
                }, 10000)
                this.xmlHttpRequest.open("POST", url, true)
                this.xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                this.xmlHttpRequest.onreadystatechange = this.processResponse
                this.xmlHttpRequest.send(params)
            } else {
                if (this.requestCallBack) {
                    var res = {
                        header: "504"
                    }
                    this.requestCallBack(res)
                } else {
                    return
                }
            }
        }

        this.processResponse = function () {
            if (self.xmlHttpRequest.readyState == 4) {
                /*if (self.xmlHttpRequest.status == 0 && self.requestNum > 0) return;*/

                if (self.xmlHttpRequest.status == 200) {
                    clearTimeout(self.timeoutID)
                    var res = self.xmlHttpRequest.responseText
                    try {
                        if (res != "" && res != null && res != undefined) {
                            res = eval("(" + res + ")")
                        }
                    } catch (e) {
                        if (self.requestCallBack) {
                            self.requestCallBack({
                                header: "504"
                            })
                        }
                        return
                    }

                    res.header = "200"
                    if (self.requestCallBack) {
                        self.requestCallBack(res)
                    }
                } else {
                    if (self.requestNum <= 0) {
                        if (self.requestCallBack) {
                            self.requestCallBack({
                                header: self.xmlHttpRequest.status
                            })
                        }
                    } else {
                        self.xmlHttpRequest.abort()
                        self.sendRequestGet(self.requestUrl, self.requestCallBack)
                    }
                }
            }
        }

        this.createXMLHttpRequest = function () {
            try {
                this.xmlHttpRequest = new XMLHttpRequest()
                return true
            } catch (e) {
                try {
                    this.xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP")
                    return true
                } catch (e) {
                    try {
                        this.xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP")
                        return true
                    } catch (e) {
                        return false
                    }
                }
            }
        }

        this.cancel = function (callback) {
            clearTimeout(this.timeoutID)
            this.xmlHttpRequest.abort()

            if (callback) {
                callback()
            }
        }
    }

    var util = {
        is_test: false,
        request_list: {}
    }

    util.url_param_str = function (url, params) {
        var temp_url = ""
        if (url.indexOf("?") != -1) {
            temp_url = url
        } else {
            temp_url = url + "?"
        }

        if (typeof params === "object") {
            for (var item in params) {
                if (item != "page_name") {
                    if (temp_url.substr(temp_url.length - 1, 1) != "?") {
                        temp_url += "&" + item + "=" + params[item]
                    } else {
                        temp_url += item + "=" + params[item]
                    }
                }
            }
        }
        temp_url.replace(/\?\&/g, "?")
        return temp_url
    }

    util.jsonToString = function (obj) {
        switch (typeof obj) {
            case "string":
                return '"' + obj.replace(/(["\\])/g, "\\$1") + '"'
            case "array":
                return "[" + obj.map(this.jsonToString).join(",") + "]"
            case "object":
                if (obj instanceof Array) {
                    var strArr = []
                    var len = obj.length
                    for (var i = 0; i < len; i++) {
                        strArr.push(this.jsonToString(obj[i]))
                    }
                    return "[" + strArr.join(",") + "]"
                } else if (obj == null) {
                    return "null"
                } else {
                    var string = []
                    for (var property in obj) string.push(this.jsonToString(property) + ":" + this.jsonToString(obj[property]))
                    return "{" + string.join(",") + "}"
                }
            case "number":
                return obj
            case "boolean":
                return obj
        }
    }

    util.stringToJson = function (data) {
        var json = {}
        if (typeof data === "string") {
            json = eval("(" + data + ")")
        } else if (typeof data === "object") {
            json = eval(data)
        }
        return json
    }

    util.ajax = function (url, params, call_back) {
        var self = this
        url = util.url_param_str(url, params)
        var temp_obj = new ajaxRequestObj()

        this.request_list[url] = temp_obj
        this.request_list["time"] = new Date().getTime()

        if (url.indexOf("?") < 0) {
            url += "?"
        }

        // TODO: 是否添加前缀 &
        var lastChar = url.charAt(url.length - 1)
        // if () {

        // }

        url += "&now=" + this.request_list["time"]

        // 华为或者中兴平台的标识
        var provider = getCookie("providerID")
        if (provider && provider != "") {
            url += "&providerid=" + provider
        } else {
            // TODO: 入口页判断，如果没有 providerId 直接退出专区
            return
        }

        // if (DEV_MAP[STB_TYPE]) {
        //     url += "&version=" + (DEV_MAP[STB_TYPE].is4K ? is4KVer : not4KVer);
        // } else {
        //     // 默认为 4k
        //     url += "&version=" + is4KVer;
        // }

        url += "&version=" + VERSION_4K

        temp_obj.sendRequestGet(url, function (data) {
            call_back(data)
            for (var sa in self.request_list[url]) {
                self.request_list[url][sa] = ""
            }
            delete self.request_list[url]
            delete self.request_list["time"]
        })
    }

    util.cancel_ajax = function (url) {
        var self = this
        if (url) {
            if (this.request_list[url]) {
                this.request_list[url].cancel(function () {
                    delete self.request_list[url]
                })
            }
        } else {
            for (var item in this.request_list) {
                this.request_list[item].cancel(function () {
                    delete self.request_list[item]
                })
            }
        }
    }

    util.formatTimeReport = function (date) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
    }

    /*
       * 设置cookie时简写
       */
    var set_cookie = {
        media_asset_id: "m",
        parent_category_id: "pc",
        category_id: "c",
        ui_style: "u",
        page_name: "p",
        video_id: "v",
        video_type: "t",
        search_type: "s",
        name: "n",
        page_index: "i",
        search_key: "k",
        focus_area: "a",
        media_action: "ma",
        idpos: "is",
        datapos: "ds",
        rec_category_id: "rc"
    }
    /*
       * 获取cookie时全称
       */
    var get_cookie = {
        m: "media_asset_id",
        pc: "parent_category_id",
        c: "category_id",
        u: "ui_style",
        p: "page_name",
        v: "video_id",
        t: "video_type",
        s: "search_type",
        n: "name",
        i: "page_index",
        k: "search_key",
        a: "focus_area",
        ma: "media_action",
        is: "idpos",
        ds: "datapos",
        rc: "rec_category_id"
    }
    /*
       * 设置共用cookie
       * @param {string} name
       * @param {string/json}   value
       */
    util.set_common_cookie = function (name, obj) {
        var pre_cookie_obj = ""
        /*注释掉以下逻辑后适用情况：从推荐位进来不管走到哪儿，原路返回（launcher->详情->播放->详情->launcher）*/
        if (name == "jump_ctrl") {
            /*页面跳转控制*/
            var curr_cookie = this.get_common_cookie(name)
            /*从退出弹窗用返回键关闭弹窗，再跳到别的页面，初始化cookie*/
            if (curr_cookie && curr_cookie.url && curr_cookie.url.page_name == "home" && curr_cookie.url.from == "exit") {
                this.del_common_cookie(name)
                pre_cookie_obj = {
                    u: {
                        p: "recommend",
                        from: "recom"
                    },
                    p: {
                        a: 1,
                        idx: 0,
                        nav_idx: 0
                    }
                }
            }
        }
        var cookie_str = gxcatv_get_global_var(name)
        var temp_obj = {
            u: {},
            p: {}
        }
        if (cookie_str) {
            cookie_str = eval(cookie_str)
        }

        for (var key in obj.url) {
            if (set_cookie[key]) {
                temp_obj.u[set_cookie[key]] = obj.url[key]
            } else {
                temp_obj.u[key] = obj.url[key]
            }
        }
        for (var key in obj.page) {
            if (set_cookie[key]) {
                temp_obj.p[set_cookie[key]] = obj.page[key]
            } else {
                temp_obj.p[key] = obj.page[key]
            }
        }

        if (cookie_str && cookie_str.length > 0) {
            var last_page = cookie_str[cookie_str.length - 1]
            if (obj.url.page_name == "star_detail" || obj.url.page_name == "detail") {
                /*如果是详情页或是明星详情页，则检测详情和明星详情的长度，超过6条则遵守先进先出的原则*/
                if (last_page instanceof Array) {
                    if (last_page[last_page.length - 1].u.p == obj.url.page_name) {
                        /*一样的页面不需要新加一个*/
                        last_page[last_page.length - 1] = temp_obj
                        cookie_str[cookie_str.length - 1] = last_page
                        cookie_str = util.jsonToString(cookie_str)
                        gxcatv_set_global_var(name, cookie_str)
                        return
                    }
                    var detail_arr = last_page
                    if (detail_arr.push(temp_obj) > 6) {
                        detail_arr.shift()
                        detail_arr.shift()
                    }
                    cookie_str.pop()
                } else {
                    var detail_arr = []
                    detail_arr.push(temp_obj)
                }
                temp_obj = detail_arr
            } else if (cookie_str[cookie_str.length - 1].u.p == obj.url.page_name) {
                /*一样的页面不需要新加一个*/
                cookie_str[cookie_str.length - 1] = temp_obj
                cookie_str = util.jsonToString(cookie_str)
                gxcatv_set_global_var(name, cookie_str)
                return
            }
            if (pre_cookie_obj) {
                /*有需要预处理的cookie*/
                cookie_str[cookie_str.length] = pre_cookie_obj
                cookie_str[cookie_str.length + 1] = temp_obj
            } else {
                cookie_str[cookie_str.length] = temp_obj
            }
            cookie_str = util.jsonToString(cookie_str)
            gxcatv_set_global_var(name, cookie_str)
        } else {
            cookie_str = []
            if (pre_cookie_obj) {
                /*有需要预处理的cookie*/
                cookie_str[0] = pre_cookie_obj
                cookie_str[1] = temp_obj
            } else {
                cookie_str[0] = temp_obj
            }

            cookie_str = util.jsonToString(cookie_str)
            gxcatv_set_global_var(name, cookie_str)
        }
    }

    /**
     * 获取共用cookie中的最后一个
     * @param {string} name
     * @returns {json} result
     */
    util.get_common_cookie = function (name) {
        var result = gxcatv_get_global_var(name)

        var temp_obj = null

        if (result && result.length > 0) {
            result = util.stringToJson(result)
            if (result.length <= 0) {
                return ""
            }
            result = result[result.length - 1]
            /*如果是（详情和明星详情的）数组，则要再多做一层数据获取*/
            if (result instanceof Array) {
                result = result[result.length - 1]
            }
            temp_obj = {
                url: {},
                page: {}
            }
            for (var key in result.u) {
                if (get_cookie[key]) {
                    temp_obj.url[get_cookie[key]] = result.u[key]
                } else {
                    temp_obj.url[key] = result.u[key]
                }
            }
            for (var key in result.p) {
                if (get_cookie[key]) {
                    temp_obj.page[get_cookie[key]] = result.p[key]
                } else {
                    temp_obj.page[key] = result.p[key]
                }
            }
        }
        return temp_obj
    }

    /**
     * 删除所有Cookie
     * @param {string} name
     * @param {string} page_name  页面的名称，作为一个判断的标志,如果有此参数，则只删除这个key相应的值，如果没有则删除整个cookie
     */
    util.del_common_cookie = function (name, page_name) {
        if (!page_name) {
            gxcatv_set_global_var(name, "")
        } else {
            /*删除最后一个*/
            var result = gxcatv_get_global_var(name)
            var temp_obj = null
            if (result && result.length > 0) {
                result = util.stringToJson(result)
                /*如果是详情和明星详情的cookie需要另作处理*/
                var last_page = result[result.length - 1]
                if (last_page instanceof Array && last_page[last_page.length - 1].u.p == page_name) {
                    if (last_page.length > 1) {
                        last_page.pop()
                        result[result.length - 1] = last_page
                    } else {
                        result.pop()
                    }
                } else if (last_page.u.p == page_name) {
                    /*result[result.length-1] = "";*/
                    result.pop()
                }
                cookie_str = util.jsonToString(result)
                gxcatv_set_global_var(name, cookie_str)
            }
        }
    }

    /**
     * 设置基本信息cookie存储
     * @param {string} name
     * @param {string/json}   value
     */
    util.set_base_cookie = function (name, value, len) {
        var cookie_str = gxcatv_get_global_var(name)
        if (cookie_str && cookie_str.length > 0) {
            var cookie_json = util.stringToJson(cookie_str)
            cookie_json[0] = value
            cookie_str = util.jsonToString(cookie_json)
            gxcatv_set_global_var(name, cookie_str)
        } else {
            cookie_str = []
            cookie_str[0] = value
            cookie_str = util.jsonToString(cookie_str)
            gxcatv_set_global_var(name, cookie_str)
        }
    }
    /**
     * 获取共用cookie
     * @param {string} name
     * @returns {json} result
     */
    util.get_base_cookie = function (name) {
        var result = gxcatv_get_global_var(name)
        if (result && result.length > 0) {
            result = util.stringToJson(result)
        }
        return result
    }

    /**
     * js截取字符串，中英文都能用
     * @param {sting} str：需要截取的字符串
     * @param {int} len: 需要截取的长度(英文长度)
     * @param {string} type: 截取后的后缀字符串默认"...",若不要请传参数"".
     */
    util.substr = function (str, len, type) {
        type = type == null ? "..." : type
        var str_length = 0
        var str_len = 0
        var str_cut = new String()
        str_len = str.length
        var sArr = str.match(/[^\x00-\xff]/gi)
        var strL = str_len + (sArr == null ? 0 : sArr.length)
        if (strL <= len + 3) {
            return str
        }
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i)
            str_length++
            if (escape(a).length > 4) {
                str_length++
            }
            str_cut = str_cut.concat(a)
            if (str_length >= len) {
                str_cut = str_cut.concat(type)
                return str_cut
            }
        }
        str_cut = null
    }
    /**
     * 否存在class
     * @param {object} ele：dom对象
     * @param {string} cls: 需要判断的class
     */
    util.hasClass = function (ele, cls) {
        var f = false
        /* var t = ele.className;*/
        if (ele && ele.attributes["class"] && ele.attributes["class"].value && ele.attributes["class"].value.length > 0) {
            var clasArray = ele.attributes["class"].value.split(" ")
            for (var i = 0; i < clasArray.length; i++) {
                if (clasArray[i] == cls) {
                    f = true
                }
            }
        }
        return f
    }
    /**
     * 添加class
     * @param {object} ele：dom对象
     * @param {string} cls: 需要添加的class
     */
    util.addClass = function (ele, cls) {
        var f = util.hasClass(ele, cls)
        if (!f) {
            if (ele && ele.attributes["class"] && ele.attributes["class"].value && ele.attributes["class"].value.length > 0) {
                ele.attributes["class"].value += " " + cls
            } else if (ele) {
                ele.setAttribute("class", cls)
            }
        }
    }
    /**
     * 删除class
     * @param {object} ele：dom对象
     * @param {string} cls: 需要删除的class
     */
    util.removeClass = function (ele, cls) {
        if (util.hasClass(ele, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(|$)")
            ele.attributes["class"].value = ele.attributes["class"].value.replace(reg, "")
        }
    }

    /**
     * 返回随机的域名
     */
    util.random_url = function (arr) {
        if (arr && arr.length > 0) {
            return arr[Math.floor(Math.random() * arr.length)]
        }
        return ""
    }

    /**
     * 确保域名后接的路径有/
     * @param {string} url 图片地址
     * @param {string?} transcode_size 图片转码大小 格式：（宽x高）e.g:200x300
     **/
    util.check_url = function (url, transcodeSize) {
        if (!url) return ""

        if (transcodeSize) {
            // url = /inject/050E00005405679567379F14620D3B6E.jpg 的情况
            // 切分
            url = url.split("/")
            // 插入尺寸数据
            url.splice(-1, 0, transcodeSize)
            url = url.join("/")
            /* url = url.replace(/(\d*x\d*)/, transcode_size);*/
        }

        return url.substr(0, 1) != "/" ? "/" + url : url
    }

    util.get_img_url = function (url, size) {
        return this.random_url(BASE_INFO.cdn_domain) + this.check_url(url, size)
    }

    /**
     * 返回上一级页面操作
     * @param reportData
     */
    util.go_back = function (reportData) {
        var return_cookie = Util.get_common_cookie("jump_ctrl")

        var urlObj = {},
            pageName = "",
            from = ""

        if (return_cookie) {
            urlObj = return_cookie.url || ""
            pageName = urlObj.page_name || ""
            from = urlObj.from || ""
        }

        /*从其他sp进来的，则回到其他SP*/
        if (pageName == "otherSP" && from) {
            if (return_cookie.page.back_url) {
                /*有这个参数的直接用这个参数返回*/
                location.href = decodeURIComponent(return_cookie.page.back_url)
                return
            }
            if (from == "zt1") {
                location.href = "http://61.191.42.118:6001/epg/index.php?type=zt&id=73"
            }
            if (from == "zt2") {
                location.href = "http://61.191.42.118:6001/epg/index.php?type=zt&id=74"
            }
            if (from == "zt3") {
                location.href = "http://61.191.42.118:6001/epg/index.php?type=zt&id=77"
            }
            if (from == "zt5") {
                location.href = "http://117.71.18.21:8181/hstv/index_zt.jsp?focus_id=" + return_cookie.page.f
            }
            return
        }

        /*从launcher进来直接退出到launcher*/
        if (pageName == "launcher") {
            return util.returnLauncher()
        }

        // 从搜索进来
        if (pageName == "search") {
            return util.returnLauncher()
        }

        /*从轮播进来需要弹出返回选择框，选择回到专区首页或是返回轮播*/
        if (pageName == "carousel" && !from) {
            return confirmExitModel.init(0, FOCUS_AREA, "carousel", reportData)
        }

        /*从launcher 进来,page_name为recommond 或者from字段值为recom则直接退出到launcher*/
        if (pageName == "recommend" && from == "recom") {
            var idx = BASE_INFO.novice ? 0 : 1
            return confirmExitModel.init(idx, FOCUS_AREA)
        } else if (pageName && pageName != "recommend" && pageName != "carouselRecom" && from != "exit") {
            /* 上报用户行为*/
            if (reportData) {
                reportData.afterPageCate = PAGE_CATE[pageName]
                if (typeof reportData.afterPageCate == "object") {
                    reportData.afterPageCate = PAGE_CATE[pageName][return_cookie.url.type]
                }

                if (pageName == "home") {
                    reportData.aid = return_cookie.page.nav_idx + "_" + return_cookie.page.idx
                }

                var cateIdName = CATE_ID[reportData.afterPageCate]
                var aid = return_cookie.url[cateIdName] ? return_cookie.url[cateIdName] : ""
                if (cateIdName == "asset_id") {
                    aid = return_cookie.url["category_id"] ? return_cookie.url["category_id"] : aid
                }
                reportData.aid = aid ? aid : reportData.aid

                reportUserAction(reportData, function () {
                    var htmlFileName = ""
                    var cookiePageName = return_cookie.url.page_name

                    if (cookiePageName.indexOf(".html") < 0) {
                        htmlFileName = cookiePageName + ".html"
                    } else {
                        htmlFileName = cookiePageName
                    }

                    if (htmlFileName.charAt(0) == "/") {
                        htmlFileName = htmlFileName.replace("/", "")
                    }

                    var returnUrl = LOCAL ? ORIGIN_LOCAL + "/" + htmlFileName : BASE_URL + htmlFileName
                    location.href = Util.url_param_str(returnUrl, return_cookie.url)
                })
            } else {
                var htmlFileName = ""
                var cookiePageName = return_cookie.url.page_name
                if (cookiePageName.indexOf(".html") < 0) {
                    htmlFileName = cookiePageName + ".html"
                } else {
                    htmlFileName = cookiePageName
                }
                if (htmlFileName.charAt(0) == "/") {
                    htmlFileName = htmlFileName.replace("/", "")
                }
                var returnUrl = LOCAL ? ORIGIN_LOCAL + "/" + htmlFileName : BASE_URL + htmlFileName
                location.href = Util.url_param_str(returnUrl, return_cookie.url)
            }
        } else {
            return util.returnLauncher()
        }
    }

    /**
     * 返回launcher
     */
    util.returnLauncher = function () {
        Util.del_common_cookie("base_info")
        Util.del_common_cookie("jump_ctrl")

        var url = util.getReturnUrl()

        if (url) {
            return (location.href = url)
        }

        try {
            return Utility.setValueByName("exitIptvApp")
        } catch (err) { }
    }

    /**
     * 获取返回地址
     */
    util.getReturnUrl = function () {
        var url = getCookie("returnUrl")

        // 返回导航页
        if (decodeURIComponent(url).indexOf("index.html") != -1) {
            if (location.href.indexOf("youku_test") != -1) {
                return "/youku_test/index.html"
            } else if (location.href.indexOf("youku") != -1) {
                return "/youku/index.html"
            } else {
                return "/index.html"
            }
        }

        // 返回地址是否正确
        if (url && url != "undefined" && url != "" && url.indexOf("http") != -1) {
            return decodeURIComponent(url)
        }

        return null
    }

    /**
     * 文字提示弹出框
     * @param {string} text 文案
     * @param {string} id 容器 dom 元素 id
     * @param {number} duration 显示时长，默认 5 秒，为 0 则不自动消失
     */
    util.alert_msg = function (text, id, duration) {
        showdiv(id)
        $("alert_text").innerHTML = text
        this.fade(id, duration)
    }

    /**
     *弹窗隐退
     */
    util.timer = ""
    util.fade = function (id, duration) {
        clearTimeout(this.timer)

        if (duration == undefined) {
            duration = 5
        }

        if (duration > 0) {
            this.timer = setTimeout(function () {
                closediv(id)
                clearTimeout(this.timer)
            }, duration * 1000)
        }
    }

    /*放大呼吸效果*/
    util.animate_timer = ""
    /**
     * @param id 执行动作元素id
     * @param action 操作类型：start:开始 其它值为结束
     * @param type 运动类型：0：放大缩小  1：阴影的呼吸效果   2：显示和隐藏
     */
    util.breath_animate = function (id, action, type) {
        var scale = 0
        var opacity = 0
        switch (type) {
            case 0:
                scale = 1
                $(id).style.transform = "scale(1,1)"
                $(id).style.webkitTransform = "scale(1,1)"
                break
            case 1:
                opacity = 0
                break
        }
        /*var scale = 1;*/
        var oprate = "add"
        clearTimeout(this.animate_timer)

        function breath() {
            switch (type) {
                case 0:
                    scale = oprate == "add" ? 1.1 : 1
                    $(id).style.transform = "scale(" + scale + ")"
                    $(id).style.webkitTransform = "scale(" + scale + ")"

                    oprate = oprate == "add" ? "sub" : "add"

                    if (action == "start") {
                        this.animate_timer = setTimeout(breath, 500)
                    } else {
                        clearTimeout(this.animate_timer)
                        $(id).style.transform = "scale(1,1)"
                        $(id).style.webkitTransform = "scale(1,1)"
                    }
                    break
                case 1:
                    $(id).style.boxShadow = "0px 0px 14px 4px rgba(48,150,236," + opacity + "), 1px -1px 5px 6px rgba(2,2,2,0)"
                    $(id).style.webkitBoxShadow =
                        "0px 0px 14px 4px rgba(48,150,236," + opacity + "), 1px -1px 5px 6px rgba(2,2,2,0)"

                    opacity = oprate == "add" ? opacity + 0.1 : opacity - 0.1
                    if (opacity >= 1) {
                        oprate = "sub"
                    }
                    if (opacity <= 0) {
                        oprate = "add"
                    }
                    if (type == "start") {
                        this.animate_time = setTimeout(breath, 80)
                    } else {
                        clearTimeout(this.animate_time)
                        $(id).style.boxShadow = "0px 0px 14px 4px rgba(48,150,236,0), 1px -1px 5px 6px rgba(2,2,2,0)"
                        $(id).style.webkitBoxShadow = "0px 0px 14px 4px rgba(48,150,236,0), 1px -1px 5px 6px rgba(2,2,2,0)"
                    }
                    break
            }
        }

        breath()
    }

    /**
     * 检测盒子型号,对创维的盒子另外动态加载css文件
     */
    util.getTypeLoadCss = function (file_name) {
        if (typeof Authentication != "undefined") {
            switch (STB_TYPE) {
                case "E900":
                case "E8205":
                case "E910":
                case "B760H":
                case "B760EV3":
                case "B860AV1.1":
                case "B860A":
                case "Browser":
                    var time = new Date().getTime()
                    var oHead = document.getElementsByTagName("HEAD").item(0)
                    var link = document.createElement("link")
                    link.href = "css/" + file_name + ".css?time=" + time
                    link.rel = "stylesheet"
                    link.type = "text/css"
                    oHead.appendChild(link)
                    break
            }
        }
    }

    /**
     * mplayer频对象释放
     */
    util.releaseMplayer = function () {
        var instanceId = this.get_common_cookie("instanceId")
        if (instanceId) {
            var mp = new MediaPlayer()
            mp.bindNativePlayerInstance(instanceId)
            mp.stop()
            mp.releaseMediaPlayer(instanceId)
            this.del_common_cookie("instanceId")
        }
    }

    /**
     * 打印日志
     */
    util.showdebug = function (msg, cls) {
        if (!IS_DEV) {
            return
        }

        var isTestUser = USER_ID ? USER_ID.indexOf("test") != -1 : false
        if (!isTestUser) return

        if (!logElementId) {
            logElementId = createLogElement()
        }

        var log = document.getElementById(logElementId)

        if (cls) {
            log.innerHTML = ""
        }

        var message = ""
        message += "<div>"
        message += typeof msg === "object" ? JSON.stringify(msg) : msg
        message += "</div>"

        log.innerHTML += message

        var scroll = log.scrollHeight - log.offsetHeight
        if (scroll > 0) {
            log.scrollTop = scroll
        }
    }

    /**
     * 获取盒子信息 ，用户id、盒子型号等
     * @param type 获取内容key值
     * @returns {*}
     */
    util.getConfig = function (type) {
        if (typeof Authentication != "undefined") {
            if (type == "UserID") {
                STB_TYPE = STB_TYPE || Authentication.CTCGetConfig("STBType")
                if (DEV_MAP[STB_TYPE].type == "CW") {
                    /*if (Authentication.CTCGetConfig ("STBType").substr (0, 1) == "E") {*/
                    /*创维的盒子都用username来获取用户id*/
                    return Authentication.CTCGetConfig("username")
                } else {
                    return Authentication.CTCGetConfig(type)
                }
            } else {
                return Authentication.CTCGetConfig(type)
            }
        } else {
            switch (type) {
                case "UserID":
                    return configUserId
                case "STBType":
                    return configSTBType
            }
        }
    }
    /**
     * 页面最初的初始化
     */
    util.base_init = function (callback, data) {
        var base_info = this.get_base_cookie("base_info") ? this.get_base_cookie("base_info")[0] : ""

        // launcher 入口进来会带上 providerid 参数
        // 次参数不为空，说明从 launcher 进来，需要清空 cookie
        var providerID = URL_REQUEST["providerid"]

        if (providerID) {
            base_info = null
            Util.del_common_cookie("base_info")
            Util.del_common_cookie("jump_ctrl")
        }

        if (base_info && base_info != "") {
            /*有数据说明不是第一次进入*/
            if (typeof callback == "function") {
                callback()
            }
        } else {
            // TODO: 如果参数没有取到时的处理
            // 辽宁的参数如果没有，则值位字符串 undefined
            try {
                USER_ID = URL_REQUEST["iaspuserid"] || defaultUserID
                setCookie("iaspuserid", USER_ID)
                STB_TYPE = this.getConfig("STBType")
                var providerid = URL_REQUEST["providerid"] || defaultProvider
                setCookie("providerID", providerid)
                var iaspmac = URL_REQUEST["iaspmac"]
                setCookie("iaspmac", iaspmac)
                var iaspip = URL_REQUEST["iaspip"]
                setCookie("iaspip", iaspip)
                var stbid = URL_REQUEST["stbId"]
                var boxCity = URL_REQUEST["boxCity"]
                var areaId = URL_REQUEST["areaId"]
                var iaspadsl = URL_REQUEST["iaspadsl"]
                var source = data && data.source ? data.source : ""
            } catch (err) { }

            util.ajax(
                MAIN_URL,
                {
                    user_id: USER_ID,
                    stb_model: STB_TYPE,
                    source: source,
                    iaspmac: iaspmac,
                    iaspip: iaspip,
                    stbId: stbid,
                    box_city: boxCity,
                    area_id: areaId,
                    iaspadsl: iaspadsl
                },
                function (response) {
                    try {
                        var state = response.result.state
                        var reason = response.result.reason
                    } catch (err) {
                        Util.alert_msg("访问服务器失败", "alert", 0)
                        return
                    }

                    if (state == 200) {
                        base_info = response.data
                        if (base_info.api) {
                            base_info.api = ""
                        }
                        util.set_base_cookie("base_info", base_info)
                        if (typeof callback == "function") {
                            callback()
                        }
                    } else {
                        Util.del_common_cookie("base_info")
                        Util.del_common_cookie("jump_ctrl")

                        try {
                            var mainEl = document.getElementById("main")
                            if (mainEl) {
                                hide(mainEl)
                            }
                            var reason = response.result.reason
                            var message = reason + "返回键返回。"
                            Util.alert_msg(message, "alert", 0)
                            document.onkeydown = function (e) {
                                var keyCode = e.keyCode || e.which
                                if (keyCode == 8) {
                                    return history.back()
                                }
                            }
                        } catch (err) {
                            Utility.setValueByName("exitIptvApp")
                        }
                    }
                }
            )
        }
    }

    util.loadScript = function (url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript"
        script.src = url
        script.onload = function () {
            try {
                callback()
            } catch (err) {
                Util.showdebug(err)
            }
        }

        try {
            document.head.appendChild(script)
        } catch (err) {
            document.body.appendChild(script)
        }
    }

    /**
     * 下单
     * @param params
     * "urlParam"   : params,   //下单参数
     * "cookieParam": cookie_obj,   //cookie存放参数
     * "returnParam": order_return_jump,    //订购返回路径
     * "packages"   : packages  //产品包列表
     */
    util.go_order = function (params) {
        var $self = this
        if (BASE_INFO.api.itv_order.substr(0, 1) != "/") {
            BASE_INFO.api.itv_order = "/" + BASE_INFO.api.itv_order
        }
        var requestURL = BASE_INFO.api_domain + BASE_INFO.api.itv_order
        $self.ajax(requestURL, params.urlParam, function (result) {
            if (result.result.state == 200) {
                /*存cookie*/
                if (params.cookieParam) {
                    $self.set_common_cookie("jump_ctrl", params.cookieParam)
                }
                result.data.post_data.returnUrl = params.returnParam
                /* 上报用户行为*/
                reportUserAction(params.reportParam, function () {
                    $self.make_submit_form(result.data.post_data, result.data.itv_url)
                })
            } else {
                /*获取数据失败*/
                Util.alert_msg(result.result.reason, "alert")
                ALERT_CTRL_FLAG = false
            }
        })
    }
    /*提交订购表单*/
    util.make_submit_form = function (arr, post_url) {
        /* 创建一个 form*/
        var form1 = document.createElement("form")
        form1.id = "form1"
        form1.name = "form1"
        /* 添加到 body 中*/
        document.body.appendChild(form1)
        /* 创建一个输入*/
        for (var obj in arr) {
            var input = document.createElement("input")
            /* 设置相应参数*/
            input.type = "text"
            input.name = obj
            input.value = arr[obj]
            /* 将该输入框插入到 form 中*/
            form1.appendChild(input)
        }
        /* form 的提交方式*/
        form1.method = "POST"
        /* form 提交路径*/
        form1.action = post_url
        /* 对该 form 执行提交*/
        form1.submit()
        /* 删除该 form*/
        document.body.removeChild(form1)
    }

    /**
     * 鉴权，获取产品包
     */
    util.get_auth_info = function (params, callback) {
        // var url = BASE_INFO.api_domain + BASE_INFO.api.has_order;
        var url = BASE_INFO.api_domain + "/epg/itv/auth_v3"
        var params = {
            token: BASE_INFO.token,
            videoid: params.videoid,
            episode: params.episode
        }
        this.ajax(url, params, function (result) {
            if (typeof callback == "function") {
                callback(result)
            }
        })
    }

    return util
})()

export{Util};
