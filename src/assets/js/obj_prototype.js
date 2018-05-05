/**
 * Created by mayufeng on 2017/9/25
 * 对象类型js
 */
//"use strict"; //如果报错请开启这个
//user结构
class User {
  username = '';//用户名
  password = ""; //密码
  level = "";//级别  1：level1；2：level2；3：level3
  head_pic = "";//头像
  displayName = "";//显示名称
  sex = "";//性别
  telephone = "N";//电话
  role = "";//角色  团、营、连、排、工 （X级：营长，连长，排长，班长，士兵）
  userSipUri = "";//用户uri
  ad_hoc_ip = "";//暂时不用
  uhf_ip = ""; //网络ip
  uuid = ""; //唯一uuid
}
//群组分组结构
class Group {
  groupF = "1";//1分组，0多人发送,2创建群组
  groupName = "";//分组名称
  groupUri = "";//分组uri
  members = []; //组成员
  // membersIp = [];//成员ip
  // membersNames = [];//成员名字
  creator = "";//创建者群主
  subject = "";//主题
  notice = "";//通知
  groupPic = "";//图片
  type = "";//private 分组，public 群组,sosDefault 救援求助对象
  moduleUser = "";//当前账号的使用uri
  uuid = ""; //唯一uuid
}
//组成员结构
 class GroupMember{
  groupUri = "";//组uri
  userUri = "";//成员uri
}
//消息结构
 class Message{
  name = "message";
  msg = ""; //消息体
  msgType = "text"; //text,picture,audio,video,file
  isRead = "N";//是否已读，默认N
  isConfirm = "N";//是否需要确认,默认N 不需要
  isResponse = "N";//是否受到相应,默认N 不需要
  msgLevel = "1";//消息级别 1,2,3 一般，重要，紧急。
  isDelete = "N";//是否删除,默认N
  sender = "";//发送者
  receiver = "";//接受者
  senderDate = "";//发送时间
  fileName = ""; //文件名称
  filePath = "";//文件路径
  fileSize = "0";//文件大小
  groupUri = "";//群组uri
  msgStatus = "init";//init,sender,success,fail
  moduleUser = "";//当前账号的使用uri
  uuid = ""; //唯一uuid
}
//呼叫历史记录
 class CallHistory{
  type = "audio";//类型 audio,video
  isDelete = "N";//是否删除,默认N
  duration = "";//通话时长
  status = "fail";//success，fail
  isInComing = "0";// 0为主叫，1为被叫
  sender = "";//拨打者
  receiver = "";//接受者
  moduleUser = "";//当前账号的使用uri
  uuid = ""; //唯一uuid
}

//地图消息结构
class MapMessage{
  msg = ""; //消息体
  iconPath="";//图片地址
  msgType = "T"; //T态势，J紧急，W威胁，Y引导，S缩略调制
  isRead = "N";//是否已读，默认N
  sender = "";//发送者
  receiver = "";//接受者
  sendDate = "";//发送时间
  infoLocation="Y";//信息定位
  targetLocation="Y";//目标定位
  axes="0.0000#0.00000";//xy坐标系?
  longitude="";
  latitude="";
  plots="";//标绘信息
  type;//救援类型：火灾.
  level="";//级别 如：二级预警
  operate="";//预警发布
  filter="";//1对手2我3友4中立5海6陆7空 可选多个,逗号分隔
  status="";//1 撤销，2 申请，3推送
  warningTime="";//报警时间
  areaRange=[]; //可保持多个数组格式
  moduleUser = "";//当前账号的使用uri
  uuid = ""; //唯一uuid
}
//救援求助人员
class SosPeople{
  userNames=[];//显示名称
  userUri="";//用户唯一标识
  moduleUser = "";//当前账号的使用uri
  uuid = ""; //唯一uuid
}
//态势共享人员
class SharePeople{
  userNames=[];//显示名称
  userUri="";//用户唯一标识
  moduleUser = "";//当前账号的使用uri
  uuid = ""; //唯一uuid
}
//标绘信息
class plotImg{
  name="";
  adhoc="true";
  situation = "";
  plotUrl="";
  moduleUser="";//用户唯一标识
  longitude="";//经度
  latitude="";//纬度
  attribute="";//属性
  number="";//数量
  arms="";//兵种
  condition="";//状态
  pictrue=[];//图片
  audio="";//音频
  video="";//视频
  descript="";//描述
  uuid=""
}
export{User,Group,GroupMember,Message,CallHistory,MapMessage,SosPeople,SharePeople,plotImg}
