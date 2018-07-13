<template>
      <div class="historical">
        <div class="tit">{{title}}</div>
        <div class="content active">
          <div class="writediv changebac"></div>
          <ul class="cul">
            <li class="text_n " id="jv">{{conten.acc}}</li>
            <li class="text_n" id="sc">{{conten.his}}</li>
          </ul>
        </div>
        <keyDo v-on:listenKeyCode="keyCode" v-if="isShow" ref="keyDo"></keyDo>
      </div>
</template>

<style scoped="historical">
    .historical{
      width: 300px;
      height: 720px;
      background: #A8977C;
      border-top: 1px solid #A8977C;
      border-right: 1px rgba(255,255,255,0.5) solid;
    }
    .tit{
      font-size: 28px;
      text-align: center;
      color: white;
      margin-top: 30px;
    }
    .content{
      width: 120px;
      height: 70%;
      top: 75px;
      left: 85px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.01) 0%,rgba(255,255,255,0.6) 50%,rgba(255,255,255,0.01) 100%);
      position: relative;
    }
    .content ul{
      width: 100%;
      position: absolute;
      left: 0;
      top: 210px;
    }
    .content ul .text_n{
      color: white;
      width: 100%;
      height: 15%;
      font-size: 26px;
      text-align: center;
      line-height: 70px;
    }
    .content .writediv{
      width: 100%;
      height: 15%;
      background: rgba(255,255,255,0.6);
      position: absolute;
      left:0;
      top: 210px;
    }
    .content .changebac{
      background: #A36363;
      border: 4px solid #fff;
      box-sizing: border-box;
    }
    .content.active{
      background: rgba(255,255,255,0.4);

    }
</style>

<script>
  export default {
    props:['type'],
    data() {
            return {
                title:'记录与收藏',
                num:0,
                name:"Historical",
                isShow:true,
                conten:
                  {
                    his:'记录',
                    acc:'收藏'
                  }
            }
        },
    mounted(){
      console.log(this.type+"类型");
      if(this.type!=undefined){
        if(this.type =="history"){
          this.num=1;
          $('.cul').css({'transition':'all 0.3s','transform':'translateY(-'+ 70*this.num +'px)'});
          this.$emit('pressLeft', this.isShow,this.name,"down");
        }else {
          this.num=0;
          $('.cul').css({'transition':'all 0.3s','transform':'translateY(-'+ 70*this.num +'px)'});
          this.$emit('pressLeft', this.isShow,this.name,"up");
        }
      }
    },
    activated(){
      this.$nextTick(function () {
        if(this.type!=undefined){
          if(this.type =="history"){
            this.num=1;
            $('.cul').css({'transition':'all 0.3s','transform':'translateY(-'+ 70*this.num +'px)'});
            this.$emit('pressLeft', this.isShow,this.name,"down");
          }else {
            this.num=0;
            $('.cul').css({'transition':'all 0.3s','transform':'translateY(-'+ 70*this.num +'px)'});
            this.$emit('pressLeft', this.isShow,this.name,"up");
          }
        }
      });
    },
    methods: {
      keyCode(kc) {
        if (kc == "KeyBack") {
          this.back();
        } else if (kc == "right") {
          this.right();
        } else if (kc == "down") {
          this.down();
        } else if (kc == "up") {
          this.up();
        }else if(kc=="KeyEnter"){
          this.KeyEnter();
        }
      },
      back() {
        if(this.$route.query.jsonUrl!=undefined){
          yh.back();
        }else{
          this.$router.go(-1);
        }
      },
      right(){
        this.isShow= false;
        $('.writediv').removeClass("changebac");
        $('.content').removeClass("active");
//        console.log(this.num);
        if (this.num ==0){
          this.$emit('pressLeft', this.isShow,this.name,"right1");
        }else {
          this.$emit('pressLeft', this.isShow,this.name,"right2");
        }
      },
      down() {
        this.$emit('pressLeft', this.isShow,this.name,"down");
        this.num++;
        if(this.num>=2){
          this.num=1;
        };
        $('.cul').css({'transition':'all 0.3s','transform':'translateY(-'+ 70*this.num +'px)'})
//        console.log(this.num);
      },
      up(){
        this.$emit('pressLeft', this.isShow,this.name,"up");
        this.num-=1;
        if(this.num<=0){
          this.num=0;
        };
        $('.cul').css({'transition':'all 0.3s','transform':'translateY(-'+ 70*this.num +'px)'})
//        console.log(this.num);
      },
      updateStast(bl,pos,isEnd){
        this.isShow = bl;
        this.pos = pos;
        $('.writediv').addClass("changebac");
        $('.content').addClass("active");
      }
    },
        components: {

      }
    }
</script>
