export default {
  stag:"",
  newGroup: {
    groupNames:[],
  },
  //当前用户所在群组
  /*currentGroup:{
    groupInfo:"",
    groupMumber:[],
    count:undefined
  },*/
  //所有联系人
  currentUserAll:[],
  //所有群组
  groups:[],
  //当前用户
  account:undefined,
  //聊天状态/应答/字体
  chatStatus:{
    infoLevel: 1,
    statusColor: '#e7d117',
    fontStyle: "3",
    isReply: false,
    snum: '',//查找某条模板信息
  },
  //当前用户的经纬度,通信模式,所在的节点号
  currentUser:{
    longitude:undefined,
    latitude:undefined,
    communicationMode:"",
    contact:false /*用户当前是否在会话页面*/,
    nodeNum:11,
    arrNetwork:[1,5,6,7,10,13] /*网络拓扑在线数*/
  },
  //救援对象
  recourseMembers:{
    emergencyMembersNames:[],
    emergencyMembersIp:[],
    //共享对象
    shareMembersNames:[],
    shareMembersIp:[],
  },
  //标绘页面的经纬度
  plotView:{
    longitude:undefined,
    latitude:undefined,
    plotId:undefined,
    plotPicture:undefined,
    info:false
  },
  //标绘
  //plotIdArr:[],
  plotPosition:undefined,
  plotIds:[],
  //标绘信息
  plotInfo:{
    name:"",
    plotUrl:"",
    plotUser:"",
    longitude:"",
    latitude:"",
    attribute:'我',
    number: 0,
    arms:'陆',
    condition: '完整',
    pictrue:'./static/plotimg/map_plotting_photo_default.png',
    audio:"",
    audioReceive:"",
    video:"",
    videoReceive:"",
    descript:"无",
    uuid:'',
    situation:"sender",
    plotSituation:"",
    pictrueReceive:"",
    isRead:"N",
    msgType:"S",
    sendDate:undefined,
    sender:undefined,
    isShow:true
  },
  //地图上点击的点的经纬度
  mapLonLa:{
    cartesians: [],
    cartesianLead:[]
  },
  //图层设置
  army: true,
  oneself: true,
  friend: true,
  neutral: true,
  land: true,
  sea: true,
  sky: true,
  //提交与更改切换
  tempToggle:true,
  //更新标绘组件
  showTemp: false,
  tabwarn:true,
  tabts:true,
  tsFlag:false,
  //ip数据
  myIP:'192.168.1.1',
  otherIP:'192.168.191.22',
  //当前聊天页面背景颜色
  backgroundColor: undefined,
//  复制板
  copyText:'',
  pasteText:'',
  textType:"",
// 转发
  transText:'',
//  当前操作的内容
  nowText:undefined,
  nowDate:undefined,
  nowImg:undefined,
  //音视频设置
  vedioSetting:{
    audio:undefined,
    code:undefined,
    band:undefined
  },
  //消息设置
  messageSetting:{
    notice: undefined,
    sound: undefined,
    vibrate: undefined,
  },
  //我的设置
  mute:undefined,//静音
  //更新周期
  updateCycle:undefined,
  //状态
  condition:{
    memberNumber:undefined,
    conditionDetail:undefined
  },
  remind:{
    //紧急救援救助提示
    rescueRemind:{
      lamp:undefined,
      vibrate:undefined,
      sound:undefined
    },
    //态势申请提示
    situationRemind:{
      lamp:undefined,
      vibrate:undefined,
      sound:undefined
    },
    //引导申请提示
    guideRemind:{
      lamp:undefined,
      vibrate:undefined,
      sound:undefined
    },
    //略图调制提示
    sketchRemind:{
      lamp:undefined,
      vibrate:undefined,
      sound:undefined
    },
    //威胁告警提示
    alarmRemind:{
      lamp:undefined,
      vibrate:undefined,
      red:undefined,
      orange:undefined,
      yellow:undefined,
      blue:undefined
    }

  },
  //当前页面
  nowPage:undefined,
//  态势的页面
  activeName:undefined,
//  发送失败
  msgFail:false,
  picFail:false,
  adoFail:false,
  videoFail:false,
  fileFail:false,
//  移动地图内的图标
  areaPlots:[],
//  移动地图的四个点
  pointCartesian:[],
  pointArr:[],
//  当前位置
  nowPoint:{
    longitude:114.50,
    latitude:38.04,
  },
  canvasPicture:undefined,
  mapRate:1500,
  rateBorder:undefined,
//对方的路径
  otherPath:{
    user:undefined,
    paths:[]
  },
//  位置（定位）
  isFix:false,
  //电话
  call:{
    showDial:false,//控制音频电话页面显隐
    isDial:undefined,//判断是否为拨打方
    dialUser:undefined,
  },
  //会话页信息与电话切换
  contactName:'first'
}

