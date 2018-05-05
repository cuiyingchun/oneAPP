import state from '../../store/state';
import {DB} from './db';
import router from '../../router';
//生成唯一uuid
let generateUUID = {
  creatUuid(){
    let d = new Date().getTime();
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +d;
  }
};
let getGroupName = {
  //插入分组
  insertGroup(group){
    let dbGroup = new DB('group');
    dbGroup.insert(group, function(err, res){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log(res);
      }
    });
  },
  //获取分组的组名
  groupName(uniqueId){
    let dbGroup = new DB('group');
    let groups = [];
    let query = {
      groupF : "1",
      moduleUser: uniqueId
    };
    new Promise(function(resolve){
      dbGroup.queryConfig(query, function(err, res){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          resolve(res);
        }
      });
    }).then(function(value){
      if(value.length){
        for(let i=0;i<value.length;i++){
          groups.push(value[i]);
        }
      }
    });
    return groups;
  },
  //删除分组
  deleteGroup(groupName){
    let query = {
      groupName:groupName
    };
    let dbGroup = new DB('group');
    dbGroup.remove(query,{ multi: true }, function(err, res){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log(res.num + ' objects has be removed');
      }
    });
  },
  //删除某分组中的某个成员
  deleteGroupMember(groupName,uniqueId){
    let query = {
      groupName:groupName,
      members:{
        uniqueId:uniqueId
      }
    };
    let dbGroup = new DB('group');
    dbGroup.remove(query,{ multi: true }, function(err, res){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log(res.num + ' objects has be removed');
      }
    });
  },
  //删除用户不存在的分组
  deleteMemberGroup(groupuri,userUri){
    let query = {
      groupUri:groupuri,
      userUri:userUri
    };
    let dbGroupMember = new DB('GroupMember');
    dbGroupMember.remove(query,{ multi: true }, function(err){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log('removed');
      }
    });
  },
  //插入用户
  insertUser(groupMember,fn){
    let dbGroupMember = new DB('GroupMember');
    new Promise(function(resolve){
      dbGroupMember.insert(groupMember,function(err, res){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          resolve(res)
        }
      });
    }).then(fn)
  },
  //查询所有用户
  queryUser(query,fn){
    new Promise(function(resolve){
      let dbGroupMember = new DB('GroupMember');
      let groupMumbers = [];
      dbGroupMember.queryConfig(query, function(err,res){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          for(let i=0;i<res.length;i++){
            groupMumbers.push(res[i]);
          }
          resolve(groupMumbers);
        }
      });
    }).then(fn);
  },
  //修改分组名称
  changeGroupName(before, now){
    let dbGroup = new DB('group');
    let query = {
      groupName:before
    };
    dbGroup.update(query,{ $set: { groupName: now } }, { multi: true }, function(err){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log('objects has be updated');
      }
    });
  },
  //修改成员昵称
  changeMemberName(before, now){
    let dbGroupMember = new DB('GroupMember');
    let query = {
      nickName:before
    };
    dbGroupMember.update(query,{ $set: { nickName: now } }, { multi: true }, function(err){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log('objects has be updated');
      }
    });
  },

};
//拨打电话
let calls = {
  //数据库存储电话信息
  // sender为拨打方，receiver为接收方，callType为拨打类型（radio为音频通话，vedio为是视频通话），isCalling为是否为拨打方
  storeCallMessage(sender, receiver, callType, isCalling){
    let identity;
    if(sender.uniqueId == state.account.uniqueId){
      identity = sender.uniqueId + receiver.uniqueId;
    }else{
      identity = receiver.uniqueId + sender.uniqueId;
    }
    let db = new DB("Message");
    let callMsg = {
      name : "call",
      callType: callType,//音频呼叫
      identity: identity,
      sender : sender.uniqueId,//发送者
      receiver : receiver.uniqueId,//接受者
      senderNickName : sender.nickName,
      receiverNickName : receiver.nickName,
      senderPosition : sender.position,
      receiverPosition : receiver.position,
      senderImage : sender.image,
      receiverImage : receiver.image,
      callDate : io.formatDateTime(new Date()),
      isCalling: isCalling,//Y为拨打方，N为接收方
      isAccept:'',//判断是否接听,Y为接听，N为未接听或拒绝或繁忙,''为未更新
    }
    db.insert(callMsg,function(err,res){
      if(err){
        console.log(err.message);
      }else{
        return res;
      }
    });
  },
  //初始化电话
  initCall(selfIp){
    GeoBOS.call.init({
      localIp: selfIp,
      appId:"bos.iecas.app"
    }, (status) => {
      console.log(status);
    });
  },
  //拨打电话
  makeCall(ip){
    GeoBOS.call.makeCall({
      peerIp: ip,
      appId:"bos.iecas.app"
    }, (status) => {
      console.log(status);
    });
  },
  //挂断
  hangUpCall() {
    GeoBOS.call.hangupCall((status) => {
      console.log(status);
    });
  },
  //接听
  answerCall() {
    GeoBOS.call.answerCall((status) => {
      console.log(status);
    });
  },
  //天通
  sendCallRequest(sim, number) {
    seqConst ++;
    console.log("seqConst = " + seqConst);
    var options = {
      magic:"ATRC",
      seq:seqConst,
      dclass:0x10,
      dsub:0x70,
      body:{
        sim_id: sim,
        number: number
      }
    };
    GeoBOS.satcom.setter(options, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("set success!");
      }
      return err;
    });
  }
};
let io = {
  //随机数
  creatRand(){
    let d = new Date().getTime();
    return (((1 + Math.random()) * 0x10000) | 0).toString(8).substring(1) +d;
  },
  /*单人发送文件*/
  sendFile(address,path,type,sender,receiver,image,nickName,groupUri,chatImage,chatName,uuid){
    let db = new DB("Message");
    /* GeoBOS.io.sendFile({
     address: address,  //type默认为'socket'
     path: path
     },{
     timestamp: io.formatDateTime(new Date()),
     name:'message',
     msgType:type,
     sender:sender,
     receiver:receiver,
     sendImage :image,//发送者头像
     nickName :nickName,
     chatImage:chatImage,
     chatName :chatName,
     groupUri:groupUri,
     isFail:"N",
     }, function(err){
     if(err) {
     if(type == "text"){
     console.log(state.msgFail);
     state.msgFail.css("display","block");
     }else if(type == "picture"){
     console.log(state.picFail);
     state.picFail.css("display","block");
     }else if(type == "audio"){
     console.log(state.adoFail);
     state.adoFail.css("display","block");
     }else if(type == "file"){
     console.log(state.fileFail);
     state.fileFail.css("display","block");
     }
     let uuid ={
     uuid : uuid
     };
     db.update(uuid,{ $set: { isFail: 'Y' } }, { multi: true },function(err){
     if(err){
     console.log('failed with:' + err.message)
     }else{
     console.log('objects has be updated');
     }
     });
     console.log(err.message);
     }
     });*/
    let uid = GeoBOS.util.uuid();
    let options = {
      uid: uid,
      filePath: '/sdcard'+path,
      destIp: address,
      type: "Ip",
    };
    GeoBOS.adhoc.sendFile(options, function(err){
      if(err){
        //消息和文件等发送失败
        if(type == "text"){
          console.log(state.msgFail);
          state.msgFail.css("display","block");
        }else if(type == "picture"){
          console.log(state.picFail);
          state.picFail.css("display","block");
        }else if(type == "audio"){
          console.log(state.adoFail);
          state.adoFail.css("display","block");
        }else if(type == "file"){
          console.log(state.fileFail);
          state.fileFail.css("display","block");
        }
        let uuid ={
          uuid : uuid
        };
        db.update(uuid,{ $set: { isFail: 'Y' } }, { multi: true },function(err){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log('objects has be updated');
          }
        });
      }else{
        let msg = {
          uid: uid,
          name:'message',
          adhoc : 'false',
          timestamp: io.formatDateTime(new Date()),
          msgType:type,
          sender:sender,
          receiver:receiver,
          sendImage :image,//发送者头像
          nickName :nickName,
          chatImage:chatImage,
          chatName :chatName,
          groupUri:groupUri,
          isFail:"N",
        };
        let options = {
          uid: uid,
          content: JSON.stringify(msg),
          destIp: address,
          type: "Ip"
        };
        GeoBOS.adhoc.sendMessage(options, function(err){
          if(err){
            console.log(err);
          }else{
            console.log("success!");
          }
        });
      }
    })
  },
  //消息样式设置
  fontStyleDiv(fontStyle){
    let input = $(".Input_text");
    if(fontStyle == "1"){
      input.css("font-weight","bolder");
      input.css("text-decoration","none");
      input.css("color","black");
    }else if(fontStyle == "2"){
      input.css("text-decoration","underline");
      input.css("color","black");
      input.css("font-weight","normal");
    }else if(fontStyle == "3"){
      input.css("color","black");
      input.css("font-weight","normal");
      input.css("text-decoration","none");
    }else{
      input.css("color","red");
      input.css("font-weight","normal");
      input.css("text-decoration","none");
    }
  },
  //消息发送内容样式设置
  fontStyle(fontStyle,num){
    if(fontStyle == "1"){
      $(".emoji_content"+num+"").css("font-weight","bolder");
    }else if(fontStyle == "2"){
      $(".emoji_content"+num+"").css("text-decoration","underline");
    }else if(fontStyle == "3"){
      $(".emoji_content"+num+"").css("color","black");
    }else{
      $(".emoji_content"+num+"").css("color","red");
    }
  },
  //应答
  replyShow(isReply,isResponse,num){
    if (!isReply){
      $(".replyMessage"+num+"").css("display","none");
      $(".replyed"+num+"").css("display","none");
    }
    if(isReply){
      // $(".replyMessage"+num+"").css("display","block");
      if (isResponse == 'N'){
        $(".replyMessage"+num+"").css("display","block");
        $(".replyed"+num+"").css("display","none");
      }else {
        $(".replyMessage"+num+"").css("display","none");
        $(".replyed"+num+"").css("display","block");
      }
    }
  },
  //回应
  replyed(isResponse,num){
    if(isResponse == 'N'){
      $(".replyeds"+num+"").css("display","none");
    }
    if(isResponse == 'Y') {
      $(".replyeds"+num+"").css("display","block");
    }
  },
  selectShow(isResponse,num){
    if (isResponse == 'N'){
      $(".replyMessage"+num+"").css("display","block");
      $(".replyed"+num+"").css("display","none");
    }
    if (isResponse == 'Y') {
      $(".replyMessage"+num+"").css("display","none");
      $(".replyed"+num+"").css("display","block");
    }
  },
  //发送消息的模板
  sendTemplate(ul,date,images,num,msg,statusColor,fontStyle,isResponse,isFail,uniqueId,otherId,groupUri,many){
    let timeOutDiv = 0;
    new Promise(function(resolve){
      if(many){
        ul.append('<li><p><span>'+io.formatDateTime(new Date()) + '</span></p>'+
          '<div>'+
          '<div class="with">' +
          '<p>'+
          '<label>'+many.length+'位收信人</label><br/>'+
          '<label class="chatManyLabel'+num+'"></label>'+
          '</p>'+
          '</div>'+
          '<div class="other mysay">' +
          '<div class="whatsay"><div class="whatsay-text">' +
          '<a style="background: '+statusColor+';"></a>' +
          '<div class="emoji_content'+num+'" style="display: inline-block;line-height:1.5rem;"></div>' +
          '</div><i class="icon-warn'+num+'" style="display:none;"></i></div></div></div></li>');
        for(let i= 0;i<many.length;i++){
          $(".chatManyLabel"+num).append("<span>"+many[i]+"</span>")
        }
      }else{
        ul.append('<li><p><span>' + date + '</span></p>' +
          '<div class="other mysay">' +
          '<img src="http://localhost:3000/sdcard/data/config/images/'+images+'" class="aaa"/>'+
          '<div class="whatsay"><div class="whatsay-text">' +
          '<a style="background: '+statusColor+';"></a>' +
          '<div class="emoji_content'+num+'" style="display:inline-block;line-height:1.5rem;"></div>' +
          '</div><i class="icon-warn'+num+'" style="display:none;"></i></div></div>' +
          '<div style="display:none" class="replyeds'+num+' sureReply">已确认收到消息</div>' +
          '</li> ');
      }
      $(".emoji_content"+num).append(msg);
      if(isFail == "Y" || isFail){
        $(".icon-warn"+num).css("display","block");
        let isRemit = false;//“重发”不存在
        //重发
        $(".icon-warn"+num).click(function(){
          console.warn("重发");
          if(!isRemit){
            $(".icon-warn"+num).parent().append(`<div class="remit">重发</div>`);
            isRemit = true;
            setTimeout(function(){
              $(".icon-warn"+num).next().remove();
              isRemit = false;
            },5000);
            $(".remit").click(function(){
              $(this).remove();
              isRemit = false;
              let other;
              let sipid;
              let reMsg;
              let db = new DB("Message");
              new Promise(function(resolve){
                getGroupName.queryUser({uniqueId:otherId},function(value){
                  // console.warn(value[0]);
                  other = value[0];
                  sipid = value[0].sipid;
                  reMsg = {
                    name:"message",
                    msg:msg,
                    sendDate:io.formatDateTime(new Date()),
                    uuid : generateUUID.creatUuid(),
                    sender : uniqueId,//发送者
                    receiver : otherId,//接受者
                    identity:uniqueId+"_"+otherId,//发送+接收
                    msgType : "text",
                    adhoc : 'true',
                    isRead : "Y",//是否已读，默认N
                    noReadCount:0,
                    isConfirm : "N",//是否需要确认,默认N 不需要
                    isResponse :"N",//是否受到相应,默认N 不需要
                    msgLevel : "1",//消息级别 1,2,3 一般，重要，紧急。
                    isDelete : "N",//是否删除,默认N
                    isFail:"N",//是否发送失败
                    sendImage : images,//发送者头像
                    chatImage:other.image,
                    nickName : state.account.nickName,//发送者昵称
                    chatName : other.nickName,
                    statusColor:"",
                    fontStyle:"",
                    isReply:false,
                    msgStatus : "init",
                    moduleUser:uniqueId,
                    num:io.creatRand(),//模板随机数
                  }
                  console.log("发送消息----------");
                  console.log(sipid);
                  resolve(reMsg);
                });
              }).then(function(reMsg){
                if(state.currentUser.communicationMode == "ADHOC"){
                  if(sipid!=state.account.sipid){
                    let options = {
                      uid: "abcdefg",
                      content:JSON.stringify(reMsg),
                      destIp: sipid,
                      type: "Ip"
                    };
                    GeoBOS.adhoc.sendMessage(options, function(err){
                      let uuid ={
                        sendDate : date
                      };
                      if(err){
                        state.msgFail.css("display","block");
                        db.update(uuid,{ $set: { isFail:'Y',sendDate:io.formatDateTime(new Date())}},{ multi: true },function(err){
                          if(err){
                            console.log('failed with:' + err.message)
                          }else{
                            console.log('objects has be updated失败----------');
                          }
                        });
                      }else{
                        console.warn("重发success-------");
                        // $(".icon-warn"+num).css("display","none");
                        $(".icon-warn"+num).parents()[2].remove();
                        let ul = $('#PUL');
                        io.sendTemplate(ul,reMsg.sendDate,images,reMsg.num,reMsg.msg,state.chatStatus.statusColor,state.chatStatus.fontStyle,reMsg.isResponse,reMsg.isFail,reMsg.sender,reMsg.receiver,'');
                        db.update(uuid,{ $set: { sendDate:io.formatDateTime(new Date())}},{ multi: true },function(err){
                          if(err){
                            console.log('failed with:' + err.message)
                          }else{
                            console.log('objects has be updated成功----------');
                          }
                        });
                      }
                    });
                  }
                }
              });
            })
          }
        })
      }
      state.msgFail = $(".icon-warn"+num);
      io.fontStyle(fontStyle,num);
      if(isResponse){
        io.replyed(isResponse,num)
      }
      resolve(msg);
    }).then(function(value){
      $(".aaa").click(function () {
        let self,other;
        let db = new DB("GroupMember");
        db.queryConfig({uniqueId: uniqueId},function(err, result) {
          if(err){
            console.log(err.message);
          }else{
            self = result[0];
            db.queryConfig({uniqueId: otherId},function(err1, result1) {
              if(err1){
                console.log(err.message);
              }else{
                other = result1[0];
                router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
              }
            })
          }
        })
      });
      //长按
      $(".emoji_content"+num).on({
        touchstart: function(e){
          timeOutDiv = setTimeout(function(){
            $('#trans').css('display','none');
            $('#paste').css('display','none');
            $('#copy').css('display','block');
          },1000);
          state.copyText = value;
          state.textType = "text";
          state.nowText = $(".emoji_content"+num);
          state.nowDate = date;
          e.preventDefault();
        },
        touchmove: function(){
          clearTimeout(timeOutDiv);
          timeOutDiv = 0;
        },
        touchend: function(){
          clearTimeout(timeOutDiv);
          if(timeOutDiv != 0){
            alert("这是点击，不是长按");
          }
          return false;
        },
      });
    });
  },
  /*发送文件模板*/
  sendFileTemplate(ul,date,image,num,fileName,isFail,uniqueId,otherId,groupUri,chatMany){
    if(!chatMany){
      ul.append('<li><p><span>' + date + '</span></p>' +
        '<div class="other mysay">' +
        '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="fileImg"/>' +
        '<div class="whatsay">' +
        '<div class="fileborder">'+
        '<div class="file-img"></div>' +
        '<div class="file-name" id="mfile-name'+num+'"></div> '+
        '</div>'+
        '<i class="icon-warn'+num+'" style="display:none;"></i>'+
        '</div>' +
        '</div>' +
        '</li> ');
    }else{
      ul.append('<li>' +
        '<p><span>'+io.formatDateTime(new Date()) + '</span></p>'+
        '<div>'+
        '<div class="with">' +
        '<p>'+
        '<label>'+chatMany.length+'位收信人</label><br/>'+
        '<label class="chatManyLabel'+num+'"></label>'+
        '</p>'+
        '</div>'+
        '<div class="other mysay">' +
        '<div class="whatsay">' +
        '<div class="fileborder">'+
        '<div class="file-img"></div>' +
        '<div class="file-name" id="mfile-name'+num+'"></div> '+
        '</div>'+
        '<i class="icon-warn'+num+'" style="display:none;"></i>'+
        '</div>' +
        '</div>' +
        '</div>' +
        '</li>');
      for(let i= 0;i<chatMany.length;i++){
        $(".chatManyLabel"+num).append("<span>"+chatMany[i]+"</span>")
      }
    }
    let timeOutDiv = 0;
    ul.scrollTop = ul.scrollHeight;
    $("#mfile-name"+num).html(fileName);
    if(isFail == "Y"){
      $(".icon-warn"+num).css("display","block");
    }
    $(".fileImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: otherId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    state.fileFail = $(".icon-warn"+num);
    $("#mfile-name"+num).on({
      touchstart: function(e){
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
        },1000);
        state.transText = fileName;
        state.textType = "file";
        state.nowText = $("#mfile-name"+num);
        state.nowDate = date;
        state.nowImg = image;
        console.log(state.transText);
        e.preventDefault();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        clearTimeout(timeOutDiv);
        if(timeOutDiv != 0){
          alert("这是点击，不是长按");
        }
        return false;
      }
    });
  },
  /*发送图片模板*/
  sendPhotoTemplate(ul,date,image,photoPath,isFail,uniqueId,otherId,groupUri,isPaint,chatMany){
    console.log("发送图片模板");
    console.log(photoPath);
    console.log(groupUri);
    let timeOutDiv = 0;
    let num = io.creatRand();
    if(!chatMany){
      ul.append('<li><p><span>' + date + '</span></p>' +
        '<div class="other mysay">' +
        '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="photoImg"/>' +
        '<div class="photoshow">' +
        '<div class="photoborder">'+
        '<img id="photo'+num+'" class="photos" src= ""/> '+
        '</div>'+
        '<i class="icon-warn'+num+'" style="display:none;"></i>'+
        '</div></div></li> ');
      if(isPaint){
        $("#photo"+num).attr("src",photoPath)
      }else{
        $("#photo"+num).attr("src","http://localhost:3000/sdcard"+photoPath)
      }
    }else{
      ul.append('<li><p><span>'+io.formatDateTime(new Date()) + '</span></p>'+
        '<div>'+
        '<div class="with">' +
        '<p>'+
        '<label>'+chatMany.length+'位收信人</label><br/>'+
        '<label class="chatManyLabel'+num+'"></label>'+
        '</p>'+
        '</div>'+
        '<div class="other mysay">' +
        '<div class="photoshow">' +
        '<div class="photoborder">'+
        '<img id="photo'+num+'" class="photos" src= ""/> '+
        '</div>'+
        '<i class="icon-warn'+num+'" style="display:none;"></i>'+
        '</div></div></div></li>');
      for(let i= 0;i<chatMany.length;i++){
        $(".chatManyLabel"+num).append("<span>"+chatMany[i]+"</span>")
      }
      if(isPaint){
        $("#photo"+num).attr("src",photoPath)
      }else{
        $("#photo"+num).attr("src","http://localhost:3000/sdcard"+photoPath)
      }
    }
    ul.scrollTop = ul.scrollHeight;
    if(isFail == "Y"){
      $(".icon-warn"+num).css("display","block");
    }
    $(".photoImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: otherId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    state.picFail = $(".icon-warn"+num);
    $("#photo"+num).on({
      touchstart: function(e){
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
        },1000);
        state.transText = photoPath;
        state.textType = "picture";
        state.nowText = $("#photo"+num);
        state.nowDate = date;
        state.nowImg = image;
        e.preventDefault();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        clearTimeout(timeOutDiv);
        if(timeOutDiv != 0){
          $("#divCenter").show();
          $("#divCenter").find("img").prop("src",$("#photo"+num).prop("src"));
          $("#divCenter").click(function(){
            $("#divCenter").hide();
          });
        }
        return false;
      }
    });
  },
  /*发送语音*/
  sendAudioTemplate(ul,date,image,path,isFail,uniqueId,otherId,groupUri,chatMany){
    let timeOutDiv = 0;
    let num = io.creatRand();
    if(!chatMany){
      ul.append('<li>'+
        '<p><span style="">'+date+'</span></p>'+
        '<div class="other mysay">'+
        '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="voiceImg"/>'+
        '<div class="whatsay">'+
        '<div class="whatsay-text"><i class="icon-receivevoice" id="icon_audio'+num+'"></i>'+
        '<span class="audio'+num+'" style="display:none">'+path+'</span>'+
        '</div>' +
        '<i class="icon-warn'+num+'" style="display:none;"></i>'+
        '</div>'+
        '</div>'+
        '</li>');
    }else{
      ul.append(
        '<li><p><span>'+io.formatDateTime(new Date()) + '</span></p>'+
        '<div>'+
        '<div class="with">' +
        '<p>'+
        '<label>'+chatMany.length+'位收信人</label><br/>'+
        '<label class="chatManyLabel'+num+'"></label>'+
        '</p>'+
        '</div>'+
        '<div class="whatsay">'+
        '<div class="whatsay-text"><i class="icon-receivevoice" id="icon_audio'+num+'"></i>'+
        '<span class="audio'+num+'" style="display:none">'+path+'</span>'+
        '</div>' +
        '<i class="icon-warn'+num+'" style="display:none;"></i>'+
        '</div>'+
        '</div></li> ');
      for(let i= 0;i<chatMany.length;i++){
        $(".chatManyLabel"+num).append("<span>"+chatMany[i]+"</span>")
      }
    }
    ul.scrollTop = ul.scrollHeight;
    if(isFail == "Y"){
      $(".icon-warn"+num).css("display","block");
    }
    $(".voiceImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: otherId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    state.adoFail = $(".icon-warn"+num);
    let canClick = false;
    $("#icon_audio"+num).on({
      touchstart: function(e){
        $(".icon-receivevoice").removeClass("actived");
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
          canClick = true;
        },1000);
        state.transText = path;
        state.textType = "audio";
        state.nowText = $("#icon_audio"+num);
        state.nowDate = date;
        state.nowImg = image;
        e.preventDefault();
        e.stopPropagation();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        if(!canClick){
          clearTimeout(timeOutDiv);
          if(timeOutDiv != 0){
            $(this).addClass("actived");
            let path = $(this).next("span").html();
            var options = {
              src: '/sdcard'+path,
            };
            var sound = GeoBOS.media.AudioPlayer.getInstance(options);
            sound.on('end', function () {
              $("#icon_audio"+num).removeClass("actived");
            });
            sound.load();
            sound.play();
          }
          return false;
        }
        canClick = false;
      }
    });
  },
  /*发送视频模板*/
  sendVedioTemplate(ul,date,image,num,fileName,isFail,uniqueId,otherId,groupUri){
    let timeOutDiv = 0;
    ul.append('<li><p><span>' + date + '</span></p>' +
      '<div class="other mysay">' +
      '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="fileImg"/>' +
      '<div class="whatsay">' +
      '<div class="videoborder">'+
      '<div class="video-box" id="mfile-name'+num+'">' +
      '<i></i>'+
      '<video width="100%" id="mVedio-'+num+'" src="http://localhost:3000/sdcard'+fileName+'" autoplay></video>'+
      '</div> '+
      '</div>'+
      '<i class="icon-warn'+num+'" style="display:none;"></i>'+
      '</div></div>' +
      '</li> ');
    let video = document.getElementById("mVedio-"+num);
    setTimeout(function(){
      video.pause();
    },800);
    ul.scrollTop = ul.scrollHeight;
    if(isFail == "Y"){
      $(".icon-warn"+num).css("display","block");
    }
    $(".fileImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: otherId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    state.videoFail = $(".icon-warn"+num);
    $("#mfile-name"+num).on({
      touchstart: function(e){
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
        },1000);
        // console.log(value);
        state.transText = fileName;
        state.textType = "file";
        state.nowText = $("#mfile-name"+num);
        state.nowDate = date;
        state.nowImg = image;
        console.log(state.transText);
        e.preventDefault();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        clearTimeout(timeOutDiv);
        if(timeOutDiv != 0){
          io.videoStartPause("mVedio-"+num);
        }
        return false;
      }
    });
    $(".bos-icon-close").click(function(){
      $("#videoBox").hide();
      let videoO = document.getElementById("videoCenter");
      videoO.pause();
    })
  },
  //接收消息的模板
  receiveTemplate(ul,date,images,num,msg,statusColor,fontStyle,isReply,isResponse,uniqueId,groupUri,uuid){
    let timeOutDiv = 0;
    new Promise(function(resolve){
      ul.append('<li>'+
        '<p>' +
        '<span style="">' +date +'</span></p>'+
        '<div class="other hesay">'+
        '<img src="http://localhost:3000/sdcard/data/config/images/'+images+'" class="reMessageImg"/>'+
        '<div class="whatsay"><div class="whatsay-text">' +
        '<a style="background:'+statusColor+'"></a>' +
        '<div class="emoji_contents'+num+'" style="display: inline-block;line-height:1.5rem;"></div>' +
        '</div><!--<i class="icon-warn"></i>--></div></div>' +
        '<div style="display: none" class="replyMessage'+num+' questReply forReply">确认收到消息?---- <button class="replyOk'+num+' forOk">OK</button></div>' +
        '<div style="display: none" class="replyed'+num+' sureReply forReply" style="display: none">已确认收到消息</div>' +
        '</li> '
      );
      $(".emoji_contents"+num).append(msg);
      ul.scrollTop = ul.scrollHeight;
      io.fontStyle(fontStyle,num);
      io.replyShow(isReply,isResponse,num);
      // io.selectShow(isResponse,num);
      $(".reMessageImg").click(function () {
        let self,other;
        let db = new DB("GroupMember");
        db.queryConfig({uniqueId: uniqueId},function(err, result) {
          if(err){
            console.log(err.message);
          }else{
            self = result[0];
            db.queryConfig({uniqueId: uniqueId},function(err1, result1) {
              if(err1){
                console.log(err.message);
              }else{
                other = result1[0];
                router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
              }
            })
          }
        })
      });
      $(".replyOk"+num).click(function () {
        $(".replyMessage"+num).hide();
        let db = new DB("Message");
        let msg = {
          name : "reply",
          msgType : "text",
          isRead : "Y",//是否已读，默认N
          isFail:"N",//是否发送失败
          replyId : uuid,
          snum: num,
        };
        GeoBOS.io.send(
          {
            type: "socket",
            address: state.myIP,
          },
          JSON.stringify(msg),
          function (err, res) {
            if (err) {
              console.log(state.msgFail);
              state.msgFail.css("display","block");
              let uuid ={
                uuid : msg.uuid
              };
              db.update(uuid,{ $set: { isFail: 'Y' } }, { multi: true },function(err){
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
        );
        db.insert(msg,function(err,result){
          if(err){
            console.log(err.message);
          }else{
            console.warn(result);
            return result;
          }
        });
        $(".replyed"+num).show();
      });
      resolve(msg);
    }).then(function(value){
      $(".emoji_contents"+num).on({
        touchstart: function(e){
          timeOutDiv = setTimeout(function(){
            $('#trans').css('display','none');
            $('#paste').css('display','none');
            $('#copy').css('display','block');
          },1000);
          state.copyText = value;
          state.textType = "text";
          state.nowText = $(".emoji_contents"+num);
          state.nowDate = date;
          state.nowImg = images;
          e.preventDefault();
        },
        touchmove: function(){
          clearTimeout(timeOutDiv);
          timeOutDiv = 0;
        },
        touchend: function(){
          clearTimeout(timeOutDiv);
          if(timeOutDiv != 0){
            alert("这是点击，不是长按");
          }
          return false;
        }
      });
    });
  },
  /*接收语音模板*/
  receiveAudioTemplate(ul,date,image,path,uniqueId,groupUri){
    let timeOutDiv = 0;
    let num = io.creatRand();
    ul.append('<li>'+
      '<p><span style="">'+date+'</span></p>'+
      '<div class="other hesay">'+
      '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="reVoiceImg"/>'+
      '<div class="whatsay">'+
      '<div class="whatsay-text"><i class="icon-receivevoice" id="icon_audio'+num+'"></i>'+
      '<span class="audio" style="display:none">'+path+'</span>'+
      '</div>'+
      '</div>'+
      '</div>'+
      '</li>');
    ul.scrollTop = ul.scrollHeight;
    let canClick = false;
    $(".reVoiceImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: uniqueId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    $("#icon_audio"+num).on({
      touchstart: function(e){
        $(".icon-receivevoice").removeClass("actived");
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
          canClick = true;
        },1000);
        // console.log(value);
        state.transText = path;
        state.textType = "audio";
        state.nowText = $("#icon_audio"+num);
        state.nowDate = date;
        state.nowImg = image;
        console.log(state.transText);
        e.preventDefault();
        e.stopPropagation();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        if(!canClick){
          clearTimeout(timeOutDiv);
          if(timeOutDiv != 0){
            $(this).addClass("actived");
            let path = $(this).next("span").html();
            var options = {
              src: path,
            };
            var sound = GeoBOS.media.AudioPlayer.getInstance(options);
            sound.on('end', function () {
              $("#icon_audio"+num).removeClass("actived");
            });
            sound.load();
            sound.play();
          }
          return false;
        }
        canClick = false;
      }
    });
  },
  /*接收文件模板*/
  receiveFileTemplate(ul,date,image,num,mfileName,uniqueId,groupUri){
    let timeOutDiv = 0;
    ul.append('<li><p><span>' + date + '</span></p>' +
      '<div class="other hesay">' +
      '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="refileImg"/>' +
      '<div class="whatsay">' +
      '<div class="fileborder">'+
      '<div class="file-img"></div><div class="file-name" id="mfile-name'+num+'"></div> '+
      '</div>'+
      /*'<i class="icon-warn"></i>'+*/
      '</div></div>' +
      '</li> ');
    ul.scrollTop = ul.scrollHeight;
    $(".refileImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: uniqueId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    $("#mfile-name"+num).html(mfileName);
    $("#mfile-name"+num).on({
      touchstart: function(e){
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
        },1000);
        state.transText = mfileName;
        state.textType = "file";
        state.nowText = $("#mfile-name"+num);
        state.nowDate = date;
        state.nowImg = image;
        // console.log(state.transText);
        e.preventDefault();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        clearTimeout(timeOutDiv);
        if(timeOutDiv != 0){
          alert("这是点击，不是长按");
        }
        return false;
      }
    });
  },
  /*接收图片模板*/
  receivePhotoTemplate(ul,date,image,photoPath,uniqueId,groupUri){
    let timeOutDiv = 0;
    let num = io.creatRand();
    ul.append('<li><p><span>' + date + '</span></p>' +
      '<div class="other hesay">' +
      '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="rePhotoImg"/>' +
      '<div class="photoshow">' +
      '<div class="photoborder">'+
      '<img id="photo'+num+'" class="photos" src= "http://localhost:3000'+photoPath+'" /> '+
      '</div>'+
      /*'<i class="icon-warn"></i>'+*/
      '</div></div></li> ');
    ul.scrollTop = ul.scrollHeight;
    $(".rePhotoImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: uniqueId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    $("#photo"+num).on({
      touchstart: function(e){
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
        },1000);
        state.transText = photoPath;
        state.textType = "picture";
        state.nowText = $("#photo"+num);
        state.nowDate = date;
        state.nowImg = image;
        console.log(state.transText);
        e.preventDefault();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        clearTimeout(timeOutDiv);
        if(timeOutDiv != 0){
          $("#divCenter").show();
          $("#divCenter").find("img").prop("src",$("#photo"+num).prop("src"));
          $("#divCenter").click(function(){
            $("#divCenter").hide();
          });
        }
        return false;
      }
    });
  },
  /*接收视频模板*/
  receiveVedioTemplate(ul,date,image,num,fileName,uniqueId,groupUri){
    let timeOutDiv = 0;
    ul.append('<li><p><span>' + date + '</span></p>' +
      '<div class="other hesay">' +
      '<img src="http://localhost:3000/sdcard/data/config/images/'+image+'" class="refileImg"/>' +
      '<div class="whatsay">' +
      '<div class="fileborder videoborder">'+
      '<div class="file-name" id="mfile-name'+num+'">' +
      '<video width="100%" id="mVedio-'+num+'" src="http://localhost:3000'+fileName+'" autoplay></video>'+
      '</div> '+
      '</div>'+
      /*'<i class="icon-warn"></i>'+*/
      '</div></div>' +
      '</li> ');
    let video = document.getElementById("mVedio-"+num);
    setTimeout(function(){
      video.pause();
    },800);
    ul.scrollTop = ul.scrollHeight;
    $(".refileImg").click(function () {
      let self,other;
      let db = new DB("GroupMember");
      db.queryConfig({uniqueId: uniqueId},function(err, result) {
        if(err){
          console.log(err.message);
        }else{
          self = result[0];
          db.queryConfig({uniqueId: uniqueId},function(err1, result1) {
            if(err1){
              console.log(err.message);
            }else{
              other = result1[0];
              router.push({name:"SelfInfo",params:{self:self,other:other,groupUri:groupUri}})
            }
          })
        }
      })
    });
    $("#mfile-name"+num).on({
      touchstart: function(e){
        timeOutDiv = setTimeout(function(){
          $('#copy').css('display','none');
          $('#paste').css('display','none');
          $('#trans').css('display','block');
        },1000);
        state.transText = fileName;
        state.textType = "file";
        state.nowText = $("#mfile-name"+num);
        state.nowDate = date;
        state.nowImg = image;
        e.preventDefault();
      },
      touchmove: function(){
        clearTimeout(timeOutDiv);
        timeOutDiv = 0;
      },
      touchend: function(){
        clearTimeout(timeOutDiv);
        if(timeOutDiv != 0){
          io.videoStartPause("mVedio-"+num,);
        }
        return false;
      }
    });
    $(".bos-icon-close").click(function(){
      $("#videoBox").hide();
      let videoO = document.getElementById("videoCenter");
      videoO.pause();
    })
  },
  /*聊天页面历史消息*/
  historyChat(value,ul,myself,groupUri,chatMany){
    let sendDate = [];
    for(let i=0;i<value.length;i++){
      if(value[i].msgType){
        sendDate.push(new Date(value[i].sendDate).getTime());
      }
    }
    let sendDateSort = sendDate.sort(io.sortNumber);
    let sendDateSortQ = [];
    for(let i=0;i<sendDateSort.length;i++){
      sendDateSortQ.push(io.formatDateTime(new Date(sendDateSort[i])));
    }
    for(let i=0;i<sendDateSortQ.length;i++){
      for(let j=0;j<value.length;j++){
        if(sendDateSortQ[i]==value[j].sendDate){
          if(value[j].msgType == "text"){
            if(value[j].sender==myself.uniqueId){
              let num = io.creatRand();
              io.sendTemplate(ul,sendDateSortQ[i],myself.image,num,value[j].msg,value[j].statusColor,value[j].fontStyle,value[j].isResponse,value[j].isFail,value[j].sender,value[j].receiver,groupUri,chatMany);
            }else{
              let num = io.creatRand();
              console.log("群组历史");
              console.log(value[j]);
              io.receiveTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].statusColor,value[j].fontStyle,value[j].isReply,value[j].isResponse,value[j].sender,groupUri,value[j].uuid,chatMany);
            }
          }else if(value[j].msgType == "file"){
            if(value[j].sender==myself.uniqueId){
              let num = io.creatRand();
              io.sendFileTemplate(ul,sendDateSortQ[i],myself.image,num,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,groupUri,chatMany);
            }else{
              let num = io.creatRand();
              io.receiveFileTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].sender,value[j].sender,groupUri,chatMany);
            }
          }else if(value[j].msgType == "audio"){
            if(value[j].sender==myself.uniqueId){
              io.sendAudioTemplate(ul,sendDateSortQ[i],myself.image,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,groupUri,chatMany);
            }else{
              io.receiveAudioTemplate(ul,sendDateSortQ[i],value[j].sendImage,value[j].msg,value[j].sender,value[j].sender,groupUri,chatMany);
            }
          }else if(value[j].msgType == "picture"){
            if(value[j].sender==myself.uniqueId){
              if(value[j].isPaint){
                io.sendPhotoTemplate(ul,sendDateSortQ[i],myself.image,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,groupUri,value[j].isPaint,chatMany);
              }else{
                io.sendPhotoTemplate(ul,sendDateSortQ[i],myself.image,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,groupUri,chatMany);
              }
            }else{
              io.receivePhotoTemplate(ul,sendDateSortQ[i],value[j].sendImage,value[j].msg,value[j].sender,value[j].sender,groupUri,chatMany);
            }
          }else if(value[j].msgType == "video"){
            if(value[j].sender==myself.uniqueId){
              let num = io.creatRand();
              io.sendVedioTemplate(ul,sendDateSortQ[i],myself.image,num,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,groupUri,chatMany);
            }else{
              let num = io.creatRand();
              io.receiveVedioTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].sender,value[j].sender,groupUri,chatMany);
            }
          }
        }
      }
    }
  },
  /*群组最新消息*/
  groupMessage(groupre,groupUri,uuid,noReadCount,sendDate,msg){
    $(".message-list-group").remove();
    groupre.append('<div class="message-list message-list1 message-list-group">'+
      '<a>'+
      '<img src="./static/images/im_groupbtn.png" style="border-radius:50%" />'+
      '<span class="count'+ uuid +'" style="display: none;">'+noReadCount+'</span>'+
      '<span>'+
      '<span style="float:left;">'+groupUri+'：</span>'+
      '<span style="float:left;" class="msg"></span>'+
      '</span>'+
      '</a>'+
      '<p>'+
      '<span style="color: #999;">'+sendDate+'</span>'+
      '<i class="icon-deletemessage"></i>'+
      '</p>'+
      '</div>');
    $(".msg").html(msg);
  },
  /*视频播放暂停*/
  videoStartPause(id1){
    let video = document.getElementById(id1);
    let videoO = document.getElementById("videoCenter");
    let oDiv = document.getElementById("videoBox");
    videoO.src = video.src;
    oDiv.style.display = "block";
    videoO.play();
    videoO.onclick=function(){
      if(videoO.paused){
        videoO.play();
      }else{
        videoO.pause();
      }
    }
  },
  //样式显示
  selectSend(textContentShow){
    if($('.Input_text').html()){
      textContentShow = true;
    }
    else {
      textContentShow = false;
    }
  },
  //一些操作的显示
  closeDisplay(){
    $('.feature-display').css('display','none');
    $('.faceDiv').css('display','none');
    $('#copy').css('display','none');
    $('#paste').css('display','none');
    $('#trans').css('display','none');
  },
  showCallO(callShow){
    callShow = true;
  },
  closeCallO(callShow){
    callShow = false;
  },
  //滚动到最下方
  scrollBottom(id){
    let div = document.getElementById(id);
    div.scrollTop = div.scrollHeight;
  },
  sortNumber(a, b){  //数组的排序
    return a - b;
  },
  sortNumberSub(a, b){  //数组的排序
    return b - a;
  },
  //时间格式化
  formatDateTime (date){
    var time = new Date(date);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = time.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
  },
};
let mapFn = {
  //发送当前用户的位置信息
  sendCurrentPosition(){
    console.log("发送当前用户的位置信息");
    new Promise(function(resolve){
      let dbInit = new DB("initMessage");
      dbInit.queryConfig({mess:true},function(err,res){
        if(err){
          console.log('initMessage failed with:' + err.message)
        }else{
          console.log("init数据库查询");
          GeoBOS.geolocation.getCurrentPosition(mapFn.success,mapFn.faliure);
          resolve(res);
        }
      });
    }).then(function(value){  /*定位成功之后再发送标绘*/
      let msg = {
        name:'person',
        sender:state.account.uniqueId,
        senderObj:state.account,
        positionP:state.nowPoint,
        memberNumber:value.memberNumber,
        condition:value.condition,
        uuid:state.account.uniqueId
      };
      for(let i=0;i<state.currentUserAll.length;i++){
        if(state.currentUserAll[i].uniqueId !=state.account.uniqueId){
          mapFn.sendPlot(msg,state.currentUserAll[i].sipid);/*人物标会发送给对方*/
        }
      }
    })

  },
  //用户信息成功，添加人物头像
  success(position){
    if(position) {
      viewer.entities.removeById(state.account.uniqueId);
      let coords = GeoBOS.GeoVis.coordtransform.wgs84togcj02(position.coords.longitude, position.coords.latitude);
       state.nowPoint.latitude = coords[1];
       state.nowPoint.longitude = coords[0];
      viewer.entities.add({
        name:'account',
        id:state.account.uniqueId,
        senderObj:state.account,
        positionP:state.nowPoint,
        position: GeoBOS.GeoVis.Cartesian3.fromDegrees(state.nowPoint.longitude, state.nowPoint.latitude),
        billboard: {
          image:"http://localhost:3000/sdcard/data/config/images/"+state.account.image,
          width: 30,
          height: 30,
        }
      });
      mapFn.personPlot(state.account.uniqueId,state.nowPoint);/*当前用户的经纬度存入数据库*/
    }
  },
  faliure(){
    console.log("定位失败");
  },
  //地图比例尺
  controlCamera(type){
    let camera = viewer.camera;
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    let moveRate = cameraHeight/10.0;
    switch (type){
      case 'forward':
        camera.moveForward(moveRate);
        state.mapRate = ((ellipsoid.cartesianToCartographic(camera.position).height)/10).toFixed(0);
        break;
      case 'backward':
        camera.moveBackward(moveRate);
        state.mapRate = ((ellipsoid.cartesianToCartographic(camera.position).height)/10).toFixed(0);
        break;
    }
  },
  //获得标绘
  getPlot(oneself,army,friend,neutral,land,sea,sky){
    let dbPlot = new DB("plotMessage");
    dbPlot.queryConfig({name:'img',moduleUser:state.account.uniqueId},function(err, res){
      if(err){
        console.log('failed with:' + err.message)
      }else {
        console.log("当前用户的标会");
        console.log(res);
        for(let i = 0; i < res.length; i++){
          viewer.entities.removeById(res[i].uuid);
        }
        for(let i = 0; i < res.length; i++){
          state.plotIds.push(res[i].uuid);
          if(res[i].attribute == '我'){
            if(res[i].arms == '陆'){
              mapFn.addEntity(res[i], oneself, land);
            }else if(res[i].arms == '海'){
              mapFn.addEntity(res[i], oneself, sea);
            }else if(res[i].arms == '空'){
              mapFn.addEntity(res[i], oneself, sky);
            }
          }else if(res[i].attribute == '敌'){
            if(res[i].arms == '陆'){
              mapFn.addEntity(res[i], army, land);
            }else if(res[i].arms == '海'){
              mapFn.addEntity(res[i], army, sea);
            }else if(res[i].arms == '空'){
              mapFn.addEntity(res[i], army, sky);
            }
          }else if(res[i].attribute == '友'){
            if(res[i].arms == '陆'){
              mapFn.addEntity(res[i], friend, land);
            }else if(res[i].arms == '海'){
              mapFn.addEntity(res[i], friend, sea);
            }else if(res[i].arms == '空'){
              mapFn.addEntity(res[i], friend, sky);
            }
          }else if(res[i].attribute == '中'){
            if(res[i].arms == '陆'){
              mapFn.addEntity(res[i], neutral, land);
            }else if(res[i].arms == '海'){
              mapFn.addEntity(res[i], neutral, sea);
            }else if(res[i].arms == '空'){
              mapFn.addEntity(res[i], neutral, sky);
            }
          }
        }
      }
    });
  },
  //插入数据库和发送方法
  insertDb(msg,tips,that){
    let db = new DB('Message');
    db.insert(msg, function(err, res){
      if(err){
        console.log('failed with:' + err.message)
      }else{
        console.log("插入成功");
      }
      if(state.currentUser.communicationMode == "ADHOC"){
        console.log("untio");
        console.log(state.recourseMembers.emergencyMembersIp);
        for(let i=0;i<state.recourseMembers.emergencyMembersIp.length;i++){
            let options = {
              uid: "abcdefg",
              content:JSON.stringify(msg),
              destIp: state.recourseMembers.emergencyMembersIp[i],
              type: "Ip"
            };
            GeoBOS.adhoc.sendMessage(options, (err) => {
              $(".free").html(tips);
              setTimeout(function(){
                $(".free").html("空闲状态");
              },2000)
            });
          }

      }
      /* GeoBOS.io.send(
       {
       type: "socket",
       address: state.otherIP
       },
       JSON.stringify(msg),
       function (err) {
       if (err) {
       console.log("send failed with:" + err.message);
       }
       $(".free").html(tips);
       setTimeout(function(){
       $(".free").html("空闲状态");
       },2000)
       });*/
    });
  },
  //删除对应的标绘
  deletePlot(entity){
    viewer.entities.remove(entity);
    $(".circle").empty();
    $(".circle").hide();
    let dbPlot = new DB("plotMessage");
    if(entity.pos){
      dbPlot.removeByUUID(entity.pos,{ multi: true },function(err,res){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          console.log(res.num + ' objects has be removed');
        }
      })
    }else{
      dbPlot.removeByUUID(entity._id,{ multi: true },function(err,res){
        if(err){
          console.log('failed with:' + err.message)
        }else{
          console.log(res.num + ' objects has be removed');
        }
      })
    }

  },
  //发送消息
  sendPlot(entity,address,that){
    if(state.currentUser.communicationMode == "ADHOC"){
      //发送给所有人
      /*for(let i=0;i<state.otherIP.length;i++){
       }*/
      mapFn.adhocSendMsg(entity,address,that);
    }
    //for循环发送给多人wifi模式下
    /*GeoBOS.io.send(
     {
     type: "socket",
     address: address
     },
     JSON.stringify(entity),
     function (err) {
     if (err) {
     console.log("send failed person with:" + err.message);
     }
     }
     );*/
  },
  /*自组网初始化*/
  adhocInit(ip){
    let option = {
      type:"001",
      peerIp:ip,
      delayTime:20000
    };
    GeoBOS.adhoc.init(option, function(err){
      if(err){
        console.log("init fail"+err);
      }else{
        console.log("init success!");
      }
    });
  },
  /*天通初始化*/
  satcomInit(ip){
    var options = {
      type:"001",
      peerIp:ip
    };
    GeoBOS.satcom.init(options, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("init success!");
      }
    });
  },
  /*自组网发送消息*/
  adhocSendMsg(entity,ip,that){
    let options = {
      uid: "abcdefg",
      content:JSON.stringify(entity),
      destIp: ip,
      type: "Ip"
    };
    GeoBOS.adhoc.sendMessage(options, (err) => {
      if(err){
        that.$message.error('发送失败');
      }else{
      }
    });
  },
  //地图消息提醒的数字
  mapBackImage(type,count){
    if(type != "sketch"){
      count = count+1;
    }
    mapFn.mapReadCount(type,count);
  },
  mapReadCount(type,count){
    let stateCount = document.getElementsByClassName("stateCount")[0];
    let rescueCount = document.getElementsByClassName("rescueCount")[0];
    let alarmCount = document.getElementsByClassName("alarmCount")[0];
    let leadCount = document.getElementsByClassName("leadCount")[0];
    let sketchCount = document.getElementsByClassName("sketchCount")[0];
    if(count>99){
      if(type == "state"){
        if(stateCount){
          stateCount.innerText = '99+';
          $(".stateCount").css("display","block");
        }
      }
      if(type == "rescue"){
        if(rescueCount){
          rescueCount.innerText = '99+';
          $(".rescueCount").css("display","block");
        }
      }
      if(type == "alarm"){
        if(alarmCount){
          alarmCount.innerText = '99+';
          $(".alarmCount").css("display","block");
        }
      }
      if(type == "lead"){
        if(leadCount){
          leadCount.innerText = '99+';
          $(".leadCount").css("display","block");
        }
      }
      if(type == "sketch"){
        if(sketchCount){
          sketchCount.innerText = '99+';
          $(".sketchCount").css("display","block");
        }
      }
    }else{
      if(type == "state"){
        if(stateCount){
          stateCount.innerText = count;
          $(".stateCount").css("display","block");
        }
      }
      if(type == "rescue"){
        if(rescueCount){
          rescueCount.innerText = count;
          $(".rescueCount").css("display","block");
        }
      }
      if(type == "alarm"){
        if(alarmCount){
          alarmCount.innerText = count;
          $(".alarmCount").css("display","block");
        }
      }
      if(type == "lead"){
        if(leadCount){
          leadCount.innerText = count;
          $(".leadCount").css("display","block");
        }
      }
      if(type == "sketch"){
        if(sketchCount){
          sketchCount.innerText = count;
          $(".sketchCount").css("display","block");
        }
      }
    }
  },
  /*未读提醒*/
  readCount(){
    let tnum = 0;
    let jnum = 0;
    let wnum = 0;
    let ynum = 0;
    let db = new DB('Message');
    let query = {
      messRemind: "remind",
      isRead:"N",
      moduleUser:state.account.uniqueId
    };
    db.queryConfig(query,function(err,res){
      if(err){
        console.log(err.message);
      }else{
        if(res.length){
          for(let i=0;i<res.length;i++){
            if(res[i].msgType == "T"){
              tnum++;
            }else if(res[i].msgType == "J"){
              jnum++;
            }else if(res[i].msgType == "W"){
              wnum++;
            }else if(res[i].msgType == "Y"){
              ynum++;
            }
          }
          if(tnum){
            mapFn.mapReadCount("state",tnum);
          }
          if(jnum){
            mapFn.mapReadCount("rescue",jnum);
          }
          if(wnum){
            mapFn.mapReadCount("alarm",wnum);
          }
          if(ynum){
            mapFn.mapReadCount("lead",ynum);
          }
        }else{
          $(".state li").find("span").css("display","none");
        }
      }
    });
    let dbs = new DB('plotMessage');
    new Promise(function(resolve){
      let query = {
        msgType: "S",
        isRead:"N"
      };
      dbs.queryConfig(query,function(err,res){
        if(err){
          console.log(err.message);
        }else{
          resolve(res.length);
        }
      })
    }).then(function(value){
      if(value){
        mapFn.mapReadCount("sketch",value);
      }else{
        $(".sketchCount").css("display","none");
      }
    });
  },
  //指南针
  placement(canvas,footerTip){
    let _this = this;
    GeoBOS.orientation.getDeviceOrientation(function(result) {
      var alpha = result.alpha;
      if(footerTip){
        if ((Math.round(alpha) >= 0 && Math.round(alpha) <= 22.5)
          || (Math.round(alpha) > 336.5 && Math.round(alpha) <= 360)) {
            footerTip.innerHTML = " 北  "+ Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 22.5 && Math.round(alpha) <= 66.5) {
            footerTip.innerHTML = "东北 "+ Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 66.5 && Math.round(alpha) <= 112.5) {
            footerTip.innerHTML = " 东  "+ Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 112.5&& Math.round(alpha) <= 157.5) {
            footerTip.innerHTML = "东南 " + Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 157.5 && Math.round(alpha) <= 202.5) {
            footerTip.innerHTML = " 南  "+ Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 202.5&& Math.round(alpha) <= 247.5) {
            footerTip.innerHTML = "西南 "+ Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 247.5 && Math.round(alpha) <= 292.5) {
            footerTip.innerHTML = " 西  "+ Math.round(alpha) + "°";
        } else if (Math.round(alpha) > 292.5&& Math.round(alpha) < 336.5) {
            footerTip.innerHTML = "西北 " + Math.round(alpha) + "°";
        } else {
          _this.$message.error('超出范围');
        }
      }
      canvas.style.webkitTransform = "rotate("
        + (-alpha).toFixed(3) + "deg)";
    });
  },
  /*标绘提交文件*/
  sendPlotsFiles(path,uuid,type,that){
    if(state.currentUser.communicationMode == "ADHOC"){
      for(let i=0;i<state.currentUserAll.length;i++){
        if(state.currentUserAll[i].uniqueId !=state.account.uniqueId){
          let uid = GeoBOS.util.uuid();
          let options = {
            uid: uid,
            filePath: "/sdcard"+path,
            destIp: state.currentUserAll[i].sipid,
            type: "Ip",
          };
          GeoBOS.adhoc.sendFile(options, function(err){
            if(err){
              that.$message.error('发送失败');
            }else{
              console.log("sendFile success!");
              let msg = {
                name:'img',
                adhoc:"false",
                type:type,
                timestamp: io.formatDateTime(new Date()),
                uid: uid,
                uuid:uuid
              };
              let option = {
                uid: "abcdefg",
                content:JSON.stringify(msg),
                destIp: state.currentUserAll[i].sipid,
                type: "Ip"
              };
              GeoBOS.adhoc.sendMessage(option, (err) => {
                console.log("自组网发送成功");
              });
            }
          });
        }
      }

    }
    /*wifi模式下*/
    /* GeoBOS.io.sendFile({
     address: state.otherIP,  //type默认为'socket'
     path: path
     }, {
     timestamp: new Date(),
     name:'img',
     uuid:uuid
     }, function(err){
     if(err) {
     console.log(err.message);
     }
     });*/
  },
  //添加实体
  addEntity(obj, m, n){
    viewer.entities.add({
      name: obj.name,
      id:obj.uuid,
      position: GeoBOS.GeoVis.Cartesian3.fromDegrees(obj.longitude, obj.latitude),
      show:m && n,
      billboard: {
        image: obj.plotUrl,
        width: 25,
        height: 25,
      }
    });
  },
  /*人物标会的经纬度存入数据库*/
  personPlot(pathUser,data){
    let dbPlot = new DB("plotMessage");
    dbPlot.queryConfig({pathUser:pathUser},function(err,res){
      if(err){
        console.log(err);
      }else{
        if(res.length != 0){
          let msg = {
            pathUser:pathUser,
            isPath:true
          };
          let newMsg = {
            pathUser:pathUser,
            paths:[],
            isPath:true
          };
          res[0].paths.push(data);
          for(let i=0;i<res[0].paths.length;i++){
            newMsg.paths.push(res[0].paths[i]);
          }
          dbPlot.update(msg,newMsg,{ multi: true },function(err,num){
            if(err){
              console.log(err);
            }else{
              if(viewer.entities.getById("polyline")){
                mapFn.guideShow(pathUser);
              }
            }
          })
        }else{
          let msg = {
            pathUser:pathUser,
            paths:[],
            isPath:true
          };
          msg.paths.push(data);
          dbPlot.insert(msg,function(err,docs){
            if(err){
              console.log(err);
            }else {
              if( viewer.entities.getById("polyline")){
                mapFn.guideShow(pathUser);
              }
            }
          })
        }
      }
    })
  },
  /*引导的显示*/
  guideShow(pathUser){
    viewer.entities.removeById("polyline");
    let dbPlot = new DB("plotMessage");
    dbPlot.queryConfig({pathUser:pathUser, isPath:true},function(err,res){
      if(err){
        console.log(err);
      }else{
        if(res.length){
          let paths = res[0].paths;
          let pathsCartesian3 = [];
          for(let i=0;i<paths.length;i++){
            pathsCartesian3.push(GeoBOS.GeoVis.Cartesian3.fromDegreesArray([paths[i].longitude,paths[i].latitude])[0]);
          }
          viewer.entities.add({
            id: 'polyline',
            polyline: {
              positions: pathsCartesian3[0],
              width: 4,
              material: GeoBOS.GeoVis.Color.GREEN
            }
          });
          viewer.entities.getById('polyline').polyline = {
            positions: pathsCartesian3,
            width: 4,
            material: GeoBOS.GeoVis.Color.GREEN
          };
        }
      }
    });
  },
  /*屏幕坐标转化成二维笛卡尔坐标*/
  getWindowPosition(event) {
    let windowPosition = void 0;
    let pos = event.position || window.event;
    windowPosition = new GeoBOS.GeoVis.Cartesian2(pos.x, pos.y);
    return windowPosition;
  },
/*三维笛卡尔坐标转经纬度坐标*/
  cartesianToCoords(ellipsoid, cartesian) {
    let cartographic = ellipsoid.cartesianToCartographic(cartesian);
    let longitudeFloat = parseFloat(GeoBOS.GeoVis.Math.toDegrees(cartographic.longitude).toFixed(8));
    let latitudeFloat = parseFloat(GeoBOS.GeoVis.Math.toDegrees(cartographic.latitude).toFixed(8));
    return {longitude: longitudeFloat, latitude: latitudeFloat};
  }
};
let otherFn = {
  /*options参数
   content: String 通知的附加内容
   sound: Boolean 发送通知时是否用声音提示，默认为true
   vibration: Boolean 发送通知时是否振动，默认为true.
   autoCancel: Boolean 点击通知时是否自动移除通知，默认为true
   led: String 通知显示时终端led灯颜色，默认为GeoBOS.notification.LED_COLOR_GREEN
   extras: Object 通知点击时需要传递的参数对象*/
  notify(title, options){
    console.log(options);
    GeoBOS.notification.notify(title, options).then(function (res) {
      console.log('通知：' + res.id + ' 发送成功');
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  importTemplate(investigation){
    let dbInit = new DB("initMessage");
    dbInit.queryAll(function(err,res){
      if(err){
        console.log("err")
      }else{
        console.log("dffgsdr");
        console.log(res);
      }
    });
    dbInit.queryConfig(
      {
        type:"template",
        moduleUser: state.account.uniqueId
      },function(err,res){
        if(err){
          this.$message.error('数据库查询失败，请刷新重试');
        }else{
          console.log("initMessage数据库查询");
          console.log(res);
          if(res.length){
            for(let i=0;i<res.length;i++){
              investigation.push(res[i]);
            }
          }
        }
      }
    )
  }
};
/*let wifi = {
  isConnect(){
    let connected;
    new Promise(function(resolve){
      GeoBOS.wifi.isConnected(function(err, connected){
        if(err){
          // 获得wifi连接状态失败，可通过err.message查看原因
          console.log('获得wifi连接状态失败')
        }else{
          // 获得wifi连接状态成功，通过connected判断当前是否连接网络
          console.log('获得wifi连接状态成功')
          resolve(connected);
          console.log('connected111')
          console.log(connected)
        }
      })
    }).then(function(value){
      connected = value;
    });
    console.log('connected222')
    console.log(connected)
    return connected;
  }
}*/
export {generateUUID,getGroupName,calls,io,mapFn,otherFn} ;

