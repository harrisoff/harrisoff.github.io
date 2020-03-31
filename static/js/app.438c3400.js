(function(e){function t(t){for(var r,o,s=t[0],c=t[1],u=t[2],d=0,p=[];d<s.length;d++)o=s[d],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&p.push(i[o][0]),i[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(t);while(p.length)p.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,s=1;s<n.length;s++){var c=n[s];0!==i[c]&&(r=!1)}r&&(a.splice(t--,1),e=o(o.s=n[0]))}return e}var r={},i={app:0},a=[];function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/static/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var l=c;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"editor-field"},[n("div",{staticClass:"video-wrapper"},[n("video",{ref:"video",attrs:{src:e.videoSrc,controls:""},on:{timeupdate:e.handleTimeUpdate,seeked:e.handleSeeked}}),n("p",{staticClass:"sub-preview"},[e._v(e._s(e.currentSub))])]),n("div",{staticClass:"sub-wrapper"},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.rawSubs,expression:"rawSubs"}],ref:"textarea",domProps:{value:e.rawSubs},on:{input:function(t){t.target.composing||(e.rawSubs=t.target.value)}}})])]),n("div",{staticClass:"tool-field"},[n("div",{staticClass:"tool-row"},[n("button",{on:{click:e.handleImportVideo}},[e._v("打开视频")]),n("input",{ref:"inputVideo",attrs:{type:"file",accept:"video/*"},on:{change:e.handleChangeVideoInput}}),n("button",{on:{click:e.handleImportTxt}},[e._v("打开文本文档")]),n("input",{ref:"inputText",attrs:{type:"file",accept:"text/plain"},on:{change:e.handleChangeTxtInput}})]),n("div",{staticClass:"tool-row"},[e._v(" 字幕文件名："),n("input",{directives:[{name:"model",rawName:"v-model",value:e.filename,expression:"filename"}],attrs:{type:"text"},domProps:{value:e.filename},on:{input:function(t){t.target.composing||(e.filename=t.target.value)}}}),n("button",{on:{click:e.exportSRT}},[e._v("导出SRT")])]),n("div",{staticClass:"tool-row"},[n("label",[e._v("快捷键：")]),e._l(e.shortcuts,(function(t,r){return n("span",{key:r,staticClass:"shortcut"},[e._v(" "+e._s(t.label)+":"+e._s(t.keycode)+" ")])}))],2)])])},a=[],o=(n("99af"),n("7db0"),n("4160"),n("caad"),n("a15b"),n("d81d"),n("b0c0"),n("b680"),n("07ac"),n("ac1f"),n("2532"),n("5319"),n("1276"),n("159b"),n("3835")),s=n("b85c"),c=n("21a6"),u=/^(\[\d\d:\d\d:\d\d.\d\d\d\])(.*)/,l=/(.*)(\[\d\d:\d\d:\d\d.\d\d\d\])$/,d="[00:00:00.000]",p=d.length,f={name:"app",data:function(){return{rawSubs:"",tree:[],currentSub:"字幕预览",filename:"字幕.srt",videoSrc:"",video:null,textarea:null,lineBreak:"\r\n",shortcuts:{start:{keycode:"F1",label:"添加开始时间"},end:{keycode:"F2",label:"添加结束时间"},play:{keycode:"F3",label:"播放"},pause:{keycode:"F4",label:"暂停"}}}},computed:{lineBreakLength:function(){return this.lineBreak.length},reservedKeys:function(){return Object.values(this.shortcuts).map((function(e){return e.keycode}))}},watch:{rawSubs:{handler:function(e){this.lineBreak=this.detectLineBreak(e);var t=e.split(this.lineBreak),n=0,r=[];t.forEach((function(e){var t=u.test(e),i=l.test(e),a="",o="",s=e;t&&(a=s.substring(1,p-1),s=s.substring(p)),i&&(o=s.substring(s.length-(p-1),s.length-1),s=s.substring(0,s.length-p));var c=e.length;r.push({rawText:s,time:[a,o],position:[n,n+c]}),n+=c+1})),this.tree=r},immediate:!0}},created:function(){},mounted:function(){var e=this;this.video=this.$refs.video,this.textarea=this.$refs.textarea,window.addEventListener("keydown",(function(t){e.reservedKeys.includes(t.key)&&t.preventDefault()})),window.addEventListener("keyup",(function(t){if(e.reservedKeys.includes(t.key)&&e.textarea===document.activeElement)switch(t.key){case e.shortcuts.start.keycode:var n=e.getThisLine(),r=n.time[0]?"keep":"move",i=e.getTime();n.time[0]=i,e.render(r);break;case e.shortcuts.end.keycode:var a=e.getThisLine(),o=e.getTime();a.time[1]=o,e.render("next");break;case e.shortcuts.play.keycode:e.video.play();break;case e.shortcuts.pause.keycode:e.video.pause();break}}))},beforeUpdate:function(){},methods:{getThisLine:function(){var e=this.textarea.selectionEnd;return this.tree.find((function(t){return e>=t.position[0]&&e<=t.position[1]}))},getNextLine:function(e){var t,n,r=!1,i=Object(s["a"])(this.tree);try{for(i.s();!(n=i.n()).done;){var a=n.value;if(r){t=a;break}e>=a.position[0]&&e<=a.position[1]&&(r=!0)}}catch(o){i.e(o)}finally{i.f()}return t},render:function(e){var t=this,n=this.textarea.selectionEnd,r="",i="";this.tree.forEach((function(e){var n=e.time,r=e.rawText,a=Object(o["a"])(n,2),s=a[0],c=a[1];s=s?"[".concat(s,"]"):"",c=c?"[".concat(c,"]"):"",i+=s+r+c+t.lineBreak})),i=i.substr(0,i.length-this.lineBreakLength),this.rawSubs=i,this.$nextTick((function(){if("keep"===e)r=n;else if("move"===e)r=n+p;else{var i=t.getNextLine(n);r=i?i.position[1]:n}t.moveCursor(r)}))},getTime:function(){var e=this.video.currentTime.toFixed(3),t=parseInt(e/3600),n=parseInt((e-3600*t)/60),r=parseInt(e)%60,i=(e+"").split(".")[1];return t=t>=10?t:"0".concat(t),n=n>=10?n:"0".concat(n),r=r>=10?r:"0".concat(r),"".concat(t,":").concat(n,":").concat(r,".").concat(i)},handleTimeUpdate:function(){this.currentSub=this.getCurrentSub()},handleSeeked:function(){this.currentSub=this.getCurrentSub()},toVideoTime:function(e){var t=e.split("."),n=Object(o["a"])(t,2),r=n[0],i=n[1],a=r.split(":"),s=Object(o["a"])(a,3),c=s[0],u=s[1],l=s[2];return i=parseFloat(i)/1e3,c=parseInt(c),u=parseInt(u),l=parseInt(l),60*c*60+60*u+l+i},getCurrentSub:function(){var e=this,t=this.video.currentTime,n=this.tree.find((function(n){var r=Object(o["a"])(n.time,2),i=r[0],a=r[1];return i=e.toVideoTime(i),a=e.toVideoTime(a),isNaN(i)||isNaN(a)?t>=i:t>=i&&t<=a}));return n?n.rawText:""},handleImportVideo:function(){this.$refs.inputVideo.click()},handleChangeVideoInput:function(e){var t=this,n=e.target.files[0],r=n.name.split(".");r.pop();var i=r.join("."),a=i+".srt";this.filename=a;var o=new FileReader;o.onload=function(e){t.videoSrc=e.target.result},o.readAsDataURL(n)},handleImportTxt:function(){this.$refs.inputText.click()},handleChangeTxtInput:function(e){var t=this,n=e.target.files[0],r=new FileReader;r.onload=function(e){t.rawSubs=e.target.result},r.readAsText(n)},toSRT:function(){var e=this,t="";return this.tree.forEach((function(n,r){var i=n.rawText,a=n.time,s=Object(o["a"])(a,2),c=s[0],u=s[1];c=c.replace(".",","),u=u.replace(".",","),t+="".concat(r+1).concat(e.lineBreak),t+="".concat(c," --\x3e ").concat(u).concat(e.lineBreak),t+="".concat(i).concat(e.lineBreak).concat(e.lineBreak)})),t},exportSRT:function(){var e=new Blob([this.toSRT()],{type:"text/plain;charset=utf-8"});Object(c["saveAs"])(e,this.filename)},moveCursor:function(e){this.textarea.selectionStart=e,this.textarea.selectionEnd=e},detectLineBreak:function(e){return e?e.split("\r\n")[0]===e?"\n":"\r\n":""}}},h=f,v=(n("d134"),n("2877")),b=Object(v["a"])(h,i,a,!1,null,"3c0c3968",null),m=b.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(m)}}).$mount("#app")},"81e7":function(e,t,n){},d134:function(e,t,n){"use strict";var r=n("81e7"),i=n.n(r);i.a}});
//# sourceMappingURL=app.438c3400.js.map