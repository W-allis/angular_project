$.extend({toast:function(e,t){t=t||console.debug;var d=$("<div></div>"),o=$("<div></div>");o.css({position:"fixed",left:"0",right:"0",top:"0",bottom:"0",zIndex:"999",display:"none"}),o.append(d),$("body").append(o),d.css({width:"277px",background:"#000000",borderRadius:"8px",opacity:"0.7",position:"fixed",left:"50%",top:"41%",fontSize:"15px",padding:"15px 10px",color:"#ffffff",textAlign:"center",transform:"translateX(-50%)","break":"break-all",wordWrap:"break-word",zIndex:"1000"}),d.html(e).parent().fadeIn().delay(1500).fadeOut(function(){$(this).remove(),t&&t()})}});