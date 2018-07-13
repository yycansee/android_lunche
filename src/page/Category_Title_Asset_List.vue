<template>
    <div class="assetList">
      <h2>{{title}}</h2>
      <ul>
        <li  v-for="(item,index) in specialList" v-if="index<11" :key="item.id" :id="('assetList_'+eleId+'_'+index)"
             >
          <!-- <img :src="item.elementImg"> -->
          <!-- <img :data-src="item.elementImg" v-imgLazy:assetList="2" >  -->
          <lazy-image
                :src='item.elementImg'
                :placeholder='placeholder'
                :initScore = 'initScore'
                :score = "item.score"
                :title = "item.elementName"
                 />
        </li>
        <li :id="('assetList_'+eleId+'_11')">
            <div style="height:100%"><img src="../assets/assetListMore.png" /></div>
        </li>
      </ul>
        <keyDo v-on:listenKeyCode="keyCode"  v-if="isShow"></keyDo>
    </div>
</template>
<style>
    h2{
  font-size:30px;
  margin-bottom: 35px;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}
.assetList{
  position: relative;
  width: 1227px;
  min-height: 580px;
  margin-top: 15px;
}
.assetList li{
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  width: 160px;
  height: 233px;
  box-sizing: border-box;
}
.assetList img{
  width: 100%;
  height: 100%;
}
.assetList .hover{

  border: 4px solid #FFF;
  transform: scale(1.1);
  box-shadow:0px 10px 20px rgba(0, 0, 0, 0.55);
}
</style>
<script>
    import {bp as bi} from '../js/ga.js'
    export default {
        props:['initData','catCode','catId'],
        name:'assetList',
        data(){
          return{
            title:'',
            name:'assetList',
            placeholder:require('../assets/img_loading_160x230.png'),
            initScore:require('../assets/corner_mark.png'),
            itemNo:0,
            position:0,
            isShow:false,
            isEnd:false,
            specialList:[],
            eleId:'',
            pos:'',
            timer:0,
            pageId:0,
          }
        },
        beforeMount(){
          this.specialList = this.initData.elementList;
          this.eleId = this.initData.specialId;//默认数据第一个为组件内的id
          this.name = 'assetList_'+this.initData.specialId;//默认数据第一个为组件名字
          this.title = this.initData.specialName;//默认标题
        },updated(){

      },mounted(){

      },
        methods: {
            keyCode(kc) {
                if (kc == "KeyBack") {
                    this.back();
                }else if(kc == "right"){
                  this.right();
                }else if(kc == "left"){
                  this.left();
                }else if(kc == "down"){
                  this.down();
                }else if(kc == "up"){
                  this.up();
                }else if(kc == "KeyEnter"){
                    let pageType = this.$route.name;
                    if(pageType == 'index'){
                        try {
                            let sp = "";
                            if(this.itemNo==11){
                              sp = "";
                            }else{
                              sp = this.specialList[this.itemNo].elementId;
                              this.pageId = "|"+this.catId;

                            }
                            let traceId = "|"+this.catId+"|"+sp;
                            let traceType = "|1|";
                            bi.categoryClick(this.catId, sp, 3, 1, this.catId, traceId, traceType);
                        } catch (error) {
                          console.log(error);
                        }
                     }
                     let url = "";
                     if(this.itemNo == 11){
                       url = this.initData.jsonUrl;
                       this.$router.push({name:"hotTopics",params:{jsonUrl:url,catCode:1,catId:this.catId}});
                     }else{
                       url = this.specialList[this.itemNo].jsonUrl;
                       this.$router.push({name:"detail",params:{jsonUrl:url,catCode:1,catId:this.parentId,parent:1,parentId:this.catId}});
                     }
                }
            }, back() {
              this.removeCss();
              this.isShow = false;
              this.$emit('pressDown', this.isShow,this.eleId,"back");
            },down(){
              if(this.itemNo<=5){
                this.removeCss();
                this.itemNo+=6;
                this.addCss();
                let eleH = this.cEleOffsetTop('#assetList_'+this.eleId+"_"+this.itemNo+' img');
                this.$emit('eleScroll',this.name,"down",eleH);
              }else{
                if(!this.isEnd){
                  this.removeCss();
                  this.isShow = false;
                  this.$emit('pressDown', this.isShow,this.eleId,"down");
                }
              }
          },up(){
            if(this.itemNo>5){
              this.removeCss();
              this.itemNo-=6;
              this.addCss();
              let eleH = this.cEleOffsetTop('#assetList_'+this.eleId+"_"+this.itemNo+' img');
              this.$emit('eleScroll',this.name,'up',eleH);
            }else{
              this.removeCss();
              this.isShow = false;
              this.$emit('pressDown', this.isShow,this.eleId,"up");
            }


          },left(){
              if(this.itemNo==0 || this.itemNo == 6)return;
                this.removeCss();
                this.itemNo--;
                this.addCss();
          },right(){
            if(this.itemNo==11||this.itemNo==5)return;
            this.removeCss();
            this.itemNo++;
            this.addCss();
          },addCss(){
            $('#assetList_'+this.eleId+"_"+this.itemNo).addClass('hover');
              let p_title = $('#assetList_'+this.eleId+"_"+this.itemNo+' .s-title-name').text();
              if(p_title.length>=8){
                let id = '#assetList_'+this.eleId+"_"+this.itemNo;
                let speed = 40;
                let that = this;
                let tab =  document.querySelector(id+' .s-title');
                let tab1 =  document.querySelector(id+' .s-title-name');
                let tab2 =  document.querySelector(id+' .s-title-temp');
                tab.style.textOverflow = 'clip';
                tab2.innerHTML = tab1.innerHTML;
                this.timer = setInterval(function(){
                  that.Marquee(tab,tab1,tab2)
                },speed);
              }
          },removeCss(){
            if(this.timer!=0){
              clearInterval(this.timer);
              let id = '#assetList_'+this.eleId+"_"+this.itemNo;
              let tab = document.querySelector(id+' .s-title');
              if(tab!=undefined){
                tab.scrollLeft = 0;
                tab.style.textOverflow = 'ellipsis';
              }
            }
            $('#assetList_'+this.eleId+"_"+this.itemNo).removeClass('hover');
          },updateStast(bl,pos,isEnd){
            this.isShow = bl;
            this.pos = pos;
            if(pos=="down" && this.itemNo>5&&isEnd==false){
              this.itemNo = 0;
            }
            if(bl){
              //console.log(this.name,bl,pos,isEnd);
              this.addCss();
              let eleH = this.cEleOffsetTop('#assetList_'+this.eleId+"_"+this.itemNo+' img');
              this.$emit('eleScroll',this.name,this.pos,eleH);
            }
          },cEleOffsetTop(ele){
            let fEleDistance = $(ele).offset().top;
            //console.log("元素距离文档顶部的距离:"+fEleDistance);
            //console.log(this.name,"元素距离文档顶部的距离:"+(fEleDistance+258));
            let realHeight = fEleDistance+258;
            return realHeight;
          },Marquee(tab,tab1,tab2){
              if(tab2.offsetWidth - tab.scrollLeft <=0){
                  // tab.scrollLeft -= tab1.offsetWidth;
                  tab.scrollLeft  = 0; // 上面的写法会导致滚动时突然抖动
              }else{
                  tab.scrollLeft++;
              }
            }
        },
        components: {

        },watch:{
          initData(){
            this.specialList = this.initData.elementList;
            // 数据更新组件id也需要更新
            this.specialList = this.initData.elementList;
            this.eleId = this.initData.specialId;//默认数据第一个为组件内的id
            this.name = 'assetList_'+this.initData.specialId;//默认数据第一个为组件名字
            this.title = this.initData.specialName;//默认标题
          }
        }
    }
</script>
