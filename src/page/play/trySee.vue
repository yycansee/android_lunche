<template>
    <div class = "daojishi" style="position:absolute;left:30px;top:20px;display:none">
      <div id = "timer"></div>
    </div>
</template>
<style scoped>
#ad_downtimes{position:absolute; color:#FFFFFF; line-height:30px; left:460px; top:10px; text-align:center; width:180px; height:30px;}        /* 倒计时*/
.daojishi h2  {font-family:Helvetica, Microsoft YaHei, Arial, sans-serif;font-size:18px;  margin-bottom:5px;   color:#151515; }
.daojishi #timer  {font-family:Helvetica, Microsoft YaHei, Arial, sans-serif;font-size:18px;color:#151515;font-weight:bold;  }
</style>
<script>
export default {
    data(){
        return{
            clearTime:0,
            itime:300,
            type:"",
            code:0,
            ReturnURL:"",
            mediastr:"",
            mediaUrl:"",
            providerid:'',
            mp:null,
            ts:0,
        }
    },
    created(){
        console.log('试看页面');
        this.mediastr = this.$route.query.mediastr;
        this.ReturnURL = this.$route.query.backUrl;
        this.providerid = this.$route.query.providerid;
        this.type = this.$route.query.type;
        this.code = this.$route.query.code;
        window.timer = this.timer;
        this.getPlayUrl();
        this.onLoadMehtod();
    },methods:{
        onLoadMehtod(){
            this.newPlay(0,this.mediastr);
	        this.clearTime = window.setInterval("timer",1000);
        },newPlay(times,playurl){// 电影试看
            const mediaStr = this.toJson(playurl);
            this.mp = new MediaPlayer();
            const NativePlayerInstanceID = this.mp.getNativePlayerInstanceID();
            this.mp.setAllowTrickmodeFlag(1);		// 0允许媒体快进，快退，暂停
            this.mp.setProgressBarUIFlag(0);
            this.mp.setChannelNoUIFlag(1);				// 0不使频道号本地显示					1本地显示
            this.mp.setNativeUIFlag(1);					// 0不使UI本地显示							1本地显示
            this.mp.setMuteUIFlag(1);				// 0静音图标不显示							1本地显示
            this.mp.setAudioVolumeUIFlag(1);			// 设置音量调节本地UI的显示标志 0:不允许 1：允许
            this.mp.setAudioTrackUIFlag(1);			// 设置音轨本地UI的显示标志		1: 允许
            this.mp.setVideoDisplayArea(0,0,640,530); // 播放器显示区域
            this.mp.refreshVideoDisplay();
            this.mp.setSingleMedia(mediaStr);
            this.mp.playFromStart();
            this.mp.playByTime(1,times);
        },toJson(url){
            return '[{mediaUrl:"'+url
                +'",mediaCode:"code1",'
                +'mediaType:2,'
                +'audioType:1,'
                +'videoType:1,'
                +'streamType:1,'
                +'drmType:1,'
                +'fingerPrint:0,'
                +'copyProtection:1,'
                +'allowTrickmode:1,'
                +'startTime:0,'
                +'endTime:0,'
                +'entryID:"entry1"}]';
        },tuichu(){
            this.mp.stop();  
            this.$route.push({name:'detail'});
        },timer(){
                this.ts = this.itime*1000;//计算剩余的毫秒数
			    this.itime--;
                let mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
                let ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
                document.getElementById("timer").innerHTML = mm + "分" + ss + "秒";
                if(this.itime==0){
                  this.tuichu();
                }
            },getPlayUrl(){ // 获取播放器地址
                if("zx".equals(this.providerid)){
                     let  temp = this.mediastr.replace("[","").replace("]","");
                     this.mediaUrl = JSON.parse(temp).mediaUrl;
                }else{
                     this.mediaUrl = this.mediastr.replace("*","&").substring(this.mediastr.lastIndexOf("rtsp"));}
             }
    },beforeRouteLeave: (to, from, next) => {
        console.log("关闭播放器:");
        this.mp.stop();
        window.clearInterval(this.clearTime);
        next();
    }
}
</script>
