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
        // ...
        

        childViewArray:{
            default: [],
            type: cc.Node
        },

        btnCreate: {
            default: null,
            type: cc.Button
        },
        btnCreateFG: {
            default: null,
            type: cc.Node
        },
        btnJoin: {
            default: null,
            type: cc.Button
        },
        btnJoinFG: {
            default: null,
            type: cc.Node
        },
        joinClubPrefab: {
            default: null,
            type: cc.Prefab
        },
        rbToggleArray: {
            default: [],
            type: cc.Node
        },
        lblGame: {
            default: null,
            type: cc.Label
        },
        lblOnlinePlayer: {
            default: null,
            type: cc.Label
        },
        lblTotalPlayer: {
            default: null,
            type: cc.Label
        },
        lblID: {
            default: null,
            type: cc.Label
        },
        centerScroll: {
            default: null,
            type: cc.ScrollView
        },
        tablePrefab: {
            default: null,
            type: cc.Prefab
        },
        bottomOwner: {
            default: null,
            type: cc.Node
        },
        bottomMember: {
            default: null,
            type: cc.Node
        },
        ownerMemberPrefab: {
            default: null,
            type: cc.Prefab
        },
        memberPrefab: {
            default: null,
            type: cc.Prefab
        },
        recordPrefab: {
            default: null,
            type: cc.Prefab
        },
        gamePlayPrefab: {
            default: null,
            type: cc.Prefab
        },

        createPopup: {
            default: null,
            type: cc.Node
        },
        setupPrefab: {
            default: null,
            type: cc.Prefab
        },
        clubPlay: {
            default: null,
            type: cc.Label
        },
        
        PromptPrefab:{
            default:null,
            type:cc.Prefab,
        },

        clubShopPrefab:{
            default:null,
            type:cc.Prefab,
        },

        invatePrefab: {
            default:null,
            type:cc.Prefab
        },

        lastMonitorClubId:null,

        isMonitorClub:false,

        clearTimeNode:cc.Node,
        btnDefaultPlay:cc.Node,
        clearTimeLable:cc.Label,
        cleatTimeObj : null,
        clearTimeint : null,
        cleatTimeId:null,

        isModifyDefaultWanfa:false,
    },

    // use this for initialization
    onLoad: function () {
        
        cc.vv.clubview = this;

        this.lastMonitorClubId = null;

        this.viewData = {};
        this.joinClubView = null;
        this.toggleId = -1;
        this.isMonitorClub = false;

        this.isModifyDefaultWanfa = false;//是否正在修改默认玩法。
       
        this.GamePlayCountDownInit()//初始默认玩法倒计时

        this.hideClubInvateFriend();

   
    },

   

    start:function(){
        this.showClubView(false);        
    },



    init: function () {
        this.node.getChildByName('clubMask').active = false;
        
        this.isMonitorClub = true;
        this.ShowViewData(0)

        //cc.sys.localStorage.removeItem('cleatTimeObj');
        this.getLocalData();
       
       
    },

    getLocalData:function(){
        var b = cc.sys.localStorage.getItem('cleatTimeObj');
        if (b !== "null" && b !== null){
            this.cleatTimeObj = b.split("///"); 
           
            var tmpArr = []
            for(let t = 0 ;t<this.cleatTimeObj.length;t++){
               // console.log(this.cleatTimeObj)
                if(this.cleatTimeObj[t] === ""){
                    tmpArr.push(0)
                }else{
                    tmpArr.push(JSON.parse(this.cleatTimeObj[t]))
                }               
                
            }         
            this.cleatTimeObj = tmpArr;
        }

        if(this.cleatTimeObj === null || this.cleatTimeObj === ""){
            this.cleatTimeObj = []
        } else {
                 
           // console.log(this.cleatTimeObj)
        }

    },


    // var account =  cc.sys.localStorage.getItem("wx_account");
    // cc.sys.localStorage.setItem("wx_account",ret.account);

    GamePlayCountDownInit:function(){
        var clubFunction = this.node.getChildByName('clubFunction')
        var bottom = clubFunction.getChildByName('bottom');
        var owner = bottom.getChildByName('owner');

        this.btnDefaultPlay = owner.getChildByName('btnDefaultPlay');
        this.clearTimeNode = owner.getChildByName('clearTime');
        this.clearTimeLable = this.clearTimeNode.getChildByName('lable').getComponent(cc.Label);
              
    },

    GamePlayCountDownStep:function(){
        for (let i = 0; i < this.cleatTimeObj.length; i++) {

            if (this.cleatTimeObj[i] !== "") {

                if (typeof (this.cleatTimeObj[i]) == 'object') {
                    this.cleatTimeObj[i].value = this.cleatTimeObj[i].value - 5

                    if (this.cleatTimeObj[i] < 0) {
                        this.cleatTimeObj[i] = 0;
                    }
                }
            }
        }

        let intTmp = this.clearTimeint - 5
        this.clearTimeint = intTmp;
        this.clearTimeLable.string = intTmp;
        this.addTimeStorage();
        if (this.clearTimeint < 5) {
            this.clearTime();
            this.clearTimeNode.active = false;
            this.btnDefaultPlay.getComponent(cc.Button).interactable = true;

        } else{
            this.clearTimeNode.active = true;
            this.btnDefaultPlay.getComponent(cc.Button).interactable = false;
        }
    },

    clearTime: function () {
        if (this.cleatTimeId != null) {
            clearInterval(this.cleatTimeId);
            this.cleatTimeId = null;
        }
    },


    GamePlayCountDownShow:function(){
       
        this.clearTime();

        this.cleatTimeId = setInterval(function () {
            if (this.cleatTimeObj !== null){
                this.GamePlayCountDownStep()
            }
           
        }.bind(this), 5000);
    },
    

    //整理获得数据为可用数据
    clearedData(clubIndex,clubsData,roomsData,clubCfgItems){
     
        var clubsInfo = {};
        var clubInfo = {};

        clubsInfo.localClubIndex = clubIndex;
        clubsInfo.allClubName = [];
        for(let i = 0 ;i<clubsData.list.length;i++){
            
            
            var tmpObj={
                name:clubsData.list[i].clubinfo.name,
                id:clubsData.list[i].clubinfo.clubid.toString(),
                haveApply: false, 
            }

            if(cc.vv.global.clubTempData.clubNotify !== undefined){
                
                var haveApplyList = cc.vv.global.clubTempData.clubNotify.list;
                for(let k=0;k<haveApplyList.length;k++){
                    if(haveApplyList[k].clubid === clubsData.list[i].clubinfo.clubid){
                        tmpObj.haveApply = true;
                    }
                }                
                
            }

            clubsInfo.allClubName.push(tmpObj)
        }

        clubInfo.id = clubsData.list[clubIndex].clubinfo.clubid;
        clubInfo.username = clubsData.list[clubIndex].clubinfo.name;
        clubInfo.cardNum = clubsData.list[clubIndex].gems;
        clubInfo.totalPlayerNum =  roomsData.tongji.totalnum;
        clubInfo.onlinePlayerNum = roomsData.tongji.onlinenum;
        clubInfo.isClubOwner = (clubsData.list[clubIndex].lv === 10 )?true:false;
        clubInfo.clubCfg = clubCfgItems;
        
        if(clubCfgItems.clubAuto !== null){
            var tmpKeys = Object.keys(clubCfgItems.clubAuto);
            clubInfo.defaultConf =  this.getChangeConf( clubCfgItems.clubAuto[tmpKeys[0]].conf);
        }
        
        if (clubCfgItems.clubCommon === null) {
            clubInfo.changeTablePlay = false;
            clubInfo.seeOwnerGems = false;
            clubInfo.tableNum = 6;
        } else {
            var tmpKeys = Object.keys(clubCfgItems.clubCommon);
            clubInfo.changeTablePlay = clubCfgItems.clubCommon[tmpKeys[0]].conf.changeTablePlay;
            clubInfo.seeOwnerGems = clubCfgItems.clubCommon[tmpKeys[0]].conf.seeOwnerGems;
            clubInfo.tableNum = clubCfgItems.clubCommon[tmpKeys[0]].conf.tableNum;
        }
        clubInfo.clublv = clubsData.clublv;

        clubInfo.tableInfo = [];
        for(let t = 0 ;t < roomsData.data.length ;t++){
            var tmpTableInfo = {};
            tmpTableInfo.tableId = t+1;
            tmpTableInfo.uuid = roomsData.data[t].uuid
            tmpTableInfo.roomId = roomsData.data[t].id;
           
            if(roomsData.data[t].conf.nSeats == null || roomsData.data[t].conf.nSeats == undefined){ //老的亲友圈没有nSeats
                roomsData.data[t].conf.nSeats = 4;
            }
           
            tmpTableInfo.conf = roomsData.data[t].conf;
           
            if (roomsData.data[t].status === 1 ){
                roomsData.data[t].num_of_turns = roomsData.data[t].num_of_turns + 1
            }           
            
            tmpTableInfo.conf.localGames = roomsData.data[t].num_of_turns
            
            if (roomsData.data[t].conf.modify!==undefined && roomsData.data[t].conf.modify){
                tmpTableInfo.showLable = "不可再更改";
            }else{
                tmpTableInfo.showLable = "默认玩法";
            }
             
            var tmpPlayerList = [];
            for(let k = 0;k<roomsData.data[t].player_list.length;k++){
                var tmpRoleinfo = {};
                tmpRoleinfo.userid = roomsData.data[t].player_list[k].userid;
                tmpRoleinfo.username = roomsData.data[t].player_list[k].username;
                tmpRoleinfo.index = roomsData.data[t].player_list[k].index;
                tmpRoleinfo.isOnline = roomsData.data[t].player_list[k].online;
                tmpPlayerList.push(tmpRoleinfo)
            } 
               
            tmpTableInfo.rolesInfo = tmpPlayerList; //玩家是否在线          
                        
            clubInfo.tableInfo.push(tmpTableInfo);

        }
        
        clubsInfo.clubInfo = clubInfo;

        this.viewData.clubsInfo = clubsInfo;
        this.viewData.localClubCount = clubsData.list.length;
        
        this.viewData.isAgent = clubsData.isAgency;//是否是代理 
        this.viewData.clublv = clubsData.clublv;//显示选择桌数

        console.log(this.viewData);
        
    
    },

    updateHaveApply: function () {
        var tmpobj = cc.vv.global.clubTempData.clubNotify;

        if (this.viewData !== null) {
           // console.log(this.viewData)
            if (Object.keys(this.viewData).length !== 0) {
                var allclubs = this.viewData.clubsInfo.allClubName;

                var haveApplyList = cc.vv.global.clubTempData.clubNotify.list;
                for (let k = 0; k < haveApplyList.length; k++) {
                    for (let i = 0; i < allclubs.length; i++) {
                        let tmpclubid1 = haveApplyList[k].clubid.toString();
                        let tmpclubid2 = allclubs[i].id;
                        if (allclubs[i].id == haveApplyList[k].clubid.toString()) {
                            allclubs[i].haveApply = true;
                            this.showRBRedPoint(i, true); //红点的单步显示
                        }
                    }

                    if (this.viewData.clubsInfo.clubInfo.id == haveApplyList[k].clubid) {
                        this.showReadPoint(true)
                    }
                }
            }
        }
    },


    changeDefaultConf:function(conf){
        this.viewData.clubsInfo.clubInfo.defaultConf =  this.getChangeConf(conf);
        this.setLocalClubDefaultPlay()
    },    

    
    getChangeConf:function(conf){

      return  cc.CGameConfigDataModel.getChangeConf(conf);

    },

    ShowViewData:function(clubIndex,callback){

        var self = this

        // var tmpObjT = setTimeout(() => {
        //     cc.vv.alert.show('请求数据失败,请稍后重试!')
        //     self.node.getChildByName('clubMask').active = false;
        // }, 5000);

        self.node.getChildByName('clubMask').active = true;

        var clubItems = {}
        var roomItems = {}
        var clubCfgItems = {}

        try {

            //获得展现数据
            cc.vv.userMgr.getMyClub(function (data) {

                if(data.clientErrorCode == -120){
                    console.log('getMyClub clientErrorMgr = ',data.clientErrorMgr)
                    cc.vv.alert.show('网络请求失败，请检查网络后再试！');
                    self.node.getChildByName('clubMask').active = false;
                    if(callback != null && callback != undefined){
                        callback(false)
                    }                   
                    
                    return;
                }
               

                if (data.errcode === 0) {
                    self.clubItems = data

                    if (data.list.length > 0) {
                        self.viewData.childViewIndex = 1;
                    } else {
                        self.viewData.childViewIndex = 0;
                    }

                    if (data.list.length > 0) {
                        
                        if(cc.vv.global.ishallSync){ //是否是同步
                            
                            if (self.lastMonitorClubId != null) {
                                cc.vv.global.ishallSync = false;  
                                for (let index = 0; index < data.list.length; index++) {
                                    const element = data.list[index].clubid;
                                    if (element == self.lastMonitorClubId) {
                                        clubIndex = index;
                                        break;
                                    }                                
                                }
                            }
                        }                     
                                                
                        var tmpclubid = data.list[clubIndex].clubid;

                        //打开第一个亲友圈的socket监听
                        if (self.lastMonitorClubId !== null) {
                            cc.vv.net_hall.send("unmonitor_club", { clubid: self.lastMonitorClubId })
                        } else {
                            cc.vv.net_hall.send("monitor_club", { clubid: tmpclubid })
                        }

                        self.lastMonitorClubId = tmpclubid;
                        //

                        cc.vv.userMgr.getDaiKaiRooms(tmpclubid, function (data) {
                            // console.log(data)

                            if (data.errcode === 0) {
                                                               
                                // //将159 fanpai 改为下标
                                // var keys = Object.keys(data);
                                // for (let index = 0; index < keys.length; index++) {
                                //     const tmpConf = data[keys[index]].conf;

                                //     if (tmpConf.game == 'huaian' ) {
                                        
                                //     }

                                    
                                // }


                                

                                
                                self.roomItems = data;

                                cc.vv.userMgr.getClubGamePlay(tmpclubid, function (ret) {

                                    if (ret.errcode == 0) {

                                        

                                        cc.vv.global._space = 'hallClub';

                                        self.clubCfgItems = ret.cfg;

                                        self.clearedData(clubIndex, self.clubItems, self.roomItems, self.clubCfgItems)

                                        self.showChildView()
                                        self.showClubView(true);

                                        //clearTimeout(tmpObjT);
                                        self.node.getChildByName('clubMask').active = false;

                                        self.hideClubInvateFriend();
                                        
                                        if(callback != null && callback != undefined){
                                            callback(true)
                                        }    

                                    } else {
                                        var content = "获取默认玩法失败!";
                                        cc.vv.alert.show(content);
                                    }

                                }.bind(this));


                            } else {
                                console.log('get_daikai_rooms error')
                            }
                        })

                        if (self.cleatTimeObj !== null) {

                            self.clearTimeint = self.getCleatTimeObjVaule(tmpclubid);
                            if (self.clearTimeint === undefined) {
                                self.clearTimeint = 0;
                            }
                        }

                        if (self.clearTimeint >= 5) {
                            self.GamePlayCountDownShow();
                        }                       

                        self.clearTimeNode.active = self.clearTimeint < 5 ? false : true;
                        self.btnDefaultPlay.getComponent(cc.Button).interactable = !self.clearTimeNode.active;
                        self.clearTimeLable.string = self.clearTimeint;

                    } else {
                                         
                        self.viewData.localClubCount = data.list.length

                        self.viewData.isAgent = self.clubItems.isAgency;//是否是代理   

                        self.showChildView()
                        self.showClubView(true);
                        
                        //clearTimeout(tmpObjT);
                        self.node.getChildByName('clubMask').active = false;
                    }


                } else {
                    console.log('get_my_club get error')
                }
            })

        } catch (error) {
            cc.vv.alert.show('请求数据失败,请稍后重试!')
            self.node.getChildByName('clubMask').active = false;
        }       

    },

    monitorClub:function(){
        var self = this;
       if(this.isMonitorClub){
        setTimeout(() => {
            cc.vv.net_hall.send("monitor_club",{clubid:self.viewData.clubsInfo.clubInfo.id})
        }, 1000);
       }  

    },

    getCleatTimeObjVaule :function(clubid){
        for(let i = 0;i<this.cleatTimeObj.length;i++){
            if(this.cleatTimeObj[i].clubid === clubid){
                return this.cleatTimeObj[i].value;
            }
        }
    },

    upDataGems:function(data){
        if (this.viewData !== null) {
            
            this.viewData.clubsInfo.clubInfo.cardNum = data.gems;
            this.setGameNum(data.gems)
            if (this.viewData.clubsInfo.clubInfo.isClubOwner){
                cc.vv.hall.lblGems.string = data.gems;
            }        
        }
        
    },



    upDataOnlineNum: function (data) {
        
        if (this.viewData !== null) {
            
            if (Object.keys(this.viewData).length !== 0) {
                if (data.num < 1) {

                    data.num = 1
                }   
                
                    
                if(this.viewData.clubsInfo !==null && this.viewData.clubsInfo !==undefined){
                    this.viewData.clubsInfo.clubInfo.onlinePlayerNum = data.num
                    this.setPlayerNum(this.viewData.clubsInfo.clubInfo.onlinePlayerNum, this.viewData.clubsInfo.clubInfo.totalPlayerNum);
                }
            }   
        }

    },

    upDataTotalNum: function (data) {
        
        if (this.viewData !== null) {
            
            if (Object.keys(this.viewData).length !== 0 ) {
                if (data.num < 1) {
                    data.num = 1
                }   
    
                if(this.viewData.clubsInfo !==null && this.viewData.clubsInfo !== undefined){
                    this.viewData.clubsInfo.clubInfo.totalPlayerNum = data.num
                    this.setPlayerNum(this.viewData.clubsInfo.clubInfo.onlinePlayerNum, this.viewData.clubsInfo.clubInfo.totalPlayerNum);
                }
            }   
        }

    },

   
    updataClubViewData: function (data) {
        console.log('updataClub');

        if(this.viewData.clubsInfo == undefined || this.viewData.clubsInfo == null){
            return;
        }

       // console.log(this.viewData);
        var clubsInfo = this.viewData.clubsInfo;
        var tableInfo = clubsInfo.clubInfo.tableInfo;
        var refreshIndex = 0;
      
      
        if (data.action === 'enter') {
            var tmpObj = data.data;
            var newObj = {
                userid:tmpObj.userId.toString(),
                username:tmpObj.name,
                index:tmpObj.index,
                isOnline:true
            }

            
            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    tableInfo[i].rolesInfo.push(newObj)
                    refreshIndex = i
                    break;

                }
            }
           
          //  console.log(this.viewData)
             this.refreshTable(refreshIndex)

        } else if (data.action === 'exit') {
            var tmpObj = data.data;
            var newObj = {
                userid:tmpObj.userId.toString(),               
            }
            
            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    refreshIndex = i
                    for (let k = 0; k < tableInfo[i].rolesInfo.length; k++) {
                        if (tableInfo[i].rolesInfo[k].userid === newObj.userid) {
                            tableInfo[i].rolesInfo.splice(k, 1)
                            break;
                        }
                    }
                }
            }

           // console.log(this.viewData)
            this.refreshTable(refreshIndex)
        } else if(data.action === 'delete'){
                                
            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    tableInfo.splice(i,1)
                    break;
                }             
            }
           // console.log(this.viewData)
            if (this.isModifyDefaultWanfa == false) {
                this.showChildView()
            }           

        }else if(data.action ==='begin'){

            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    tableInfo[i].conf.localGames = data.data.numOfGames;
                    refreshIndex = i
                }
            }
          //  console.log(this.viewData)
            this.refreshTable(refreshIndex)

        }else if(data.action === 'modify'){
            
            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    var conf = data.data;
                    tableInfo[i].conf = conf
                    tableInfo[i].showLable = '不可再更改'
                    refreshIndex = i
                    break;
                }
            }
           // console.log(this.viewData)
            this.refreshTable(refreshIndex)
            
        }else if(data.action === 'online'){
            
            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    refreshIndex = i
                    for (let k = 0; k < tableInfo[i].rolesInfo.length; k++) {
                        if (tableInfo[i].rolesInfo[k].userid === data.data.userId.toString()) {
                            tableInfo[i].rolesInfo[k].isOnline = true;
                            break;
                        }
                    }
                }
            }
           // console.log(this.viewData)
            this.refreshTable(refreshIndex)

        }else if(data.action === 'offline'){
            for (let i = 0; i < tableInfo.length; i++) {
                if (tableInfo[i].roomId === data.roomId) {
                    refreshIndex = i
                    for (let k = 0; k < tableInfo[i].rolesInfo.length; k++) {
                        if (tableInfo[i].rolesInfo[k].userid === data.data.userId.toString()) {
                            tableInfo[i].rolesInfo[k].isOnline = false;
                            break;
                        }
                    }
                }
            }
           // console.log(this.viewData)
            this.refreshTable(refreshIndex)
        }else if(data.action === 'create'){
            
            var objtmp={
                changeTablePlay:this.viewData.clubsInfo.clubInfo.changeTablePlay,
                conf:data.data,
                isClubOwner:this.viewData.clubsInfo.clubInfo.isClubOwner,
                roomId:data.roomId,
                showLable:'默认玩法',
                tableId:0,
                uuid:data.uuid,
                rolesInfo:[],
            }

            tableInfo.push(objtmp);
               
           // console.log(this.viewData)

           
            if (this.isModifyDefaultWanfa == false) {
                this.TableSort();

                this.setCenter();
            }          
        }
        
    },

    TableSort:function(){
        var tableDatas = this.viewData.clubsInfo.clubInfo.tableInfo;
        var tmpArr = []
        for(let i = 0;i<tableDatas.length;i++){
            tmpArr.push(parseInt( tableDatas[i].uuid))
        }
       // console.log(tmpArr);
        
        var compare = function (x, y) {//比较函数
            if (x < y) {
                return -1;
            } else if (x > y) {
                return 1;
            } else {
                return 0;
            }
        }
        
        tmpArr.sort(compare);
       // console.log(tmpArr);

        for(let i = 0;i<tmpArr.length;i++){
            for(let k = 0;k<tableDatas.length;k++){
                if(tableDatas[k].uuid == tmpArr[i]){
                    tableDatas[k].tableId = i+1;
                }
            }
        }

       // console.log(tableDatas);
    },

    changeTableData:function(obj){
        var tableDatas = this.viewData.clubsInfo.clubInfo.tableInfo;
        for(let i = 0;i<tableDatas.length;i++){
            if (obj.roomid===tableDatas[i].roomId){
                tableDatas[i].conf
            }
        }
    },

    refreshTableAll:function(){
       
        var clubsInfo = this.viewData.clubsInfo;
        var tableInfo = clubsInfo.clubInfo.tableInfo;
        for (let i = 0; i < tableInfo.length; i++) {
            this.refreshTable(i)
        }
         
    },

    refreshTable:function(tableIndex){
       
        
        if (tableIndex <= 2) {
            var NewNodelen = 0;
            var tableViewlen = tableIndex;
        } else {
            var NewNodelen = Math.ceil(tableIndex/ 3)-1;
            var tableViewlen = tableIndex % 3;

            if (tableViewlen === 0) {
                NewNodelen = parseInt(tableIndex / 3);
                tableViewlen = 0;
            }
        }           
        
        var clubFunction = this.node.getChildByName('clubFunction')
        var center = clubFunction.getChildByName('center');
        var tableScrollView = center.getChildByName('tableScrollView');
        var view = tableScrollView.getChildByName('view');
        var content = view.getChildByName('content');
        var NewNode = content.children[NewNodelen]; //第几行的节点
        var tableView = NewNode.children[tableViewlen] //第几行的第几个       
        var TVscript = tableView.getComponent('ClubTableView');
        if (TVscript) {
            var tableData = this.viewData.clubsInfo.clubInfo.tableInfo[tableIndex];
           
            TVscript.init(tableData);
        }        

    },
 

    showClubView: function (isShow) {
        this.node.active = isShow;
    },

    showChildView: function () {
        var showIndex = this.viewData.childViewIndex;

        this.showClubChildView(showIndex);

        var childCount = this.childViewArray.length;
        for (var i = 0; i < childCount; i++) {

            var boolShow = (i == showIndex)?true:false;
            this.childViewArray[i].active = boolShow;
        };
    },

    showClubChildView: function (showIndex) {

        if (showIndex == 0) {

            if (this.viewData.localClubCount >= 5) {
                this.setCreateAndJoinClubBtnState(false);
            }else {
                this.setCreateAndJoinClubBtnState(true);
            }

            if (this.viewData.isAgent == true) {
                this.showCreateAndJoinClubBtn(true);
            }else {
                this.showCreateAndJoinClubBtn(false);
            }

            this.showCreatePopup(false);

        }else if (showIndex == 1) {

            this.showRBClubs();

            this.showOwnerGems();
            this.showOwnerOrMember();
            this.setGameNum(this.viewData.clubsInfo.clubInfo.cardNum);
            this.setPlayerNum(this.viewData.clubsInfo.clubInfo.onlinePlayerNum, this.viewData.clubsInfo.clubInfo.totalPlayerNum);
            this.setClubID(this.viewData.clubsInfo.clubInfo.id);
            this.showReadPoint(this.viewData.clubsInfo.allClubName[this.toggleId].haveApply);

            this.setLocalClubDefaultPlay();
            this.setCenter();
        }
    },

    setCreateAndJoinClubBtnState: function (state) {
        this.btnCreate.interactable = state;

        this.btnJoin.interactable = state;
    },

    showCreateAndJoinClubBtn: function (isShow) {
        this.btnCreate.node.active = isShow;
        this.btnCreateFG.active = isShow;

        if (isShow == false) {
            this.btnJoin.node.x = 0;
            this.btnJoinFG.x = 0;
        }else {
            this.btnCreate.node.x = -280;
            this.btnCreateFG.x = -280;
            this.btnJoin.node.x = 280;
            this.btnJoinFG.x = 280;
        }
    },

    onCreateClubClicked: function () {
        cc.log("wujun ---- createClub -------");

        this.showCreatePopup(true);

        

        // cc.vv.userMgr.enterClub(function(ret) {

        //     if (ret.errcode == 0) {

        //         // this.initClubData(ret.clubData);
        //         this.initClubData(null);

        //         this.viewData.childViewIndex = 1;
        //         this.showChildView();

        //     }else {
        //         var content = "进入亲友圈失败!";
        //         cc.vv.alert.show(content);
        //     }

        // }.bind(this));
    },

    onJoinClubClicked: function () {
        cc.log("wujun ---- joinClub -------");

        if (this.joinClubView == null) {
            this.joinClubView = cc.instantiate(this.joinClubPrefab);
            this.node.addChild(this.joinClubView);
        }
        cc.vv.utils.showDialog(this.joinClubView, 'panel', true);
    },


    hallShowRedPoint:function(){
        
        console.log(this.viewData.clubsInfo)
        if(this.viewData.clubsInfo ==undefined || this.viewData.clubsInfo ==null){
            return;
        }
        var isShow = false;

        for(let i in this.viewData.clubsInfo.allClubName){
           if(this.viewData.clubsInfo.allClubName[i].haveApply){
              isShow =true;
              break;
           } 
        }
        cc.vv.hall.showRedPoint(isShow);       

    },

    onCloseClubClicked: function () {
        this.showClubView(false);
       cc.vv.global._space = 'hall';
        cc.log("wujun ---- closeClub -------");
        
        //关闭亲友圈，检测红点。
        this.hallShowRedPoint();


        if (cc.vv.global.clubTempData.clubNotify !== undefined) {
            var haveApplyList = cc.vv.global.clubTempData.clubNotify.list;
            if(haveApplyList.length ===0){
               // cc.vv.hall.showRedPoint(false);
            }else{
                //cc.vv.hall.showRedPoint(true);
            }           
           
        } else{
            //cc.vv.hall.showRedPoint(false);
        }
   
        this.isMonitorClub = false;
        if(this.viewData.clubsInfo !== undefined){
            cc.vv.net_hall.send("unmonitor_club",{clubid:this.viewData.clubsInfo.clubInfo.id})
        }   
        
    //     var tmpstr = [];
    //    // console.log(this.cleatTimeObj);
    //     for (var i = 0; i < this.cleatTimeObj.length; i++) {
    //         if (typeof(this.cleatTimeObj) === 'object') {
    //             tmpstr.push(JSON.stringify(this.cleatTimeObj[i]))
    //         } else {
    //             tmpstr.push(this.cleatTimeObj[i])
    //         }

    //     } 

    //     var tmpstraa = tmpstr.join('///')
    //    // console.log(tmpstraa)
        

    //     cc.sys.localStorage.setItem('cleatTimeObj',tmpstraa);
    },


    addTimeStorage: function () {
        var tmpstr = [];
        // console.log(this.cleatTimeObj);

        if (this.cleatTimeObj == null) {
            return;
        }

        for (var i = 0; i < this.cleatTimeObj.length; i++) {
            if (typeof (this.cleatTimeObj) === 'object') {
                tmpstr.push(JSON.stringify(this.cleatTimeObj[i]))
            } else {
                tmpstr.push(this.cleatTimeObj[i])
            }

        }

        var tmpstraa = tmpstr.join('///')
        // console.log(tmpstraa)


        cc.sys.localStorage.setItem('cleatTimeObj', tmpstraa);
    },

    setCleatTimeObj:function(){
        
        var tmpObj={
            clubid : this.viewData.clubsInfo.clubInfo.id,
            value : 100
        }

        var isPush = true;

        for (var i = 0 ; i< this.cleatTimeObj.length;i++ ){
            if (this.cleatTimeObj[i].clubid === tmpObj.clubid){
                this.cleatTimeObj[i].value = tmpObj.value;
                isPush = false;
                break;

            }           
        }

        if(isPush){
            this.cleatTimeObj.push(tmpObj);
        }  
        
        this.clearTimeNode.active = true;
        this.btnDefaultPlay.getComponent(cc.Button).interactable = false;
        this.clearTimeLable.string = '100';
        this.clearTimeint = 100;
        this.GamePlayCountDownShow();
      
    },

    showCreatePopup: function (isShow) {
        this.createPopup.active = isShow;
    },

    onSureCreateClicked: function (event) {

        this.showCreatePopup(false); 

        var editCN = this.createPopup.getChildByName("editClubName").getComponent("cc.EditBox");
        if (editCN.string != "") {
            //发送创建亲友圈请求
            var content = "正在创建，请稍侯.....!";
            cc.vv.alert.show(content);
           // console.log(event);
            event.target.getComponent(cc.Button).interactable = false;    

            var clubName = editCN.string;
           
            cc.vv.userMgr.createClub(clubName,function(ret) {
               
                if(ret.clientErrorCode == -120){
                    event.target.getComponent(cc.Button).interactable = true;  
                    this.showCreatePopup(false); 
                    return;
                }                

                if (ret.errcode === 0) {
                    cc.vv.alert.close();
                    this.init()    
                    event.target.getComponent(cc.Button).interactable = true;                 

                }else {
                    cc.vv.alert.show(ret.errmsg, null, false);
                   
                }

            }.bind(this));

        }else {
            var content = "亲友圈名称不能为空!";
            cc.vv.alert.show(content);
        }
        editCN.string = "";

        
    },

    onCancalPopupClicked: function () {
        this.showCreatePopup(false);
    },

    //亲友圈中
    
    initClubData: function (data) {

        var clubCount = createInfo.allClubName.length;
        for (var i = 0; i < clubCount; i++) {
            var clubId = createInfo.allClubName[i].id;
            if (clubId == createInfo.clubInfo.id) {
                this.viewData.clubsInfo.localClubIndex = i;
            }
        };

        this.viewData.localClubCount = clubCount;
        this.viewData.clubsInfo.allClubName = createInfo.allClubName;
        this.viewData.clubsInfo.clubInfo = createInfo.clubInfo;
    },

    //---------top
    
    showRBClubs: function () { 
        this.toggleId = this.viewData.clubsInfo.localClubIndex;
        var script = this.rbToggleArray[this.toggleId].getComponent("RadioButton");
        cc.vv.radiogroupmgr.check(script);

        var clubUICount = this.rbToggleArray.length;
        for (var i = 0; i < clubUICount; i++) {

            var isShowClub = (i < this.viewData.localClubCount)?true:false;

            if (isShowClub == true) {
                var lblName = this.rbToggleArray[i].getChildByName("button").getChildByName("Label").getComponent("cc.Label");
                lblName.string = this.viewData.clubsInfo.allClubName[i].name;

                this.showRBRedPoint(i, this.viewData.clubsInfo.allClubName[i].haveApply); //红点的单步显示
            }

            this.rbToggleArray[i].active = isShowClub;
            
        };
    },

    showRBRedPoint: function (index, isShow) {
        var redPoint = this.rbToggleArray[index].getChildByName("redPoint");
        redPoint.active = isShow;
    },

    onClubRBClicked: function (event, customEventData) {
                   
        
        if (this.toggleId == customEventData) {
            return;
        }        

        var self = this;
        this.ShowViewData(customEventData,function(ret){
            if(ret){
                self.toggleId = customEventData;
                var script = self.rbToggleArray[customEventData].getComponent("RadioButton");
                cc.vv.radiogroupmgr.check(script);
            }

        }) //请求新的房间数据 
    },

    onBackCreateViewClicked: function () {
        
        this.viewData.childViewIndex = 0;
        this.showChildView();
    },

    //--------bottom
    
    showOwnerOrMember: function () {
        var isClubOwner = this.viewData.clubsInfo.clubInfo.isClubOwner;
        this.bottomOwner.active = isClubOwner;
        this.bottomMember.active = !isClubOwner;
    },
    
    //common
    
    showOwnerGems: function () { //是否显示亲友圈主的元宝
        var commonBottom = this.childViewArray[1].getChildByName("bottom").getChildByName("common");
        var bgGems = commonBottom.getChildByName("bgGems");
        var lblGems = commonBottom.getChildByName("lblGems");
        var countInfo = commonBottom.getChildByName("countInfo");
        var IDInfo = commonBottom.getChildByName("IDInfo");


        var isClubOwner = this.viewData.clubsInfo.clubInfo.isClubOwner;
        var seeGems = this.viewData.clubsInfo.clubInfo.seeOwnerGems
        if (isClubOwner == false && seeGems == false) {

            bgGems.active = false;
            lblGems.active = false;

            // countInfo.x = bgGems.x;
            // IDInfo.x = bgGems.x;
            countInfo.x = bgGems.x + 200;
            IDInfo.x = bgGems.x + 200;

        }else {

            bgGems.active = true;
            lblGems.active = true;

            countInfo.x = bgGems.x + 200;
            IDInfo.x = bgGems.x + 200;
        }
    },

    setGameNum: function (number) {
        this.lblGame.string = number.toString();
    },

    setPlayerNum: function (onlineNum, totalNum) {

        if (onlineNum > totalNum){
            onlineNum = totalNum
        }

        var onlinePlayerString = onlineNum.toString();
        this.lblOnlinePlayer.string = onlinePlayerString;

        var onlineX = this.lblOnlinePlayer.node.x;
        var onlineWidth = this.lblOnlinePlayer.node.width;

        var totalPlayerString = "/" + totalNum.toString();
        this.lblTotalPlayer.string = totalPlayerString;

        this.lblTotalPlayer.node.x = onlineX + onlineWidth;
    },


    setClubID: function (id) {
        this.lblID.string = id;
    },

    //owner

    showReadPoint: function (isShow) {

        
        var ownerBottom = this.childViewArray[1].getChildByName("bottom").getChildByName("owner");
        var redPoint = ownerBottom.getChildByName("btnNewFriend").getChildByName("applyRedPoint");

        redPoint.active = isShow;
    },

    onAddGemsClicked: function () {

        console.log('会员购买')
        cc.vv.audioMgr.playButtonClicked();

        cc.vv.alert.show('请联系微信客服！');

        //this.showClubShop();
        
    },

    onClubExplainClicked: function () {
        
    },

    onNewFriendClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

     
        if(cc.vv.global.clubTempData.clubNotify !== undefined){
                
            var haveApplyList = cc.vv.global.clubTempData.clubNotify.list;
            for(let k=0;k<haveApplyList.length;k++){
                if(haveApplyList[k].clubid === this.viewData.clubsInfo.clubInfo.id){
                    haveApplyList.splice(k,1)
                }
            }           
        }

        this.viewData.clubsInfo.allClubName[this.toggleId].haveApply = false;
        
        this.showReadPoint(this.viewData.clubsInfo.allClubName[this.toggleId].haveApply);
        this.showRBRedPoint(this.toggleId, this.viewData.clubsInfo.allClubName[this.toggleId].haveApply)

        var memberListView = cc.instantiate(this.ownerMemberPrefab);
        this.node.addChild(memberListView);
    },

    onRecordClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        
        this.requestRecordList()
    },

    onDefaultPlayClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        this.requestGamePlay();
    },

    onSetUpClicked: function () {
        var isClubOwner = this.viewData.clubsInfo.clubInfo.isClubOwner;
        if (isClubOwner == false) {
            return;
        }

       // var tmpObj = this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon;
      
       var tmpObj = this.viewData.clubsInfo.clubInfo;
     
        var SetupDataObj = {};
        if (tmpObj === null){
            
            SetupDataObj.conf = {};
            SetupDataObj.conf.changeTablePlay = false;
            SetupDataObj.conf.seeOwnerGems = false; 
            SetupDataObj.conf.tableNum = 6; 
            SetupDataObj.conf.clublv = 1;        

        }else{

            SetupDataObj.conf = {};
            SetupDataObj.conf.changeTablePlay =tmpObj.changeTablePlay;
            SetupDataObj.conf.seeOwnerGems = tmpObj.seeOwnerGems;
            SetupDataObj.conf.tableNum = tmpObj.tableNum;
            SetupDataObj.conf.clublv = tmpObj.clublv;
           
        }       
         

        var setupData = {};
        if(SetupDataObj !== undefined){
            setupData = {
                //this.viewData.clubsInfo.clubInfo.changeTablePlay,changeTablePlay
                //seeOwnerGems: this.viewData.clubsInfo.clubInfo.seeOwnerGems,
                changeTablePlay:SetupDataObj.conf.changeTablePlay,
                seeOwnerGems:SetupDataObj.conf.seeOwnerGems,
                clublv:SetupDataObj.conf.clublv,
                tableNum:SetupDataObj.conf.tableNum,

                ownerClubs: {
                    ownerUserId: cc.vv.userMgr.userId,
                    allClubName: this.viewData.clubsInfo.allClubName
                }
            };         
        }       

        var setupView = cc.instantiate(this.setupPrefab);
        var SScript = setupView.getComponent("ClubSetup");
        if (SScript) {
            SScript.init(setupData);
        }
        this.node.addChild(setupView);
    },



    requestGamePlay: function () {
        
        
        
        cc.vv.hall.gameIndex = 0;
        
        var clubId = this.viewData.clubsInfo.clubInfo.id;
        var clubName = this.viewData.clubsInfo.clubInfo.username;
        
        var clubCfg = this.viewData.clubsInfo.clubInfo.clubCfg;
     
        if(clubCfg !==undefined){
            var gamePlayData = {};
           // console.log(clubCfg.clubAuto)
            if (clubCfg.clubAuto === null || clubCfg.clubAuto === undefined){
                gamePlayData = {
                    clubId: clubId,
                    clubName: clubName,
                };
            }else{
    
                var allKeys = Object.keys(clubCfg.clubAuto);
                gamePlayData = clubCfg.clubAuto[allKeys[0]].conf
                gamePlayData.clubId = clubId
                gamePlayData.clubName = clubName
            }                
    
            // var playView = cc.instantiate(this.gamePlayPrefab);
            // var PScript = playView.getComponent("CreateRoom");
            // if (PScript) {
            //     PScript.init(gamePlayData);
            // }
            // this.node.addChild(playView);
            cc.vv.hall.loadCreateLayer(gamePlayData);
        }              
        
        // cc.vv.userMgr.getClubGamePlay(clubId, function(ret) {

        //     if (ret.errcode == 0) {

        //         var clubCfg = ret.cfg;
        //         var gamePlayData = {};
        //         console.log(clubCfg.clubAuto)
        //         if (clubCfg.clubAuto === null || clubCfg.clubAuto === undefined){
        //             gamePlayData = {
        //                 opType: 1,
        //                 nSeats: 4,
        //                 maxGames: 8,
        //                 reset_count: 1,
        //                 zha: true,
        //                 fangzuobi: true,
        //                 clubId: clubId,
        //                 clubName: clubName,
        //             };
        //         }else{

        //             var allKeys = Object.keys(clubCfg.clubAuto);
        //             gamePlayData = clubCfg.clubAuto[allKeys[0]].conf
        //             gamePlayData.clubId = clubId
        //             gamePlayData.clubName = clubName                    
        //         }                

        //         var playView = cc.instantiate(this.gamePlayPrefab);
        //         var PScript = playView.getComponent("CreateRoom");
        //         if (PScript) {
        //             PScript.init(gamePlayData);
        //         }
        //         this.node.addChild(playView);
                
        //     }else {
        //         var content = "获取默认玩法失败!";
        //         cc.vv.alert.show(content);
        //     }

        // }.bind(this));
    },

    requestRecordList: function () {

        var clubId = this.viewData.clubsInfo.clubInfo.id;
        cc.vv.userMgr.getClubRecordList(clubId, function(ret) {

            if (ret.errcode == 0) {

                var recordData = ret.data;
              

                this.setRecordDataSort(recordData);

                var recordView = cc.instantiate(this.recordPrefab);
                var RVScript = recordView.getComponent("ClubRecord");
                if (RVScript) {
                    RVScript.init(recordData);
                }
                this.node.addChild(recordView);
                

            }else {
                var content = "获取历史战绩失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    setRecordDataSort: function (data) {
        //排序规则：按照时间逆序排序

        var dataLength = data.length;
        for (var j = 0; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].create_time > data[j].create_time) {
                    var dataTest2 = this.getBeReplacedData(data[j]);
                    data[j] = this.getBeReplacedData(data[k]);
                    data[k] = this.getBeReplacedData(dataTest2);
                }
            };
        };
    },

    getBeReplacedData: function (dataJ) {
        var dataReplace = [];
        for (var key in dataJ) {
            dataReplace[key] = dataJ[key];
        }

        return dataReplace;
    },

    //member
    onMemberListClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        var memberListView = cc.instantiate(this.memberPrefab);
        this.node.addChild(memberListView);
    },

    onFastJoinClicked: function (event) {
        console.log('快速加入')
        event.target.getComponent(cc.Button).interactable = false;
        this.node.getChildByName('clubMask').active = true;

        var tableInfos = this.viewData.clubsInfo.clubInfo.tableInfo;
        var tmpLen = 0;
        var joinI = -1;
        for(let i = 0 ;i<tableInfos.length;i++){
            var nSeats = tableInfos[i].conf.nSeats;
            var curSeats = tableInfos[i].rolesInfo.length;

            var nn = curSeats / nSeats;
     
            
            if(nn<1 && nn>tmpLen){
                tmpLen = nn;
                joinI = i;
            };
        }

        if(joinI > -1){

        }else{
            for(let i = 0 ;i<tableInfos.length;i++){
          
                var curSeats = tableInfos[i].rolesInfo.length;
                if(curSeats === 0){
                    joinI = i;
                    break;
                }    
            }
        }

        if(joinI > -1){
           
            // var tmpObj = setTimeout(() => {
            //     event.target.getComponent(cc.Button).interactable = true;
            //     self.node.getChildByName('clubMask').active = false;
            //     cc.vv.alert.show('网络不好，请再次点击！')
    
            // }, 10000);

            var self = this;
            cc.vv.userMgr.enterRoom(tableInfos[joinI].roomId,function(ret){
                // clearTimeout(tmpObj) ;
                if(ret.errcode !== 0  || ret.clientErrorCode == -120){
                    event.target.getComponent(cc.Button).interactable = true;
                    self.node.getChildByName('clubMask').active = false;
                    
                }
            })

        }else{
            cc.vv.alert.show('未找到合适房间')
        }
        
    },

    //--------center


    changeCfg:function(data){
     
        this.viewData.clubsInfo.clubInfo.changeTablePlay = data.conf.changeTablePlay;
        this.viewData.clubsInfo.clubInfo.seeOwnerGems = data.conf.seeOwnerGems;
        if (this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon === null) {
           
            this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon ={};

            if(this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon[data.clubid]  !== undefined){
                this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon[data.clubid].conf = data.conf;
            } 
        }

        this.setCenter();
        this.showOwnerGems();
    },


    // changeCfg:function(data){
    //     this.viewData.clubsInfo.clubInfo.changeTablePlay = data.conf.changeTablePlay;
    //     this.viewData.clubsInfo.clubInfo.seeOwnerGems = data.conf.seeOwnerGems;
    //     if (this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon !== null) {
    //         this.viewData.clubsInfo.clubInfo.clubCfg.clubCommon[data.clubid].conf = data.conf;
    //     }
    //     this.setCenter();
    //     this.showOwnerGems();
    // },


    
    setLocalClubDefaultPlay: function () { //当前亲友圈默认玩法

        if (this.viewData.clubsInfo.clubInfo.defaultConf !== undefined) {
            // var playString = cc.vv.mjgameNetMgr.getWanfa(this.viewData.clubsInfo.clubInfo.defaultConf);
            var playString = cc.CGameConfigDataModel.getWanfa(this.viewData.clubsInfo.clubInfo.defaultConf);
            this.clubPlay.string = "当前亲友圈默认玩法：" + playString;
        } else{
            this.clubPlay.string = "当前亲友圈默认玩法：";
        }


    },

    setCenter: function () {
        
        var tableCount = this.viewData.clubsInfo.clubInfo.tableInfo.length;

        var content_height = 0;

        var content = this.centerScroll.content;
        content.removeAllChildren();

        var itemCount = Math.ceil(tableCount / 3);
        for (var i = 0; i < itemCount; i++) {

            var tableItem = cc.vv.utils.createNode(null);
            tableItem.width = content.width;
            
            var itemTableCount = 3;
            var restTableCount = tableCount - i * 3;
            if (restTableCount < 3) {
                itemTableCount = restTableCount;
            }
            
            for (var j = 0; j < itemTableCount; j++) {
                var tableView = cc.instantiate(this.tablePrefab);
                var TVscript = tableView.getComponent('ClubTableView');
                if (TVscript) {
                    var index = i * 3 + j;
                    var tableData = this.viewData.clubsInfo.clubInfo.tableInfo[index];
                    tableData.isClubOwner = this.viewData.clubsInfo.clubInfo.isClubOwner; 
                    tableData.changeTablePlay = this.viewData.clubsInfo.clubInfo.changeTablePlay; 
                    TVscript.init(tableData);
                }

                var tableWidth = tableView.width, tableHeight = tableView.height;

                tableView.x = (tableWidth+10) * (j - 1);
                tableView.y = 0;

                if (j == 0) {
                    tableItem.height = tableHeight;
                }
                tableItem.addChild(tableView);
            };

            tableItem.x = 0;
            tableItem.y = -(i + 0.5) * tableItem.height;

            content_height = content_height + tableItem.height;
            content.height = content_height;

            content.addChild(tableItem);
        };
    },

    showClubPrompt:function(data) {
        var clubPrompt = cc.instantiate(this.PromptPrefab);
        
        cc.vv.hall.layerRoot.addChild(clubPrompt);
        var TVscript = clubPrompt.getComponent('ClubPrompt');
        if (TVscript) {

            // var conf = {
            //     opType: 3,
            //     nSeats: 6,
            //     maxGames: 8,
            //     reset_count: 1,
            //     zha: true,
            //     fangzuobi: true,
            // }
            
            var objtmp = {
                invateName:data.name,
                invateUserId:data.userid,
                clubName:data.clubname,
                tableId:6,
                roomid:data.roomid,
                conf:data.conf,                
            }
            // var data = {
            //     invateUserId: 100011,
            //     invateName: "色郭德纲",
            //     clubName: "第三个公司",
            //     tableId: 12,
            //     conf: {
            //         opType: 3,
            //         nSeats: 6,
            //         maxGames: 8,
            //         reset_count: 1,
            //         zha: true,
            //         fangzuobi: true,
            //     }
            // }

            TVscript.init(objtmp);
        }

    }, 
    
    showClubShop:function(data){

        var ClubShop = cc.instantiate(this.clubShopPrefab);
        
        this.node.addChild(ClubShop);
        var TVscript = ClubShop.getComponent('ClubShop');
        if (TVscript) {
                      
            // var objtmp = {
            //     invateName:data.name,
            //     invateUserId:data.userid,
            //     clubName:data.clubname,
            //     tableId:6,
            //     roomid:data.roomid,
            //     conf:data.conf,                
            // }
         

           // TVscript.init(objtmp);
           TVscript.init();
        }

    },

    showClubInvateFriend: function (roomId) {

        this.ClubInvateRoomId = roomId;
        var invateFriend = cc.find("InvatClubFriend", this.node);
        var invateView = cc.instantiate(this.invatePrefab);
        invateFriend.addChild(invateView);
    },

    hideClubInvateFriend: function (roomId) {

        this.ClubInvateRoomId = roomId;
        var invateFriend = cc.find("InvatClubFriend", this.node);
        if (invateFriend) {
            invateFriend.removeAllChildren(true);  
        }      
    },

    hallClubSync:function () {

        this.ShowViewData(0);//同步时，函数里会判断是否还在俱乐部，进行相应显示
    },

    onDestroy:function(){
        console.log('clubView destroy')
        this.addTimeStorage();
        
    }

});
