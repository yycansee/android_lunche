<template>
    <div>

    </div>
</template>

<style>
    body {
        background-color: #ff0000;
    }
</style>

<script>


    export default {
        data() {
            return {
              epgdomain:''
            }
        },
      created(){
        let url = 'http://winnow-bds.yanhuamedia.tv/category/detail';
        this.tryseeZx(url);
      },

      methods:{
        tryseeZx(url){
          let backurl = url;
          let backurlss = window.location.href;
//          let backurls = backurl+"&backurl="+backurl+"&mediastr=
          let backurls = backurlss;
          let code = '21100001000000021522201686137001';
//          console.log(code+'传参32位');
//              this.videotype = this.$route.query.videotype;
//              if(this.videotype.indexOf("zx") >=0 ) { //判断是否是中兴平台
//                this.stbtype =  "zx";
//              }else if(this.videotype.indexOf("hw") >=0 ){ // 判断是否是华为平台
//                this.stbtype =  "hw";
//              }
//        this.$router.router.push({path: '/trySee?ContentID='+code+'&ReturnURL='+backurls+"&ifameFlag=1"});
//        this.$router.push({path: '/play?code='+code+'&videotype='+videotype+'&backurl='+backurl});
          if (typeof(Authentication) == "object"){ // 从机顶盒获取信息
            if("CTCSetConfig" in Authentication) {
              this.epgdomain = Authentication.CTCGetConfig("EPGDomain");
            } else {
              this.epgdomain = Authentication.CUGetConfig("EPGDomain");
            }
          }
          let last = this.epgdomain.lastIndexOf("/");
          let host = this.epgdomain.substr( 0, last );
          let req = host + "/MediaService/SmallScreen?ContentID=21100001000000011526451047122000&ReturnURL=http://202.97.183.149:8099/templets/epg/mg/myplay.jsp?code=21100001000000011526451047122000&backurl=&mediastr=&ifameFlag=1";
          console.log(req+'域名');
          //    this.$router.push({path: '/play?code='+code+'&videotype='+videotype+'&backurl='+backurl});
          window.location = req;
        },
      },
        components: {
        }
    }
</script>
