<template>
  <div id="app" >
    <!-- 这里是需要keepalive的 -->
    <div v-if="!apptcc">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <!-- 这里不会被keepalive -->
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <div class="appTc" v-show="apptcc">
      <div class="appDtc">

      </div>
    </div>
  </div>
</template>
<style scoped="app">
  .appTc{
    width: 1280px;
    height: 720px;
    position: relative;
    background: rgba(0,0,0,0.2);
    color: white;
  }
  .appDtc{
    width: 700px;
    height: 400px;
    background: rgba(0,0,0,0.7);
    border-radius: 15px;
    color: #FFFFFF;
    text-align: center;
    line-height: 400px;
    position: absolute;
    left: 300px;
    top: 180px;
  }
</style>
<script>
import CryptoJS from 'crypto-js'
import {HTTPUtil as api} from './fetch/api.js'
import c from './js/common.js'
import {authFunction as auth} from './js/auth.js'
  export default {
   name: 'app',
    data() {
      return {
        apptcc: false,
      }
    },
   beforeCreate(){
     let ittNum = localStorage.getItem("ittNum");
     if(!ittNum){
       console.log('加载第一次');
       document.getElementsByClassName('openImage')[0].style.display='block';
       document.getElementsByClassName('openImage')[1].style.display='none';
       setTimeout(() => {
         document.getElementsByClassName('openImage')[0].style.display='none';
       }, 3000);
     }else {
       console.log('加载第二次');
       document.getElementsByClassName('openImage')[0].style.display='none';
       document.getElementsByClassName('openImage')[1].style.display='none';
     }
     localStorage.setItem("ittNum", "已经加载过一次了");
   },
    mounted(){

      this.getAAA();

   },
    methods: {
      getAAA(){
        setTimeout(()=> {
          let tem = localStorage.getItem('temptoken');
          console.log(tem+'缓存');
          if (!tem) {
            console.log('没有缓存');
            const pageUrl = window.location.href;
            console.log(pageUrl + '获取本页面url');
            localStorage.setItem('indexUrl', pageUrl);
            let useId = this.$route.query.iaspuserid;
            localStorage.setItem('iaspuserid',useId);
            console.log(useId + '用户ID');
            auth.aaa(useId).then((jsonData) => {
              console.log("AAA鉴权返回结果:", jsonData);
              console.log(typeof jsonData);
              const jsonTempor = JSON.parse(jsonData);
              console.log(jsonTempor.temptoken);
              if (jsonTempor.temptoken) {
                console.log("鉴权通过保存temptoken的值");
                localStorage.setItem("temptoken", jsonTempor.temptoken);
              } else {
                console.log("鉴权不通过，提示用户");
                this.apptcc = true;
                $('.appDtc').text('该用户不存在或封停进入黑名单');
              }
              auth.userCheck(useId).then((jsonData) => {
                console.log("用户鉴权合法性:", jsonData);
                let jsondata = jsonData;
                localStorage.setItem('usehf', jsondata);
              }).catch(() => {
                console.log('用户非法');
                this.apptcc = true;
                $('.appDtc').text('用户非法登入');
              }); // IPTV用户合法性鉴权
              auth.productAuth(jsonTempor.temptoken, "21100001000000021522201686137001").then((jsonData) => {
                console.log('产品包鉴权：', jsonData);
                localStorage.setItem('usejq', jsonData);
              }).catch(() => {
                console.log('产品包鉴权失败');
              });
//        产品包鉴权
            }).catch(() => {
              console.log("服务不可用、超时，再次鉴权，请求失败3次以后不再鉴权提醒用户");
              this.apptcc = true;
              $('.appDtc').text('服务请求超时~请重启或稍后刷新');
            });
          }else {
            let tem = localStorage.getItem('temptoken');
            console.log(tem+'缓存');
            auth.productAuth(tem, "21100001000000021522201686137001").then((jsonData) => {
              console.log('产品包鉴权：', jsonData);
              localStorage.removeItem('usejq');
              localStorage.setItem('usejq', jsonData);
            }).catch(() => {
              console.log('产品包鉴权失败');
            });
          }
        },1000);
      },
      GD(){
        setTimeout(()=>{
          let uuu = this.$route.query.xwh;
          console.log(uuu);
          if (uuu != "gdxz"){
            this.getAAA();
          }
        },1000)

      }
    }
  }
</script>
<style>
  @import url(./font/iconfont.css);
</style>
