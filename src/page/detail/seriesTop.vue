<!--详情页——电视剧顶部-->



<template>
  <div class="Rectangle" style="box-sizing: border-box;margin-bottom: 10px">
    <div class="Mask">
      <img :src=(art.assetImg) />
    </div>
    <div class="Bona">
      <p class="text-page">
        <span>{{art.assetName}}</span>
        <span>{{art.score}}</span>
      </p>

      <p class="text-page2">
        <span>{{art.area}}</span>
        <span>{{art.year}}</span>
        <span>{{art.language}}</span>
        <span>{{art.episodes+"集"}}</span>
      </p>
      <p class="content-page3">{{art.description}}</p>
      <div class="btn-page ">
        <div class="btn-sc">
          <span v-if="sc">♥</span>   <span v-if="sc">已</span><i class="iconfont" v-if="ss">&#xe6a1    </i>收藏  <span v-if="sc">♥</span>
        </div>
        <div class="btn-js "><i class="iconfont">&#xe60b    </i>介绍</div>
      </div>
    </div>
    <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
  </div>
</template>

<style scoped="seriesTop">
   .Rectangle{
     background:rgba(0,0,0,0.45);
     width:1120px;
     height: 580px;
     /*margin-top: 86px;*/
     /*margin-left: 80px;*/
     border-top:1px solid #000000;
     border-radius: 10px;
   }
  .Rectangle:after{
    clear: both;
    content: "";
    display: block;
  }
  .Rectangle .Mask{
    width:256px;
    height:368px;
    margin-left: 36px;
    margin-top: 38px;
    float: left;
    position: relative;
    text-align: center;
  }
  .Rectangle .Mask img{
    border: 2px solid #666666;
    border-radius:8px;
    width: 100%;
    height: 100%;
  }
  .Bona{
    width: 700px;
    margin-left: 40px;
    margin-top: 38px;
    float: left;
  }
  .Bona .text-page span:nth-child(1){
    font-family:PingFangSC-Semibold;
    font-size:30px;
    color:#ececec;
    text-align:left;
    margin-right: 5px;
  }
  .Bona .text-page span:nth-child(2){
    font-family:PingFangSC-Medium;
    font-size:20px;
    color:#f5a623;
    text-align:left;
  }
  .Bona .text-page2 {
    font-family:PingFangSC-Regular;
    font-size:20px;
    color:#ffffff;
    text-align:left;
    margin-top: 26px;
  }
  .Bona .text-page2:after{
    clear: both;
    content: '';
    display: block;
  }
  .Bona .text-page2 span{
    border-left: 3px solid white;
    text-indent: 10px;
    display:block;
    float: left;
    margin-right: 10px;

  }
  .Bona .text-page2 span:nth-child(1){
    border: none;
    text-indent: 1px;
  }
  .Bona  .content-page3{
    font-family:PingFangSC-Regular;
    font-size:20px;
    color:#ffffff;
    text-align:left;
    margin-top: 28px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
  .btn-page{
    border-radius:5px;
    width:377px;
    height:58px;
    position: absolute;
    left: 330px;
    top: 350px;
  }
  .btn-page div{
    background:rgba(255,255,255,0.50);
    font-family:PingFangSC-Regular;
    font-size:20px;
    color:#ffffff;
    text-align:center;
    float: left;
    line-height: 58px;
    width: 49%;
    border-radius:5px;
    box-sizing: border-box;
    border-left:1px solid rgba(0,0,0,0.50);
    border-right:1px solid rgba(0,0,0,0.50);
    margin-left: 3px;
    /*transition: 0.6s all;*/
  }
  .oll-page li{
    font-family:PingFangSC-Regular;
    font-size:18px;
    color:#ffffff;
    float: left;
    padding-left: 42px;
    padding-top: 14px;
  }
  .Rectangle .btn-page .change{
    background: #A36363;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);
    border: solid 4px white;
    margin-top: -4px;
  }

</style>

<script>
  import { mapGetters } from 'vuex'
  import { client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'
  export default {
    props:['initData','jsonUrl',"catCode","catId","parent","parentId","backIng"],
    data() {
      return {
        name:'seriesTop',
        itemNo:true,
        isShow:false,
        num:0,
        sc:false,
        ss:true,
        isEnd:false,
        pos:'',
        art: {
                description:"",
                elementId: "",
                assetImg: "",
                assetId: "",
                assetName: "",
                layout: "",
                score: "",
                area:"",
                year: "",
                episodes: "",
                language:""
              },
      }
    },
    computed: {
      ...mapGetters([
        'behindParams',
      ])
    },
    created(){
      this.art = this.initData.data;
      console.log(this.queryFavorite());
      if (this.queryFavorite()){
        this.sc = true;
        this.ss = false
      }else {
        this.sc = false;
        this.ss = true;
      }
    },
    mounted(){
        this.art = this.initData.data;
    },
    methods: {
      keyCode(kc) {
        if (kc == "KeyBack") {
          this.back();
        } else if (kc == "right") {
          this.right();
        } else if (kc == "left") {
          this.left();
        } else if (kc == "down") {
          this.down();
        } else if (kc == "up") {
          this.up();
        } else if (kc == "KeyEnter") {
          this.KeyEnter();
        }
      },
        KeyEnter() {
          if (this.num==0){
            if (!this.sc) {
              this.sc = true;
              this.ss = false;
              let Tvsc = {
                assetId: this.art.assetId,
                assetName: this.art.assetName,
                assetType: this.art.assetType,
                assetImg: this.art.assetImg,
                episodes: this.art.episodes,
                broadcast: this.art.broadcast,
                score: this.art.score,
                coverimage: this.art.coverimage,
                specialName: this.art.specialName,
                layout: this.art.layout,
                layoutUrl: this.jsonUrl
              };
              let storage = localStorage.getItem('PersonMovies');
              if (storage) {
                storage = JSON.parse(storage);
              } else {
                storage = [];
              }
              storage.push(Tvsc);
              localStorage.setItem('PersonMovies', JSON.stringify(storage));
              this.Coll();
            }
            else {
              this.sc = false;
              this.ss = true;
              let storage = JSON.parse(localStorage.getItem('PersonMovies'));
              let json = [];
              for (let i = 0; i < storage.length; i++) {
                if (i != this.findindex()) {
                  json.push(storage[i]);
                }
              };
              localStorage.setItem('PersonMovies', JSON.stringify(json));
              this.NoColl();
            }
          }else if (this.num==1){
            let info = {title:this.art.assetName,msg:this.art.description,alert:true};
            this.isShow = false;
            this.$emit('alertM',info);
            $('.btn-js').removeClass('change');
            let id = this.initData.data.itemList[0].itemId;
            console.log(id+'下方推荐');
            let pageId =this.initData.data.assetId;
            let traceId = "|"+this.catId;
            let traceType = "|"+this.catCode;
            //      bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
            bi.categoryClick(this.catId,id,3,31,pageId,traceId,traceType);
            console.log(this.catId,id,5,31,pageId,traceId,traceType+'点击事件');
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
      },
      right() {
        this.num=1
        $('.btn-sc').removeClass('change');
        $('.btn-js').addClass('change');
      },
      left() {
        this.num=0
        $('.btn-js').removeClass('change');
        $('.btn-sc').addClass('change');
      },
      down(){
        $('.btn-sc').removeClass('change');
        $('.btn-js').removeClass('change');
        this.isShow = false;
        this.$emit('pressDown', this.isShow,"seriesTop","down");
        // let eleH = this.cEleOffsetTop('.btn-js');
        // this.$emit('eleScroll',"seriesTop",'down',eleH);
      },
      up(){
        let eleH = this.cEleOffsetTop('.btn-js');
        this.$emit('eleScroll',"seriesTop",'up',eleH);
      },
      updateStast(bl,pos){
        this.isShow = bl;
        this.pos = pos;
        $('.btn-sc').addClass('change');
        this.num=0;
      },cEleOffsetTop(ele){
        let fEleDistance = $(ele).offset();
        let realHeight = fEleDistance.top+100;
        return realHeight;
      },
      Coll(){
        let pageId =this.art.assetId;
        let assId = this.art.itemList[0].itemId;
        console.log(assId);
        let traceId = "|" + this.catId;
        let traceType = "|" + this.catCode;
//        bp.collect = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id, cat_id, asset_id, collect_type, type)
        bi.collect(traceId,traceType,31,pageId,traceType,this.catId,pageId,assId,3,1);
        console.log(traceId,traceType,31,pageId,traceType,this.catId,pageId,assId,3,1);
      },
      NoColl(){
        let pageId =this.art.assetId;
        let assId = this.art.itemList[0].itemId;
        console.log(assId);
        let traceId = "|" + this.catId;
        let traceType = "|" + this.catCode;
//        bp.collect = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id, cat_id, asset_id, collect_type, type)
        bi.collect(traceId,traceType,31,pageId,traceType,this.catId,pageId,assId,3,2);
        console.log(traceId,traceType,31,pageId,traceType,this.catId,pageId,assId,3,2);
      },
      queryFavorite(){
        let storage = JSON.parse(localStorage.getItem('PersonMovies'));
        console.log(storage);
        if (storage) {
          for (let i = 0; i < storage.length; i++) {
            if (storage[i].assetId == this.art.assetId) {
              return true;
            }
          }
        } else {
          return false;
        }
      },
    },components: {
    },watch:{
      initData(){
        this.art = this.initData.data;
        this.isShow=false;
        $('.btn-sc').removeClass('change');
        if (this.queryFavorite()){
          this.sc = true;
          this.ss = false
        }else {
          this.sc = false;
          this.ss = true;
        }
      }
    }
  }
</script>
