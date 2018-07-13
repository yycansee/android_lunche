import fetchJsonp from 'fetch-jsonp';

/**
 * 2017-11-30
 * 基于fetch封装get jsonp请求请求
 *
 */

var HTTPUtil = {};
HTTPUtil.get =  function (url) {
  if(url.indexOf('winnow-ds.yanhuamedia.tv')>=0){
   url = url.replace('winnow-ds.yanhuamedia.tv', 'winnow-bds.yanhuamedia.tv');
  }
  console.log("url:" + url);
  return new Promise(function (resolve, reject) {
    fetchJsonp(url, {
      jsonpCallback: 'jsonpCallback',
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          reject({status:response.status });
        }
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (ex) {
        console.log(ex);
        reject({ status: -1 });
      })
  })
};

HTTPUtil.ajax = function(params){
  return new Promise((resovle, reject) => {
    $.ajax({
      "type": params.type || "get",
      "async": params.async || true,
      "url": params.url,
      "data": params.data || "",
      "success": res => {
        resovle(res);
      },
      "error": err => {
        reject(err);
      }
    })
  })
};

HTTPUtil.xhr = function (params) {



};
// 获取主题接口
HTTPUtil.getTheme = function(url) {
  return  HTTPUtil.get(url);
};

// 获取栏目筛选条件
HTTPUtil.getFilter = function(catCode){
  let url = "http://183.131.15.28/?s=19|7&p=yhCategoryList&k=1&v=1&returnType=jsonp&catCode="+catCode;
  return url;
};



// 获取栏目筛选结果
HTTPUtil.getFilterResult = function (condition, index, pageSize,catCode) {
  let url = "https://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhScreenResult&k=1&v=1&returnType=jsonp" + condition + "&pindex=" + index + "&psize=" + pageSize + "&catCode=" + catCode;
  return HTTPUtil.get(url);
};



// 筛选页面获取筛选条件信息
HTTPUtil.getFilterCategory = function(catCode){
  let url = "http://zero-ds.yanhuamedia.tv/?s=19|7&p=yhCategoryList&k=1&v=1&returnType=jsonp&catCode="+catCode;
          // http://183.131.15.28/?s=19|7&p=yhCategoryList&k=1&v=1&returnType=jsonp
  return HTTPUtil.get(url);
};

// bi数据埋点请求发送
HTTPUtil.biHttp = function(url){
    console.log("bi数据埋点请求:" + url);
    fetchJsonp(url, {
        jsonpCallback: 'jsonpCallback',
    }).catch(function(){
      console.log("Bi success");
    })
};

export  {HTTPUtil};
