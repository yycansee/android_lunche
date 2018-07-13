<template>
    <div  id="smallvod"  style="left:0px;  top:0px;  width:1280px;  height:720px; position:absolute;">
        <iframe name="if_smallscreen" id="playScreen" width="1280px" height="720px" src="" frameborder="no" scrolling="no"></iframe>
    </div>
</template>
<style scoped>
    body{color: transparent}
    /*.timers{*/
      /*width: 100px;*/
      /*height: 30px;*/
      /*background: black;*/
      /*color: white;*/
      /*position: absolute;*/
      /*right: 100px;*/
      /*top: 100px;*/
      /*z-index: 9999999999;*/
      /*text-align: center;*/
    /*}*/
</style>
<script>
import c from '../../js/common.js'
export default {
    name:"VideoPlayer",
    data(){
        return{
            stbtype:'',
            code:'',
            name:'',
            videotype:'',
            playtype:'',
            foucsid:'',
            returnurl:'',
            epgdomain:'',
            host:'',
            Mediastr:null,
            itime:10
          }
    },created(){
        this.initParams();// 初始化参数

  },mounted(){
        this.$nextTick(function(){ // dom渲染完调用
          this.initIframeSrc();
          // 初始化iframe的src
        })
    },methods:{
        initParams(){
            this.code = this.$route.query.code;
            this.name = this.$route.query.name;
            this.videotype = this.$route.query.videotype;
            if(this.videotype.indexOf("zx") >=0 ) { //判断是否是中兴平台
                    this.stbtype =  "zx";
            }else if(this.videotype.indexOf("hw") >=0 ){ // 判断是否是华为平台
                    this.stbtype =  "hw";
            }
            const pt = this.$route.query.playtype;
            if(!c.isAllNull(pt)){  // 判断播放器类型
                this.playtype = pt;
            }
            const fid = this.$route.query.foucsid;
            if(!c.isAllNull(fid)){  // 判断播放器类型
                this.playtype = fid;
            }
            this.returnurl = this.$route.query.backurl;
        },
        initIframeSrc(){
            if (typeof(Authentication) == "object"){ // 从机顶盒获取信息
                        if("CTCSetConfig" in Authentication) {
                            this.epgdomain = Authentication.CTCGetConfig("EPGDomain");
                        } else {
                            this.epgdomain = Authentication.CUGetConfig("EPGDomain");
                        }
            }
            if(this.stbtype == "hw") {
            	const last = this.epgdomain.lastIndexOf("/");
            	const host = this.epgdomain.substr( 0, last );
            	// document.write( host );
                //alert(host + '/VasToMem.jsp?vas_info=<vas_action>play_vod</vas_action><mediacode><%=code%></mediacode><vas_back_url><%=returnurl_1%></vas_back_url>');
                window.location.href = host + '/VasToMem.jsp?vas_info=<vas_action>play_vod</vas_action><mediacode>'+this.code+'</mediacode><vas_back_url>'+this.returnurl+'</vas_back_url><mediatype></mediatype>';
                console.log(window.location.href);
            }else if(this.stbtype == "zx") {
              const last = this.epgdomain.lastIndexOf("/");
              const host = this.epgdomain.substr( 0, last );
              const url = host +'/MediaService/FullScreen?ContentID='+this.code+'&ReturnURL='+this.returnurl;
              console.log("iframe加载地址："+url);
              $('#playScreen').attr("src",url);
            }
        },
    }
}
</script>
