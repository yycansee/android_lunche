<!--详情页——双层选集层-->
<template>
  <div style="margin-top: -140px;margin-left: 40px; box-sizing: border-box;margin-bottom: 40px" class="pt" >
    <div class="ption-top " id="pt1">
      <div class="ptionL1"></div>
      <div class="ptionx">
        <p v-for="(item,index) in this.a" :key="item.id" v-if="index>=0" :id="('a'+index)" class="text_num">
          {{item-1}}1-{{item}}0
        </p>
        <p class="text_num" :id="('a'+this.a)" v-if="this.acc>(this.a*10)+1">{{(this.a*10)+1}}-{{this.acc}}</p>
      </div>
    </div>
    <div class="ru"></div>
    <div class="ption-top border-ption" id="pt2">
      <div class="ptionL2  backchange"></div>
      <div class="ption">
        <p v-for="(item,index) in top" :key="item.id" v-if="index>=0" :id="('c'+index)" class="text_num">
          {{top[index].episode}}
        </p>
      </div>
    </div>
    <keyDo v-on:listenKeyCode="keyCode" v-if="isShow"></keyDo>
  </div>

</template>

<style>
  .ru{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    margin-top: 5px;
    margin-left: 545px;
  }
  .ption-top.border-ption{
    background: rgba(255,255,255,0.5);
    /*margin-left: -4px;*/
    /*margin-top: -8px;*/
  }
  .ption-top{
    width: 1040px;
    height: 44px;
    position: relative;
    overflow: hidden;
    margin-top: 3px;
    border-radius: 5px;
    background: linear-gradient(to left, rgba(255,255,255,0.01) 0%,rgba(255,255,255,0.5) 50%,rgba(255,255,255,0.01) 100%);
    /*box-sizing: border-box;*/
  }
  .ption{
    width: 10000%;
    height: 46px;
    overflow: hidden;
    position: absolute;
    left: 500px;
    top:0;
    transition: all 0.01s;
  }
  .ptionL{
    text-align: center;
    opacity:0.66;
    background: white;
    width: 100px;
    height: 46px;
    position: absolute;
    left: 500px;
    top: 0;
  }
  .ption .text_num{
    width: 100px;
    height: 46px;
    font-family:PingFangSC-Regular;
    font-size:18px;
    text-align:center;
    float: left;
    line-height: 46px;
  }
  .ptionx{
    width: 1000%;
    height: 46px;
    overflow: hidden;
    position: absolute;
    left: 500px;
    top:0;
    transition: all 0.7s;
  }
  .ptionL1,.ptionL2{
    text-align: center;
    opacity:0.66;
    background: white;
    width: 100px;
    height: 44px;
    /*margin-top: 2px;*/
    position: absolute;
    left: 500px;
    top: 0;
    box-sizing: border-box;
  }
  .backchange{
    background: #A36363;
    /*box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);*/
    border: solid 4px white;
    /*margin-top: -2px;*/
    /*margin-top: -4px;*/
    /*border: 4px solid white;*/
    /*box-shadow: 0 10px 20px rgba(0, 0, 0, 0.55);*/
    /*box-sizing: border-box;*/
  }
  .ptionx .text_num{
    width: 100px;
    height: 46px;
    font-family:PingFangSC-Regular;
    font-size:18px;
    text-align:center;
    float: left;
    line-height: 46px;
  }


</style>

<script>
  import { mapGetters } from 'vuex'
  import { client as yh} from '../../js/client.js'
  import {bp as bi} from '../../js/ga.js'
  import c from '../../js/common.js'
  export default {
    props:['initData','jsonUrl',"catCode","catId","parent","parentId","backIng"],
    data() {
      return {
        name:'ption',
        op:1,
        itemNo: 0,
        num: 0,
        eleId:"",
        a:0,
        showl:true,
        isShow:true,

//        numm:parseInt(this.episodes/10),
      top:
          [
            {
              episode: "",
            }
          ],
        acc:{
          episodes:''
        }
      }
    },
    computed: {
      ...mapGetters([
        'behindParams',
      ])
    },
    created(){
      this.top = this.initData.data.itemList;
      this.acc = this.initData.data.itemList.length;
      this.numm = parseFloat(this.acc);
      this.a = Math.floor(this.numm/10);
      console.log(this.a+'xuanruan');

    },
    updated(){
      this.top = this.initData.data.itemList;
      this.acc = this.initData.data.itemList.length;
      this.numm = parseFloat(this.acc);
      this.a = Math.floor(this.numm/10);
      console.log(this.a+'每次数据刷新');
      this.eleId = this.top[0].itemId;
    },
//    mounted() {
//      console.log(this.initData.data.itemList.length+'womende');
//      this.top = this.initData.data.itemList;
//      this.acc = this.initData.data.itemList.length;
//      this.numm = parseFloat(this.acc);
//      this.a = Math.floor(this.numm/10);
//      console.log(this.a);
//    },

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
        }else if(kc=='KeyEnter'){
          this.KeyEnter();
        }
      },
      back() {
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
      },
      right() {
        if (this.op==0) {
          if(this.acc>(this.a*10)+1){
            if (this.itemNo>=this.a)return;
          }else {
            if (this.itemNo>=this.a-1)return;
          }
          this.itemNo+=1;
          this.num=10*this.itemNo;
          $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'})
          $('.ption').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.num +'px)'});
        }
        if(this.op==1){
          $('.ptionL2').addClass('backchange');
          $('.ptionL1').removeClass('backchange');
          if (this.num>=this.top.length-1)return;
          this.num++;
          $('.ption').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.num +'px)'});
        }
        for(let i = 0;i<this.a+1;i++){
          if(this.num == i*10){
            console.log(i);
            this.itemNo = i;
            this.trans();
          }
        }
      },
      trans(){
        $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
      },
      left() {
        if (this.op==1) {
          if (this.num>0){
            this.num--;
            $('.ption').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.num +'px)'});

            if (this.num<=9){
              this.itemNo=0
              $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            }else if (this.num==10) {
              this.itemNo = 1
              $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            }if (this.num==20) {
              this.itemNo = 2
              $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            }if (this.num==30) {
              this.itemNo = 3
              $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            }if (this.num==40) {
              this.itemNo = 4
              $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            }
          }
        }
        if (this.op==0){
          if (this.itemNo>0){
            this.itemNo--;
            this.num=10*this.itemNo;
            $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            $('.ption').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.num +'px)'});
          }else {
            this.itemNo=0;
            this.num=0
            $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
            $('.ption').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.num +'px)'});
          }
        }
      },
      up() {
        $('.ptionL1').addClass('backchange');
        $('.ptionL2').removeClass('backchange');
        $('#pt1').addClass('border-ption');
        $('#pt2').removeClass('border-ption');
        this.op -= 1;
        if (this.op < 0) {
          this.isShow = false;
          this.op = 0
          this.$emit('pressDown', this.isShow, "ption", "up", "100");
          // let eleH = this.cEleOffsetTop('.pt');
          // this.$emit('eleScroll',"ption",'up',eleH);
          $('#pt1').removeClass('border-ption');
          $('#pt2').removeClass('border-ption');
          $('.ptionL1').removeClass('backchange');
          $('.ptionL2').removeClass('backchange');
        }
      },
      down() {
        $('.ptionL2').addClass('backchange');
        $('.ptionL1').removeClass('backchange');
        $('#pt2').addClass('border-ption');
        $('#pt1').removeClass('border-ption');
        this.op += 1;
        if (this.op > 1) {
          this.isShow = false;
          this.op = 1;
          this.$emit('pressDown', this.isShow, "ption", "down");
          // let eleH = this.cEleOffsetTop('.pt');
          // this.$emit('eleScroll',"ption",'down',eleH);
          $('#pt1').removeClass('border-ption');
          $('#pt2').removeClass('border-ption');
          $('.ptionL1').removeClass('backchange');
          $('.ptionL2').removeClass('backchange');

        }
      },
      updateStast(bl,pos) {
        this.isShow = bl;
        if(pos=='KeyEnter'){
          this.op = 1;
          $('#pt2').addClass('border-ption');
          $('.ptionL2').addClass('backchange');
        }
        if(bl){
          if(this.op==1){
            $('#pt2').addClass('border-ption');
            $('.ptionL2').addClass('backchange');
          }else {
            $('#pt1').addClass('border-ption');
            $('.ptionL1').addClass('backchange');

          }
        }
      },
      cEleOffsetTop(ele) {
        let fEleDistance = $(ele).offset();
        let realHeight = fEleDistance.top+450;
        return realHeight;
      },KeyEnter(){
        if(this.op ==1){
          let tempUrl = this.jsonUrl.replace('https://winnow-bds.yanhuamedia.tv','http://winnow-ds.yanhuamedia.tv');
           try {
               let id = this.initData.data.itemList[this.num].itemId;
               let pageId =this.initData.data.assetId;
               let traceId = "|"+this.catId;
               let traceType = "|"+this.catCode;
               bi.categoryClick(this.catId,id,5,31,pageId,traceId,traceType);
           } catch (error) {
               console.log("埋点异常");
           }
//          let met = yh.playHistory(this.initData.data.assetId);
//          if(c.isAllNull(met)){// 历史记录为空时
//            obj ={index:this.num,startTime:0,jsonUrl:tempUrl};
//          }else{
//            if(typeof(met)=="string"){
//              met = JSON.parse(met);
//            }
//            if(met.episode-1 == this.num){
//              obj = {index:this.num,startTime:met.watchTime,jsonUrl:tempUrl};
//            }else {
//              obj ={index:this.num,startTime:0,jsonUrl:tempUrl};
//            }
//          }
          // if(met){
          //   console.log(JSON.parse(met.watchTime)+'是否记录时间传入');
          //    obj = JSON.stringify({index:this.num,startTime:met.watchTime,jsonUrl:tempUrl});
          // }else {
          //    obj = JSON.stringify({index:this.num,startTime:0,jsonUrl:tempUrl});
          // }
//          console.log("detail:"+JSON.stringify(obj));
//          yh.play(JSON.stringify(obj));
//          let url = 'hwplay.jsp?code'+'21000001000000010000000013493183'+'videotype=hw&backurl=<=backurl%>" >H265_4K_VBR_20Mbps_Level5.1_AC3_new
          let backurl = window.location.href;
          let code = '00000001000000010000000054007719';
          let videotype = localStorage.getItem('adorignal');
          let obj = {router:this.$router,backurl:backurl,code:code,videotype:videotype};
          yh.play(obj);
        }

      }
    },
    watch:{
      initData(){
        this.top = this.initData.data.itemList;
        this.acc = this.initData.data.itemList.length;
        this.eleId = this.top[0].itemId;
        this.numm = parseFloat(this.acc);
        this.a = Math.ceil(this.numm/10);
        this.op = 1;
        this.itemNo = 0;
        this.num = 0;
        $('.ptionx').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.itemNo +'px)'});
        $('.ption').css({'transition':'all 0.3s','transform':'translateX(-'+ 100*this.num +'px)'});
      }
    },
      components: {
      }

    }

</script>
