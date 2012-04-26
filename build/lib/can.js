(function(can,window,undefined){$.extend(can,jQuery,{trigger:function(a,b,c){a.trigger?a.trigger(b,c):$.event.trigger(b,c,a,!0)},addEvent:function(a,b){return $([this]).bind(a,b),this},removeEvent:function(a,b){return $([this]).unbind(a,b),this},$:jQuery,prototype:jQuery.fn}),$.each(["bind","unbind","undelegate","delegate"],function(a,b){can[b]=function(){var a=this[b]?this:$([this]);return a[b].apply(a,arguments),this}}),$.each(["append","filter","addClass","remove","data","get"],function(a,b){can[b]=function(a){return a[b].apply(a,can.makeArray(arguments).slice(1))}});var oldClean=$.cleanData;$.cleanData=function(a){$.each(a,function(a,b){can.trigger(b,"destroyed",[],!1)}),oldClean(a)};var undHash=/_|-/,colons=/==/,words=/([A-Z]+)([A-Z][a-z])/g,lowUp=/([a-z\d])([A-Z])/g,dash=/([a-z\d])([A-Z])/g,replacer=/\{([^\}]+)\}/g,quote=/"/g,singleQuote=/'/g,getNext=function(a,b,c){return b in a?a[b]:c&&(a[b]={})},isContainer=function(a){return/^f|^o/.test(typeof a)};can.extend(can,{esc:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(quote,"&#34;").replace(singleQuote,"&#39;")},getObject:function(a,b,c){var d=a?a.split("."):[],e=d.length,f,g=0,h,i;b=can.isArray(b)?b:[b||window];if(!e)return b[0];while(f=b[g++]){for(i=0;i<e-1&&isContainer(f);i++)f=getNext(f,d[i],c);if(isContainer(f)){h=getNext(f,d[i],c);if(h!==undefined)return c===!1&&delete f[d[i]],h}}},capitalize:function(a,b){return a.charAt(0).toUpperCase()+a.slice(1)},underscore:function(a){return a.replace(colons,"/").replace(words,"$1_$2").replace(lowUp,"$1_$2").replace(dash,"_").toLowerCase()},sub:function(a,b,c){var d=[];return d.push(a.replace(replacer,function(a,e){var f=can.getObject(e,b,c);return isContainer(f)?(d.push(f),""):""+f})),d.length<=1?d[0]:d},replacer:replacer,undHash:undHash});var initializing=0;can.Construct=function(){if(arguments.length)return can.Construct.extend.apply(can.Construct,arguments)},can.extend(can.Construct,{newInstance:function(){var a=this.instance(),b=arguments,c;return a.setup&&(c=a.setup.apply(a,arguments)),a.init&&a.init.apply(a,c||arguments),a},_inherit:function(a,b,c){can.extend(c||a,a||{})},setup:function(a,b){this.defaults=can.extend(!0,{},a.defaults,this.defaults)},instance:function(){initializing=1;var a=new this;return initializing=0,a},extend:function(a,b,c){function d(){if(!initializing)return this.constructor!==d&&arguments.length?arguments.callee.extend.apply(arguments.callee,arguments):this.constructor.newInstance.apply(this.constructor,arguments)}typeof a!="string"&&(c=b,b=a,a=null),c||(c=b,b=null),c=c||{};var e=this,f=this.prototype,g,h,i,j;j=this.instance(),e._inherit(c,f,j);for(g in e)e.hasOwnProperty(g)&&(d[g]=e[g]);e._inherit(b,e,d);if(a){var k=a.split("."),h=k.pop(),l=can.getObject(k.join("."),window,!0),i=l,m=can.underscore(a.replace(/\./g,"_")),n=can.underscore(h);!l[h],l[h]=d}can.extend(d,{constructor:d,prototype:j,namespace:i,shortName:h,_shortName:n,fullName:a,_fullName:m}),d.prototype.constructor=d;var o=[e].concat(can.makeArray(arguments)),p=d.setup.apply(d,o);return d.init&&d.init.apply(d,p||o),d}});var canMakeObserve=function(a){return a&&typeof a=="object"&&!(a instanceof Date)},unhookup=function(a,b){return can.each(a,function(a,c){c&&c.unbind&&c.unbind("change"+b)})},hookupBubble=function(a,b,c){return a instanceof Observe?unhookup([a],c._namespace):can.isArray(a)?a=new Observe.List(a):a=new Observe(a),a.bind("change"+c._namespace,function(d,e){var f=can.makeArray(arguments),d=f.shift();f[0]=b==="*"?c.indexOf(a)+"."+f[0]:b+"."+f[0],can.trigger(c,d,f),can.trigger(c,f[0],f)}),a},observeId=0,collecting=undefined,collect=function(){if(!collecting)return collecting=[],!0},batchTrigger=function(a,b,c){if(!a._init){if(!collecting)return can.trigger(a,b,c);collecting.push([a,{type:b,batchNum:batchNum},c])}},batchNum=1,sendCollection=function(){var a=collecting.slice(0);collecting=undefined,batchNum++,can.each(a,function(a,b){can.trigger.apply(can,b)})},serialize=function(a,b,c){return a.each(function(a,d){c[a]=canMakeObserve(d)&&can.isFunction(d[b])?d[b]():d}),c},$method=function(a){return function(){return can[a].apply(this,arguments)}},bind=$method("addEvent"),unbind=$method("removeEvent"),attrParts=function(a){return can.isArray(a)?a:(""+a).split(".")},Observe=can.Construct("can.Observe",{setup:function(){can.Construct.setup.apply(this,arguments)},bind:bind,unbind:unbind,id:"id"},{setup:function(a){this._data={},this._namespace=".observe"+ ++observeId,this._init=1,this.attr(a),delete this._init},attr:function(a,b){return~"ns".indexOf((typeof a).charAt(0))?b===undefined?(Observe.__reading&&Observe.__reading(this,a),this._get(a)):(this._set(a,b),this):this._attrs(a,b)},each:function(){return can.each.apply(undefined,[this.__get()].concat(can.makeArray(arguments)))},removeAttr:function(a){var b=attrParts(a),c=b.shift(),d=this._data[c];return b.length?d.removeAttr(b):(delete this._data[c],c in this.constructor.prototype||delete this[c],batchTrigger(this,"change",[c,"remove",undefined,d]),batchTrigger(this,c,undefined,d),d)},_get:function(a){var b=attrParts(a),c=this.__get(b.shift());return b.length?c?c._get(b):undefined:c},__get:function(a){return a?this._data[a]:this._data},_set:function(a,b){var c=attrParts(a),d=c.shift(),e=this.__get(d);if(canMakeObserve(e)&&c.length)e._set(c,b);else if(!c.length)this.__convert&&(b=this.__convert(d,b)),this.__set(d,b,e);else throw"can.Observe: Object does not exist"},__set:function(a,b,c){if(b!==c){var d=this.__get().hasOwnProperty(a)?"set":"add";this.___set(a,canMakeObserve(b)?hookupBubble(b,a,this):b),batchTrigger(this,"change",[a,d,b,c]),batchTrigger(this,a,b,c),c&&unhookup([c],this._namespace)}},___set:function(a,b){this._data[a]=b,a in this.constructor.prototype||(this[a]=b)},bind:bind,unbind:unbind,serialize:function(){return serialize(this,"serialize",{})},_attrs:function(a,b){if(a===undefined)return serialize(this,"attr",{});a=can.extend(!0,{},a);var c,d=collect(),e=this,f;this.each(function(c,d){f=a[c];if(f===undefined){b&&e.removeAttr(c);return}canMakeObserve(d)&&canMakeObserve(f)?d.attr(f,b):d!=f&&e._set(c,f),delete a[c]});for(var c in a)f=a[c],this._set(c,f);return d&&sendCollection(),this}}),splice=[].splice,list=Observe("can.Observe.List",{setup:function(a,b){this.length=0,this._namespace=".observe"+ ++observeId,this._init=1,this.bind("change",can.proxy(this._changes,this)),this.push.apply(this,can.makeArray(a||[])),can.extend(this,b),delete this._init},_changes:function(a,b,c,d,e){~b.indexOf(".")||(c==="add"?(batchTrigger(this,c,[d,+b]),batchTrigger(this,"length",[this.length])):c==="remove"?(batchTrigger(this,c,[e,+b]),batchTrigger(this,"length",[this.length])):batchTrigger(this,c,[d,+b]))},__get:function(a){return a?this[a]:this},___set:function(a,b){this[a]=b,+a>=this.length&&(this.length=+a+1)},serialize:function(){return serialize(this,"serialize",[])},splice:function(a,b){var c=can.makeArray(arguments),d;for(d=2;d<c.length;d++){var e=c[d];canMakeObserve(e)&&(c[d]=hookupBubble(e,"*",this))}b===undefined&&(b=c[1]=this.length-a);var f=splice.apply(this,c);return b>0&&(batchTrigger(this,"change",[""+a,"remove",undefined,f]),unhookup(f,this._namespace)),c.length>2&&batchTrigger(this,"change",[""+a,"add",c.slice(2),f]),f},_attrs:function(a,b){if(a===undefined)return serialize(this,"attr",[]);a=a.slice(0);var c=Math.min(a.length,this.length),d=collect(),e;for(var e=0;e<c;e++){var f=this[e],g=a[e];canMakeObserve(f)&&canMakeObserve(g)?f.attr(g,b):f!=g&&this._set(e,g)}a.length>this.length?this.push(a.slice(this.length)):a.length<this.length&&b&&this.splice(a.length),d&&sendCollection()}}),getArgs=function(a){return a[0]&&can.isArray(a[0])?a[0]:can.makeArray(a)};can.each({push:"length",unshift:0},function(a,b){list.prototype[a]=function(){var c=getArgs(arguments),d=b?this.length:0;for(var e=0;e<c.length;e++){var f=c[e];canMakeObserve(f)&&(c[e]=hookupBubble(f,"*",this))}var g=[][a].apply(this,c);return(!this.comparator||!c.length)&&batchTrigger(this,"change",[""+d,"add",c,undefined]),g}}),can.each({pop:"length",shift:0},function(a,b){list.prototype[a]=function(){var c=getArgs(arguments),d=b&&this.length?this.length-1:0,e=[][a].apply(this,c);return batchTrigger(this,"change",[""+d,"remove",undefined,[e]]),e&&e.unbind&&e.unbind("change"+this._namespace),e}}),list.prototype.indexOf=[].indexOf||function(a){return can.inArray(a,this)};var pipe=function(a,b,c){var d=new can.Deferred;return a.then(function(){arguments[0]=b[c](arguments[0]),d.resolve.apply(d,arguments)},function(){d.resolveWith.apply(this,arguments)}),d},modelNum=0,ignoreHookup=/change.observe\d+/,getId=function(a){return a[a.constructor.id]},ajax=function(a,b,c,d,e,f){if(typeof a=="string"){var g=a.split(" ");a={url:g.pop()},g.length&&(a.type=g.pop())}return a.data=typeof b=="object"&&!can.isArray(b)?can.extend(a.data||{},b):b,a.url=can.sub(a.url,a.data,!0),can.ajax(can.extend({type:c||"post",dataType:d||"json",success:e,error:f},a))},makeRequest=function(a,b,c,d,e){var f,g=[a.serialize()],h=a.constructor,i;return b=="destroy"&&g.shift(),b!=="create"&&g.unshift(getId(a)),i=h[b].apply(h,g),f=i.pipe(function(c){return a[e||b+"d"](c,i),a}),i.abort&&(f.abort=function(){i.abort()}),f.then(c,d)},ajaxMethods={create:{url:"_shortName",type:"post"},update:{data:function(a,b){b=b||{};var c=this.id;return b[c]&&b[c]!==a&&(b["new"+can.capitalize(a)]=b[c],delete b[c]),b[c]=a,b},type:"put"},destroy:{type:"delete",data:function(a){return{}[this.id]=a}},findAll:{url:"_shortName"},findOne:{}},ajaxMaker=function(a,b){return function(c){return c=a.data?a.data.apply(this,arguments):c,ajax(b||this[a.url||"_url"],c,a.type||"get")}};can.Observe("can.Model",{setup:function(){can.Observe.apply(this,arguments);if(this===can.Model)return;var a=this;can.each(ajaxMethods,function(b,c){can.isFunction(a[b])||(a[b]=ajaxMaker(c,a[b]))});var b=can.proxy(this._clean,a);can.each({findAll:"models",findOne:"model"},function(c,d){var e=a[c];a[c]=function(c,f,g){return a._reqs++,pipe(e.call(a,c),a,d).then(f,g).then(b,b)}});var c;a.fullName=="can.Model"&&(a.fullName="Model"+ ++modelNum),this.store={},this._reqs=0,this._url=this._shortName+"/{"+this.id+"}"},_clean:function(){this._reqs--;if(!this._reqs)for(var a in this.store)this.store[a]._bindings||delete this.store[a]},models:function(a){if(!a)return;var b=this,c=new(b.List||ML),d=can.isArray(a),e=a instanceof ML,f=d?a:e?a.serialize():a.data,g=0;return can.each(f,function(a,d){c.push(b.model(d))}),d||can.each(a,function(a,b){a!=="data"&&(c[a]=b)}),c},model:function(a){if(!a)return;a instanceof this&&(a=a.serialize());var b=this.store[a.id]||new this(a);return this._reqs&&(this.store[a.id]=b),b}},{isNew:function(){var a=getId(this);return!a&&a!==0},save:function(a,b){return makeRequest(this,this.isNew()?"create":"update",a,b)},destroy:function(a,b){return makeRequest(this,"destroy",a,b,"destroyed")},bind:function(a){return ignoreHookup.test(a)||(this._bindings||(this.constructor.store[getId(this)]=this,this._bindings=0),this._bindings++),can.Observe.prototype.bind.apply(this,arguments)},unbind:function(a){return ignoreHookup.test(a)||(this._bindings--,this._bindings||delete this.constructor.store[getId(this)]),can.Observe.prototype.unbind.apply(this,arguments)},___set:function(a,b){can.Observe.prototype.___set.call(this,a,b),a===this.constructor.id&&this._bindings&&(this.constructor.store[getId(this)]=this)}}),can.each(["created","updated","destroyed"],function(a,b){can.Model.prototype[b]=function(a){var c,d=this.constructor;c=a&&typeof a=="object"&&this.attr(a.attr?a.attr():a),can.trigger(this,b),can.trigger(this,"change",b),can.trigger(d,b,this)}});var ML=can.Observe.List("can.Model.List",{setup:function(){can.Observe.List.prototype.setup.apply(this,arguments);var a=this;this.bind("change",function(b,c){/\w+\.destroyed/.test(c)&&a.splice(a.indexOf(b.target),1)})}}),digitTest=/^\d+$/,keyBreaker=/([^\[\]]+)|(\[\])/g,paramTest=/([^?#]*)(#.*)?$/,prep=function(a){return decodeURIComponent(a.replace(/\+/g," "))};can.extend(can,{deparam:function(a){var b={},c;return a&&paramTest.test(a)&&(c=a.split("&"),can.each(c,function(a,c){var d=c.split("="),e=prep(d.shift()),f=prep(d.join("="));current=b,d=e.match(keyBreaker);for(var g=0,h=d.length-1;g<h;g++)current[d[g]]||(current[d[g]]=digitTest.test(d[g+1])||d[g+1]=="[]"?[]:{}),current=current[d[g]];lastPart=d.pop(),lastPart=="[]"?current.push(f):current[lastPart]=f})),b}});var matcher=/\:([\w\.]+)/g,paramsMatcher=/^(?:&[^=]+=[^&]*)+/,makeProps=function(a){return can.map(a,function(a,b){return(b==="className"?"class":b)+'="'+can.esc(a)+'"'}).join(" ")},matchesData=function(a,b){var c=0,d=0;for(;d<a.names.length;d++){if(!b.hasOwnProperty(a.names[d]))return-1;c++}return c},onready=!0,location=window.location,each=can.each,extend=can.extend;can.route=function(a,b){var c=[],d=a.replace(matcher,function(a,b){return c.push(b),"([^\\/\\&]*)"});return can.route.routes[a]={test:new RegExp("^"+d+"($|&)"),route:a,names:c,defaults:b||{},length:a.split("/").length},can.route},extend(can.route,{param:function(a){delete a.route;var b,c=0,d,e=a.route;(!e||!(b=can.route.routes[e]))&&each(can.route.routes,function(e,f){d=matchesData(f,a),d>c&&(b=f,c=d)});if(b){var f=extend({},a),g=b.route.replace(matcher,function(c,d){return delete f[d],a[d]===b.defaults[d]?"":encodeURIComponent(a[d])}),h;return each(b.defaults,function(a,b){f[a]===b&&delete f[a]}),h=can.param(f),g+(h?"&"+h:"")}return can.isEmptyObject(a)?"":"&"+can.param(a)},deparam:function(a){var b={length:-1};each(can.route.routes,function(c,d){d.test.test(a)&&d.length>b.length&&(b=d)});if(b.length>-1){var c=a.match(b.test),d=c.shift(),e=a.substr(d.length-(c[c.length-1]==="&"?1:0)),f=e&&paramsMatcher.test(e)?can.deparam(e.slice(1)):{};return f=extend(!0,{},b.defaults,f),each(c,function(a,c){c&&c!=="&"&&(f[b.names[a]]=decodeURIComponent(c))}),f.route=b.route,f}return a.charAt(0)!=="&"&&(a="&"+a),paramsMatcher.test(a)?can.deparam(a.slice(1)):{}},data:new can.Observe({}),routes:{},ready:function(a){return a===!1&&(onready=a),(a===!0||onready===!0)&&setState(),can.route},url:function(a,b){return b&&(a=extend({},curParams,a)),"#!"+can.route.param(a)},link:function(a,b,c,d){return"<a "+makeProps(extend({href:can.route.url(b,d)},c))+">"+a+"</a>"},current:function(a){return location.hash=="#!"+can.route.param(a)}}),each(["bind","unbind","delegate","undelegate","attr","removeAttr"],function(a,b){can.route[b]=function(){return can.route.data[b].apply(can.route.data,arguments)}});var timer,curParams,setState=function(){curParams=can.route.deparam(location.hash.split(/#!?/).pop()||""),can.route.attr(curParams,!0)};can.bind.call(window,"hashchange",setState),can.route.bind("change",function(){clearTimeout(timer),timer=setTimeout(function(){location.hash="#!"+can.route.param(can.route.data.serialize())},1)}),can.bind.call(document,"ready",can.route.ready);var bind=function(a,b,c){return can.bind.call(a,b,c),function(){can.unbind.call(a,b,c)}},isFunction=can.isFunction,extend=can.extend,each=can.each,slice=[].slice,special=can.getObject("$.event.special")||{},delegate=function(a,b,c,d){return can.delegate.call(a,b,c,d),function(){can.undelegate.call(a,b,c,d)}},binder=function(a,b,c,d){return d?delegate(a,can.trim(d),b,c):bind(a,b,c)},shifter=function(a,b){var c=typeof b=="string"?a[b]:b;return function(){return a.called=b,c.apply(a,[this.nodeName?can.$(this):this].concat(slice.call(arguments,0)))}},basicProcessor;can.Construct("can.Control",{setup:function(){can.Construct.setup.apply(this,arguments);if(this!==can.Control){var a=this,b;a.actions={};for(b in a.prototype){if(b=="constructor"||!isFunction(a.prototype[b]))continue;a._isAction(b)&&(a.actions[b]=a._action(b))}}},_isAction:function(a){return!!(special[a]||processors[a]||/[^\w]/.test(a))},_action:function(a,b){if(b||!/\{([^\}]+)\}/g.test(a)){var c=b?can.sub(a,[b,window]):a,d=can.isArray(c),e=(d?c[1]:c).match(/^(?:(.*?)\s)?([\w\.\:>]+)$/),f=e[2],g=processors[f]||basicProcessor;return{processor:g,parts:e,delegate:d?c[0]:undefined}}},processors:{},defaults:{}},{setup:function(a,b){var c=this.constructor,d=c.pluginName||c._fullName,e;return this.element=can.$(a),d&&d!=="can_control"&&this.element.addClass(d),(e=can.data(this.element,"controls"))||can.data(this.element,"controls",e=[]),e.push(this),this.options=extend({},c.defaults,b),this.on(),[this.element,this.options]},on:function(a,b,c,d){if(!a){this.off();var e=this.constructor,f=this._bindings,g=e.actions,h=this.element,i=shifter(this,"destroy"),j;for(j in g)g.hasOwnProperty(j)&&(ready=g[j]||e._action(j,this.options),f.push(ready.processor(ready.delegate||h,ready.parts[2],ready.parts[1],j,this)));return can.bind.call(h,"destroyed",i),f.push(function(a){can.unbind.call(a,"destroyed",i)}),f.length}return typeof a=="string"&&(d=c,c=b,b=a,a=this.element),typeof d=="string"&&(d=shifter(this,d)),this._bindings.push(binder(a,c,d,b)),this._bindings.length},off:function(){var a=this.element[0];each(this._bindings||[],function(b,c){c(a)}),this._bindings=[]},destroy:function(){var a=this.constructor,b=a.pluginName||a._fullName,c;this.off(),b&&b!=="can_control"&&this.element.removeClass(b),c=can.data(this.element,"controls"),c.splice(can.inArray(this,c),1),can.trigger(this,"destroyed"),this.element=null}});var processors=can.Control.processors,basicProcessor=function(a,b,c,d,e){return binder(a,b,shifter(e,d),c)};each(["change","click","contextmenu","dblclick","keydown","keyup","keypress","mousedown","mousemove","mouseout","mouseover","mouseup","reset","resize","scroll","select","submit","focusin","focusout","mouseenter","mouseleave"],function(a,b){processors[b]=basicProcessor}),can.Control.processors.route=function(a,b,c,d,e){can.route(c||"");var f,g=function(a,b,g){if(can.route.attr("route")===(c||"")&&(a.batchNum===undefined||a.batchNum!==f)){f=a.batchNum;var h=can.route.attr();delete h.route,e[d](h)}};return can.route.bind("change",g),function(){can.route.unbind("change",g)}};var toId=function(a){return a.split(/\/|\./g).join("_")},isFunction=can.isFunction,makeArray=can.makeArray,hookupId=1,$view=can.view=function(a,b,c,d){var e=$view.render(a,b,c,d);return can.isDeferred(e)?e.pipe(function(a){return $view.frag(a)}):$view.frag(e)};can.extend($view,{frag:function(a){var b=can.buildFragment([a],[document.body]).fragment;return b.childNodes.length||b.appendChild(document.createTextNode("")),$view.hookup(b)},hookup:function(a){var b=[],c,d,e,f=0;can.each(a.childNodes?can.makeArray(a.childNodes):a,function(a,c){c.nodeType===1&&(b.push(c),b.push.apply(b,can.makeArray(c.getElementsByTagName("*"))))});for(;e=b[f++];)e.getAttribute&&(c=e.getAttribute("data-view-id"))&&(d=$view.hookups[c])&&(d(e,c),delete $view.hookups[c],e.removeAttribute("data-view-id"));return a},hookups:{},hook:function(a){return $view.hookups[++hookupId]=a," data-view-id='"+hookupId+"'"},cached:{},cache:!0,register:function(a){this.types["."+a.suffix]=a},types:{},ext:".ejs",registerScript:function(){},preload:function(){},render:function(a,b,c,d){isFunction(c)&&(d=c,c=undefined);var e=getDeferreds(b);if(e.length){var f=new can.Deferred;return e.push(get(a,!0)),can.when.apply(can,e).then(function(a){var e=makeArray(arguments),g=e.pop(),h;if(can.isDeferred(b))b=usefulPart(a);else for(var i in b)can.isDeferred(b[i])&&(b[i]=usefulPart(e.shift()));h=g(b,c),f.resolve(h),d&&d(h)}),f}var g,h=isFunction(d),f=get(a,h);return h?(g=f,f.then(function(a){d(a(b,c))})):f.then(function(a){g=a(b,c)}),g}}),can.isDeferred=function(a){return a&&isFunction(a.then)&&isFunction(a.pipe)};var checkText=function(a,b){if(!a.length)throw"can.view: No template or empty template:"+b},get=function(a,b){var c=a.match(/\.[\w\d]+$/),d,e,f,g,h=function(a){var b=d.renderer(f,a),c=new can.Deferred;return c.resolve(b),$view.cache&&($view.cached[f]=c),c};if(e=document.getElementById(a))c="."+e.type.match(/\/(x\-)?(.+)/)[2];c||(a+=c=$view.ext),can.isArray(c)&&(c=c[0]),f=toId(a);if(a.match(/^\/\//)){var i=a.substr(2);a=window.steal?steal.root.mapJoin(i):"/"+i}d=$view.types[c];if($view.cached[f])return $view.cached[f];if(e)return h(e.innerHTML);var j=new can.Deferred;return can.ajax({async:b,url:a,dataType:"text",error:function(b){checkText("",a),j.reject(b)},success:function(b){checkText(b,a),j.resolve(d.renderer(f,b)),$view.cache&&($view.cached[f]=j)}}),j},getDeferreds=function(a){var b=[];if(can.isDeferred(a))return[a];for(var c in a)can.isDeferred(a[c])&&b.push(a[c]);return b},usefulPart=function(a){return can.isArray(a)&&a[1]==="success"?a[0]:a},myEval=function(script){eval(script)},extend=can.extend,quickFunc=/\s*\(([\$\w]+)\)\s*->([^\n]*)/,attrReg=/([^\s]+)=$/,newLine=/(\r|\n)+/g,attributeReplace=/__!!__/g,tagMap={"":"span",table:"tr",tr:"td",ol:"li",ul:"li",tbody:"tr",thead:"tr",tfoot:"tr"},clean=function(a){return a.split("\\").join("\\\\").split("\n").join("\\n").split('"').join('\\"').split("\t").join("\\t")},bracketNum=function(a){return--a.split("{").length- --a.split("}").length},attrMap={"class":"className"},bool=can.each(["checked","disabled","readonly","required"],function(a,b){attrMap[b]=b}),setAttr=function(a,b,c){attrMap[b]?a[attrMap[b]]=can.inArray(b,bool)>-1?!0:c:a.setAttribute(b,c)},getAttr=function(a,b){return attrMap[b]?a[attrMap[b]]:a.getAttribute(b)},removeAttr=function(a,b){can.inArray(b,bool)>-1?a[b]=!1:a.removeAttribute(b)},liveBind=function(a,b,c,d){var e=d.matched===undefined;d.matched=!d.matched,can.each(a,function(a,b){d[b.obj._namespace+"|"+b.attr]?d[b.obj._namespace+"|"+b.attr].matched=d.matched:(b.matched=d.matched,d[b.obj._namespace+"|"+b.attr]=b,b.obj.bind(b.attr,c))});for(var f in d){var g=d[f];f!=="matched"&&g.matched!==d.matched&&(g.obj.unbind(g.attr),delete d[f])}e&&can.bind.call(b,"destroyed",function(){can.each(d,function(a,b){typeof b!="boolean"&&b.obj.unbind(b.attr,c)})})},contentEscape=function(a){return typeof a=="string"||typeof a=="number"?can.esc(a):contentText(a)},contentText=function(a){if(typeof a=="string")return a;if(!a&&a!=0)return"";var b=a.hookup&&function(b,c){a.hookup.call(a,b,c)}||typeof a=="function"&&a;return b?(pendingHookups.push(b),""):""+a},getValueAndObserved=function(a,b){can.Observe&&(can.Observe.__reading=function(a,b){c.push({obj:a,attr:b})});var c=[],d=a.call(b);return can.Observe&&delete can.Observe.__reading,{value:d,observed:c}},EJS=function(a){if(this.constructor!=EJS){var b=new EJS(a);return function(a,c){return b.render(a,c)}}if(typeof a=="function"){this.template={fn:a};return}extend(this,a),this.template=scan(this.text,this.name)};can.EJS=EJS,EJS.prototype.render=function(a,b){return a=a||{},this.template.fn.call(a,a,new EJS.Helpers(a,b||{}))},extend(EJS,{txt:function(a,b,c,d,e){var f=getValueAndObserved(e,d),g=f.observed,h=f.value,i={},j=tagMap[b]||"span";if(!g.length)return(a||c!==0?contentEscape:contentText)(h);if(c==0)return"<"+j+can.view.hook(a?function(a){var b=a.parentNode,c=document.createTextNode(h),f=function(){var a=getValueAndObserved(e,d);c.nodeValue=""+a.value,liveBind(a.observed,b,f,i)};b.insertBefore(c,a),b.removeChild(a),liveBind(g,b,f,i)}:function(a){var b=function(a,b){var c=can.view.frag(a),d=can.map(c.childNodes,function(a){return a}),e=b[b.length-1];return e.nextSibling?e.parentNode.insertBefore(c,e.nextSibling):e.parentNode.appendChild(c),can.remove(can.$(b)),d},c=b(h,[a]),f=function(){var g=getValueAndObserved(e,d);c=b(g.value,c),liveBind(g.observed,a.parentNode,f,i)};liveBind(g,a.parentNode,f,i)})+"></"+j+">";if(c===1){var k=h.replace(/['"]/g,"").split("=")[0];return pendingHookups.push(function(a){var b=function(){var c=getValueAndObserved(e,d),f=(c.value||"").replace(/['"]/g,"").split("="),g=f[0];g!=k&&k&&removeAttr(a,k),g&&(setAttr(a,g,f[1]),k=g),liveBind(c.observed,a,b,i)};liveBind(g,a,b,i)}),h}return pendingHookups.push(function(a){var b=can.$(a),f;(f=can.data(b,"hooks"))||can.data(b,"hooks",f={});var j=getAttr(a,c),k=j.split("__!!__"),l,m=function(b){if(b.batchNum===undefined||b.batchNum!==l.batchNum)l.batchNum=b.batchNum,setAttr(a,c,l.render())};f[c]?f[c].funcs.push({func:e,old:i}):f[c]={render:function(){var b=0,c=j.replace(attributeReplace,function(){var c=getValueAndObserved(l.funcs[b].func,d);return liveBind(c.observed,a,m,l.funcs[b++].old),contentText(c.value)});return c},funcs:[{func:e,old:i}],batchNum:undefined},l=f[c],k.splice(1,0,h),setAttr(a,c,k.join("")),liveBind(g,a,m,i)}),"__!!__"},pending:function(){if(pendingHookups.length){var a=pendingHookups.slice(0);return pendingHookups=[],can.view.hook(function(b){can.each(a,function(a,c){c(b)})})}return""}});var tokenReg=new RegExp("("+["<%%","%%>","<%==","<%=","<%#","<%","%>","<",">",'"',"'"].join("|")+")","g"),startTxt="var ___v1ew = [];",finishTxt="return ___v1ew.join('')",put_cmd="___v1ew.push(",insert_cmd=put_cmd,htmlTag=null,quote=null,beforeQuote=null,status=function(){return quote?"'"+beforeQuote.match(attrReg)[1]+"'":htmlTag?1:0},pendingHookups=[],scan=function(a,b){var c=[],d=0;a=a.replace(newLine,"\n"),a.replace(tokenReg,function(b,e,f){f>d&&c.push(a.substring(d,f)),c.push(e),d=f+e.length}),d===0&&c.push(a);var e="",f=[startTxt],g=function(a,b){f.push(put_cmd,'"',clean(a),'"'+(b||"")+");")},h=[],i,j=null,k=!1,l="",m=[],n,o=0,p;htmlTag=quote=beforeQuote=null;for(;(p=c[o++])!==undefined;){if(j===null)switch(p){case"<%":case"<%=":case"<%==":k=1;case"<%#":j=p,e.length&&g(e),e="";break;case"<%%":e+="<%";break;case"<":c[o].indexOf("!--")!==0&&(htmlTag=1,k=0),e+=p;break;case">":htmlTag=0,k?(g(e,',can.EJS.pending(),">"'),e=""):e+=p;break;case"'":case'"':htmlTag&&(quote&&quote===p?quote=null:quote===null&&(quote=p,beforeQuote=i));default:i==="<"&&(l=p.split(" ")[0],l.indexOf("/")===0&&m.pop()===l.substr(1)?l=m[m.length-1]||l.substr(1):m.push(l)),e+=p}else switch(p){case"%>":switch(j){case"<%":n=bracketNum(e);if(n==1)f.push(insert_cmd,"can.EJS.txt(0,'"+l+"',"+status()+",this,function(){",startTxt,e),h.push({before:"",after:finishTxt+"}));"});else{var d=h.length&&n==-1?h.pop():{after:";"};d.before&&f.push(d.before),f.push(e,";",d.after)}break;case"<%=":case"<%==":n=bracketNum(e),n&&h.push({before:finishTxt,after:"}));"});if(quickFunc.test(e)){var q=e.match(quickFunc);e="function(__){var "+q[1]+"=can.$(__);"+q[2]+"}"}f.push(insert_cmd,"can.EJS.txt("+(j==="<%="?1:0)+",'"+l+"',"+status()+",this,function(){ return ",e,n?startTxt:"}));")}j=null,e="";break;case"<%%":e+="<%";break;default:e+=p}i=p}e.length&&g(e),f.push(";");var r=f.join(""),s={out:"with(_VIEW) { with (_CONTEXT) {"+r+" "+finishTxt+"}}"};return myEval.call(s,"this.fn = (function(_CONTEXT,_VIEW){"+s.out+"});\r\n//@ sourceURL="+b+".js"),s};EJS.Helpers=function(a,b){this._data=a,this._extras=b,extend(this,b)},EJS.Helpers.prototype={view:function(a,b,c){return $View(a,b||this._data,c||this._extras)},list:function(a,b){a.attr("length");for(var c=0,d=a.length;c<d;c++)b(a[c],c,a)}},can.view.register({suffix:"ejs",script:function(a,b){return"can.EJS(function(_CONTEXT,_VIEW) { "+(new EJS({text:b,name:a})).template.out+" })"},renderer:function(a,b){return EJS({text:b,name:a})}})})(can={},this)