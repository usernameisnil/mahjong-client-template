function ClubPayBase(){
	this.url='http://crm.ydjoy.com/agency/';
	this.database='zhuoluclub';
}
function md5(str){
	return cc.GMd5(str);
}
ClubPayBase.prototype.get=function(path,data,callback){
	var requestURL=this.makeUrl(path,data);
	console.log("pay",'url',requestURL);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
			console.log('pay','result',path,xhr.responseText);
			var res;
			try{
				res=JSON.parse(xhr.responseText);
			}catch(e){
				return callback(null);
			}
			if(res==null || res.code==null){
				return callback(null);
			}
			return callback(res);
		}
	};
	xhr.ontimeout = xhr.onerror = function(event){
		return callback(null,null);
	};
	xhr.open("GET",requestURL, true);
	xhr.send();
};

ClubPayBase.prototype.makeUrl=function(path,data){
	var str = "?";
	for(var k in data){
		if(str != "?"){
			str += "&";
		}
		str += k + "=" + data[k];
	}
	return this.url+path + encodeURI(str);
}

ClubPayBase.prototype.goodsList=function (callback){
	this.get('zcpaylist',{database:this.database},function(res){
		var list=[];
		var data=res.data;
		if( res==null || res.code!=1 || typeof data!='object'){
			return callback(list);
		}
		for (var key in data) {
			var element = data[key];
			element.type=key;
			list.push(element);	
		}
		callback(list);
	});
};

ClubPayBase.prototype.payUrl=function(uid,type){
	var data={
		gameid:uid,
		type:type,
		database:this.database,
		ordertime:Math.ceil(Date.now()/1000)
	};
	data.sign=this.sign(data);
	return this.makeUrl('zhichong',data);
};

ClubPayBase.prototype.getKey=function(){
    return md5("db_game_"+this.database);
};

ClubPayBase.prototype.sign=function(data,map){
    if(map==null){
        map=['gameid','type','ordertime'];
    }
    var str='';
    for (var i = 0; i < map.length; i++) {
        str+=data[map[i]];
    }
    str+=this.getKey();
	return md5(str);
};

module.exports = ClubPayBase;
