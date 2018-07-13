<!--详情页——娱乐类详情页顶部-->

<template>
  <div class="Rectangle" style="box-sizing: border-box;margin-bottom: 10px">
    <div class="Mask">
      <img :src=(art.assetImg) >
    </div>
    <div class="Bona">
      <p class="text-page">
        <span>{{art.assetName}}</span>
        <span>{{art.score}}</span>
      </p>

      <p class="text-page2">
        <span>{{art.area}}</span>
        <span>{{art.language}}</span>
        <span>{{art.year}}</span>
      </p>
      <p class="content-page3">{{art.description}}</p>
      <div class="btn-page">
        <div class="btn-play">
          <i class="iconfont">&#xe63f</i>
          播放</div>
        <div class="btn-sc">
          <span v-if="sc">♥</span>   <span v-if="sc">已</span><i class="iconfont" v-if="ss">&#xe6a1    </i>收藏  <span v-if="sc">♥</span>
        </div>
        <div class="btn-js "><i class="iconfont">&#xe60b    </i>介绍</div>
      </div>
    </div>
    <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
  </div>
</template>

<style scoped="Mtop">
  .Rectangle{
    background:rgba(0,0,0,0.45);
    width:1120px;
    height: 550px;
    border-top:1px solid #000000;
    border-radius: 10px;
  }
  .Rectangle:after{
    clear: both;
    content: "";
    display: block;
  }
  .Rectangle .Mask{
    border-radius:12px;
    width:256px;
    height:368px;
    margin-left: 24px;
    margin-top: 38px;
    float: left;
    position: relative;
  }
  .Rectangle .Mask img{
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border:2px solid #ffffff;
    box-sizing: border-box;
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
    width: 600px;
    height:58px;
    position: absolute;
    left:330px;
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
    width: 30%;
    border-radius:5px;
    box-sizing: border-box;
    border-left:1px solid rgba(0,0,0,0.50);
    border-right:1px solid rgba(0,0,0,0.50);
    margin-left: 1px;
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
  import {client as yh} from '../../js/client.js'
  import { mapGetters } from 'vuex'
  import {bp as bi} from '../../js/ga.js'
  import c from '../../js/common.js'
  import {authFunction as auth} from '../../js/auth.js'
  import {HTTPUtil as api} from '../../fetch/api.js'


  export default {
    props:['initData','jsonUrl',"catCode","catId","parent","parentId","backIng"],
    data() {
      return {
        epgdomain:'',
        name:'movie_top',
        num:1,
        sc:false,
        ss:true,
        isShow:false,
        pos:'',
        str:'',
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
          language:"",
          assetType:"",
        },
        collect:
          {
            asType:'',
            asimg:'',
            asname:'',
            sco:'',
            asId:''
        },
      }
    },
    components: {
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
    },activated(){

    },
    mounted(){

    },

     methods: {
      keyCode(kc) {
          if (kc == "down") {
            this.down();
          } else if (kc == "left") {
            this.left();
          } else if (kc == "right") {
            this.right();
          } else if (kc == "KeyEnter") {
            this.KeyEnter();
          }else if(kc == "KeyBack"){
            this.back();
          }
      },
       /**
        * 查看收藏
        * @param {assetId,specialId} params
        * assetId:资产id
        * specialId:专题id
        */
       plays(){
         let backurl = window.location.href;
         let code = '21100001000000021522201686137001';
         let videotype = localStorage.getItem('adorignal');
         let obj = {router:this.$router,backurl:backurl,code:code,videotype:videotype};
         yh.play(obj);
         console.log(obj);
       },
       getUse(){
         let useGet = localStorage.getItem('usehf').user_paylockstatus;
         let usePost = localStorage.getItem('usejq');
         if(useGet ==2){
           console.log('黑名单用户不可订阅');
         }else if(useGet ==1){
           console.log("白名单用户");
           this.plays();
         }else {
           console.log("具备订购条件");
           if(usePost == 0){
             console.log('用户未登录');
             this.$router.push({name:"Detail"});
           }else if(usePost ==1){
             console.log('未订购试看5分钟');
             let code = '21100001000000021522201686137001';
             this.trySee(code);
           }else if(usePost ==2){
             console.log('通过订购');
             this.plays();
           }
         }
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
       findindex() {
         let storage = JSON.parse(localStorage.getItem('PersonMovies'));
         for (let i = 0; i < storage.length; i++) {
           if (storage[i].assetId == this.art.assetId) {
             return i;
           }
         }
       },
       trySee(code){
         let type = localStorage.getItem('adorignal');
         if(type =='zx'){
           code  = "21100001000000011526451047122000";
           localStorage.setItem('backPT','进入播放器');
           console.log('中兴视频播放');
           const rest = 'http://winnow-bds.yanhuamedia.tv/web_proxy_service/play/myplay.jsp?code='+code+'&providerid='+type;
           window.location ='http://winnow-bds.yanhuamedia.tv/web_proxy_service/play/geturlzx.jsp?code='+code+'&ReturnURL='+rest+"&backUrl="+location.href;
         }else {
           localStorage.setItem('backPT','进入播放器');
           if("CTCSetConfig" in Authentication) {
             this.epgdomain = Authentication.CTCGetConfig("EPGDomain");
           } else {
             this.epgdomain = Authentication.CUGetConfig("EPGDomain");
           }
           const last = this.epgdomain.lastIndexOf("/");
           const host = this.epgdomain.substr( 0, last );
           const rest = 'http://winnow-bds.yanhuamedia.tv/web_proxy_service/play/myplay.jsp?code='+code+'&providerid='+type;
           const src = host+ '/geturlhw.jsp?code='+code+'&ReturnURL='+encodeURIComponent(rest);
           window.location = src;
           console.log(src);
           console.log('华为视频播放');
         }
       },
       KeyEnter() {
      if (this.num==2){
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
      }
      else if (this.num==3){
        this.isShow = false;
        $('.btn-js').removeClass('change');
        let info = {title:this.art.assetName,msg:this.art.description,alert:true};
        this.$emit('alertM',info);
        let id = this.initData.data.itemList[0].itemId;
        console.log(id+'下方推荐');
        let pageId =this.initData.data.assetId;
        let traceId = "|"+this.catId;
        let traceType = "|"+this.catCode;
        //      bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
        bi.categoryClick(this.catId,id,3,31,pageId,traceId,traceType);
        console.log(this.catId,id,3,31,pageId,traceId,traceType+'点击事件');
      }
      else if(this.num==1){
//        let tempUrl = this.jsonUrl.replace('https://winnow-bds.yanhuamedia.tv','http://winnow-ds.yanhuamedia.tv');
        let id = this.initData.data.itemList[0].itemId;
        console.log(id+'下方推荐');
        let pageId =this.initData.data.assetId;
        let traceId = "|"+this.catId;
        let traceType = "|"+this.catCode;
        //      bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
        bi.categoryClick(this.catId,id,5,31,pageId,traceId,traceType);
        console.log(this.catId,id,5,31,pageId,traceId,traceType+'点击事件');
        this.getUse();
      }
    },

      right() {
        this.num+=1;
        if (this.num==1){
          $('.btn-js').removeClass('change');
          $('.btn-play').addClass('change');
          $('.btn-sc').removeClass('change');
        }else if (this.num==2){
          $('.btn-js').removeClass('change');
          $('.btn-sc').addClass('change');
          $('.btn-play').removeClass('change');
        }else if (this.num>=3){
          $('.btn-sc').removeClass('change');
          $('.btn-js').addClass('change');
          $('.btn-play').removeClass('change');
          this.num=3;
        }
      }, left() {
        this.num-=1;
        if (this.num==2){
          $('.btn-js').removeClass('change');
          $('.btn-sc').addClass('change');
          $('.btn-play').removeClass('change');
        }else if (this.num<=1){
          $('.btn-js').removeClass('change');
          $('.btn-play').addClass('change');
          $('.btn-sc').removeClass('change');
          this.num=1
        }else if (this.num==3){
          $('.btn-sc').removeClass('change');
          $('.btn-js').addClass('change');
          $('.btn-play').removeClass('change');
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
      down(){
      $('.btn-sc').removeClass('change');
      $('.btn-js').removeClass('change');
      $('.btn-play').removeClass('change');
      this.isShow = false;
      this.$emit('pressDown', this.isShow,"movie_top","down");

      }
// ,local(){
//        //本地存储
//        this.collect.asType = this.art.assetType;
//        this.collect.asimg = this.art.assetImg;
//        this.collect.asname = this.art.assetName;
//        this.collect.sco = this.art.score;
//        this.collect.asId = this.art.assetId;
//        this.str = JSON.stringify(this.collect);
//        localStorage.setItem('addTv', this.str);
//      },removeItem(){
//        localStorage.removeItem(this.collect.asId);
//      }
      ,updateStast(bl,pos,higth){
        this.isShow = bl;
        this.pos = pos;
        if(higth){
          $('.Rectangle').css('height','470px');
        }
        if(bl){
          this.num=1;
          $('.btn-play').addClass('change');
          let eleH = this.cEleOffsetTop('.btn-js');
          this.$emit('eleScroll',this.name,this.pos,eleH);
        }
    },cEleOffsetTop(ele){
      let fEleDistance = $(ele).offset();
      let realHeight = fEleDistance.top+500;
      return realHeight;
    },popUp(bOk) {

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
     }
    },watch:{
      initData(){
        this.art = this.initData.data;
        this.isShow = false;
        $('.btn-play').removeClass('change');
        $('.Rectangle').css('height','550px');
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
