<template>
  <div>
      <component v-for="(item,index) in child" :is="item.ele" :key="index" v-on:pressDown="keepDo"
                 v-on:eleScroll="changeHeight" ref="childDo" :cat-code="catType" :cat-id="focusId" :initData="item.childData"></component>
    </div>
</template>
<style scoped="series">
  .box {
    margin-left: -20px;
    margin-top: -50px;
    position: absolute;
    width: 1227px;
    height: 663px;
    overflow: hidden;
    background-color: #A8977C;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .scroll-box {
    position: relative;
  }
</style>
<script>
  import categoryTop from './Category_Home_Top.vue'
  import categorySubject from './Category_Game_Subject_List.vue'
  import categoryListNotMore from './Category_Title_Asset_List_Not_More.vue'
  import categoryList from './Category_Title_Asset_List.vue'
  import categoryTag  from './Category_Game_Tag_List.vue'
  import {MT,fc} from '../json/modelType.js'
  import {mapGetters} from 'vuex'
  import {HTTPUtil as api} from '../fetch/api.js'
  import {bp as bi} from '../js/ga.js'
  import {authFunction as auth} from '../js/auth.js'

  export default {
    props:['categoryData','focusId','lastId'],
    name:'recommond',
    data() {
      return {
        name:'recommond',
        currentView: 'recommond',
        currentC: 0,
        componentsId: [],
        pageSize: 0,
        child: [],
        cheight:[],
        catType:"",
        firstLoad:true,
      }
    },computed: {
      ...mapGetters([
        'category',
        'behindParams',
        'isHTTPS',
        'startTime',
        'httpRequestTime',
        'httpResponseTime'
      ])
    },beforeCreate(){
      this.$store.commit('GET_STARTTIME',new Date().getTime());
    },mounted(){
    },activated(){
       this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
    },updated(){
       this.$nextTick(function() {
        this.$lazyImages.loadImage();
       })
    },created() {
      if(!this.categoryData)return;
      this.initData(this.categoryData);
      this.catType = this.categoryData.catCode;
    },
    methods: {
      initData(cData){
        console.log("this.httpRequestTime^^^^"+this.httpRequestTime);
        // httpRequestTime = new Date().getTime();
        this.$store.commit('GET_HTTPREQUESTTIME',new Date().getTime());
        try {
          if(this.httpResponseTime!=0){
           let overTime = 0;
           overTime =  new Date().getTime() - this.httpResponseTime;
           bi.closPage(this.lastId,1,1,this.lastId,0,0,0,overTime)
           console.log("页面停留时间："+overTime+"^^^^^^^lastId:"+this.lastId);
          }
        } catch (error) {
          console.log(error)
        }
        let _this = this;
        document.title =  cData.catName;
        if(cData.jsonUrl==undefined)return;
        let curl = cData.jsonUrl + this.behindParams;
        if(this.isHTTPS && curl.indexOf('https')<0 ){
          curl =   curl.replace('http','https');
        }
        api.get(curl).then((response)=>{
          let components = [];
          let componentsName = [];
          let specialList = response.data.specialList;
          for (let i = 0; i < specialList.length; i++) {
             let cName = fc(specialList[i].layout);
            if (cName =="categoryTop") {
              components.push({ele: 'categoryTop', childData: specialList[i]});
              componentsName.push(specialList[i].specialId);
            } else if (cName == "categoryList") {
              if(specialList[i].layout == "Category_Game_Subject_List"){
                     let tp1 = fc(specialList[i].elementList[0].layout);
                      if(tp1=="categorySubject"){
                          components.push({ele: 'categorySubject', childData: specialList[i]});
                          componentsName.push(specialList[i].specialId);
                      }
              }else if(specialList[i].layout == "Category_Game_Tag_List"){
                    components.push({ele: 'categoryTag', childData: specialList[i]});
                    componentsName.push(specialList[i].specialId);
              }else if(specialList[i].layout == "Category_Title_Asset_List"){
                    components.push({ele: 'categoryList', childData: specialList[i]});
                    componentsName.push(specialList[i].specialId);
              }else if(specialList[i].layout == "Category_Title_Asset_List_Not_More"){
                 components.push({ele: 'categoryListNotMore', childData: specialList[i]});
                    componentsName.push(specialList[i].specialId);
              }
            }
          }
          _this.child = components;
          _this.componentsId = componentsName;
        },(response)=>{
            console.log("请求二级栏目推荐数据失败",response);
        })
      },
      keepDo(bl, name, pos) {
          //console.log("组件上传信息");
          //console.log(bl, name, pos);
          // 从非导航条控制权转移
          let childComponents = this.$refs.childDo;
          let componentsSize = childComponents.length - 1;
          //console.log(childComponents.length);
          if (pos =="back"){
            $('.scroll-box').stop(false,true).animate({'top':'0px'},200);
            this.$emit('navigation',this.name,this.pos,true);
            this.pageSize = 0;
            this.cheight =[];
          }
          for (let i = 0; i < childComponents.length; i++) { //遍历组件ref 给对应的组件排序
            if (name == childComponents[i].eleId) {// 当对应组件上下没有焦点时会抛出控制权，此时父组件需要根据子组件抛出的信息来决定控制权交给其他父组件
              //console.log("已找到对应的组件"+index+"pos===="+pos);
              let _num = this.componentsId.indexOf(name);//判断当前抛出键值的组件在数组中的位置
             // console.log("当前组件在数组中的第:"+this.componentsId.indexOf(name),this.componentsId.length);
              if (pos == "down") {
                if(_num==componentsSize){
                  // console.error("已经到最后一个组件啦");
                  this.getChildRef(name).updateStast(true, pos, true);
                }else{
                  let _cdown = this.componentsId[_num+1];
                  this.getChildRef(_cdown).updateStast(true, pos, false);
                }
              } else if (pos == "up") {
                if(_num==0){
                   this.$emit('navigation',this.name,this.pos,true);
                  $('.scroll-box').stop(false,true).animate({'top':'0px'},200);
                }else {
                  let _cdown = this.componentsId[_num-1];
                  this.getChildRef(_cdown).updateStast(true, pos, false);
                }
                /* if (i == 0) {
                  childComponents[i - 1].updateStast(true, pos, false);
                } */
              }
              break; // 找到组件需终止循环foreach则不会，需要抛异常才会终止
            }
          }
      },getChildRef(id){// 根据元素ID查找ref中的组件
          // console.log("getChildRef:"+id);
          let childComponents = this.$refs.childDo;
          for(let i=0;i<childComponents.length;i++){
              if(id==childComponents[i].eleId){
                return childComponents[i];
              }
          }
      },changeHeight(name, pos, height) {
            // console.log(name,pos,height);
            let scrollY  = $('.scroll-box').position().top-57;
            let ebox = document.getElementsByClassName('scroll-box')[0];
            let _this =  this;
        if($('.scroll-box').is(":animated")){return}
        if(pos=='down'){
              if(height>700){
                // console.log('height:'+height);
                // console.log('scrollY:'+scrollY);
                let _temp = height-640;
                scrollY -= _temp;
                // console.log("向下需要滚动的距离："+_temp);

                $('.scroll-box').stop(false,true).animate({'top': scrollY+'px'},250,function(){
                   _this.cheight.push(_temp);
                   _this.pageSize++;
                  // console.log(_this.cheight);
                });
                // $('.scroll-box').css({'transition':'all 0.1s','transform':'translateY('+ scrollY +'px)'});
                // console.log("down-pageSize:"+this.pageSize);
              }
            }else if(pos=='up'){

              // console.log('up子组件元素的高度:'+height);
              if(this.pageSize==0){
                 this.pageSize = 0;
                 this.cheight =[];
                 $('.scroll-box').stop(false,true).animate({'top':'0px'},200);
                return
              };
              // console.log("向上需要滚动的距离:"+this.cheight[this.pageSize-1]);
              scrollY += this.cheight[this.pageSize-1];
              $('.scroll-box').stop(true,true).animate({'top':scrollY+'px'},100,function(){
                     _this.cheight.splice((_this.pageSize-1),1);
                     _this.pageSize--;
              });

  }
      },updateStast(bl,pos,isEnd){
        let cs = this.$refs.childDo;
        for(let i=0;i<cs.length;i++){
          if(this.componentsId[0]==cs[i].eleId){
            cs[i].updateStast(true, pos, false);
            return;
          }
        }
      }
    },
    components: {
       categoryTop, categorySubject, categoryList,categoryTag,categoryListNotMore
    },watch:{
      categoryData(){
       // console.log("update:"+JSON.stringify(this.categoryData));
        this.initData(this.categoryData);
        this.catType = this.categoryData.catCode;
        this.$lazyImages.loadImage();
      },child(){
        this.$nextTick(function(){
          console.log('是否是第一次进入页面：'+this.firstLoad);
          console.log('栏目数据获取完毕httpResponseTime'+this.httpResponseTime);
          // httpResponseTime = new Date().getTime();
          this.$store.commit('GET_HTTPRESPONSETIME',new Date().getTime());
          let overTime =0;
          if(this.firstLoad){
              overTime =  this.httpResponseTime - this.startTime;
              console.log("第一次加载");
              this.firstLoad = false;
          }else{
              overTime =  this.httpResponseTime - this.httpRequestTime;
          }
           console.log("页面加载完成时间："+overTime+"*******是否第一次加载页面："+this.firstLoad);
           bi.loadPage(this.focusId,1,1,this.focusId,0,0,0,overTime);
        })
      }
    },beforeRouteLeave(to, from, next){
      try {
           this.$store.commit('GET_STARTTIME',new Date().getTime());
           console.log("开始时间被重置"+this.startTime);
           let overTime = 0;
           overTime =  new Date().getTime() - this.httpResponseTime;
           bi.closPage(this.focusId,1,1,this.focusId,0,0,0,overTime)
           console.log("页面停留时间："+overTime+"^^^^^^^focusId:"+this.focusId);
      } catch (error) {
           console.log(error);
      }finally{
           next();
      }
    }
  }
</script>
