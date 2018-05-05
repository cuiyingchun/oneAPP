(function(GeoBOS){GeoBOS=GeoBOS||{};GeoBOS.bluetooth=function(){var setEnabled,isEnabled,startDiscovery,getLocalDevice,getPairedDevices,stopDiscovery,createBond,isBonded,destroyBond,connect,disconnect,getRemoteDevice,getAddress,getName;var onDeviceFound,onDiscoveryFinished;var bluetoothAPI=navigator.bluetoothAdapter;setEnabled=function(enable,callback){if(enable){bluetoothAPI.enable(function(event){}).then(()=>{callback(null)}).catch(err=>{callback(err)})}else{bluetoothAPI.disable(function(event){}).then(()=>{callback(null)}).catch(err=>{callback(err)})}};isEnabled=function(callback){bluetoothAPI.isEnabled().then(isEnable=>{callback(null,isEnable)}).catch(err=>{callback(err)})};getLocalDevice=function(callback){GeoBOS.shell.run("hciconfig",["hci0","name"],function(err,res){if(err){return callback(err)}if(!res||"string"!=typeof res.data){return callback(new Error("cannot get bluetooth device info"))}var deviceInfo={address:"",name:""};res.data.replace(/BD\ Address:\ (.*)\ ACL\ MTU:/,function(s,address){deviceInfo.address=address;res.data.replace(/Name:\ '(.*)'/,function(s,name){deviceInfo.name=name;callback(null,deviceInfo)})})})};getAddress=function(callback){GeoBOS.shell.run("hcitool",["dev"],function(err,res){if(err){return callback(err)}if(!res||"string"!=typeof res.data){return callback(new Error("cannot get bluetooth address info"))}console.log(res.data);res.data.replace(/hci0(.*)/,function(s,address){console.log(address);callback(null,address.trim())})})};getName=function(callback){bluetoothAPI.getName().then(name=>{callback(null,name)}).catch(err=>{callback(err)})};getPairedDevices=function(callback){bluetoothAPI.getPairedDevices().then(devices=>{callback(null,devices)}).catch(err=>{callback(err)})};startDiscovery=function(callback){bluetoothAPI.startDiscovery().then(()=>{callback(null)}).catch(err=>{callback(err)})};stopDiscovery=function(callback){bluetoothAPI.stopDiscovery().then(()=>{callback(null)}).catch(err=>{callback(err)})};pair=function(mac,callback){bluetoothAPI.pair(mac).then(()=>{return callback(null)}).catch(err=>{callback(err)})};unpair=function(mac,callback){bluetoothAPI.unpair(mac).then(()=>{return bluetoothAPI.getPairedDevices()}).then(devices=>{for(var i=0;i<devices.length;i++){var dev=devices[i];if(dev.address===mac){return callback(new Error("unpair failed"))}}return callback(null)}).catch(err=>{callback(err)})};isPaired=function(mac,callback){bluetoothAPI.getPairedDevices().then(devices=>{for(var i=0;i<devices.length;i++){var dev=devices[i];if(dev.address===mac){return callback(null,true)}}return callback(null,false)}).catch(err=>{callback(err)})};connect=function(callback){callback(new Error("not supported now"))};disconnect=function(callback){callback(new Error("not supported now"))};getRemoteDevice=function(callback){callback(new Error("not supported now"))};onDeviceFound=function(){var _listenerMap={};var _counter=0;function EventRemoteDeviceFound(event){for(var key in _listenerMap){if(_listenerMap.hasOwnProperty){_listenerMap[key](event.device)}}}bluetoothAPI.addEventListener("devicefound",EventRemoteDeviceFound,false);var addListener=function(listener){_listenerMap[++_counter]=listener};var removeListener=function(){if("undefined"!==typeof listener){for(var key in _listenerMap){if(_listenerMap.hasOwnProperty(key)&&_listenerMap[key]===listener){delete _listenerMap[key]}}}else{_listenerMap={};_counter=0}};return{addListener:addListener,removeListener:removeListener}}();onDiscoveryFinished=function(){var _listenerMap={};var _counter=0;function discoveryFinished(event){for(var key in _listenerMap){if(_listenerMap.hasOwnProperty){_listenerMap[key]()}}}bluetoothAPI.addEventListener("devicefound",discoveryFinished,false);var addListener=function(listener){_listenerMap[++_counter]=listener};var removeListener=function(){if("undefined"!==typeof listener){for(var key in _listenerMap){if(_listenerMap.hasOwnProperty(key)&&_listenerMap[key]===listener){delete _listenerMap[key]}}}else{_listenerMap={};_counter=0}};return{addListener:addListener,removeListener:removeListener}}();return{setBluetoothEnabled:setEnabled,isBluetoothEnabled:isEnabled,getLocalDevice:getLocalDevice,getAddress:getAddress,getName:getName,getPairedDevices:getPairedDevices,startDiscovery:startDiscovery,stopDiscovery:stopDiscovery,pair:pair,unpair:unpair,isPaired:isPaired,connect:connect,disconnect:disconnect,getRemoteDevice:getRemoteDevice,onDeviceFound:onDeviceFound,onDiscoveryFinished:onDiscoveryFinished}}()})(GeoBOS);