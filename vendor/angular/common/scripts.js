'use strict';
var app  = angular.module('app', ['ngAnimate', 'ui.bootstrap']);

// app.config(function ($stateProvider) {
//     $stateProvider
//         .state('index', {
//             url : '/index',
//             templateUrl : './vendor/app/view/main/main.html'
//         });
// }).config(function ($urlRouterProvider){
//     $urlRouterProvider.otherwise('/index');
// });

app.run(function($templateCache) {
    $templateCache.put('size-options.tpl.html',
        '<ul class="list-menu right">'
            + '<li>'
                + '<a href="#" class="rs-db" ng-class="ui.icoSize">'
                    + '<span class="pull-left">'
                        + '<span class="rs-db glyphicon glyphicon-text-size"></span>'
                    + '</span>'
                    + '<span class="pull-right">'
                        + '<select ng-model="$parent.ui.icoSize">'
                            + '<option value="ico-size">s</option>'
                            + '<option value="ico-size-xl">xl</option>'
                            + '<option value="ico-size-xxl">xxl</option>'
                        + '</select>'
                    + '</span>'
                + '</a>'
            + '</li>'
        + '</ul>'
    );
});

