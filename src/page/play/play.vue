<template>
    <div class=videoPlay>
        <keyDo v-on:listenKeyCode="keyCode"  v-if="isShow"></keyDo>
    </div>
</template>
<script>
import {Util} from '../../js/base.js'
import {util} from '../../js/util.js'
import {player_obj} from '../../js/playObject.js'
export default {
    data(){
        return{
            URL_REQUEST:"",
            playURL:'',
            isShow:true,
        }
    },
    created(){
        console.log("试看播放器跳转成功");
    },mounted(){
        this.$nextTick(function(){
            /*获取url参数*/
            this.URL_REQUEST = this.get_url_split(location.href)
            const parametersNameString = {
                playURL: "playURL",
                contentID: "contentID"
            }
            this.playURL = util.getUrlParame(parametersNameString.playURL);
            /* 创建播放对象*/
            while (!(typeof player_obj.instanceId == "number" && player_obj.instanceId >= 0 && player_obj.instanceId <= 255)) {
                mplayer = new MediaPlayer();
                /*读取本地的媒体播放实例的标识*/
                player_obj.instanceId = mplayer.getNativePlayerInstanceID();
                player_obj.playerInit();
            }
        });
    },methods:{
        pageInit(){
            
        }, keyCode(kc) { // 监听键值
            if (kc == "KeyBack") {
                
            }
        },get_url_split(url) {
                     /**
                    * 拆卸url，返回url参数的对象集合
                    * @param url 全路径
                    * @returns {*} 参数对象
                    */
        var target_param = {}
        var url_param = url.split("?")[1]
        var url_param1 = ""
        if (url_param) {
            url_param1 = url_param.split("&")
        } else {
            return ""
        }
        var skey = ""
        var svalue = ""
        for (var i = 0; i < url_param1.length; i++) {
            skey = url_param1[i].split("=")[0]
            svalue = url_param1[i].split("=")[1]
            target_param[skey] = svalue
        }
            return target_param
        }
    }
}
</script>
