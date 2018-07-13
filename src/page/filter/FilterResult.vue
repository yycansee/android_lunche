<!-- 搜索页 -->
<template>
  <div class="filter">
    <timeClock></timeClock>
    <div class="filter-left">
      <h3>筛选</h3>
      <Sizer :cat-code="catCode" ref="fr" :category-name="categoryName" v-on:filterIssue="getSql" v-on:keepDo="toRight" v-if="isKeepAlive" ></Sizer>
    </div>
    <div class="filter-right">
      <ul>
        <template v-for="(item,index) in assetList" >
          <li :class="(index==itemNo?'change':'')" :key="index" >
            <lazy-image
                :src='item.assetImg'
                :placeholder='placeholder'
                :initScore = 'initScore'
                :score = "item.score"
                :title = "item.assetName"
                  />
          </li>
        </template>
      </ul>
    </div>
    <keyDo v-on:listenKeyCode="keyCode" v-if="isShow"  ref="keyDo"></keyDo>
  </div>
</template>

<style>
.filter{
  width: 1280px;
  height: 720px;
  background:#A28F71;
  overflow: hidden;
}
.filter:after{
clear: both;
content: "";
display: block;
}

.filter-left{
width: 400px;
height: 720px;
padding-left: 50px;
float: left;
box-sizing: border-box;
box-shadow: 0 0 0 1px rgba(255, 255, 255, .4);
}

h3{
margin-top: 20px;
margin-bottom: 130px;
font-size: 25px;
color: #FFFFFF;
font-family:"Arial","Microsoft YaHei","黑体","宋体",sans-serif ;

}
.tip{
width: 280px;
height: 45px;
line-height: 45px;
text-align:center;
font-size: 18px;
background-color:#C6A776; 
}
.filter-left .filterName{
font-size: 20px;
text-align: center;
margin-top: 15px;
}
.filter-left .introduce{
font-size: 18px;
color: #cfe6fe;
margin-top: 15px;
}

.filter-right{
position: relative;
width: 840px;
float: left;
box-sizing: border-box;
margin-top: 60px;
margin-left: 40px;
}
.filter-right ul{
  position: relative;
}
.filter-right ul li{
  float: left;
  width: 160px;
  height: 220px;
  margin-left: 25px;
  margin-top: 25px;
  box-sizing: border-box;
}
.filter-right ul li.change{
  box-sizing: border-box;
  transform: scale(1.1);
  box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
  border:4px #FFF solid;
  margin: 29px 2px -4px 23px;

}
</style>
<script>
import {mapGetters} from 'vuex'
import Sizer from './Sizer.vue'
import {HTTPUtil as api} from '../../fetch/api.js'
import timeClock from '../../components/timeTask.vue'
import {bp as bi} from '../../js/ga.js'
import c from '../../js/common.js'
export default {
  props:['catCode','categoryName','catId','parentId'],
  data(){
      return{
          isShow:false,
          itemNo:-1,
          pageSize:0,
          cheight:[],
          placeholder:require('../../assets/img_loading_160x230.png'),
          initScore:require('../../assets/corner_mark.png'),
          assetList:[],
          isKeepAlive:true,
          keyword:'',
          firstLoad:true,
      }
  },activated(){
    this.firstLoad = true;
    this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
    if(this.catCode!=undefined){// 当组件被缓存的时候需要重新渲染  
      this.isKeepAlive = false;
      $('.filter-right ul').stop(false,true).animate({'top':'0px'},200);
      this.itemNo = -1;
      this.pageSize = 0;
      this.cheight = [];
      let _this = this;
      this.$refs.fr.removeCss();
      this.$refs.fr.col = 0;
      setTimeout(()=>{
           _this.isKeepAlive = true;
      },0)
      setTimeout(() => {
          _this.$refs.fr.col = 0;
          _this.$refs.fr.isShow = true;
          _this.$refs.fr.initData();
          _this.$refs.fr.addCss();
      }, 50);
     this.$nextTick(function(){
            let overTime =0;
            if(this.firstLoad){
                overTime =  this.httpResponseTime - this.startTime;
                console.log("筛选页第一次加载");
                this.firstLoad = false;
            }else{
              return "";
            }
            console.log("筛选页面加载完成时间："+overTime+"*******是否第一次加载页面："+this.firstLoad);
            if(this.catCode==undefined)this.catCode=0;
            if(this.catId==undefined)this.catId=0;
             let traceId = "|"+this.parentId+"|"+this.catId+"|";
            let traceType = "|1|7|9|";
            bi.loadPage(traceId,traceType,9,0,7,this.catId,0,overTime);
      })
     
    }
  },
  created(){
    c.setLocal('sx-catCode',this.catCode);
  },mounted(){
        
  },
  methods:{
    keyCode(kc){
      if (kc == "down") {
        this.down();
      } else if (kc == "up") {
        this.up();
      } else if (kc == "left") {
        this.left();
      } else if (kc == "right") {
        this.right();
      } else if (kc == "KeyEnter") {
          try {// 筛选资产点击
            let asset_id = this.assetList[this.itemNo].assetId;
           if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
           let traceId = "|"+this.parentId+"|"+this.catId+"|";
           let traceType = "|1|7|9|";
           bi.shaixuan(this.keyword, traceId, traceType, 7, this.catId,"",9,0);
          } catch (error) {
            console.log(error);
          }
        let url =  this.assetList[this.itemNo].jsonUrl;
        this.$router.push({name:"detail",params:{jsonUrl:url}});
      } else if (kc == "KeyBack") {
        this.isShow = false;
        this.$router.go(-1);
      }
    },getSql(sql){
      this.sql = sql;
      this.pIndex=0;
      this.pSize=20;
      this.pageSize = 0;
    //  sql = "&content=1491378716804914758&areaId=1491379110098810153";
      if(sql!=""&&sql.length>0){
        this.keyword = sql.match(/\d+/g).join('|');
      }else{
        this.keyword = "";
      }
      if(this.catCode==0||this.catCode==undefined){
          console.log("catCode从缓存中取");
         this.catCode = c.getLocal('sx-catCode');
      }
      api.getFilterResult(sql,this.pIndex,this.pSize,this.catCode).then(jsonData=>{
         this.assetList = jsonData.data.assetList;
         let _this = this;
         setTimeout(() => {
            _this.$lazyImages.loadImage();
         }, 0);
      });
     
    },down(){
      if($('.filter-right ul').is(":animated")){return}
      if(this.itemNo>(this.assetList.length-5))return;
      this.itemNo+=4;
      let eh = this.getEleHeight();
      this.getNextPage("","");
      this.changeHeight('down',eh);
    },up(){
      if($('.filter-right ul').is(":animated")){return}
      if(this.itemNo<4)return;
      this.itemNo-=4;
      let eh = this.getEleHeight();
      this.changeHeight('up',eh);
    },left(){
      if((this.itemNo)%4==0){
        this.itemNo = -1;
        this.isShow = false;
        $('.filter-right ul').stop(false,true).animate({'top':'0px'},200);
        this.$refs.fr.getkeyCode(true);
        return;
      };
      this.itemNo--;
    },right(){
      if((this.itemNo+1)%4==0)return;
      if(this.itemNo==(this.assetList.length-1))return;
      this.itemNo++;
    },toRight(arg){
      if(!arg){
        if(this.assetList.length==0){
          this.itemNo = -1;
          this.isShow = false;
          $('.filter-right ul').stop(false,true).animate({'top':'0px'},200);
          this.$refs.fr.getkeyCode(true);
        }else{
          this.itemNo = 0;
          this.isShow = !arg;
          try {
            if(this.catCode==undefined)this.catCode=0;
            if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.parentId+"|"+this.catId+"|";
            let traceType = "|1|7|9|";
            bi.shaixuanResultClick(this.keyword, 1, traceId, traceType, 7, this.catId, 9, 0);
          } catch (error) {
            console.log(error);
          }
        }
        
      }
    },changeHeight(action,height){
      let _this =  this;
      let scrollY  = $('.filter-right ul').position().top;
      if(action=="down"){
        if(height>720){
          let _temp = height-640;
          scrollY -= _temp;
          $('.filter-right ul').stop(false,true).animate({'top': scrollY+'px'},200,function(){
             _this.cheight.push(_temp);
             _this.pageSize++;
          });
        }
      }else if(action=="up"){
        console.log("剩余滑动次数:"+this.pageSize);
        if(this.pageSize==0){
          $('.filter-right ul').stop(false,true).animate({'top':'0px'},200);
          return
        };
        scrollY += this.cheight[this.pageSize-1];
        $('.filter-right ul').stop(true,true).animate({'top':scrollY+'px'},200,function(){
            _this.cheight.splice((_this.pageSize-1),1);
            _this.pageSize--;
        });
      }

    },getEleHeight(){
       let fEleDistance = $(".filter-right li").eq(this.itemNo).offset().top+220;
       console.log("fEleDistance:"+fEleDistance);
       return fEleDistance;
    },getNextPage(pIndex,pSize){
        this.pIndex += this.pSize;
        this.pSize = 8;
        let _this = this;
        let _assetList = [] ;
        let _concat = [];
        _assetList = this.assetList;
        console.log(_assetList);
        if(this.catCode==0||this.catCode==undefined){
          console.log("翻页catCode从缓存中取");
          this.catCode = c.getLocal('sx-catCode');
        }
       api.getFilterResult(this.sql,this.pIndex,this.pSize,this.catCode).then(jsonData=>{
        if(jsonData.data.assetList.length>0){
            _concat = jsonData.data.assetList;
            console.log(_concat);
            _this.assetList = _assetList.concat(_concat);
        }
      });
    }
  },computed:{
    ...mapGetters([
        'category',
        'behindParams',
        'isHTTPS',
        'startTime',
        'httpRequestTime',
        'httpResponseTime'
      ])
  },
  components:{
     Sizer,timeClock
  },watch:{
    parentId(){
      if(this.parentId==undefined)this.parentId=0;
    },
    assetList(){
        if(this.assetList.length==0){ // 没有筛选结果
        try { // 筛选结果中点击
              if(this.catCode==undefined)this.catCode=0;
              if(this.catId==undefined)this.catId=0;
              let traceId = "|"+this.parentId+"|"+this.catId+"|";
              let traceType = "|1|7|9|";
              bi.shaixuanResultClick(this.keyword, 2, traceId, traceType, 7, this.catId, 9, 0);
          } catch (error) {
            console.log(error);
          }
      }
      this.$nextTick(function(){
            this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
            let overTime =0;
            if(this.firstLoad){
                overTime =  this.httpResponseTime - this.startTime;
                console.log("搜索页第一次加载");
                this.firstLoad = false;
            }else{
              return "";
            }
            console.log("搜索页面加载完成时间："+overTime+"*******是否第一次加载页面："+this.firstLoad);
            if(this.catCode==undefined)this.catCode=0;
            if(this.catId==undefined)this.catId=0;
             let traceId = "|"+this.parentId+"|"+this.catId+"|";
            let traceType = "|1|7|9|";
            bi.loadPage(traceId,traceType,9,0,7,this.catId,0,overTime);
      })
    }
  },beforeRouteLeave(to, from, next){     
      try {
           this.$store.commit('GET_STARTTIME',new Date().getTime());
           console.log("开始时间被重置"+this.startTime);
           let overTime = 0;
           overTime =  new Date().getTime() - this.httpResponseTime;
           if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
           let traceId = "|"+this.parentId+"|"+this.catId+"|";
           let traceType = "|1|7|9|";
           bi.closPage(traceId,traceType,9,0,7,this.catId,0,overTime)
           console.log("页面停留时间："+overTime+"^^^^^^^focusId:"+this.catId);
      } catch (error) {
           console.log(error);
      }finally{
           next();
      }
  }
}
</script>
