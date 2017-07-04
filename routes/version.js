var express = require('express');
var router = express.Router();
var updatingFileOpManage = require("./../Utilitys/UpdatingFileOpManage");
/* GET users listing. */
router.post('/', function(req, res, next) {
   var versionKey = "";
    if(req.body && req.body.VersionKey){
        versionKey = req.body.VersionKey;
    }
    if(updatingFileOpManage.getInstance(versionKey)){
        res.send(updatingFileOpManage.getInstance(versionKey).GetVerison());
    }else{
        res.status(200).send("{'Error':'未找到此VersionKey的更新包!'}");
    }
});

router.get("/AllVersion" ,function(req,res,next){
    var retVersionInfo = [];
     updatingFileOpManage.getAllInstance().forEach(function(item){
         var conifgInfo = item.Instance.VersionConfig;
         // if(conifgInfo.Launch && conifgInfo.Launch!=""){
         //     conifgInfo.Type = "更新包";
         // }
         // else
         //    conifgInfo.Type = "文件包";

         retVersionInfo.push(conifgInfo);
    });
    res.send(retVersionInfo);
});

//
router.post('/GetUpdatingSize', function(req, res, next) {
    var versionKey = "";
    if(req.body && req.body.VersionKey){
        versionKey = req.body.VersionKey;
    }
    res.send({ZipSize:updatingFileOpManage.getInstance(versionKey).GetZipSize(versionKey)});
});
//
router.post('/DownFile', function(req, res, next) {
    var versionKey = "";
    if(req.body && req.body.VersionKey){
        versionKey = req.body.VersionKey;
    }
    updatingFileOpManage.getInstance(versionKey).AsyncGetZip(versionKey,function(err,result){
        if(err){
            res.send(err);
            return ;
        }
        res.send(result);
    });
});



module.exports = router;
