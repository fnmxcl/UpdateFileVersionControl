/**
 * Created by fnmxcl on 2017/07/01.
 */
main.controller("MainCtrl",MainCtrl);
MainCtrl.$inject = ['$scope', '$http'];
function MainCtrl($scope, $http) {
    $scope.gridOptions = {
        columnDefs: [
            { field: 'VersionKey', displayName:'VersionKey',enableSorting: true },
            { field: 'Description', displayName:'更新包描述' },
            { field:'Type', displayName:'类型'},
            { field: 'Version', displayName:'版本号'},
            { field: 'DateTime', displayName:'更新时间' },
            { field:'MD5', displayName:'MD5'}
        ]
    };
    $http({
        method:'get',
        url:'Version/AllVersion'
    }).then(function sucess(req){
        $scope.gridOptions.data =  req.data;
    },function error(error){
        console.log(error);
    });



}