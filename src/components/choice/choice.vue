<template>
  <div id="choice">
    <div class="choiceBox">
      <div class="choiceLeft">
        <img src="../../../static/images/im_chat_image_normal.png" @click="chooseADHOC"/>
        <span>自组网</span>
        <i></i>
      </div>
      <div class="choiceMiddle">
        <img src="../../../static/images/im_chat_image_normal.png" @click="chooseSATCOM"/>
        <span>天通</span>
        <i></i>
      </div>
      <div class="choiceRight">
        <img src="../../../static/images/im_chat_image_normal.png" @click="chooseITE"/>
        <span>ITE</span>
        <i></i>
      </div>
      <button class="ensure" @click="ensure">确&nbsp;定</button>
    </div>
  </div>
</template>
<script>
  import {getGroupName,mapFn} from '@/assets/js/utils';
  import {DB} from '@/assets/js/db';
  export default {
    name: 'choice',
    data () {
      return {
          people:[],
          group:[],
          publicGroupInfo:[]
      }
    },
    mounted(){
      this.getPeople();
    },
    methods:{
      ensure(){
        if(this.$store.state.currentUser.communicationMode){
          this.$router.replace("/login");
        }else{
          this.$message.error('请选择通信模式');
        }
      },
      chooseADHOC(){
        $(".choiceLeft").find("i").show();
        $(".choiceMiddle").find("i").css("display","none");
        $(".choiceRight").find("i").css("display","none");
        this.$store.state.currentUser.communicationMode = "ADHOC";
      },
      chooseSATCOM(){
        $(".choiceMiddle").find("i").show();
        $(".choiceLeft").find("i").css("display","none");
        $(".choiceRight").find("i").css("display","none");
        this.$store.state.currentUser.communicationMode = "SATCOM";
        mapFn.satcomInit(this.$store.state.account.sipid);
      },
      chooseITE(){
        $(".choiceRight").find("i").show();
        $(".choiceMiddle").find("i").css("display","none");
        $(".choiceLeft").find("i").css("display","none");
        this.$store.state.currentUser.communicationMode = "ITE";
      },
      getPeople(){
        let _this = this;
        GeoBOS.fs.readFile('/libs/data.json', function (err, res) {
          if (err) {
            console.warn('failed with:' + err.message);
          } else {
            console.warn('success with:-----------------');
//            console.log(res.data);
            console.log(JSON.parse(res.data));
            let data = JSON.parse(res.data);
            let dbInit = new DB("initMessage");
            dbInit.queryConfig({configV:true},function(err,res){
                //状态
                if(err){
                    console.log(err);
                }else{
                    console.log("init-----------------------");
                    console.log(res);
                    if(res.length == 0) {
                      dbInit.insert({stag: "888", configV: true}, function (err, res) {
                        if (err) {
                          console.log(err);
                        } else {
                            console.log("长度为0");
                          console.log(res);
                          _this.$store.state.stag = "888";
                        }
                      })
                    }else{
                      _this.$store.state.stag = res[0].stag;
                    }
                      if(data.stag != _this.$store.state.stag){
                        //所有人
                        new Promise(function(resolve){
                          let dbGroupMember = new DB('GroupMember');
                          let dbGroup = new DB('group');
                          dbGroup.remove({ source:"config" }, { multi: true },function(err,res){
                            if(err){
                              console.log(err);
                            }else{
                              console.log("remove-----------");
                              dbGroupMember.drop(function(err,res){
                                if(err){
                                  console.log(err);
                                }else{
                                  console.log("drop1-----------");
                                }
                              });
                              resolve(true);
                            }
                          });
                        }).then(function(){
                          getGroupName.insertUser(data.user);
                          getGroupName.insertGroup(data.publicGroupInfo);
//                          getGroupName.insertGroup(data.privateGroupInfo);
                          _this.$store.state.stag = data.stag;
                          dbInit.update({configV:true},{ $set:{stag:data.stag}}, { multi: true },function(err,res){
                            if(err){
                              console.log(err);
                            }else{
                              console.log(res);
                            }
                          })
                        })
                      }
                      _this.$store.state.currentUserAll = data.user;
                      for(let i=0;i<data.publicGroupInfo.length;i++){
                        _this.$store.state.groups.push(data.publicGroupInfo[i].groupInfo.name); /*配置文件中群的名字*/
                      }
                    }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  #choice{
    width: 100%;
    overflow: hidden;
    background-image: url("../../../static/images/im_login_bg.png");
    z-index: -1;
    height: 340px;
  }
  .choiceBox{
    border: 1px solid #000;
    position: fixed;
    width: 66%;
    height: 70%;
    background: white;
    left: 17%;
    top: 15%;
    box-shadow: 0 0 15px #1d1d1d;
    border-radius: 10px;
  }
  .choiceBox>div{
    width: 33.33%;
    height: 66%;
    text-align:center;
    padding-top:10%;
    float: left;
    position:relative;
  }
  .choiceBox>div>img{
    width: 80%;
    height: 105px;
    display:block;
    padding-left:10%;
  }
  .choiceBox>div>span{
    line-height:40px;
    display: block;
    font-size: 14px;
  }
  .choiceBox>div>i{
    background: url("../../../static/images/im_radiobutton_multi_choose.png") no-repeat;
    background-size: 75%;
    position: absolute;
    width: 30px;
    height: 30px;
    display: none;
    right: 5%;
    bottom: 23%;
  }
  .ensure{
    padding: 6px 42px;
    text-align: center;
    border: 1px solid #000;
    border-radius: 4px;
    position: absolute;
    bottom: 5%;
    left: 35.5%;
    color: #f7f7f7;
    background-image: url("../../../static/images/im_login_bg.png");
  }
</style>
