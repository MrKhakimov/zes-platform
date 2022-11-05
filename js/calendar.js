(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory(jQuery);
	}
}(
/**
 * @param {jQuery} $
 */
function($) {
	// disable drop open behavior
	$('html').on('dragover drop', function(e) { e.preventDefault() });
	
	$.fn.scrollbars = function(a,b,c) {
		if(window.isMobile || window.isTouch) {//} && window.isTouch) {
			switch(a) {
				case 'scrollTo':
					return this.scrollTop(b);
				// case 'update':
				// 	return this.mCustomScrollbar('update');
				case '':
					return this;
				default:
					console.log('SCROLLBARS: ',a,b,c)
					if(typeof a == 'object' && typeof b == 'undefined') {
						this.css('overflow', 'auto')
					}
					return this;
			}
		} else {
			return this.mCustomScrollbar(a,b,c);
		}
	}
	
	$.fn.calendar = function (opt,val) {
		var self = this;
		if(typeof opt === 'string' && typeof val !== 'undefined') switch(opt) { // setter | method with args
			
			// return this;
		}
		else if(typeof opt === 'string') switch(opt) { // getter | method with no args
			// return;
		}
		var def = {
			date: new Date(),
			autoSelect: false,
			select: function(date) {},
			toggle: function(y, m) {},
		}
		var current = {
			y: def.date.getFullYear(),
			m: def.date.getMonth()+1,
			d: def.date.getDate(),
		}
		var selected = {
			y: 0,
			m: 0,
			d: 0,
		}
		$(this).prop('selected', selected);
		def = $.extend(def, opt);
		var weekDays = 'Пн Вт Ср Чт Пт Сб Вс'.split(' ');
		var yearMonths = 'Январь Февраль Март Апрел Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь'.split(' ');
		var yearMonthsShort = 'Ян Фев Март Апр Май Июнь Июль Авг Сен Окт Ноя Дек'.split(' ');
		var today = new Date();
		var todayDate = today.getDate();
		var makeMonth = function(y,m,d) {
			var body = $('<table>')
				.addClass('month-body')
				// .appendTo(month)
			var week = $('<thead>')
				.addClass('month-week')
				.appendTo(body)
				.append('<tr></tr>')
				.find('tr')
			var days = $('<tbody>')
				.addClass('month-days')
				.appendTo(body)
			for(i=0;i<7;i++) {
				week.append('<th>'+weekDays[i]+'</th>');
			}
			var date = new Date(y,m-1,1);
			var today = new Date();
			var todayDate = today.getDate();
			var thisMonth = !!(today.getMonth()+1 === m && today.getFullYear() === y);
			// date.setFullYear(y,m-1,1);
			var numDays = (new Date(y,m,0)).getDate();
			var numWeeks = Math.ceil((numDays + date.getDay())/7);
			var day = 1;
			// console.log(date.getDay(), date.getMonth(), numDays);
			// for(var i=0; i<numWeeks; i++) {
			for(var i=0; i<6; i++) {
				var wk = $('<tr>').appendTo(days);
				for(var j=0;j<7;j++) {
					if((i===0 && j<date.getDay()) || (day>numDays)) {
						wk.append('<td></td>')
						// wk.append('<td class="fade"> - </td>')
						// continue;
					} else {
						$('<td>')
							.text(day < 10 ? '0'+day : day)
							// .addClass(day === d ? 'active' : '')
							.addClass(thisMonth && day === todayDate ? 'today' : '')
							.attr('data-date', day)
							// .ripple({ type: 'icon' })
							.appendTo(wk)
							.click(function(e) {
								$(this).parent().parent().find('.active').removeClass('active')
								$(this).addClass('active')
								selectDate(y, m, parseInt($(this).attr('data-date')))
							})
						day++;
					}
				}
				// if(wk.text().trim() === '' && days.children(':first').text().split(' ').join('').split('0').join('').length === 7) wk.prependTo(days);
				if(i === 5 && days.children(':first').text().split(' ').join('').split('0').join('').length === 7) wk.prependTo(days);
			}
			// days.find('td[data-date]').ripple({ type: 'centered' })
			days.find('td[data-date]').ripple()
			if(def.autoSelect) {
				days.find('td[data-date="'+d+'"]').click()//.addClass('active')
			}
			return body;
		}
		var selectDate = function(y,m,d) {
			selected.d = d;
			selected.m = m;
			selected.y = y;
			var dt = new Date(y,m-1,d);
			def.select.bind(self)(dt);
		}
		var bringMonth = function(p_n,y,m,d) {
			isMoving = true;
			month.addClass('no-overflow');
			yMon.text(yearMonths[m-1]+' '+y)
			yrnm.text(y)
			yrbd.find('.active').removeClass('active')
			yrbd.find('[data-month="'+m+'"]').addClass('active')
			if(d === null && y === selected.y && m === selected.m) d = selected.d;
			var mon = makeMonth(y,m,d)
				.addClass(p_n)
				.insertBefore(body)
			def.toggle.bind(self)(current.y, current.m);
			// requestAnimationFrame(function() {
			setTimeout(function() {
				mon.addClass('come')
			}, 1000/60)
			body.one('transitionend', function(e) {
				body.remove()
				body = mon;
				body.removeClass(p_n+' come')
				month.removeClass('no-overflow');
				// def.toggle.bind(self)(current.y, current.m);
				isMoving = false;
			})
		}
		var showYearPicker = function(e) {
			year.addClass('visible')
		}
		var hideYearPicker = function(e) {
			year.removeClass('visible')
		}
		var isMoving = false;
		var date = def.date;
		// var month = $('<div>')
		var month = $(this[0])
			.addClass('nao-month')
			// .appendTo(dpkr)
		var btn1 = $('<button>')
			.addClass('fa fa-chevron-down')
			.ripple()
			.attr('title', 'Previous month')
			.click(function(e) {
				e.preventDefault();
				if(isMoving) return;
				current.m = current.m-1 === 0 ? 12 : current.m-1;
				current.y = current.m === 12 ? current.y-1 : current.y;
				bringMonth('prev', current.y, current.m, null);
			})
			.focus(hideYearPicker)
		var btn2 = $('<button>')
			.addClass('fa fa-chevron-up')
			.ripple()
			.attr('title', 'Next month')
			.click(function(e) {
				e.preventDefault();
				if(isMoving) return;
				current.m = current.m+1 === 13 ? 1 : current.m+1;
				current.y = current.m === 1 ? current.y+1 : current.y;
				bringMonth('next', current.y, current.m, null);
			})
			.focus(hideYearPicker)
		var btn3 = $('<button>')
			.addClass('btn fa fa-lt')
			.ripple()
			.attr('title', 'View current month')
			.click(function(e) {
				e.preventDefault();
				if(isMoving) return;
				var dt = new Date();
				if(dt.getFullYear() === current.y && dt.getMonth()+1 === current.m) return;
				var dr = current.y*12+current.m > dt.getFullYear()*12+dt.getMonth()+1 ? 'prev' : 'next';
				current.y = dt.getFullYear();
				current.m = dt.getMonth()+1;
				bringMonth(dr, current.y, current.m, null);
			})
			.focus(hideYearPicker)
		var btn4 = $('<button>')
			.addClass('btn fa fa-ss')
			.ripple()
			.attr('title', 'View selected date')
			.click(function(e) {
				e.preventDefault();
				if(isMoving) return;
				if(selected.d < 1) return;
				if(selected.y === current.y && selected.m === current.m) return;
				var dr = current.y*12+current.m > selected.y*12+selected.m ? 'prev' : 'next';
				current.y = selected.y;
				current.m = selected.m;
				bringMonth(dr, current.y, current.m, null);
			})
			.focus(hideYearPicker)
		var yMon = $('<div>')
			.text(yearMonths[date.getMonth()]+' '+date.getFullYear())
			.attr('title', 'Select year and month')
			.click(showYearPicker)
		var head = $('<div>')
			.addClass('month-head')
			// .text(yearMonths[date.getMonth()]+' '+date.getFullYear())
			.append(btn1)
			.append(btn3)
			.append(btn2)
			.append(btn4)
			.append(yMon)
			.appendTo(month)
		var body = makeMonth(current.y, current.m, (opt && opt.date) ? current.d : null)
			.appendTo(month)
		var togg = def.toggle.bind(self)(current.y, current.m);
		var year = $('<div>')
			.addClass('year-month')
			.prependTo(month)
		var yrnx = $('<button>')
			// .addClass('span')
			.addClass('ic ic-arrow-angle-right')
			.ripple()
			.click(function(e) {
				e.preventDefault();
				if(isMoving) return;
				current.y++;
				yrnm.text(current.y)
				bringMonth('next', current.y, current.m, null);
			})
			.focus(showYearPicker)
		var yrpv = $('<button>')
			// .addClass('span')
			.addClass('ic ic-arrow-angle-left')
			.ripple()
			.click(function(e) {
				e.preventDefault();
				if(isMoving) return;
				current.y--;
				yrnm.text(current.y)
				bringMonth('prev', current.y, current.m, null);
			})
			.focus(showYearPicker)
		var yrnm = $('<div>')
			.text(current.y)
			.attr('title', 'Go back to calendar')
			.click(hideYearPicker)
		var yrhd = $('<div>')
			.addClass('month-head')
			// .addClass('year-head')
			.append(yrpv)
			.append(yrnx)
			.append(yrnm)
			.appendTo(year)
		var yrbd = $('<table>')
			.addClass('year-body')
			.appendTo(year)
			.html('<tbody></tbody>')
			.find('tbody')
		var yrft = $('<div>')
			.addClass('year-footer ic ic-arrow-circle-angle-up')
			// .text('okay')
			.attr('title', 'Go back to calendar')
			.ripple()
			.appendTo(year)
			.click(function(e) {
				year.removeClass('visible')
			})
		for(var i=0; i<4; i++) {
			var row = $('<tr>').appendTo(yrbd)
			for(var j=0; j<3; j++) {
				var idx = i*3+j;
				var col = $('<td>')
					.text(yearMonths[idx])
					.attr('data-month', idx+1)
					.addClass(current.m === idx+1 ? 'active' : '')
					.appendTo(row)
					.ripple()
					.click(function(e) {
						if(isMoving) return;
						var mm = parseInt($(this).attr('data-month'))
						if(mm == current.m) return;
						var dr = current.m > mm ? 'prev' : 'next';
						current.m = mm;
						$(this).parent().parent().find('.active').removeClass('active')
						$(this).addClass('active')
						bringMonth(dr, current.y, current.m, null);
					})
			}
		}
		return this;
	}
	return $;
}));

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory(jQuery);
	}
}(
/**
 * @param {jQuery} $
 */
function($) {
	let globDur = 400;
	let globEse = 'cubic-bezier(.4,0,.2,1)';
	let stylFix = $(document.createElement('style')).appendTo(document.head).addClass('ripple-custom-config')
	let stylSet = $(document.createElement('style')).appendTo(document.head).addClass('ripple-coordinates')
	let stylObj = {};
	let stylPos = {};
	let nowRuns = 0;
	let pointerdown = ('ontouchstart' in document.body) ? 'mousedown touchstart' : 'mousedown'
	$.fn.ripple = function(opt) {
		// console.log('RIPPLE :: ', this);
		let def = {
			ease: globEse,
			duration: globDur,
			onclick: false,
			disable: false,
			type: 'pointed', // 'centered' | 'icon' | 'trigger' | 'target'
			size: 1,
		};
		let selectorIDX = 'ripple-'+Math.round(Math.random()*1E9);
		// element setup
		$(this).each((i,v) => {
			let $elm = $(v);
			// jQuery('v').prop()
			if(typeof opt === 'string') {
				switch(opt) {
					case 'onmousedown':
						$elm[0].rippleVars.ondown = true;
						$elm
							.unbind('click', $elm[0].rippleVars.callback)
							.bind(pointerdown, $elm[0].rippleVars.callback);
						break;
					case 'onclick':
						$elm[0].rippleVars.ondown = false;
						$elm
							.unbind(pointerdown, $elm[0].rippleVars.callback)
							.bind('click', $elm[0].rippleVars.callback);
						break;
					case 'enable':
						$elm
							.removeClass('ripple-disabled')
							.bind($elm[0].rippleVars.ondown ? pointerdown : 'click', $elm[0].rippleVars.callback);
						break;
					case 'disable':
						$elm
							.addClass('ripple-disabled')
							// .removeClass('ripple')
							.unbind('click', $elm[0].rippleVars.callback)
							.unbind(pointerdown, $elm[0].rippleVars.callback);
						break;
					case 'ripple':
						$elm
							.removeClass('ripple-disabled')
							.trigger($elm[0].rippleVars.ondown ? 'mousedown' : 'click');
						break;
					case 'dismiss':
						$elm
							.removeClass('ripple')
						break;
					default:
						// $elm.bind('click', $elm[0].rippleVars.callback);
						break;
				}
				return;
			}
			def = $.extend(def, opt);
			def.duration = (typeof def.duration == 'number' ? def.duration : ((/^([2-9]|10)x$/i).test(def.duration) ? def.duration.toLowerCase() : globDur))
			let rePos = e => {
				// console.log(e);
				// let rid = 'ripple-running-'+Math.round(Math.random()*1E9);
				// debugger
				let rc, x1, y1, px, py;
				if(e.type == 'touchstart') {
					rc = e.currentTarget.getBoundingClientRect()
					x1 = e.originalEvent.touches[0].clientX - rc.left
					y1 = e.originalEvent.touches[0].clientY - rc.top
					px = e.originalEvent.touches[0].pageX
					py = e.originalEvent.touches[0].pageY
				} else {
					x1 = e.offsetX
					y1 = e.offsetY
					px = e.pageX
					py = e.pageY
				}
				if((x1 == 0 && y1 == 0) || ($elm[0].rippleVars.type == 'trigger')) stylPos[$elm[0].rippleVars.rid] = ``; // && e.pageX == 0 && e.pageY == 0 && e.clientX == 0 && e.clientY == 0
				else {
					let off = $elm.offset()
					stylPos[$elm[0].rippleVars.rid] = `
					.ripple-element.${ $elm[0].rippleVars.rid }.ripple::after {
						left: ${ 100*((px-off.left)/$elm.outerWidth())-100 }%;
						top: ${ 100*((py-off.top)/$elm.outerHeight()) }%;
					}`;
				}
				let stylTxt = '';
				for(let s in stylPos) {
					stylTxt += stylPos[s];
				}
				stylSet.html(stylTxt);
			};
			$elm[0].rippleVars = {
				idx: selectorIDX,
				rid: 'ripple-running-'+Math.round(Math.random()*1E9),
				size: parseInt(Math.min(Math.max(def.size, 1), 10)),
				ease: def.ease,
				type: def.type,
				time: ((/^([2-9]|10)x$/i).test(def.duration) ? parseInt(def.duration)*globDur : def.duration),
				timeout: 0,
				ondown: !def.onclick,
				callback: (e) => {
					// console.log(e.offsetX, e.offsetY, $elm.outerWidth(), $elm.outerHeight());
					if(e.type == 'mousedown' && 'ontouchstart' in document.body) return;
					if($elm.hasClass('ripple-disabled')) {
						return;
					}
					if($elm[0].rippleVars.timeout == 0) { // means NOT running
						nowRuns++;
						if($elm[0].rippleVars.type == 'pointed') rePos(e);
						$elm.addClass('ripple');
						/*
						$elm[0].rippleVars.timeout = 1;
						$elm.one('animationend', e => {
							// console.log('ripple END!!!');
							$elm.removeClass('ripple');
							$elm[0].rippleVars.timeout = 0;
							nowRuns--;
							if(nowRuns <= 0) {
								nowRuns = 0;
								stylPos = {};
								stylSet.html('');
							}
						})
						//*/
					} else { // running
						/*clearTimeout(_it.rippleVars.timeout);*/
						$elm.removeClass('ripple');
						if($elm[0].rippleVars.type == 'pointed') rePos(e);
						requestAnimationFrame(()=>{
							$elm.addClass('ripple');
						})
						/*$elm[0].rippleVars.timeout = setTimeout(()=>{
							// console.log('ripple OUT!!! 2');
							$elm.removeClass('ripple');
							clearTimeout($elm[0].rippleVars.timeout);
							$elm[0].rippleVars.timeout = 0;
						},$elm[0].rippleVars.time)*/
					}
					// cut from if block above
					clearTimeout($elm[0].rippleVars.timeout);
					$elm[0].rippleVars.timeout = setTimeout(()=>{
						// console.log('ripple OUT!!!');
						$elm.removeClass('ripple');
						$elm[0].rippleVars.timeout = 0;
						nowRuns--;
						if(nowRuns <= 0) {
							nowRuns = 0;
							stylPos = {};
							stylSet.html('');
						}
					}, $elm[0].rippleVars.time+16)
				}
			};
			let iconClass = '';
			switch($elm[0].rippleVars.type) {
				case 'icon':
					iconClass = ' ripple-icon'
					break;
				case 'icon-big':
					iconClass = ' ripple-icon-big'
					break;
				case 'icon-small':
					iconClass = ' ripple-icon-small'
					break;
				default:
					break;
			}
			$elm
				// .addClass('ripple-element'+iconClass+(def.disable ? ' ripple-disabled' : '')+' '+$elm[0].rippleVars.idx)
				.addClass('ripple-'+(def.type == 'trigger' ? 'trigger' : 'element')+iconClass+(def.disable ? ' ripple-disabled' : '')+' '+$elm[0].rippleVars.idx)
				.addClass($elm[0].rippleVars.rid)
				.addClass($elm[0].rippleVars.size >= 2 && $elm[0].rippleVars.size <= 10 ? 'ripple-anim-'+$elm[0].rippleVars.size+'x' : '')
				.addClass((/^([2-9]|10)x$/i).test(def.duration) ? 'ripple-time-'+parseInt(def.duration)+'x' : '')
				.bind($elm[0].rippleVars.ondown ? pointerdown : 'click', $elm[0].rippleVars.callback)
				.click(function cl(e) {
					if($elm[0].rippleVars.timeout == 0 && $elm[0].rippleVars.ondown && e.offsetY == 0 && e.offsetX == 0) $elm.trigger('mousedown', e);
				})
		}); // each
		if(typeof opt === 'object') {
			def = $.extend(def, opt);
			// if(def.duration !== globDur || def.ease !== globEse || def.size !== 1) stylObj[selectorIDX] = 
			if((def.duration !== globDur && (/^([2-9]|10)x$/i).test(def.duration) === false) || def.ease !== globEse) stylObj[selectorIDX] = 
			`.ripple-${ def.type == 'trigger' ? 'trigger' : 'element' }.${ selectorIDX }.ripple${ def.type == 'trigger' ? ' .ripple-target' : '' }::after {`+
				// `${ def.size !== 1 ? 'animation-name: rippleanim-'+def.size+'x;' : '' }`+
				`${ def.ease !== globEse ? 'animation-timing-function: '+def.ease+';' : '' }`+
				`${ (def.duration !== globDur && (/^([2-9]|10)x$/i).test(def.duration) === false) ? 'animation-duration: '+def.duration+'ms;' : '' }`+
			`}`
			let stylTxt = '';
			for(let s in stylObj) {
				stylTxt += stylObj[s];
			}
			stylFix.html(stylTxt);
		}
		return this;
	}
	// $.fn.rippleDismiss = function(ondown=false) {
	// 	return _it;
	// }
	return $;
}));