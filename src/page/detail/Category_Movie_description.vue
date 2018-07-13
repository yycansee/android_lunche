<!--详情页——弹出层-->
<template>
    <div class="yy-confirm" v-show="visible">
      <div class="bg"></div>
      <div class="yy-container" :style="{width: width}">
        <div class="header">
          {{isAlert.title}}
        </div>
        <div class="yy-content">
          <div class="yy-content-scroll">
            {{isAlert.msg}}
          </div>
        </div>
      </div>
      <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
    </div>
</template>
<script type="text/javascript">
  export default {
    props:['isAlert'],
    data(){
      return {
        name: 'description',
        isShow:false,
        num:0,
        width: {
          type: String,
          default: '360px'
        },
        visible: false,
      }
    },
    methods: {
      showBox (){
        this.visible = true
      },keyCode(kc) {
        if (kc == "KeyBack") {
          this.KeyBack();
        }else if(kc == "down"){
          this.down();
        }else if(kc == "up"){
          this.up();
        }
      },KeyBack(){
        this.visible = false;
        this.isShow = false;
        this.$emit('press', this.isShow,"description","KeyBack");
        this.num =0;
        $('.yy-content-scroll').stop(false,true).animate({'top': '-'+this.num*200+'px'},10);
      },down(){
        let fEleDistance = $('.yy-content-scroll')[0].scrollHeight;
        let item = Math.ceil(fEleDistance/250);
//        console.log(item);
        if(this.num<item-1){
          this.num++;
          $('.yy-content-scroll').stop(false,true).animate({'top': '-'+this.num*200+'px'},10);
        }else {
          this.num = item-1;
        }
      },
      up(){
        this.num--;
        if(this.num>=0){
          $('.yy-content-scroll').stop(false,true).animate({'top': '-'+this.num*200+'px'},10);
        }else {
          this.num=0;
        }
      },

    },
    mounted(){
    },
    components: {
    },watch:{
      isAlert(){
        if(this.isAlert.alert){
          this.visible = true;
          this.isShow = true;
        }else{
          this.visible = false;
        }
      }
    }
  }
</script>

<style type="text/css" scoped="confirm">
  .yy-content-scroll{
    width: 92%;
    position: absolute;
    left: 0;
    top:0;
    padding: 20px;
  }
  /*.yy-content::-webkit-scrollbar{width:3px;}*/
  /*.yy-content::-webkit-scrollbar-track{display: none}*/
  /*.yy-content::-webkit-scrollbar-thumb{background-color:#eaeaef;border-radius: 40%;}*/
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
    background:rgba(255,255,255,0.50);
    border-radius: 14px;
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
  }
  .yy-confirm .yy-container .header {
    width: 600px;
    font-size: 30px;
    text-align: center;
    background: #000000;
    font-family:PingFangSC-Semibold;
    border-radius: 14px 14px 0px 0px;
    border: 2px solid white;
    border-bottom: none;
  }
  .yy-confirm .yy-container .yy-content {
    border-radius: 0px 0px 14px 14px;
    border: 2px solid white;
    border-top: none;
    color: white;
    height: 230px;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    font-family: "proxima nova", "Roboto", "helvetica", Arial, sans-serif;
    background: #000000;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }
</style>
