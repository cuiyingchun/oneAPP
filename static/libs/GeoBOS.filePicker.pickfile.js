(function(GeoBOS,window){var G=GeoBOS||{};G.filePicker=G.filePicker||{};G.filePicker.pickFile=function(path,callback){if(!window){return callback(new Error("not browser environment!"))}if(typeof path!=="string"){return callback(new Error("Arguments Error:"+"path shuold be a string"))}if(path.charAt(path.length-1)!=="/"){path=path+"/"}var containerStyle="position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 2000;background-color: #F2F2F2";var titleBar='<div style="font-size: 18px; text-align: center; position: absolute; top: 0px; left: 0px; right: 0px; height: 50px; background: rgb(23, 68, 94); box-shadow: rgb(0, 0, 0) 0px 0px 5px 0px;">'+'<div id ="bos_file_picker_back" style="position: absolute; top: 0px; left: 0px; bottom: 0px; padding-right: 10px; padding-left: 10px; user-select: none;">'+'<div style="width: 8px; float: left; margin-top: 15px; color: white; font-weight: bold;">&lt;</div>'+'<div style="color: white; margin-left: 18px; margin-top: 15px;">返回</div>'+"</div>"+'<div style="margin: 15px auto 0px; color: white;">文件选择器</div>'+'<div id = "bos_file_picker_exit" style="position: absolute; color: white; top: 15px; right: 10px; bottom: 0px;">退出</div>'+"</div>";var pathLine='<div id="bos_file_picker_current_path" style="font-size: 18px; color: black; position: absolute; top: 65px; left: 20px; right: 0px;">/</div>'+'<div style="position: absolute; top: 92px; width: 100%; margin: 0px; height: 1px; border: 0px; background-color: rgb(213, 213, 213); color: rgb(213, 213, 213);"></div>';var fileList='<table id="bos_file_picker_file_list" style="position: absolute; top: 92px; overflow-y: auto; left: 0px; right: 0px; bottom: 0px; display: block;"></table>';var doc=window.document;var rootContainer=doc.createElement("div");rootContainer.style.cssText=containerStyle;rootContainer.innerHTML+=titleBar;rootContainer.innerHTML+=pathLine;rootContainer.innerHTML+=fileList;doc.body.appendChild(rootContainer);function onKeyDown(e){var BACK_KEYCODE=4;var event=e||window.event;if(e.which===BACK_KEYCODE){exit()}event.preventDefault();return false}document.addEventListener("keyup",onKeyDown,false);function exit(){document.removeEventListener("keyup",onKeyDown,false);doc.body.removeChild(rootContainer)}var backBtn=doc.getElementById("bos_file_picker_back");backBtn.onclick=function(){if(currentPath==="/"){return}var fileList=currentPath.split("/");var newPath="/";for(var i=1;i<fileList.length-2;i++){newPath+=fileList[i]+"/"}setCurrentPath(newPath)};var exitBtn=doc.getElementById("bos_file_picker_exit");exitBtn.onclick=function(){exit()};var fileItemDivider=function(doc){var item=doc.createElement("div");item.style.cssText="margin: 0px; height: 1px; border: 0px; background-color: rgb(213, 213, 213); color: rgb(213, 213, 213);";return item}(doc);function createFileItem(file){var filename=file.name;var dir=file.type==="d";function createFileNameItem(fileName){var item=doc.createElement("td");item.style.cssText="position: absolute; left: 60px; font-size: 18px; color: black;";item.innerHTML=fileName;return item}function createFileIcon(dir){var item=doc.createElement("td");item.style.cssText="position: absolute; left: 10px;";if(dir){item.innerHTML="<div>"+'<div style="width: 14px; height: 4px; background-color: rgb(204, 102, 0);"></div>'+'<div style="top: 4px; width: 24px; height: 15px; background-color: rgb(204, 102, 0);"></div>'+"</div>"}return item}var item=doc.createElement("tr");item.style.cssText="width: 100%; height: 25px; display: block; margin: 18px;";var fileItem=createFileNameItem(filename);if(dir){item.onclick=function(f,currentPath){return function(){currentPath+=f.name;setCurrentPath(currentPath)}}(file,currentPath)}else{item.onclick=function(f,currentPath){return function(){exit();var path=currentPath+f.name;callback(null,path)}}(file,currentPath)}item.appendChild(fileItem);item.appendChild(createFileIcon(dir));fileListContainer.appendChild(item);fileListContainer.appendChild(fileItemDivider.cloneNode())}var pathHint=doc.getElementById("bos_file_picker_current_path");var fileListContainer=doc.getElementById("bos_file_picker_file_list");var PATH_PREFIX="/sdcard";var currentFileList=[];var currentPath=path;function setCurrentPath(path){pathHint.innerHTML=path;currentPath=path;if(currentPath==="/"){backBtn.style.display="none"}else{backBtn.style.display="block"}G.shell.run("ls",["-l","-1",PATH_PREFIX+path],function(err,res){if(err){return callback(new Error(err.message))}currentFileList=[];while(fileListContainer.hasChildNodes()){fileListContainer.removeChild(fileListContainer.firstChild)}var fileList=res.data.split("\n");if(fileList.length<=2){}else{fileList.pop();fileList.shift();for(var i=0;i<fileList.length;i++){var items=fileList[i].split(" ");var file={type:items[0][0],name:items[0][0]==="d"?items[items.length-1]+"/":items[items.length-1]};currentFileList.push(file);createFileItem(file)}}})}setCurrentPath(path)}})(GeoBOS,window);