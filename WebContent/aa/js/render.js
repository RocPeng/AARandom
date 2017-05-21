/**
 * page render js
 * @param {Object} $ zepto or jQuery
 * @param {Object} factory
 */
(function (App,$, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (App.Render = factory());
}(App,$, function() { 'use strict';
	var UA = window.navigator.userAgent.toLowerCase();
  	var isAndroid = UA && UA.indexOf('android') > 0;
  	var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
 	var isWechat = UA && UA.indexOf('micromessenger') > 0;
 	var noop = function(){return true},
 	isArray = Array.isArray ||
      function(object){ return object instanceof Array }
 	
 	function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	}
 	
 	function extend(target, source, deep) {
	    for (var key in source)
	      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	          target[key] = {}
	        if (isArray(source[key]) && !isArray(target[key]))
	          target[key] = []
	        extend(target[key], source[key], deep)
	      }
	      else if (source[key] !== undefined) target[key] = source[key]
	}
 	
 	function extendAll(target){
	    var deep, args = [].slice.call(arguments, 1)
	    if (typeof target == 'boolean') {
	      deep = target
	      target = args.shift()
	    }
	    args.forEach(function(arg){ extend(target, arg, deep) })
	    return target
	}
    
	var render = function(name,vm,options){
		this.options = {
			el:$('body'),
			onBeforeRender:noop,
			onRender:noop,
			onAfterRender:noop
		};
		this.name  = name;
		this.vm = vm;
		extendAll(this.options, options);
	};
	
	
	var _appendDefaultEvt = function(evts){
		var curPage  = UmsApp.UMSAPP_DATA_PREFIX+ App.getHtmlName(),
		    loadPage = UmsApp.DEFAULT_LOAD_EVENT;
		if(evts.indexOf(curPage) == -1)
			evts.push(curPage);
		if(evts.indexOf(loadPage) == -1)
			evts.push(loadPage);

	};
	
	var _filterEvent   = function(evts){
		var newEvts = [];
		evts.forEach(function(n){
			var evtName = n.substring(n.lastIndexOf('/')+1);
			if(UmsApp.UMSAPP_DATA.indexOf(evtName) != -1){
				newEvts.push(evtName);
			}else{
				if(UmsApp.debug)console.error('==client== find:'+n+' invalid.');
			}
		});
		return newEvts;
	};
	/**
	 * refresh view
	 * @param {Object} rs
	 */
	render.prototype.refreshData = function(rs){
		if(UmsApp.debug)console.log('==client== refresh view,rs:'+JSON.stringify(rs));
		var self = this;
		var renderQueue = [this.options.onBeforeRender,
						   this.options.onRender,
						   this.options.onAfterRender];
						   
		renderQueue.forEach(function(n){
			return n(self.vm,rs);
		});
	};
	
	
	/**
	 * evt can Array;for example render.bind('xx','Yy'),or render.bind(['xx','Yy']);
	 * note:will append default currentPage according of current HTML name,
	 *  and "load" event.
	 * @param {Object} evts
	 */
	render.prototype.bind  = function(evts){
		var self = this,evtArr=[],len = arguments.length;
		if(len == 1){
			evtArr = UmsApp.isArray(evts)?evts:[evts];
		}else if(len >1){
			evtArr = [].slice.call(arguments,0,len);
		}
		evtArr = _filterEvent(evtArr);   //filter invalid data
		_appendDefaultEvt(evtArr);       //append default events;
		evtArr.forEach(function(n){      //listen events;
			if(UmsApp.debug) console.log('==client== bind listener event:'+n);
	   		self.options.el.on(n,function(evt,rs){
	   			if(UmsApp.debug)console.log('==client== callback listener event:['+n+'],rs:'+JSON.stringify(rs));
	   			self.refreshData(rs);
	   		});
		});
		
		//模拟环境
		window.addEventListener("message", function(evt) { 
			console.log('pc push message:[%s]',evt.data);
			self.refreshData(evt.data);
		 }, false);
		
	};
	
	
	//load script and init mock data;
//	if(!UmsApp.isUmsapp() &&　UmsApp.debug){
		$(function(){
			var mockjs = $('<script>').attr('src','../js/mockData.js');
			$('script').last().after(mockjs);
		});
//	}
	return render;
}));
