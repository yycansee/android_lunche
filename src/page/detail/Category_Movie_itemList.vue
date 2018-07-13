<!--详情页——单选集层-->
<style scoped="itemList">

  .ption-top.border-ption{
    background: rgba(255,255,255,0.6);
  }
  .backchange{
    background: #A36363;
  }
  .ption-top{
    width: 1080px;
    height: 70px;
    position: relative;
    overflow: hidden;
    margin-top: 3px;
    border-radius: 5px;
    background: linear-gradient(to left, rgba(255,255,255,0.01) 0%,rgba(255,255,255,0.4) 50%,rgba(255,255,255,0.01) 100%);
    box-sizing: border-box;
  }
  .ptionx{
    width: 1000%;
    height: 70px;
    overflow: hidden;
    position: absolute;
    left: 450px;
    top:0;
    transition: all 0.1s;
  }
  .ptionx:after{
    clear: both;
    content: '';
    display: block;
  }
  .ptionL{
    text-align: center;
    opacity:0.66;
    background: white;
    width: 200px;
    height: 100%;
    position: absolute;
    left: 450px;
    top: 0;
    box-sizing: border-box;
  }
  .ptionx .text_num{
    width: 200px;
    height: 70px;
    font-family:PingFangSC-Regular;
    font-size:18px;
    text-align:center;
    float: left;
    line-height: 68px;
    color: #ffffff;
    position: relative;
  }
  .s-title{
    width: 100%;
    /*position:absolute;*/
    left: 0;
    display: inline-block;
    z-index:99;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    color: white;
  }
  .s-title-name,.s-title-temp{display:inline;}
  .s-title-temp{padding-left:25px;}
</style>

<template>
  <div style="box-sizing: border-box;margin-top: -110px;margin-left: 18px;margin-bottom: 60px"  class="pt" >
    <div class="ption-top border-ption" id="pt1">
      <div class="ptionL" style=" background: #A36363;border: 4px solid #ffffff"></div>
      <div class="ptionx">
        <div v-for="(item,index) in itemName" v-if="index>=0" :key="item.id" :id="('c'+index)" class="text_num">
          <div class="s-title">
            <div class="s-title-name">{{item}}</div>
            <div class="s-title-temp"></div>
          </div>
        </div>
      </div>
    </div>
    <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'
  export default {
    props:['initData','jsonUrl',"catCode","catId","parent","parentId"],
    data() {
      return {
        name:'itemList',
        itemNo: 0,
        num: 0,
        showl:true,
        isShow:true,
        timer:0,
        top:
          [
            {
              episode: ''
            }
          ],
        itemName:[]
      }
    },
    computed: {
      ...mapGetters([
        'behindParams',
      ])
    },
    mounted() {
      this.top = this.initData.data.itemList;
      for(let i = 0;i < this.top.length;i++){
//        let item = this.top[i].itemName.substring(this.top[i].itemName.length-10);
        let item = this.top[i].itemName;
        this.itemName.push(item);
      }
      this.$nextTick(function () {
        this.removeCss();
        this.addCss();
      });
    },
//    updated(){
//      this.removeCss();
//      this.addCss();
//    },
//    activated(){
//      this.removeCss();
//      this.addCss();
//    },
    created(){
      console.log("集数初始化");

    },
    methods: {
      keyCode(kc) {
        if (kc == "KeyBack") {
          this.back();
        } else if (kc == "right") {
          this.right();
        } else if (kc == "left") {
          this.left();
        } else if (kc == "down") {
          this.down();
        } else if (kc == "up") {
          this.up();
        }else if(kc=="KeyEnter"){
          this.KeyEnter();
        }
      }, back() {
        this.removeCss();
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
      }, right() {
        this.removeCss();
        if (this.num>= this.top.length-1)return;
        this.num+=1;
        $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 200*this.num +'px)'});
        this.addCss();
      },
      left() {
        this.removeCss();
        this.num--;
        $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 200*this.num +'px)'});
        if (this.num<=0){
          this.num=0;
          $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 200*this.num +'px)'})
        }
        this.addCss();
      },
      up() {
        $('#pt1').removeClass('border-ption');
        $('.ptionL').css('background','white');
        this.isShow = false;
        this.$emit('pressDown', this.isShow, "itemList", "up");
        let eleH = this.cEleOffsetTop('.ptionL');
        this.$emit('eleScroll',"itemList",'up',eleH);
        this.removeCss();
      },
      down() {
        $('#pt1').removeClass('border-ption');
        $('.ptionL').css('background','white');
        this.isShow = false;
        this.$emit('pressDown', this.isShow, "itemList", "down");
        let eleH = this.cEleOffsetTop('.pt');
        this.$emit('eleScroll',"itemList",'down',eleH);
        this.removeCss();
      },
      updateStast(bl) {
        this.isShow = bl;
        if(bl){
          this.addCss();
          $('#pt1').addClass('border-ption');
          $('.ptionL').css('background','#A36363');
        }
      },
      addCss(){
        let p_title = $('.ptionx .text_num:eq('+this.num+') .s-title-name').text();
        if(p_title.length>=8){
          let id = '.text_num';
          let speed = 30;
          let that = this;
          let tab =  document.querySelectorAll(id+' .s-title')[this.num];
          let tab1 =  document.querySelectorAll(id+' .s-title-name')[this.num];
          let tab2 =  document.querySelectorAll(id+' .s-title-temp')[this.num];
          tab.style.textOverflow = 'clip';
          tab2.innerHTML = tab1.innerHTML;
          this.timer = setInterval(function(){
            that.Marquee(tab,tab2);
          },speed);
        }
      },
      Marquee(tab,tab2){
        if(tab2.offsetWidth - tab.scrollLeft < 20){
          tab.scrollLeft  = 0; // 上面的写法会导致滚动时突然抖动
        }else{
          tab.scrollLeft++;
//          if (tab2.offsetWidth - tab.scrollLeft < 2){
//            tab.scrollLeft  = 0; // 上面的写法会导致滚动时突然抖动
//          }
        }
      },
      removeCss(){
        if(this.timer!=0){
          clearInterval(this.timer);
          this.timer = 0;
          let id = '.text_num';
          let tab = document.querySelectorAll(id+' .s-title')[this.num];
          document.querySelectorAll(id+' .s-title-temp')[this.num].innerHTML="";
          tab.scrollLeft = 0;
          tab.style.textOverflow = 'ellipsis';
        }
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
      play(){

      },
      cEleOffsetTop(ele) {
        let fEleDistance = $(ele).offset();
        let realHeight = fEleDistance.top + 70;
        return realHeight;
      },KeyEnter(){
        let tempUrl = this.jsonUrl.replace('https://winnow-bds.yanhuamedia.tv','http://winnow-ds.yanhuamedia.tv');
//        let obj = JSON.stringify({index:this.num,startTime:0,jsonUrl:tempUrl});
        let id = this.initData.data.itemList[this.num].itemId;
        let pageId =this.initData.data.assetId;
        let traceId = this.catId;
        let traceType = this.catCode;
        //      bp.categoryClick = function (cat_id, cat_elements, click_type, pageType, pageId, traceId, traceType)
        bi.categoryClick(this.catId,id,3,31,pageId,traceId,traceType);
        console.log(this.catId,id,5,31,pageId,traceId,traceType+'点击事件');
//        yh.play(obj);
        this.getUse();


      }
    },
    components: {

    },
    watch:{
      initData(){
        this.top = this.initData.data.itemList;
        this.itemName =[];
        this.num = 0;
        $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 200*this.num +'px)'})
        for(let i = 0;i < this.top.length;i++){
//          let item = this.top[i].itemName.substring(this.top[i].itemName.length-10);
          let item = this.top[i].itemName;
          this.itemName.push(item);
        }
      }
    }
  }
</script>
