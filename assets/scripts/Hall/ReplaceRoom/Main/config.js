cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        
    },

    onLoad: function() {
    },

    init: function () {
    	this.AllGameInfo = {};

		this.OpenedRoomsData = [];
		this.OpenedRecordData = [];
    },

    setOpendedRoomsData: function (data) {
    	this.OpenedRoomsData = data;
    },

    getOpendedRoomsData: function () {
    	return this.OpenedRoomsData;
    },

    removeAOpendedRoomsData: function (index) {
    	this.OpenedRoomsData.splice(index, 1);
    },

    deleteOpendedRoomsData: function () {
    	var length = this.OpenedRoomsData.length;
    	this.OpenedRoomsData.splice(0, length);
    	this.OpenedRoomsData = [];
    },

    setOpenedRecordData: function (data) {
    	this.OpenedRecordData = data;
    },

    getOpenedRecordData: function () {
    	return this.OpenedRecordData;
    },

    deleteOpenedRecordData: function () {
    	var length = this.OpenedRecordData.length;
    	this.OpenedRecordData.splice(0, length);
    	this.OpenedRecordData = [];
    },

    getAllGameInfo: function () {
    	return this.AllGameInfo;
    }

});