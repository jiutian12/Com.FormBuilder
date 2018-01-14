(function () {
    var directives = angular.module('lbm.common.directives', ['lbm.common.services']);
    directives.directive('observe', function ($lbDataService) {
        return {
            restrict: 'E',
            scope: {
                totalItems: "=totalitems",
                itemsPerpage: "=itemsperpage"
            },
            controller: function ($scope, pagerConfig) {
                // 共多少条

                //收起的个数
                //show satrt..
                //show end..
                //pageinfo

                //$scope.totalItems = 0;
                $scope.page = [];
                // 偏移数
                $scope.offsetPage = 0;
                // 一页多少条
                //$scope.itemsPerpage = 0;
                // 一个多少页
                $scope.totalPages = 0;
                $scope.currentPage = 0;

                $scope.$watch('totalItems', function () {
                    $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerpage);

                    resetPageList();

                });

                var getInterval = function () {
                    //中间部分为4页
                    var current = $scope.currentPage;
                    var interval = 4;
                    var half = Math.ceil(interval / 2);
                    var npage = $scope.totalPages; //页数
                    var upper_limit = npage - interval;
                    var start = current > half ? Math.max(Math.min(current - half, upper_limit), 0) : 0;
                    var end = current > half ? Math.min(current + half, npage) : Math.min(interval, npage);
                    return [start, end];
                };

                var resetPageList = function () {
                    $scope.page = [];
                    var np = $scope.totalPages; //页数
                    var interval = getInterval();
                    if (interval[0] > 0) {
                        var end = Math.min(1, interval[0]);

                        for (var i = 0; i < end; i++) {
                            var active = $scope.currentPage == i ? true : false;
                            $scope.page.push({
                                text: i + 1,
                                indexPage: i,
                                active: active
                            });
                        }
                        if (1 < interval[0]) {
                            $scope.page.push({
                                text: "...",
                                indexPage: -1,
                                active: false
                            })
                        }
                    }
                    for (var i = interval[0]; i < interval[1]; i++) {
                        var active = $scope.currentPage == i ? true : false;
                        $scope.page.push({
                            text: i + 1,
                            indexPage: i,
                            active: active
                        });
                    }
                    if (interval[1] < np) {
                        if (np - 1 > interval[1]) {
                            $scope.page.push({
                                text: "...",
                                indexPage: -1,
                                active: false
                            })
                        }
                        var begin = Math.max(np - 1, interval[1]);
                        for (var i = begin; i < np; i++) {
                            var active = $scope.currentPage == i ? true : false;
                            $scope.page.push({
                                text: i + 1,
                                indexPage: i,
                                active: active
                            });
                        }

                    }

                }
                var getOffset = function (index) {

                    var offset = Math.min(index, $scope.totalPages - $scope.listSizes);
                    if (offset <= 0) {
                        offset = 0;
                    }
                    return offset;
                };
                $scope.selectPage = function (index) {

                    if (index < 0 || index >= $scope.totalPages) {
                        return;
                    }

                    $scope.currentPage = index;

                    resetPageList();

                    $scope.$emit('pagechage', $scope.currentPage);
                };
                $scope.next = function () {
                    if ($scope.isLast()) {
                        return;
                    }
                    $scope.selectPage($scope.currentPage + 1);
                };
                $scope.provie = function () {
                    if ($scope.isFirst()) return
                    $scope.selectPage($scope.currentPage - 1);
                }

                $scope.showgo = function () {
                    return $scope.page.length > 5;
                }
                $scope.first = function () {
                    $scope.selectPage(0);
                }
                $scope.last = function () {
                    $scope.selectPage($scope.totalPages - 1);
                }
                $scope.isFirst = function () {
                    return $scope.currentPage <= 0;
                };
                $scope.isLast = function () {
                    return $scope.currentPage >= $scope.totalPages - 1;
                }
                $scope.getText = function (key) {
                    return pagerConfig.text[key];
                };

            },
            link: function (scope, ele, attrs) {

                //scope.itemsPerpage = attrs.itemsperpage || 1;
                //scope.listSizes = attrs.listsizes;
                //attrs.$observe('totalitems', function (val) {
                //    scope.totalItems = val;
                //})
            },
            templateUrl: $lbDataService.GetSiteFolder() + '/Tmpl/pager.html'
        }
    }).constant('pagerConfig', {
        text: {
            'first': '首页',
            'provie': '上一页',
            'next': '下一页',
            'last': '尾页',
        }
    });


}).call(this);