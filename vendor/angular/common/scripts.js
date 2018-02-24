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
            templateUrl : './vendor/app/view/account/friends/home.html'
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
    $templateCache.put('size-options.tpl.html',
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
/*    $templateCache.put('customPopupTemplate.html',
        '<div class="custom-popup-wrapper" ng-style="{top: position().top+'+ 'px' +', left: position().left+'+ 'px' +'}" style="display: block;"ng-show="isOpen() && !moveInProgress"aria-hidden="{{!isOpen()}}">'
            + '<p class="message">select location from drop down.</p>'
            + '<ul class="dropdown-menu" role="listbox">'
                + '<li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{::match.id}}">'
                    + '<div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>'
                + '</li>'
            + '</ul>'
    + '</div>'
    );*/
});

