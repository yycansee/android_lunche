<!--详情页——相似推荐-->

<template>
  <div class="imgList" style="box-sizing: border-box">
    <p class="lick">{{title}}</p>
    <ul>
      <li  v-for="(item,index) in itemList"  :key="item.id" :id="('hotImg_'+eleId+'_'+index)" class="imgli animated"
           v-if="index<=11" >
        <!-- <img :src="item.assetImg" class="imgList_img" > -->
        <!--<lazy-image-->
          <!--:src='item.assetImg'-->
          <!--:placeholder='placeholder'   class="imgList_img"/>-->
        <lazy-image
          :src='item.assetImg'
          :placeholder='placeholder'
          :initScore = 'initScore'
          :score = "item.score"
          :title = "item.assetName"
          class="imgList_img"
        />
      </li>
    </ul>
    <keyDo v-on:listenKeyCode="keyCode"  v-if="isShow"></keyDo>
  </div>
</template>
<style scoped="Masse">
  .imgList ul li .mask{
    color: black;
    position: absolute;
    left: 0;
    top:0;
  }
  .lick{
    font-family:PingFangSC-Semibold;
    font-size:22px;
    color:rgba(255,252,252,0.66);
    text-align:left;
  }
  .imgList{
    position: relative;
    width: 1250px;
    margin-left: 30px;
  }
  .imgList ul:after{
    content: '';
    clear: both;
    display: block;
  }
  .imgList ul li{
    width: 160px;
    height:230px;
    float: left;
    margin-right: 20px;
    position: relative;
    margin-top: 20px;
    box-sizing: border-box;
    border: 1px rgba(255,255,255, 0.5) solid;
  }
  .imgList .imgList_img{
    width: 100%;
    height: 100%;
    box-sizing: border-box;

  }
  .imgList ul .tran{
    border: 4px solid #ffffff;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);
  }
  .animated {
    animation-duration: 0.3s; /*动画时间*/
    animation-fill-mode: none; /*播放后的状态*/
  }

  .animated {
    animation-iteration-count: 1; /*动作循环的次数：1c*/
  }

  .animated {
    animation-duration: 0.5s; /*动画时间*/
  }

  .animateds{
    animation-name:imgli; /*动画的名称*/
    transform-origin: center bottom; /*设置动画旋转元素的基点为：居中靠下*/
    cursor: pointer;
  }

  @keyframes imgli{
    0%,
    100%,
    20%,
    50%,
    80% {
      transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
      transform: translate3d(0,0,0); /*设置只在Z轴上移动*/
    }
    40%,
    43%{
      transition-timing-function: cubic-bezier(0.755,0.50,0.855,0.060);
      transform: translate3d(0,-30px,0);
    }
    70%{
      transition-timing-function: cubic-bezier(0.755,0.050,0.855,0.060);
      transform: translate3d(0,-15px,0);
    }
    90%{
      transform: translate3d(0,-4px,0);
    }
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  import { client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'
  export default {
    props:['initData',"catCode","catId","parent","parentId","backIng"],
    data(){
      return{
        name:'Movie_assetList',
        itemNo:0,
        isShow:false,
        placeholder:require('../../assets/img_loading_160x230.png'),
        initScore:require('../../assets/corner_mark.png'),

        isEnd:false,
        eleId:'',
        pos:'',
        itemList:[],
        arrc:[],
        specialList:[
          {
            actorImg:"",
            actorId:"",
            actorName:"",
            actorType:"",
            jsonUrl:"",
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'behindParams',
      ])
    },
    created(){
      this.specialList = this.initData.data.assetList;
      this.eleId = this.initData.data.assetList[0].assetId;// 默认数据第一个为组件内的id
      this.name = "Movie_assetList";// 默认数据第一个为组件名字
      this.title = "相似推荐";// 默认标题
      this.itemList = this.specialList.sort(function(){ return 0.5 - Math.random() });
      this.$nextTick(function() {
        this.$lazyImages.loadImage();
       })
    },
    updated(){

    },mounted(){

    },activated(){
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
          let url = this.itemList[this.itemNo].jsonUrl;
          this.isShow = false;
          let id = this.itemList[this.itemNo].assetId;
          let pageId =this.initData.data.assetId;
          // bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
          bi.categoryClick(pageId,id,2,31,pageId);
          console.log(pageId,id,2,31,pageId+'点击事件');
          this.$emit('pressDown', this.isShow,this.name,"KeyEnter",url);
          localStorage.removeItem('address');
          localStorage.setItem('address',url);
          this.removeCss();
        }
      }, back() {
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
      },down(){
        if(this.itemNo<=5){
          this.removeCss();
          this.itemNo+=6;
          this.addCss();
          let eleH = this.cEleOffsetTop('#hotImg_'+this.eleId+"_"+this.itemNo+'');
          this.$emit('eleScroll',this.name,"down",eleH);
        }else{
          if(!this.isEnd){
//            this.removechange();
            this.removeCss();
            this.addCss();
//            this.changes();
          }
        }
      },up(){
        this.removeCss();
        let eleH = this.cEleOffsetTop('#hotImg_'+this.eleId+"_"+this.itemNo+'');
        this.$emit('eleScroll',this.name,'up',eleH);
        if(this.itemNo>5){
          this.itemNo-=6;
          this.addCss();
        }else{
          this.isShow = false;
          this.$emit('pressDown', this.isShow,this.name,"up");
        }

      },left(){
        if(this.itemNo==0 ||this.itemNo==6)return;
        this.removeCss();
        this.itemNo--;
        this.addCss();
      },right(){
        if(this.itemNo==5||this.itemNo==11)return;
        this.removeCss();
        this.itemNo++;
        this.addCss();
      },addCss(){
        $('#hotImg_'+this.eleId+"_"+this.itemNo).removeClass('tran');
        $('#hotImg_'+this.eleId+"_"+this.itemNo).addClass('tran');
      },removeCss(){
        $('#hotImg_'+this.eleId+"_"+this.itemNo).addClass('tran');
        $('#hotImg_'+this.eleId+"_"+this.itemNo).removeClass('tran');
      },
      updateStast(bl,pos,isEnd){
        this.itemNo = 0;
        this.isShow = bl;
        this.pos = pos;
        if(bl){
          this.addCss();
          let eleH = this.cEleOffsetTop('#hotImg_'+this.eleId+"_"+this.itemNo+'');
          this.$emit('eleScroll',this.name,this.pos,eleH);
        }
      },cEleOffsetTop(ele){
        let fEleDistance = $(ele).offset();
        let realHeight = fEleDistance.top+300;
        return realHeight;
      },
       rnd(n,m){
         return parseInt(Math.random()*(m-n)+n);
      }
    },
       components: {

      }
     ,watch:{
      initData(){
        this.specialList = this.initData.data.assetList;
        this.eleId = this.initData.data.assetList[0].assetId;// 默认数据第一个为组件内的id
        this.name = "Movie_assetList";// 默认数据第一个为组件名字
        this.itemList = this.specialList.sort(function(){ return 0.5 - Math.random() });
      }
    }
  }
</script>

