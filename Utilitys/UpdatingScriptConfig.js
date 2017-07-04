/**
 * Created by fnmxcl on 2017/06/27.
 */
var fs = require("fs");
var path = require("path");
var updatingScriptConfig = require("./UpdatingScriptConfig");
module.exports.GetConfig = function(){
    try{
        var filePath = path.join("./Config/UpdatingScript.json");
        var stats = fs.statSync(filePath);
        var buff = fs.readFileSync(filePath);
        if (buff[0].toString(16).toLowerCase() == "ef" && buff[1].toString(16).toLowerCase() == "bb" && buff[2].toString(16).toLowerCase() == "bf") {
            //EF BB BF 239 187 191
            console.log('\发现BOM文件：', filePath, "\n");
            buff = buff.slice(3);
            fs.writeFileSync(filePath, buff.toString(), "utf8");
        }
        return JSON.parse(fs.readFileSync(filePath).toString("utf-8"));
    }catch (exception){
        console.log(exception);
    }
};
module.exports.SaveConfig = function(item){
    var configInstance =  updatingScriptConfig.GetConfig();
    for(var i = 0 ;i < configInstance.length ;i++){
        var currnet = configInstance[i];
        if(currnet.VersionKey == item.VersionKey) {
            var currentDate = new Date();
            currnet.DateTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();
            currnet.Version = currentDate.getTime();
        }
    }
    var filePath = path.join("./Config/UpdatingScript.json");
    if(configInstance && configInstance.length > 0){
        try{
            fs.writeFileSync(filePath, JSON.stringify( configInstance,null, 4), "utf8");
            console.log("已生成新的配置文件");
        }catch(exception){
            console.log(exception);
        }
    }
}
