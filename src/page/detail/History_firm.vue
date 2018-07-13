<template>
  <div class="yy-confirm" v-show="visible">
    <div class="bg"></div>
    <div class="yy-container" :style="{width: width}">
      <div class="header">
        <i class="iconfont" style="font-size: 24px;line-height: 50px">&#xe6a3</i>
        {{title.value}}
      </div>
      <slot name="footer">
        <div class="yy-footer" slot="footer">
          <a href="javscript:void(0)" class="yy-btn make-sure select-on">播放详情
            <i class="iconfont" style="font-size: 22px;line-height: 50px">&#xe98c</i>
          </a>
          <a href="javscript:void(0)" class="yy-btn cancel">删除视频
            <i class="iconfont" style="font-size: 22px;line-height: 50px">&#xe600</i>
          </a>
        </div>
      </slot>
    </div>
    <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
  </div>
</template>
<script type="text/javascript">
  import '../../../lib/icon/css/font-awesome.css'
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../../fetch/api.js'
  import {client as yh} from '../../js/client.js'
  export default {
    data :function() {
      return {
        width: {
          type: String,
          default: '360px'
        },
        title: {
          type: String,
          default: '三角警告标',
          value:'视频管理'
        },
        isShow:false,
        catCode:"",
        num:0,
        name:"HistoryFirm",
        jsonUrl:'',
        asID:'',
        usename:'',
        zt:true,
        visible: false,
        closeVisible: {
          type: Boolean,
          default: true
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:visible', false)
      },
      showBox (){
        this.visible = true
      },keyCode(kc) {
        // console.log("父组件接收子组件触发事件传上来的值");
        if (kc == "down") {
          this.down();
        } else if (kc == "up") {
          this.up();
        } else if (kc == "left") {
          this.left();
        } else if (kc == "right") {
          this.right();
        }else if(kc == "KeyEnter"){
          this.KeyEnter();
        } else if (kc == "KeyBack") {
          this.KeyBack();
        }
      },
      KeyBack(){
        this.visible = false;
        this.isShow = false;
        this.$emit("listernpopup",false,this.usename,'back');
      }
      ,
      findindex() {
        let storage = JSON.parse(localStorage.getItem('PersonMovies'));
        for (let i = 0; i < storage.length; i++) {
          if (storage[i].assetId == this.asID) {
            return i;
          }
        }
      },KeyEnter(){
        this.visible = false;
        this.isShow = false;
        if (this.num==0){
          if(!this.zt){
            this.$router.push({name:"detail",params:{jsonUrl:this.jsonUrl,catCode:this.catCode,catId:0}});
          }else {
            this.$router.push({name:"hotTopics",params:{jsonUrl:this.jsonUrl,catCode:this.catCode,catId:0}});
          }
          this.$emit("listernpopup",true,this.usename,'over');
        }else {
          if (this.usename =="Hright"){
            let storage = JSON.parse(localStorage.getItem('PersonMovies'));
            let json = [];
            for (let i = 0; i < storage.length; i++) {
              if (i != this.findindex()) {
                json.push(storage[i]);
              }
            };
            console.log(json);
            localStorage.setItem('PersonMovies', JSON.stringify(json));
          }else{
              yh.removeHistorys(this.asID);
          }
        this.$emit("listernpopup",false,this.usename,'keyEnter');
        }
      },right(){
        this.num++;
        if (this.num>1){
          this.num=1
        }
        $('.make-sure').removeClass('select-on');
        $('.cancel').addClass('select-on');
      },left(){
        this.num--;
        if (this.num<0){
          this.num=0
        }
        $('.cancel').removeClass('select-on');
        $('.make-sure').addClass('select-on');
      },
      updateStast(bl,url,Id,lx,name,type){
        this.num=0;
        $('.cancel').removeClass('select-on');
        $('.make-sure').addClass('select-on');
        this.isShow = bl;
        this.visible = bl;
        this.jsonUrl =url;
        this.asID = Id;
        this.catCode = type;
        this.usename = name;
        if (lx=="专题"){
          this.zt = true;
        }else {
          this.zt = false;
        }
      }
    },
    components: {
    }
  }
</script>
<style type="text/css" scoped="firm">
  @font-face {
    font-family: 'iconfont';  /* project id 518615 */
    src: url('//at.alicdn.com/t/font_518615_lbwdhfavufyzm2t9.eot');
    src: url('//at.alicdn.com/t/font_518615_lbwdhfavufyzm2t9.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_518615_lbwdhfavufyzm2t9.woff') format('woff'),
    url('//at.alicdn.com/t/font_518615_lbwdhfavufyzm2t9.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_518615_lbwdhfavufyzm2t9.svg#iconfont') format('svg');
  }
  .iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;}
  .bounce-enter-active {
    -webkit-transform: scale(2);
    -moz-transform: scale(2);
    -ms-transform: scale(2);
    transform: scale(2);
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }
  .bounce-leave-active {
    -webkit-transform: scale(2);
    -moz-transform: scale(2);
    -ms-transform: scale(2);
    transform: scale(2);
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }
  /*@keyframes bounce-in {*/
  /*-webkit-transform: scale(2);*/
  /*-moz-transform: scale(2);*/
  /*-ms-transform: scale(2);*/
  /*transform: scale(2);*/
  /*opacity: 0;*/
  /*-webkit-transition: all 0.3s;*/
  /*-moz-transition: all 0.3s;*/
  /*transition: all 0.3s;*/
  /*}*/
  .yy-confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 1280px;
    height: 720px;
    z-index: 9999999;
  }
  .yy-confirm .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.3;
    z-index: 99999;
  }
  .yy-confirm .yy-container {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 1280px;
    z-index: 9999999999999;
    width: 600px;
    border: 1px solid white;
  }
  .yy-confirm .yy-container .header {
    height: 50px;
    padding-left: 30px;
    line-height: 50px;
    background-color:rgba(0,128,128,0.95);
    border-bottom: 1px rgba(0,128,128,0.95) solid;
    color: #fff;
    text-align: left;
    box-sizing: border-box;

  }
  .yy-confirm .yy-container .yy-footer {
    background: rgba(0,139,139,0.9);
    height: 300px;
    box-sizing: border-box;
  }
  .yy-btn {
    text-decoration: none !important;
    border-radius: 14px;
    text-align: center;
    width: 30%;
    float: left;
    margin-top: 120px;
    margin-left: 80px;
    height: 50px;
    line-height: 50px;
    border: 2px white solid;
  }
  .yy-btn.select-on {
    background-color: #4575A6;
    color: #fff;
  }
  .yy-btn{
    background-color: #BBB5B5;
    color: #fff;
  }
  .yy-close-btn {
    cursor: pointer;
    float: right;
  }
</style>
