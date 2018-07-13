<!--历史详情页-->
<template>
  <div class="actor-right">
    <div class="remove ">全部删除</div>
    <div v-for="(item,index) in favoriteLists" v-if="index>=0" :key="item.recordTime" :id="('a'+index)" class="actor_ul">
      <div class="actor_year">
        <div></div>
        <p>{{item.recordTime}}</p>
      </div>
      <div class="actorImgs">
        <div class="actor_img" v-for="(favorite,index) in item.list" :key="index" :id="('b'+index)">
          <!--<img :src="assert.assetImg" >-->
          <lazy-image
            :src='favorite.assetImg'
            :placeholder='placeholder'
            :initScore = 'initScore'
            :score = "favorite.score"
            :title = "favorite.assetName"
            class="imgList_img"
          />
        </div>
      </div>
    </div>
    <keyDo v-on:listenKeyCode="keyCode"  ref="keyDo" v-if="isShow"></keyDo>
  </div>
</template>
<style scoped="Histime">
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
    background: white;
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
    border: 1px solid rgba(255,255,255,0.5);
    float: left;
    box-sizing: border-box;
  }
  .actor_img img{
    width: 100%;
    height: 100%;
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
        name: "Historytime",
        isShow: false,
        historyList:[],
        num: 0,
        itemNo: 0,
        sc: false,
        placeholder: require('../../assets/img_loading_160x230.png'),
        initScore: require('../../assets/corner_mark.png'),
        favoriteList: [],
        favoriteLists: [],
        json: [],
        assetId:0,
        typeId:1,
        traceId:''
      }
    },components:{

    },
    created() {
      try{
        this.json = JSON.parse(yh.queryHistory());
//      线上
        this.json.reverse();
        this.getquery(this.json);
        this.jsonfun(this.favoriteList);
      }catch (error){
        console.log(error);
      }

    },mounted(){

    },watch:{
      initData(){
        this.json = JSON.parse(yh.queryHistory());
        this.json.reverse();
        this.getquery(this.json);
        this.jsonfun(this.favoriteList);
      }
    },activated(){
      this.json = JSON.parse(yh.queryHistory());
      this.json.reverse();
      this.getquery(this.json);
      this.jsonfun(this.favoriteList);
    },
    updated(){

    },methods: {
      //      点击事件
      collectPage(){
        this.traceId = "|"+this.catId+"|"+0;
        console.log(this.traceId+'历史页面');
        bi.historyClick(this.assetId,this.typeid,this.traceId,"|1|6|",6,0,1,this.catId);

      },
      changeJson(jsonDB){
        this.historyList = jsonDB;
        let _tempArray = [];
        let _this = this;//  sort 作用域在windows下面需要注意
        let sortedObjKeys = Object.keys(this.historyList).sort(function(a, b) {
          return _this.historyList[b].recordTime - _this.historyList[a].recordTime;
        });
        for (let i in sortedObjKeys) {
          console.log(sortedObjKeys.hasOwnProperty(i));
          if(sortedObjKeys.hasOwnProperty(i)){
            _tempArray.push(this.historyList[sortedObjKeys[i]]);
          }
        }
        this.historyList  = _tempArray;
        console.log(this.historyList);
      },
      getquery(jsonDB){
        this.changeJson(jsonDB);
        let newFavorite = [];
        let  fList = this.historyList;
        for (let index = 0; index < fList.length; index++) {
          if(this.Data(fList[index].recordTime) == 0) {
            let favorite = {recordTime: "今天", list:[fList[index]]};
            newFavorite.push(favorite);
          }else if (this.Data(fList[index].recordTime) == 1){
            let favorite = {recordTime: "昨天", list:[fList[index]]};
            newFavorite.push(favorite);
          }else if (this.Data(fList[index].recordTime) == 2){
            let favorite = {recordTime: "前天", list:[fList[index]]};
            newFavorite.push(favorite);
          }else if (this.Data(fList[index].recordTime)>2){
            let favorite = {recordTime: "更早时间", list:[fList[index]]};
            newFavorite.push(favorite);
          }
        }
        this.favoriteList = newFavorite;
      },

      jsonfun(jsonDA){
        let newFavorites = [
          {recordTime: "今天", list:[]},
          {recordTime: "昨天", list:[]},
          {recordTime: "前天", list:[]},
          {recordTime: "更早时间", list:[]}];
        let newList = [];
        let fList = jsonDA;
        for (let i = 0;i < fList.length; i++) {
            if (newFavorites.length == 0){
              newFavorites.push(fList[i]);
            }else {
              for(let j = 0;j < newFavorites.length; j++){
                if(fList[i].recordTime == newFavorites[j].recordTime){
                  newFavorites[j].list.push(fList[i].list[0]);
                }
              }
//              if (fList[i].recordTime == newFavorites[newFavorites.length-1].recordTime){
//                newFavorites[newFavorites.length-1].list.push(fList[i].list[0]);
//              }
//              else {
//                newFavorites.push(fList[i]);
//              }
            }
        }
        for(let i =0;i < newFavorites.length;i++){
          if (newFavorites[i].list.length !=0){
            console.log(newFavorites[i].list);
            newList.push(newFavorites[i]);
          }
        }

        this.favoriteLists = newList;
      },

     getLocalTime(tm) {
       return new Date(tm).toLocaleString().replace(/\//g, "-");
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
            let url = this.favoriteLists[this.num].list[this.itemNo].layoutUrl;
            let Id =this.favoriteLists[this.num].list[this.itemNo].assetId;
            this.assetId = Id;
            console.log("专题ID"+this.assetId);
            this.$emit('pressLeft',this.isShow,this.name,"KeyEnter",url,Id,'详情',"|1|6|");
            this.typeid = 1;
            console.log("点击时候的typeid"+this.typeid);
            this.collectPage();
          }else {
            yh.removeHistory();
            this.json = JSON.parse(yh.queryHistory());
            this.json.reverse();
            this.getquery(this.json);
            this.jsonfun(this.favoriteList);
          }
        } else if (params == "KeyBack") {
          this.KeyBack();
        }
      }, KeyBack() {
        if(this.$route.query.jsonUrl!=undefined){
          yh.back();
        }else{
          this.$router.go(-1);
        }
        this.isShow = false;
        this.removeCss();
        this.itemNo=-1;
        this.isShow = false;
        this.$emit('pressLeft', this.isShow,this.name,"left");
        $('.remove').removeClass('removechange');
        this.num = 0;
        $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
        $('.actor-right').css({'transition':'all 0.1s','transform':'translateY(-'+ 360*this.num +'px)'});
        $('.remove').removeClass('removechange');
      },down() {
        this.removeCss();
        this.num++;
        this.itemNo =0;
        $('.remove').removeClass('removechange');
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
          this.$emit('pressLeft', this.isShow,this.name,"left")
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
//        线上
        try {
          this.json = JSON.parse(yh.queryHistory());
          this.json.reverse();
        }catch (error){
          console.log(error);
        }

          this.getquery(this.json);
          this.jsonfun(this.favoriteList);
          this.isShow = bl;
          if(bl){
            this.removeCss();
            this.num = 0;
            this.itemNo = 0;
            this.addCss();
            $('#a'+this.num+' .actorImgs').css({'transition':'all 0.3s','transform':'translateX(-'+ 175*this.itemNo +'px)'});
            $('.actor-right').css({'transition':'all 0.1s','transform':'translateY(-'+ 360*this.num +'px)'});
            $('.remove').removeClass('removechange');
          }
          if(name == 'remove'){
            if(pos == 'keyEnter'){
              this.typeid = 2;
              console.log("删除历史时候的typeid"+this.typeid);
              console.log(this.traceId,"|1|5|",5,0,1,this.catId,this.assetId,this.traceId,"|1|",'',this.typeid);
              this.collectPage();
            }
          }

      },
      Data(gettime){
        let newtime =new Date(new Date().setHours(0,0,0,0));
        var timestamp = Date.parse(newtime);
        let timeout = Math.ceil((timestamp-gettime)/86400000);
        return timeout;
      },
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
