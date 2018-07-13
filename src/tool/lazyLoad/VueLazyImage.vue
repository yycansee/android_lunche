<template>
  <div class="imglazy">
    <div class="score" v-if="score" :style="{backgroundImage:'url('+initScore+')'}" >{{score}}</div>
    <img
      ref="target"
      :class="_class"
      :data-src="src"
      :src="placeholder"
      width="100%"
      height="100%"
    >
    <div class="s-title" v-if="title">
      <div class="s-title-name">{{title}}</div>
      <div class="s-title-temp"></div>
    </div>

  </div>
</template>
<style scoped>
  .imglazy{
    position: relative;
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    border: 1px rgba(255, 255, 255, 0.5) solid;
  }
  div{height:100%}
  .score{
    position:absolute;
    display:inline-block;
    z-index:99;
    width:50px;
    height:60px;
    top:0px;
    right:0px;
    color:#DF9720;
    text-align:center;
    line-height:23px;
    padding-left:17px;
    box-sizing: border-box;
    /*border-radius: 0px 10px 10px 0px;*/
  }
  .change{
    position:absolute;
    top:0px;
    left:100px;
    border-radius:0px 8px 0px 0px;
  }
  .s-title{
    position:absolute;
    display: inline-block;
    z-index:99;
    width:94%;
    height: 25px;
    bottom: 0px;
    padding-top:5px;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.6) 100%);
    /*border-radius: 0px 0px 10px 10px;*/

  }
  .s-title-name,.s-title-temp{display:inline;}
  .s-title-temp{padding-left:25px;}
</style>

<script>
  export default {
    data() {
      return {
        show: false
      }
    },
    computed: {
      _class() {
        let className;
        if (this.show) {
          if(this.imgClass instanceof Array) {
            className = this.imgClass.concat(['show']);
          }else if(this.imgClass instanceof Object){

            if(this.imgClass!=undefined && this.imgClass.hover==true){
              console.log(this.imgClass);
            }
          }
          else className = this.imgClass + ' show';
        }
        return className;
      }
    },methods:{

    },
    mounted() {
      this.$lazyImages.addImage(this.$refs.target);
      this.$refs.target.onload = () => {
        this.show = true;
      };
      //this.$lazyImages.loadImage();
      //this.$lazyImages.debounce(this.$lazyImages.loadImage(),200);
    },
    beforeDestroy() {
      this.$lazyImages.removeImage(this.$refs.target);
    },
    props: {
      src: {
        type: String,
        required: true
      },
      placeholder: String,
      imgClass: {
        type: [Array,String],
        default: ''
      },
      initScore: {
        type: String,
        default:''
      },
      score:{
        type:String,
        default:''
      },title:{
        type: String,
        default:''
      }
    },watch:{
      src(){
        // console.log("data-src 已经更新");
        // console.log(this.$refs.target);
        this.$lazyImages.addImage(this.$refs.target);
        this.$refs.target.onload = () => {
          this.show = true;
        };
        this.$nextTick(function () {
          this.$lazyImages.loadImage();
        })
      }
    }
  }
</script>
