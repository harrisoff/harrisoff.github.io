(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2eae88e8"],{"0bef":function(t,n,e){"use strict";e.r(n),e("99af"),e("d81d"),e("d3b7");var i=e("054a"),r=e("9d15"),s=e("ed08"),a=e("2277"),o=e("a1bc"),u={name:"",components:{},filters:{},mixins:[],props:[],data:function(){return{commentList:[],isLoading:!1}},computed:{},watch:{},beforeCreate:function(){},created:function(){this.getCommentList()},mounted:function(){},beforeUpdate:function(){},methods:{handleSetVisibility:function(t,n){(function(t,n){var e="\n  db.collection('".concat(o.COLLECTIONS.COMMENT,"')\n  .where({\n    _id: '").concat(t,"'\n  })\n  .update({\n    data: {\n      show: ").concat(n,"\n    }\n  })\n  ");return Object(r.b)(e)})(t,n).then(this.getCommentList).catch(this.$error)},getCommentList:function(){var t,n=this;this.isLoading=!0,(t="\n  db.collection('".concat(o.COLLECTIONS.COMMENT,"').aggregate()\n      .lookup({\n        from: '").concat(o.COLLECTIONS.USER,"',\n        localField: 'open_id',\n        foreignField: 'open_id',\n        as: 'user',\n      })\n      .lookup({\n        from: '").concat(o.COLLECTIONS.ARTICLE,"',\n        localField: 'article_id',\n        foreignField: 'real_id',\n        as: 'article',\n      })\n      .sort({\n        timestamp: -1\n      })\n      .end()\n  "),new Promise((function(n,e){Object(i.b)(t).then((function(t){var e=t.data,i=Object(a.e)(e).map((function(t){var n=t.open_id,e=t._id,i=t.content,r=t.reply_id,o=t.show,u=t.article_id,c=t.is_legal,l=Object(a.a)(t.timestamp),f=t.user[0],d=t.article[0];return{id:e,show:o,illegal:!c,content:i,replyId:r,timestamp:l,time:Object(s.a)(l),openId:n,nickName:f.nickName,avatarUrl:f.avatarUrl,articleId:u,title:d.title}}));n(i)})).catch(e)}))).then((function(t){n.commentList=t})).catch(this.$error).then((function(t){n.isLoading=!1}))}}},c=(e("2a83"),e("2877")),l=Object(c.a)(u,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"view-comment"},[e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoading,expression:"isLoading"}],attrs:{data:t.commentList,"row-key":"id"}},[e("el-table-column",{attrs:{prop:"nickName",label:"昵称"}}),e("el-table-column",{attrs:{prop:"avatarUrl",label:"头像"},scopedSlots:t._u([{key:"default",fn:function(t){return[e("img",{staticClass:"avatar",attrs:{src:t.row.avatarUrl}})]}}])}),e("el-table-column",{attrs:{prop:"time",label:"时间"}}),e("el-table-column",{attrs:{prop:"content",label:"内容"}}),e("el-table-column",{attrs:{prop:"title",label:"文章标题"}}),e("el-table-column",{attrs:{prop:"replyId",label:"回复 ID"}}),e("el-table-column",{attrs:{prop:"illegal",label:"内容检测"},scopedSlots:t._u([{key:"default",fn:function(n){return[n.row.illegal?e("span",{staticStyle:{color:"red"}},[t._v(" 非法内容 ")]):t._e()]}}])}),e("el-table-column",{attrs:{prop:"show",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(n){return[n.row.show?e("el-button",{attrs:{size:"small",type:"default"},on:{click:function(e){return t.handleSetVisibility(n.row.id,!1)}}},[t._v("隐藏")]):e("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(e){return t.handleSetVisibility(n.row.id,!0)}}},[t._v("显示")])]}}])})],1)],1)}),[],!1,null,null,null);n.default=l.exports},"2a83":function(t,n,e){"use strict";var i=e("fb91");e.n(i).a},"5a0c":function(t,n,e){t.exports=function(){"use strict";var t="millisecond",n="second",e="minute",i="hour",r="day",s="week",a="month",o="quarter",u="year",c=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,l=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,f=function(t,n,e){var i=String(t);return!i||i.length>=n?t:""+Array(n+1-i.length).join(e)+t},d={s:f,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),i=Math.floor(e/60),r=e%60;return(n<=0?"+":"-")+f(i,2,"0")+":"+f(r,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),i=t.clone().add(e,a),r=n-i<0,s=t.clone().add(e+(r?-1:1),a);return Number(-(e+(n-i)/(r?i-s:s-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(c){return{M:a,y:u,w:s,d:r,D:"date",h:i,m:e,s:n,ms:t,Q:o}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},h={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m="en",$={};$[m]=h;var p=function(t){return t instanceof b},g=function(t,n,e){var i;if(!t)return m;if("string"==typeof t)$[t]&&(i=t),n&&($[t]=n,i=t);else{var r=t.name;$[r]=t,i=r}return!e&&i&&(m=i),i||!e&&m},v=function(t,n,e){if(p(t))return t.clone();var i=n?"string"==typeof n?{format:n,pl:e}:n:{};return i.date=t,new b(i)},y=d;y.l=g,y.i=p,y.w=function(t,n){return v(t,{locale:n.$L,utc:n.$u,$offset:n.$offset})};var b=function(){function f(t){this.$L=this.$L||g(t.locale,null,!0),this.parse(t)}var d=f.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(y.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var i=n.match(c);if(i)return e?new Date(Date.UTC(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)):new Date(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)}return new Date(n)}(t),this.init()},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},d.$utils=function(){return y},d.isValid=function(){return!("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=v(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return v(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<v(t)},d.$g=function(t,n,e){return y.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",u)},d.month=function(t){return this.$g(t,"$M",a)},d.day=function(t){return this.$g(t,"$W",r)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",i)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var c=this,l=!!y.u(o)||o,f=y.p(t),d=function(t,n){var e=y.w(c.$u?Date.UTC(c.$y,n,t):new Date(c.$y,n,t),c);return l?e:e.endOf(r)},h=function(t,n){return y.w(c.toDate()[t].apply(c.toDate("s"),(l?[0,0,0,0]:[23,59,59,999]).slice(n)),c)},m=this.$W,$=this.$M,p=this.$D,g="set"+(this.$u?"UTC":"");switch(f){case u:return l?d(1,0):d(31,11);case a:return l?d(1,$):d(0,$+1);case s:var v=this.$locale().weekStart||0,b=(m<v?m+7:m)-v;return d(l?p-b:p+(6-b),$);case r:case"date":return h(g+"Hours",0);case i:return h(g+"Minutes",1);case e:return h(g+"Seconds",2);case n:return h(g+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var c,l=y.p(s),f="set"+(this.$u?"UTC":""),d=(c={},c.day=f+"Date",c.date=f+"Date",c[a]=f+"Month",c[u]=f+"FullYear",c[i]=f+"Hours",c[e]=f+"Minutes",c[n]=f+"Seconds",c[t]=f+"Milliseconds",c)[l],h=l===r?this.$D+(o-this.$W):o;if(l===a||l===u){var m=this.clone().set("date",1);m.$d[d](h),m.init(),this.$d=m.set("date",Math.min(this.$D,m.daysInMonth())).toDate()}else d&&this.$d[d](h);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[y.p(t)]()},d.add=function(t,o){var c,l=this;t=Number(t);var f=y.p(o),d=function(n){var e=v(l);return y.w(e.date(e.date()+Math.round(n*t)),l)};if(f===a)return this.set(a,this.$M+t);if(f===u)return this.set(u,this.$y+t);if(f===r)return d(1);if(f===s)return d(7);var h=(c={},c[e]=6e4,c[i]=36e5,c[n]=1e3,c)[f]||1,m=this.$d.getTime()+t*h;return y.w(m,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return"Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",i=y.z(this),r=this.$locale(),s=this.$H,a=this.$m,o=this.$M,u=r.weekdays,c=r.months,f=function(t,i,r,s){return t&&(t[i]||t(n,e))||r[i].substr(0,s)},d=function(t){return y.s(s%12||12,t,"0")},h=r.meridiem||function(t,n,e){var i=t<12?"AM":"PM";return e?i.toLowerCase():i},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:y.s(o+1,2,"0"),MMM:f(r.monthsShort,o,c,3),MMMM:c[o]||c(this,e),D:this.$D,DD:y.s(this.$D,2,"0"),d:String(this.$W),dd:f(r.weekdaysMin,this.$W,u,2),ddd:f(r.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(s),HH:y.s(s,2,"0"),h:d(1),hh:d(2),a:h(s,a,!0),A:h(s,a,!1),m:String(a),mm:y.s(a,2,"0"),s:String(this.$s),ss:y.s(this.$s,2,"0"),SSS:y.s(this.$ms,3,"0"),Z:i};return e.replace(l,(function(t,n){return n||m[t]||i.replace(":","")}))},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,r,c){var l,f=y.p(r),d=v(t),h=6e4*(d.utcOffset()-this.utcOffset()),m=this-d,$=y.m(this,d);return $=(l={},l[u]=$/12,l[a]=$,l[o]=$/3,l[s]=(m-h)/6048e5,l.day=(m-h)/864e5,l[i]=m/36e5,l[e]=m/6e4,l[n]=m/1e3,l)[f]||m,c?$:y.a($)},d.daysInMonth=function(){return this.endOf(a).$D},d.$locale=function(){return $[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone(),i=g(t,n,!0);return i&&(e.$L=i),e},d.clone=function(){return y.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},f}();return v.prototype=b.prototype,v.extend=function(t,n){return t(n,b,v),v},v.locale=g,v.isDayjs=p,v.unix=function(t){return v(1e3*t)},v.en=$[m],v.Ls=$,v}()},ed08:function(t,n,e){"use strict";e.d(n,"a",(function(){return s}));var i=e("5a0c"),r=e.n(i);function s(t){return r()(t).format("YYYY-MM-DD HH:mm:ss")}},fb91:function(t,n,e){}}]);