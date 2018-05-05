!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["bos-ui"]=t():e["bos-ui"]=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=212)}({0:function(e,t){e.exports=function(e,t,n,o,i){var s,u=e=e||{},r=typeof e.default;"object"!==r&&"function"!==r||(s=e,u=e.default);var d="function"==typeof u?u.options:u;t&&(d.render=t.render,d.staticRenderFns=t.staticRenderFns),o&&(d._scopeId=o);var a;if(i?(a=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(i)},d._ssrRegister=a):n&&(a=n),a){var c=d.functional,l=c?d.render:d.beforeCreate;c?d.render=function(e,t){return a.call(t),l(e,t)}:d.beforeCreate=l?[].concat(l,a):[a]}return{esModule:s,exports:u,options:d}}},2:function(e,t,n){"use strict";function o(e,t,n){this.$children.forEach(function(i){i.$options.componentName===e?i.$emit.apply(i,[t].concat(n)):o.apply(i,[e,t].concat([n]))})}Object.defineProperty(t,"__esModule",{value:!0}),t.default={methods:{dispatch:function(e,t,n){for(var o=this.$parent||this.$root,i=o.$options.componentName;o&&(!i||i!==e);)(o=o.$parent)&&(i=o.$options.componentName);o&&o.$emit.apply(o,[t].concat(n))},broadcast:function(e,t,n){o.call(this,e,t,n)}}}},212:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(213),i=function(e){return e&&e.__esModule?e:{default:e}}(o);i.default.install=function(e){e.component(i.default.name,i.default)},t.default=i.default},213:function(e,t,n){var o=n(0)(n(214),n(215),null,null,null);o.options.__file="E:\\Git\\bos-ui\\packages\\menu\\src\\menu.vue",o.esModule&&Object.keys(o.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),o.options.functional&&console.error("[vue-loader] menu.vue: functional components are not supported with templates, they should use render functions."),e.exports=o.exports},214:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),i=function(e){return e&&e.__esModule?e:{default:e}}(o);t.default={name:"BosMenu",componentName:"BosMenu",mixins:[i.default],props:{mode:{type:String,default:"vertical"},defaultActive:{type:String,default:""},defaultOpeneds:Array,theme:{type:String,default:"light"},uniqueOpened:Boolean,router:Boolean,menuTrigger:{type:String,default:"hover"}},data:function(){return{activedIndex:this.defaultActive,openedMenus:this.defaultOpeneds?this.defaultOpeneds.slice(0):[],items:{},submenus:{}}},watch:{defaultActive:function(e){var t=this.items[e];t?(this.activedIndex=t.index,this.initOpenedMenu()):this.activedIndex=""},defaultOpeneds:function(e){this.openedMenus=e}},methods:{addItem:function(e){this.$set(this.items,e.index,e)},removeItem:function(e){delete this.items[e.index]},addSubmenu:function(e){this.$set(this.submenus,e.index,e)},removeSubmenu:function(e){delete this.submenus[e.index]},openMenu:function(e,t){var n=this.openedMenus;-1===n.indexOf(e)&&(this.uniqueOpened&&(this.openedMenus=n.filter(function(e){return-1!==t.indexOf(e)})),this.openedMenus.push(e))},closeMenu:function(e,t){this.openedMenus.splice(this.openedMenus.indexOf(e),1)},handleSubmenuClick:function(e){var t=e.index,n=e.indexPath;-1!==this.openedMenus.indexOf(t)?(this.closeMenu(t,n),this.$emit("close",t,n)):(this.openMenu(t,n),this.$emit("open",t,n))},handleItemClick:function(e){var t=e.index,n=e.indexPath;this.activedIndex=e.index,this.$emit("select",t,n,e),"horizontal"===this.mode&&(this.openedMenus=[]),this.router&&this.routeToItem(e)},initOpenedMenu:function(){var e=this,t=this.activedIndex,n=this.items[t];if(n&&"horizontal"!==this.mode){n.indexPath.forEach(function(t){var n=e.submenus[t];n&&e.openMenu(t,n.indexPath)})}},routeToItem:function(e){var t=e.route||e.index;try{this.$router.push(t)}catch(e){console.error(e)}}},mounted:function(){this.initOpenedMenu(),this.$on("item-click",this.handleItemClick),this.$on("submenu-click",this.handleSubmenuClick)}}},215:function(e,t,n){e.exports={render:function(){var e=this,t=e.$createElement;return(e._self._c||t)("ul",{staticClass:"bos-menu",class:{"bos-menu--horizontal":"horizontal"===e.mode,"bos-menu--dark":"dark"===e.theme}},[e._t("default")],2)},staticRenderFns:[]},e.exports.render._withStripped=!0}})});