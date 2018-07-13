<!--详情页——明星-->
<template>
  <div class="with_page" style="box-sizing: border-box;margin-top: 5px">
    <div class="page_con">
      <div v-for="(item,index) in specialList" v-if="index>=0" :key="item.id" :id="('a'+index)" class="Oval" >
        <img :src="specialList[index].actorImg" class="con_img">
        <p class="name">{{specialList[index].actorName}}</p>
      </div>
      <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
    </div>
  </div>
</template>

<style scoped="Mact">

  .with_page{
    position: relative;
    width:1280px;
    height: 200px;
    margin-top: 42px;
    overflow: hidden;
  }
  .page_con{
    position: absolute;
    width:10000px;
    height: 200px;
  }
  .page_con:after{
    clear: both;
    content: "";
    display: block;
  }
  .page_con .Oval{
    background:#ffffff;
    width:114px;
    height:114px;
    border-radius:100%;
    float: left;
    margin-right: 45px;
    margin-top: 15px;
    border: 2px solid rgba(255,255,255,0.5);
  }
  .page_con .Oval:nth-child(1){
    margin-left: 55px;
  }

  .page_con .Oval img{
    width: 100%;
    height: 100%;
    border-radius:100%;
  }
  .page_con .Oval .name{
    font-family:PingFangSC-Semibold;
    font-size:20px;
    color:#ececec;
    text-align:center;
    margin-top: 10px;
  }
  .page_con .Oval .tran{
    border: 4px solid #ffffff;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }
  /*.page_con .Oval .time{*/
  /*box-shadow:2px 4px 10px rgba(0,0,0,0.3);*/
  /*}*/


</style>

<script>
  import { mapGetters } from 'vuex'
  import {HTTPUtil as api} from '../../fetch/api.js'
  import {bp as bi} from '../../js/ga.js'


  export default {
    props:['initData','jsonUrl',"catCode","catId","parent","parentId","backIng"],
    data() {
      return {
        name:'Movie_actorList',
        itemNo:0,
        isShow:false,
        specialList:[],
        cheight:[]
      }
    },
    computed: {
      ...mapGetters([
        'behindParams',
      ])
    },
    created(){
      this.specialList = this.initData.data.actorList;
      this.eleId = this.initData.data.actorList[0].actorId;//默认数据第一个为组件内的id
      this.name = "Movie_actorList";//默认数据第一个为组件名字
      this.title = this.initData.data.assetId;//默认标题
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
          let url = this.specialList[this.itemNo].jsonUrl;
          let id = this.specialList[this.itemNo].actorId;
          let pageId =this.initData.data.assetId;
          let traceId = "|"+this.catId;
          let traceType = "|"+this.catCode;
            //      bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
            bi.categoryClick(this.catId,id,3,31,pageId,traceId,traceType);
            console.log(this.catId,id,3,31,pageId,traceId,traceType+'点击事件');
          this.$router.push({name:"actor",params:{jsonUrl:url,catCode:this.catCode,catId:this.catId,parent:3,parentId:this.parentId}});
        }
      } ,back() {
         let backPT = localStorage.getItem('backPT');
         if(this.$route.query.jsonUrl!=undefined){
          yh.back();
        }else{
           if(backPT!='进入播放器'){
             if(this.backIng){
               this.$router.push({name:"index"});
             }else {
               this.$router.go(-1);
             }
           }else {
             localStorage.removeItem('backPT');
             this.$router.push({name:"index"});
           }
        }
      },left() {
          if(this.itemNo==0)return;
          this.removeCss();
          this.itemNo--;
          this.addCss();
          $('.page_con').stop(false,true).animate({'left':'+='+this.cheight[this.itemNo]},1);
          this.cheight.splice((this.itemNo),1);
          console.log(this.cheight);
      },right(){
          if(this.itemNo>=this.specialList.length-1)return;
          let chang = this.cEleOffset('#a'+(this.itemNo));
          console.log(this.cEleOffset('#a'+(this.itemNo)));
          if (chang>=1075){
//            $('.page_con').css({'transition':'all 0.1s','transform':'translateX(-'+166*(this.itemNo-5)+'px)'})
            $('.page_con').stop(false,true).animate({'left': '-='+166},1);
            let temp = 166;
            this.cheight.push(temp);
            console.log(this.cheight);
          }
          this.removeCss();
          this.itemNo++;
          this.addCss();
      },up(){
        $('.con_img').removeClass('tran');
        this.isShow = false;
        this.$emit('pressDown', this.isShow,this.name,"up");
        let eleH = this.cEleOffsetTop('.con_img');
        this.$emit('eleScroll',this.name,'up',eleH);
      },down(){
        $('.con_img').removeClass('tran');
        this.isShow = false;
        this.$emit('pressDown', this.isShow,this.name,"down");
      }, removeCss(){
        if(this.position==0){
          $('.con_img').removeClass('tran');
        }else{
          $('#a'+(this.itemNo)+' img').removeClass('tran');
        }
      },addCss(){
        if(this.position==0){
          $('.con_img').addClass('tran');
        }else{
          $('#a'+(this.itemNo)+' img').addClass('tran');
        }
      },updateStast(bl,pos,isEnd){
        this.isShow = bl;
        this.itemNo = 0;
//        $('.page_con').css({'transition':'all 0.1s','transform':'translateX(0px)'})
        $('.page_con').stop(false,true).animate({'left': 0},1);
        if(bl){
          $('#a'+(this.itemNo)+' img').addClass('tran');
          if(pos=="down"){
            let eleH = this.cEleOffsetTop('.con_img');
            this.$emit('eleScroll',this.name,pos,eleH);
          }
        }
      },cEleOffsetTop(ele) {
        let fEleDistance = $(ele).offset();
        let realHeight = fEleDistance.top+200;
        return realHeight;
      },
      cEleOffset(ele) {
        let fEleDistance = $(ele).offset();
        let realchang = fEleDistance.left+120;
        return realchang;
      },

    },watch:{
    initData(){
      this.specialList = this.initData.data.actorList;
      this.itemNo = 0;
      $('.page_con').stop(false,true).animate({'left': 0},1);
    }
  },
    components: {
    }
  }
</script>
