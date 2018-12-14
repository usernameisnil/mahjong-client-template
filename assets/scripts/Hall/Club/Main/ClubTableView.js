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

        imgTables:{
            default:[],
            type:[cc.Node]
        },
        
        lblTableID: {
            default: null,
            type: cc.Label
        },
        lblGameNum: {
            default: null,
            type: cc.Label
        },
        tableTitle: {
            default: null,
            type: cc.Node
        },
        lblTablePlay: {
            default: null,
            type: cc.Label
        },
        active_jr:{
            default:null,
            type:cc.Node
        },
        active_ykj:{
            default:null,
            type:cc.Node
        },
        active_mz:{
            default:null,
            type:cc.Node
        },

    },

    // use this for initialization
    onLoad: function () {
      
    },

    init: function (tableInfo) {

        this.tableInfo = tableInfo;

        this.setBtnsAttribute();             
        this.setTableID();
        this.setGameNumber();
             
        this.setTableTitle(tableInfo.showLable);
        
        this.setTableRoles();
        
    },

    setTableID: function () {
        if (this.tableInfo.tableId != null && this.tableInfo.tableId > 0) {
            this.lblTableID.string = this.tableInfo.tableId.toString();
        }else {
            this.lblTableID.string = "";
        }
    },

    setTableActive_jr:function(){
       this.active_jr.active = true
       this.active_ykj.active = false
       this.active_mz.active = false
    },
    setTableActive_ykj:function(){
        this.active_jr.active = false
        this.active_ykj.active = true
        this.active_mz.active = false
     },
     setTableActive_mz:function(){
        this.active_jr.active = false
        this.active_ykj.active = false
        this.active_mz.active = true
     },

    setGameNumber: function () {

        //console.log(this.tableInfo)

        if (this.tableInfo.conf == null || this.tableInfo.conf.localGames == null) {
            this.lblGameNum.string = "";
            return;
        }

        if (this.tableInfo.conf.localGames <= 0) {
            this.lblGameNum.string = "";
            //满座状态
            var MaxRoles = this.tableInfo.conf.nSeats;
            var CurRoles = this.tableInfo.rolesInfo.length;
            if(MaxRoles === CurRoles){
                this.setTableActive_mz();//桌子显示满座
                this.setTableNoClick(false);//桌子不可点击
                this.setDissolveButton(false);//解散按钮不可点击
                this.setInvateButton(false);//邀请按钮不可点击
                cc.vv.clubview.hideClubInvateFriend();//邀请界面消失
            }else{
                this.setTableActive_jr();//桌子显示加入
                this.setTableNoClick(true);//桌子可点击
                this.setDissolveButton(true);//解散按钮可点击
                this.setInvateButton(true);//邀请按钮可点击
            }

        }else {

            this.setTableNoClick(false);//桌子不可点击
            this.setDissolveButton(false);//解散按钮不可点击
            cc.vv.clubview.hideClubInvateFriend();//邀请界面消失
            this.setInvateButton(false);//邀请按钮不可点击
            this.setTableActive_ykj();//桌子显示以开局
            var numberString = this.tableInfo.conf.localGames.toString() + " / " + this.tableInfo.conf.maxGames.toString();
            if (this.tableInfo.conf.quan == true) {
                numberString = numberString + "圈";
            }else {
                numberString = numberString + "局";
            }

            this.lblGameNum.string = numberString;
        }
    },

    setTableNoClick:function(tag){
        this.node.getChildByName('table').getComponent(cc.Button).interactable = tag;
    },

    setDissolveButton:function(tag){
        this.node.getChildByName('btnDissolve').getComponent(cc.Button).interactable = tag;   
    },

    setInvateButton:function(tag){

        var tmpNode = this.node.getChildByName('btnInvitation');

        if (this.tableInfo.isClubOwner == true) {

            tmpNode.active = tag;
        } else {

            tmpNode.active = false;
        } 
    },


    setTableTitle: function (playString) {

        // if (this.tableInfo.conf == null || this.tableInfo.conf.opType == null) {
        //     this.tableTitle.active = false;
        //     return;
        // }

        var lblTableTitle = this.tableTitle.getChildByName("bgTableTitle").getComponent("cc.Label");
        // var titleString = this.getTableType(this.tableInfo.conf.opType);
        lblTableTitle.string = playString;
       
        var widthCount = lblTableTitle.node.width;
        var limitWidth = 125, limitHeight = 90;

        var roleCount = this.tableInfo.conf.nSeats;

        if (roleCount > 5) {

            this.tableTitle.x = -210;
            this.tableTitle.width = 100;
            
            limitWidth = 75;
            lblTableTitle.node.x = 50;

        }

        var wrapCount = Math.ceil(widthCount / limitWidth) - 1;
        if (wrapCount > 3) {
            wrapCount = 3;
        }
               
        this.tableTitle.height += (wrapCount * 30 );
       
        this.setLabelProperties(lblTableTitle, limitWidth, limitHeight, true);

    },

    setLabelProperties: function (label, limitWidth, limitHeight, isWrap) {
        
        if (label) {
            
            var widthCount = label.node.width;
            if (widthCount > limitWidth) {
                label.overflow = 1;
                label.horizontalAlign = 0;
                label.enableWrapText = isWrap;
                if (isWrap == true) {
                    label.node.height = limitHeight;
                }
                label.node.width = limitWidth;
            }
            
        }
    },

    setTableNum:function(number){
        console.log(this.imgTables)

        this.imgTables[0].active = false;
                this.imgTables[1].active = false;
                this.imgTables[2].active = false;

        switch (number) {
            case 2:
                this.imgTables[0].active = true;
                this.imgTables[1].active = false;
                this.imgTables[2].active = false;
                break;
            case 3:
                this.imgTables[0].active = false;
                this.imgTables[1].active = true;
                this.imgTables[2].active = false;
                break;
            case 4:
                this.imgTables[0].active = false;
                this.imgTables[1].active = false;
                this.imgTables[2].active = true;
                break;
            case 5:
                // signX = [-(15/26),(15/26),1, 0,-1];
                // signY = [-1,-1,0,1,0];
                break;
            case 6:
                // signX = [-(15/26),(15/26),1, (15/26),-(15/26),-1];
                // signY = [-1,-1,0,1,1,0];
                break;
            default:
               number = 0;
               break;
        }

    },


    setTableRoles: function () {

        this.removeRoles();

        var roleCount = this.tableInfo.conf.nSeats;

        this.setTableNum(roleCount);

        var rolesPosArray = this.getRolesPos(roleCount);
        var chairRotateArray = this.getChairRotate(roleCount);

        var rolesNode = this.node.getChildByName("roles");
        if (roleCount <= 1) {
            rolesNode.active = false;
            return;
        }else {
            rolesNode.active = true;
        }

        var roleTemplate = rolesNode.children[0];
        for (var i = 1; i < roleCount; i++) {
            var role = cc.instantiate(roleTemplate);
            rolesNode.addChild(role);
        };

        this.setRolesInfo(rolesPosArray, chairRotateArray);
    },

    removeRoles: function () {
        var rolesNode = this.node.getChildByName("roles");
        var roleUICount = rolesNode.childrenCount;
        for (var i = 1; i < roleUICount; i++) {
            rolesNode.children[1].removeFromParent(true);
        };
    },

    setRolesInfo: function (posArray, rotateArray) {
        var rolesNode = this.node.getChildByName("roles");

        var infoCount = this.tableInfo.rolesInfo.length;
        var roleUICount = rolesNode.childrenCount;

        for (var j = 0; j < roleUICount; j++) {
     
            var role = rolesNode.children[j];
            
            role.x = posArray[j].posX;
            role.y = posArray[j].posY;

            var roleInfo = null, isEmpty = true, chairRotate = 0; 
            
            if(infoCount ===0){
                chairRotate = rotateArray[j]

            }else{
                for (let k = 0; k < infoCount; k++) {
                    if (j === this.tableInfo.rolesInfo[k].index) {
                        roleInfo = this.tableInfo.rolesInfo[k];
                        isEmpty = false;
                    }
                    
                    if(isEmpty){
                        chairRotate = rotateArray[j]
                    }
                }
            }   

            this.setRole(role, isEmpty, roleInfo, chairRotate);
        };
    },


    getRolesPos: function (roleCount) {
        var posArray = []
        switch (roleCount) {
            case 2:
                 posArray = [{ posX: 0, posY: -125 },{ posX: 290, posY: 25 }]
                break;
            case 3:
                 posArray = [{ posX: 0, posY: -125 },{ posX: 290, posY: -125 },{ posX: 290, posY: 25 }]
                break;
            case 4:
                
                posArray = [{ posX: 0, posY: -125 },{ posX: 290, posY: -125 },{ posX: 290, posY: 25 },{ posX: 0, posY: 25 },]
              
                break;
            case 5:
                // signX = [-(15/26),(15/26),1, 0,-1];
                // signY = [-1,-1,0,1,0];
                break;
            case 6:
                // signX = [-(15/26),(15/26),1, (15/26),-(15/26),-1];
                // signY = [-1,-1,0,1,1,0];
                break;
            default:
                roleCount = 0;
                break;
        }

        // for (var j = 0; j < roleCount; j++) {
        //     // var posData = {};
        //     // posData.posX = signX[j] * 130;
        //     // posData.posY = signY[j] * 125;
        //     posArray.push(posData);
        // };

        return posArray;
    },

    getChairRotate: function (roleCount) {
        var chairRotateArray = null;
        switch (roleCount) {
            case 2:
                chairRotateArray = [0, 180];
                break;
            case 3:
                chairRotateArray = [0, -90, 90];
                break;
            case 4:
                chairRotateArray = [0, -90, 180, 90];
                break;
            case 5:
                chairRotateArray = [0, 0, -90, 180, 90];
                break;
            case 6:
                chairRotateArray = [0, 0, -90, 180, 180, 90];
                break;
            default:
                break;
        }

        return chairRotateArray;
    },

    setRole: function (role, isEmpty, roleInfo, emptyRotate) {
        var emptyNode = role.getChildByName("empty");
        var headNode = role.getChildByName("head");
        var nameNode = role.getChildByName("lblName");
        var offlineNode = role.getChildByName("offline");

        emptyNode.rotation = emptyRotate;

        if (emptyRotate == 180) {
            emptyNode.y = -15;
        }else if (emptyRotate == -90) {
            emptyNode.x = -15;
            emptyNode.y = 0;
        }else if (emptyRotate == 90) {
            emptyNode.x = 15;
            emptyNode.y = 0;
        }
        
        if (isEmpty == true) {
           // emptyNode.active = true;
            headNode.active = false;
            nameNode.active = false;
            offlineNode.active = false;
            return;
        }else {
           // emptyNode.active = false;
            headNode.active = true;
            nameNode.active = true;
        }

        if(roleInfo.userId === undefined){
            var tmpuserid = roleInfo.userid
        } else {
            var tmpuserid = roleInfo.userId
        }

        if(typeof(tmpuserid)== 'string'){
            tmpuserid = parseInt(tmpuserid);
        }

        var headLoader = headNode.getComponent("ImageLoader");

        // if(headLoader && roleInfo.userId && roleInfo.userId > 0){
        //     headLoader.setUserID(roleInfo.userId);
        // }

        if (headLoader &&  tmpuserid > 0) {
            headLoader.setUserID(tmpuserid);
        }

        var lblName = nameNode.getComponent("cc.Label");
        lblName.string = roleInfo.username;
        this.setLabelProperties(lblName, 140, -1, false);

        offlineNode.active = !roleInfo.isOnline;
    },

    onJoinRoomClicked: function () {
        cc.vv.clubview.node.getChildByName('clubMask').active = true;
        
        // var tmpObj = setTimeout(() => {
        //     cc.vv.clubview.node.getChildByName('clubMask').active = false;
        //     cc.vv.alert.show('网络不好，请再次点击！');
        // }, 10000);
         
        cc.vv.userMgr.enterRoom(this.tableInfo.roomId,function(ret){
           
            // if(ret.errcode != 0){
            //     var content = "房间["+ roomId +"]不存在，请重新输入!";
            //     if(ret.errcode == 4){
            //         content = "房间["+ roomId + "]已满!";
            //     }else if (ret.errcode == 5) {
            //         content = "房主不能进入自己代开的房间！";
            //     }else if(ret.errcode == 6){
            //         content ='与其他玩家ip相同或地理位置相近，无法进入该房间';
            //     }else if(ret.errcode==7){
            //         var chk=cc.vv.GPSMgr.chkGps();
            //         if(!chk){
            //             return;
            //         }
            //         content='GPS数据获取失败';
            //     }
            //     cc.vv.alert.show(content);
            // }           
           
            //clearTimeout(tmpObj);

            if(ret.errcode != 0 || ret.clientErrorCode == -120){
                cc.vv.clubview.node.getChildByName('clubMask').active = false;
            }
        })
        
    },

    //修改、查看、解散牌桌

    setBtnsAttribute: function () {
        var btnChangePlay = this.node.getChildByName("btnChangePlay");
        var btnSeePlay = this.node.getChildByName("btnSeePlay");
        var btnInvitation = this.node.getChildByName("btnInvitation");

        var roleCount = this.tableInfo.rolesInfo.length;
        if (this.tableInfo.changeTablePlay == true && roleCount == 0) {
            btnChangePlay.active = true;
            btnSeePlay.active = false;
        }else {
            btnChangePlay.active = false;
            btnSeePlay.active = true;
        }

        var ttX = this.tableTitle.x;
        var ttW = this.tableTitle.width;
        var tableMaxRoleCount = this.tableInfo.conf.nSeats;
        if (tableMaxRoleCount > 5) {

            
            btnChangePlay.x = ttX+125;
            btnSeePlay.x = ttX+125;
            btnInvitation.x = ttX + 215;
            
        }else {
            btnChangePlay.x = ttX + (ttW - btnChangePlay.width)*0.5+125;
            btnSeePlay.x = ttX + (ttW - btnSeePlay.width)*0.5+125;
        }
        var ttY = this.tableTitle.y;
        var ttH = this.tableTitle.height;
        btnChangePlay.y = ttY - ttH;
        btnSeePlay.y = ttY - ttH;
        btnInvitation.y = ttY - ttH;


        var btnDissolve = this.node.getChildByName("btnDissolve");

        if (this.tableInfo.isClubOwner == true) {
            btnDissolve.active = true;

            if (tableMaxRoleCount < 5) {
                btnDissolve.y = -115;
                btnDissolve.setScale(1);
            }else {
                btnDissolve.y = -185;
                btnDissolve.setScale(0.8);
            }

        }else {
            btnDissolve.active = false;           
        }

    },

    onClubFriendClicked: function () {
       cc.vv.audioMgr.playButtonClicked();
       cc.vv.clubview.showClubInvateFriend(this.tableInfo.roomId);
    },

    onChangePlayClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        this.requestGamePlay("change");
    },

    onSeePlayClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        this.requestGamePlay("see");
    },

    onDissolveTableClicked: function () {
        console.log("解散牌桌");
      
        var data = {
            clubid:cc.vv.clubview.viewData.clubsInfo.clubInfo.id,
            roomid:this.tableInfo.roomId,
        }

        cc.vv.userMgr.dissolveClubRoom(data,function(ret){
            if (ret.errcode !== 0) {
                cc.vv.alert.show("解散房间失败!");
            } else {                             
                cc.vv.alert.show("解散房间成功！");
                cc.vv.clubview.showChildView()
                cc.vv.clubview.showClubView(true);    
            }
        })     
    },

    requestGamePlay: function (key) {

      
        var clubId = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var clubName = cc.vv.clubview.viewData.clubsInfo.clubInfo.username;
        var tmpConf = this.tableInfo.conf;
        tmpConf.clubId =clubId;
        tmpConf.clubName = clubName;
        tmpConf.roomId =  this.tableInfo.roomId;
        tmpConf.playKey = key

        // var playView = cc.instantiate(cc.vv.clubview.gamePlayPrefab);
        // var PScript = playView.getComponent("CreateRoom");
        // if (PScript) {
        //     PScript.init(tmpConf);
        // }
        // cc.vv.clubview.node.addChild(playView);
        cc.vv.hall.loadCreateLayer(tmpConf);
               
    }

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
