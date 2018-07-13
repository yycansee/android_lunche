import {util} from './util.js'
"use strict";
var getplayurl;
(function (getplayurl) {
    var playerIframeName = 'if_smallscreen';
    var provider = util.getCookie('providerID');
    var isHuaWei = provider == 'hw';
    var isZhongXing = provider == 'zx';
    var mediaStr = '';
    var playURL = '';
    var episode = util.getUrlParame('episode');
    var videoID = util.getUrlParame('video_id');
    var severalType = util.getUrlParame('several_type');
    var category = util.getUrlParame('category');
    var contentID = util.getUrlParame('contentID');
    var startTime = util.getUrlParame('start_time') || 0;
    var tryView = util.getUrlParame('try_view') || 0;
    getplayurl.start = function () {
        if (isHuaWei) {
            mediaStr = util.getUrlParame('mediastr');
        }
        if (isZhongXing) {
            var playerIframe = getplayurl.createPlayerIframe(contentID);
            document.body.appendChild(playerIframe);
            playerIframe.onload = handleIframeLoad;
            return;
        }
        return getPlayURL();
    };
    var handleIframeLoad = function () {
        mediaStr = getMediaStrFromIframe(contentID);
        return getPlayURL();
    };
    var getMediaStrFromIframe = function (contentID) {
        var mediaStr = '';
        try {
            mediaStr = window[playerIframeName].getMediastr(contentID);
        }
        catch (err) { }
        return mediaStr;
    };
    var getPlayURL = function () {
        if (isHuaWei) {
            playURL = mediaStr.replace('*', '&').substring(mediaStr.lastIndexOf('rtsp'));
        }
        if (isZhongXing) {
            playURL = mediaStr;
        }
        return play();
    };
    var play = function () {
        var url = '/tryViemPlay?';
        var parameters = {
            start_time: startTime + '',
            video_id: videoID,
            several_type: severalType,
            category: category,
            try_view: tryView + '',
            episode: episode,
            playURL: encodeURIComponent(playURL)
        };
        url = util.appendParametersToURL(url, parameters);
        console.log("播放器试看跳转地址:" + url);
        return (location.href = url);
    };
    getplayurl.createPlayerIframe = function (contentID) {
        var name = playerIframeName ? playerIframeName : 'if_smallscreen';
        var EPGDomain = '';
        if (typeof Authentication == 'object') {
            if ('CTCSetConfig' in Authentication) {
                EPGDomain = Authentication.CTCGetConfig('EPGDomain') || '';
            }
            else {
                EPGDomain = Authentication.CUGetConfig('EPGDomain') || '';
            }
        }
        var lastSepretorIndex = EPGDomain.lastIndexOf('/');
        var host = EPGDomain.substr(0, lastSepretorIndex);
        var src = host;
        src += "/MediaService/SmallScreen?";
        src += "ContentID=" + contentID;
        src += "&ReturnURL=" + decodeURIComponent('http://www.a.com');
        src += "&Left=0&Top=0&Width=1280&Height=720";
        src += "&GetCntFlag=1";
        var iframe = document.createElement('iframe');
        iframe.name = name;
        iframe.style.display = 'none';
        iframe.style.top = '0px';
        iframe.style.left = '0px';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.src = src;
        iframe.frameBorder = 'no';
        iframe.scrolling = 'no';
        return iframe;
    };
})(getplayurl || (getplayurl = {}));

// getplayurl.start();
export { getplayurl}