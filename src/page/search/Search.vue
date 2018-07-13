<!-- 搜索页 -->
<template>
<div class="search">
  <timeClock></timeClock>
  <div class="search-left">
    <h3>{{title}}</h3>
    <kb v-on:pressDown="keepDo" ref="kbc" ></kb>
    <div class="tip">输入首字母进行全局搜索</div>
  </div>
  <div class="search-right">
    <template v-if="eleList.hotActorList!=undefined">
      <div v-for="(item,index,key) in eleList"  :key="item.id" :id="('a'+key)" :class="index=='hotActorList'?'search_actor':'search_ul'">
      <div class="search_year">
          <div></div>
          <p>{{index=='hotActorList'?'明星榜':'热播榜'}}</p><span><b>0</b> / {{item.length}}</span>
      </div>
      <div class="searchImgs">
        <div class="search_img" v-for="(assert,sk) in item"    :key="assert.key" :id="('b'+sk)">
          <lazy-image v-if="index=='hotActorList'"
          :src='assert.elementImg'
          :placeholder='placeholder'
          :imgClass="circle"
          />
          <lazy-image v-else
          :src='assert.elementImg'
          :placeholder='placeholder'
          :imgClass="circle"
          :initScore = 'initScore'
          :title="assert.elementName"
          :score="assert.score"
          />
          <p v-if="index=='hotActorList'" class="listname">{{assert.elementName}}</p>
        </div>
        </div>
      </div>
    </template>
    <template v-else>
    <div v-for="(item,index) in eleList"  :key="item.id" :id="('a'+index)" :class="eleList[index].categoryType=='actor'?'search_actor':'search_ul'">
      <div class="search_year">
        <div></div>
        <p>{{item.categoryName}}</p><span><B>0</B> / {{item.resultNum}}</span>
      </div>
      <div class="searchImgs">
        <div class="search_img" v-for="(assert,index) in item.resultList"    :key="assert.id" :id="('b'+index)">
          <lazy-image v-if="item.categoryType=='actor'"
          :src='assert.elementImg'
          :placeholder='placeholder'
          :imgClass="circle"
          />
          <lazy-image v-else
          :src='assert.elementImg'
          :placeholder='placeholder'
          :imgClass="circle"
          :initScore = 'initScore'
          :title="assert.elementName"
          :score="assert.score"
          />
          <p v-if="item.categoryType=='actor'" class="listname">{{assert.elementName}}</p>
        </div>
      </div>
    </div>
    </template>
  </div>
  <keyDo v-on:listenKeyCode="keyCode" v-if="isShow"  ref="keyDo"></keyDo>
</div>
</template>

<style>
.searchImgs{
position:relative;
width: 30000px;
}
.search{
  width: 1280px;
  height: 720px;
  background:#A49174;
  overflow: hidden;
}
.search:after{
clear: both;
content: "";
display: block;
}
.search_year{
font-size: 24px;
}
.search_year:after{
clear: both;
display: block;
content: '';
}
.search_year div{
width: 60px;
height: 1px;
background: white;
float: left;
margin-top: 15px;
margin-right: 10px;
opacity: 0.5;
}
.search_year p{
display: inline;
}
.search_year span{
margin-left: 10px;
background-color: #71644F;
padding: 0px 15px 0px 15px;
text-align: center;
font-size: 17px;
border-radius: 4px;
}
.search_ul{
width: 100%;
margin-top: 20px;
overflow: hidden;
height: 350px;
}
.search_actor{
width: 100%;
margin-top: 40px;
overflow: hidden;
height: 200px;
}
.search_actor .search_img{
width: 110px;
height: 110px;
margin-top: 30px;
margin-left: 80px;
position: relative;
float: left;
}
.search_actor .imglazy{
  border-radius:50%;
}
.search_actor  .circle{
border-radius:50%;
}
.search_actor .listname{
font-family:PingFangSC-Regular;
font-size:15px;
color:#ffffff;
text-shadow:0px 2px 4px rgba(0,0,0,0.50);
width: 100%;
height: 25px;
position: absolute;
bottom:-27px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
text-align:center;
}
.search_ul:after{
clear: both;
content: "";
display: block;
}
.search_ul .search_img{
width: 160px;
height: 249px;
margin-top: 20px;
margin-left: 40px;
position: relative;
float: left;
}

.search-left{
width: 384px;
height: 720px;
padding-left: 50px;
float: left;
box-sizing: border-box;
box-shadow: 0 0 0 1px rgba(255, 255, 255, .4);
}
.search-right{
position: relative;
width: 896px;
float: left;
box-sizing: border-box;
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
.search-left .searchName{
font-size: 20px;
text-align: center;
margin-top: 15px;
}
.search-left .introduce{
font-size: 18px;
color: #cfe6fe;
margin-top: 15px;
}
.search_ul .change{
box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
border:4px #FFF solid;
transform: scale(1.1);
margin-top: 16px;
margin-left: 36px;
}
.search_actor .change{
transform: scale(1.1);
box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
border:4px #FFF solid;
border-radius:50%;
margin-top: 26px;
margin-left: 76px;
}


</style>

<script>
import {mapGetters} from 'vuex'
import kb from '../../tool/keyboard/keyboard.vue'
import {HTTPUtil as api} from '../../fetch/api.js'
import timeClock from '../../components/timeTask.vue'
import {bp as bi} from '../../js/ga.js'
export default {
props:['jsonUrl','type','catId','catCode'],
name: 'search',
data () {
  return {
    isShow:true,
    col:0,
    row:0,
    isShow:false,
    sc:false,
    title:'搜索内容',
    placeholder:require('../../assets/img_loading_160x230.png'),
    initScore:require('../../assets/corner_mark.png'),
    eleList:[],
    keyword:'yh',
    oldF:[0,0],
    newF:[],
    objindex:[],
    listLength:0,
    circle:'circle',
    isRecommend:true,
    firstLoad:true,
  }
},components:{
    kb,timeClock
},activated(){
    console.log("keep-alive:search组件被激活");
    this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
    if(this.type!=undefined){ // 当组件被复用时相关信息需要初始化
      this.firstLoad = true;
      this.isShow = false;
      this.removeCss();
      this.keyword = "";
      this.objindex = [0,0];
      this.col=0;
      this.row=0;
      this.oldF=[0,0];
      this.newF=[0,0];
      $('.search-right .searchImgs').css('left','0px');
      $('.search-right').stop(false,true).animate({'top':'0px'},300);
      console.log("激活小键盘");
      this.$refs.kbc.getKeyListen(0);
      this.$refs.kbc.keyword = "";
      this.$refs.kbc.isDel = false;
      try {
          let overTime =0;
          if(this.firstLoad){
              overTime =  this.httpResponseTime - this.startTime;
              console.log("缓存搜索页第一次加载");
              this.firstLoad = false;
          }
           console.log("搜索页面加载完成时间："+overTime+"*******是否第一次加载页面："+this.firstLoad);
           let traceId = "|"+this.catId+"|";
           let traceType = "|1|"+this.catCode+"|";
           bi.loadPage(traceId,traceType,2,0,1,this.catId,0,overTime);
      } catch (error) {
        console.log(error);
      }
    }else{
      console.log("搜索组件复用");
    }
  },
created() {
  // this.init();
},methods: {
  init(){
    let curl = "https://winnow-bds.yanhuamedia.tv/?s=14|2&p=yhSearchRecommend&k=1&v=1";
    if (this.$route.query.jsonUrl) {
      curl = this.$route.query.jsonUrl + this.behindParams;
      this.childrenUrl = this.$route.query.jsonUrl;
    } else {
      curl+=this.behindParams;
      this.getDetail(curl);
    }
  },
  getDetail(curl)
  {
    let that = this;
    if (this.isHTTPS && curl.indexOf('https') < 0) {
      curl = curl.replace('http', 'https');
    }
    api.get(curl).then((data) => {
      let searchList = data.data;
      that.eleList = [];
      if(searchList==""||searchList==null||searchList==undefined)return;
      if(searchList.hotActorList!=undefined){
            that.eleList = searchList;
            that.objindex=[0,0];
      }else{
          searchList.forEach(element => {
            if(element.resultList.length>0){
            that.eleList.push(element);
            that.objindex.push(0);
            }
            });
      }
      // console.log(that.eleList);
      that.$nextTick(function () {
        that.$lazyImages.loadImage();
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
      // console.log("this.isRecommend:"+this.isRecommend);
      if(this.isRecommend){
       
        if(this.row==0){
          try { // 推荐演员点击
            let asset_id = this.eleList['hotActorList'][this.col].elementId;
            if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.catId+"|";
            let traceType = "|1|2|";
            bi.searchClick(this.keyword, asset_id, 3, traceId, traceType, "", 2, 0, 1, this.catId );
          } catch (error) {
            console.log(error);
          }
          let url = this.eleList['hotActorList'][this.col].jsonUrl;
          this.$router.push({name:"actor",params:{jsonUrl:url}});
        }else if(this.row==1){
          try { // 推荐资产点击
            let asset_id = this.eleList['hotAssetList'][this.col].elementId;
            if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.catId+"|";
            let traceType = "|1|2|";
            bi.searchClick(this.keyword, asset_id, 3, traceId, traceType, "", 2, 0, 1, this.catId );
          } catch (error) {
            console.log(error);
          }
          let url = this.eleList['hotAssetList'][this.col].jsonUrl;
          this.$router.push({name:"detail",params:{jsonUrl:url}});
        }
      }else{
       if(this.row==0 && this.eleList[this.row].categoryType=='actor'){
          try { // 搜索演员点击
            let asset_id = this.eleList[this.row].resultList[this.col].elementId;
            if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.catId+"|";
            let traceType = "|1|2|";
            bi.searchClick(this.keyword, asset_id, 3, traceId, traceType, "", 2, 0, 1, this.catId );
          } catch (error) {
            console.log(error);
          }
          let url = this.eleList[this.row].resultList[this.col].jsonUrl;
          this.$router.push({name:"actor",params:{jsonUrl:url}});
          
        }else{
          try {// 搜索资产点击
            let asset_id = this.eleList[this.row].resultList[this.col].elementId;
            if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.catId+"|";
            let traceType = "|1|2|";
            bi.searchClick(this.keyword, asset_id, 3, traceId, traceType, "", 2, 0, 1, this.catId );
          } catch (error) {
            console.log(error);
          }
          let url = this.eleList[this.row].resultList[this.col].jsonUrl;
          // console.log(url);
          this.$router.push({name:"detail",params:{jsonUrl:url}});
        }
      }
    } else if (params == "KeyBack") {
      this.KeyBack();
    }
  }, KeyBack() {
    this.$router.go(-1);
  },down() {
    if(this.row==0){
      if(this.col<0){
        this.col = 0;
      }
    }
    this.removeCss();
    this.row++;
    if(this.isRecommend){
      if(this.row>1)this.row=1;

    }else{
        if( this.eleList[this.row]==undefined){
          this.row--;
        }else if(!this.eleList[this.row].resultList[this.col]){
          this.col = this.eleList[this.row].resultList.length-1;
        }
    }

    this.addCss();
  },
  up(){
    if(this.row==0)return;
    this.removeCss();
    this.row--;
    if(this.isRecommend){

    }else{
      if(this.row==0){
        // this.col+=2;
        if(this.col>this.eleList[this.row].resultList.length-1){
          this.col = this.eleList[this.row].resultList.length-1;
        }
     }
      // if(this.row==0){this.col++}
      let eleobj = this.eleList[this.row].resultList[this.col];
      if(!eleobj){
        this.col = this.eleList[this.row].resultList.length-1;
      }
    }
    this.addCss();
  },
  left(){
    if($('#a'+this.row+' .searchImgs').is(":animated")){return;}
    if(this.col==0){ // 从右到左切换
      this.removeCss();
      this.isShow = false;
      this.$refs.kbc.getKeyListen(5);
      return;
    }
    this.removeCss();
    this.col--;
    this.addCss();
  },
  right(){
    if($('#a'+this.row+' .searchImgs').is(":animated"))return;
    if(this.isRecommend){
        if(this.col == this.eleList['hotActorList'].length)return;
        this.removeCss();
        this.col++;
    }else{
        if(this.col == this.eleList[this.row].resultList.length-1){return};
        if(this.col<this.eleList[this.row].resultNum && this.col==this.eleList[this.row].resultList.length-2){
            // console.log("需要翻页");
            this.getNextPage(this.eleList[this.row].resultList.length,8,this.eleList[this.row].categoryType);
        }
        this.removeCss();
        this.col++;
        let eleObj =  this.eleList[this.row].resultList[this.col];
        if(!eleObj){
          this.col--;
      }
    }

    this.addCss();
  },
  addCss(){
    this.newF = [this.row,this.col];
    //console.log("this.objindex[this.oldF[0]]="+this.objindex[this.oldF[0]]+"####this.objindex[this.newF[0]]="+this.objindex[this.newF[0]]);
  //console.log("this.objindex[this.oldF[0]]!=this.objindex[this.newF[0]]="+this.objindex[this.oldF[0]]!=this.objindex[this.newF[0]])
  if(this.objindex[this.oldF[0]]!=this.objindex[this.newF[0]]){
    // console.log("this.oldF[1]>this.newF[1]="+this.oldF[1]>this.newF[1])
      if(this.oldF[1]>this.newF[1]){
        
        this.col = this.col - (this.objindex[this.oldF[0]]-this.objindex[this.newF[0]])+(this.oldF[1]-this.newF[1]);
        if(this.isRecommend){ //  算法容错优化

        }else{

          let eleLength =this.eleList[this.row].resultList.length-1;
          if(this.col>eleLength){
            console.log("计算的结果超出本身数据的长度返回最后一条数据");
            this.col = eleLength;
          };
        }
    }else{
        this.col = this.col - (this.objindex[this.oldF[0]]-this.objindex[this.newF[0]]);
      }
    }
    if(this.isRecommend){
        if(this.col>this.eleList['hotActorList'].length-1){
          this.col = this.eleList['hotActorList'].length-1;
        }
    }else{
      if(this.row==0&&this.eleList[this.row].categoryType=='actor'){
        if(this.col>this.eleList[this.row].resultList.length-1){
          this.col = this.eleList[this.row].resultList.length-1;
        }
      }
    }

   // console.log("now:row^^^^"+this.row+"^^^^col:"+this.col+"^^^old:"+this.oldF+"^^^^^newf:"+this.newF+"^^^^objarr"+this.objindex);
    // console.log("js===="+this.row+"====col==="+this.col+"====objindex===="+this.objindex[this.row]);
    let obj =  $('#a'+this.row+' #b'+this.col);
   // console.log('#a'+this.row+'.search_year span b');
    $('#a'+this.row+' .search_year span b').text(this.col+1);
    let left = $(obj).offset().left+175;
    // console.log("left:"+left);
    if(this.row>=1){
      $('.search-right').stop(false,true).animate({'top':(-350*(this.row-1))+'px'},300);
    }
    let $left = 0;
    if(left>1280){ // 当元素的相对于文档右边的距离超过1280时需要滚动
      if(this.isRecommend){ // 只展示搜索推荐数据时
        if(this.row==0){
          $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"-=190px"},300);
        }else{
          $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"-=202px"},300);
        }
      }else{
        if(this.row==0&&this.eleList[this.row].categoryType=='actor'){
          $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"-=190px"},300);
        }else{
          $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"-=202px"},300);
        }
      }
      this.objindex[this.row]++;
    }else if(left<570){
      if(this.isRecommend){// 只展示搜索推荐数据时
          if(this.row==0){
            $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"+=190px"},300);
          }else{
            $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"+=202px"},300);
          }
      }else{
           if(this.row==0&&this.eleList[this.row].categoryType=='actor'){
            $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"+=190px"},300);
          }else{
            $('#a'+this.row+' .searchImgs').stop(false,true).animate({'left':"+=202px"},300);
          }
      }

      this.objindex[this.row]--;
    }
    obj.addClass('change');

  },
  removeCss(){
    this.oldF = [this.row,this.col];
    let obj =  $('#a'+this.row+' #b'+this.col);
    obj.removeClass('change');

  },keepDo(bl, name, pos) {
    if(bl){
        this.keyword = name;
    }else{
      if(this.eleList.hasOwnProperty('hotActorList')||this.eleList.length>0){
        this.isShow = true;
        this.row = this.oldF[0];
        this.col = this.oldF[1];
        this.addCss();
        try { // 搜素结果中点击
            if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.catId+"|";
            let traceType = "|1|2|";
            bi.searchResultClick(this.keyword, 1, traceId, traceType, 1, this.catId, 2, 0);
        } catch (error) {
          console.log(error);
        }
      }else{
        this.isShow = false;
        this.$refs.kbc.getKeyListen();
      }
      
    }

  },getNextPage(pageIndex,pageSize,catType){ // 搜索接口翻页数据
    let curl = "https://winnow-bds.yanhuamedia.tv/?s=14|2&p=yhSearch&k=1&v=1&word="+this.keyword+"&pindex="+pageIndex+"&psize="+pageSize+this.behindParams;
     api.get(curl).then((json) => {
      let searchList = json.data;
     // console.log(searchList);
     let oldArr = [];
     let newArr = [];
     let lastArr = [];
      this.eleList.forEach(k => {
         searchList.forEach(j => {
             if(k.categoryType==j.categoryType && catType == j.categoryType){
               oldArr = k.resultList;
               newArr = j.resultList;
               lastArr = oldArr.concat(newArr);
               k.resultList = lastArr;
              // console.log(lastArr);
             }
         });
      });

     })
  }
},watch:{
  keyword(){
     let curl = "";
    if(this.keyword.length==0){  // 当搜索输入为空时使用默认数据
        curl = "https://winnow-bds.yanhuamedia.tv/?s=14|2&p=yhSearchRecommend&k=1&v=1"+this.behindParams;
        this.isRecommend = true;
    }else{
        curl = "https://winnow-bds.yanhuamedia.tv/?s=14|2&p=yhSearch&k=1&v=1&word="+this.keyword+"&pindex=0&psize=8"+this.behindParams;
        this.isRecommend = false;
    }
    this.objindex = [];
    this.col=0;
    this.row=0;
    this.oldF=[0,0];
    this.newF=[0,0];
    $('.search-right .searchImgs').css('left','0px');
    $('.search-right').stop(false,true).animate({'top':'0px'},300);
    this.getDetail(curl);
  },eleList(){
    if(this.eleList.length==0){ // 没有搜索结果
       try { // 搜素结果中点击
            console.log("没有搜索结果");
            if(this.catCode==undefined)this.catCode=0;
            if(this.catId==undefined)this.catId=0;
            let traceId = "|"+this.catId+"|";
            let traceType = "|1|2|";
            bi.searchResultClick(this.keyword, 2, traceId, traceType, 1, this.catId, 2, 0);
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
           if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
           let traceId = "|"+this.catId+"|";
           let traceType = "|1|"+this.catCode+"|";
           bi.loadPage(traceId,traceType,2,0,1,this.catId,0,overTime);
    })
  }
}
,computed:{
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
},beforeRouteLeave(to, from, next){     
      try {
           this.$store.commit('GET_STARTTIME',new Date().getTime());
           console.log("开始时间被重置"+this.startTime);
           let overTime = 0;
           overTime =  new Date().getTime() - this.httpResponseTime;
           if(this.catCode==undefined)this.catCode=0;
           if(this.catId==undefined)this.catId=0;
           let traceId = "|"+this.catId+"|";
           let traceType = "|1|"+this.catCode+"|";
           bi.closPage(traceId,traceType,2,0,1,this.catId,0,overTime)
           console.log("页面停留时间："+overTime+"^^^^^^^focusId:"+this.catId);
      } catch (error) {
           console.log(error);
      }finally{
           next();
      }
  }
}
</script>
