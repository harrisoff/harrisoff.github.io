(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-132a119e"],{"1da1":function(t,e,r){"use strict";function n(t,e,r,n,i,o,a){try{var c=t[o](a),l=c.value}catch(t){return void r(t)}c.done?e(l):Promise.resolve(l).then(n,i)}function i(t){return function(){var e=this,r=arguments;return new Promise((function(i,o){var a=t.apply(e,r);function c(t){n(a,i,o,c,l,"next",t)}function l(t){n(a,i,o,c,l,"throw",t)}c(void 0)}))}}r.d(e,"a",(function(){return i})),r("d3b7"),r("e6cf")},"6aee":function(t,e,r){"use strict";r.r(e),r("99af"),r("baa5"),r("d81d"),r("b0c0"),r("96cf");var n=r("1da1"),i=(r("d3b7"),r("054a")),o=r("9d15"),a=r("8e4b"),c=r("2277"),l=r("a1bc");function s(t){var e="\n  db.collection('".concat(l.COLLECTIONS.ALBUM,"')\n  .add({\n    data: ").concat(JSON.stringify(t),"\n  })\n  ");return new Promise((function(t,r){return Object(i.a)(e).then((function(e){var r=e.id_list;t(r[0])})).catch(r)}))}function u(t,e){var r="\n  db.collection('".concat(l.COLLECTIONS.ALBUM,"')\n  .where({\n    _id: '").concat(t,"',\n  })\n  .update({\n    data: {\n      song_id: ").concat(JSON.stringify(e),"\n    }\n  })\n");return Object(o.b)(r)}function f(t){var e="\n  db.collection('".concat(l.COLLECTIONS.SONG,"')\n  .add({\n    data: ").concat(JSON.stringify(t),"\n  })\n  ");return new Promise((function(t,r){return Object(i.a)(e).then((function(e){var r=e.id_list;t(r)})).catch(r)}))}var d={name:"",components:{},filters:{},mixins:[],props:[],data:function(){return{isLoading:!1,albumList:[],dialogType:"add",isDialogVisible:!1,editId:"",formData:{artist:"The Beatles",title:"",release_time:""},formRules:{artist:[{required:!0,message:"缺少作者",trigger:"blur"}],title:[{required:!0,message:"缺少标题",trigger:"blur"}],release_time:[{required:!0,message:"缺少时间",trigger:"blur"}]},songList:[],coverFile:null,uploadedCover:!1,coverName:""}},computed:{},watch:{},beforeCreate:function(){},created:function(){},mounted:function(){this.getAlbums()},beforeUpdate:function(){},methods:{getAlbums:function(){var t,e=this;this.isLoading=!0,(t="\n  db.collection('".concat(l.COLLECTIONS.ALBUM,"').aggregate()\n  .lookup({\n    from: '").concat(l.COLLECTIONS.SONG,"',\n    localField: 'song_id',\n    foreignField: '_id',\n    as: 'songs',\n  })\n  .end()\n  "),new Promise((function(e,r){Object(i.b)(t).then((function(t){var r=t.data,n=Object(c.e)(r).map((function(t){var e=t._id,r=t.artist,n=t.title,i=t.release_time,o=t.songs,a=t.cover_id;return{_id:e,artist:r,title:n,release_time:i,songList:o.map((function(t){var e=t.title,r=t.cloud_id;return{title:e,_id:t._id,url:Object(c.d)(r)}})),cover:Object(c.d)(a)}}));e(n)})).catch(r)}))).then((function(t){e.albumList=t})).catch(this.$error).then((function(t){e.isLoading=!1}))},handleShowDialog:function(t,e){if(this.coverFile=null,this.uploadedCover=!1,this.coverName="",this.editId="",this.formData.release_time="",this.formData.title="",this.formData.artist="The Beatles",this.songList=[],"edit"===t){var r=e._id,n=e.title,i=e.artist,o=e.release_time;this.editId=r,this.formData.release_time=o,this.formData.title=n,this.formData.artist=i,this.coverName="留空时不修改图片"}this.dialogType=t,this.isDialogVisible=!0},handleCoverChange:function(t){var e=t.target.files[0];if(!e)return this.coverName="",void(this.coverFile=null);this.coverName=e.name,this.uploadFileExt=e.name.substring(e.name.lastIndexOf(".")),this.coverFile=e},handleSelectCover:function(){this.$refs.cover.value="",this.$refs.cover.click()},handleUploadCover:function(){var t=this;if(!this.coverFile)return this.$message.error("请选择文件");if(!this.coverName)return this.$message.error("输入文件名");var e="";e=this.coverName.substring(this.coverName.lastIndexOf("."))===this.uploadFileExt?this.coverName:this.coverName+this.uploadFileExt,function(t,e){return Object(a.c)(t,l.STORAGE.ALBUM_COVER,e)}(this.coverFile,e).then((function(e){var r=e.fileId,n=e.filename;e.filePath,t.formData.cover=r,t.$success("上传成功"),t.coverName=n,t.uploadedCover=!0})).catch((function(e){t.$error("图片上传失败: "+e)}))},handleUploadSuccess:function(t,e,r){this.songList=r},handleCustomUpload:function(t){var e=t.file;return function(t,e,r){return Object(a.b)(t,l.STORAGE.SONG,e,r)}(e,e.name,(function(e){t.onProgress({percent:e})}))},beforeSubmitAlbum:function(){var t=this;this.$confirm("确定？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then((function(){"add"===t.dialogType?t.submitAddAlbum():t.submitEditAlbum()}))},submitAddAlbum:function(){var t=this;if(!this.uploadedCover)return this.$message.error("没上传封面");this.$refs.form.validate(function(){var e=Object(n.a)(regeneratorRuntime.mark((function e(r){var n,i,o,c,l,d;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=23;break}return e.prev=1,n={artist:t.formData.artist,title:t.formData.title,release_time:t.formData.release_time,song_id:[],cover_id:t.formData.cover,record_time:"",genre:"",label:"",studio:"",producer:"",order:0,info:""},e.next=5,s(n);case 5:return i=e.sent,o=[],c=t.songList.map((function(t){var e=t.response,r=e.fileId,n=(e.filePath,e.filename);return o.push(r),{title:n.substring(0,n.lastIndexOf(".")),album_id:i,cloud_id:r,writer:"",singer:"",studio:"",side:"",order:0,lyrics:"",info:""}})),e.next=10,f(c);case 10:return l=e.sent,e.next=13,u(i,l);case 13:d=e.sent,t.$success(d),t.getAlbums(),t.isDialogVisible=!1,Object(a.d)([t.formData.cover].concat(o)).then((function(){t.$message("file 表更新成功")})).catch((function(e){t.$error("更新 file 表失败: "+e)})),e.next=23;break;case 20:e.prev=20,e.t0=e.catch(1),t.$error(e.t0);case 23:case"end":return e.stop()}}),e,null,[[1,20]])})));return function(t){return e.apply(this,arguments)}}())},submitEditAlbum:function(){var t=this;this.$refs.form.validate((function(e){if(e){var r={artist:t.formData.artist,title:t.formData.title,release_time:t.formData.release_time};t.uploadedCover&&(r.cover_id=t.formData.cover),function(t,e){var r="\n  db.collection('".concat(l.COLLECTIONS.ALBUM,"')\n  .where({\n    _id: '").concat(t,"',\n  })\n  .update({\n    data: ").concat(JSON.stringify(e),"\n  })\n");return Object(o.b)(r)}(t.editId,r).then((function(e){t.$success(e),t.getAlbums(),t.isDialogVisible=!1})).catch(t.$error)}}))}}},h=r("2877"),m=Object(h.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"view-albums-manage"},[r("div",[r("el-button",{attrs:{size:"small"},on:{click:function(e){return t.handleShowDialog("add")}}},[t._v("添加专辑")])],1),r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoading,expression:"isLoading"}],attrs:{data:t.albumList}},[r("el-table-column",{attrs:{type:"index",label:"#",align:"center"}}),r("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(t){return[r("el-table",{attrs:{data:t.row.songList}},[r("el-table-column",{attrs:{type:"index",label:"#"}}),r("el-table-column",{attrs:{prop:"title",label:"标题"}})],1)]}}])}),r("el-table-column",{attrs:{prop:"title",label:"标题"}}),r("el-table-column",{attrs:{label:"封面",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[r("a",{attrs:{href:e.row.cover,target:"_blank"}},[t._v("查看")])]}}])}),r("el-table-column",{attrs:{prop:"release_time",label:"时间"}}),r("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[r("el-button",{attrs:{size:"mini"},on:{click:function(r){return t.handleShowDialog("edit",e.row)}}},[t._v("修改")])]}}])})],1),r("el-dialog",{attrs:{title:"add"===t.dialogType?"新增":"修改",visible:t.isDialogVisible,"before-close":function(){return t.isDialogVisible=!1}}},[r("el-form",{ref:"form",attrs:{model:t.formData,rules:t.formRules,"label-width":"80px"}},[r("el-form-item",{attrs:{label:"艺术家",prop:"artist"}},[r("el-input",{attrs:{size:"mini"},model:{value:t.formData.artist,callback:function(e){t.$set(t.formData,"artist",e)},expression:"formData.artist"}})],1),r("el-form-item",{attrs:{label:"专辑名",prop:"title"}},[r("el-input",{attrs:{size:"mini"},model:{value:t.formData.title,callback:function(e){t.$set(t.formData,"title",e)},expression:"formData.title"}})],1),r("el-form-item",{attrs:{label:"发布时间",prop:"release_time"}},[r("el-input",{attrs:{size:"mini"},model:{value:t.formData.release_time,callback:function(e){t.$set(t.formData,"release_time",e)},expression:"formData.release_time"}})],1),r("el-form-item",{attrs:{label:"专辑封面"}},[r("el-button",{attrs:{disabled:t.uploadedCover,size:"mini"},on:{click:t.handleSelectCover}},[t._v("选择专辑封面")]),r("el-button",{attrs:{disabled:t.uploadedCover,type:"primary",size:"mini"},on:{click:t.handleUploadCover}},[t._v("上传")]),r("br"),r("el-input",{attrs:{disabled:t.uploadedCover,placeholder:"文件名",size:"mini"},model:{value:t.coverName,callback:function(e){t.coverName=e},expression:"coverName"}})],1),"add"===t.dialogType?r("el-form-item",{attrs:{label:"歌曲"}},[r("el-upload",{ref:"upload",staticClass:"upload-demo",attrs:{action:"string","on-success":t.handleUploadSuccess,"http-request":t.handleCustomUpload,"file-list":t.songList,accept:"audio/mp3",multiple:""}},[r("el-button",{attrs:{slot:"trigger",size:"mini",type:"primary"},slot:"trigger"},[t._v("选择文件")])],1)],1):t._e(),r("el-form-item",{staticStyle:{"text-align":"right"}},[r("el-button",{on:{click:function(e){t.isDialogVisible=!1}}},[t._v("取消")]),r("el-button",{attrs:{type:"primary"},on:{click:t.beforeSubmitAlbum}},[t._v("提交")])],1)],1),r("input",{ref:"cover",staticStyle:{display:"none"},attrs:{type:"file"},on:{change:t.handleCoverChange}})],1)],1)}),[],!1,null,"7c40763c",null);e.default=m.exports},"96cf":function(t,e,r){var n=function(t){"use strict";var e=Object.prototype,r=e.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},i=n.iterator||"@@iterator",o=n.asyncIterator||"@@asyncIterator",a=n.toStringTag||"@@toStringTag";function c(t,e,r,n){var i=e&&e.prototype instanceof u?e:u,o=Object.create(i.prototype),a=new x(n||[]);return o._invoke=function(t,e,r){var n="suspendedStart";return function(i,o){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===i)throw o;return O()}for(r.method=i,r.arg=o;;){var a=r.delegate;if(a){var c=y(a,r);if(c){if(c===s)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=l(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===s)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,a),o}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=c;var s={};function u(){}function f(){}function d(){}var h={};h[i]=function(){return this};var m=Object.getPrototypeOf,p=m&&m(m(L([])));p&&p!==e&&r.call(p,i)&&(h=p);var v=d.prototype=u.prototype=Object.create(h);function g(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function b(t,e){var n;this._invoke=function(i,o){function a(){return new e((function(n,a){!function n(i,o,a,c){var s=l(t[i],t,o);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==typeof f&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,a,c)}),(function(t){n("throw",t,a,c)})):e.resolve(f).then((function(t){u.value=t,a(u)}),(function(t){return n("throw",t,a,c)}))}c(s.arg)}(i,o,n,a)}))}return n=n?n.then(a,a):a()}}function y(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,y(t,e),"throw"===e.method))return s;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return s}var n=l(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,s;var i=n.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,s):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,s)}function w(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function x(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(w,this),this.reset(!0)}function L(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:O}}function O(){return{value:void 0,done:!0}}return f.prototype=v.constructor=d,d.constructor=f,d[a]=f.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===f||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,d):(t.__proto__=d,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(v),t},t.awrap=function(t){return{__await:t}},g(b.prototype),b.prototype[o]=function(){return this},t.AsyncIterator=b,t.async=function(e,r,n,i,o){void 0===o&&(o=Promise);var a=new b(c(e,r,n,i),o);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},g(v),v[a]="Generator",v[i]=function(){return this},v.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=L,x.prototype={constructor:x,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(_),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],a=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var c=r.call(o,"catchLoc"),l=r.call(o,"finallyLoc");if(c&&l){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,s):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),s},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),_(r),s}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var i=n.arg;_(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:L(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),s}},t}(t.exports);try{regeneratorRuntime=n}catch(t){Function("r","regeneratorRuntime = r")(n)}},b0c0:function(t,e,r){var n=r("83ab"),i=r("9bf2").f,o=Function.prototype,a=o.toString,c=/^\s*function ([^ (]*)/;n&&!("name"in o)&&i(o,"name",{configurable:!0,get:function(){try{return a.call(this).match(c)[1]}catch(t){return""}}})},baa5:function(t,e,r){var n=r("23e7"),i=r("e58c");n({target:"Array",proto:!0,forced:i!==[].lastIndexOf},{lastIndexOf:i})},e58c:function(t,e,r){"use strict";var n=r("fc6a"),i=r("a691"),o=r("50c4"),a=r("a640"),c=r("ae40"),l=Math.min,s=[].lastIndexOf,u=!!s&&1/[1].lastIndexOf(1,-0)<0,f=a("lastIndexOf"),d=c("indexOf",{ACCESSORS:!0,1:0}),h=u||!f||!d;t.exports=h?function(t){if(u)return s.apply(this,arguments)||0;var e=n(this),r=o(e.length),a=r-1;for(arguments.length>1&&(a=l(a,i(arguments[1]))),a<0&&(a=r+a);a>=0;a--)if(a in e&&e[a]===t)return a||0;return-1}:s}}]);