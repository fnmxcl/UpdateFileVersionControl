var updatingFileOpManage = require("./UpdatingFileOpManage");
var UpdatingFileOp =  require("./UpdatingFileOp");
var UpdatingScriptConfig = require("./../Utilitys/UpdatingScriptConfig");
var fs = require("fs");
var path = require("path");

module.exports.UpdtingFileOpInstance = [];
module.exports.InInstance =  function(versionKey, instance){
    updatingFileOpManage.UpdtingFileOpInstance.push({VersionKey:versionKey,Instance:instance});
}
module.exports.getInstance =  function(versionKey){
    var instance = null;
    if(versionKey){
        instance =  updatingFileOpManage.UpdtingFileOpInstance.filter(v=>v.VersionKey == versionKey)[0];
        if(!instance){
            try{
                instance = new UpdatingFileOp(versionKey);
                updatingFileOpManage.InInstance(versionKey,instance);
            }catch(excepiton){
                return null;
            }
        }else{
            return instance.Instance;
        }
        return instance;
    }
}

module.exports.getAllInstance = function(){
    var _updatingScriptConfig =  UpdatingScriptConfig.GetConfig();
    if(updatingFileOpManage.UpdtingFileOpInstance  &&  updatingFileOpManage.UpdtingFileOpInstance.length > 0){
        return updatingFileOpManage.UpdtingFileOpInstance;
    }else{
        for(var index = 0 ;index < _updatingScriptConfig.length; index ++){
            updatingFileOpManage.getInstance(_updatingScriptConfig[index].VersionKey);
        }
        return updatingFileOpManage.UpdtingFileOpInstance;
    }
}


module.exports.Refresh = function(){
    var _updatingScriptConfig =  UpdatingScriptConfig.GetConfig();
    for(var index = 0 ;index < _updatingScriptConfig.length; index ++){
        var instance =  updatingFileOpManage.getInstance(_updatingScriptConfig[index].VersionKey);
        instance.RefreshFile(_updatingScriptConfig[index].VersionKey);
    }
}

module.exports.ClearWorkUrl = function(){
    var dirFiles =  fs.readdirSync(path.join(__dirname,"./../Archivers"));
    dirFiles.forEach(function(item){
        var fileName = path.join(__dirname,"./../Archivers/"+item);
        fs.unlinkSync(fileName);
        console.log("已清理:"+fileName)
    });
}
