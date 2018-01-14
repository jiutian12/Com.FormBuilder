var app = angular.module('formbulider', ["ngDialog", 'ngAnimate', 'lbm.common.services', 'lbm.common.directives']);

app.controller('basecontroller', function ($rootScope, $scope, $http, $sce, $window, $timeout, ngDialog, $lbmdialog, $lbmnotify, $lbDataService) {
    $scope.showPage = function (val, args) {
        $scope.pageindex = args;
        console.log(args)
    }
    $scope.pager = {};
    $scope.pager.totalitems = 0;
    $scope.pager.itemsperpage = 10;
    $scope.$on('pagechage', $scope.showPage);
    $scope.pageindex = 0;
    $lbmdialog.showloading();
    $scope.metalist = [];
    $scope.RefreshList = function () {
        var jsondata = {
            pagesize: 20,
            index: $scope.pageindex + 1,
            condtion: ""
        };
        $lbmdialog.showloading();
        $lbDataService.Request("/FBMeta/GetFBMetaData", jsondata).then(function (data) {
            //获取模型赋值
            //alert(data);
            if (data.res) {
                $scope.metalist = data.data;
                $scope.pager.totalitems = data.totalitems;

            } else {
                $lbmnotify.tip(data.mes);
            }
            $lbmdialog.hideloading();

        });
    }
    $scope.RefreshList();


    $scope.getTag = function (type) {
        if (type == "1") {
            return "object";
        }
        if (type == "2") {
            return "model";
        }
    }
    $scope.getTagName = function (type) {
        if (type == "1") {
            return "数据对象";
        }
        if (type == "2") {
            return "数据模型";
        }
    }
});