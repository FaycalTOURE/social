'use strict';
var app  = angular.module('app', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'ui.router.stateHelper',
    'ui.router.login',
    'ipCookie'
    ])
    .config(function ($stateProvider, $urlRouterProvider, stateHelperProvider, $loginProvider) {
    $stateProvider
        .state('index', {
            url : '/index',
            templateUrl : './vendor/app/view/main.html'
        })
        .state('account', {
            url : '/account',
            templateUrl : './vendor/app/view/account/main.html'
        })
        .state('profile', {
            url : '/profile',
            templateUrl : './vendor/app/view/account/profile/home.html',
            controller : 'userCtrl'
        })
        .state('messages', {
            url : '/messages',
            templateUrl : './vendor/app/view/account/messages/home.html'
        })
        .state('publications', {
            url : '/publications',
            templateUrl : './vendor/app/view/account/publications/home.html'
        })
        .state('wall', {
            url : '/wall',
            templateUrl : './vendor/app/view/account/wall/home.html'
        })
        .state('super-user', {
            url : '/super-user',
            templateUrl : './vendor/app/view/account/super-user-home.html'
        })
        .state('friends', {
            url : '/friends',
            templateUrl : './vendor/app/view/account/friends/home.html',
            controller : function ($scope, $timeout, getUserinfos) {
                $scope.allUsers = [];
                $scope.user = {
                    loadUsers : function () {
                        var loadall = function () {
                            getUserinfos.all()
                                .then(function (response) {
                                    for(var i = 0; i < response.data.length; i++){
                                        $scope.allUsers.push(response.data[i]);
                                    }
                                });
                        };
                        $timeout(loadall, 500);
                        return this;
                    }
                };
                $scope.user.loadUsers();
                console.log('n n n n n n ', $scope.allUsers);
            }
        })
        .state('friend', {
            url : '/friend/{id}',
            templateUrl : './vendor/app/view/account/profile/friend.html',
            controller : function ($stateParams, $rootScope, $scope, $timeout, $http) {

                $scope.userId = $stateParams.id;

                $scope.user = {
                    loadData : function(){
                        var r_api = arguments[0];
                        return $http.get(r_api);
                    },
                    user : function(){
                        var loadUser = function(){
                            $scope.user.loadData.apply(null, ['/user/' + $scope.userId])
                                .then(function(response){
                                    console.log('user', response);
                                    $scope.data.all = response.data[0];
                                    $rootScope.data.all = response.data[0];
                                    console.log($scope.data.all, $scope.data.all, $scope.data.all);
                                    $scope.avatar = $scope.data.all.hasOwnProperty('admin') ? 'public/assets/user/' + $scope.data.all.admin.avatar.filename : 'https://s-media-cache-ak0.pinimg.com/originals/ca/14/3a/ca143acfbafaa5762c839eba433822f1.png';
                                });
                        };
                        $timeout(loadUser, 0);
                        return this;
                    },
                    publish : function(){
                        var loadPublish = function(){
                            $scope.user.loadData.apply(null, ['/user/publish/' + $scope.userId])
                                .then(function(response){
                                    console.log('publish', response);
                                    for(var i = 0; i < response.data.length; i++){
                                        $scope.data.all.publications.list.push(response.data[i]);
                                    }
                                });
                        };
                        $timeout(loadPublish, 100);
                        return this;
                    },
                    recommandation : function(){
                        var loadRecommandation = function(){
                            $scope.user.loadData.apply(null, ['/user/recommandation/' + $scope.userId])
                                .then(function(response){
                                    var data = response.data;

                                    data.forEach(function (result) {
                                        var logs = result.recommandation.logs;
                                        var from = logs.from;
                                        var recommanded = logs.recommanded;

                                        $http.get('/user/' + from)
                                            .then(function (success) {
                                                result.recommandation.logs.from = success.data[0].user.firstName;
                                                result.recommandation.logs.fromId = success.data[0]._id;
                                            });

                                        $http.get('/user/' + recommanded)
                                            .then(function (success) {
                                                result.recommandation.logs.recommanded = success.data[0].user.firstName;
                                                result.recommandation.logs.recommandedId = success.data[0]._id;
                                            });

                                        $scope.data.all.friends.recommandations.push(result);
                                    });
                                });
                        };
                        $timeout(loadRecommandation, 200);
                        return this;
                    }
                };

                $scope.user.user().publish().recommandation();
            }
        });

    // stateHelperProvider
    //     .state({
    //         name: "public",
    //         url: "/",
    //         abstract: true,
    //         children: [{
    //             name: "login",
    //             abstract: true,
    //             children: [{
    //                 name: "connexion",
    //                 url: "/login",
    //                 views: {
    //                     "content@": {
    //                         template: "login",
    //                         controllerAs: "vm"
    //                     }
    //                 },
    //                 children: [{
    //                     name: "process",
    //                     url: "/process",
    //                     views: {
    //                         "content@": {
    //                             template: "hello",
    //                             controller: function ($authentication, $login) {
    //                                 $authentication.setAuthKey("key");
    //                                 $login.getLoginRedirect();
    //                             }
    //                         }
    //                     }
    //                 }]
    //             }]
    //         }, {
    //             name: "private",
    //             abstract: true,
    //             data: {
    //                 requireLogin: true
    //             },
    //             children: [{
    //                 name: "home",
    //                 url: "/vendor/app/view/account/main",
    //                 data: {
    //                     saveState: false
    //                 },
    //                 views: {
    //                     "content@": {
    //                         controller: function ($login) {
    //                             return $login.logout(true);
    //                         }
    //                     }
    //                 }
    //             }]
    //         }]
    //     });

    $loginProvider
        .setDefaultLoggedInState ("public")
        .setFallbackState("login")
        .setAuthModule("$authentication")
        .setAuthClearMethod("clearAuthKey")
        .setAuthGetMethod("getAuthKey")
        .setCookieName("__loginState");

    $urlRouterProvider
        .otherwise('/')
        .when('', '/');
    })
    .run(function($templateCache) {
        $templateCache.
            put('size-options.tpl.html',
                '<ul class="list-menu right">'
                    + '<li>'
                        + '<a href="#" class="rs-db" ng-class="ui.icoSize">'
                            + '<span class="pull-left">'
                                + '<span class="rs-db glyphicon glyphicon-text-size"></span>'
                            + '</span>'
                            + '<span class="pull-right">'
                                + '<select ng-model="$parent.ui.icoSize" class="form-control">'
                                    + '<option value="ico-size">s</option>'
                                    + '<option value="ico-size-xl">xl</option>'
                                    + '<option value="ico-size-xxl">xxl</option>'
                                + '</select>'
                            + '</span>'
                        + '</a>'
                    + '</li>'
                + '</ul>'
            );
        $templateCache.
            put('customPopupTemplate.html',
                '<div class="custom-popup-wrapper" ng-style="{top: position().top+'+ 'px' +', left: position().left+'+ 'px' +'}" style="display: block;"ng-show="isOpen() && !moveInProgress"aria-hidden="{{!isOpen()}}">'
                    + '<p class="message">select location from drop down.</p>'
                    + '<ul class="dropdown-menu" role="listbox">'
                        + '<li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{::match.id}}">'
                            + '<div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>'
                        + '</li>'
                    + '</ul>'
                + '</div>'
            );
        $templateCache.
            put('add-friend.tpl.html',
            '<div class="media" ng-repeat="item in allUsers">'
                +'<div class="media-left">'
                    +'<a href="#">'
                        +'<img class="media-object" ng-src="public/assets/user/{{ item.admin.avatar.filename }}" src="https://s-media-cache-ak0.pinimg.com/originals/ca/14/3a/ca143acfbafaa5762c839eba433822f1.png" alt="...">'
                    +'</a>'
                +'</div>'
                +'<div class="media-body">'
                    +'<h4 class="media-heading">{{ item.user.firstName }}</h4>'
                    +'{{ item.user.lastName }}'
                +'</div>'
                +'<div class="action-container float-right">'
                +'<ul class="target-action">'
                    +'<li>'
                        +'<a href="{{ item._id }}" class="btn btn-default delete"><span class="glyphicon glyphicon-trash"></span></a>'
                    +'</li>'
                    +'<li>'
                        +'<a href="{{ item._id }}" class="btn btn-default share"><span class="glyphicon glyphicon-envelope"></span></a>'
                    +'</li>'
                    +'<li>'
                        +'<a ui-sref="friend({id:item._id})" class="btn btn-default share">suivre <span class="glyphicon glyphicon-menu-right"></span></a>'
                    +'</li>'
                +'</ul>'
                +'</div>'
             +'</div>'
            );
    });

