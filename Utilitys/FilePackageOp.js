/**
 * Created by fnmxcl on 2017/07/01.
 */
var filePackageOp = require("./FilePackageOp");
var UpdatingFileOp =  require("./UpdatingFileOp");
var updatingFileOpManage = require("./UpdatingFileOpManage");
var UpdatingScriptConfig = require("./../Utilitys/UpdatingScriptConfig");
var archiver = require("./archiver");
module.exports.WaitingGeneratePackage = [];
module.exports.DelayGeneratePackage = DelayGeneratePackage;
module.exports.InWaitingGeneratePackage = function(inItem){
  var filterItem =   filePackageOp.WaitingGeneratePackage.filter(function(item){
        return  item.Property().VersionKey == inItem.VersionKey;
    });
    if(filterItem.length == 0){
        var delayGeneratePackage = new  filePackageOp.DelayGeneratePackage(inItem);
        filePackageOp.WaitingGeneratePackage.push(delayGeneratePackage);
    }else{
        //重新计时
        filterItem[0].RefreshTimeout();
    }
};
function DelayGeneratePackage(propertyItem){
    this.DalayProperty = propertyItem;
    this.RefreshTimeout();
}

DelayGeneratePackage.prototype.Property = function(){
    return this.DalayProperty;
}

DelayGeneratePackage.prototype.RefreshTimeout = function(){
    var that = this;
    if(this.setTimeoutIndex) {
        clearTimeout(this.setTimeoutIndex);
    }
    this.setTimeoutIndex = setTimeout(function(){
        console.log("生成!" + that.DalayProperty.VersionKey + "开始!");
        archiver.ArchiverGen([that.DalayProperty],function(error,result){
            var configInstance =  UpdatingScriptConfig.GetConfig();
            if(error){
                console.log("FilePackageOp执行中出现错误:"+error);
                return;
            }
            //更新配置文件
            UpdatingScriptConfig.SaveConfig(that.DalayProperty);
            updatingFileOpManage.Refresh();
        });
    },(global.InitServiceConfig.DelayTime || 30) *1000);

};
