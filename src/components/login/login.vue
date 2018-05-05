<template>
  <div class="logins" style="height: 340px;">
    <div class="login-box">
      <div class="login-avatar">
        <img src="../../../static/images/im_login_head_bg.png">
        <img src="../../../static/images/im_login_head_default.png">
      </div>
      <div class="login-form">
        <i class="icon-user"></i>
        <div class="account">
          <input type="text" placeholder="输入账号" v-model="username"/>
        </div>
        <ul class="account-list" :style="{display:accountShow}">
          <li v-for="(item,index) in userList">
            <span @click="selectPsd(item)" style="margin-left: 0.7rem;">{{item}}</span>
            <i @click="deleteUserList(index,item)" class="icon-deleteuser"></i>
          </li>
        </ul>
        <i class="icon-pull" @click="showAccount"></i><br/>
        <div style="clear:both;">
          <i class="icon-pw"></i>
          <div class="password">
            <input type="password" placeholder="输入密码" v-model="password"/>
          </div>
        </div>
        <div style="clear:both;"></div>
        <p>
          <span id="remFlag" @click="rememberPassword"><i :class="{'icon-checkon':remember,'icon-checkoff':!remember}"></i>记住密码</span>
          <span @click="automaticLogin"><i :class="{'icon-checkon':automatic,'icon-checkoff':!automatic}"></i>自动登录</span>
        </p>
        <div class="login-btn">
          <i class="icon-loginbtn" @click="toHandle"><label>{{login}}</label></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import appService from '@/assets/js/service';
  import {DB} from '@/assets/js/db';
  import {generateUUID,getGroupName,mapFn} from '@/assets/js/utils';
  export default{
    name:"login",
    data(){
      return{
        login:'登录',
        remember:false,
        automatic:false,
        accountShow:'none',
        username:'',
        password:'',
        userAll:[],
        groupsAll:[],
        groupMumber:[],
        userList:[],
      }
    },
    created(){
      this.autoLogin();
    },
    mounted(){
      let db = new DB("plotMessage");
      db.remove({isPath:true},{ multi: true },function(err,res){
        if(err){
          console.log(err);
        }else{
          console.warn("路径清除");
        }
      });
      this.latestLogin();
      this.getUserList();
    },
    methods:{
      //用户名列表
      getUserList(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.queryAll(function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            for(let i = 0; i < res.length; i++){
              if(res[i].username){
                _this.userList.push(res[i].username);
              }
            }
          }
        });
      },
      //删除用户名列表中的用户
      deleteUserList(index,username){
        let _this = this;
        _this.userList.splice(index, 1);
        let dbInit = new DB("initMessage");
        let query = {
          username: username
        };
        dbInit.remove(query,{ multi: true },function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            _this.remember = false;
            _this.automatic = false;
            _this.username = '';
            _this.password = '';
          }
        });
      },
      //获取最近登录的账号
      latestLogin(){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.queryAll(function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log("获取最近登录的账号");
            console.log(res);
            if(res.length){
              for(let i = 0; i < res.length; i++){
                if(res[i].lastLogged){
                  _this.username = res[i].username;
                  if(res[i].password){
                    _this.remember = true;
                    _this.password = res[i].password;
                  }else{
                    _this.remember = false;
                    _this.password = '';
                  }
                }
              }
            }
          }
        });
      },
      //选取下拉列表账号
      selectPsd(item){
        let _this = this;
        let dbInit = new DB("initMessage");
        this.username = item;
        let query ={
          username: item
        };
        dbInit.queryConfig(query, function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else{
            for(let i=0;i<res.length;i++){
              if(res[i].password){
                _this.remember = true;
                _this.password = res[i].password;
              }else{
                _this.remember = false;
                _this.password = '';
              }
            }
          }
        });
        this.accountShow = "none";
      },
      //成功登陆后，跳转到地图首页
      toHandle(){
        let _this = this;
        let user = new appService();
        let dbInit = new DB("initMessage");
        let dbGroupMember = new DB('GroupMember');
        dbInit.update({lastLogged: true}, { $set: { lastLogged: false } }, { multi: true }, function (err) {
          if(err){
            console.log('failed with:' + err.message)
          }else{
            console.log("success");
          }
        });
        dbGroupMember.queryConfig({id:_this.username},function(err,res){
          if(err){
            console.log(err);
          }else{
            if(res){
              _this.login = '登录中...';
              _this.$store.state.account = res[0];
              //判断是否记住密码
              let psd = '';
              if(_this.remember){
                psd = _this.password;
              }else{
                psd = '';
              }
              //判断是够自动登录
              let auto = false;
              if(_this.automatic){
                auto = true;
              }else{
                auto = false;
              }
              //下拉列表存储用户名（密码）
              let query = {
                username: _this.username,
                password: psd,
                autoLogin: auto,
                moduleUser: _this.$store.state.account.uniqueId,
                lastLogged: true
              };
              dbInit.queryConfig({username: _this.username},function(err, res) {
                if(err){
                  console.log('failed with:' + err.message)
                }else{
                  if(res.length){
                      console.log("查询该用户");
                      console.log(res);
                    dbInit.update({username: _this.username},{ $set: query }, { multi: true },function(err, res){
                      if(err){
                        console.log('failed with:' + err.message)
                      }else{
                        _this.getBackground(_this.username);
                        _this.getMySetting(_this.username);
                        _this.$router.replace("/handle");
                      }
                    });
                  }else if(!res.length){
                    dbInit.insert(query, function(err, res){
                      if(err){
                        console.log('failed with:' + err.message)
                      }else{
                        _this.getBackground(_this.username);
                        _this.getMySetting(_this.username);
                        _this.$router.replace("/handle");
                      }
                    });
                  }
                }
              });
              _this.getCurrentInfo();
              _this.removeGuide();
            }else{
              _this.$message.error('用户名错误,请重新登录');
            }
          }
        });
      },
      //账号列表显隐
      showAccount(){
        if(this.accountShow == 'none') {
          this.accountShow = "block";
        }else {
          this.accountShow = "none";
        }
      },
      //记住密码
      rememberPassword(){
        if(this.remember){
          this.automatic = false;
          this.remember = false;
        }else{
          this.remember = true;
        }
      },
      //自动登录
      automaticLogin(){
        if(!this.automatic){
          this.automatic = true;
          this.remember = true;
        } else if(this.automatic){
          this.automatic = false;
          this.remember = false;
        }
      },
      autoLogin(){
        let _this = this;
        let dbInit = new DB("initMessage");
        let dbGroupMember = new DB('GroupMember');
        let user = new appService();
        dbInit.queryAll(function(err, res){
          if(err){
            console.log('failed with:' + err.message)
          }else {
            if(res.length){
              for (let i = 0; i < res.length; i++) {
                if(res[i].autoLogin) {
                  _this.login = '登录中...';
                  _this.remember = true;
                  _this.automatic = true;
                  _this.username = res[i].username;
                  _this.password = res[i].password;
                  dbGroupMember.queryConfig({id:_this.username},function(err,res){
                      if(err){
                          console.log(err);
                      }else{
                          if(res){
                              console.log("res----------------");
                              console.log(res);
                            _this.$store.state.account = res[0];
                            _this.getBackground(_this.username);
                            _this.getMySetting(_this.username);
                            _this.$router.replace("/handle");
                            _this.getCurrentInfo();
                          }else{
                            _this.removeGuide();
                          }
                      }
                  })
                 /* user.login(_this.username, _this.password, function (err) {
                    if (err) {
                      this.$message.error('用户名错误,请重新登录');
                    } else {
                      user.getAccount(function (err, account) {
                        if (err) {
                          reject(err);
                        } else {
                          if (account) {
                            if (account.id == _this.username) {
                              _this.$store.state.account = account;
                              _this.getBackground(_this.username);
                              _this.getMySetting(_this.username);
                              _this.$router.replace("/handle");
                              _this.getCurrentInfo();
                            }
                          }
                          _this.removeGuide();
                        }
                      });
                    }
                  });*/

                }
              }
            }
          }
        });
      },
      //获取当前用户信息，包括账号、密码、所有联系人、用户所在群组
      getCurrentInfo(){
        let _this = this;
        let groups = new appService();
     /*   groups.userAll(function(err, contactsList){
          if(err){
            console.log('登录获取联系人接口错误:' + err.message);
          }else{
            for(let i=0;i<contactsList.length;i++){
              _this.userAll.push(contactsList[i]);
            }
            getGroupName.insertUser(contactsList);  //把所有联系人放到数据库,不包括当前联系人
          }
        });*/
        /*groups.groupAll(function(err, groupsList){
          if(err){
            console.log('failed with:' + err.message);
          }else{
            for(let i=0;i<groupsList.length;i++){
              _this.groupsAll.push(groupsList[i]);
            }
          }
        });*/
        let dbGroupMember = new DB('GroupMember');
        let dbGroup = new DB('group');
        dbGroupMember.queryConfig({id:_this.username},function(err,res){
          if(err){
            console.log(err);
          }else{
            if(res){
              console.log("res-111---------------");
              console.log(res);
              console.log(res[0].uniqueId);
              let uniqueId = res[0].uniqueId;
              _this.$store.state.account = res[0];
              dbGroup.queryAll(function(err,res){
                  if(err){
                      console.log(err);
                  }else{
                      console.log(res);
                      for(let i=0;i<res.length;i++){
                          if(!res[i].groupF){
                            for(let j=0;j<res[i].children.length;j++){
                              if(uniqueId == res[i].children[j]){
                                _this.$store.state.currentGroup.groupInfo = res[i].name;
                                _this.$store.state.currentGroup.groupMumber = res[i].children;
                              }
                            }
                          }
                      }
                  }
              })
            }
          }
        })
//        this.$store.state.currentUserAll = this.userAll; //所有联系人
//        this.$store.state.groups = this.groupsAll;  //所有群组
      },
      //获取背景颜色
      getBackground(username){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.queryConfig({username: username},function(err, res) {
          if(err){
            console.log('failed with:' + err.message)
          }else{
            for(let i = 0; i < res.length; i++){
              if(res[i].moduleUser = _this.$store.state.account.uniqueId) {
                if (res[i].color) {
                  _this.$store.state.backgroundColor = res[i].color;
                  console.log('获取颜色success');
                } else {
                  _this.$store.state.backgroundColor = '#feffef';
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{$set:{color: '#feffef'}},function(err, res){
                    if(err){
                      console.log('failed with:' + err.message)
                    }else{
                      console.log('添加初始颜色success');
                    }
                  })
                }
              }
            }
          }
        });
      },
      //获取基本信息状态
      getMySetting(username){
        let _this = this;
        let dbInit = new DB("initMessage");
        dbInit.queryConfig({username: username},function(err, res) {
          if(err){
            console.log('failed with:' + err.message)
          }else{
            for(let i = 0; i < res.length; i++){
              if(res[i].moduleUser = _this.$store.state.account.uniqueId){
                if(res[i].mute) {
                  _this.$store.state.mute = res[i].mute;
                }else{
                  _this.$store.state.mute = false;
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{$set:{mute: false}},{},function(err, res){
                    if(err){
                      console.log('failed with:' + err.message)
                    }else{
                      console.log('success');
                    }
                  })
                }
                if(res[i].updateCycle) {
                  _this.$store.state.updateCycle = res[i].updateCycle;
                }else{
                  _this.$store.state.updateCycle = 1;
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{$set:{ updateCycle: 1}},{},function(err, res){
                    if(err){
                      console.log('failed with:' + err.message)
                    }else{
                      console.log('success');
                    }
                  })
                }
                if(res[i].condition) {
                  //状态
                  _this.$store.state.condition.memberNumber = res[i].condition.memberNumber;
                  _this.$store.state.condition.conditionDetail = res[i].condition.conditionDetail;
                }else{
                  _this.$store.state.condition.memberNumber = 0;
                  _this.$store.state.condition.conditionDetail = '一般';
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},{ $set: { "condition.memberNumber": 0, "condition.conditionDetail": '一般' } }, {},function(err, res){
                    if(err){
                      console.log('failed with:' + err.message)
                    }else{
                      console.log('success');
                    }
                  })
                }
                if(res[i].remind){
                  //紧急救援救助提示
                  _this.$store.state.remind.rescueRemind.lamp = res[i].remind.rescueRemind.lamp;
                  _this.$store.state.remind.rescueRemind.vibrate = res[i].remind.rescueRemind.vibrate;
                  _this.$store.state.remind.rescueRemind.sound = res[i].remind.rescueRemind.sound;
                  //态势申请提示
                  _this.$store.state.remind.situationRemind.lamp = res[i].remind.situationRemind.lamp;
                  _this.$store.state.remind.situationRemind.vibrate = res[i].remind.situationRemind.vibrate;
                  _this.$store.state.remind.situationRemind.sound = res[i].remind.situationRemind.sound;
                  //引导申请提示
                  _this.$store.state.remind.guideRemind.lamp = res[i].remind.guideRemind.lamp;
                  _this.$store.state.remind.guideRemind.vibrate = res[i].remind.guideRemind.vibrate;
                  _this.$store.state.remind.guideRemind.sound = res[i].remind.guideRemind.sound;
                  //略图调制提示
                  _this.$store.state.remind.sketchRemind.lamp = res[i].remind.sketchRemind.lamp;
                  _this.$store.state.remind.sketchRemind.vibrate = res[i].remind.sketchRemind.vibrate;
                  _this.$store.state.remind.sketchRemind.sound = res[i].remind.sketchRemind.sound;
                  //威胁告警提示
                  _this.$store.state.remind.alarmRemind.lamp = res[i].remind.alarmRemind.lamp;
                  _this.$store.state.remind.alarmRemind.vibrate = res[i].remind.alarmRemind.vibrate;
                  _this.$store.state.remind.alarmRemind.red = res[i].remind.alarmRemind.red;
                  _this.$store.state.remind.alarmRemind.orange = res[i].remind.alarmRemind.orange;
                  _this.$store.state.remind.alarmRemind.yellow = res[i].remind.alarmRemind.yellow;
                  _this.$store.state.remind.alarmRemind.blue = res[i].remind.alarmRemind.blue;
                }else{
                  //紧急救援救助提示
                  _this.$store.state.remind.rescueRemind.lamp = false;
                  _this.$store.state.remind.rescueRemind.vibrate = false;
                  _this.$store.state.remind.rescueRemind.sound = false;
                  //态势申请提示
                  _this.$store.state.remind.situationRemind.lamp = false;
                  _this.$store.state.remind.situationRemind.vibrate = false;
                  _this.$store.state.remind.situationRemind.sound = false;
                  //引导申请提示
                  _this.$store.state.remind.guideRemind.lamp = false;
                  _this.$store.state.remind.guideRemind.vibrate = false;
                  _this.$store.state.remind.guideRemind.sound = false;
                  //略图调制提示
                  _this.$store.state.remind.sketchRemind.lamp = false;
                  _this.$store.state.remind.sketchRemind.vibrate = false;
                  _this.$store.state.remind.sketchRemind.sound = false;
                  //威胁告警提示
                  _this.$store.state.remind.alarmRemind.lamp = false;
                  _this.$store.state.remind.alarmRemind.vibrate = false;
                  _this.$store.state.remind.alarmRemind.red = false;
                  _this.$store.state.remind.alarmRemind.orange = false;
                  _this.$store.state.remind.alarmRemind.yellow = false;
                  _this.$store.state.remind.alarmRemind.blue = false;
                  dbInit.update({moduleUser: _this.$store.state.account.uniqueId},
                    {
                      $set: {
                        "remind.rescueRemind.lamp": false, "remind.rescueRemind.vibrate": false,"remind.rescueRemind.sound": false,
                        "remind.situationRemind.lamp": false, "remind.situationRemind.vibrate": false,"remind.situationRemind.sound": false,
                        "remind.guideRemind.lamp": false, "remind.guideRemind.vibrate": false,"remind.guideRemind.sound": false,
                        "remind.sketchRemind.lamp": false, "remind.sketchRemind.vibrate": false,"remind.sketchRemind.sound": false,
                        "remind.alarmRemind.lamp": false, "remind.alarmRemind.vibrate": false,"remind.alarmRemind.red": false,"remind.alarmRemind.orange": false,"remind.alarmRemind.yellow": false,"remind.alarmRemind.blue": false
                      }
                    },
                    {},function(err, res){
                      if(err){
                        console.log('failed with:' + err.message)
                      }else{
                        console.log('success');
                      }
                    })
                }
              }
            }
          }
        });
      },
      //清空数据库中经纬度的记录值
      removeGuide(){
        let dbPlot = new DB("plotMessage");
        dbPlot.remove({isPath:true},function(err,res){
            if(err){
                console.log(err)
            }else{
                console.log("isPath is removed");
            }
        })
      }
    }
  }
</script>
<style>
  .logins{
    width: 100%;
    overflow: hidden;
    background-image: url("../../../static/images/im_login_bg.png");
    z-index: -1;
  }
  .login-box{
    width: 56%;
    margin:4.0rem 22% auto;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px #000;
    padding-bottom: 1%;
    position: relative;
  }
  .login-avatar img:nth-of-type(1){
    width: 8rem;
    height:8rem;
    margin: auto 31.5%;
    position: absolute;
    top: -4rem;
  }
  .login-avatar img:nth-of-type(2){
    width: 12%;
    margin: auto 44%;
    position: absolute;
    top: -1.4rem;
    left: 0.16rem;
    height:3rem;
  }
  @media screen and (min-width:700px){
    .login-form{
      padding-top: 15%;
      position: relative;
    }
  }
  @media screen and (max-width:699px){
    .login-form{
      padding-top: 10%;
      position: relative;
    }
  }
  .account{
    float: left;
    width: 84%;
    margin-left: 1.2rem;
    margin-top: 1.2rem;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  .account-list{
    position: absolute;
    left: 3.2rem;
    top: 5.2rem;
    width: 84%;
    background-color: #eee;
    z-index: 1004;
  }
  .account-list li{
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid #eee;
    line-height: 2.2rem;
    position: relative;
  }
  .icon-deleteuser{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url("../../../static/images/im_login_icon_user_delete.png") no-repeat;
    background-size: 70%;
    position: absolute;
    right: 0.6rem;
    top:0.77rem;
  }
  .account input{
    line-height: 2rem;
  }
  .password{
    float: left;
    width: 84%;
    margin-left: 1.2rem;
    margin-top: 1.2rem;
    border-bottom: 1px solid #eee;
  }
  .password input{
    line-height: 2rem;
  }
  .icon-user{
    float: left;
    display: inline-block;
    width: 2rem;
    height: 2.4rem;
    background: url("../../../static/images/im_login_icon_user_normal.png") no-repeat;
    background-size: 70%;
    position: relative;
    top: 1.6rem;
    left: 1.1rem;
  }
  .icon-pw{
    float: left;
    display: inline-block;
    width: 2rem;
    height: 2.4rem;
    background: url("../../../static/images/im_login_icon_pw_normal.png") no-repeat;
    background-size: 70%;
    position: relative;
    top: 1.6rem;
    left: 1.1rem;
  }
  .icon-pull{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../static/images/im_login_icon_user_pull.jpg") no-repeat;
    background-size: 70%;
    position: absolute;
    right: 0.1rem;
    bottom: 9.9rem;
  }
  .login-form p{
    clear: both;
    display: inline-block;
    padding: 0.8rem 1.2rem;
    font-weight: bold;
  }
  .login-form span:nth-of-type(1){
    margin-left: 1.4rem;
    margin-right: 6rem;
    position: relative;
  }
  .login-form span:nth-of-type(2){
    margin-left: 1.4rem;
    position: relative;
  }
  .icon-checkoff{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../static/images/im_login_check_off.png") no-repeat;
    background-size: 50%;
    position: absolute;
    top: 0.05rem;
    left: -1.2rem;
  }
  .icon-checkon{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url("../../../static/images/im_login_check_on.png") no-repeat;
    background-size: 50%;
    position: absolute;
    top: 0.05rem;
    left: -1.2rem;
  }
  .login-btn{
    text-align: center;
  }
  .icon-loginbtn{
    display: inline-block;
    width: 90%;
    height: 3rem;
    margin-top: 1rem;
    background: url("../../../static/images/im_login_btn_normal.png") no-repeat;
    background-size: 100%;
  }
  .login-btn label{
    font-weight: bold;
    font-style: normal;
    display: inline-block;
    width: 24%;
    text-align: center;
    margin: auto 38%;
    padding-top: 4%;
  }
</style>
