document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

}

(function($){
 
	$.fn.extend({
		
		UrlServer :"",
		
		submitform: function(){
				 
			$.fn.UrlServer  = "http://genitranssprl.com/simulator/traitement.php";
	        /* Test env */
			
    		if(navigator.platform == "Win32")
    			$.fn.UrlServer = "http://localhost/mobile/simulator/traitement.php";
    		else
    			$.fn.UrlServer = "http://10.0.2.2/mobile/simulator/traitement.php";
    		//$.fn.UrlServer = "http://localhost/mobile/simulator/traitement.php";
			
			$(':submit,.ui-submit').bind('click', function() { 
				
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
		},
		onSuccess: function(data,action){
			 console.log(action);
			 switch(action){
			 
			 	case "SetSession":
			 		if(data.error)
			        	showAlert(data.msg);
			 		else
			 			$.mobile.changePage( "4-signin.html?num=" + data.num + "&pin=" + data.pin , {}); 
				 break;
			 	case "SingIn":
			 		if(data.error)
			        	showAlert(data.msg);
			 		else
			 			$.mobile.changePage( "account/summary.html?n=" + data.num + "&s=" + data.session , {});  
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
        	showAlert('Erreur de connexion');
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

$(document).on('pageinit',function(){
	$('form').submitform();
});


$("#header").ready(function(){

	var winHeight = $( window ).height();
	var headHeight = $( "#header" ).height();
	var h = parseInt(winHeight - headHeight);
	$("form").height(h-150);
});