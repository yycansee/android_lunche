import CryptoJS from 'crypto-js'
import { HTTPUtil as api } from '../fetch/api.js'
/**
 *  用户认证鉴权及产品认证鉴权
 *
 */

 function auth(){

 }

/**
 * js md5 加密
 */
auth.prototype.md5 = function (md5String){
     return CryptoJS.MD5(md5String).toString().toLowerCase();
 }

 /**
  * js AES CBC 加密
  */

auth.prototype.aesToCbc = function (plaintText){
    const key = CryptoJS.enc.Utf8.parse("rockrollformusic"); //16位
    const options = {
        iv: CryptoJS.enc.Utf8.parse("rockrollformusic"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }
    // 加密
    const encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
    const encryptedBase64Str = encryptedData.toString(); // 将byte转成字符串
    // console.log('encryptedBase64Str', encodeURIComponent(encryptedBase64Str));
    return encryptedBase64Str;
    // 需要读取encryptedData上的ciphertext.toString()才能拿到跟Java一样的密文
    // let encryptedStr = encryptedData.ciphertext.toString();
    // console.log('encryptedStr', encryptedStr);

    // 拿到字符串类型的密文需要先将其用Hex方法parse一下
    //  let encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);
    //  console.log('encryptedHexStr', encryptedHexStr);

    // 将密文转为Base64的字符串
    // 只有Base64类型的字符串密文才能对其进行解密
    //  let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    //  console.log('encryptedBase64Str', encryptedBase64Str);
}

/**
  * js DES EDE 加密
  */
auth.prototype.desEde = function (plaintText) {
    const keyHex = auth.prototype.utf8("kzrDfRQbKFkCRzAJiwhfJMKY");  // 把私钥转换成16进制的字符串
    //模式为ECB padding为Pkcs7
    const encrypted = CryptoJS.DES.encrypt(plaintText, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var encryptedStr = encrypted.ciphertext.toString();
    console.log('encryptedStr', encryptedStr);
    // 拿到字符串类型的密文需要先将其用Hex方法parse一下
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);
    console.log('encryptedHexStr', encryptedHexStr);

    // 将密文转为Base64的字符串
    // 只有Base64类型的字符串密文才能对其进行解密
    var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    console.log('encryptedBase64Str', encryptedBase64Str);


    // const encryptedBase64Str = encrypted.toString(); // 将byte转成字符串
     return encryptedBase64Str;
}

/****
 *
 * js Base64 加密
 */
auth.prototype.Base64encode = function(text){
    return CryptoJS.enc.Base64.stringify(text);
}

/***
 * js utf-8 编码
 */

 auth.prototype.utf8 = function (params) {
     return CryptoJS.enc.Utf8.parse(params);
 }

/***
* js GBK 编码
*/

auth.prototype.gbk = function (params) {
    let bytes = [];
    for (let i = 0; i < params.length; i++) {
        const c = "";
        const ch = params.charAt(i);
        bytes.push(c);
    }
    return bytes;
}
/**
 *
 * js  UUID
 */
auth.prototype.uuid = function (len,radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        };
    } else {
        // rfc4122, version 4 form
        let r;
        // rfc4122 requires these characters
        // uuid[8] = uuid[16] = uuid[24] = '-';
        // uuid[12] = '6';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 *
 * 时间格式化 :YYYYMMDDhhmmssmsms
 *
 */
auth.prototype.formatDate = function(times){
    const oDate = new Date(times);
    const oYear = oDate.getFullYear();
    const oMonth = oDate.getMonth() + 1;
    const oDay = oDate.getDate();
    const oHour = oDate.getHours();
    const oMin = oDate.getMinutes();
    const oSen = oDate.getSeconds();
    const oTime = oYear + getzf(oMonth) + getzf(oDay) + getzf(oHour) + getzf(oMin) + getzf(oSen) + oDate.getMilliseconds();
    return oTime;
}
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}

/**
 * AAA 鉴权地址
 *
 */
auth.prototype.aaaRequestUrl = function(useId, timestamp, md5Value){
   return 'http://winnow-bds.yanhuamedia.tv/AAA?userid=' + useId + '&time=' + timestamp + '&riddle=' + md5Value;

}

/***
 * IPTV 用户属性鉴权地址(黑白名单)
 *
 */
auth.prototype.userAuthUrl = function (timev, md5Value, aesparams) {
   // return "http://218.24.37.24:9090/spauthbilling/authbilling?time=" + timev + "&riddle=" + md5Value + "&fromproject=yypl4k&toproject=ums&interfacename=user_searchlockorder.do&params=" + aesparams;
    return "http://winnow-bds.yanhuamedia.tv/userAuth?time=" + timev + "&riddle=" + md5Value + "&fromproject=yypl4k&toproject=ums&interfacename=user_searchlockorder.do&params=" + aesparams;
}

/***
 * 根据产品包ID鉴权（可以多个产品包以逗号分隔）
 *
 */
auth.prototype.productAuthUrl = function (timev, md5riddle, tmpkey, productid){
  // return "http://218.24.37.2:89/authbilling/authenticationIptv_authorityProduct.do?time=" + timev + "&riddle=" + md5riddle + "&temptoken=" + tmpkey + "&productid=" + productid;
    return "http://winnow-bds.yanhuamedia.tv/productAuth?time=" + timev + "&riddle=" + md5riddle + "&temptoken=" + tmpkey + "&productid=" + productid;
}
/**
 *
 */
/**
 * AAA鉴权
 *
 */
auth.prototype.aaa = function(userId){
    const timestamp = new Date().getTime(); // 当前时间毫秒数
    const ciphertext = auth.prototype.md5('besto' + timestamp);
    const url = auth.prototype.aaaRequestUrl(userId, timestamp, ciphertext);
    console.log("AAA鉴权地址：" + url);
    return new Promise(function (resolve, reject) {
        api.ajax({ "url": url,}).then((json) => {
            resolve(json);
        }).catch((error)=>{
            console.log(error);
            reject(error)
        });
    })
}

/**
 *  IPTV 用户合法性鉴权
 *
 */

auth.prototype.userCheck = function(userId){
    const timev = new Date().getTime(); // 当前时间毫秒数
    const riddlev = 'besto' + timev
    const md5riddle = auth.prototype.md5(riddlev);
    const useridv = auth.prototype.utf8(userId);
    const aesString = "user_id=" + auth.prototype.Base64encode(useridv) + "&time=" + timev + "&riddle=" + md5riddle;
    const aesparams = encodeURIComponent(auth.prototype.aesToCbc(aesString));
    const userCheckUrl = auth.prototype.userAuthUrl(timev, md5riddle, aesparams);
    console.log("用户鉴权接口:" + userCheckUrl);
    return new Promise(function (resolve, reject) {
        api.ajax({ "url": userCheckUrl}).then((json) => {
            resolve(json);
        }).catch((error) => {
            console.log(error);
            reject(error)
        });
    })
}

/**
 *  产品包鉴权
 */
auth.prototype.productAuth = function (token, productid){
    const timev = new Date().getTime(); // 当前时间毫秒数
    const riddlev = 'besto' + timev
    const md5riddle = auth.prototype.md5(riddlev);
    const url= auth.prototype.productAuthUrl(timev, md5riddle, token, productid);
    console.log("产品包鉴权Url:" + url);
    return new Promise(function (resolve, reject) {
        api.ajax({ "url": url }).then((json) => {
            resolve(json);
        }).catch((error) => {
            console.log(error);
            reject(error)
        });
    })
}


/**
 *  统一支付地址
 */
auth.prototype.payUrl = function (code,token,type,mac,ipUrl,useId) {
  // 广联产品名称,用户token,播放类型 ,机顶盒mac地址,设备IP地址
    console.log(CryptoJS);
    const timestamp = new Date().getTime(); // 当前时间毫秒数
    let payObject = {};
    payObject.mode = "1";                   // 0:按次；1：按月
    payObject.isgoon = "0";                 // 是否自动续订（当mode是按月时启用）0：自动续订，1：非自动续订
    payObject.productid = "240001665";      // IPTV 产品 ID
    payObject.product_name =encodeURIComponent('测试');      // productname  产品名称+（订购内容）备注：【其中订购内容如果是按次计费则需要提供具体节目名称；如果是包月则可为空，即丌拼写】
    payObject.product_desc = encodeURIComponent('广联产品名称：'+code+'  1元包月资费码1.0');
    // ();  // description 产品描述
    payObject.product_price = "15";       // 产品包价格
    payObject.tariffid ="088000000001042000001";  // 资费ID            // 订单号
    payObject.userToken = token; // 用户token
    payObject.providerid = type;            // 供应商ID
    payObject.spId = "bstzq";               // SP代码
    payObject.order_back_url = "http://winnow-bds.yanhuamedia.tv/category/detail";          // 订购结束返回地址
    payObject.oppoeAccount = "sys_08657061@tv";  // 未定义
    payObject.mac = mac;                     // 机顶盒mac地址
    payObject.ip =  ipUrl;                     // 设备IP地址
    payObject.userId = useId;       // 用户ID
    const standby1 = "";                // 备用字段1
    const standby2 = "";                // 备用字段2
    const standby3 = "";                // 备用字段3
    const standby4 = "";                // 备用字段4
    const standby5 = "";                // 备用字段5

    const original = 'mode='+payObject.mode + "&" + 'isgoon='+payObject.isgoon + "&" + 'productid='+payObject.productid + "&" + 'product_name='+payObject.product_name + "&" + 'product_desc='+payObject.product_desc + "&" + 'product_price='+payObject.product_price + "&" + 'tariffid='+payObject.tariffid + "&" + 'userToken='+payObject.userToken + "&" + 'providerid='+payObject.providerid + "&" +'sp_id='+ payObject.spId + "&"+'back_url='+ payObject.order_back_url + "&"+ 'oppoeAccount='+ payObject.oppoeAccount + "&" +'mac='+ payObject.mac + "&" + payObject.ip + "&" + 'userId='+payObject.userId + "&standby1=" + standby1 + "&standby2=" + standby2 + "&standby3=" + standby3 + "&standby4=" + standby4 + "&standby5" + standby5;

    const payUrl= "http://winnow-bds.yanhuamedia.tv/web_proxy_service//auth/payment.do?" + original;

    console.log("支付地址:" + payUrl);

    return new Promise(function (resolve, reject) {
      api.ajax({ "url": payUrl }).then((json) => {
        resolve(json);
      }).catch((error) => {
        console.log(error);
        reject(error)
      });
    })
}

const authFunction = new auth();

export {authFunction};
