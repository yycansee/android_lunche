<!--演员详情页-->
<template>
    <div class="actor">
      <div class="actor-left">
        <div class="tit">{{title}}</div>
        <div class="content">
          <img :src="eleList[0].headImg">
          <p class="actorName">{{eleList[0].actorName}}</p>
          <p class="introduce">{{eleList[0].introduce}}</p>
        </div>
      </div>
      <div class="actor-right">
        <div v-for="(item,index) in newAssetList" v-if="index>=0" :key="item.years" :id="('a'+index)" class="actor_ul">
          <div class="actor_year">
            <div></div>
            <p>{{item.years}}</p>
          </div>
          <div class="actorImgs">
            <div class="actor_img" v-for="(assert,index) in item.list" :key="assert.id" :id="('b'+index)">
              <!--<img :src="assert.assetImg" >-->
              <lazy-image
                :src='assert.assetImg'
                :placeholder='placeholder'
                :initScore = 'initScore'
                :score = "assert.score"
                :title = "assert.assetName"
                class="imgList_img"
              />
            </div>
          </div>
        </div>
      </div>
      <keyDo v-on:listenKeyCode="keyCode"  ref="keyDo"></keyDo>
    </div>
</template>
<style scoped="actor">
  .tit{
    font-size: 30px;
    color: white;
    font-weight: bold;
    margin-top: 30px;
    margin-left: 66px;
  }
  .actorImgs{
    width: 3000px;
  }
  .actor{
      width: 1280px;
      height: 720px;
      background: #A8977C;
      overflow: hidden;
  }
  .actor:after{
    clear: both;
    content: "";
    display: block;
  }
  .actor_year{
    font-size: 24px;
  }
  .actor_year:after{
    clear: both;
    display: block;
    content: '';
  }
  .actor_year div{
    width: 60px;
    height: 1px;
    background: white;
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .actor_ul{
    width: 100%;
    margin-top: 40px;
    overflow: hidden;
    height: 340px;
  }
  .actor_ul:after{
    clear: both;
    content: "";
    display: block;
  }
  .actor_img{
    width: 160px;
    height: 232px;
    margin-top: 40px;
    margin-left: 60px;
    position: relative;
    border: 1px solid rgba(255,255,255,0.5);
    float: left;
    box-sizing: border-box;
  }
  .actor_img img{
    width: 100%;
    height: 100%;
  }
  .actor_img .listname{
    font-family:PingFangSC-Regular;
    font-size:18px;
    color:#ffffff;
    text-shadow:0px 2px 4px rgba(0,0,0,0.50);
    width: 100%;
    height: 25px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    overflow: hidden; /*自动隐藏文字*/
    text-overflow: ellipsis;/*文字隐藏后添加省略号*/
    white-space: nowrap;
  }
  .actor-left{
    width: 30%;
    height: 720px;
    padding-left: 50px;
    float: left;
    box-sizing: border-box;
    box-shadow: 0 0 0 1px rgba(255, 255, 255,0.4);
  }
  .actor-right{
    width: 70%;
    float: left;
    box-sizing: border-box;
  }
  h3{
    font-size: 30px;
    color: #666666;
  }
  .actor-left .content{
    width: 70%;

  }
  .actor-left img{
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin-left: 25%;
    margin-top: 25%;
  }
  .actor-left .actorName{
    font-size: 20px;
    text-align: center;
    margin-top: 15px;
  }
  .actor-left .introduce{
    font-size: 18px;
    color: white;
    margin-top: 15px;
    text-align: center;
  }
  .actor_ul .change{
    border: 4px solid #ffffff;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);

  }

</style>

<script>
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../../fetch/api.js'
  import {client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'
  import {authFunction as auth} from '../../js/auth.js'

  var d = new Date();
  export default {
    props:['jsonUrl',"catCode","catId","parent","parentId"],
    name: 'actor',
    data () {
      return {
        isShow:true,
        num:0,
        actor:[],
        itemNo:0,
        sc:false,
        title:'明星详情',
        placeholder:require('../../assets/img_loading_160x230.png'),
        initScore:require('../../assets/corner_mark.png'),
        eleList:[
          {
            relationship: "",
            sex: "",
            headImg: "",
            assetList: [
              {
                assetName: "",
                assetImg: "",
                assetId: "",
                assetType: "",
                layout: "",
                score: "",
                year: "",
                jsonUrl:""
              }
            ],
            actorId: "",
            profession: "",
            introduce: "",
            backgroundImg: "",
            actorName:""
          }
        ],
        oldTimes:0,
        oldTime:0,
        pageId:0,
        newAssetList: [],
        tra:'',
        traceType:'',
        traceTypes:'',

      }
    },components:{

    },
    created() {
      this.init();
    },mounted(){

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
          let admac = localStorage.getItem('admac');
          let adtemptoken = localStorage.getItem('temptoken');
          let adnickName ='yanhuaTV';
          let adpageID = 'actor';
          let adoperationType = 'yanyuan';
          let timestamp =new Date().getTime();
          let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() + ':';
          let s = date.getSeconds();
          let adtimestemp = Y+M+D+h+m+s;
          let adparams = auth.Base64encode(auth.utf8(adiaspip+'|'+adtemptoken+'|'+addevicetoken+'|'+adnickName+'|'+adpageID+'|'+adoperationType+'|'+adorignal+'|'+admac+'|'+adtimestemp));
          console.log(adparams+'探针');
          console.log(adiaspip+'|'+adtemptoken+'|'+addevicetoken+'|'+adnickName+'|'+adpageID+'|'+adoperationType+'|'+adorignal+'|'+admac+'|'+adtimestemp)
          let adlog='http://218.24.37.2/templets/epg/spstatistics.jsp?param='+adparams;
          $.ajax({url:adlog,async:true});
        })
      },
      load(){
        //埋点大数据
        this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
        this.oldTime =performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart;
          console.log(this.oldTime+'埋点time演员缓存时间')
          let traceId = this.catId+"|"+this.pageId;
          this.tra = this.catId+"|"+this.pageId;
          this.traceType = this.catCode+"|11|";
  //      bp.loadPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id,special_type,oldTime)
          bi.loadPage(traceId,this.traceType,11,this.pageId,this.parent,this.parentId,0,this.oldTime);
          console.log(traceId,this.traceType,11,this.pageId,this.parent,this.parentId,0,this.oldTime);
        },
      init(){
        let curl ="";
        if (this.$route.query.jsonUrl) {
          curl = this.$route.query.jsonUrl + this.behindParams;
          this.childrenUrl = this.$route.query.jsonUrl;
        } else {
          if(this.jsonUrl){
            this.childrenUrl = this.jsonUrl;
            curl = this.jsonUrl + this.behindParams;
            localStorage.setItem('addactor',this.jsonUrl);
          } else {
            curl = localStorage.getItem('addactor') || '';
            this.childrenUrl = curl;
            curl+=this.behindParams;
          }
        }
        this.getDetail(curl);
      },
      getDetail(curl)
      {
        let that = this;
        if (this.isHTTPS && curl.indexOf('https') < 0) {
          curl = curl.replace('http', 'https');
        }
        api.get(curl).then((data) => {
          let actorList = data.data;
          this.actor = data.data;
          document.title = actorList.specialName;
          console.log(actorList);
          that.pageId = actorList.actorId;
          console.log(that.pageId+'查询ID');
          that.eleList.splice(0,that.eleList.length);//清空数组
          that.eleList.push(actorList);
          const assetList = that.eleList[0].assetList;
          const newAssetList = [];
          for (let i = 0; i < assetList.length ; i++){
            if (newAssetList.length === 0 || newAssetList[newAssetList.length-1].years != assetList[i].year) {
              const asset = {years: assetList[i].year, list: [ assetList[i] ]}
              newAssetList.push(asset);
            } else {
              newAssetList[newAssetList.length-1].list.push(assetList[i]);
            }
          }
          that.newAssetList = newAssetList;

          that.$nextTick(function(){
            that.addCss();
          })
        }, (response) => {
          console.log("获取详情页数据失败");
        })
      },
      keyCode(params) {
        if (params == "down") {
          this.down();
        } else if (params == "up") {
          this.up();
        } else if (params == "left") {
          this.left();
        } else if (params == "right") {
          this.right();
        } else if (params == "KeyEnter") {
          let url = this.newAssetList[this.num].list[this.itemNo].jsonUrl;
          this.$router.push({name:"detail",params:{jsonUrl:url,catCode:this.traceType,catId:this.tra,parent:11,parentId:this.pageId,backIng:"返回首页"}});
        } else if (params == "KeyBack") {
          this.KeyBack();
        }
      }, KeyBack() {
        this.isShow = false;
        if(this.$route.query.jsonUrl!=undefined){
          console.log("详情页从外部打开");
          yh.back();
        }else{
          this.$router.go(-1);
        }
      },down() {
        this.removeCss();
        this.num++;
        this.itemNo =0;
        $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        if (this.num>this.newAssetList.length-1){
          this.num = this.newAssetList.length-1;
        }
        $('.actor-right').css({'transition':'all 0.3s','transform':'translateY(-'+ 380*this.num +'px)'});
        this.addCss();
      },
      up(){
        this.removeCss();
        this.num--;
        this.itemNo =0;
        $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        if (this.num<0){
          this.num=0;
        }
        $('.actor-right').css({'transition':'all 0.3s','transform':'translateY(-'+ 380*this.num +'px)'});
        this.addCss();
      },
      left(){
        this.removeCss();
        this.itemNo--;
        if(this.itemNo<0){
          this.itemNo=0;
        }
        if (this.itemNo<this.newAssetList[this.num].list.length-2){
          $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        }
        this.addCss();
      },
      right(){
        this.removeCss();
        this.itemNo++;
        if (this.itemNo>this.newAssetList[this.num].list.length-1){
          this.itemNo = this.newAssetList[this.num].list.length-1;
        }
        if (this.itemNo>2){
          $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*(this.itemNo-2) +'px)'});
        }
        this.addCss();
      },
      addCss(){
        $('#a'+this.num+' #b'+this.itemNo).addClass('change');
      },
      removeCss(){
        $('#a'+this.num+' #b'+this.itemNo).removeClass('change');
      }
    },
    beforeDestroy: function () {
      console.group('beforeDestro演员页 销毁前状态===============》');
      //      // 离开页面（页面停留时间）
      try {
//        StartTime = new Date().getTime();
        this.$store.commit('GET_STARTTIME',new Date().getTime());
        console.log("开始时间被重置"+StartTime);
        let traceId = this.catId+"|"+this.pageId;
        this.tra = this.catId+"|"+this.pageId;
        this.traceType = this.catCode+"|11|";
        let overTime = 0;
        this.par = this.parentId;
        overTime =  new Date().getTime() - this.httpResponseTime;
        bi.closPage(this.tra,this.traceType,11,this.pageId,3,this.par,0,overTime);
        console.log(this.tra,this.traceType,11,this.pageId,3,this.par,0,overTime+'演员返回弹出');
      } catch (error) {
        console.log(error);
      }
//      bp.closPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id, special_type, oldTime)
    },
    watch:{
    actor(){
      this.$lazyImages.loadImage();
    },
      newAssetList(){
        this.$nextTick(function() {
          this.load();
          this.getTanZheng();
        })
      }
  }, computed:{
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
  }
</script>
