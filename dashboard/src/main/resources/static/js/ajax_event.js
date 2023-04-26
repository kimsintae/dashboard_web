let DS_AJAX_GET = function(params,success,complete,beforeSend){
	
	if(params.async== undefined || params.async==null){
		params.async = true;
	}
	if(complete==undefined || complete==null){
		complete = null;
	}
	if(beforeSend==undefined || beforeSend==null){
		beforeSend = null;
	}
	
	$.ajax({
			url: params.url
		   ,headers: { "Content-Type" : "application/json"}
	       , type        : 'GET'
	       , data        : params.data
	       , dataType    : params.dataType
	       , async: params.async
	       , beforeSend: beforeSend
	       , success    : success
	       , complete : complete
	       , error    : function(error,xhr){
	    	   alert("서버 에러가 발생했습니다.")
	       }
	});
};

let DS_AJAX_POST = function(params,success,complete,beforeSend){
	if(params.async==undefined || params.async==null){
		params.async = true;
	}
	if(complete==undefined || complete==null){
		complete = null;
	}
	if(beforeSend==undefined || beforeSend==null){
		beforeSend = null;
	}
	$.ajax({
			 url: params.url
		,headers: { "Content-Type" : "application/json",
					"Accept":"application/json"}
	       , type        : 'POST'
	       , data        : params.data
	       , dataType    : params.dataType
	       , async: params.async
	       , beforeSend: beforeSend
	       , success    : success
	       , complete : complete
	       , error    : function(error,xhr){
	    	   alert("서버 에러가 발생했습니다.")
	       }
	    });
};