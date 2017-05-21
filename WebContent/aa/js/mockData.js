/**
 * page render js
 * @param {Object} $ zepto or jQuery
 * @param {Object} factory
 */
(function (global,$, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MockData = factory());
}(window,Zepto, function() { 'use strict';
	
	var  mockData = function(name,type){
		this.name  = name||'workbench';
		this.type  = type||'json';
	};
	
	//trigger many events...
	mockData.prototype.trigger = function(evts,url){
		evts = $.isArray(evts)?evts:[evts];
		url = url||'../mock/';
		var dataUrl = url + this.name +'.'+this.type;
    	$.each(evts,function(i,n){
    		$.getJSON(dataUrl,function(rs){
        		UmsApp.receive(n,rs);
        		if(UmsApp.debug)
   					console.log('==mock== trigger event：%s ;rs:%s',n,JSON.stringify(rs));
        	});
    	});
	};
	//load init mock data;
	$(function(){
		var name = App.getHtmlName(),
		    evts = [UmsApp.UMSAPP_DATA_PREFIX+name,UmsApp.DEFAULT_LOAD_EVENT];
		new mockData(name).trigger(evts);
	});
	return mockData;
}));
