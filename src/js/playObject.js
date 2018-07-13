/**
 * 播放器对象
 * @type
 */
var player_obj = {
    instanceId: "",
    /*播放器唯一标识*/
    play_url: "",
    mediaStr: "",
    /*播放地址*/
    play_mode: -1,
    /* 当前播放状态 0-Play;1-Pause;2-TrickMode;3-Stop*/
    playerInit: function () { /*初始化*/
        this.play();
    },
    playerInitWithMediaStr: function (mediaStr) {
        this.mediaStr = mediaStr;
        this.play();
    },
    setPlayUrl: function (url) { /*拼接播放地址*/
        
    },
    /**
     * 暂停播放操作
     * @param type  不传为自由切换， pause: 暂停   play:播放
     */
    playOrPause: function (type) {
        if (this.play_mode == 0) { /*播放*/
            mplayer.resume();
        } else { /*暂停*/
            mplayer.pause();
        }

    },
    play: function () { /*播放*/
        var providerID = "zx";
        if (providerID == "hw") {
            mediaStr = '[{mediaUrl:"' + this.play_url + '",';
            mediaStr += 'mediaCode:"jsoncode1",';
            mediaStr += 'mediaType:2,';
            mediaStr += 'audioType:1,';
            mediaStr += 'videoType:3,';
            mediaStr += 'streamType:2,';
            mediaStr += 'drmType:1,';
            mediaStr += 'fingerPrint:0,';
            mediaStr += 'copyProtection:1,';
            mediaStr += 'allowTrickmode:1,';
            mediaStr += 'startTime:0,';
            mediaStr += 'endTime:20000,';
            mediaStr += 'entryID:"jsonentry1"}]';
        } else {
            mediaStr = this.play_url;
        }

        // this.play_url = "http://202.97.183.199/youku/video/playlist.m3u8";
        // var mediaStr = '[{mediaUrl:"' + this.play_url + '",';
        // mediaStr += 'mediaCode:"jsoncode1",';
        // mediaStr += 'mediaType:2,';
        // mediaStr += 'audioType:1,';
        // mediaStr += 'videoType:3,';
        // mediaStr += 'streamType:2,';
        // mediaStr += 'drmType:1,';
        // mediaStr += 'fingerPrint:0,';
        // mediaStr += 'copyProtection:1,';
        // mediaStr += 'allowTrickmode:1,';
        // mediaStr += 'startTime:0,';
        // mediaStr += 'endTime:20000,';
        // mediaStr += 'entryID:"jsonentry1"}]';

        mplayer.setSingleMedia(mediaStr);
        /*play
        mplayer.setVideoDisplayMode (1);
        mplayer.refreshVideoDisplay ();*/

        mplayer.playFromStart();
    },
    playByTime: function (mp_time) { /*定点播放*/

        // mplayer.playByTime(1, mp_time, 1);
        // player_obj.play_mode = 0;

    },
    replay: function () { /*repaly when error happen or overtime*/
        mplayer.stop();
    },
    initMediaPlayer: function () { /*初始化播放相关环境*/
        mplayer.setCycleFlag(1); /*0循环播放   1单次播放*/
        mplayer.setAllowTrickmodeFlag(0); /*设置是否允许trick操作。 0:允许 1：不允许*/
        mplayer.setNativeUIFlag(0); /*播放器是否显示缺省的Native UI，  0:不允许 1：允许*/
        mplayer.setAudioTrackUIFlag(0); /*设置音轨的本地UI显示标志 0:不允许 1：允许*/
        mplayer.setMuteUIFlag(0); /*设置静音的本地UI显示标志 0:不允许 1：允许*/
        mplayer.setAudioVolumeUIFlag(0); /*设置音量调节本地UI的显示标志 0:不允许 1：允许*/
        /*存放instanceId到cookie中*/
    }
};
export { player_obj}