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
            <a href="javscript:void(0)" class="yy-btn make-sure select-on">退出应用
              <i class="iconfont" style="font-size: 22px;line-height: 50px">&#xe98c</i>
            </a>
            <a href="javscript:void(0)" class="yy-btn cancel">返回观看
              <i class="iconfont" style="font-size: 22px;line-height: 50px">&#xe609</i>
            </a>
          </div>
        </slot>
      </div>
      <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
    </div>
</template>
<script type="text/javascript">
  import '../../lib/icon/css/font-awesome.css'
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
          value:'退出应用'
        },
        content:{
          value:'选择“确定”注销账号，选择“返回”退出此页面'
        },
        isShow:false,
        num:0,
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
          this.$emit("listernpopup",false);
        }
      ,KeyEnter(){
          this.visible = false;
          this.isShow = false;
          if (this.num==0){
            this.$emit("listernpopup",true);
            localStorage.clear();
          }else {
            this.$emit("listernpopup",false);
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
      updateStast(bl){
//        this.json = jsonquery
        this.isShow = true;
        this.visible = true;
      }
    },
    components: {
    }
  }
</script>
<style type="text/css" scoped="firm">
  .yy-content{
    color: darkgray;
    height: 200px;
    min-height: 90px;
    text-align: center;
    line-height: 90px;
    font-size: 16px;
    font-family: "proxima nova", "Roboto", "helvetica", Arial, sans-serif;
    background: #ffffff;
  }
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
    /*background-color: #FFFFFF;*/
    background-color: #000;
    opacity: 0.3;
    z-index: 99999;
  }
  .yy-confirm .yy-container {
    position: absolute;
    display: inline-block;
    top: 160px;
    left: 360px;
    /*transform: translate(-50%, -50%);*/
    max-width: 1280px;
    z-index: 9999999999999;
    width: 600px;
    border: 1px solid white;
  }
  .yy-confirm .yy-container .header {
    height: 50px;
    padding-left: 30px;
    line-height: 50px;
    background-color: rgba(21,48,57,0.9);
    border-bottom: 1px rgba(0,128,128,0.95) solid;
    color: #fff;
    text-align: left;
    box-sizing: border-box;
  }
  .yy-confirm .yy-container .yy-footer {
    background: rgba(34,78,96,0.9);
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
    background: #152F3A;
    color: #ffffff;
  }
  .yy-btn.select-on {
    background-color: #992121;
    color: #fff;
  }
  .yy-close-btn {
    cursor: pointer;
    float: right;
  }
</style>
