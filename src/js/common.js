//  JavaScript常用方法

// localStorage sessionStorage

export default {

  clearLocal(localName) {
      localStorage.removeItem(localName);
  },
  setLocal(localName, localStr){
      localStorage.setItem(localName, localStr);
  },
  getLocal(localName){
    var localName = localStorage.getItem(localName);
    if(this.isAllNull(localName)) {
      return "";
    } else {
      return localName;
    }
  },
   errorPic(img) {//图像加载出错时的处理
    img.src = "/business/common/images/business/errorPic.png";
    img.onerror = null;
  },
  isAllNull(str) { // 验证参数合法性
    if (null == str || "null" == str || "" === str || "undefined" == str || undefined == str){
      return true;
    }
    return false;
  },strAllNull(str) {// 是否是字符串
    if(this.isAllNull(str)) {
      return "";
    }
    return str;
  },startTime(){
     let current = new Date().getTime();
     let app = { name: 'app', startTime:current};
     localStorage.setItem('app',JSON.stringify(app));
  },settingPath(pathName,id){ // 设置埋点路径
     let trace_type =  localStorage.getItem('trace_type');
     let trace_id = localStorage.getItem('trace_id');
     if (trace_type){
       let ppvPath = trace_type.split(',');
       let ppvId = trace_id.split(',');
       ppvId.push(id);
       ppvPath.push(pathName);
     }else{
        localStorage.setItem('trace_type','');
        localStorage.setItem('trace_id','');
     }

  },getTraceType(){
     return localStorage.getItem('trace_type');
  },getTraceId(){
     return localStorage.getItem('trace_id');
  },getAppStartTime(){
     let app = localStorage.getItem('app');
     return JSON.parse(app).startTime;
  },getNow(){
    return new Date().getTime();
  }
  
}
