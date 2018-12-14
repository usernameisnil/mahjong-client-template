cc.CIntegralShopConfigDataModel = {
	_isInit:false,
    _items:{},
    _noTip:"",
    //初始化加载文档数据
    init:function()
    {
        if(this._isInit)
        {
            cc.error("---------error----------CIntegralShopConfigDataModel has been inited!-----CIntegralShopConfigDataModel:init()");
            return;
        }
        var self = this;
        var filePath="data/IntegralShopConfig";
        cc.loader.loadRes(filePath,cc.Json, function (err,data)
        {
            if(err)
            {
                cc.error(err);
                return;
            }
            self._items=data;
            self.setIsInit(true);
        })
        return;
    },

    setIsInit: function (bool) {
        this._isInit = bool;
    },

    getData: function () {
        return this._items;
    },
    
    getPrizeDataByKey: function(key)
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
        return this._items[key];
    },

    getTipStr: function()
    {
        return this._noTip;
    }
}