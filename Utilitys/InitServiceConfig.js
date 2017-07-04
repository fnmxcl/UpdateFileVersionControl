/**
 * Created by fnmxcl on 2017/07/03.
 */
var fs = require("fs");
var path = require("path");
var that = require("./InitServiceConfig");
module.exports.InitServiceConfig = null;
module.exports.GetConfig = function(){
    if(that.InitServiceConfig)
        return that.InitServiceConfig;
    else{
        try{
            var filePath = path.join("./Config/initservice.json");
            var stats = fs.statSync(filePath);
            var buff = fs.readFileSync(filePath);
            if (buff[0].toString(16).toLowerCase() == "ef" && buff[1].toString(16).toLowerCase() == "bb" && buff[2].toString(16).toLowerCase() == "bf") {
                //EF BB BF 239 187 191
                console.log('\发现BOM文件：', filePath, "\n");
                buff = buff.slice(3);
                fs.writeFileSync(filePath, buff.toString(), "utf8");
            }
            that.InitServiceConfig =  JSON.parse(fs.readFileSync(filePath).toString("utf-8"));
            return that.InitServiceConfig;
        }catch (exception){
            console.log(exception);
            return null;
        }
    }

};