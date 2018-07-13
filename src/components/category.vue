<template>
  <div class="box">
    <div class="scroll-box">
      <p class="time"></p>
      <div id="sliderSegmentedControl"
           class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <div class="mui-scroll">
          <a  v-for="(item,index) in navBar" ref='navItem' :class="{'mui-control-item':true,'mui-active':index===isActive,'mui-select':index===isSelect}" :catCode="item.catCode" :key="item.id" :index="index" >
            {{item.catName}}
          </a>
        </div>
         <div class="systembar">
          <ul>
            <li :class="{'hover':position==1&&sNo==0,'select':0==sNo&&position==1}" id="p0"><i class="iconfont icon-soushuo"></i> 搜索</li>
            <li :class="{'hover':position==1&&sNo==1,'select':1==sNo&&position==1}" id="p1"><i class="iconfont icon-lishi"></i> 历史</li>
            <li :class="{'hover':position==1&&sNo==2,'select':2==sNo&&position==1}" id="p2"><i class="iconfont icon-shoucang"></i> 收藏</li>
          </ul>
        </div>
        <keyDo v-on:listenKeyCode="keyCode" v-if="isShow"></keyDo>
      </div>
        <router-view  ref="childContent" v-on:navigation="IsNav" :categoryData="currentData" :focusId = "navBar[itemNo].catId" :lastId="lastId"></router-view>
    </div>
    <firm ref="firm" v-on:listernpopup="firm" ></firm>
  </div>
</template>
<style scoped="category">
  .boxtwo{
    width: 1280px;
    height: 100px;
    position: absolute;
    left: 0px;
    top: 0px;
    color: black;
    background: rgba(255,255,255,0.3);

  }
  .boxtwo1{
    width: 1280px;
    height: 100px;
    position: absolute;
    left: 0px;
    top: 100px;
    color: black;
    background: rgba(255,255,255,0.3);
  }
  .box {
    position: absolute;
    width: 1195px;
    padding-top: 57px;
    padding-left: 85px;
    height: 663px;
    overflow: hidden;
    background-color: #A8977C;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .scroll-box {
    position: relative;
  }
  .mui-slider-indicator.mui-segmented-control {
    position: relative;
    bottom: auto;
    padding-left: 12px;
  }

  .mui-segmented-control.mui-scroll-wrapper {
    height: 70px;
    line-height: 70px;
  }
  .mui-segmented-control {
    font-size: 24px;
    font-weight: 400;
    position: relative;
    display: table;
    overflow: hidden;
    table-layout: fixed;
    border-radius: 3px;
    background-color: transparent;
  }

  .mui-scroll-wrapper {
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
  }
  .mui-segmented-control.mui-segmented-control-inverted {
    position: relative;
    overflow: hidden;
    border-radius: 0;
  }
  .mui-segmented-control.mui-scroll-wrapper .mui-scroll {
    height: 47px;
    white-space: nowrap;
    display:inline-block;
  }
  .systembar{
    height: 39px;
    line-height: 39px;
    width: 360px;
    float:right;
  }
  .systembar li{
    list-style: none;
    float: left;
    padding: 0 10px;
    background-color: rgba(255,255,255,0.2);
    margin-right: 1px;
  }
  .systembar li.hover{
    background-color: #A36363;
  }
  .systembar li:nth-child(1){
    border-radius: 9px 0px 0px 9px;
  }
  .systembar li:nth-child(3){
    border-radius: 0px 9px 9px 0px;
  }
  .mui-scroll {
    position: absolute;
    z-index: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item {
    color: inherit;
  }


  .mui-segmented-control{
    padding-left: 6px;
  }

  .mui-segmented-control.mui-scroll-wrapper .mui-control-item {
    display: inline-block;
    width: auto;
    padding: 0 30px;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 39px;
    display: table-cell;
    overflow: hidden;
    width: 1%;
    -webkit-transition: background-color .1s linear;
    transition: background-color .1s linear;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;
    border-radius: 5px;
    background: 0 0;
  }

  .mui-control-item.mui-active,systembar li.active {
    background-color: #A36363;
    border:4px solid #FFF;
    margin: -3px -3px -3px -3px;
    box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
  }

  .mui-control-item.mui-select {
    background: rgba(255, 255, 255, 0.431);
    border: 1px solid #ffffff;
    border-radius: 5px;
  }
  .select {
    background: rgba(255, 255, 255, 0.40);
    border-radius: 5px;
  }
  .time{
    font-size: 20px;
    float: right;
    margin-right: 40px;
    line-height: 60px;
    position: absolute;
    right: 50px;
    top: -55px;
    color: rgba(255,255,255,0.7);
    height: 30px;
    width: 50px;
  }
  #urlId{
    width: 1100px;
    height: 600px;
    color: black;
    word-wrap:break-word;
    border: 1px solid black;
  }

</style>
<script>
  import c from '../js/common'
  import {mapGetters} from 'vuex'
  import {client as yh} from '../js/client.js'
  import {HTTPUtil as api} from '../fetch/api.js'
  import {bp as bi} from '../js/ga.js'
  import firm from '../page/firm.vue'
  import {authFunction as auth} from '../js/auth.js'
  export default {
    name:'category',
    data: function () {
      return {
        name:'category',
        itemNo: 0,
        sNo:-1,
        EPGDomain:'',
        else:true,
        nummtt:0,
        position: 0,
        count: 0,
        navBar: [{catId:''}],
        isShow:true,
        currentData:{},
        isActive:0,
        isSelect:-1,
        lastId:0,
      }
    }, mounted() {
       if (!c.isAllNull(c.getLocal("Home"))){
          this.navBar = this.category;
          let cData = this.filtrateRouter(this.itemNo);
          this.currentData = cData;
       }
        bi.openApp(); // bi数据埋点
        c.startTime();
        console.log("岩华TV精选版");
        console.log("组件初始化完成");
        console.log("组件模块加载完毕...");
        console.log("懒加载初始化开始");
        console.log("版本:v1.1.03");
        console.log("终端信息:"+window.navigator.appVersion);
        console.log("userAgent:"+window.navigator.userAgent);
        // api.ajax('/yh/',"").then((json)=>{
        //   console.log(json);
        // })
//        let JSONUrlId = window.location.href;
//        $('#urlId').html(JSONUrlId);
//        localStorage.setItem('urlIID',JSONUrlId);
//        let useId = this.getUrlJson();
//        let timestamp= new Date().getTime();
//        let riddle =
//        let url = 'http://winnow-bds.yanhuamedia.tv/AAA?userid='+useId+'&time='+timestamp+'&riddle=bf8f27b7c7f2353a6a15768a7c3242bc'

    },

    activated(){
     // console.log("keep-alive 组件被激活");
    }, created() {
      if (c.isAllNull(c.getLocal("Home"))) {
        let _this = this;
        console.log("rootPath:"+this.rootPath);
        let _h = this.rootPath.indexOf('https');
        if( _h >= 0){
            this.$store.commit('GET_ISHTTPS',true);
            localStorage.setItem("ISHTTPS", true);
        }
        api.getTheme(this.rootPath).then((json) => {
          console.log("获取主题数据成功"+JSON.stringify(json));
          _this.$store.commit('GET_PROGRAMA', json.data);
          localStorage.setItem("Home", JSON.stringify(json.data));
          var _cjson = _this.catList.jsonUrl;
          if (!c.isAllNull(_cjson)) { // 获取成功以后立马获取二级栏目数据
            if(_this.isHTTPS && _cjson.indexOf('https')<0 ){
              _cjson =  _cjson.replace('http','https');
            }
            let curl =  _cjson + this.behindParams;
            api.get(curl).then((json)=>{
              if (200 == json.code || "200" == json.code) {
                  console.log("获取二级栏目数据成功:" + json.data.catList);
                  _this.navBar = json.data.catList;
                  _this.$store.commit('GET_CATEGORY', json.data.catList)
                  localStorage.setItem("Category", JSON.stringify(json.data.catList));
                  _this.$nextTick(function () {
                    $('.mui-control-item').eq(this.itemNo).addClass('mui-active');
                    _this.currentData = this.filtrateRouter(this.itemNo);
                  })
                }
                console.log("初始化主题及栏目数据成功,写入缓存成功");
            },(json)=>{
                console.log("请求二级栏目数据失败",json);
            })
          }

         },(json)=>{
           console.log("请求主题数据失败",json);
        });
      } else {
        console.log("use cache");
      }
      this.ds();
      setTimeout(()=>{
        this.getTanZheng();
      },3000)
    }, computed: {
      ...mapGetters([
        'rootPath',
        'catList',
        'category',
        'isHTTPS',
        'behindParams'
      ])
    },
    methods: {
      getTanZheng(){
        this.$nextTick(()=>{
          let mee = localStorage.getItem('adiaspip');
          if(!mee){
            const adiaspip = this.$route.query.iaspip;
            const adorignal = this.$route.query.providerid;
            const admacs = this.$route.query.iaspmac;
            let admac;
            if(adorignal=='zx'){
              admac = 5;
            }else {
              admac = 6;
            }
            localStorage.setItem('adiaspip',adiaspip);
            localStorage.setItem('adorignal',adorignal);
            localStorage.setItem('admac',admac);
            localStorage.setItem('admacs',admacs);
            const addid = localStorage.getItem('iaspuserid');
            let adtemptoken = localStorage.getItem('temptoken');
            let adnickName ='yanhuaTV';
            let adpageID = 'category';
            let adoperationType = 'shouye';
            let timestamp =new Date().getTime();
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            let adtimestemp = Y+M+D+h+m+s;
//           +'|'+adcontentName+'|'+adadType+'|'+adplateID+'|'+adpositionID+'|'+adoperationType+'|'+adkeyword+'|'+adorignal+'|'+admac+'|'+adprotal+'|'+adtimestemp
            let adparams=auth.Base64encode(auth.utf8(adiaspip+'|'+adtemptoken+'|'+addid+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+admac+'|'+admacs+'|'+''+'|'+adtimestemp));
            console.log(adparams+'探针');
            console.log(adiaspip+'|'+adtemptoken+'|'+addid+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+admac+'|'+admacs+'|'+''+'|'+adtimestemp);
            let adlog='http://218.24.37.2/templets/epg/spstatistics.jsp?param='+adparams;
            $.ajax({url:adlog,async:true});
          }else {
            const addid = localStorage.getItem('iaspuserid');
            const adiaspip = localStorage.getItem('adiaspip');
            const adorignal = localStorage.getItem('adorignal');
            let admacs = localStorage.getItem('admac');
            let admac;
            if(admacs=='zx'){
              admac = 5;
            }else {
              admac = 6;
            }
            let adtemptoken = localStorage.getItem('temptoken');
            let adnickName ='yanhuaTV';
            let adpageID = 'category';
            let adoperationType = 'shouye';
            let timestamp =new Date().getTime();
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            let adtimestemp = Y+M+D+h+m+s;
            let adparams=auth.Base64encode(auth.utf8(adiaspip+'|'+adtemptoken+'|'+addid+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+adorignal+'|'+admac+'|'+''+'|'+adtimestemp));
            console.log(adparams+'探针');
            console.log(adiaspip+'|'+adtemptoken+'|'+addid+'|'+adnickName+'|'+adpageID+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+''+'|'+adoperationType+'|'+''+'|'+adorignal+'|'+admac+'|'+''+'|'+adtimestemp);
            let adlog='http://218.24.37.2/templets/epg/spstatistics.jsp?param='+adparams;
            $.ajax({url:adlog,async:true});
          }
        })
      },
      keyCode(kc) {
        if (kc == "KeyBack") {
          this.back();
        } else if (kc == 'left') {
          this.nummtt--;
          $('.boxtwo').text(this.nummtt);
          $('.boxtwo1').text(this.nummtt);

          this.left();
        } else if (kc == 'right') {
          this.nummtt++;

          $('.boxtwo').text(kc);
          $('.boxtwo1').text(this.nummtt);

          this.right();
        } else if (kc == 'down') {
          this.down();
        }else
          if(kc == 'KeyEnter') {
          console.log(this.position);
          if (this.position == 1) {
            if (this.sNo == 0) {
             // yh.search();
             this.$router.push({name:'search',params:{type:"search",catId:this.navBar[this.itemNo].catId,catCode:2}});
            } else if (this.sNo == 1) {
//              yh.history();
              this.$router.push({name:'History',params:{type:"history",catId:this.navBar[this.itemNo].catId,catCode:6}});
            } else if (this.sNo == 2) {
//              yh.favorite();
              this.$router.push({name:'History',params:{type:"favorite",catId:this.navBar[this.itemNo].catId,catCode:5}});
              /////暂时
              // 修改
            }
          }
        }
      }, back() {
        //this.$router.go(-1);
        this.$refs.firm.updateStast(true);
        this.isShow = false;
      },

      left(){
        if(this.position==0){
            this.lastId = this.navBar[this.itemNo].catId;
            this.itemNo--;
            if (this.itemNo < 0) {
              this.itemNo = 0;
            }
            this.$lazyImages.removeAll();
        }else if(this.position==1){
             if(this.sNo==0){
                this.position = 0;
                this.isActive = 5;
                this.sNo = -1;
             }else{
               this.sNo--;
             }
          }
      }, right() {
        if(this.position==0){
          if (this.itemNo >= 5){
            this.isActive = -1;
            this.position = 1;
            this.sNo = 0;
          }else{
            this.lastId = this.navBar[this.itemNo].catId;
            this.itemNo++;
            this.$lazyImages.removeAll();
          }
        }else if(this.position==1){
          if(this.sNo>1)return;
            this.sNo++;
        }
      }, down() {
        if (this.sNo <0 ){
          this.isSelect = this.itemNo;
        }
        this.isActive  = -1;
        $('.systembar ul li').removeClass('hover');
        this.isShow = false;
        this.$refs.childContent.updateStast(true, "down", false);
      },IsNav(name, pos, show){
        //console.log("接收子组件上传的pos");
        this.isShow = show;
        this.isSelect = -1;
        if(this.sNo==-1){
           this.isActive = this.itemNo;
        }
        $('.select').addClass('hover');
      },filtrateRouter(catCode){
        for(let i=0;i<this.navBar.length;i++){
            if(catCode == i){
               return this.navBar[i];
            }
        }
      },changeIsActive(index){
        if(this.position==0){
          this.isActive  = index;
          let _this = this;
          setTimeout(() => {
            _this.currentData = _this.filtrateRouter(_this.itemNo);

          }, 300);
        }
      },
     OnKeyBack() {
      this.EPGDomain = '';
      if ('CTCSetConfig' in Authentication) {
        this.EPGDomain = Authentication.CTCGetConfig("EPGDomain");
      } else {
        this.EPGDomain = Authentication.CUGetConfig("EPGDomain");
      }
      parent.location.href = this.EPGDomain;
    },
      firm(bl){
        if (bl){// 退出应用
          let st = new Date().getTime();
          let end = st - c.getAppStartTime();
          bi.closeApp(this.navBar[this.itemNo].catId,end);
          this.OnKeyBack();
        }else {
          this.isShow = true;
        }
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
      }
    },
    components: {
        firm
    },watch:{
        itemNo(){
          this.changeIsActive(this.itemNo);
        },navBar(){

        },currentData(){

        }
    }
  }
</script>
