(function () {
    var services = angular.module("lbm.common.services", []);

    services.factory('$lbmdialog', ['$rootScope', '$http', '$q', '$timeout', '$location', '$compile',

		function ($rootScope, $http, $q, $timeout, $location, $compile) {
		    var stack = [];
		    var _dialog = {};
		    var _compiled;
		    return {
		        show: function (message) {

		            var self = this;
		            var _scope = $rootScope.$new();
		            _scope.$dialog = _dialog;
		            var _element = angular.element('<div class="lee-loading-mask" ng-show="$dialog.isActive"></div><div class="lee-loading-content" ng-show="$dialog.isActive"><div class="lee-loading-header"><div class="app-saving-loading-icon ui text inline active loader"></div><div class="app-saving-loading-msg"  ng-click="close()" >正在保存......</div></div></div>');
		            var _parent = angular.element('body');
		            _compiled = $compile(_element)(_scope);
		            _parent.addClass('hc-dialog-show');
		            _parent.append(_compiled);
		            _dialog.isActive = true;
		            _scope.close = function () {
		                self.hide();
		            }

		        },
		        hide: function () {
		            _dialog.isActive = false;


		            $timeout(function () {
		                _compiled.remove();

		            }, 400);
		        },
		        showloading: function (message) {

		            $rootScope.isloading = true;

		        },
		        hideloading: function () {
		            $rootScope.isloading = false;
		        },
		        showtoast: function () {
		            $rootScope.istoast = true;
		        },
		        hidetoast: function () {
		            $rootScope.istoast = false;
		        }
		    };
		}
    ]);

    services.factory('$lbmnotify', ['$rootScope', '$http', '$q', '$timeout', '$location', '$compile',

		function ($rootScope, $http, $q, $timeout, $location, $compile) {
		    var stack = [];
		    var _dialog = {};
		    var _compiled;
		    return {
		        show: function (message, time) {

		            var self = this;
		            var _scope = $rootScope.$new();
		            _scope.$dialog = _dialog;
		            var _element = angular.element('<div class="lee-notify center"><div class="tips" ng-show="$dialog.isActive">{{$dialog.mes}}</div></div> ');
		            var _parent = angular.element('body');
		            _compiled = $compile(_element)(_scope);
		            _parent.addClass('hc-dialog-show');
		            _parent.append(_compiled);
		            _dialog.isActive = true;
		            _dialog.mes = message;
		            _scope.close = function () {
		                self.hide();
		            }
		            stack.push(_compiled);

		        },
		        tip: function (mes, time) {
		            var t = 1000 || time;
		            this.show(mes);
		            var self = this;
		            $timeout(function () {
		                self.hide();
		            }, t);

		        },
		        hide: function () {
		            _dialog.isActive = false;


		            $timeout(function () {
		                _compiled.remove();

		            }, 400);
		        }
		    };
		}
    ]);




    services.factory('$lbDataService', ['$rootScope', '$http', '$q', '$timeout', '$location',
        function ($rootScope, $http, $q, $timeout, $location) {
            return {
                GetSiteFolder: function () {
                    return "http://localhost/FormBuilder.Web";
                },
                CreateApiUri: function (api_name, flag) {
                    var url = this.GetSiteFolder() + api_name;

                    var v = "0.1";
                    url += "?v=" + v;
                    return url;
                },
                Request: function (api_name, api_params) {
                    var headers = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    };
                    api_params = $.param(api_params);
                    headers["headers"]["lbsignkey"] = "";
                    var defer = $q.defer();
                    var _url = this.CreateApiUri(api_name);
                    window.setTimeout(function () {
                        $http.post(_url, api_params, headers).success(function (data) {
                            defer.resolve(data);
                        }).error(function (data) {
                            defer.reject(data);
                        });
                    }, 500);
                    return defer.promise;
                }
            };
        }
    ]);

}).call(this);