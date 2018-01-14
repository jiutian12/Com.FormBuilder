var app = angular.module('formbulider', ["ngDialog", 'ngAnimate', 'lbm.common.services'])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);
app.controller('basecontroller', function ($rootScope, $scope, $http, $sce, $window, $timeout, $location, ngDialog, $lbmdialog, $lbmnotify, $lbDataService) {

    $scope.consolejson = function () {

        $scope.data.push({
            IsPrimary: false,
            Code: "",
            Name: "",
            DataType: "varchar",
            Length: 50

        });
        $scope.info = false;
    }
    $scope.clickToOpen = function () {
        ngDialog.open({
            template: 'tmpl/test.html',
            className: 'ngdialog-theme-default',
            closeByEscape: false,
            width: 700,
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                $scope.confirm = function () {
                    //alert(2);
                    $scope.closeThisDialog();
                }
                var counter = 0;
                var timeout;

                function count() {
                    $scope.exampleExternalData = 'Counter ' + (counter++);
                    timeout = $timeout(count, 1000);
                }
                count();
                $scope.$on('$destroy', function () {
                    //alert(1);
                    $timeout.cancel(timeout);
                });
            }]
        });
    };

    //$scope.clickToOpen();
    $scope.clearall = function () {
        //$lbmnotify.show();
        $lbmdialog.show("保存成功！");

        $timeout(function () {
            $lbmdialog.hide();
        }, 2500);

        //$(".tips").show();
        //$lbmdialog.show();
    }
    $scope.close = function () {
        alert(2);
    }
    $scope.info = true;
    $scope.data = [

    ];

    $scope.removeRow = function (index) {
        //alert(index);
        $scope.data.splice(index, 1);
    }
    $scope.model = {};
    $scope.model.Code = "asdf";
    $scope.saveInfo = function () {
        var model = JSON.stringify($scope.model);
        $lbmdialog.show("保存中...");
        $lbDataService.Request("/DataObject/SaveModel", { data: model }).then(function (data) {
            if (data.res) {
                $lbmnotify.tip(data.mes);

            } else {
                $lbmnotify.tip(data.mes);
            }
            $lbmdialog.hide();
            //保存模型信息
        });
    }
    $lbmdialog.showloading();
    $scope.initInfo = function () {
        $lbDataService.Request("/DataObject/GetModel", { dataid: "001" }).then(function (data) {
            //获取模型赋值
            //alert(data);
            if (data.res) {
                $scope.model = data.data;
                $scope.data = data.data.ColList;
               
            }
            $lbmdialog.hideloading();

        });
    }
    $scope.initInfo();
    //$scope.treedata =b.getData();
});

//增加弹窗编辑组件
//增加关联组件
//