/**
 * Created by fnmxcl on 2017/06/27.
 */
var fs = require("fs");
var path = require("path");
var UpdatingScriptConfig = require("../Utilitys/UpdatingScriptConfig");
var md5File = require('md5-file')

function UpdateScriptFiles(versionKey){
    if(versionKey) {
        return this.RefreshFile(versionKey);
    }
}
UpdateScriptFiles.prototype.RefreshFile = function(versionKey){
    this.VersionKey = versionKey;
    this.VersionConfig = null;
    var ScriptConfig = UpdatingScriptConfig.GetConfig();
    //2.8单店版的路径。
    var versionKeyList =    ScriptConfig.filter(f=>f.VersionKey==this.VersionKey);
    if(versionKeyList){
        this.VersionConfig =  versionKeyList[0];
    }
    this.Suffix = path.extname(this.VersionConfig.UrlRoot);
    if(/^[.a-zA-Z]+$/.test(this.Suffix) == false){
        this.Suffix = ".zip";
        this.VersionConfig["Type"] = ".zip";
    }
    else{
        this.VersionConfig["Launch"] = versionKey + this.Suffix;
        this.VersionConfig["Type"] = this.Suffix;
    }
    var zipName = versionKey + this.Suffix;
    this.File  = path.join(__dirname,"./../Archivers/"+ zipName);
    this.VersionConfig["MD5"] = "-";
    try{
        this.VersionConfig["MD5"] = md5File.sync(this.File);
    }catch (exception){
        console.log("UpdatingFileOp生成MD5失败:"+ exception);
    }
    this.VersionConfig["Suffix"] = this.Suffix;
}

UpdateScriptFiles.prototype.GetVerison = function(){
    if(this.VersionConfig){
        return this.VersionConfig;
    }
}


UpdateScriptFiles.prototype.DownUpdatingZip = function(versionKey , fileName) {
    if (versionKey == this.VersionConfig.Version) {
        var urlRoot = this.VersionConfig.UrlRoot;
        rd.eachSync(urlRoot, function (f, s) {
            // 每找到一个文件都会调用一次此函数
            // 参数s是通过 fs.stat() 获取到的文件属性值
            console.log('file: %s', f);
        });
    }
}

UpdateScriptFiles.prototype.GetZipSize = function(versionKey , fileName){
    if(versionKey == this.VersionConfig.VersionKey){
        var stat =  fs.statSync(this.File);
        return stat.size;
    }
}

UpdateScriptFiles.prototype.AsyncGetZip = function(versionKey ,callback){
    if(versionKey == this.VersionConfig.VersionKey){
        fs.readFile(this.File,function(err, data){
            callback(err,data);
        });
    }
}

module.exports = UpdateScriptFiles;