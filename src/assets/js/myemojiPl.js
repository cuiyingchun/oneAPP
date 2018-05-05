//document.write("<script  language='javascript' src='./static/js/db.js'></script>");
import {DB} from './db';
import {io,wifi} from './utils';
import state from '../../store/state'
  ;
(function($, window, document, undefined) {
  'use strict';
  $.fn.myEmoji = function(acount,receiver,otherip,msg) {
    var defaults = {
      emojiconfig: {
        tieba: {
          name: "贴吧表情",
          path: "./static/img/tieba/",
          maxNum: 50,
          file: ".png",
          placeholder: ":{alias}:",
          alias: {
            1: "hehe",
            2: "haha",
            3: "tushe",
            4: "a",
            5: "ku",
            6: "lu",
            7: "kaixin",
            8: "han",
            9: "lei",
            10: "heixian",
            11: "bishi",
            12: "bugaoxing",
            13: "zhenbang",
            14: "qian",
            15: "yiwen",
            16: "yinxian",
            17: "tu",
            18: "yi",
            19: "weiqu",
            20: "huaxin",
            21: "hu",
            22: "xiaonian",
            23: "neng",
            24: "taikaixin",
            25: "huaji",
            26: "mianqiang",
            27: "kuanghan",
            28: "guai",
            29: "shuijiao",
            30: "jinku",
            31: "shengqi",
            32: "jinya",
            33: "pen",
            34: "aixin",
            35: "xinsui",
            36: "meigui",
            37: "liwu",
            38: "caihong",
            39: "xxyl",
            40: "taiyang",
            41: "qianbi",
            42: "dnegpao",
            43: "chabei",
            44: "dangao",
            45: "yinyue",
            46: "haha2",
            47: "shenli",
            48: "damuzhi",
            49: "ruo",
            50: "OK"
          },
          title: {
            1: "呵呵",
            2: "哈哈",
            3: "吐舌",
            4: "啊",
            5: "酷",
            6: "怒",
            7: "开心",
            8: "汗",
            9: "泪",
            10: "黑线",
            11: "鄙视",
            12: "不高兴",
            13: "真棒",
            14: "钱",
            15: "疑问",
            16: "阴脸",
            17: "吐",
            18: "咦",
            19: "委屈",
            20: "花心",
            21: "呼~",
            22: "笑脸",
            23: "冷",
            24: "太开心",
            25: "滑稽",
            26: "勉强",
            27: "狂汗",
            28: "乖",
            29: "睡觉",
            30: "惊哭",
            31: "生气",
            32: "惊讶",
            33: "喷",
            34: "爱心",
            35: "心碎",
            36: "玫瑰",
            37: "礼物",
            38: "彩虹",
            39: "星星月亮",
            40: "太阳",
            41: "钱币",
            42: "灯泡",
            43: "茶杯",
            44: "蛋糕",
            45: "音乐",
            46: "haha",
            47: "胜利",
            48: "大拇指",
            49: "弱",
            50: "OK"
          }
        }
      },
      postFunction: function() {
      }
    };
    var opts = $.extend(defaults);
    var emojiconfig = opts.emojiconfig;
    var plBox = $(this);
    var Send = $('.send-btn');
    var FeatureBtn = $('.icon-feature');
    var InputBox = plBox.find('.Input_Box');
    var faceDiv = plBox.find('.faceDiv');
    var InputText = InputBox.find('.Input_text');
    var InputFoot = InputBox.find('.Input_Foot');
    var imgBtn = InputFoot.find('.imgBtn');
    imgBtn.click(
      function() {
        if ($('.feature-display').css('display') == 'block'){
          $('.feature-display').css('display','none');
        }
        var emojiContainer = faceDiv.find('.emoji_container');
        if (emojiContainer.children().length <= 0) {
          faceDiv.css({
            width: Math.floor(InputText.width() / 17) * 38.2 + 'px',
            display: 'block'
          });
          for (var emojilist in emojiconfig) {
            emojiContainer.append('<section class="for_' + emojilist + '"></section>');
            for (var i = 1; i <= emojiconfig[emojilist].maxNum; i++) {
              if (emojiContainer.find('.for_' + emojilist) !== undefined) {
                emojiContainer.find('.for_' + emojilist).append('<a href="javascript:void(0);" class="_img">' +
                  '<img src="' + emojiconfig[emojilist].path + i + emojiconfig[emojilist].file + '" alt="" data-alias="'+(emojiconfig[emojilist].alias == undefined ? (i+emojiconfig[emojilist].file) : emojiconfig[emojilist].alias[i])+'" title="' + (emojiconfig[emojilist].title == undefined ? '' : emojiconfig[emojilist].title[i]) + '" /></a>');
              }
            }
          }
          faceDiv.find('.emoji_container section')[0].style.display = 'block';
          faceDiv.find('.emoji_container ._img').on('click', function() {
            if (InputText[0].nodeName === 'DIV') {
              InputText.append(this.innerHTML);
            } else {
              InputText.append('[' + $(this).find('img').attr('data-alias')+']');
            }
          });
        } else {
          faceDiv.toggle();
        }
      }
    );
    FeatureBtn.click(
      function () {
        if (faceDiv.css('display') == 'block'){
          faceDiv.css('display','none');
          $('.feature-display').css('display','block')
        }
        else if ($('.feature-display').css('display') == 'block'){
          $('.feature-display').css('display','none')
        }
        else {
          $('.feature-display').css('display','block')
        }
      }
    );
    Send.click(
      function(){
        let num=io.creatRand();
        if($(".Input_text").html()!=""){
          let db = new DB("Message");
          new Promise(function(resolve){
            // 数据库
            msg.msg = InputText.html();
            msg.statusColor = state.chatStatus.statusColor;
            msg.fontStyle = state.chatStatus.fontStyle;
            if(!msg.chatMany){
              msg.isReply = state.chatStatus.isReply;
            }
            msg.sendDate = io.formatDateTime(new Date());
            msg.num = num;
            for(let i=0;i<otherip.length;i++) {
              if(state.currentUser.communicationMode == "ADHOC"){
                if(otherip[i]!=state.account.sipid){
                  let options = {
                    uid: "abcdefg",
                    content:JSON.stringify(msg),
                    destIp: otherip[i],
                    type: "Ip"
                  };
                  GeoBOS.adhoc.sendMessage(options, function(err){
                    let uuid ={
                      uuid : msg.uuid
                    };
                    if(err){
                      state.msgFail.css("display","block");
                      db.update(uuid,{ $set: { isFail:'Y'}},{ multi: true },function(err){
                        if(err){
                          console.log('failed with:' + err.message)
                        }else{
                          console.log('objects has be updated');
                        }
                      });
                    }else{
                      console.warn("success");
                    }
                  });
                }
              }
              /*     GeoBOS.io.send(
                    {
                      type: "socket",
                      address: state.otherIP,
                    },
                    JSON.stringify(msg),
                    function (err, res) {
                      if (err) {
                        state.msgFail.css("display","block");
                        let uuid ={
                         uuid : msg.uuid
                        };
                        db.update(uuid,{ $set: { isFail:'Y'}},{ multi: true },function(err){
                          if(err){
                            console.log('failed with:' + err.message)
                          }else{
                            console.log('objects has be updated');
                          }
                        });
                        console.log("send failed with:" + err.message);
                      } else {
                        console.log(res)
                      }
                    }
                  );*/
            }
            if(!msg.groupUri){
              if(msg.chatMany){
                let ul = $('#ullMany');
                var div = document.getElementById('ullMany');
                io.sendTemplate(ul,io.formatDateTime(new Date()),"",num,InputText.html(),state.chatStatus.statusColor,state.chatStatus.fontStyle,"",msg.isFail,"","","",msg.chatMany);
              }else{
                let ul = $('#PUL');
                var div = document.getElementById('PUL');
                io.sendTemplate(ul,io.formatDateTime(new Date()),acount.image,num,InputText.html(),state.chatStatus.statusColor,state.chatStatus.fontStyle,msg.isResponse,msg.isFail,msg.sender,msg.receiver,'');
              }
            }else {
              let ul = $('#ullGroup');
              var div = document.getElementById('ullGroup');
              io.sendTemplate(ul,io.formatDateTime(new Date()),acount.image,num,InputText.html(),state.chatStatus.statusColor,state.chatStatus.fontStyle,msg.isResponse,msg.isFail,msg.sender,'',msg.groupUri);
            }
            resolve(div);
          }).then(function(div){
            db.insert(msg,function(err,result){
              if(err){
                console.log(err.message);
              }else{
                return result;
              }
            });
            $(".Input_text").empty();
            num++;
            div.scrollTop = div.scrollHeight;
          });
        }
      }
    );
  };
})(jQuery, window, document);
export default {}
