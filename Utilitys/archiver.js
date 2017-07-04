/**
 * Created by fnmxcl on 2017/06/27.
 */
var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
var updatingFileOpManage = require("./UpdatingFileOpManage");


function archiverGen(versionJson,callback){
    var successs = 0;
    for(var index = 0;index< versionJson.length;index ++){
        var extName =  path.extname(path.join(__dirname,versionJson[index].UrlRoot));
        if(/^[.a-zA-Z]+$/.test(extName) == false) {
            function genArchiver(versionConfig, versionJson) {
                console.log("正在生成" + versionConfig.VersionKey);
                var output = fs.createWriteStream("Archivers//" + versionConfig.VersionKey + '.zip');
                var archive = archiver('zip');
                archive.on('error', function (err) {
                    throw err;
                    callback(err, null);
                });

                archive.pipe(output);
                output.on('close', function () {
                    console.log(archive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                    successs++;
                    if (successs == versionJson.length) {
                        callback(null, versionJson);
                    }
                });

                archive.bulk([
                    {
                        cwd: versionConfig.UrlRoot,    //设置相对路径
                        src: ['**'],
                        expand: versionConfig.UrlRoot
                    }
                ]);
                archive.finalize();
            }

            genArchiver(versionJson[index], versionJson)
        }else{
            try{
                fs.createReadStream(versionJson[index].UrlRoot).pipe(fs.createWriteStream("Archivers//" + versionJson[index].VersionKey + extName));

            }catch(exception){
                console.log("Archiver,Exception:"+exception);
                process.exit(-1);
            }
            successs++;
            if (successs == versionJson.length) {
                callback(null, versionJson);
            }
        }
    }
};
module.exports.ArchiverGen = archiverGen;