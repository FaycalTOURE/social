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
            templateUrl : './vendor/app/view/main.html',
            controller : function ($scope, $location, $http, $rootScope, $timeout) {

                // Connexion

                $scope.connexion = function (condition, post) {
                    if(condition && post.email !== null && post.password !== null){
                        $scope.currentPost = angular.copy(post);
                        var req = {
                            method: 'POST',
                            url: '/connexion',
                            data: { client: $scope.currentPost }
                        };
                        $http(req).then(function(response) {
                            var data = response.data;
                            $timeout(function () {
                                $rootScope.userId = data._id;
                                $location.path("/profile");
                            }, 300);
                        });
                    }
                };

            }
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
            templateUrl : './vendor/app/view/account/messages/home.html',
            controller : function ($scope, $http, $rootScope, $location) {

                // Return message infos

                $scope.messageReceiveInfos = function (_id) {

                    for(var index in $rootScope.data.all.friends.list){
                        if($rootScope.data.all.friends.list[index]._id === _id){
                            return $rootScope.data.all.friends.list[index];
                        }
                    }
                };

                // Delete Message

                $scope.deleteMessage = function (_id) {
                    console.log(_id);
                    $http
                        .get('/user/message/delete/'+_id);
                    $location.path('/profile');
                };
            }
        })
        .state('publications', {
            url : '/publications',
            templateUrl : './vendor/app/view/account/publications/home.html',
            controller : function ($scope, $http, $rootScope, $location) {
                $scope.deletePost = function (_id) {
                    $http
                        .get('/user/publish/delete/'+_id);
                    $location.path('/profile');
                };
            }
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
            controller : function ($scope, $http, $rootScope, $location) {
                $scope.deleteUser = function (_id) {
                    $http
                        .get('/user/'+ $rootScope.userId +'/friends/delete/'+_id);
                    $location.path('/profile');
                };
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
                                    $scope.avatar = $scope.data.all.hasOwnProperty('admin') ? 'public/assets/user/' + $rootScope.data.all.admin.avatar.filename : 'http://identicon.org?t='+$rootScope.data.all.user.lastName +'&s=256';
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
             '<div class="alert alert-info" role="alert">'
                + '<a>'
                    + 'Ami(e)s non ajouté(s)' + ' <span class="badge">{{ allUsers.length }}</span>'
                + '</a>'
            + '</div>'
            + '<div class="media well well-sm" ng-repeat="item in allUsers track by $index">'
                +'<div class="media-left">'
                    +'<a href="#">'
                        +'<img class="media-object" ng-src="{{item.admin.avatar.filename ? \'public/assets/user/\' + item.admin.avatar.filename : \'http://identicon.org?t=\'+item.user.lastName+\'&s=256\' }}" alt="...">\n'
                    +'</a>'
                +'</div>'
                +'<div class="media-body">'
                    +'<h4 class="media-heading">{{ item.user.firstName }}</h4>'
                    +'{{ item.user.lastName }}'
                +'</div>'
                +'<div class="action-container not-hidden float-right">'
                +'<ul class="target-action">'
                    +'<li>'
                        +'<a ui-sref="friend({id:item._id})" class="btn btn-info delete white-color" ng-click="cancel()">Voir son profil <span class="glyphicon glyphicon-user"></span></a>'
                    +'</li>'
                    +'<li>'
                        +'<a ng-hide="item.friends.addingProcess.indexOf(userId) !== -1" ng-click="addFriend(item._id)" class="btn btn-success share white-color" ng-class="{disabled: data.all.friends.addingProcess.indexOf(item._id) !== -1}">Ajouter comme ami(e) <span class="glyphicon glyphicon-menu-right"></span></a>'
                        +'<a ng-show="data.all.friends.friendDemands.indexOf(item._id) !== -1" ng-click="addFriendToFriends(item._id)" class="btn btn-danger share white-color" ng-class="{disabled: data.all.friends.addingProcess.indexOf(item._id) !== -1}">Accepter la demande <span class="glyphicon glyphicon-menu-right"></span></a>'
                    +'</li>'
                +'</ul>'
                +'</div>'
             +'</div>'
            +'<div class="media-left" ng-show="allUsers.length === 0">'
                +'<div class="media-body">'
                    +'<h4 class="media-heading">Désolé !</h4>'
                    +'Nous n\'avons trouver aucun ami.'
                +'</div>'
            +'</div>'
            );
        $templateCache.
        put('remove-friend.tpl.html',
            '<div class="media well well-sm" ng-repeat="item in getSUer()">'
                +'<div class="media-left">'
                    +'<a href="#">'
                        +'<img class="media-object" ng-src="{{item.admin.avatar.filename ? \'public/assets/user/\' + item.admin.avatar.filename : \'http://identicon.org?t=\'+item.user.lastName+\'&s=256\' }}" alt="...">\n'
                    +'</a>'
                +'</div>'
                +'<div class="media-body">'
                    +'<h4 class="media-heading">{{ item.user.firstName }}</h4>'
                    +'{{ item.user.lastName }}'
                +'</div>'
                +'<div class="action-container not-hidden float-right">'
                    +'<ul class="target-action">'
                        +'<li>'
                            +'<a ng-click="deleteUser(item._id)" class="btn btn-danger share white-color" ng-class="{disabled: data.all.friends.addingProcess.indexOf(item._id) !== -1}">Supprimer {{ item.user.lastName }}<span class="glyphicon glyphicon-menu-right"></span></a>'
                        +'</li>'
                    +'</ul>'
                +'</div>'
                +'<div class="media-left" ng-show="allUsers.length === 0">'
                    +'<div class="media-body">'
                        +'<h4 class="media-heading">Désolé !</h4>'
                        +'Nous n\'avons trouver aucun ami.'
                    +'</div>'
                +'</div>'
            +'</div>'
        );
        $templateCache.
            put('add-post.tpl.html',
                '<form name="postForm" class="form-horizontal" novalidate role="search" ng-submit="newPost(postForm.$valid, myPost)">'
                    + '<div class="form-group">'
                        + '<label>Titre</label>'
                        + '<input type="text" name="title" class="form-control" placeholder="titre de l\'article" ng-model="myPost.title">'
                    + '</div>'
                    + '<div class="form-group">'
                        + '<label>Contenu</label>'
                        + '<textarea class="form-control" name="content" rows="5" ng-model="myPost.content"></textarea>'
                    + '</div>'
                    + '<div class="form-group">'
                        + '<button type="submit" class="btn btn-default">Publier l\'article</button>'
                    + '</div>'
                + '</form>'
            );
        $templateCache.
        put('create-account.tpl.html',
           '<form name="subscribeForm" class="form-horizontal" ng-submit="createAccount(subscribeForm.$valid, user)" method="post">'
            +'<div class="rendered-form">'

                +'<div class="form-group">'
                    +'<label for="email" class="fb-text-label" ng-required>E-mail</label>'
                    +'<input type="text" class="form-control" name="email" id="email" ng-model="user.email">'
                +'</div>'
                +'<div class="form-group">'
                    +'<label for="password" class="fb-text-label" ng-required>Mot de passe</label>'
                    +'<input type="password" class="form-control" name="password" id="password" ng-model="user.password">'
                +'</div>'

                +'<div class="form-group">'
                    +'<label for="nom" class="fb-text-label" ng-required>Nom</label>'
                    +'<input type="text" class="form-control" name="nom" id="nom" ng-model="user.firstName">'
                +'</div>'
                +'<div class="form-group">'
                    +'<label for="prenom" class="fb-text-label" ng-required>Prénom</label>'
                    +'<input type="text" class="form-control" name="prenom" id="prenom" ng-model="user.lastName">'
                +'</div>'

                +'<div class="form-group">'
                    +'<label for="street" class="fb-text-label" ng-required>Rue</label>'
                    +'<input type="text" class="form-control" name="street" id="street" ng-model="user.street">'
                +'</div>'
                +'<div class="form-group">'
                    +'<label for="city" class="fb-text-label" ng-required>Ville</label>'
                    +'<input type="text" class="form-control" name="city" id="city" ng-model="user.city">'
                +'</div>'

                +'<div class="form-group">'
                    +'<label for="zipcode" class="fb-text-label" ng-required>Code postal</label>'
                    +'<input type="text" class="form-control" name="zipCode" id="zipcode" ng-model="user.zipCode">'
                +'</div>'
                +'<div class="form-group">'
                    +'<label for="pays" class="fb-text-label" ng-required>Pays</label>'
                    +'<input type="text" class="form-control" name="pays" id="pays" ng-model="user.country">'
                +'</div>'

                +'<div class="form-group">'
                    +'<label for="age" class="fb-text-label" ng-required>Age</label>'
                    +'<input type="text" class="form-control" name="age" id="age" ng-model="user.age">'
                +'</div>'

                +'<div class="fb-radio-group form-group field-male">'
                    +'<label for="male" class="fb-radio-group-label">Sexe</label>'
                    +'<div class="radio-group" style="padding-left: 80px;">'
                        +'<div class="radio">'
                            +'<input name="male" id="male-0" value="masculin" type="radio" ng-model="user.sex">'
                            +'<label for="male-0">masculin</label>'
                        +'</div>'
                        +'<div class="radio">'
                            +'<input name="male" id="male-1" value="feminin" type="radio" ng-model="user.sex">'
                            +'<label for="male-1">feminin</label>'
                        +'</div>'
                    +'</div>'
                +'</div>'

                +'<div class="fb-select form-group theme">'
                    +'<label for="theme" class="fb-select-label">Select</label>'
                    +'<select class="form-control" name="theme" id="theme" ng-model="user.theme" ng-required>'
                        +'<option value="user-men" id="theme-1">homme : bleu (blue)</option>'
                        +'<option value="user-women" id="theme-2">femme : rose (pink) </option>'
                    +'</select>'
                +'</div>'

                    +'<button type="submit" class="btn btn-default">M\'inscrire</button>'
                +'</div>'
            +'</form>'
        );
    });

