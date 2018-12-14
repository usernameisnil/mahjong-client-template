cc.CGameoverActionDataModel = {
	_isInit:false,
    _items:{},
    _noTip:"",
    //初始化加载文档数据
    init:function()
    {
        if(this._isInit)
        {
            cc.error("---------error----------CGameoverActionDataModel has been inited!-----CGameoverActionDataModel:init()");
            return;
        }
        var self = this;
        var filePath="data/GameoverActionData";
        cc.loader.loadRes(filePath,cc.Json, function (err,data)
        {
            if(err)
            {
                cc.error(err);
                return;
            }
            self._items=data;
            self._isInit = true;
        })
        return;
    },
    
    getCNDataByKey: function(key)
    {
        if(!key)
        {
            this._noTip ="the key is none!";
            return "";
        }
        if(!this._items[key])
        {
            this._noTip ="Key Not Found("+key+")";
            return "";
        }
        return this._items[key].cn;
    },

    getHuByKey: function(key)
    {
        if(!key)
        {
            this._noTip ="the key is none!";
            return "";
        }
        if(!this._items[key])
        {
            this._noTip ="Key Not Found("+key+")";
            return "";
        }
        if(!this._items[key].hu)
        {
            this._noTip ="Key Found("+key+"), Hu is None";
            return "";
        }
        return this._items[key].hu;
    },

    getTipStr: function()
    {
        return this._noTip;
    }
}