(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-036afbda"],{"0418":function(t,e,i){},4327:function(t,e,i){"use strict";var a=i("0418");i.n(a).a},b0c0:function(t,e,i){var a=i("83ab"),o=i("9bf2").f,r=Function.prototype,l=r.toString,s=/^\s*function ([^ (]*)/;a&&!("name"in r)&&o(r,"name",{configurable:!0,get:function(){try{return l.call(this).match(s)[1]}catch(t){return""}}})},baa5:function(t,e,i){var a=i("23e7"),o=i("e58c");a({target:"Array",proto:!0,forced:o!==[].lastIndexOf},{lastIndexOf:o})},e213:function(t,e,i){"use strict";i.r(e),i("4de4"),i("4160"),i("caad"),i("baa5"),i("d81d"),i("b0c0"),i("d3b7"),i("2532"),i("3ca3"),i("159b"),i("ddb0");var a=i("5530"),o=i("f332"),r=i("7cd0"),l=i("8e4b"),s=i("2277"),n={name:"",components:{},filters:{},mixins:[],props:[],data:function(){return{isArticleDialogVisible:!1,isDialogVisible:!1,dialogType:"add",bookId:"",file:null,uploadFilename:"",uploadFileExt:"",uploaded:!1,formData:{title:"",author:"",intro:"",cover:""},formRules:{title:[{required:!0,message:"缺少标题",trigger:"blur"}],author:[{required:!0,message:"缺少作者",trigger:"blur"}],intro:[{required:!0,message:"缺少简介",trigger:"blur"}]},bookListRaw:[],selectedBookId:"",selectedBookTitle:"",leftList:[],rightList:[]}},computed:{bookList:function(){return this.bookListRaw.map((function(t){return Object(a.a)({},t,{url:Object(s.d)(t.cover_id)})}))}},watch:{},beforeCreate:function(){},created:function(){this.getBooks()},mounted:function(){},beforeUpdate:function(){},methods:{getBooks:function(){var t=this;Object(r.d)().then((function(e){var i=e.data;return t.bookListRaw=i})).catch(this.$message.error)},handleShowDialog:function(t,e){if(this.dialogType=t,this.file=null,this.uploadFilename="",this.uploadFileExt="",this.uploaded=!1,this.formData.title="",this.formData.author="",this.formData.intro="",this.formData.cover="","edit"===t){var i=e._id,a=e.author,o=e.title,r=e.intro;this.bookId=i,this.formData.title=o,this.formData.author=a,this.formData.intro=r,this.uploadFilename="留空时不修改图片"}this.isDialogVisible=!0},beforeSubmitBook:function(){"add"===this.dialogType?this.submitAddBook():this.submitEditBook()},submitAddBook:function(){var t=this;if(!this.uploaded)return this.$message.error("没选封面图");this.$confirm("确定？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then((function(){t.$refs.form.validate((function(e){if(!e)return!1;var i={author:t.formData.author,article_id:[],cover_id:t.formData.cover,intro:t.formData.intro,status:"",title:t.formData.title,type:"book"};Object(r.a)(i).then((function(){t.$success("添加成功"),t.isDialogVisible=!1,t.getBooks(),Object(l.d)([t.formData.cover]).then((function(){t.$message("file 表更新成功")})).catch((function(e){t.$message.error("更新 file 表失败: "+e)}))})).catch((function(e){t.$message.error("添加失败: "+e)}))}))}))},submitEditBook:function(){var t=this;this.$confirm("确定？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then((function(){t.$refs.form.validate((function(e){if(!e)return!1;var i={author:t.formData.author,intro:t.formData.intro,title:t.formData.title};t.uploaded&&(i.cover_id=t.formData.cover),Object(r.c)(t.bookId,i).then((function(){t.$success("修改成功"),t.isDialogVisible=!1,t.getBooks(),t.uploaded&&Object(l.d)([t.formData.cover]).then((function(){t.$message("file 表更新成功")})).catch((function(e){t.$message.error("更新 file 表失败: "+e)}))})).catch((function(e){t.$message.error("添加失败: "+e)}))}))}))},handleEditArticle:function(t){this.isArticleDialogVisible=!0,this.selectedBookId=t._id,this.selectedBookTitle=t.title,this.leftList=[],this.rightList=[],this.getArticles()},getArticles:function(){var t=this;Object(o.a)().then((function(e){e.forEach((function(e){var i=e.bookId,a=e.realId,o=e.title;""!==i&&i!==t.selectedBookId||(t.leftList.push({key:a,label:o}),i===t.selectedBookId&&t.rightList.push(a))}))})).catch(this.$error)},beforeSubmitArticle:function(){var t=this,e=this.rightList,i=this.leftList.filter((function(t){return!e.includes(t.key)})).map((function(t){return t.key})),a=[];e.length&&a.push(Object(o.c)(e,this.selectedBookId,this.selectedBookTitle)),i.length&&a.push(Object(o.c)(i,"","")),Promise.all(a).then((function(){t.$success("修改成功"),t.isArticleDialogVisible=!1})).catch(this.$message.error)},handleSelectFile:function(){this.$refs.file.value="",this.$refs.file.click()},handleUploadFile:function(){var t=this;if(!this.file)return this.$message.error("请选择文件");if(!this.uploadFilename)return this.$message.error("输入文件名");var e="";e=this.uploadFilename.substring(this.uploadFilename.lastIndexOf("."))===this.uploadFileExt?this.uploadFilename:this.uploadFilename+this.uploadFileExt,Object(r.f)(this.file,e).then((function(e){var i=e.fileId,a=e.filename;e.filePath,t.formData.cover=i,t.$success("上传成功"),t.uploadFilename=a,t.uploaded=!0})).catch((function(e){t.$message.error("图片上传失败: "+e)}))},handleFileChange:function(t){var e=t.target.files[0];if(!e)return this.uploadFilename="",void(this.file=null);this.uploadFilename=e.name,this.uploadFileExt=e.name.substring(e.name.lastIndexOf(".")),this.file=e}}},c=(i("4327"),i("2877")),u=Object(c.a)(n,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"view-articles-book"},[i("div",{staticClass:"tool-bar"},[i("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.handleShowDialog("add")}}},[t._v("新增")])],1),i("div",{staticClass:"books-wrapper"},t._l(t.bookList,(function(e,a){return i("div",{key:a,staticClass:"book",attrs:{"data-id":e._id}},[i("img",{staticClass:"book__cover",attrs:{src:e.url}}),i("p",{staticClass:"book__title"},[t._v(t._s(e.title))]),i("p",{staticClass:"book__author"},[t._v(t._s(e.author))]),i("p",{staticClass:"book__intro"},[t._v(t._s(e.intro))]),i("p",{staticClass:"book__editor"},[i("el-link",{attrs:{underline:!1},on:{click:function(i){return t.handleShowDialog("edit",e)}}},[t._v("编辑信息")]),i("el-link",{attrs:{underline:!1},on:{click:function(i){return t.handleEditArticle(e)}}},[t._v("编辑文章")])],1)])})),0),i("el-dialog",{attrs:{title:"add"===t.dialogType?"新增":"修改",visible:t.isDialogVisible,"before-close":function(){return t.isDialogVisible=!1}}},[i("el-form",{ref:"form",attrs:{model:t.formData,rules:t.formRules,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"标题",prop:"title"}},[i("el-input",{model:{value:t.formData.title,callback:function(e){t.$set(t.formData,"title",e)},expression:"formData.title"}})],1),i("el-form-item",{attrs:{label:"作者",prop:"author"}},[i("el-input",{model:{value:t.formData.author,callback:function(e){t.$set(t.formData,"author",e)},expression:"formData.author"}})],1),i("el-form-item",{attrs:{label:"简介",prop:"intro"}},[i("el-input",{model:{value:t.formData.intro,callback:function(e){t.$set(t.formData,"intro",e)},expression:"formData.intro"}})],1),i("el-form-item",{attrs:{label:"封面图"}},[i("el-button",{attrs:{disabled:t.uploaded},on:{click:t.handleSelectFile}},[t._v("选择图片")]),i("el-button",{attrs:{disabled:t.uploaded,type:"primary"},on:{click:t.handleUploadFile}},[t._v("上传")]),i("br"),i("el-input",{attrs:{disabled:t.uploaded,placeholder:"文件名"},model:{value:t.uploadFilename,callback:function(e){t.uploadFilename=e},expression:"uploadFilename"}})],1),i("el-form-item",{staticStyle:{"text-align":"right"}},[i("el-button",{on:{click:function(e){t.isDialogVisible=!1}}},[t._v("取消")]),i("el-button",{attrs:{type:"primary"},on:{click:t.beforeSubmitBook}},[t._v("提交")])],1)],1),i("input",{ref:"file",staticStyle:{display:"none"},attrs:{type:"file"},on:{change:t.handleFileChange}})],1),i("el-dialog",{staticClass:"add-article",attrs:{title:"添加文章",visible:t.isArticleDialogVisible,"before-close":function(){return t.isArticleDialogVisible=!1}}},[i("el-transfer",{attrs:{data:t.leftList},model:{value:t.rightList,callback:function(e){t.rightList=e},expression:"rightList"}}),i("div",{staticStyle:{"text-align":"right","margin-top":"20px"}},[i("el-button",{attrs:{type:"primary"},on:{click:t.beforeSubmitArticle}},[t._v("提交")])],1)],1)],1)}),[],!1,null,null,null);e.default=u.exports},e58c:function(t,e,i){"use strict";var a=i("fc6a"),o=i("a691"),r=i("50c4"),l=i("a640"),s=i("ae40"),n=Math.min,c=[].lastIndexOf,u=!!c&&1/[1].lastIndexOf(1,-0)<0,f=l("lastIndexOf"),d=s("indexOf",{ACCESSORS:!0,1:0}),h=u||!f||!d;t.exports=h?function(t){if(u)return c.apply(this,arguments)||0;var e=a(this),i=r(e.length),l=i-1;for(arguments.length>1&&(l=n(l,o(arguments[1]))),l<0&&(l=i+l);l>=0;l--)if(l in e&&e[l]===t)return l||0;return-1}:c}}]);