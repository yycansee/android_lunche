<!--重用详情页-->
<template>
  <div class="box">

    <div class="scroll-box">
      <p class="time"> </p>
      <component v-for="(item,index) in child" :is="item.ele" :key="index" v-on:pressDown="keepDo"
                 v-on:eleScroll="changeHeight" v-on:alertM="openMsg" ref="childDo" :initData="item.initData" :jsonUrl="childrenUrl" :catId="traceId"
    :catCode="traceType" :parent="3" :parentId="pageId" :backIng="backIng"></component>
    </div>
    <description ref="description" :isAlert="alertMsg" v-on:press="kDo"></description>
    <!--<LFirm v-if="ShowLFirm"></LFirm>-->

  </div>
</template>
<style scoped="detail">
  .time{
    font-size: 20px;
    float: right;
    margin-right: 60px;
    line-height: 60px;
    position: absolute;
    right: 50px;
    top: -50px;
    color: rgba(255,255,255,0.7);
  }
  .box{
    background: linear-gradient(to bottom,#A8977C 0,#A8977C 100%);
    position: relative;
    width: 1280px;
    height: 720px;
    overflow: hidden;
  }
  .box .scroll-box{
    margin-left: 83px;
    margin-top: 80px;
    width: 1200px;
    position: absolute;
    transform:inherit;
  }
  .time{
    font-size: 20px;
    float: right;
    margin-right: 60px;
    line-height: 60px;
    position: absolute;
    right: 40px;
    top: -60px;
    color: rgba(255,255,255,0.7);
  }
</style>
<script>
  import CryptoJS from 'crypto-js'
  import c from '../../js/common.js'
  import {authFunction as auth} from '../../js/auth.js'
  import movie_top from '../detail/movie_top.vue'
  import Movie_assetList from '../detail/Category_Movie_assetList.vue'
  import Movie_actorList from '../detail/Category_Movie_actorList.vue'
  import itemList from '../detail/Category_Movie_itemList.vue'
  import ption from '../detail/ption.vue'
  import LFirm from '../../tool/Firm/Lfirm.vue'
  import seriesTop from '../detail/seriesTop.vue'
  import description from '../detail/Category_Movie_description.vue'
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../../fetch/api.js'
  import {bp as bi} from '../../js/ga.js'


  var itemNo=0;
  export default {
    props:["jsonUrl","catCode","catId","parent","parentId","backIng"],
    data() {
      return {
        currentView: '',
        currentC: 0,
        nummc:0,
        ShowLFirm:true,
        componentsName: [],
        child: [],
        componentsId: [],
        cheight:[],
        special:[],
        pageSize: 0,
        pageId:0,
        old:0,
        oldTimes:0,
        oldTime:0,
        childrenUrl:"",
        traceId:0,
        traceType:"",
        alertMsg:{
          title:"",
          msg:"",
          alert:false
        }
      }
    }, mounted() {
      let _this = this;
      setTimeout(function() {
        _this.routePayUrl();
      }, 100)
    },
    created() {
      this.init();
    },updated(){

    },
    methods:{
      routePayUrl(){
        const tryView = this.$route.query.tryView;
        let code = '21100001000000021522201686137001';
        let token = localStorage.getItem('temptoken');
        let type = localStorage.getItem('adorignal');
        let mac = localStorage.getItem('admac');
        let ipUrl = localStorage.getItem('adiaspip');
        let useId = localStorage.getItem('iaspuserid');
        auth.payUrl(code,token,type,mac,ipUrl,useId).then((jsonData) => {
          console.log("支付页面:", jsonData);
          let urls = jsonData.payUrl;
          localStorage.setItem('payUrl',urls);
          if(tryView ==1){
            window.location.href = urls;
          }
          console.log(urls);
        }).catch(() => {
          console.log('支付页面请求超时');
        });
      },
//      getUse(){
//        let useGet = localStorage.getItem('usehf').user_paylockstatus;
//        let usePost = localStorage.getItem('usejq');
//        if(useGet ==2){
//          console.log('黑名单用户不可订阅');
//        }else if(useGet ==1){
//          console.log("白名单用户");
//        }else {
//          console.log("具备订购条件");
//          if(usePost == 0){
//            console.log('用户未登录');
//            this.$router.push({name:"Detail"});
//          }else if(usePost ==1){
//            console.log('未订购试看5分钟');
//            // 广联产品名称,用户token,播放类型 供应商ID,机顶盒mac地址,设备IP地址
//
//          }else if(usePost ==2){
//            console.log('通过订购');
//            this.plays();
//          }
//        }
//      },
      getTanZheng(){
        this.$nextTick(()=>{
          let adiaspip = localStorage.getItem('adiaspip');
          if(adiaspip=="undefined"||adiaspip==undefined){
            adiaspip = "";
          }
          let addevicetoken = localStorage.getItem('iaspuserid');
          let adorignal = localStorage.getItem('adorignal');
          let admac = localStorage.getItem('admac');
          let admacs = localStorage.getItem('admacs');
          let adtemptoken = localStorage.getItem('temptoken');
          let adnickName ='yanhuaTV';
          let adpageID = 'Detail';
          let adoperationType = 'xiangqing';
          let timestamp =new Date().getTime();
          let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() + ':';
          let s = date.getSeconds();
          let adtimestemp = Y+M+D+h+m+s;
          let toutf_8 = adiaspip+'|'+adtemptoken+'|'+addevicetoken+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+admac+'|'+admacs+'|'+''+'|'+adtimestemp;
          let adparams=auth.Base64encode(auth.utf8(toutf_8));
          console.log(adparams+'探针');
          console.log(adiaspip+'|'+adtemptoken+'|'+addevicetoken+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+admac+'|'+admacs+'|'+''+'|'+adtimestemp);
          let adlog='http://218.24.37.2/templets/epg/spstatistics.jsp?param='+adparams;
          $.ajax({url:adlog,async:true});
        })
      },
      load(){
        //埋点大数据
        if(this.nummc<2){
          this.oldTime =performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart;
          console.log(this.oldTime+'=====页面第一次加载时间');
        }
        this.pageId = this.special.assetId;
        this.traceId = this.catId+"|"+this.pageId;
        this.oldTimes = (new Date()).valueOf();
        this.traceType = this.catCode+"|3|";
        console.log(this.pageId+'=====this.pageId进入刷新ID');
//      bp.loadPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id,special_type,oldTime)
        bi.loadPage(this.traceId,'',31,this.pageId,'','','',this.oldTime);
        console.log('信息流'+this.traceId,this.traceType,31,this.pageId,this.parent,this.parentId,0,this.oldTime);
      },
      closPages(){
        //      // 离开页面（页面停留时间）
//      bp.closPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id, special_type, oldTime)
        let time = (new Date()).valueOf();
        let times = time - this.oldTimes;
        this.pageId = this.special.assetId;
        this.traceId = "|"+this.catId+"|"+this.pageId;
        this.traceType = "|"+this.catCode+"|3|";
        console.log(this.pageId+'=====this.pageId退出刷新ID');
        console.log('this.old电影退出停留本页面时间===='+times);
        bi.closPage(this.traceId,this.traceType,31,this.pageId,this.parent,this.parentId,0,this.oldTimes);
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
            localStorage.setItem('address',this.jsonUrl);
          } else {
            curl = localStorage.getItem('address') || '';
            this.childrenUrl = curl;
            curl+=this.behindParams;
          }
        }
        this.getDetail(curl);
      },
      keepDo(bl, name, pos,url) {
        let childComponents = this.$refs.childDo;
        let componentsSize = childComponents.length;
        for (let i = 0; i < childComponents.length; i++) { //遍历组件ref 给对应的组件排序
          if (name == childComponents[i].name) {// 当对应组件上下没有焦点时会抛出控制权，此时父组件需要根据子组件抛出的信息来决定控制权交给其他父组件
            let _num = this.componentsId.indexOf(name);
            if (pos == "down") {
              if(_num==componentsSize) {
                this.getChildRef(name).updateStast(true, pos, true);
              }else{
                let _cdown = this.componentsId[_num+1];
                this.getChildRef(_cdown).updateStast(true, pos, false);
              }
            } else if (pos == "up") {
              if (_num == 0) {
                $('.scroll-box').animate({'top': '0px'},100);
              } else {
                  let _cdown = this.componentsId[_num-1];
                  this.getChildRef(_cdown).updateStast(true, pos, false);
              }
            }
            if(pos=='KeyEnter'){
              this.childrenUrl = url;
              console.log(url+'获得的url');
              this.getDetail(url+this.behindParams);
              if (this.child[0].initData.data.itemList[1]){
                childComponents[1].updateStast(true, pos, false);
                $('.scroll-box').stop(false,true).animate({'top':'0px'},100);
                this.pageSize = 1;
                this.cheight = [];
              }else if(this.child[0].initData.data.assetType=="Series"){
                childComponents[1].updateStast(true, pos, false);
                $('.scroll-box').stop(false,true).animate({'top':'0px'},100);
                this.pageSize = 1;
                this.cheight = [];
              }else{
                childComponents[0].updateStast(true, pos, false);
                $('.scroll-box').stop(false,true).animate({'top':'0px'},100);
                this.pageSize = 0;
                this.cheight = [];
              }
            }
            break; // 找到组件需终止循环foreach则不会，需要抛异常才会终止
          }
        }
      },
      getChildRef(id){// 根据元素ID查找ref中的组件
        let childComponents = this.$refs.childDo;
        for(let i=0;i<childComponents.length;i++){
          if(id==childComponents[i].name){
            return childComponents[i];
          }
        }
      }
      ,kDo(bl,name,pos){
        let childComponents = this.$refs.childDo;
        if (pos=='KeyBack') {
          childComponents[0].updateStast(true, 'up',false);
        }
      },
//      滚动方法
      changeHeight(name, pos, height) {
        if(pos=='down'){
          if(height>710){
            let _temp = height-700;
            this.cheight.push(_temp);
            $('.scroll-box').stop(false,true).animate({'top': '-='+_temp},100);
            this.pageSize++;
          }
        }else if(pos=='up'){
          if(this.pageSize == 0){
            this.pageSize=0;
             $('.scroll-box').stop(false,true).animate({'top':'0px'},100);
          }else {
            this.pageSize -= 1;
            $('.scroll-box').stop(false,true).animate({'top':'+='+this.cheight[this.pageSize]},100);
            this.cheight.splice((this.pageSize),1);
          }
        }
      },
      openMsg(obj){
        this.alertMsg = obj;
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
//      页面获取数据
      getDetail(curl){
        if(this.nummc>=1){
          let time = (new Date()).valueOf();
          let times = time - this.oldTimes;
          this.pageId = this.special.assetId;
          this.traceId = "|"+this.catId+"|"+this.pageId;
          this.traceType = "|"+this.catCode+"|3|";
          console.log(this.pageId+'=====this.pageId退出刷新ID');
          console.log('this.old电影未退出停留本页面时间===='+times);
          bi.closPage(this.traceId,this.traceType,31,this.pageId,this.parent,this.parentId,0,this.oldTimes);
        }
        this.old = (new Date()).valueOf();
        let that = this;
        if(this.isHTTPS && curl.indexOf('https')<0 ){
            curl =  curl.replace('http','https');
        }
        api.get(curl).then((response)=>{
          let that =this;
//          let timeSs = performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart;
//          console.log(timeSs+'假造加载时间');
//          if(timeSs>2000 || timeSs == 0){
//            timeSs = 2000;
//          }

//          setTimeout(function () {
//          },timeSs);
          let components = [];
          let componentsName = [];
          that.special= response.data;
          let specialList = response.data;
          let assetType = specialList.assetType;
          if (assetType == 'Series') {
            //          判断是否为电视剧页
            components.push({ele: 'seriesTop', initData: response})
            componentsName.push('seriesTop');
            components.push({ele: 'ption', initData: response})
            componentsName.push('ption');
            if (specialList.actorList[0]) {
              components.push({ele: 'Movie_actorList', initData: response})
              componentsName.push('Movie_actorList');
            }
            if (specialList.assetList[0]) {
              components.push({ele: 'Movie_assetList', initData: response})
              componentsName.push('Movie_assetList');
            }
            that.child = components;
            that.componentsId = componentsName;
          } else {
            //非电视剧页
            components.push({ele: 'movie_top', initData: response})
            componentsName.push('movie_top');
            if (specialList.itemList[1]) {
              components.push({ele: 'itemList', initData: response})
              componentsName.push('itemList');
            }
            if (specialList.actorList[0]) {
              components.push({ele: 'Movie_actorList', initData: response})
              componentsName.push('Movie_actorList');
            }
            if (specialList.assetList[0]) {
              components.push({ele: 'Movie_assetList', initData: response})
              componentsName.push('Movie_assetList');
            }
            that.child = components;
            that.componentsId = componentsName;

          }
          this.nummc ++;
          if(this.nummc>1){
            let time = (new Date()).valueOf();
            that.oldTime = time-that.old;
            console.log(that.oldTime+'=====页面第二次加载时间');
          }
        that.$nextTick(function(){
          this.$loading.close();
          if (this.child[0].initData.data.itemList[1]==undefined){
            if(this.child[0].initData.data.assetType!='Series'){
              setTimeout(() => {
                this.$refs.childDo[0].updateStast(true, "indown", true);
              }, 0);
            }
          }
        })
        },(response)=>{
            console.log("获取详情页数据失败");
        })
      }
    },
    computed: {
      ...mapGetters([
        'category',
        'behindParams',
        'isHTTPS'
      ])
    },
    components: {
      movie_top,Movie_actorList,Movie_assetList,itemList,ption,seriesTop,description
    },
    beforeDestroy: function () {
      console.group('beforeDestroy 销毁前状态电影===============》');
      this.closPages();
    },
    watch:{
      special(){
        this.$nextTick(function(){
          this.ShowLFirm = false;
          this.load();
          this.getTanZheng();
        })
      }
    }
  }
</script>
