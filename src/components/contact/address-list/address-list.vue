<template>
  <div>
    <div class="tab_content">
      <div class="top">
        <span @click="toHandle"><i class="icon-back"></i>返回</span>
        通讯录
      <i class="bos-icon-search" @click="toSearch()"></i>
      </div>
      <div class="group-content">
        <div class="content_talk" style="margin-top: -6px">
          <bos-tabs v-model="activeNames" @tab-click="handleClick">
            <bos-tab-pane label="分组" name="fen">
              <div class="contact-box">
                <div class="contact-group" v-for="(group,index) in groupList">
                  <div class="contact-list" @click="checkUser(group)">
                    <p>
                      <i v-bind:class="{'bos-icon-caret-right':!group.caretFlat,'bos-icon-caret-bottom':group.caretFlat}"></i>
                      <span>{{group.groupName}}</span>
                    </p>
                    <p>0/{{group.members.length}}</p>
                  </div>
                  <i class="bos-icon-more" @click="showChoice1(group.groupName, index)"></i>
                  <ul class="contact-ull" v-show="group.isShow">
                    <!--<li v-for="(child, $index) in group.memberInfo" >
                      <a @click="detail(child)">
                        <img :src="'http://localhost:3000/sdcard/data/config/images/'+child.membersImg" />
                        <span>{{child.membersNames}}</span>
                      </a>
                      <i @click="showChoice2(child,group,index,$index)"></i>
                    </li>-->
                    <li v-for="(child, $index) in group.members" >
                      <a @click="detail(child)">
                        <img :src="'http://localhost:3000/sdcard/data/config/images/'+child.image" />
                        <span>{{child.nickName}}</span>
                      </a>
                      <i @click="showChoice2(child,group,index,$index)"></i>
                    </li>
                  </ul>
                </div>
                <!--全体成员-->
                <div class="contact-group">
                  <div class="contact-list" @click="checkUserF">
                    <p>
                      <i v-bind:class="{'bos-icon-caret-right':!caretFlatF,'bos-icon-caret-bottom':caretFlatF}"></i>
                      <span>全体成员</span>
                    </p>
                    <p>0/{{userAll.length}}</p>
                  </div>
                  <i class="bos-icon-more" @click="showChoice3"></i>
                  <ul class="contact-ull" v-show="isShowF">
                    <li v-for="(child, index) in this.userAll" >
                      <a @click="detail(child)">
                        <img :src="'http://localhost:3000/sdcard/data/config/images/'+child.image" />
                        <span>{{child.nickName}}</span>
                      </a>
                      <i @click="showChoice4(child, index)"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </bos-tab-pane>
            <bos-tab-pane label="群组" name="qun" style="max-height:12.4rem;overflow-y: scroll">
              <div class="contact-box" v-if="MemberGroup.length !=0">
                <div class="contact-group"  v-for="(groupAddList, index) in MemberGroup">
                  <div class="contact-list" @click="toChatGroup(groupAddList)">
                    <p>
                      <span>{{groupAddList.groupInfo.name}}</span>
                    </p>
                  </div>
                  <span class="creatorSpan">创建人：{{groupAddList.groupInfo.creatorName}}</span>
                  <!--<i class="bos-icon-more" @click="showChoiceGroup"></i>-->
                </div>
              </div>
              <div class="showChoiceGroup" @click="showChoiceGroup">+ 添加群</div>
            </bos-tab-pane>
          </bos-tabs>
        </div>
    </div>
      <div class="windowBlack1" :class="{tran:choiceShow1}" @click="closeChoice1">
        <div class="choice1">
          <p>
            <i @click="changeGroupName"></i>
            <span>修改分组名称</span>
          </p>
          <p>
            <i @click="toManageGroup"></i>
            <span>分组管理</span>
          </p>
          <p>
            <i @click="toChooseSend"></i>
            <span>选择发送</span>
          </p>
        </div>
      </div>
      <div class="windowBlack2" :class="{tran:choiceShow2}" @click="closeChoice2">
        <div class="choice2">
          <p>
            <i @click="changeNickName"></i>
            <span>修改昵称</span>
          </p>
          <p>
            <i @click="toCopyMember"></i>
            <span>复制到组</span>
          </p>
          <p>
            <i @click="toMoveMember"></i>
            <span>移动到组</span>
          </p>
          <p>
            <i @click="deleteFriend"></i>
            <span>删除好友</span>
          </p>
        </div>
      </div>
      <div class="windowBlack3" :class="{tran:choiceShow3}" @click="closeChoice3">
        <div class="choice3">
          <p>
            <i @click="toManageGroup"></i>
            <span>分组管理</span>
          </p>
          <p>
            <i @click="toChooseSend"></i>
            <span>选择发送</span>
          </p>
        </div>
      </div>
      <div class="windowBlack4" :class="{tran:choiceShow4}" @click="closeChoice4">
        <div class="choice4">
          <p>
            <i @click="changeNickName"></i>
            <span>修改昵称</span>
          </p>
          <p>
            <i @click="toCopyMember"></i>
            <span>复制到组</span>
          </p>
        </div>
      </div>
      <div class="windowBlackGroup" :class="{tran:choiceShowGroup}" @click="closeChoiceGroup">
        <div class="choiceGroup">
          <p>
            <i @click="addGroup"></i>
            <span>添加群组</span>
          </p>
        </div>
      </div>
  </div>
    <div class="tab_menu">
      <div class="footer" id="footer">
        <ul>
          <li @click="toContact"><i class="bottom_one"></i>会话</li>
          <li class="selected"><i class="bottom_two"></i>通讯录</li>
          <li @click="toMe"><i class="bottom_three"></i>我</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import appService from '@/assets/js/service';
  import {DB} from '@/assets/js/db';
  import {generateUUID,getGroupName,calls} from '@/assets/js/utils';
  import * as actionTypes from "@/store/actions-types";
  export default {
    data() {
      return {
        isShow: false,
        isShowF: false,
        caretFlat: false,
        caretFlatF: false,
        groupList: [],  //创建的分组
        choiceShow1: false,
        choiceShow2: false,
        choiceShow3: false,
        choiceShow4: false,
        choiceShowGroup: false,
        activeNames: 'fen',
        userAll: [],
        selectUser:undefined,//选中的对象
        selectGroup:undefined,//选中的组
        group:undefined,
        beforeGroupName:undefined,
        beforeMemberName:undefined,
        selectUniqueId:undefined,
        MemberGroup:[],
        MemberGroupName:[],
        indexAll:undefined,
        indexGroup:undefined,
        indexMember:undefined,
      }
    },
    mounted(){
      this.getGroupMumbers();
      this.getUserAll();
      this.queryPGroup();
      this.queryGroup();
    },
    methods: {
      /*配置文件的群组*/
      queryPGroup(){
        let _this = this;
        let db = new DB("Group");
       if(_this.$store.state.account.groupUniqueId) {
         let query = {
           "groupF": "2",
           "source": "config",
           "uniqueId": _this.$store.state.account.groupUniqueId
         };
         //判断是否有群
         db.queryConfig(query, function (err, res) {
           if (err) {
             console.log(err);
           } else {
             if (res.length) {
               _this.MemberGroup.push(res[0]);
               _this.MemberGroupName.push(res[0].groupInfo.name);
             }
           }
         });
       }
      },
      /*查询新建的群组*/
      queryGroup(){
        let _this = this;
        let db = new DB("Group");
        db.queryConfig(
            { name: 'group',
              groupF: "2",
              moduleUser : this.$store.state.account.uniqueId ,
            },
          function (err,result) {
          if (err){
            console.log("query fail")
          }else{
            console.log("查询新建的群组");
            console.log(result);
            if(result.length){
              for(let i=0;i<result.length;i++){
                _this.MemberGroup.push(result[i]);
                _this.MemberGroupName.push(result[i].groupInfo.name);
              }
            }
          }
        });
      },
      handleClick(tab, event) {
      },
      getUserAll(){
        let _this = this;
        getGroupName.queryUser({},function(value){
          for(let i=0;i<value.length;i++){
            if(!value[i].groupUri && value[i].uniqueId!=_this.$store.state.account.uniqueId){
              _this.userAll.push(value[i]);
            }
          }
        });
      },
      /*创建的分组*/
      getGroupMumbers(){
        let _this = this;
        let uniqueId = this.$store.state.account.uniqueId;
        _this.groupList = getGroupName.groupName(uniqueId);
        getGroupName.queryUser({},function(value){
          for(let i=0;i<value.length;i++){
            for(let j=0;j<_this.groupList.length;j++) {
              if (value[i].groupUri == _this.groupList[j].groupUri) {
                for (let k = 0; k < value.length; k++) {
                  if (value[i].userUri == value[k].uniqueId) {
                    _this.groupList[j].members.push(value[k]);
                  }
                }
              }
            }
          }
        })
      },
      checkUser(group, index){
        if (typeof group.caretFlat == 'undefined') {
          var _this = this;
          group.caretFlat = true;
          Vue.set(group, "isShow", true);
        } else if (group.caretFlat) {
          group.caretFlat = false;
          Vue.set(group, "isShow", false);
        } else {
          group.caretFlat = true;
          Vue.set(group, "isShow", true);
        }
      },
      checkUserF(){
        if(this.caretFlatF==false){
          this.caretFlatF=true;
          this.isShowF=true;
        }else{
          this.caretFlatF=false;
          this.isShowF=false;
        }
      },
      showChoice1(obj, index){
        this.choiceShow1 = true;
        this.beforeGroupName = obj;
        this.indexGroup = index
      },
      closeChoice1(){
        this.choiceShow1 = false;
      },
      showChoice2(obj,group,index1,index2){
        this.choiceShow2 = true;
        this.selectUser = obj;
        this.beforeMemberName = obj.nickName;
        this.selectUniqueId = obj.uniqueId;
        this.selectGroup = group;
        this.indexGroup = index1;
        this.indexMember =index2;
      },
      closeChoice2(){
        this.choiceShow2 = false;
      },
      showChoice3(){
        this.choiceShow3 = true;
      },
      showChoiceGroup(){
        this.choiceShowGroup = true;
      },
      closeChoice3(){
        this.choiceShow3 = false;
      },

      showChoice4(obj, index){
        this.choiceShow4 = true;
        this.selectUser = obj;
        this.beforeMemberName = obj.nickName;
        this.selectUniqueId = obj.uniqueId;
        this.indexAll = index
      },
      closeChoice4(){
        this.choiceShow4 = false;
      },
      closeChoiceGroup(){
        this.choiceShowGroup = false;
      },
      detail(child){
        this.$router.push({name: 'DetailInformation', params: {user:child}});
      },
      toContact(){
        this.$router.replace("/contact");
      },
      toMe(){
        this.$router.replace("/me");
      },
      toManageGroup(){
        this.$router.replace("/address-list/manage-group");
      },
      toChooseSend(){
        this.$router.replace("/address-list/choose-send");
      },
      addGroup(){
//        this.$router.replace("/address-list/add-group");
        this.$router.push({name:'AddGroup',params:{allGroupName:this.MemberGroupName}});
      },
      toSearch(){
        this.$router.replace("/search");
      },
      toCopyMember(){
        let _this = this;
        this.$router.push({name: 'CopyMember', params: {uid:(_this.selectUser)}});
      },
      toMoveMember(){
        let _this = this;
        this.$router.push({name: 'MoveMember', params: {user:(_this.selectUser),group:(_this.selectGroup)}});
      },
      toHandle(){
        this.$router.replace("/handle");
      },
      toChatGroup(group){
          this.$router.push({name:'ChatGroup',params:{group:group}});
      },
      changeNickName() {
        let _this = this;
        this.$prompt('请输入昵称', '提示', {
          inputValue:_this.selectUser.nickName,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let memberNames = [];
          for(let i=0;i<_this.userAll.length;i++){
            memberNames.push(_this.userAll[i].nickName);
          }
          if(value && memberNames.indexOf(value) == -1){
            getGroupName.changeMemberName(this.beforeMemberName, value);
            for(let i = 0; i < _this.$store.state.currentGroup.groupMumber.length; i++){
              if(_this.selectUniqueId == _this.$store.state.currentGroup.groupMumber[i].uniqueId){
                _this.$store.state.currentGroup.groupMumber[i].nickName = value;
              }
            }
            Vue.set(_this.userAll[_this.indexAll], 'nickName', value);
          }else {
            this.$message({
              message: '该昵称已存在，请勿重新添加！',
              type: 'warning'
            });
          }
          _this.getGroupMumbers();
          /*_this.userAll = [];
          _this.getUserAll();*/
        })
      },
      changeGroupName() {
        let _this = this;
        this.$prompt('请输入组名', '提示', {
          inputValue: _this.groupList[_this.indexGroup],
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let groupNames = [];
          for(let i=0;i<_this.groupList.length;i++){
            groupNames.push(_this.groupList[i].groupName);
          }
          if(value && groupNames.indexOf(value) == -1){
            getGroupName.changeGroupName(_this.beforeGroupName, value);
            Vue.set(_this.groupList[_this.indexGroup], 'groupName', value);
          }else {
            this.$message({
              message: '该组名已存在，请勿重新添加！',
              type: 'warning'
            });
          }
        })
      },
      deleteFriend() {
        let _this = this;
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          _this.groupList[_this.indexGroup].members.splice(_this.indexMember, 1);
          getGroupName.deleteGroupMember(_this.selectGroup.groupUri,_this.selectUser.uniqueId);
          getGroupName.deleteMemberGroup(_this.selectGroup.groupUri,_this.selectUser.uniqueId);
        })
      },
    }
  };
</script>

<style>
  .showChoiceGroup{
    width: 100%;
    text-align: center;
    color: #598dff;
    height: 3rem;
    line-height: 3rem;
    position: relative;
    /*top: -2.7rem;*/
  }
  .tab_content .top .icon-back{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background: url("../../../../static/images/im_header_back.png") no-repeat;
    background-size: 40%;
    position: relative;
    top: 0.77rem;
    left: 0.5rem;
  }
  .tab_content .top span{
    position: absolute;
    left: 0;
  }
  .tab_content .top .bos-icon-search:active{
    content: "\E61D";
    color: #696e52;
  }
  .tab_content{
    overflow: hidden;
  }
  .bottom_one,.bottom_two,.bottom_three{
    width:2rem;
    height:2rem;
    display:inline-block;
    position:relative;
    top:.5rem;
    right:.5rem;
    background: url("../../../../static/images/chat.png") no-repeat 0 0;
    background-size: 100%;
  }
  .bottom_two{
    background: url("../../../../static/images/contact.png") no-repeat 0 0;
    background-size: 100%;
  }
  .bottom_three{
    background: url("../../../../static/images/me.png") no-repeat 0 0;
    background-size: 100%;
  }
  .tab_menu .selected{color:#6ea003;}
  .tab_menu .selected i{background-position:0 -2.06rem;}
  .tab_menu .selected .bottom_two {top:.4rem}
  .group-content{
    background:#fff;
    padding-top:3rem;
  }
  .group-content>.content_talk{
    text-align: center;
  }
  .tab_menu{
    height:3rem;
  }
  .tab_menu > .footer{
    position: fixed;
    bottom:0;
    width:100%;
    line-height:3rem;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    background:#fff;
    z-index:1001;
  }
  .tab_menu > .footer > ul > li{
    width:33.33%;
    font-size: 1.3rem;
    text-align: center;
    border-right:1px solid #eee;
    box-sizing: border-box;
    float:left;
  }
  .tab_menu > .footer > ul > li:nth-last-child(1) {border-right:none;}
  .tab_content .bos-tabs__item{
    width:50% !important;
  }
  .tab_content .bos-tabs__active-bar{ width:50% !important;}
  .bos-tree{border:0;}
  .bos-tree-node__content{ border-bottom:solid 1px #eee;}
  .bos-icon-caret-right:before,.bos-icon-caret-bottom:before{ color:#999;font-size:1.0rem;}
  .contact-box{overflow-y:auto;}
  .contact-group{border-bottom:solid 1px #eee;padding:0 3%;position:relative;background:#fff;z-index:1000;}
  .bos-icon-more{width:10%;position:absolute;right:1%;top:0.95rem;}
  .contact-group .creatorSpan{width:15%;position:absolute;right:1%;top:0.95rem;font-size:.8rem;color: gray;}
  .contact-list {width:85%;overflow:hidden;line-height:3rem;}
  .contact-list p:nth-of-type(1){float:left;}
  .contact-list p:nth-of-type(1) span{margin-left:.8rem;}
  .contact-list p:nth-of-type(2){float:right;margin-right:1rem;color:#999;font-size:1rem;}
  .contact-ull{
    background:#fff;
    padding-left:3%;
  }
  .contact-ull li{
    border-top:solid 1px #eee;
    height:2.0rem;
    line-height:2.0rem;
    padding:.4rem 0;
  }
  .contact-ull li a{ width:90%;display:inline-block;}
  .contact-ull li a>img{width:6%;height:auto;float:left;border-radius:50%;}
  .contact-ull li a>span { float:left;padding-left:1rem;}
  .contact-ull li>i{
    width:30px;
    height:30px;
    float:right;
    background:url("../../../../static/images/im_login_icon_user_normal.png") no-repeat;
    background-size:90%;
    display:inline-block;
  }
  /*遮罩层*/
  .windowBlack1, .windowBlack2, .windowBlack3, .windowBlack4, .windowBlackGroup{
    width:100%;
    height:100%;
    background:rgba(0,0,0,.6);
    position:fixed;
    top: 100%;
    left:0;
    z-index:10000;
    -moz-transition: top ease 200ms;
    -o-transition: top ease 200ms;
    -webkit-transition: top ease 200ms;
    transition: top ease 200ms;
  }
  .tran{
    top: 0;
  }
  .choice1{
    width: 100%;
    height: 6.5rem;
    margin: 20% auto;
    color: #fff;
    text-align:center;
    padding-left:9rem;
  }
  .choice1>p{float:left;margin-right:2rem;}
  .choice1>p i{
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom:.6rem;
  }
  .choice1>p:nth-of-type(1) i{
    background: url("../../../../static/images/im_friendsmore_changename.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice1>p:nth-of-type(1) span{
    position: relative;
    left: -0.2rem;
  }
  .choice1>p:nth-of-type(2) i{
    background: url("../../../../static/images/im_friendsmore_copytogroup.png") no-repeat;
    background-size: 100%;
    z-index:10001;
    margin-right: 0.5rem;
  }
  .choice1>p:nth-of-type(3) i{
    background: url("../../../../static/images/im_friendsmore_moveto_group.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice2{
    width: 26.6rem;
    height: 5.5rem;
    margin: 20% auto;
    text-align: center;
    color: #fff;
  }
  .choice2>p{float:left;margin-right:1.5rem;}
  .choice2>p i{
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom:.6rem;
  }
  .choice2>p:nth-of-type(1) i{
    background: url("../../../../static/images/im_friendsmore_changename.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice2>p:nth-of-type(2) i{
    background: url("../../../../static/images/im_friendsmore_copytogroup.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice2>p:nth-of-type(3) i{
    background: url("../../../../static/images/im_friendsmore_moveto_group.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice2>p:nth-of-type(4) i{
    background: url("../../../../static/images/im_friendsmore_deletfriends.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice2>p:nth-of-type(4) {
    margin-right: 0;
  }
  .choice3{
    width: 100%;
    height: 6.5rem;
    margin: 20% auto;
    color: #fff;
    text-align: center;
    padding-left: 30%;
  }
  .choice3>p{float:left;margin-right:4rem;}
  .choice3>p i{
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom:.6rem;
  }
  .choice3>p:nth-of-type(1) i{
    background: url("../../../../static/images/im_friendsmore_copytogroup.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice3>p:nth-of-type(1) span{
    position: relative;
    left: -0.2rem;
  }
  .choice3>p:nth-of-type(2) i{
    background: url("../../../../static/images/im_friendsmore_moveto_group.png") no-repeat;
    background-size: 100%;
    z-index:10001;
    margin-right: 0.5rem;
  }
  .choice4{
    width: 100%;
    height: 6.5rem;
    margin: 20% auto;
    color: #fff;
    text-align: center;
    padding-left: 30%;
  }
  .choice4>p{float:left;margin-right:4rem;}
  .choice4>p i{
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom:.6rem;
  }
  .choice4>p:nth-of-type(1) i{
    background: url("../../../../static/images/im_friendsmore_changename.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choice4>p:nth-of-type(1) span{
    position: relative;
    left: -0.2rem;
  }
  .choice4>p:nth-of-type(2) i{
    background: url("../../../../static/images/im_friendsmore_copytogroup.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choiceGroup{
    width: 100%;
    height: 6.5rem;
    margin: 20% auto;
    color: #fff;
    text-align: center;
    padding-left: 42%;
  }
  .choiceGroup>p{
    float:left;
    margin-right:4rem;
  }
  .choiceGroup>p i{
    display: block;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom:.6rem;
  }
  .choiceGroup>p:nth-of-type(1) i{
    background: url("../../../../static/images/im_friendsmore_copytogroup.png") no-repeat;
    background-size: 100%;
    z-index:10001;
  }
  .choiceGroup>p:nth-of-type(1) span{
    position: relative;
    left: -0.2rem;
  }
</style>
