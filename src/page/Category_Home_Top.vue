<template>
    <div class="h_top">
      <div class="top_r_img" >
          <img :src="(top[0].elementImg)" style="border-radius: 14px"/>
      </div>
      <div class="top_r_news">
        <ul>
          <li v-for="(item,index) in top" v-if="index>0 && index<5" :key="item.id"  :id="('t'+index)" >
            <!-- <img :src="top[index].elementImg"/> -->
            <lazy-image
                :src='top[index].elementImg'
                :placeholder='placeholder'
                  />
          </li>
        </ul>
      </div>
      <keyDo v-on:listenKeyCode="keyCode" v-if="isShow"></keyDo>
    </div>
</template>
<style>
  .h_top{
    position: relative;
    width: 1227px;
    margin-top: 10px;
  }
  .h_top:after{
    clear: both;
    content: "";
    display: block;
  }
  .h_top img{
    cursor: pointer;
  }
  .top_r_img{
    display: inline-block;
    width: 544px;
    height: 310px;
    float: left;
    box-sizing: border-box;

  }
  .top_r_img img{
    width: 100%;
    height: 100%;
    border-radius: 5px;
    border: 1px rgba(255, 255, 255, 0.5) solid;
    margin: -1px;
  }
  .top_r_news{
    /*display: inline-block;*/
    margin-left: 32px;
    width: 624px;
    float: left;
    box-sizing: border-box;

  }
  .top_r_news ul{
    width: 100%;
    height:100%;

    box-sizing: border-box;
  }
  .top_r_news ul:after{
    clear: both;
    content: "";
    display: block;
  }
  .top_r_news li{
    float: left;
    width: 255px;
    height: 140px;
    box-sizing: border-box;
    margin-right: 33px;
    margin-top: 27px;
    box-sizing: border-box;
  }
  .top_r_news li .imglazy{
    border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 7px;
  }
  .top_r_news li:nth-child(2){
    margin-top: 3px;
  }
  .top_r_news li:nth-child(1){
    margin-top: 3px;
  }
  .top_r_news li img{
    width: 100%;
    height: 100%;
    border-radius:5px;
  }
  .top_r_img img.item_hover{
    margin-top: -4px; ;
    border: 4px solid #FFFFFF;
    border-radius: 10px;
    box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
    transform: scale(1.05);
    z-index: 999;
  }
  .top_r_news li.item_hover:nth-child(3),.top_r_news li.item_hover:nth-child(4){

    border: 4px solid #FFFFFF;
    border-radius: 10px;
    box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
    transform: scale(1.15);
    z-index: 999;
  }
    .top_r_news li.item_hover:nth-child(1),.top_r_news li.item_hover:nth-child(2){

    border: 4px solid #FFFFFF;
    border-radius: 10px;
    box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
    transform: scale(1.15);
    z-index: 999;
  }
</style>
<script>
    import { mapGetters } from 'vuex'
    import {bp as bi} from '../js/ga.js'

    export default {
      props:['initData','catCode','catId'],
      name:"IndexTopRecommend",
      data:function () {
        return{
          name:"IndexTopRecommend",
          placeholder:require('../assets/img_loading_352x190.png'),
          initScore:require('../assets/corner_mark.png'),
          itemNo:0,
          position:0,
          pos:'',
          eleId:'',
          pageId:'',
          top:
            [
              {
                elementId: "",
                elementImg:require("../assets/img_loading_352x190.png"),
                elementName: "",
                elementType: "",
                jsonUrl: "",
                layout: "",
                score: ""
              }
            ]
          ,isShow:false
        }
      },
      computed: {
        ...mapGetters([
          'behindParams',
        ])
      },
      mounted(){
        this.top = this.initData.elementList;
        this.eleId = this.initData.specialId;
      },
        methods: {
            keyCode(kc) {
                if (kc == "KeyBack") {
                    this.back();
                }else if(kc == "right"){
                    this.right();
                }else if(kc == "left"){
                    this.left();
                }else if(kc == "down"){
                    this.down();
                }else if(kc == "up"){
                    this.up();
                }else if(kc == "KeyEnter"){
                    let pageType = this.$route.name;
                    if(pageType == 'index'){
                       try {
                         this.pageId = this.catId;
                         let traceId = "|"+this.catId+"|"+this.top[this.itemNo].elementId;
                         let traceType = "|1|";
                         bi.categoryClick(this.catId, this.top[this.itemNo].elementId, 3, 1, this.catId, traceId, traceType);
                       } catch (error) {
                         console.log(error);
                       }
                    }
                    let url = this.top[this.itemNo].jsonUrl;
                    this.$router.push({name:"detail",params:{jsonUrl:url,catCode:1,catId:this.catId,parent:1,parentId:this.pageId}});
                }
             },back() {
              this.removeCss();
              this.isShow = false;
              this.$emit('pressDown', this.isShow,this.eleId,"back");
            },up(){
            if(this.position==1){
              if(this.itemNo==1||this.itemNo==2){
                this.removeCss();
                this.isShow = false;
                this.$emit('pressDown', this.isShow,this.eleId,"up");
              }else{
                this.removeCss();
                this.itemNo-=2;
                this.addCss();
                let eleH = this.cEleOffsetTop('#t'+(this.itemNo)+' img');
                this.$emit('eleScroll',this.name,'up',eleH);
              }
            }else if(this.position==0){
              this.removeCss();
              this.isShow = false;
              this.$emit('pressDown', this.isShow,this.eleId,"up");
            }

          },down(){
              let ele = '';
            if(this.position==1){
              if(this.itemNo==3||this.itemNo==4){
                  this.removeCss();
                  this.isShow = false;
                  this.$emit('pressDown', this.isShow,this.eleId,"down");
              }else{
                if(this.top.length<=3){
                  this.removeCss();
                  this.isShow = false;
                  this.$emit('pressDown', this.isShow,this.eleId,"down");
                  return;
                }
                this.removeCss();
                this.itemNo+=2;
                this.addCss();
                let eleH = this.cEleOffsetTop('#t'+(this.itemNo)+' img');
                this.$emit('eleScroll',this.name,'down',eleH);
              }
            }else if(this.position==0){
              this.removeCss();
              this.isShow = false;
              this.$emit('pressDown', this.isShow,this.eleId,"down");
            }

          },left(){
            if(this.position==0){
              this.removeCss();
              this.position==1;
              this.itemNo=1;
              this.addCss();
            }else if(this.position==1){
                if(this.itemNo==1){
                  this.removeCss();
                  this.position=0;
                  this.itemNo = 0;
                  this.addCss();
                }else if(this.itemNo==2){
                  this.removeCss();
                  this.itemNo--;
                  this.addCss();
                }else if(this.itemNo==3){
                  this.removeCss();
                  this.position=0;
                  this.itemNo = 0;
                  this.addCss();
                }else if(this.itemNo==4){
                  this.removeCss();
                  this.itemNo--;
                  this.addCss();
                }
              }
          },right(){
            if(this.position==0){
              this.removeCss();
              this.position = 1;
              this.itemNo = 1;
              this.addCss();
            }else{
              if(this.itemNo>=4)return;
              if(this.top.length-1==this.itemNo)return;
                this.removeCss();
                this.itemNo++;
                this.addCss();
            }
          },removeCss(){
            if(this.position==0){
              $('.top_r_img img').removeClass('item_hover');
            }else{
              $('#t'+(this.itemNo)).removeClass('item_hover');
            }
          },addCss(){
            if(this.position==0){
              $('.top_r_img img').addClass('item_hover');
            }else{
              $('#t'+(this.itemNo)).addClass('item_hover');
            }
          },updateStast(bl,pos,isEnd){
              this.isShow = bl;
              if(bl){
                this.pos = pos;
                this.addCss();
                let eleH='';
                if(this.position==0){
                   eleH = this.cEleOffsetTop('.top_r_img img');
                }else{
                   eleH = this.cEleOffsetTop('#t'+(this.itemNo)+' img');
                }
                this.$emit('eleScroll',this.name,this.pos,eleH);
              }
          },cEleOffsetTop(ele){
            let fEleDistance = $(ele).offset().top;
            let realHeight=0;
            if(this.position==0){
               realHeight = fEleDistance+306;
            }else{
               realHeight = fEleDistance+140;
            }
            return realHeight;
          }
        },
        components: {

        },watch:{
          initData(){
            this.top = this.initData.elementList;
            this.eleId = this.initData.specialId;
          }
        }
    }
</script>
