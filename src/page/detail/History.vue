<!--重用历史收藏页-->
<template>
  <div class="box">
      <Historical ref="Historical" :type="type" v-on:pressLeft="letLeft" :json="childJson"></Historical>
      <Hright ref="Hright" v-on:pressLeft="letLeft" :json="childJson" v-if="isHright" :catId="catId" :catCode="catCode"></Hright>
      <Historytime ref="Historytime" v-on:pressLeft="letLeft" :json="childJson" v-if="isHTime" :catId="catId" :catCode="catCode"></Historytime>
      <p class="time"></p>
      <HistoryFirm ref="HistoryFirm" v-on:listernpopup="firm"></HistoryFirm>
  </div>
</template>
<style scoped="HIstory">
  .time{
    font-size: 20px;
    float: right;
    margin-right: 60px;
    line-height: 60px;
    position: absolute;
    right: 0px;
    top: 0px;
    color: rgba(255,255,255,0.7);
  }
  .box{
    background: #A8977C;
    position: relative;
    width: 1280px;
    height: 720px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .box:after{
    clear: both;
    content: '';
    display: block;
  }
  .cs{
    color: black;
    width: 200px;
    height: 300px;
    float: left;
  }
  #divcs{
    background: yellow;
  }
</style>
<script>
  import Historical from '../../page/detail/Historical.vue'
  import Hright from '../../page/detail/History_right_collect.vue'
  import Historytime from '../../page/detail/Historytime.vue'
  import HistoryFirm from '../../page/detail/History_firm.vue'
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../../fetch/api.js'
  import {client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'

  var itemNo=0;
  export default {
    props:['type','catId','catCode'],
    data() {
      return {
        currentView: '',
        currentC: 0,
        childJson:[],
        isHright:true,
        isHTime:false,
        traceType:'',
        pageType:0,
        oldTime:0,
        focusId:'',
      }
    },mounted(){
//      yh.queryFavorites();
//      let jsonUrl  = yh.queryFavorites();

      this.$nextTick(function() {
          this.$lazyImages.loadImage();
        })
    },
    created() {
      this.ds();
      this.load();
    },
    activated(){

    },
    methods:{
      load(){
        this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
        this.traceId = "|"+this.catId+"|"+'0';
        this.traceType = "|1|"+this.catCode+"|";
//        this.pageType = 4;
        this.oldTime =performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart;
        console.log(this.oldTime+'=====页面加载时间');
        //      bp.loadPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id,special_type,oldTime)
        bi.loadPage(this.traceId ,this.traceType,this.catCode,0,1,this.traceId ,'',this.oldTime);
        console.log(this.traceId ,this.traceType,this.catCode,0,1,this.traceId ,'',this.oldTime);
      },
      letLeft(bl, name, pos,url,Id,lx,type){
        if (!bl){
          if (pos == "left") {
            this.$refs.Historical.updateStast(true, pos)
          } else if (pos == "right2") {
            this.$refs.Historytime.updateStast(true, pos)
          }else if (pos =='right1'){
            this.$refs.Hright.updateStast(true, pos)
          }else if (pos =='KeyEnter'){
            this.$refs.HistoryFirm.updateStast(true, url,Id,lx,name,type)
          }
        }else {
          if (pos == 'down') {
            this.isHright = false;
            this.isHTime = true;
            console.log(this.$refs.Hright);
            this.$refs.Hright.updateStast(false, pos)
          }else if (pos == 'up') {
            this.isHTime = false;
            this.isHright = true;
            this.$refs.Historytime.updateStast(false, pos)
          }
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
      },
      firm(bl,name,pos){
        if (!bl){
          if (name =="Hright"){
            this.$refs.Hright.updateStast(true,"remove",pos);
          }else {
            this.$refs.Historytime.updateStast(true,"remove",pos);
          }
        }else {
          if (name =="Hright"){
            this.$refs.Hright.updateStast(true,"over",pos);
          }else {
            this.$refs.Historytime.updateStast(true,"over",pos);
          }
        }
      },
    },
    computed: {
      ...mapGetters([
//        'startTime',
        'httpRequestTime',
        'httpResponseTime'
      ])
    },
    components: {
      Historical,Hright,Historytime,HistoryFirm
    },
    beforeRouteLeave(to, from, next){
      try {
//        StartTime = new Date().getTime();
//        console.log("开始时间被重置"+StartTime);
        let overTime = 0;
        this.traceId = "|"+this.catId+"|"+0;
        this.traceType = "|1|"+this.catCode+"|";
        overTime =  new Date().getTime() - this.httpResponseTime;
        bi.closPage(this.traceId ,this.traceType,this.catCode,0,1,this.traceId ,'',overTime);
        console.log(this.traceId ,this.traceType,this.catCode,0,1,this.traceId ,'',overTime)
        console.log("页面停留时间："+overTime);
      } catch (error) {
        console.log(error);
      }finally{
        next();
      }
    }
  }
</script>
