<!-- 首页标题组件 -->
<template>
    <div class="hotp">
      <ul>
        <li v-for="(item,index) in hot"   :key="item.id" :id="('hot'+index)" ref="subject"  >
          <img :class="{'hover':index===isActive}" :src="item.elementImg"></li>
      </ul>
      <keyDo v-on:listenKeyCode="keyCode"  v-if="isShow"></keyDo>
    </div>
</template>
<style scoped="hotp">
  .hotp{
    position: relative;
    width: 1227px;
    min-height: 100px;
    margin-top: 30px;
  }
  .hotp li{
    float: left;
    margin-right: 45px;
  }
  .hotp li img.hover{
    box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
    border:4px #FFF solid;
    margin: -4px;
    transform: scale(1.1);
    border-radius:8px;
  }
</style>
<script>
    import {bp as bi} from '../js/ga.js'
    export default {
      props:['initData','catCode','catId'],
      name:"hotPrograma",
      data(){
          return{
            name:"hotPrograma",
            itemNo:0,
            position:0,
            pos:'',
            eleId:'',
            hot:[{
              bulgeImg: "",
              elementId: "",
              elementImg: "",
              elementName: "",
              elementType: "",
              jsonUrl: "",
              layout: ""
            }],
            isShow:false,
            isActive:-1,
            isLast:0,
          }
      },computed: {

      },mounted(){
        this.hot = this.initData.elementList;
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
                         let traceId = "|"+this.catId+"|"+this.hot[this.itemNo].elementId;
                         let traceType = "|1|";
                         bi.categoryClick(this.catId, this.hot[this.itemNo].elementId, 3, 1, this.catId, traceId, traceType);
                       } catch (error) {
                         console.log(error);
                       }
                }
                let url = this.hot[this.itemNo].jsonUrl;
                this.$router.push({name:"hotTopics",params:{jsonUrl:url,catCode:1,catId:this.catId}});
              }
            },back() {
              this.removeCss();
              this.isShow = false;
              this.isLast = this.itemNo;
              this.isActive=-1;
              this.$emit('pressDown', this.isShow,this.eleId,"back");
           },up(){
             this.removeCss();
             this.isShow = false;
             this.isLast = this.itemNo;
             this.isActive=-1;
             this.$emit('pressDown', this.isShow,this.eleId,"up");
          },down(){
            this.removeCss();
            this.isShow = false;
            this.isLast = this.itemNo;
            this.isActive=-1;
            this.$emit('pressDown', this.isShow,this.eleId,"down");
          },left(){
              if(this.itemNo==0)return;
              this.removeCss();
              this.itemNo--;
              this.addCss();
          },right(){
            //console.log(this.itemNo);
            if(this.itemNo>=3)return;
            this.removeCss();
            this.itemNo++;
            this.addCss();
          },addCss(){
              //$('#hot'+this.itemNo+" img").addClass('hover');
          },removeCss(){
              //$('#hot'+this.itemNo+" img").removeClass('hover');
         },updateStast(bl,pos,isEnd){
            this.isShow = bl;
            this.pos = pos;
            if(bl){
              //this.addCss();
              this.isActive=this.isLast;
              let eleH = this.cEleOffsetTop('#hot'+this.itemNo+" img");
              this.$emit('eleScroll',this.name,this.pos,eleH);
            }
        },cEleOffsetTop(ele){
          let fEleDistance = $(ele).offset().top;
          //console.log("元素距离文档顶部的距离:"+fEleDistance);
          //console.log(this.name,"元素距离文档顶部的距离:"+(fEleDistance+95));
          let realHeight = fEleDistance+95;
          return realHeight;
        },changeIsActive(index){
          this.isActive  = index;
        }
        },
        components: {

        },watch:{
          initData(){
             this.hot = this.initData.elementList;
             this.eleId = this.initData.specialId;
          },itemNo(){
           // console.log("itemNo update-"+this.itemNo);
            this.changeIsActive(this.itemNo);
         }
        }
    }
</script>
