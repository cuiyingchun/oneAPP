<template>
  <div>
    <div class="tab_content">
      <header class="history-head"><span @click="toChatSetting"><i class="icon-back"></i>返回</span>
        <h1 v-if="user">{{user.nickName}}</h1>
        <h1 v-else>{{group.groupInfo.name}}</h1>
      </header>
      <section class="chat-box" :style="{backgroundColor:  $store.state.backgroundColor}">
        <section class="chat-list">
          <ul id="record-ul">
          </ul>
        </section>
      </section>
    </div>
    <div class="detail_menu">
      <div class="footer" id="footer">
        <ul>
          <li @click="backPage"><i></i>上一页</li>
          <li><i></i>{{page}}/{{pages}}</li>
          <li @click="nextPage"><i></i>下一页</li>
          <li @click="exportRecord(msgValue,myself)"><i></i>导出记录</li>
          <li @click="deleteHistory"><i></i>清空记录</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import * as actionTypes from "@/store/actions-types";
  import {DB} from "@/assets/js/db";
  import {io} from '@/assets/js/utils';
  export default{
    name: 'ChatHistory',
    data() {
      return {
        recordList:[],
        user:this.$route.params.user,
        group:this.$route.params.group,
        myself:this.$store.state.account,
        msgList:[],
        msgValue:[],
        pages:1,
        page:1
      }
    },
    mounted(){
      this.searchRecord();
    },
    methods: {
      searchRecord(){
        let _this = this;
        let query ;
        let db = new DB("Message");
        if(_this.user){
          query = {
            identity: this.myself.uniqueId+"_"+this.user.uniqueId,
          };
        }
        if(_this.group){
            console.log("this.group");
            console.log(_this.group);
          query = {
            groupUri:_this.group.uniqueId
          }
        }
        new Promise(function(resolve){
          db.queryConfig(query,function(err,res){
            if(err){
              console.log('failed with:' + err.message)
            }else{
                console.log("单人或者群组聊天历史");
                console.log(res);
              resolve(res);
            }
          })
        }).then(function(value){  //时间数组
          _this.msgValue = value;
          let remainder;
          if(value.length){
            _this.pages = Math.ceil(value.length/10);
            if(_this.page == _this.pages){
              remainder = value.length%10;
              if(remainder==0){
                remainder = 10;
              }
            }else{
                remainder = 10;
            }
          }
          _this.sortMsg(value,1,remainder);
        })
      },
      sortMsg(value,page,remainder){
        let _this = this;
        let sendDate = [];
        console.log("value-------------");
        console.log(value);
        for(let i=0;i<value.length;i++){
          if(value[i].msgType){
            sendDate.push(new Date(value[i].sendDate).getTime());
          }
        }
        let sendDateSort = sendDate.sort(io.sortNumberSub);
        let sendDateSortQ = [];
        for(let i=0;i<sendDateSort.length;i++){
          sendDateSortQ.push(io.formatDateTime(new Date(sendDateSort[i])));
        }
        var ul = $('#record-ul');
        for(let i=(page-1)*10;i<(page-1)*10+remainder;i++){
          for(let j=0;j<value.length;j++){
            if(sendDateSortQ[i]==value[j].sendDate){
              if(value[j].msgType == "text"){
                  console.log("value[j]");
                  console.log(value[j]);
                if(value[j].sender==_this.myself.uniqueId){
                  let num = io.creatRand();
                  if(_this.user){
                    io.sendTemplate(ul,sendDateSortQ[i],_this.myself.image,num,value[j].msg,value[j].statusColor,value[j].fontStyle,value[j].isFail,value[j].sender,value[j].receiver,"");
                  }
                  if(_this.group){
                    io.sendTemplate(ul,sendDateSortQ[i],_this.myself.image,num,value[j].msg,value[j].statusColor,value[j].fontStyle,value[j].isFail,value[j].sender,"",_this.group.uniqueId);
                  }
                }else{
                  let num = io.creatRand();
                  if(_this.user){
                    io.receiveTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].statusColor,value[j].fontStyle,"","",value[j].sender,"",value[j].uuid);
                  }
                  if(_this.group){
                    io.receiveTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].statusColor,value[j].fontStyle,"","",value[j].sender,_this.group.uniqueId,value[j].uuid);
                  }
                }
              }else if(value[j].msgType == "file"){
                if(value[j].sender==_this.myself.uniqueId){
                  let num = io.creatRand();
                  if(_this.user){
                    io.sendFileTemplate(ul,sendDateSortQ[i],_this.myself.image,num,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,"");
                  }
                  if(_this.group){
                    io.sendFileTemplate(ul,sendDateSortQ[i],_this.myself.image,num,value[j].msg,value[j].isFail,value[j].sender,"",_this.group.uniqueId);
                  }
                }else{
                  let num = io.creatRand();
                  if(_this.user){
                    io.receiveFileTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].sender,"");
                  }
                  if(_this.group){
                    io.receiveFileTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].sender,_this.group.uniqueId);
                  }
                }
              }else if(value[j].msgType == "audio"){
                if(value[j].sender==_this.myself.uniqueId){
                  if(_this.user){
                    io.sendAudioTemplate(ul,sendDateSortQ[i],_this.myself.image,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,"");
                  }
                  if(_this.group){
                    io.sendAudioTemplate(ul,sendDateSortQ[i],_this.myself.image,value[j].msg,value[j].isFail,value[j].sender,"",_this.group.uniqueId);
                  }
                else{
                    if(_this.user){
                      io.receiveAudioTemplate(ul,sendDateSortQ[i],value[j].sendImage,value[j].msg,value[j].sender,"");
                    }
                    if(_this.group){
                      io.receiveAudioTemplate(ul,sendDateSortQ[i],value[j].sendImage,value[j].msg,value[j].sender,_this.group.uniqueId);
                    }
                  }
                  }
              }else if(value[j].msgType == "picture"){
                if(value[j].sender==_this.myself.uniqueId){
                   if(value[j].isPaint){
                     if(_this.user){
                       io.sendPhotoTemplate(ul,sendDateSortQ[i],_this.myself.image,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,"",value[j].isPaint);
                     }
                     if(_this.group){
                       io.sendPhotoTemplate(ul,sendDateSortQ[i],_this.myself.image,value[j].msg,value[j].isFail,value[j].sender,"",_this.group.uniqueId,value[j].isPaint);
                     }
                   }else{
                     if(_this.user){
                       io.sendPhotoTemplate(ul,sendDateSortQ[i],_this.myself.image,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,"");
                     }
                     if(_this.group){
                       io.sendPhotoTemplate(ul,sendDateSortQ[i],_this.myself.image,value[j].msg,value[j].isFail,value[j].sender,"",_this.group.uniqueId);
                     }
                   }
                }else{
                  if(_this.user){
                    io.receivePhotoTemplate(ul,sendDateSortQ[i],value[j].sendImage,value[j].msg,value[j].sender,"");
                  }
                  if(_this.group){
                    io.receivePhotoTemplate(ul,sendDateSortQ[i],value[j].sendImage,value[j].msg,value[j].sender,_this.group.uniqueId);
                  }
                }
              }else if(value[j].msgType == "video"){
                if(value[j].sender==_this.myself.uniqueId){
                  let num = io.creatRand();
                  if(_this.user){
                    io.sendFileTemplate(ul,sendDateSortQ[i],_this.myself.image,num,value[j].msg,value[j].isFail,value[j].sender,value[j].receiver,"");
                  }
                  if(_this.group){
                    io.sendFileTemplate(ul,sendDateSortQ[i],_this.myself.image,num,value[j].msg,value[j].isFail,value[j].sender,"",_this.group.uniqueId);
                  }
                }else{
                  let num = io.creatRand();
                  if(_this.user){
                    io.receiveFileTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].sender,"");
                  }
                  if(_this.group){
                    io.receiveFileTemplate(ul,sendDateSortQ[i],value[j].sendImage,num,value[j].msg,value[j].sender,_this.group.uniqueId);
                  }
                }
              }
            }
          }
        }
      },
      nextPage(){
        let _this = this;
        let remainder;
        if(_this.page<_this.pages){
          _this.page++;
          $('#record-ul li').remove();
          if(_this.page == _this.pages){
            if(_this.msgValue.length){
              remainder = _this.msgValue.length%10;
              if(remainder==0){
                remainder = 10;
              }
              console.log(remainder);
            }
          }else{
              remainder = 10;
          }
          _this.sortMsg(_this.msgValue,_this.page,remainder);
        }
      },
      backPage(){
        let _this = this;
        let remainder;
        if(_this.page>1){
          _this.page--;
          $('#record-ul li').remove();
          if(_this.page == _this.pages){
            if(_this.msgValue.length){
              remainder = _this.msgValue.length%10;
              if(remainder==0){
                remainder = 10;
              }
              console.log(remainder);
            }
          }else{
            remainder = 10;
          }
          _this.sortMsg(_this.msgValue,_this.page,remainder);
        }
      },
      toChatSetting(){
        let _this = this;
        if(_this.user){
          this.$router.push({name: 'ChatSetting', params: {user:_this.user}});
        }
        if(_this.group){
          this.$router.push({name: 'GroupInfo', params: {group:_this.group}});
        }
      },
      deleteHistory() {
        let _this = this;
        this.$confirm('确定清空记录?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let query ;
          let db = new DB("Message");
          if(_this.user){
            query = {
              identity: this.myself.uniqueId+"_"+this.user.uniqueId,
            };
          }
          if(_this.group){
            query = {
              groupUri:_this.group.groupInfo.name
            }
          }
          $('#record-ul li').remove();
          _this.page = 1;
          _this.pages = 1;
          db.remove(query, { multi: true },function(err,numRemoved){
            if(err){
              console.log(err.message)
            }else{
              console.log("success");
              console.log(numRemoved);
            }
          });
        })
      },
      exportRecord(value,myself){
        let _this = this;
        let sendDate = [];
        for(let i=0;i<value.length;i++){
          if(value[i].msgType){
            sendDate.push(new Date(value[i].sendDate).getTime());
          }
        }
        let sendDateSort = sendDate.sort(_this.sortNumber);
        let sendDateSortQ = [];
        for(let i=0;i<sendDateSort.length;i++){
          sendDateSortQ.push(io.formatDateTime(new Date(sendDateSort[i])));
        }
        var historyFile = '';
        for(let i=0;i<sendDateSortQ.length;i++){
          for(let j=0;j<value.length;j++){
            if(sendDateSortQ[i]==value[j].sendDate){
              if(value[j].msgType == "text"){
                if(value[j].sender==myself.uniqueId){
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+value[j].msg+' '
                }else{
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+value[j].msg+' '
                }
              }else if(value[j].msgType == "file"){
                if(value[j].sender==myself.uniqueId){
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[文件]'+' '
                }else{
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[文件]'+' '
                }
              }else if(value[j].msgType == "audio"){
                if(value[j].sender==myself.uniqueId){
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[语音]'+' '
                }else{
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[语音]'+' '
                }
              }else if(value[j].msgType == "picture"){
                if(value[j].sender==myself.uniqueId){
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[图片]'+' '
                }else{
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[图片]'+' '
                }
              }else if(value[j].msgType == "video"){
                if(value[j].sender==myself.uniqueId){
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[视频]'+' '
                }else{
                  historyFile += '发送人:'+value[j].nickName+','+'时间:'+sendDateSortQ[i]+','+'消息内容:'+'[视频]'+' '
                }
              }
            }
          }
        }
        GeoBOS.fs.writeFile('/'+io.creatRand()+'.txt', historyFile, function (err) {
          if (err) {
            console.log('failed with:' + err.message);
          } else {
            console.log('导出聊天记录success');
          }
        });
      },
    }
  }
</script>

<style>
  #record-ul > li > .other>.whatsay>.whatsay-text > img{
    width:1.2rem;
    height:1.2rem;
  }
  .detail_menu > .footer{
    position: fixed;
    bottom:0;
    width:100%;
    line-height:3rem;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    background:#fff;
    z-index:1001;
  }
  .detail_menu > .footer > ul > li{
    width:20%;
    text-align: center;
    border-right:1px solid #eee;
    box-sizing: border-box;
    float:left;
    font-size: 0.85rem;
  }
  .detail_menu > .footer > ul > li:nth-last-child(1) {border-right:none;}

  .history-head{
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background: url("../../../../static/images/im_header_bg.png") no-repeat;
    background-size: 100% 3rem;
    font-size: 1rem;
    color: #fff;
    z-index: 1111;
  }
  .history-head h1{
    font-weight: normal;
    margin: 0;
    font-size: 1.2rem;
    margin-right: 4rem;
  }
  .history-head span{
    float: left;
    font-size: 1rem;
  }
  .history-head .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .history-box{
    /*高度需要修改*/
    /*height: 19.7rem;*/
    margin: 3rem 0;
  }
  .history-list{
    position: relative;
    padding:0 .32rem;
    overflow:auto;
    margin:0 auto;
  }
  .history-box .other{
    width:100%;
    justify-content: flex-start;
    margin-bottom:0.512rem;
    display:flex;
  }
  .aaa,.refileImg,.reVoiceImg,.voiceImg,.photoImg,.fileImg,.reMessageImg,.rePhotoImg{
    border-radius: 50%;
    display:block;
    width:2.7493333333rem;
    height:2.7493333333rem;
  }
  .history-box .whatsay {
    position: relative;
  }
  .history-box .whatsay-text{
    margin:0.63rem;
    max-width:20.7rem;
    background:#fff;
    padding:0.42rem 0.384rem;
    border:1px solid #d9d9d9;
    border-radius:8px;
    font-size: .94rem;
    color: #333;
    line-height:0.9533333333rem;
    word-break: break-all;
  }
  .history-box .mysay{
    display:flex;
    flex-direction:row-reverse;
  }
  .history-box .mysay .whatsay-text{
    margin-right:0.6399997rem;
    margin-left:0;
    background:#9fe658;
  }
</style>
