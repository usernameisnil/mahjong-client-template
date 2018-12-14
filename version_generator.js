var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var manifest = {
    packageUrl: 'http://localhost/tutorial-hot-update/remote-assets/',
    remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};

var dest = './remote-assets/';
var src = './jsb/';
var isZip = 0;

// Parse arguments
var i = 2;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        var url = process.argv[i+1];
        manifest.packageUrl = url;
        manifest.remoteManifestUrl = url + 'project.manifest';
        manifest.remoteVersionUrl = url + 'version.manifest';
        i += 2;
        break;
    case '--version' :
    case '-v' :
        manifest.version = process.argv[i+1];
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;
    case '--dest' :
    case '-d' :
        dest = process.argv[i+1];
        i += 2;
        break;
    case '--zip' :
    case '-z':
        isZip = process.argv[i + 1];
        i += 2;
        break;
    case '--percent'://百分比显示方式  “file” , "byte"
    case '-p':
        manifest.percent = process.argv[i + 1];
        i += 2;
        break;
    default:
        i++;
        break;
    }
}


function readDir (dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    
    var subpaths = fs.readdirSync(dir), subpath, md5, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {


            //var content = fs.readFileSync(subpath, 'utf8');
            var content = fs.readFileSync(subpath);
            console.log(subpath);
            var md5 = crypto.createHash('md5');
            
            filename = path.posix.basename(subpath);
            extname = path.extname(filename);
            console.log(filename,extname);
            
            if (extname == '.jpg' || extname == '.png' || extname == '.mp3' || extname == '.amr') {
                md5.update(content);
            } else {
                md5.update(content,'utf8');
            }
            
            var md5str = md5.digest('hex');



            
            // md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'utf8'),'utf8').digest('hex');
            relative = path.relative(src, subpath);
            relative = encodeURI(relative);


            if (isZip == 0 || isZip == undefined) {
                if (extname != '.zip' && extname != '.ZIP'){
                    obj[relative] = {
                        'md5': md5str
                    };
                }
            }else{
                if (extname == '.zip' || extname == '.ZIP'){
                    obj[relative] = {
                        'md5': md5str,
                        "compressed": true
                    };
                }
            }
            
        }
    }
}

function readDir_once (dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    
    var subpaths = fs.readdirSync(dir), subpath, md5, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        // if (stat.isDirectory()) {

        //     readDir(subpath, obj);
        // }
        // else 
        if (stat.isFile()) {


            //var content = fs.readFileSync(subpath, 'utf8');
            var content = fs.readFileSync(subpath);
            console.log(subpath);
            var md5 = crypto.createHash('md5');
            
            filename = path.posix.basename(subpath);
            extname = path.extname(filename);
            console.log(filename,extname);
            
            if (extname == '.jpg' || extname == '.png' || extname == '.mp3' || extname == '.amr') {
                md5.update(content);
            } else {
                md5.update(content,'utf8');
            }
            
            var md5str = md5.digest('hex');



            
            // md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'utf8'),'utf8').digest('hex');
            relative = path.relative(src, subpath);
            relative = encodeURI(relative);


            if (isZip == 0 || isZip == undefined) {
                if (extname != '.zip' && extname != '.ZIP'){
                    obj[relative] = {
                        'md5': md5str
                    };
                }
            }else{
                if (extname == '.zip' || extname == '.ZIP'){
                    obj[relative] = {
                        'md5': md5str,
                        "compressed": true
                    };
                }
            }
            
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

// Iterate res and src folder

if (isZip == 0 || isZip == undefined) {
    readDir(path.join(src, 'src'), manifest.assets);
    readDir(path.join(src, 'res'), manifest.assets);
}else{
    readDir_once(path.join(src), manifest.assets);
}

var destManifest = path.join(dest, 'project.manifest');
var destVersion = path.join(dest, 'version.manifest');

mkdirSync(dest);

fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Manifest successfully generated');
});

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Version successfully generated');
});
