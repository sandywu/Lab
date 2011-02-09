/**
 * nekketsu.js
 * @Author: Sandy
 * @Date: 2010-09-20
 * @Email: wojiaoabin@gmail.com
 */

//Global Settings
if (typeof SA === 'undefined') {

	SA = {};

	SA.CONFIG = {
		'CANVAS-WIDTH' : 600,
		'CANVAS-HEIGHT' : 320,
		'BG-WIDTH' : 1406
	};

	TODO = function __todo__() {}
}

/*
 * @Package : Utils
 * @Description : 工具包
 */

var Utils = (function(win, doc){

	var HAS_OWN = 'hasOwnProperty',
		NATIVE = Array.prototype,
		p = '__proto__';


	/*
	 * @Function : inherit
	 * @Description : 简单继承
	 */

	Function.prototype.inherit = function(superClass) {
		
		var F = new superClass, proto = 'prototype';

		for (p in F) {
			this[proto][p] = F[p];
		}

		this._super = superClass.prototype;

	}


	/*
	 * @Function : Extend
	 * @Description : 浅拷贝
	 */

	function _extend(orig, dest) {
		
		for (p in dest) {
			if (orig[HAS_OWN](p) && dest[p]) {
				orig[p] = dest[p];
			}
		}

		return orig;
	
	}

	/*
	 * @Function : Get
	 */

	function _get(elem) {
		return typeof elem == 'string' ? doc.getElementById(elem) : elem;
	}

	/*
	 * @Class : Observer
	 */

	function _Observer(type) {
		this.fns = [];
		this.type = type || 'none';
	}

	_Observer.prototype = {

		'constructor' : _Observer,

		'subscribe' : function(fn) {	
			this.fns.push(fn)
			return this;
		},

		'unsubscribe' : function(fn) {
			this.fns = this.fns.filter(function(el) {
					return el != fn;
				}
			)
			return this;
		},	

		'fire' : function() {
			this.fns.forEach(function(fn) {
					fn.call(null);
				}
			)
			return this;
		}
	}

	/*
	 * @Class : Queue
	 */

	function _Queue(num) {
		this.init(num);
	}

	_Queue.prototype = {
		
		'constructor' : _Queue,

		'init' : function(num) {
			this._q = [];
			this.length = num;
		},

		'enqueue' : function(elem) {
			
			this._q.unshift(elem);
			
			if (this._q.length > this.length) {	
				this._q.pop();	
			}
		},

		'get' : function(idx) {
			return this._q[idx] || null;
		},

		'size' : function() {
			return this._q.length;
		}

	}

	/*
	 * @Class : Rect
	 * @Description : 矩形
	 */

	 function _Rect(config) {
		this.init(config);
	 }

	 _Rect.prototype = {
		
		'constructor' : _Rect,

		'init' : function(config) {
			this.setPos(config.x, config.y);
			this.setSize(config.width, config.height);
		},

		'setPos' : function(x, y) {
			this.x = x;
			this.y = y;
		},

		'setSize' : function(width, height) {
			this.width = width;
			this.height = height;
		},

		'collide' : function(rect) {

			var abs = Math.abs,
				cenX1 = this.x + this.width / 2,
				cenY1 = this.y + this.height / 2,
				cenX2 = rect.x + rect.width / 2,
				cenY2 = rect.y + rect.height / 2,
				disX = abs(cenX1 - cenX2),
				disY = abs(cenY1 - cenY2),
				hw = (this.width + rect.width) / 2,
				hy = (this.height + rect.height) / 2;

			if (disX < hw || disY < hy) {
				return true;
			}

			return false;
		}	
	 
	 }

	return {

		'extend' : _extend,
		'get' : _get,
		'Observer' : _Observer,
		'Queue' : _Queue,
		'Rect' : _Rect
	
	}

})(window, document);

/*
 * @Class : Animate
 */

var Animate = function(config) {
	this.observers = [];
	this.init(config);
	this.timer = null;
}

Animate.prototype = {

	'constructor' : Animate,

	/*
	 *@Method : init
	 *@Param : config - Object {'unit','frames','interval','type','loop'}
	 */
	'init' : function(config) {

		this.unit = config.unit || null,
		this.interval = config.interval || 1000 / 30,
		this.frameBuffer = config.frameBuffer || [],
		this.type = config.type || 'noname';
		this.loop = config.loop || false;

		if (!(this.unit instanceof Unit)) {
			throw new Error('Animate():' + type + ' unit Type Error!');
		}

		for (var i = 0, l = this.frameBuffer.length; i < l; i++) {
			this.observers[i] = new Utils.Observer(this.type + 'Frame' + i);
		}
	},

	'start' : function() {

		var pos = 0, self = this, length = self.frameBuffer.length;

		if (this.unit.ing) {
			return;
		} else {
			this.unit.ing = true;
			this.timer = setInterval(function() {
				
				if (pos + 1 > length) {		
					if (self.loop) {
						pos = 0;	
					} else {
						self.reset();
						return;
					}	
				}

				self.set(++pos);
								
			}, this.interval);
		}
	},
	'stop' : function() {
		clearInterval(this.timer);
		this.unit.ing = false;
	},
	'set' : function(num) {
		if (num > 0 || num <= this.frameBuffer.length) {
			var offset = this.frameBuffer[num - 1];
			this.unit.bgX = offset[0];
			this.unit.bgY = offset[1];
			this.observers[num - 1].fire();
		}
	},
	'reset' : function() {
		this.stop();
		this.set(1);
	},

	'addCbk' : function(idx, fn) {

		if (!this.observers.length || typeof this.observers[idx - 1] == 'undefined') {
			return;
		} else {
			this.observers[idx - 1].subscribe(fn);
		}
	}
}

/*
 * @Singleton : KeyHandler
 * @Description : 处理按键
 */

var KeyHandler = function() {

	var cntKeys = [], 
		keysQueue = new Utils.Queue(10), 
		lastTime = +new Date,
		interval;

	function _lookup(k) {

		for (key in KeyHandler.KEY) {
			if (k == KeyHandler.KEY[key]) {
				return key;
			}
		}

		return false;
	}

	function _record(key) {
	
		var k = _lookup(key), now = +new Date;

		interval = now - lastTime, 
		lastTime = now;

		if (k && cntKeys.indexOf(k) == -1) {
			cntKeys.push(k);
			keysQueue.enqueue(k);
		}

		//NormalCommandList.test();
	}


	function _release(key) {

		var k = _lookup(key);

		cntKeys = cntKeys.filter(function(val, idx) {
				return val == k ?  false : true;
			}
		)

		//NormalCommandList.test();
		
	}

	function _getCntKeys() {
		return cntKeys;
	}

	function _getKeysQueue() {
		return keysQueue;
	}

	function _getInterval() {
		return interval;
	}

	return {
	
		'recordKey' : _record,
		'releaseKey' : _release,
		'getCntKeys' : _getCntKeys,
		'getKeysQueue' : _getKeysQueue,
		'getInterval' : _getInterval
	}

}()

KeyHandler.KEY = {

	'UP' : 38,
	'RIGHT' : 39,
	'DOWN' : 40,
	'LEFT': 37,
	'Z' : 90,
	'X' : 88

}


/*
 * @Class : Command
 * @Description : 指令类
 */

function Command() {

	this.init = function() {
		this.sucCbk =  new Utils.Observer('CmdSucCbk');
		this.failCbk = new Utils.Observer('CmdFailCbk');
	}

	this.detect = function(cmds) {
		throw new Error('Command() : Method not Exist!');
	}

	this.execute = function(cmds) {

		if (this.detect(cmds)) {
			this.sucCbk.fire();
			this.isKeyDown = true;
		} else {
			this.failCbk.fire();
		}
	}

}

/*
 * @SubClass : NormalCommand
 */

function NormalCommand(arr) {

	NormalCommand.inherit(Command);

	this.cmdList = arr || [];
	this.isKeyDown = false;

	this.detect = function(cmds) {
		
		var ret = true, _self = this;

		this.cmdList.forEach(function(cmd) {
				if (cmds.indexOf(cmd) == -1){
					ret = false;
					_self.isKeyDown = false;
				}
			}
		)

		return ret;
	}

	this.init();
}


/*
 * @DecoratorClass : AttackCommandDecorator
 * @Params : cmd{NormalCommand}
 */

function AttackCommandDecorator(cmd) {
		
	if (cmd instanceof NormalCommand) {
		
		var _old = cmd.execute;

		cmd.execute = function(cmds) {
			
			this.detect(cmds);

			if (this.isKeyDown) {
				return;
			} else {
				_old.call(this, cmds);
			}

		}
	
		return cmd;
	
	}

}

/*
 * @SubClass : SpecialCommand
 * @Params : arr{Array} 指令序列
 * @Params : interval{Number | String} 按键间隔
 */

function SpecialCommand(arr, interval) {
	
	SpecialCommand.inherit(Command);

	var pos = 0;

	this.cmdSeq = arr || [];

	this.detect = function(K) {

		var	f = K.getKeysQueue().get(0),
			t = K.getInterval(),
			k = this.cmdSeq[pos];
		
		if (pos == 0 && k == f) {
			pos++;
		} else {
			if (t <= interval && k == f) {
				pos++;
				if (pos == this.cmdSeq.length) {
					pos = 0;
					return true;
				}
			}
		} 
		return false;
	}

}

/*
 * @Singleton : NormalCommandList
 */

var NormalCommandList = (function() {
	
	var _commandList = [];
	
	function _add(cmd) {
		if (cmd instanceof Array) {
			cmd.forEach(_add);
		} else if (cmd instanceof NormalCommand) {
			_commandList.push(cmd);
		}
	}

	function _remove(cmd) {
		_commandList = _commandList.filter(function(_cmd) {
				return _cmd !== cmd;
			}
		)
	}

	function _test() {
		_commandList.forEach(function(_cmd) {
				_cmd.execute(KeyHandler.getCntKeys());
			}
		)
	}

	return {
		'add': _add,
		'remove' : _remove,
		'test' : _test
	}

})();

/*
 * @Class : Unit
 * @Description : 基本动作单位
 * @Params : config{Object} 
 */

var Unit = function(config) {

	var attribute = Utils.extend(
			{
				'cenX' : 0,
				'cenY' : 0,
				'width' : 0,
				'height' : 0,
				'background' : '',
				'bgX' : 0,
				'bgY' : 0,
				'visible' : true,
				'zIndex' : 1,
				'offsetParent' : null
			}, config), obj = {}, elem,
				_self = this;

	var fnsSetter = {
		'cenX' : function() {
			elem.style.left = attribute['cenX'] - (attribute['width'] / 2) + 'px';
		},
		'cenY' : function() {
			elem.style.top = attribute['cenY'] - (attribute['height'] / 2) + 'px';
		},
		'width' : function() {
			elem.style.width = attribute['width'] + 'px';
		},
		'height' : function() {
			elem.style.height = attribute['height'] + 'px';
		},
		'bgX' : function() {
			elem.style.backgroundPositionX = attribute['bgX'] + 'px';
		},
		'bgY' : function() {
			elem.style.backgroundPositionY = attribute['bgY'] + 'px';
		},
		'background' : function() {	
			elem.style.background = 'url(' + attribute['background'] + ')';
		},
		'visible' : function() {
			elem.style.display = attribute['visible'] == true ? 'block' : 'none';
		},
		'zIndex' : function() {
			elem.style.zIndex = attribute['zIndex'];
		}
	}
	
	function _create() {	
		elem = document.createElement('DIV');
		elem.style.position = 'absolute';
		attribute['offsetParent'].appendChild(elem);	
	}
	
	function _setter(p, fn) {
		_self.__defineSetter__(p, function(val) {
				attribute[p] = val;
				fn();
			}
		)
	}
		
	function _init() {

		_create();

		for (p in attribute) {

			_self.__defineGetter__(p, (function(prop) {
					return function() {
						return attribute[prop];
					}
				})(p)
			)

			if (p in fnsSetter) {
				_setter(p, fnsSetter[p]);
				fnsSetter[p]();
			}
		
		}

	}

	_init();
		
}

/* 
 * @Singleton: Canvas
   @Description : 背景
   @Tip : Only render the X axis
 */

var Canvas = (function(wrapper, dir, doc) {
	
	var Get = Utils.get,
		config = SA.CONFIG,
		bgList = [
					['bgMain.png', 1, 1406, 320],
					['cloud.png', 0.2, 1000, 320]
				],
		wrapper, canvas = doc.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		loaded = 0, total = bgList.length,
		posX = 0;

	function _init() {

		wrapper = Get('wrapper'),
		canvas.setAttribute('width', config['CANVAS-WIDTH'] + 'px');
		canvas.setAttribute('height', config['CANVAS-HEIGHT'] + 'px');
		wrapper.appendChild(canvas);
		
		bgList.reverse().forEach(function(bgArr) {
				var src = bgArr[0];
				bgArr[0] = new Image();
				bgArr[0].src = dir + src;
				bgArr[0].onload = function() {
					loaded++;			
				}
			}
		)
	}

	function _check() {
		return loaded == total;
	}

	function _render(range) {

		if (!_check()) {
			setTimeout(function(){ _render(range)},30);
			return;
		}
		
		posX -= range;
		ctx.clearRect(0, 0, 600, 320);
		bgList.forEach(function(bgArr) {		
				ctx.drawImage(bgArr[0], posX * bgArr[1], 0, bgArr[2], bgArr[3]); 
			}
		)
	}

	function _getPos() {
		return -posX;
	}

	return {
		'init' : _init,
		'render' : _render,
		'getPos' : _getPos
	}

})('wrapper','images/', document);

/* 
 * @Singleton: Player
 * @Description : 主人公
 */


var Player = TODO;


/*
 * @Singleton: DirOpt
 * @Description: 方向键管理
 */

var DirOpt = (function() {
	
	function _addDir(dir) {
		if (DirOpt.DIR.indexOf(dir) == -1) {
			DirOpt.DIR.push(dir);
		}
	}
	
	function _removeDir(dir) {
		DirOpt.DIR = DirOpt.DIR.filter(function(val) {
				return val != dir;
			}
		)
	}
	
	return {
		'addDir' : _addDir,
		'removeDir' : _removeDir
	}
})();

DirOpt.DIR = [];

/*
 * @Singleton : Player State
 * @Description : Player状态Hash 
 */

var State = (function() {

	var State = {};

	function _addState(state, fn) {
		if (typeof state == 'object') {
			for (s in state) {
				_addState(s, state[s]);
			}
		} else if (!(state in State)) {
			State[state] = {'timeStamp' : null, 'enable' : false, 'data' : null, 'handle' : fn};	
		}
	}

	function _enable(state, data) {
		var s = State[state];
		s.timeStamp = +new Date();
		s.enable = true;
		s.data = data;
		_check(state);
	}

	function _disable(state) {
		var s = State[state];
		s.enable = false;
		_check(state);
	}

	function _getState(state) {
		return State[state];	
	}
	
	function _check(state) {
		if (typeof state === undefined) {
			for (s in State) {
				if (State.hasOwnProperty(s)) {
					_check(s);	
				}
			}
		} else if(typeof state == 'string') {
			var obj = State[state];
			if (obj) {
				obj.handle(obj);
			}
		}
	}

	return {
		'addState' : _addState,
		'getState' : _getState,
		'enable' : _enable,
		'disable' : _disable,
		'check' : _check
	}

})();
	


/*
 * @Function : Game Prepare
 * @Description : 在页面载入前对游戏初始化
 */

function prepare() {

	State.addState(
		{
			'LEFT' : function(obj) {
				var flag = obj.enable;
				DirOpt[flag ? 'addDir' : 'removeDir']('LEFT');
				flag ? Player2.walk('back') : void(0);
			},
			'RIGHT' : function(obj) {
				var flag = obj.enable;
				DirOpt[flag ? 'addDir' : 'removeDir']('RIGHT');
				flag ? Player2.walk('front') : void(0);
			},
			'UP' : function(obj) {
				var flag = obj.enable;
				DirOpt[flag ? 'addDir' : 'removeDir']('UP');
				flag ? Player2.walk() : void(0);
			},
			'DOWN' : function(obj) {
				var flag = obj.enable;
				DirOpt[flag ? 'addDir' : 'removeDir']('DOWN');
				flag ? Player2.walk() : void(0);
			},
			'FIST' : function(obj) {
			},
			'KICK' : function(obj) {
			}
		}
	)

}


function mainLoop() {

		
}

function checkState() {

	
}


window.onload = function() {
	prepare();
}


