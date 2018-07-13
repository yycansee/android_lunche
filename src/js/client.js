/**
 * create:2017-11-25
 *
 * update:jiangjie
 *
 */


function yh() {

}
/**
 *  打开视频播放器
 * params:{int index,;long startTimeMills,String jsonUrl}
 *
 *    index当前集数：电影、非影视剧为0，电视剧从0开始
 *    startTimeMills：播放器开始播放的毫秒秒数
 *    jsonUrl:详情页数据接口
 */

yh.prototype.play = function (params) {
  params.router.push({path: '/play?code='+params.code+'&videotype='+params.videotype+'&backurl='+params.backurl});
  localStorage.setItem('backPT','进入播放器');
  // try {
    //
    //     let obj = JSON.parse(params);
    //     console.log(params);
    //     ERT.play(obj.index, parseInt(obj.startTime), obj.jsonUrl);
    // } catch (error) {
    //     console.log("调用ERT.play()异常", error);
    // }
}
/**
 * 退出当前webview标签
 *
 */
yh.prototype.back = function () {
    try {
        ERT.exit();
    } catch (error) {
        console.log("调用ERT.exit()方法异常：" + error);
    }
}

/**
 * 打开影片历史
 */
yh.prototype.history = function () {
    try {
        ERT.openHistory();
    } catch (error) {
        console.log("调用ERT.openHistory()方法异常：" + error);
    }
}


/**
 * 查看收藏
 *
 */
yh.prototype.favorite = function () {
    try {
        return ERT.openFavorite();
    } catch (error) {
        console.log("调用ERT.openFavorite()方法异常：" + error);
    }
}
/**
 * 打开搜索
 */
yh.prototype.search = function () {
    let recommend = encodeURIComponent("http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhSearchRecommend&k=1&v=1");
    let searchUrl = encodeURIComponent("http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhSearch&k=1&v=1");
    try {
        ERT.openSearch(recommend, searchUrl);
    } catch (error) {
        console.log("调用ERT.openSearch()方法异常：" + error);
    }
}

// 查询所有收藏的条目
// 返回:
//   收藏的条目json
yh.prototype.queryFavorites = function () {
  // alert(2)
  try {
      return ERT.queryFavorite();
  }catch (error) {
    console.log("调用ERT.openFavorite()方法异常：" + error);
  }

}
/**
 * 添加收藏
 * @param {obj} params
 * 包含：String catId,String specialId,String assetId,String assetName,String assetType,String assetImg,String episodes,String broadcast,String score,String coverImg,String specialName,String layout,String layoutUrl
 *
 */
yh.prototype.collection = function (params) {
    // console.log('add collect' + params);
    try {
        ERT.favorite(params);
    } catch (error) {
        console.log("调用ERT.favorite()方法异常：", params, error);
    }
}

/**
 * 查看收藏
 * @param {assetId,specialId} params
 * assetId:资产id
 * specialId:专题id
 *`
 */
yh.prototype.queryFavorite = function (assetId, specialId) {
    // console.log('查看是否纯在' + assetId+'存在specialId'+specialId);
  try {
        return ERT.queryFavorite(assetId, specialId);
    } catch (error) {
        return "";
        console.log("调用ERT.queryFavorite()方法异常：", assetId, specialId, error);
    }

}

/**
 * 删除收藏
 * @param {*} assetId
 * @param {*} specialId
 */
yh.prototype.removeFavorite = function (assetId, specialId) {
  // console.log('删除' + assetId+'删除specialId'+specialId);
  try {
        ERT.removeFavorite(assetId, specialId);
    } catch (error) {
        console.log("调用ERT.removeFavorite()方法异常：", assetId, specialId, error);
    }
}
/**
 * 删除所有收藏
 */
yh.prototype.removeFavorites = function () {
  try {
    ERT.removeFavorite();
  } catch (error) {
    console.log("调用ERT.removeFavorite()方法异常：", error);
  }
}





// 查询所有历史记录
// 返回:
//   收藏的条目json
yh.prototype.queryHistory = function () {
  // alert(2)
  try {
    return ERT.queryHistory();
  }catch (error) {
    console.log("调用ERT.openqueryHistory()方法异常：" + error);
  }

}

/**
 * 删除所有历史记录
 */
yh.prototype.removeHistory = function () {
  try {
     ERT.removeHistory();
  } catch (error) {
    console.log("调用ERT.removeHistory()方法异常：", error);
  }
}
/**
 * 删除历史记录
 * @param {*} assetId
 * @param {*} specialId
 */
yh.prototype.removeHistorys = function (assetId) {
  // console.log('删除' + assetId);
  try {
    ERT.removeHistory(assetId);
  } catch (error) {
    console.log("调用ERT.removeFavorites()方法异常：", assetId, error);
  }
}
/**
 * 根据资产ID查询播放历史
 * @param {*} assetId
 */
yh.prototype.playHistory = function (assetId) {
    try {
        return ERT.queryHistory(assetId);
    } catch (error) {
        console.log("调用ERT.queryHistory()方法异常：", assetId, error);
    }
}

/****
 * 栏目筛选
 *
 *  @param {*} catCode  栏目id
 */
yh.prototype.openFilter = function (catCode) {
    // console.log("catCode:" + catCode);
    try {
        ERT.openFilter(catCode);
    } catch (error) {
        console.log("调用ERT.openFilter()方法异常：", catCode, error);
    }
}

yh.prototype.httpClient = function (url) {
    try {
        //responseCallback('ok');
        ERT.convertStringHttpJSONGet(url, "responseCallback")
    } catch (error) {
        console.log("调用ERT.convertStringHttpJSONGet方法异常：",error);

    }
}
// http代理请求
yh.prototype.proxyHttpRequest = function (url,callback){
    try {
        ERT.proxyHttpRequest(url,callback);
    } catch (error) {
        console.log("调用ERT.proxyHttpRequest方法异常：", error);
    }
}

// function responseCallback(params) {
//     console.log('client:' + params);
// }



let client = new yh();
export { client }
