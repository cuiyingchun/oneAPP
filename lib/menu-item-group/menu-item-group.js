!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["bos-ui"]=t():e["bos-ui"]=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=204)}({0:function(e,t){e.exports=function(e,t,n,o,r){var u,s=e=e||{},i=typeof e.default;"object"!==i&&"function"!==i||(u=e,s=e.default);var a="function"==typeof s?s.options:s;t&&(a.render=t.render,a.staticRenderFns=t.staticRenderFns),o&&(a._scopeId=o);var l;if(r?(l=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},a._ssrRegister=l):n&&(l=n),l){var p=a.functional,d=p?a.render:a.beforeCreate;p?a.render=function(e,t){return l.call(t),d(e,t)}:a.beforeCreate=d?[].concat(d,l):[l]}return{esModule:u,exports:s,options:a}}},204:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(205),r=function(e){return e&&e.__esModule?e:{default:e}}(o);r.default.install=function(e){e.component(r.default.name,r.default)},t.default=r.default},205:function(e,t,n){var o=n(0)(n(206),n(207),null,null,null);o.options.__file="E:\\Git\\bos-ui\\packages\\menu\\src\\menu-item-group.vue",o.esModule&&Object.keys(o.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),o.options.functional&&console.error("[vue-loader] menu-item-group.vue: functional components are not supported with templates, they should use render functions."),e.exports=o.exports},206:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"BosMenuItemGroup",componentName:"BosMenuItemGroup",props:{title:{type:String}},data:function(){return{paddingLeft:20}},computed:{levelPadding:function(){for(var e=10,t=this.$parent;t&&"BosMenu"!==t.$options.componentName;)"BosSubmenu"===t.$options.componentName&&(e+=20),t=t.$parent;return 10===e&&(e=20),e}}}},207:function(e,t,n){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",{staticClass:"bos-menu-item-group"},[n("div",{staticClass:"bos-menu-item-group__title",style:{paddingLeft:e.levelPadding+"px"}},[e.$slots.title?e._t("title"):[e._v(e._s(e.title))]],2),e._v(" "),n("ul",[e._t("default")],2)])},staticRenderFns:[]},e.exports.render._withStripped=!0}})});