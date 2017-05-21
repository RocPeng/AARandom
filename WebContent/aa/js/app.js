/**
 * app base js provide many  utilities
 * @param {Object} global
 * @param {Object} $
 * @param {Object} factory
 */
(function (global,$,UmsApp,factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.App = factory());
}(window,Zepto,UmsApp, function() { 'use strict';
	
	//version
	var VERSION = '0.0.1';
	UmsApp.debug = false;
	if(UmsApp.debug){
		var debugJs = $('<script>').attr('src','../js/vconsole.min.js');
		$('script').first().before(debugJs);
	}
    
	/**
	 * @param {String} str
	 */
	var dasherize = function(str) {
		return str.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase()
	};
	/**
	 * @param {String} str
	 */
	var camelize = function(str) {
		return str.replace(/-+(.)?/g, function(match, chr) {
			return chr ? chr.toUpperCase() : ''
		});
	}
	
	/**
	 * get current  Html name,for example.
	 * "../html/workbench.html" will be extracted "workbench".
	 */
	var getHtmlName = function(){
		var href = window.location.href,
		urlArr = href.split('/'),
		name   = [].pop.call(urlArr,urlArr.length-1);
		name = name.substring(0,name.lastIndexOf('.'));
		return name;
	};
	
	/**
	 * @param {Object} container
	 * @param {Object} progress
	 */
	function initLoading(container,progress){
		if (typeof container === 'number') {
			progress = container;
			container = 'body';
		}else if(typeof container ==='undefined'){
			container = 'body';
			progress  = 0;
		}
		progress = progress||0;
		mui(container).progressbar({progress:progress}).show();
	};
	
	/**
	 * 
	 * @param container
	 * @param progress
	 */
	function postLoading(container, progress) {
		if (typeof container === 'number') {
			progress = container;
			container = 'body';  
		}
		setTimeout(function() {
			progress += Math.random() * 20;
			mui(container).progressbar().setProgress(progress);
			if (progress < 100) {
				postLoading(container, progress);
			} else {
				mui(container).progressbar().hide();
			}
		}, Math.random() * 200 + 200);
	};
	
	/**
	 * open webview
	 * @param {string} url  support url startWith http or https
	 */
	var openWebView = function(url,cb){
		if(/^(http|https):\/\/.+/.test(url)){
			if(UmsApp.isUmsapp() ){
				UmsApp.view.webview({url:url},cb);
			}else{
				window.open(url,'_blank');
			}
		}else{
			if(UmsApp.debug)console.error('==client== openWebView current url:'+url+' is invalid.');
		}
	};
	
	/**
	 * post umsappView
	 * @param {String} viewUrl start with umsapp://view/xxx or xxx 
	 */
	var postUmsView = function(viewName,data,cb){
		if(UmsApp.isUmsapp()) {
			UmsApp.send(UmsApp.joinView(viewName), data, cb);
		} else {
			window.open(viewName + '.html', '_blank');
		}
	};
	
	
	/**
	 * post umsappAction
	 * @param {String} actName actioin name 
	 * @param {Object} args    arguments  [Object]
	 */
	var postUmsAction = function(actName,data,cb,viewName){
		UmsApp.send(UmsApp.joinAction(actName),data,cb,viewName);
	};
	
	
			
	
    var app = {
    	version : VERSION,
    	getHtmlName : getHtmlName,
    	openWebView : openWebView,
    	initLoading : initLoading,
		postLoading : postLoading,
		postUmsView:postUmsView,
		postUmsAction:postUmsAction
    };
	return app;
}));

