/**
 * Created by mayufeng on 2017/9/28
 */
let appService=function () {

};
//登录接口
// function(err){
//   if(err){
//     console.log('failed with:' + err.message);
//   }else{
//     console.log('login success');
//   }
// }
appService.prototype.login= function(username,password,fn){
  GeoBOS.accounts.login(username, password, fn);
};
//退出接口
// function(err){
//   if(err){
//     console.log('failed with:' + err.message);
//   }else{
//     console.log('logout success');
//   }
// }
appService.prototype.logout=function(fn){
  GeoBOS.accounts.logout(fn);
};
//获取当前用户
// function(err, account){
//   if(err){
//     console.log('failed with:' + err.message);
//     return err;
//   }else{
//     console.log('success with:' + account);
//   }
// }
appService.prototype.getAccount=function(fn){
  GeoBOS.accounts.getAccount(fn);
};
//获取所有联系人
// function(err, contactsList){
//   if(err){
//     console.log('failed with:' + err.message);
//   }else{
//     console.log('success with:' + contactsList);
//   }
// }
appService.prototype.userAll=function(fn){
  GeoBOS.contacts.getContacts(fn);
};
//获取所有组
// function(err, groupsList){
//   if(err){
//     console.log('failed with:' + err.message);
//   }else{
//     console.log('success with:' + groupsList);
//   }
// }
appService.prototype.groupAll=function(fn){
  GeoBOS.contacts.getGroups(fn);
};
//获取群组及成员
//currentUser 当前用户对象
//userAll  this.userAll函数返回的所以用户对象
//groupAll this.groupAll函数返回的所以的组对象
appService.prototype.publicGroup=function(currentUser,userAll,groupAll){
  let group ={group:"",member:""};
  let groupId = currentUser.groupId;
  console.log(groupAll);
  for(let i=0;i<groupAll.length;i++){
    if(groupId==groupAll[i].uniqueId){
      group.group = groupAll[i];
    }
  }
  let array = new Array();
  for(let i=0;i<userAll.length;i++){
    if(groupId==userAll[i].groupId){
      array.push(userAll[i]);
    }
  }
  group.member =array;
  return group;
  console.log(group);
};
/*创建文件，并写入文本*/
appService.prototype.writeFile=function(options,data,fn){
  GeoBOS.fs.writeFile(options,data,fn);
};
/*读取文件内容*/
appService.prototype.readFile=function(path,fn){
  GeoBOS.fs.readFile(path,fn);
};
/*删除指定的文件*/
appService.prototype.rmFile=function(path,fn){
  GeoBOS.fs.rmFile(path,fn);
};

export default appService;
