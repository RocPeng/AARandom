/**
 * kfan
 */
var UmsApp = (function() {
	//version
	var VERSION = '0.0.1',
		debug = true;

	var UMSAPP_VIEW_PREFIX = 'umsapp://view/',
		UMSAPP_DATA_PREFIX = 'umsapp://data/',
		UMSAPP_ACTION_PREFIX = 'umsapp://action/',
		UMSAPP_VIEW_REG = /^umsapp:\/\/view\/([A-Za-z\-]+)(\?.*)?/,
		UMSAPP_DATA_REG = /^umsapp:\/\/data\/([A-Za-z\-]+)(\?.*)?/,
		UMSAPP_ACTION_REG = /^umsapp:\/\/action\/([A-Za-z\-]+)(\?.*)?/;
	//default load action
	var DEFAULT_LOAD_EVENT = UMSAPP_DATA_PREFIX + 'load';
	//open webview;
	var DEFAULT_WEB_VIEW = UMSAPP_VIEW_PREFIX + 'webview?url=';

	//view name
	var UMSAPP_VIEW = [
		'login',
		'register',
		'forgot-password',
		'change-password',
		'room-list',
		'room-detail',
		'room-group-detail',
		'change-room-name',
		'chat',
		'remind-list',
		'remind-detail',
		'remind-create',
		'workbench',
		'workbench-hide',
		'contact-list',
		'contact-detail',
		'contact-dept-list',
		'contact-select',
		'contact-check',
		'contact-structure',
		'me',
		'local-contacts',
		'enlarge-picture',
		'not-found',
		'no-network',
		'webview',
		'about',
		'share-app'
	];
	//data name
	var UMSAPP_DATA = [
		'load',
		'login',
		'change-password',
		'room-list',
		'room-detail',
		'room-group-detail',
		'change-room-name',
		'chat',
		'remind-list',
		'remind-detail',
		'workbench',
		'workbench-hide',
		'contact-list',
		'contact-detail',
		'contact-dept-list',
		'contact-select',
		'contact-check',
		'contact-structure',
		'me',
		'enlarge-picture',
		'about',
		'share-app'
	];
	//action name
	var UMSAPP_ACTION = [
		'login',
		'logout',
		'request-sms-code',
		'verify-sms-code',
		'register',
		'change-corp',
		'contact-item-select',
		'contact-select',
		'upload-avatar',
		'workbench-banner',
		'workbench-business',
		'change-password',
		'change-password-submit',
		'version',
		'update-contact',
		'share-app',
		'clear-cache',
		'fav-member',
		'save-member',
		'send-sms',
		'dial',
		'create-chat',
		'chatroom/create', //compatible before
		'email',
		'photo',
		'qr-scan',
		'reset-setting',
		'view-settings',
		'change-room-name',
		'start-sound-record',
		'cancel-sound-record',
		'pause-sound-record',
		'finish-sound-record',
		'remove-sound-record',
		'play-sound',
		'pause-play-sound',
		'stop-play-sound',
		'play-sound-stopped',
		'upload-sound',
		'location',
		'shake',
		'date-pick',
		'datetime-pick',
		'time-pick',
		'uploadFile',
		'room-top',
		'room-no-disturb',
		'room-logout',
		'room-add-member',
		'room-add-member'
	];

	function isView(url) {
		return UMSAPP_VIEW_REG.test(url);
	}

	function isData(url) {
		return UMSAPP_DATA_REG.test(url);
	}

	function isAction(url) {
		return UMSAPP_ACTION_REG.test(url);
	}

	function validUrl(url) {
		var group = url.match(UMSAPP_VIEW_REG);
		if(group) {
			return true; //return UMSAPP_VIEW.indexOf(group[1]);
		}
		group = url.match(UMSAPP_DATA_REG);
		if(group) {
			return true; //return UMSAPP_DATA.indexOf(group[1]);
		}
		group = url.match(UMSAPP_ACTION_REG);
		if(group) {
			return true; //return UMSAPP_ACTION.indexOf(group[1]);
		}
		return false;
	}

	function joinView(viewName) {
		return UMSAPP_VIEW_PREFIX + viewName;
	}

	function joinData(dataName) {
		return UMSAPP_DATA_PREFIX + dataName;
	}

	function joinAction(actionName) {
		return UMSAPP_ACTION_PREFIX + actionName;
	}

	var ums = {};
	ums.debug = debug;
	ums.UMSAPP_VIEW = UMSAPP_VIEW;
	ums.UMSAPP_DATA = UMSAPP_DATA;
	ums.UMSAPP_ACTION = UMSAPP_ACTION;
	ums.UMSAPP_VIEW_PREFIX = UMSAPP_VIEW_PREFIX;
	ums.UMSAPP_DATA_PREFIX = UMSAPP_DATA_PREFIX;
	ums.UMSAPP_ACTION_PREFIX = UMSAPP_ACTION_PREFIX;
	ums.DEFAULT_LOAD_EVENT = DEFAULT_LOAD_EVENT;
	ums.validUrl = validUrl;
	ums.joinView = joinView;
	ums.joinData = joinData;
	ums.joinAction = joinAction;

	return ums;
})()
window.UmsApp = window.EChat = UmsApp;
window.$$ === undefined && (window.$$ = UmsApp);;;
(function($, ums) {

	var ua = navigator.userAgent,
		listenerClass = 'listener',
		_Android = ua.indexOf('Android') > -1,
		_iOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		cbQueue = {},
		listener = document.getElementsByClassName(listenerClass).length ?
		document.getElementsByClassName(listenerClass)[0] :
		document.getElementsByTagName('body')[0];

	ums.view = {},
		ums.data = {},
		ums.action = {},
		function empty() {};

	function isUmsapp() {
		return _Android || _iOS;
	}

	function dasherize(str) {
		return str.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase();
	};

	function camelize(str) {
		return str.replace(/-+(.)?/g, function(match, chr) {
			return chr ? chr.toUpperCase() : ''
		})
	};

	function mergeParams(url, data) {
		var index = url.indexOf('?'),
			params = {};
		if(index > -1) {
			url = url.substring(index + 1);
			var paramArr = url.split('&');
			paramArr.forEach(function(param) {
				var eqIndex = param.indexOf('=');
				var pkey = param.substring(0, eqIndex);
				var pvalue = param.substring(eqIndex + 1);
				params[pkey] = pvalue;
			});
		}
		return ums.extend(params, data);
	}

	function joinUrlParam(url, data) {
		var index = url.indexOf('?');
		if(index != -1) {
			url = url.substring(0, index);
		}
		var paramStr = $.param(data);
		if(paramStr)
			url += '?' + paramStr;
		return url;
	}

	function actionAndBindData(evtType, data, cb) {
		if(!evtType) {
			console.error('==umsapp-sdk== "evtType" is required');
			return false;
		}
		if(typeof(data) === 'function') {
			cb = data;
			data = null;
		}
		var actionType = ums.UMSAPP_ACTION_PREFIX + evtType,
			dataType = ums.UMSAPP_DATA_PREFIX + evtType;
		ums.send(actionType, data, cb);
		$(listener).on(dataType, data, cb);
	}

	ums.type = function(obj) {
		return obj == null ? String(obj) : typeof(obj);
	};
	ums.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	ums.isArrayLike = function(obj) {
		var length = !!obj && "length" in obj && obj.length;
		var type = ums.type(obj);
		if(type === "function" || ums.isWindow(obj)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	};

	ums.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};

	ums.isObject = function(obj) {
		return ums.type(obj) === "object";
	};

	ums.isPlainObject = function(obj) {
		return ums.isObject(obj) && !ums.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};

	ums.isEmptyObject = function(o) {
		for(var p in o) {
			if(p !== undefined) {
				return false;
			}
		}
		return true;
	};

	ums.isFunction = function(value) {
		return ums.type(value) === "function";
	};

	ums.isUmsapp = function() {
		return _Android || _iOS;
	}

	ums.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if(typeof target === "boolean") {
			deep = target;
			target = arguments[i] || {};
			i++;
		}
		if(typeof target !== "object" && !ums.isFunction(target)) {
			target = {};
		}
		if(i === length) {
			target = this;
			i--;
		}
		for(; i < length; i++) {
			if((options = arguments[i]) != null) {
				for(name in options) {
					src = target[name];
					copy = options[name];
					if(target === copy) {
						continue;
					}
					if(deep && copy && (ums.isPlainObject(copy) || (copyIsArray = ums.isArray(copy)))) {
						if(copyIsArray) {
							copyIsArray = false;
							clone = src && ums.isArray(src) ? src : [];

						} else {
							clone = src && ums.isPlainObject(src) ? src : {};
						}

						target[name] = ums.extend(deep, clone, copy);

					} else if(copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	};

	ums.trigger = function(element, eventType, eventData) {
		$(element).trigger(eventType, [eventData]);
	};

	ums.on = function(element, eventType, eventData, cb) {
		$(element).on(eventType, eventData, cb);
	}

	ums.send = function(url, data, cb, viewName) {
		if(!url) {
			alert('param "url" is required!');
			return false;
		}
		if(!ums.validUrl(url)) {
			alert('param url[' + url + '] is invalid!');
			return false;
		}
		if(typeof(data) == 'function') {
			viewName = cb;
			cb = data;
			data = undefined;
		}
		if(typeof(data) != 'undefined' && typeof(data) != 'object') {
			alert('param "data" must object!');
			return false;
		}
		if(typeof(cb) != 'undefined' && typeof(cb) != 'function') {
			alert('param "cb" must function!');
			return false;
		}
		if(typeof(viewName) != 'undefined' && typeof(viewName) != 'string') {
			alert('param "viewName" must string!');
			return false;
		}

		var data = mergeParams(url, data);
		url = joinUrlParam(url, data);
		if(!cbQueue.schamaStr) {
			cbQueue.schamaStr = [];
		}
		cbQueue.schamaStr.push(cb);

		if(ums.debug)
			console.log('==umsapp-sdk== client call ums.send: url[' +
				url + '],data[' + JSON.stringify(data) + ']');

		console.log('==umsapp-sdk== android start receive...'+url)
		if(_Android) {
			if(ums.debug) console.log('==umsapp-sdk== android start receive...');
			__android.receive(url);
			if(ums.debug) console.log('==umsapp-sdk== android end receive...');
		} else if(_iOS) {
			//TODO: like android method
			document.location = url;
		} //TODO:模拟环境
		else {
			console.error('==umsapp-sdk== Platform Not Supported!');
		}
	};

	ums.receive = function(name, data) {
		if(ums.debug) console.log('==umsapp-sdk== app call ums.receive : url[%s],data[%s]',
			name, JSON.stringify(data));
		var err, rs = data.data || data;
		if(!data.success) {
			err = {
				errcode: data.errcode,
				errmsg: data.errmsg
			};
		}
		if(cbQueue.name && cbQueue.name.length > 0) {
			var fn = cbQueue.name.shift();
			if(ums.debug) console.log('==umsapp-sdk== app start call call callback :[%s]', fn);
			typeof(err) == 'undefined' ? fn(err, rs): fn(err, rs);
			if(ums.debug) console.log('==umsapp-sdk== app finish call call callback ');
		} else {
			if(ums.debug) console.log('==umsapp-sdk== app  start triggle event :[%s]', name);
			ums.trigger(listener, name, rs);

			if(ums.debug) console.log('==umsapp-sdk== app  finish triggle event:[%s]', name);
		}
	};

	ums.view.onLoad = function(data, cb) {
		if(typeof(data) == 'function') {
			cb = data;
			data = {};
		}
		ums.on(listener, ums.DEFAULT_LOAD_EVENT, data, cb);
	};

	;
	ums.UMSAPP_VIEW.forEach(function(viewName) {
		var camelizeStr = camelize(viewName);
		ums.view[camelizeStr] = function(data, cb) {
			var url = ums.joinView(viewName)
			return ums.send(url, data, cb);
		}
	});

	;
	ums.UMSAPP_DATA.forEach(function(dataName) {
		var camelizeStr = camelize(dataName);
		ums.data[camelizeStr] = function(data, cb, viewName) {
			var url = ums.joinData(dataName)
			return ums.send(url, data, cb, viewName);
		}
	});

	;
	ums.UMSAPP_ACTION.forEach(function(actName) {
		var camelizeStr = camelize(actName);
		ums.action[camelizeStr] = function(data, cb, viewName) {
			var url = ums.joinAction(actName)
			return ums.send(url, data, cb);
		}
	});

	//external api;
	/**
	 * callback location and bind view://data/location event;
	 * @param {Object} data
	 * @param {Object} cb
	 */
	ums.location = function(data, cb) {
		actionAndBindData('location', data, cb);
	}

})(Zepto, UmsApp);