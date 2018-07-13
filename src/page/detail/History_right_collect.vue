<!--收藏详情页-->
<template>
  <div class="actor-right">
    <div class="remove ">全部删除</div>
    <div v-for="(item,index) in favoriteLists" v-if="index>=0" :key="item.assetType" :id="('a'+index)" class="actor_ul">
      <div class="actor_year">
        <div></div>
        <p>{{item.assetType}}</p>
      </div>
      <div class="actorImgs">
        <div class="actor_img" v-for="(favorite,index) in item.list" :key="index.id" :id="('b'+index)">
          <lazy-image
            :src='favorite[0].assetImg'
            :placeholder='placeholder'
            :initScore = 'initScore'
            :score = "favorite[0].score"
            :title = "favorite[0].assetName"
            class="imgList_img"
          />
        </div>
      </div>
    </div>
    <keyDo v-on:listenKeyCode="keyCode"  ref="keyDo" v-if="isShow"></keyDo>
  </div>
</template>

<style scoped="Hright">
  .remove{
    width: 160px;
    height: 50px;
    margin-left: 30px;
    margin-top: 30px;
    margin-bottom: 40px;
    line-height:50px;
    border-radius: 5px;
    text-align: center;
    font-size: 18px;
    background: rgba(0,0,0,0.4);
  }
  .removechange{
    background: #A36363;
    border: 4px solid white;
    box-sizing: border-box;
    margin-top: 26px;
  }
  .actorImgs{
    width: 3000px;
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
    background: rgba(255,255,255,0.5);
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .actor_ul{
    width: 100%;
    margin-top: 20px;
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
    border: 1px rgba(255, 255, 255, 0.5) solid;
    float: left;
    box-sizing: border-box;
  }
  .actor_img img{
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .actor-right{
    width: 980px;
    background: #A8977C;
    box-sizing: border-box;
    position: absolute;
    left: 302px;
    top:0;
  }

  .actor_ul .change{
    border: 4px solid #ffffff;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);
    box-sizing: border-box;
  }

</style>

<script>
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../../fetch/api.js'
  import {client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'

  var d = new Date();
  export default {
    props:['jsonUrl','catId','catCode'],
    data () {
      return {
        name: "Hright",
        isShow: false,
        num: 0,
        itemNo: 0,
        sc: false,
        placeholder: require('../../assets/img_loading_160x230.png'),
        initScore: require('../../assets/corner_mark.png'),
        favoriteList:
          {
            "Column": [
              {
                "assetId": "1714",
                "assetImg": "http://game-s.yanhuamedia.tv/img/201609/22/11/37/20160922113725951c7a9e0a8.jpg",
                "assetName": "快乐大本营",
                "assetType": "Column",
                "broadcast": "",
                "catId": "",
                "coverimage": "",
                "episodes": "0",
                "id": 3,
                "layout": "Detail_News",
                "layoutUrl": "http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhAssetDetail&k=1&v=1&assetId=1714&c=2",
                "score": "6.6",
                "specialId": "",
                "specialName": ""
              }
            ],
            "Movie": [
              {
                "assetId": "3501",
                "assetImg": "http://game-s.yanhuamedia.tv/img/201701/24/17/20/20170124172045242bffeaea6.jpg",
                "assetName": "蜘蛛侠3",
                "assetType": "Movie",
                "broadcast": "",
                "catId": "",
                "coverimage": "",
                "episodes": "1",
                "id": 1,
                "layout": "Detail_Movie",
                "layoutUrl": "http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhAssetDetail&k=1&v=1&assetId=3501&c=2",
                "score": "7.0",
                "specialId": "",
                "specialName": ""
              }
            ],
            "Series": [
              {
                "assetId": "9473",
                "assetImg": "http://game-s.yanhuamedia.tv/img/201708/06/23/25/5/20170806232552202d82a8375.jpg",
                "assetName": "颤抖吧，阿部！",
                "assetType": "Series",
                "broadcast": "",
                "catId": "",
                "coverimage": "",
                "episodes": "25",
                "id": 2,
                "layout": "Detail_Series",
                "layoutUrl": "http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhAssetDetail&k=1&v=1&assetId=9473&c=2",
                "score": "7.6",
                "specialId": "",
                "specialName": ""
              },
              {
                "assetId": "9473",
                "assetImg": "http://game-s.yanhuamedia.tv/img/201708/06/23/25/5/20170806232552202d82a8375.jpg",
                "assetName": "颤抖吧，阿部！",
                "assetType": "Series",
                "broadcast": "",
                "catId": "",
                "coverimage": "",
                "episodes": "25",
                "id": 2,
                "layout": "Detail_Series",
                "layoutUrl": "http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhAssetDetail&k=1&v=1&assetId=9473&c=2",
                "score": "7.6",
                "specialId": "",
                "specialName": ""
              }
            ],
            "Category": [ {
                "assetId": "",
                "assetImg": "http://game-s.yanhuamedia.tv/img/2017/9/11/156/156/2017091110361672jpfadc9m.jpg",
                "assetName": "4K影院",
                "assetType": "Category",
                "broadcast": "",
                "catId": "",
                "coverimage": "http://game-s.yanhuamedia.tv/img/2017/9/11/156/156/2017091110361672jpfadc9m.jpg",
                "episodes": "",
                "id": 1,
                "layout": "",
                "layoutUrl": "http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhSpecialDetail&k=1&v=1&specialId=202310&c=2",
                "score": "",
                "specialId": "202310",
                "specialName": "4K影院"
      }]
          },
        favoriteLists:[],
        json: {},
        assetId:0,
        typeId:1,
        traceId:''
      }
    },components:{

    },

    activated(){
      try {
        this.json = JSON.parse(localStorage.getItem('PersonMovies'));
        this.getquery(this.json);
        this.jsonfun(this.favoriteList);
      }catch (error) {
        console.log("调用ERT.openFavorite()方法异常：" + error);
      }
    },
    created() {
//      线上
      try {
        this.json = JSON.parse(localStorage.getItem('PersonMovies'));
        this.getquery(this.json);
        this.jsonfun(this.favoriteList);
      }catch (error) {
        console.log("调用ERT.openFavorite()方法异常：" + error);
      }
////      测试
//      this.getquery(this.favoriteList);
//      console.log(this.favoriteLists)
    },mounted(){

    },watch:{
      initData(){
//        线上
        try {
          this.json = JSON.parse(localStorage.getItem('PersonMovies'));
          this.getquery(this.json);
          this.jsonfun(this.favoriteList);
        }catch (error) {
          console.log("调用ERT.openFavorite()方法异常：" + error);
        }
//        this.getquery(this.favoriteList);
//        console.log(this.favoriteLists)
      }

    },updated(){




    },methods: {
//      点击事件
        collectPage(){
          this.traceId = "|"+this.catId+"|"+0;
          console.log(this.traceId+'收藏页面');
          // bp.collectPage = function(traceId, traceType, pageType, pageId, parent_page_type, parent_page_id,asset_id, trace_id, trace_type, special_type, type)
          bi.collectPage(this.traceId,"|1|5",5,0,1,this.catId,this.assetId,this.traceId,"|1|5",'',this.typeid);
          console.log(this.traceId,"|1|5",5,0,1,this.catId,this.assetId,this.traceId,"|1|5",'',this.typeid);
        },
//      获取长度
      getJsonLength(jsonData){
        let jsonLength = 0;
        for(let item in jsonData){
          jsonLength++;
        }
        return jsonLength;
      },
      jsonfun(jsonDA){
        let newFavorites = [
          {assetType: "电影", list:[]},
          {assetType: "娱乐", list:[]},
          {assetType: "电视剧", list:[]},
          {assetType: "专题", list:[]}];
        let newList = [];
        let fList = jsonDA;
        for (let i = 0;i < fList.length; i++) {
          if (newFavorites.length == 0){
            newFavorites.push(fList[i]);
          }else {
            for(let j = 0;j < newFavorites.length; j++){
              if(fList[i].assetType == newFavorites[j].assetType){
                newFavorites[j].list.push(fList[i].list);
              }
            }
          }
        }
        for(let i =0;i < newFavorites.length;i++){
          if (newFavorites[i].list.length !=0){
            console.log(newFavorites[i].list);
            newList.push(newFavorites[i]);
          }
        }

        this.favoriteLists = newList;
        console.log(newList);
      },
        getquery(jsonDB){
          let newFavorite = [];
          let  fList = jsonDB;
          console.log(fList[0].assetType);
          for(let index = 0; index < fList.length; index++){
            if (fList[index].assetType =='Movie'){
              let favorite = {assetType: "电影", list:[fList[index]]};
              newFavorite.push(favorite);
            }
            if (fList[index].assetType =='Column'){
              let favorite = {assetType: "娱乐", list:[fList[index]]};
              newFavorite.push(favorite);
            }
            if (fList[index].assetType =='Series'){
              let favorite = {assetType: "电视剧", list: [fList[index]]};
              newFavorite.push(favorite);
            }
            if (fList[index].assetType =='Category') {
              console.log(favorite);
              let favorite = {assetType: "专题", list: [fList[index]]};
              newFavorite.push(favorite);
            }
          }
          this.favoriteList = newFavorite;
            console.log(newFavorite);
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
          if (this.num>-1){
            this.isShow = false;
            if (this.favoriteLists[this.num].assetType=="专题"){
              console.log(this.favoriteLists[this.num].list[this.itemNo][0].layoutUrl);
              let url = this.favoriteLists[this.num].list[this.itemNo][0].layoutUrl;
              let Id =this.favoriteLists[this.num].list[this.itemNo][0].specialId;
              this.assetId = Id;
              this.$emit('pressLeft',this.isShow,this.name,"KeyEnter",url,Id,'专题',"|1|5");
              console.log("专题ID"+this.assetId);
            }else {
              console.log(this.favoriteLists[this.num].list[this.itemNo][0].layoutUrl);
              console.log(this.favoriteLists[this.num].list[this.itemNo][0].assetId);
              let url = this.favoriteLists[this.num].list[this.itemNo][0].layoutUrl;
              let Id =this.favoriteLists[this.num].list[this.itemNo][0].assetId;
              this.assetId = Id;
              this.$emit('pressLeft',this.isShow,this.name,"KeyEnter",url,Id,'详情',"|1|5");
              console.log("详情页ID"+this.assetId);
            }
            this.typeid = 1;
            console.log("点击时候的typeid"+this.typeid);
            this.collectPage();
          }else {
//            删除
            localStorage.clear();
            try {
              this.json = JSON.parse(localStorage.getItem('PersonMovies'));
              this.getquery(this.json)
            }catch (error) {
              console.log("调用ERT.openFavorite()方法异常：" + error);
            }
          }
        } else if (params == "KeyBack") {
          this.KeyBack();
        }
      },
      KeyBack() {
        if(this.$route.query.jsonUrl!=undefined){
          console.log("详情页从外部打开");
          yh.back();
        }else{
          this.$router.go(-1);
        }
        this.isShow = false;
        this.removeCss();
        this.num = 0;
        this.itemNo = 0;
        this.$nextTick(function () {
          this.itemNo=-1;
          this.isShow = false;
          this.$emit('pressLeft', this.isShow,this.name,"left");
          $('.remove').removeClass('removechange');
          this.num = 0;
          this.itemNo = 0;
          this.removeCss();
        });
        $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        $('.actor-right').css({'transition':'all 0.1s','transform':'translateY(-'+ 360*this.num +'px)'});
        $('.remove').removeClass('removechange');
      },
      down() {
        this.removeCss();
        this.num++;
        this.itemNo =0;
        $('.remove').removeClass('removechange');
        console.log(this.favoriteLists.length);
        if (this.num>this.favoriteLists.length-1){
          this.num = this.favoriteLists.length-1;
        }
        $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        $('.actor-right').css({'transition':'all 0.3s','transform':'translateY(-'+ 360*this.num +'px)'});
        this.addCss();
      },
      up(){
        this.removeCss();
        this.num--;
        this.itemNo =0;
        if (this.num<=-1){
          $('.remove').addClass('removechange');
          this.num=-1;
        }
        $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        $('.actor-right').css({'transition':'all 0.3s','transform':'translateY(-'+ 360*this.num +'px)'});
        this.addCss();
      },
      left(){
        this.removeCss();
        this.itemNo--;
        if(this.itemNo<0){
          this.itemNo=-1;
          this.isShow = false;
          this.$emit('pressLeft', this.isShow,this.name,"left");
          $('.remove').removeClass('removechange');
        }
        if (this.itemNo<this.favoriteLists[this.num].list.length-2){
          $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        }
        this.addCss();
      },
      right(){
        this.removeCss();
        this.itemNo++;
        if (this.itemNo>this.favoriteLists[this.num].list.length-1){
          this.itemNo = this.favoriteLists[this.num].list.length-1;
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
      },
      updateStast(bl,name,pos){
//              线上
        try {
          this.json = JSON.parse(localStorage.getItem('PersonMovies'));
          this.getquery(this.json);
          this.jsonfun(this.favoriteList);
        }catch (error) {
          console.log("调用ERT.openFavorite()方法异常：" + error);
        }
        this.isShow = true;
        if(name == 'right1'){
            this.removeCss();
            this.num = 0;
            this.itemNo = 0;
            this.addCss();
            $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
            $('.actor-right').css({'transition':'all 0.1s','transform':'translateY(-'+ 360*this.num +'px)'});
            $('.remove').removeClass('removechange');
        }else if(name == "remove"){
          this.removeCss();
          this.num = 0;
          this.itemNo = 0;
          this.addCss();
          $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
          $('.actor-right').css({'transition':'all 0.1s','transform':'translateY(-'+ 360*this.num +'px)'});
          $('.remove').removeClass('removechange');
          if (pos == 'keyEnter'){
            this.typeid = 2;
            console.log("删除收藏时候的typeid"+this.typeid);
            console.log(this.traceId,"|1|5|",5,0,1,this.catId,this.assetId,this.traceId,"|1|",'',this.typeid);
            this.collectPage();
          }
        }
      }
    }
    ,computed:{
      ...mapGetters([
        'rootPath',
        'catList',
        'category',
        'behindParams',
        'isHTTPS'

      ])
    }
  }
</script>
