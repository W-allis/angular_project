$.extend({
	toast: function (message,fn) {
		fn = fn || console.debug;
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
			'width': '277px',
			'background': '#000000',
			'borderRadius': '8px',
			'opacity': '0.7',
			'position': 'fixed', 
			'left': '50%', 
			'top': '41%',
			'fontSize': '15px', 
			'padding': '15px 10px',
			'color': '#ffffff',
			'textAlign': 'center', 
			'transform': 'translateX(-50%)', 
			'break': 'break-all',
			'wordWrap': 'break-word', 
			'zIndex': '1000'
		})
	
		error.html(message).parent().fadeIn().delay(1500).fadeOut(function(){
			$(this).remove();
			fn && fn();
		});

	}
})