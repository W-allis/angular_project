$.extend({
	toast: function(message, fn, delaytime) {
		fn = fn || console.debug;
		delaytime = 1500 || delaytime;
		var error = $('<div></div>');
		var mask = $('<div></div>');

		mask.css({
			'position': 'fixed',
			'left': '0',
			'right': '0',
			'top': '0',
			'bottom': '0',
			'zIndex': '999',
			'display': 'none'
		})

		mask.append(error);

		$('body').append(mask);
		error.css({
			'width': '80%',
			'background': '#000000',
			'borderRadius': '8px',
			'opacity': '0.7',
			'position': 'fixed',
			'left': '50%',
			'top': '41%',
			'fontSize': '0.6rem',
			'padding': '0.6rem 0.4rem',
			'color': '#ffffff',
			'textAlign': 'center',
			'transform': 'translateX(-50%)',
			'break': 'break-all',
			'wordWrap': 'break-word',
			'zIndex': '1000'
		})

		error.html(message).parent().fadeIn().delay(delaytime).fadeOut(function() {
			$(this).remove();
			fn && fn();
		});

	},
	$interval: function(options) {
		options = $.extend(true, {
			init: console.debug,
			step: 1,
			timestep: 1000,
			startDIS: 0,
			endDIS: 59,
			callback: console.debug,
			listener: console.debug
		}, options);

		//定时器触发之前的钩子函数
		options.init();
		//简单写 此属性只可读
		var nowDIS = options.startDIS;

		var timer = setInterval(function() {

			nowDIS += options.step;

			options.listener(nowDIS);

			if(nowDIS >= options.endDIS) {
				clearInterval(timer);
				options.callback();
			}

		}, options.timestep)
	},
	getSystem: function(){
		if (navigator.userAgent.indexOf('iPhone') !== -1) {
			return true;
		}
		return false;
	}
})

Location.prototype.getParams = Location.prototype.getParams ? Location.prototype.getParams : function(name) {
	var search = location.search,
		params = {};

	if(!search) {
		return undefined;
	}

	search = search.slice(1).split('&');

	for(var item = 0; item < search.length; item++) {
		var i = search[item].split('=');
		params[i[0]] = i[1];
	}

	if(name) {
		return params[name];
	} else {
		return params;
	}

}

function setMD(params){
	$.ajax({
		type:"post",
		headers: {
			'Content-Type': 'application/json'
		},
		url:"/pv/trace/savePageAction",
		data: JSON.stringify(params),
	});
}

function formatDateTime() {
    var date = new Date();  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;
    return y + "-" + m + "-" + d+" "+h+":"+minute+":"+second;    
};