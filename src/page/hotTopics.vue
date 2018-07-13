<template>
  <div class="container" :style="{backgroundColor:bg}">
    <div class="carousel">
      <ul>
        <li id="top0" bgcolor="#6dc9aa" type="column" :style="{backgroundImage:'url('+eleList[0].specialImg+')'}" >
        </li>
      </ul>
      <div class="header">
        <div class="tit">{{eleList[0].specialName}}</div>
        <div class="btn-sc">
          <span v-if="sc">♥</span>   <span v-if="sc">已</span>收藏
        </div>
        <p class="time"></p>
      </div>
    </div>
    <div id="down_box">
      <div class="down-silde">
        <div v-for="(item,index) in eleList" class="box" :key="item.id" :id="('box'+index)">
          <div class="scroll-box">
            <ul>
              <li  type="column"  v-for="(film,num) in item.elementList" :id="('play_'+index+'_'+num)"  :key="film.id">
                <!--<img :src="(film.elementImg)">-->
                <!--<lazy-image-->
                  <!--:src='(film.elementImg)'-->
                  <!--:placeholder='placeholder'  />-->
                <lazy-image
                  :src='film.elementImg'
                  :placeholder='placeholder'
                  :initScore = 'initScore'
                  :score = "film.score"
                  :title = "film.elementName"
                />
                <!--<div class="mask">{{film.elementName}}</div>-->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <keyDo ref="keydo" v-on:listenKeyCode="keyCode" v-if="isShow"></keyDo>
  </div>
</template>
<style scoped="hotTopics">
  .header{
    width: 1280px;
    position: absolute;
    left: 0px;
    top: 20px;
  }
  .header:after{
    clear: both;
    content: '';
    display: block;
  }
  .header .btn-sc{
    background:rgba(255,255,255,0.3);
    font-family:PingFangSC-Regular;
    font-size:19px;
    color:#ffffff;
    text-align:center;
    float: left;
    line-height: 58px;
    width: 100px;
    border-radius:5px;
    box-sizing: border-box;
    margin-left: 5px;
    /*transition: 0.01s all;*/
  }
  .tit{
    background:rgba(255,255,255,0.3);

    font-weight:600;
    font-family:PingFangSC-Regular;
    font-size:20px;
    color:#ffffff;
    text-align:center;
    float: left;
    line-height: 58px;
    border-radius:5px;
    box-sizing: border-box;
    transition: 0.8s all;
    margin-left: 20px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .time{
    font-size: 20px;
    float: right;
    margin-right: 60px;
    line-height: 60px;
    color: rgba(255,255,255,0.7);
  }
  #app{position:relative;width:1280px; height:720px;overflow:hidden;}
  ul,li{list-style: none;}
  #top0{height:400px;width:1280px;background-repeat: no-repeat;background-size:100% 100%;}
  /*.top_focus{width: 712px;height: 115px; border: 5px solid yellow;display: none;position: absolute;top: 187px;left: 21px;}*/
  #down_box{width: 1280px;height: 700px; position: relative; top: -83px;}
  .down-silde{width: 1280px;position: absolute;background:#A8977C; }
  .container{width: 1280px;height: 720px;overflow: hidden;}
  .carousel{width:1280px;height:400px;position: relative;overflow: hidden;}
  .carousel ul{position: absolute;}
  .carousel li{float: left;}
  .box{width: 1280px;height: 1000px;position: relative;left:50px; margin-top: 25px}
  .scroll-box{width: 1200px;margin-left: 32px;position: absolute;}
  .scroll-box ul:after{
    clear: both;
    content: '';
    display: block;
  }
  .scroll-box li{
    width: 160px;
    height: 232px;
    float: left;
    position: relative;
    margin-right: 30px;
    margin-top: 30px;
    box-sizing: border-box;
    border: solid 1px rgba(255, 255, 255, 0.5);
  }
  .scroll-box ul .hover{
    border: 4px solid #ffffff;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);
  }
  .scroll-box li img{width: 100%;height: 100%;}
  .mask{
    width: 160px;
    height: 35px;
    background-color: #000000;
    position: absolute;
    bottom: 0px;
    left: 0px;
    opacity: 0.7;
    text-align: center;
    color: #FFF;
    line-height: 35px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size:16px;
    box-sizing: border-box;
  }
  .container,.down-silde{background-color: #A8977C;}
  .header .color{
     background: #A36363;
     border: 4px solid #ffffff;
     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);
    margin-top: -4px;

  }
  .header .change{
    background-image:radial-gradient(50% 97%, #8a575a 0%, rgba(99,25,43,0.99) 97%);
    box-shadow: 1px 1px 14px #000 inset;
    color: darkgrey;
    transition: 0.1s all;
  }

</style>
<script>
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../fetch/api.js'
  import {client as yh} from '../js/client.js'
  import {bp as bi} from '../js/ga.js'
  import {authFunction as auth} from '../js/auth.js'

  var row=0;
  var col=0;
  var listdate=[0,0,0,0,0,0,0,0,0,0];
  var itemNo=0;
  var title;//焦点选中时滚动的标题
  var run;//滚动定时器函数
  var x,y,z;
  var flag = true;
  var d = new Date();
  export default {
    props:['jsonUrl','catCode','catId'],
    name: 'hotTop',
    data () {
      return {
        isShow:true,
        number:0,
        index:0,
        itemnum:0,
        placeholder:require('../assets/img_loading_160x230.png'),
        initScore:require('../assets/corner_mark.png'),
        tra:'',
        pageId:0,
        sc:false,
        catid:0,
        traceType:'',
        traceTypes:'',
        eleList:[
           {

           }
        ],
        bg:"#A8977C"
      }
    },components:{

    },created() {
      this.init();
      this.ds();
    }
    ,watch:{
      eleList:function (value) { // 监听数据变化并作出处理
        this.$nextTick(function () {
          this.isShow = true;
          listdate[col] = 0;
          this.addCss();
          this.load();
          this.getTanZheng();
        })
      }

    },updated(){
      this.$nextTick(function() {
        this.$lazyImages.loadImage();
       })
    },
    methods: {
      getTanZheng(){
        this.$nextTick(()=>{
          let adiaspip = localStorage.getItem('adiaspip');
          let addevicetoken = localStorage.getItem('iaspuserid');
          let adorignal = localStorage.getItem('adorignal');
          let admacs = localStorage.getItem('admacs');
          let admac = localStorage.getItem('admac');
          let adtemptoken = localStorage.getItem('temptoken');
          let adnickName ='yanhuaTV';
          let adpageID = 'special';
          let adoperationType = 'zhuanti';
          let timestamp =new Date().getTime();
          let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() + ':';
          let s = date.getSeconds();
          let adtimestemp = Y+M+D+h+m+s;
          let adparams=auth.Base64encode(adiaspip+'|'+adtemptoken+'|'+addevicetoken+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+admac+'|'+admacs+'|'+''+'|'+adtimestemp);
          console.log(adparams+'探针');
          console.log(adiaspip+'|'+adtemptoken+'|'+addevicetoken+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+admac+'|'+admacs+'|'+''+'|'+adtimestemp);
          let adlog='http://218.24.37.2/templets/epg/spstatistics.jsp?param='+adparams;
          $.ajax({url:adlog,async:true});
        })
      },
      categoryCilck(){
        let pageId =this.eleList[0].specialId;
        console.log(pageId);
        let traceId = "|"+this.catId+"|"+pageId;
        let traceType = "|"+this.catCode+"|8|";
        //      bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
        bi.categoryClick(this.catId,this.catid,3,8,pageId,traceId,traceType);
        console.log(this.catId,this.catid,3,8,pageId,traceId,traceType);
      },
      load(){
        this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
        let pageId =this.eleList[0].specialId;
        this.pageId = pageId;
        console.log(this.eleList);
        let traceId = "|"+this.catId+"|"+pageId;
        this.tra = "|"+this.catId+"|"+pageId;
        this.traceType = "|"+this.catCode+"|8|";
        this.traceTypes= this.catCode+"|8|";
        let oldTime =performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart;
//        bp.loadPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id,special_type,oldTime)
        bi.loadPage(traceId,this.traceType,8,pageId,this.catCode,this.catId,1,oldTime);
        console.log(traceId,this.traceType,8,pageId,this.catCode,this.catId,1,oldTime);
      },
      getDetail(curl){
        let that = this;
        if (this.isHTTPS && curl.indexOf('https') < 0) {
         curl = curl.replace('http', 'https');
        }
        api.get(curl).then((data) => {
          let catList = data.data;
          that.eleList.splice(0,that.eleList.length);//清空数组
          that.eleList.push(catList);
          let less = that.queryFavorite();
          console.log(less);
          if (that.queryFavorite()){
            this.sc = true;
          }else {
            this.sc = false;
          }
        }, (response) => {
          console.log("获取详情页数据失败");
        })
      },
      init(){
        let curl;
        if (this.$route.query.jsonUrl) {
          curl = this.$route.query.jsonUrl + this.behindParams;
          this.childrenUrl = this.$route.query.jsonUrl;
        } else {
          if(this.jsonUrl){
            this.childrenUrl = this.jsonUrl;
            curl = this.jsonUrl + this.behindParams;
            localStorage.setItem('hot',this.jsonUrl);
          } else {
            curl = localStorage.getItem('hot') || '';
//            console.log(curl);
            this.childrenUrl = curl;
            curl+=this.behindParams;
          }
        }
        this.getDetail(curl);
      },
      /**
       * 查看收藏
       * @param {assetId,specialId} params
       * assetId:资产id
       * specialId:专题id
       */

      keyCode(params) {
        // console.log("父组件接收子组件触发事件传上来的值");
        if (params == "down") {
          this.down();
        } else if (params == "up") {
          this.up();
        } else if (params == "left") {
          this.left();
        } else if (params == "right") {
          this.right();
        } else if (params == "KeyEnter") {
          this.KeyEnter();
        } else if (params == "KeyBack") {
          this.KeyBack();
        }
      },
      KeyBack() {
        this.isShow = false;
         if(this.$route.query.jsonUrl!=undefined){
          console.log("详情页从外部打开");
          yh.back();
        }else{
          this.$router.go(-1);
        }
      },
      KeyEnter(){
        if(this.itemnum==-1) {
          if (!this.sc) {
            this.sc = true;
            let Tvsc =
              {
                specialId: this.eleList[0].specialId,
                assetName: this.eleList[0].specialName,
                assetType: "Category",
                assetImg: this.eleList[0].coverimage,
                episodes: "",
                broadcast: "",
                score: "",
                coverimage: this.eleList[0].coverimage,
                specialName: this.eleList[0].specialName,
                layout: "",
                layoutUrl: this.jsonUrl
              }
            let storage = localStorage.getItem('PersonMovies');
            if (storage) {
              storage = JSON.parse(storage);
            } else {
              storage = [];
            }
            storage.push(Tvsc);
            localStorage.setItem('PersonMovies', JSON.stringify(storage));
            this.Coll();
          } else {
            this.sc = false;
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
        if (this.itemnum>=0){
          let url = this.eleList[0].elementList[this.number].jsonUrl;
          this.catid = this.eleList[0].elementList[this.number].elementId;
          this.categoryCilck();
          this.$router.push({name:"detail",params:{jsonUrl:url,catCode:this.traceType,catId:this.tra,parent:8,parentId:this.pageId}});
        }
      },
      queryFavorite(){
        let storage = JSON.parse(localStorage.getItem('PersonMovies'));
        console.log(storage);
        let spciId = this.eleList[0].specialId;

        if (storage) {
          for (let i = 0; i < storage.length; i++) {
            if (storage[i].specialId == spciId) {
              return true;
            }
          }
        } else {
          return false;
        }
      },
      getitem(){
        let acclength = this.eleList[0].elementList.length;
        this.listnum = Math.ceil((acclength)/6);
        console.log(this.listnum);
      },
      down() {
        this.getitem();
        this.itemnum++;
        if (this.itemnum ==0){
          this.number = 0;
          $('.btn-sc').removeClass('color');
          this.addCss();
        }else {
          if (this.itemnum<=this.listnum-1) {
//            $('.down-silde').css({'transition': 'all 0.4s', 'transform': 'translateY(-'+ 320*this.itemnum +'px)'});
            $('.down-silde').stop(false,true).animate({'top': '-='+ 320*this.itemnum},100);
            $('.header').fadeOut(200);
            this.removeCss();
            this.number += 6;
            this.addCss();
          } else {
            if (!this.isEnd) {
              this.removeCss();
              this.addCss();
            }
          }
        }
        if(this.itemnum>this.listnum-1) {
          this.itemnum = this.listnum-1;
        };
//        console.log(this.itemnum);
      }, up() {
        this.getitem();
        this.itemnum--;
        this.removeCss();
        if (this.itemnum ==-1){
          this.number = -6;
          $('.btn-sc').addClass('color');
        }else {
//          $('.down-silde').css({'transition': 'all 0.4s', 'transform': 'translateY(-'+ 320*this.itemnum +'px)'});
          $('.down-silde').stop(false,true).animate({'top': '0'},100);
          $('.header').fadeIn(200);
          if (this.number > 5) {
            this.number -= 6;
            this.addCss();
          }
        }
        if(this.itemnum<-1) {
          this.itemnum=-1;
        };
//        console.log(this.itemnum);
      }, left() {
        this.getitem();
        if (this.number == 0 || this.number == 6 || this.itemnum == -1) return;
        this.removeCss();
        this.number--;
        this.addCss();
      }, right() {
        this.getitem();
        if (this.number == 5 || this.number == 11 || this.itemnum ==-1) return;
        this.removeCss();
        this.number++;
        this.addCss();
      }, addCss() {
        $('#play_' + this.index + "_" + this.number + '').removeClass('hover');
        $('#play_' + this.index + "_" + this.number + '').addClass('hover');
        $('#play_' + this.index + "_" + this.number + ' .mask').css('width','152px')

      }, removeCss() {
        $('#play_' + this.index + "_" + this.number + '').addClass('hover');
        $('#play_' + this.index + "_" + this.number + '').removeClass('hover');
        $('#play_' + this.index + "_" + this.number + ' .mask').css('width','160px')

      },
      ds() {
        setInterval(function () {
          var date = new Date();
          var h = date.getHours(); //获取小时
          var m = date.getMinutes(); //获取分钟
          if (h<10){
            $('.time').text('0' +h +':'+  m );
          }else {
            $('.time').text(h +':'+  m  );
          }
          if (m<10){
            $('.time').text(h + ':0' + m );
          }else {
            $('.time').text(h + ':' + m );
          }
        }, 1000)

      },
      Coll(){
        try {
          let pageId = this.eleList[0].specialId;
          console.log(this.eleList);
          let traceId = "|" + this.catId + "|" + pageId;
          let traceType = "|" + this.catCode + "|8|";
//        bp.collect = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id, cat_id, asset_id, collect_type, type)
          bi.collect(traceId, traceType, 8, pageId, this.catCode, this.catId, 1, this.catId, pageId, 0, 1);
        }catch (error) {
          console.log(error);
        }
      },
      NoColl(){
        try {
          let pageId = this.eleList[0].specialId;
          console.log(this.eleList);
          let traceId = "|" + this.catId + "|" + pageId;
          let traceType = "|" + this.catCode + "|8|";
//        bp.collect = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id, cat_id, asset_id, collect_type, type)
          bi.collect(traceId, traceType, 8, pageId, this.catCode, this.catId, 1,this.catId, pageId, 0, 2);
        }catch (error) {
          console.log(error);
        }
      }
    },
    computed:{
       ...mapGetters([
        'rootPath',
        'catList',
        'category',
        'behindParams',
        'isHTTPS',
       'startTime',
       'httpRequestTime',
       'httpResponseTime'
      ])
    },
    beforeRouteLeave(to, from, next){
      try {
        let pageId =this.eleList[0].specialId;
        console.log(this.eleList);
        let traceId = "|"+this.catId+"|"+pageId;
        let traceType = "|"+this.catCode+"|8|";
        console.log("开始时间被重置"+StartTime);
        let overTime = 0;
        overTime =  new Date().getTime() - this.httpResponseTime;
        bi.closPage(traceId,traceType,8,pageId,this.catCode,this.catId,1,overTime);
        console.log(traceId,traceType,8,pageId,this.catCode,this.catId,1,overTime);
        console.log("页面停留时间："+overTime);
      } catch (error) {
        console.log(error);
      }finally{
        next();
      }
    }
  }
</script>
