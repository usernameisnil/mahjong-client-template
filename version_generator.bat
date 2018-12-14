//注释：-z 1 只生成ZIP文件信息  0生成除了ZIP文件的其它文件信息       -p “file” 以文件数量显示百分比 , "byte" 以字节大小显示百分比

node version_generator.js -v 1.1.7 -u http://update.ydjoy.com/templateqp/remote-assets/ -s build/jsb-default/ -d assets/ -z 0 -p file
node version_generator.js -v 1.0.2 -u http://update.ydjoy.com/templateqp/remote-assets/ -s build/jsb-default/ -d assets/ -z 1 -p byte

node version_generator.js -v 1.1.7 -u http://123.207.40.180:8801/templateqp/remote-assets/ -s build/jsb-default/ -d assets/ -z 0 -p file
node version_generator.js -v 1.1.3 -u http://123.207.40.180:8801/templateqp/remote-assets/ -s build/jsb-default/ -d assets/ -z 1 -p byte


//子游戏
node version_generator.js -v 1.0.1.0 -u http://123.207.40.180:8801/subgame2/remote-assets/ -s build/jsb-default/ -d assets/
