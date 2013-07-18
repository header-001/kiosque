document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

}

(function($){
 
	$.fn.extend({
		
		UrlServer :"",
		
		MsgErreur : {
			fr:{
				ErreurConnexion:"Erreur de connexion",
				ErreurNumero: "Numéro invalide",
				ErreurPin: "Erreur Pin"
			},
			en:{
				ErreurConnexion:"Connection error",
				ErreurNumero: "Invalid number",
				ErreurPin: "Error Pin"
			}
		},
		
		Lang :"",
		
		submitform: function(){
				 
			$.fn.UrlServer  = "http://genitranssprl.com/simulator/traitement.php";
	        /* Test env */
			
    		if(navigator.platform == "Win32")
    			$.fn.UrlServer = "http://localhost/mobile/simulator/traitement.php";
    		else
    			$.fn.UrlServer = "http://10.0.2.2/mobile/simulator/traitement.php";
    		//$.fn.UrlServer = "http://localhost/mobile/simulator/traitement.php";
			
			$('.loggin').bind('click', function() { 
				
				 var form 	= $(this).parents('form');
				 var formData = form.serialize();
				 var action = form[0]["Doaction"]["value"];
				 if($(this).find("#resend").attr("name")=="resend")
					 formData =formData + "&SubAction=Resend";
				 
					 console.log(formData)
				
				 $.ajax({  
					 type: 'POST',
	   		          url: $.fn.UrlServer,  
	   		          data: formData,  
	   		          dataType: 'json',
	   		          success:  function (data) {
   		        	  	$.fn.onSuccess(data,action);
	   		          },
		   		      error: function () {
	   		        	  $.fn.onError();
	   		          }, 
	   		          beforeSend: function(){
		   					$('.ui-loader').show();
		   		          },
	   		          complete: function(){
	   					$('.ui-loader').hide();
	   		          }
				 });
				 return false;
			});
			$('.langues .entrer').bind('click', function() { 
					console.log($(this).parents("form").serializeArray());
					var values = $(this).parents("form").serializeArray();
					console.log(values[0]);
					var url = values[0]['value']
					$.mobile.changePage( url , {}); 
					return false;
			});
		},
		onSuccess: function(data,action){
			 console.log(action);
			 switch(action){
			 
			 	case "SetSession":
			 		if(data.error)
			        	showAlert($.fn.MsgErreur[$.fn.Lang].ErreurNumero);
			 		else
			 			$.mobile.changePage( "confirme_pin.html?num=" + data.num + "&pin=" + data.pin , {}); 
				 break;
			 	case "SingIn":
			 		if(data.error)
			        	showAlert($.fn.MsgErreur[$.fn.Lang][data.msg]);
			 		else
			 			$.mobile.changePage( "summary.html?n=" + data.num + "&s=" + data.session , {});  
				 break;
			 	case "FetchInfo":

			 		//$.fn.__setSummaryContent(data.n);
			 		//$.fn.__setMinuteContent(data.Data);
			 		//$.fn.__setSmsContent(data.Data);
			 		$.fn.__setDataContent(data.Data,"min");
			 		$.fn.__setDataContent(data.Data,"data");
			 		
				 break;
			 } 
        	
        },
        onError: function(){
        	showAlert($.fn.MsgErreur[$.fn.Lang].ErreurConnexion);
        },
    	getUrlVars: function() {
		    var vars = [], hash;
		    var hashes;

		    if($.mobile.activePage.data('url').indexOf("?") != -1){ // first check the active page url for parameters
		         hashes = $.mobile.activePage.data('url').slice($.mobile.activePage.data('url').indexOf('?') + 1).split('&');
		    } else { // otherwise just get the current url
		         hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		    }

		    for(var i = 0; i < hashes.length; i++) {
		         hash = hashes[i].split('=');

		         if(hash.length > 1 && hash[1].indexOf("#") == -1){ // filter out misinterpreted paramters caused by JQM url naming scheme
		              vars.push(hash[0]);
		              vars[hash[0]] = hash[1];
		         }
		    }

		    return vars;
		},
		loadData: function(){
			
			var vars = $.fn.getUrlVars();
			var pin =""; 
			var num ="";
			var n = "";
			var s=""
			if(vars){
				if(vars["pin"])
					pin = vars["pin"];
				if(vars["num"])
					num = vars["num"];
				if(vars["n"])
					n = vars["n"];
				if(vars["s"])
					s = vars["s"];

			}
			$(".content-secondary ul a ").bind("click",function(){
				var href= $(this).data('href');
				$.mobile.changePage( href + "?n=" + n + "&s=" + s, {});
			});
			
			if(pin && $('#tempopin')){
				$('#tempopin').text(pin);
				$('#num').val(num);
			}
			if(s && n && $(".summary")){
				
				var dataToSend = "s="+s+"&n="+n+"&Doaction=FetchInfo";
				console.log($.fn.UrlServer);
				$.ajax({
		            type: "POST",
		            url: $.fn.UrlServer,
		            cache: false,
		            data: dataToSend,
   		          	success:  function (data) {
   		          		$.fn.onSuccess(data,"FetchInfo");
   		          	},
		            error: function () {
   		        	  $.fn.onError();
   		          	}, 
   		          	beforeSend: function(){
	   					$('.ui-loader').show();
   		          	},
   		          	complete: function(){
   		          		$('.ui-loader').hide();
   		          	}
		        });
			}
			if(s && n && $(".shop")){
				
				var dataToSend = "s="+s+"&n="+n+"&Doaction=FetchInfo";
				console.log($.fn.UrlServer);
				$.ajax({
		            type: "POST",
		            url: $.fn.UrlServer,
		            cache: false,
		            data: dataToSend,
	   		    	dataType: 'json',
   		          	success:  function (data) {

   		          	},
		            error: function () {

   		          	}, 
   		          	beforeSend: function(){

   		          	},
   		          	complete: function(){

   		          	}
		        });
			}

			var params = $.mobile.activePage.data('url').split('/');
			$.fn.Lang = params[5];

		},
		__setSummaryContent : function(summary){
			
		},
		__setDataContent : function(datas,block){
			
			var varhtml="", a1 = "";
			$.each(datas, function(i, item) {
				console.log(i);
				console.log(item);
				var html = "<div class='time ui-block-a'>" + i + "</div>";
				html = html + "<div class='detail ui-block-b'>";
				
				html = html + "<div class='initial'>";
				var a1 = "<span>0 MB</span>";
				var a2 = "<span>" + item[0] + "</span>";
				html = html + a1 + a2;
				html = html + "</div>";

				html = html + "<div class='graphe'></div>";
				
				html = html + "<div class='consomme'>";
				var b1 = "<span><strong>Used: </strong>" + item[1] + "</span>";
				var b2 = "<span><strong>Available: </strong>" + item[2] + "</span>";
				html = html + b1 + b2;
				html = html + "</div>";
				
				html = html + "</div>";
				varhtml = varhtml + "<div class='ui-grid'>" + html + "</div>";
			});
			//varhtml = "<div>" + varhtml + "</div>";
		 	
			$('.content-primary .' + block + ' .contenu').html(varhtml);
			
		},
		__setMinuteContent : function(min){
			
		},
		__setSmsContent : function(sms){
			
		}
	});
	 
	 
	// alert dialog dismissed
     function alertDismissed() {
         // do something
     }

	 // Show a custom alertDismissed
	 //
	 function showAlert(msg) {
	     navigator.notification.alert(
	         msg,  // message
	         alertDismissed,         // callback
	         'Erreur',            // title
	         'OK'                  // buttonName
	     );
	 }

	 $(window).hashchange(function(event,ui) {
		 $.fn.loadData();
	 });

	 $(document).ready(function() {
		 $.fn.loadData();
	 });
})(jQuery);

$(document).bind('pageinit',function(){
	$('form').submitform();
	
	var winHeight = $( window ).height();
	var headHeight = $( "#header" ).height();
	var h = parseInt(winHeight - headHeight);
	$("form").height(h-200);
	
	var contHeight = $(".content-primary").height();
	$(".content-secondary").height(contHeight-30);
});

$(document).bind('pagebeforechange',function(){

});


var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

function pullDownAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');

		for (i=0; i<3; i++) {
			li = document.createElement('li');
			li.innerText = 'Generated row ' + (++generatedCount);
			el.insertBefore(li, el.childNodes[0]);
		}
		
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function pullUpAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');

		for (i=0; i<3; i++) {
			li = document.createElement('li');
			li.innerText = 'Generated row ' + (++generatedCount);
			el.appendChild(li, el.childNodes[0]);
		}
		
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

