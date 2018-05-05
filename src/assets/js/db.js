/**
 * Created by mayufeng on 2017/9/28
 */
//创建表，返回true or false
//true 成功，false 失败
 class DB{
  constructor(table){
    //this.db = GeoBOS.db.create(table);
    this.db = GeoBOS.datastore.create({
      filename:"/sdcard/"+table+".db",
      autoload:true
    });
  }

  //插入数据,jsonObj对象
  //fn 回调函数 function(err, result){}
  insert(jsonObj,fn){
    this.db.insert(jsonObj,fn);
  }
  //查询所以数据 fn 回调函数 function(err, result){}
  queryAll(fn){
    this.db.find({},fn);
  }
  //查询数据,json条件 如{id:3,name:'hello'}
  //查询指定数据 fn 回调函数 function(err, result){}
  queryConfig(jsonConfig,fn){
    this.db.find(jsonConfig,fn);
  }
  //查询数据,json条件 如{uuid:'6234234'}
  //查询指定数据 fn 回调函数 function(err, result){}
  queryByUUID(uuid,fn){
    this.db.find({uuid:uuid},fn);
  }

  //更新一条数据,uuid条件 如{uuid:'6234234'}
  //更新的数据,json条件 如{id:3,name:'hello'}
  //查询指定数据 fn 回调函数 function(err, result){}
  updateByUUID(uuid,jsonObj,json,fn){
    this.db.update({uuid:uuid},jsonObj,json,fn);
  }

  //更新多条数据,config条件 如{id:3,name:'hello'}
  //更新的数据,json条件 如{age:5,name:'hello234'}
  //查询指定数据 fn 回调函数 function(err, result){}
  update(jsonConfig,jsonObj,json,fn){
    this.db.update(jsonConfig,jsonObj,json,fn);
  }
  //根据uuid删除一条数据,uuid 如{uuid:'6234234'}
  //删除一条数据 fn 回调函数 function(err, result){}
  removeByUUID(uuid,json,fn){
    this.db.remove({uuid:uuid},json,fn);
  }
  //删除多条数据,jsonConfig 如{name:'6234234'}
  //删除一条数据 fn 回调函数 function(err, result){}
  remove(jsonConfig,json,fn){
    this.db.remove(jsonConfig,json,fn);
  }
  //删除表 fn 回调函数 function(err){}
  drop(fn){
    this.db.drop(fn);
  }
}
 /*class GroupDB{
  init(){
    this.dbGroup = new DB("Group");
    this.dbGroupMember = new DB("GroupMember");
    return this;
  }

  //插入数据包含分组和成员,jsonObj对象
  //fn 回调函数 function(err, result){}
  add(group,groupMember,fn){
    this.dbGroup.insert(group,fn);
    if(groupMember.length){
      for(let i=0;i<groupMember.length;i++){
        this.dbGroupMember.insert(groupMember[i],fn);
      }
    }
  }
  //添加一个成员,jsonObj对象
  //fn 回调函数 function(err, result){}
  addMember(groupMember,fn){
      this.dbGroupMember.insert(groupMember,fn);
  }
  //查询组,json条件 如{id:3,name:'hello'}
  //查询指定数据 fn 回调函数 function(err, result){}
  queryConfig(jsonConfig,fn){
      this.dbGroup.query(jsonConfig,fn);
  }
   //查询所有数据 fn 回调函数 function(err, result){}
   queryAll({},fn){
     this.dbGroup.query({},fn);
   }

  //查查询组,json条件 如{uuid:'6234234'}
  //查询组 fn 回调函数 function(err, result){}
  queryGroupByUUID(uuid,fn){
    this.dbGroup.query({uuid:uuid},fn);
  }
 //查询数据,json条件 如{uuid:'6234234'}
  //查询指定数据 fn 回调函数 function(err, result){}
  queryByGroupUri(groupUri,fn){
    this.dbGroup.query({groupUri:groupUri},fn);
  }
  queryMemberByGroupUri(groupUri,fn){
    this.dbGroupMember.query({groupUri:groupUri},fn);
  }
  //更新一条数据,uuid条件 如{uuid:'6234234'}
  //更新的数据,json条件 如{id:3,name:'hello'}
  //查询指定数据 fn 回调函数 function(err, result){}
  updateByUUID(uuid,jsonObj,fn){
    this.dbGroup.update({uuid:uuid},jsonObj,fn);
  }
  //更新多条数据,config条件 如{id:3,name:'hello'}
  //更新的数据,json条件 如{age:5,name:'hello234'}
  //查询指定数据 fn 回调函数 function(err, result){}
  updateGroup(groupUri,jsonObj,fn){
    this.dbGroup.update({groupUri:groupUri},jsonObj,fn);
  }
  //根据groupUri删除一条数据
  //删除一条数据 fn 回调函数 function(err, result){}
  removeGroupOne(groupUri,fn){
    this.dbGroup.remove({groupUri:groupUri},fn);
    this.dbGroupMember.remove({groupUri:groupUri},fn);
  }
  //根据userUri删除分组成员,userUri 如{userUri:'6234234'}
  //删除一条数据 fn 回调函数 function(err, result){}
  removeGroupMember(userUri,fn){
    this.dbGroupMember.remove({userUri:userUri},fn);
  }
}*/
export {DB}

