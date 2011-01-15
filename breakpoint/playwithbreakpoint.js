/*
 * PlayWithBreakPoint.js
 * @Author: Sandy
 * @Date: 2011-01-13
 * @Email: wojiaoabin@gmail.com
**/

;(function(win, undefined) {

	var d = win.document,
		undef = undefined,
		PREFIX = '__BP__', CLS = '.', ID = '#',
		$ = function(elem) { return typeof elem == 'string' ? d.getElementById(elem) : elem },
		$$ = function() { return d.querySelectorAll.apply(d, arguments) },
		pointHandlers = [
			function raiseCatchException() {
				var sandy = d.createElement('article');
				try {
					d.body.appendChild(ydnas);
				} catch(e) {
					console.log(e);
				}
			},

			function raiseException() {
				throw 0;
			},

			function appendChild() {
				var parent = $('__BP__parent'), child = d.createElement('div');
				child.setAttribute('style', 'border: 2px solid; padding: 5px; margin: 5px; text-align: center; width: 120px');
				child.textContent = '子节点';
				parent.appendChild(child);
			},

			function requestData() {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'http://sandynoblog.appspot.com/media/agtzYW5keW5vYmxvZ3INCxIFTWVkaWEYkb8FDA/data.txt', true);
				xhr.send();
			},

			function clickListener() {
				console.info('别惹我!');
			}
		];
		

	function regularPoint(e) {
		//add BreakPoint below
		var target = e.target;
		return "onMouseOver: " + target;
	}

	function init() {
		onLoad();
		d.addEventListener('mouseover', regularPoint, true);
	}

	function onLoad() {
		var ph = pointHandlers;
		for (var i = 0, l = ph.length; i < l; i++) {
				[].forEach.call($$(CLS + PREFIX + ph[i].name), function(elem) {
					elem.onclick = ph[i];
				}
			)		
		}
	}

	init();

})(window, undefined);