require("../Common/Mgrs/AdaptationMgr.js");

cc.Class({
    extends: cc.Component,

    properties: {
        updatePanel: {
            default: null,
            type: cc.Node
        },
        manifestUrl: {
            default: null,
            url: cc.RawAsset
        },
        percent: {
            default: null,
            type: cc.Label
        },
        lblErr: {
            default: null,
            type: cc.Label
        },
        lblversion: cc.Label,
        fileProgress: cc.ProgressBar,
    },

    checkCb: function (event) {
        console.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                // this.lblErr.string += "游戏不需要更新\n";
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                this.updatePanel.active = true;
                this.percent.string = '0%';
                cc.eventManager.removeListener(this._checkListener);
                this.fileProgress.node.active = true;
                this.fileProgress.progress = 0;
                break;
            default:
                break;
        }
        
         this.getPercentStyle();//确定下载方式，字节，文件数
         this.hotUpdate();
    },

    getPercentStyle:function(){
        
        this._updateFile = true; //默认以文件百分比显示；
        var filePath = this._storagePath+"_temp/version.manifest";
        if (jsb.fileUtils.isFileExist(filePath)) {
            var vermanifest = jsb.fileUtils.getStringFromFile(filePath);
            var vermanifest_obj = JSON.parse(vermanifest);
            if (vermanifest_obj.percent == "byte") {
                this._updateFile = false;
            } else if (vermanifest_obj.percent == "file") {
                this._updateFile = true;
            } 
        } 
        console.log("baihua2001cn",this._updateFile);
        
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();

                console.log("percent = ", percent.toFixed(0) + '%');
                console.log("percentByFile = ", percentByFile.toFixed(0) + '%');

                // var msg = event.getMessage();
                // if (msg) {
                //     console.log("file update", msg);
                //     this._updateFile = true;
                // }

                var updatePercent = 0;
                if (this._updateFile == false) {
                    updatePercent = percent.toFixed(0);
                } else {
                    updatePercent = percentByFile.toFixed(0);
                }

                this.lblErr.string = ""
                this.percent.string = updatePercent + '%';
                this.fileProgress.progress = updatePercent / 100;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                needRestart = true;
                this._updateFile = false;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());

                this._failCount++;
                if (this._failCount < 5) {
                    this._am.downloadFailedAssets();
                }
                else {
                    console.log('Reach maximum fail count, exit update process');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this.updatePanel.active = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log("newPaths",newPaths)
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            this.lblErr.string += "游戏资源更新完毕\n";
            cc.game.restart();
        }
    },

    deleteSrcManifest: function () {
        var file_project = this._storagePath + '/src/project.manifest';
        var file_version = this._storagePath + '/src/version.manifest';

        if (jsb.fileUtils.isFileExist(file_project)) {

            if (jsb.fileUtils.removeFile(file_project)) {
                console.log('file_project remove file succeed');
            } else {
                console.log('file_project remove file failed');
            }

        }

        if (jsb.fileUtils.isFileExist(file_version)) {

            if (jsb.fileUtils.removeFile(file_version)) {
                console.log('file_project remove file succeed');
            } else {
                console.log('file_project remove file failed');
            }

        }


    },

    changeManifest: function () {
        var file_project = this._storagePath + '/src/project.manifest';
        var file_version = this._storagePath + '/src/version.manifest';
        
        var filepath_project = this._storagePath + '/project.manifest';
        var filepath_version = this._storagePath + '/version.manifest';

        var saveFile = function (data, filepath) {
            console.log('save file: ' + data);
            if (typeof data !== 'undefined') {

                if (jsb.fileUtils.writeDataToFile(data, filepath)) {
                    console.log('write file succeed.');

                } else {
                    console.log('write file failed.');
                }
            } else {
                console.log('download file failed.');
            }
        };

        var readFile = function (filepath) {
            let fileData = jsb.fileUtils.getDataFromFile(filepath);
            if (typeof fileData !== 'undefined') {
                console.log('read file succeed.');

                return fileData;
            } else {
                console.log('read file failed.')
                return undefined;
            }
        }

        if (jsb.fileUtils.isFileExist(file_project)) {
            var tmpfiledata = readFile(file_project);
            if (tmpfiledata !== undefined) {
                saveFile(tmpfiledata, filepath_project);
                if (jsb.fileUtils.removeFile(file_project)) {
                    console.log('file_project remove file succeed');
                } else {
                    console.log('file_project remove file failed');
                }
            } else {
                console.log('project saveFile  failed.')
            }
        }else{
            console.log("file_project not found!")
        }

        if (jsb.fileUtils.isFileExist(file_version)) {
            var tmpfiledata = readFile(file_version);
            if (tmpfiledata !== undefined) {
                saveFile(tmpfiledata, filepath_version);
                if (jsb.fileUtils.removeFile(file_version)) {
                    console.log('file_version remove file succeed');
                } else {
                    console.log('file_version remove file failed');
                }
            } else {
                console.log('version saveFile  failed.')
            }
        }else{
            console.log("file_version not found!")
        }

        if (jsb.fileUtils.isFileExist(filepath_version)) {
            console.log('已经找到filepath_version');
        }

    },

    hotUpdate: function () {
        if (this._am && this._needUpdate) {
            this.lblErr.string += "开始更新游戏资源...\n";
            this.deleteSrcManifest();
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
        }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        
        //把Utils转移到HotUpdate中
        cc.vv = {};
        var Utils = require("Utils");
        cc.vv.utils = new Utils();

        //原代码

        if (!cc.sys.isNative) {
            cc.director.loadScene("loading");
            return;
        }
        console.log('new hotupdate start')
        
       
        this.lblErr.string += "检查游戏资源...\n";
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'templateQiPai-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);
        
        this.changeManifest();//更新project.manifest  version.manifest ;

        var storagePathTip = "资源检查更新中...";
        this.lblErr.string = storagePathTip + "\n";
        console.log('Local manifest URL : ' + this.manifestUrl);
       
        this._am = new jsb.AssetsManager(this.manifestUrl, this._storagePath);
        
        this._am.retain();

        var self = this
        this._am.setVersionCompareHandle(function (versionA, versionB) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            // self.lblversion.string = "Ver:" + versionB

            // cc.mjVersion = "Ver:" + self.localVersion
            cc.log("Version :", cc.mjVersion)

            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        });

        //全面屏(需要使用热更版本控制)
        this.initAllScreenConfig();
        

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(1);
        }

        this._needUpdate = false;
        this._updateFile = false;
        if (this._am.getLocalManifest().isLoaded()) {
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);
            this._am.checkUpdate();
        }

        this.fileProgress.node.active = false;
        this.fileProgress.progress = 0;
    },

    /********************************
    ***** 全面屏适配 *****
    ********************************/

    initAllScreenConfig: function () {

        this.localVersion = this._am.getLocalManifest().getVersion();
        this.lblversion.string = "Ver:" + this.localVersion;
        cc.mjVersion = "Ver:" + this.localVersion;

        //"1.0.8":全面屏原始包的热更版本,注意：此版本必须等于当前热更版本
        if (this.localVersion == "1.1.2") {
            //打包全面屏原始包时，给赋初值
            cc.allScreenApp = true; //true:全面屏应用包；false:老包，没有添加全面屏
            cc.sys.localStorage.setItem('allScreen', "true");
        }else {
            // 如果发出全面屏适配的原始包后，为了兼容没有下载新包的老包用户，在下次热更新的时候加上此段代码。
            var isAllScreenApp = cc.sys.localStorage.getItem('allScreen');
            if (isAllScreenApp == null || isAllScreenApp == "false") {
                cc.allScreenApp = false;
                isAllScreenApp = "false";
            }else {
                cc.allScreenApp = true; //true:全面屏应用包；false:老包，没有添加全面屏
                isAllScreenApp = "true";
            }
            cc.sys.localStorage.setItem('allScreen', isAllScreenApp);
        }

        cc.AdaptationMgr.init();

        this.updateDesignSize();
    },
     
    updateDesignSize: function () {
        var cvs = this.node.getComponent(cc.Canvas);
        var isAllScreen = cc.AdaptationMgr.getAllScreenBool();
        if (isAllScreen == false) {
            cvs.fitHeight = true;
        }else {
            cvs.fitHeight = false;
        }
        cvs.fitWidth = true;

        this.body = this.node.getChildByName("body");

        if (isAllScreen == true) {
            var sceneScale = cc.AdaptationMgr.getNodeScale();
            // this.body.setScale(sceneScale);
            cc.AdaptationMgr.setRootNodeScaleWidth(this.body, sceneScale);
            this.setUIByLeftAndRightOffest();
            this.setSceneBottomOffest(sceneScale);
        }
    },

    setUIByLeftAndRightOffest: function () {
        var nodeNames = cc.AdaptationMgr.getNodeNamesByScene("hotUpdate");
        cc.AdaptationMgr.setNodeOffestByName(nodeNames, this.node);
    },

    setSceneBottomOffest: function (sceneScale) {
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        this.body.y = this.body.y + homeHeight * sceneScale * 0.5;
    },

    /*******************************/

    onDestroy: function () {
        this._am && this._am.release();
    }
});
