import Vue from 'vue'
import Router from 'vue-router'
import Loading from '@/components/loading/Loading'
import Main from '@/components/Main'
//选择网络
import Choice from "@/components/choice/choice"
//登录
import Login from '@/components/login/login'
//通讯录-会话
import Contact from '@/components/contact/communication/Contact'
import Empty from '@/components/contact/communication/empty'
import Chat from '@/components/contact/communication/chat'
import ChatMany from '@/components/contact/communication/chat-many'
import ChatGroup from '@/components/contact/communication/chat-group'
import FormatPhrase from '@/components/contact/communication/format-phrase'
import HandPaint from '@/components/contact/communication/hand-paint'
import CallDetail from '@/components/contact/communication/call-detail'
import ChatSetting from '@/components/contact/communication/chat-setting'
import ChatBackground from '@/components/contact/communication/chat-background'
import ChatHistory from '@/components/contact/communication/chat-history'
import ChatTransmit from '@/components/contact/communication/chat-transmit'
//通讯录-联系人列表
import AddressList from '@/components/contact/address-list/address-list'
import Search from '@/components/contact/address-list/search'
import DetailInformation from '@/components/contact/address-list/detail-information'
import ManageGroup from '@/components/contact/address-list/manage-group'
import ChooseSend from '@/components/contact/address-list/choose-send'
import CopyMember from '@/components/contact/address-list/copy-member'
import MoveMember from '@/components/contact/address-list/move-member'
import GroupInfo from '@/components/contact/address-list/group-information'
import AddGroup from '@/components/contact/address-list/add-group'
import AddGroupNext from '@/components/contact/address-list/addGroup-next'
//通讯录-我
import Me from '@/components/contact/contact-me/me'
import AdhocPtt from '@/components/contact/contact-me/adhoc-ptt'
import About from '@/components/contact/contact-me/about'
import VedioSetting from '@/components/contact/contact-me/vedio-setting'
import MessageSetting from '@/components/contact/contact-me/message-setting'
import TemplateMessage from '@/components/contact/contact-me/template-message'
import InportFormt from '@/components/contact/contact-me/importFormt'
import Templatepage from '@/components/contact/contact-me/templatePage'
import PersonalInformation from '@/components/contact/contact-me/personal-information'
import Handle from '@/components/map/handle'
import MapView from '@/components/map/zone'
import Tools from '@/components/map/tools'
import RemoteControl from '@/components/map/remote-control'
import ResInformation from '@/components/map/resInformation'
import SelfInfo from '@/components/contact/contact-me/self-info'
import Receive from '@/components/map/receive/receive'
import Guide from '@/components/map/guide'
import Information from '@/components/Me/information'
import MePro from '@/components/Me/MePro'
import MeChoiceF from '@/components/Me/MeChooseSend'
import ShareTrend from '@/components/Me/shareTrend'
import TsChooseSend from '@/components/Me/TsChooseSend'
import Emergency from '@/components/Me/emergency'
import MessageReminder from '@/components/Me/messageReminder'
import OfflineMap from '@/components/Me/offlineMap'
import SituationList from '@/components/situation-share/situation-list'
import Test from "@/components/map/test"
import Measure from "@/components/map/measure"
import NetworkTopology from "@/components/map/network-topology"
import Dial from '@/components/call/dial'

Vue.use(Router);
export default new Router({
  //进行路由的设置
  routes: [
    {
      path: '/',
      name: 'Loading',
      component: Loading
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/choice',
      name: 'Choice',
      component: Choice
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    //测试
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    //通讯录-会话
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/contact/:identity',
      name: 'Contact',
      component: Contact
    },

    {
      path: '/empty',
      name: 'Empty',
      component: Empty
    },
    {
      path: '/call-detail',
      name: 'CallDetail',
      component: CallDetail
    },
    {
      path: '/chat/:user/:where',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/chat-many/:chatUsers/:chatIps/:chatIds/:where',
      name: 'ChatMany',
      component: ChatMany
    },
    { path: '/chat-group/:group/:where',
      name: 'ChatGroup',
      component: ChatGroup
    },
    {
      path: '/chat-setting',
      name: 'ChatSetting',
      component: ChatSetting
    },
    {
      path: '/chat/chat-setting/chat-background',
      name: 'ChatBackground',
      component: ChatBackground
    },
    {
      path: '/chat/chat-setting/chat-history/:user',
      name: 'ChatHistory',
      component: ChatHistory
    },
    {
      path: '/chat/chat-setting/chat-history/:group',
      name: 'ChatHistory',
      component: ChatHistory
    },
    {
      path: '/chat/chat-transmit/:text/:type/:user',
      name: 'ChatTransmit',
      component: ChatTransmit
    },
    {
      path: '/format-phrase',
      name: 'FormatPhrase',
      component: FormatPhrase
    },
    {
      path: '/hand-paint',
      name: 'HandPaint',
      component: HandPaint
    },
    //通讯录-联系人列表
    {
      path: '/address-list',
      name: 'AddressList',
      component: AddressList
    },
    {
      path: '/detail-information/:user',
      name: 'DetailInformation',
      component: DetailInformation
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/address-list/manage-group',
      name: 'ManageGroup',
      component: ManageGroup
    },
    {
      path: '/address-list/choose-send',
      name: 'ChooseSend',
      component: ChooseSend
    },
    {
      path: '/address-list/group-info/:group',
      name: 'GroupInfo',
      component: GroupInfo
    },
    {
      path: '/address-list/add-group',
      name: 'AddGroup',
      component: AddGroup
    },
    {
      path: '/address-list/add-group/:allGroupName',
      name: 'AddGroup',
      component: AddGroup
    },
    {
      path: '/address-list/addGroup-next',
      name: 'AddGroupNext',
      component: AddGroupNext
    },
    {
      path: '/address-list/copy-member/:uid',
      name: 'CopyMember',
      component: CopyMember
    },
    {
      path: '/address-list/move-member/:user/:group',
      name: 'MoveMember',
      component: MoveMember
    },
    //通讯录-我
    {
      path: '/me',
      name: 'Me',
      component: Me
    },
    {
      path: '/me/personal-information',
      name: 'PersonalInformation',
      component: PersonalInformation
    },
    {
      path: '/me/message-setting',
      name: 'MessageSetting',
      component: MessageSetting
    },
    {
      path: '/me/vedio-setting',
      name: 'VedioSetting',
      component: VedioSetting
    },
    {
      path: '/inportFormt',
      name: 'InportFormt',
      component: InportFormt
    },
    {
      path: '/me/template-message',
      name: 'TemplateMessage',
      component: TemplateMessage
    },
    {
      path: '/me/template-message/templatePage',
      name: 'TemplatePage',
      component: Templatepage
    },
    {
      path: '/me/about',
      name: 'About',
      component: About
    },
    {
      path: '/me/adhoc-ptt',
      name: 'AdhocPtt',
      component: AdhocPtt
    },
    {
      path: '/handle',
      name: 'Handle',
      component: Handle,
      children: [
        {
          path: '/mapView',
          name: 'MapView',
          component: MapView,
          meta: {keepAlive: true}
        },
      ]
    },
    {
      path: '/handle/:sos',
      name: 'Handle',
      component: Handle,
      children: [
        {
          path: '/mapView',
          name: 'MapView',
          component: MapView,
          meta: {keepAlive: true}
        },
      ]
    },
    {
      path: '/situation-list',
      name: 'SituationList',
      component: SituationList
    },
    {
      path: '/tools',
      name: 'Tools',
      component: Tools
    },
    {
      path: '/remote-control',
      name: 'RemoteControl',
      component: RemoteControl
    },
    /*{
      path: '/resInformation',
      name: 'ResInformation',
      component: ResInformation
    },*/
    {
      path: '/resInformation/:warnInfo',
      name: 'ResInformation',
      component: ResInformation,
      children: [
        {
          path: '/resMapView',
          name: 'MapView',
          component: MapView,
          meta: {keepAlive: true}
        },
      ]
    },
    {
      path: '/mePro',
      name: 'MePro',
      component: MePro
    },
    {
      path: '/mePro/choicefri',
      name: 'MeChoiceF',
      component: MeChoiceF
    },
    {
      path: '/mePro/information',
      name: 'Information',
      component: Information
    },
    {
      path: '/mePro/emergency',
      name: 'Emergency',
      component: Emergency
    },
    {
      path: '/mePro/shareTrend',
      name: 'ShareTrend',
      component: ShareTrend
    },
    {
      path: '/mePro/tschoosesend',
      name: 'TsChooseSend',
      component: TsChooseSend
    },
    {
      path: '/mePro/messageReminder',
      name: 'MessageReminder',
      component: MessageReminder
    },
    {
      path: '/mePro/offlineMap',
      name: 'OfflineMap',
      component: OfflineMap
    },
    {
      path: '/receive/:id',
      name: 'Receive',
      component: Receive
    },
    {
      path: '/guide/:userObj',
      name: 'Guide',
      component: Guide
    },
    {
      path: '/selfInfo',
      name: 'SelfInfo',
      component: SelfInfo
    },
    {
      path: '/dial',
      name: 'Dial',
      component: Dial
    },
   /* {
      path: '/measure',
      name: 'Measure',
      component: Measure
    },*/
    {
      path: '/measure',
      name: 'Measure',
      component: Measure,
      children: [
        {
          path: '/measureMapView',
          name: 'MapView',
          component: MapView,
          meta: {keepAlive: true}
        },
      ]
    },
    {
      path: '/networkTopology',
      name: 'NetworkTopology',
      component: NetworkTopology
    },
  ]
})
