'use-strict';

// Main ctrl

app.controller('mainCtrl', function($scope, $rootScope, $uibModal,
                                    $log, $document, $window, $timeout,
                                    $q, $templateCache, $http){

    $rootScope.userId = '';

    $rootScope.data = {
        all : null
    };

    $rootScope.goUpload = false;

    var hydrate = function(one, two){
        var data = {};
        for(var index in one){
            if(one.hasOwnProperty(index) && one[index] == null){
                data[index] = one[index];
            }
        }
        for(var index in two){
            if(one.hasOwnProperty(index) && two.hasOwnProperty(index)){
                one[index] = two[index];
            }
        }
    };

    var initObj = function(inner, outer){
        for(var index in outer){
            inner[index] = outer[index];
        }
    };

    $scope.ui = {
        icoSize : 'ico-size'
    };

    // Modal

    $scope.modal = {
        animationsEnabled : false,
        title : null,
        template : null,
        templateUrl : 'modalBody.html',
        controller : 'modalInstanceCtrl',
        class : null,
        glyph : null,
        resolve : {
            modal: function () {
                return $scope.modal;
            },
            ui : function () {
                return $scope.ui;
            }
        }
    };

    // Promise Modal

    $scope.open = function (data) {
        var modal = $scope.modal,
            received = data ? data : '';

        var deferred = $q.defer();

        var loadTemplate = function(arg){
            if(!arg || !$templateCache.get(arg)){
                deferred.reject($log.info('Erreur lors du charmgement du contenu de la modal.'));
                return deferred.promise;
            }

            return $timeout(function(){
                $http
                    .get(arg, { cache: $templateCache })
                    .then(function(data){
                        if(data.status === 200){
                            deferred.resolve(data);
                            return deferred.promise;
                        }
                    });
            }, 0);
        };

        var promise = loadTemplate(received.template);

        promise.then(function(){

                hydrate(modal, data);

                var modalInstance = $uibModal.open({
                    animation: modal.animationsEnabled,
                    templateUrl: modal.templateUrl,
                    controller: modal.controller,
                    size: received.size,
                    windowClass: modal.class,
                    resolve: modal.resolve
                });

                modalInstance.result.then(function (arg) {
                    //
                }, function () {
                    $log.info('Action annulé: ' + new Date());
                });

            }, function(){

                data = { template : '', title : 'Erreur de chargement...'};

                initObj(modal, { title : data.title, template : '', glyph : '' });

                hydrate(modal, data);

                var modalInstance = $uibModal.open({
                    animation: modal.animationsEnabled,
                    templateUrl: modal.templateUrl,
                    controller: modal.controller,
                    windowClass: modal.class,
                    resolve: modal.resolve
                });

                modalInstance.result.then(function (arg) {
                    //
                }, function () {
                    $log.info('Action annulé: ' + new Date());
                });
            }
        );
    };
});


// Modal


app.controller('modalInstanceCtrl', function ($scope, $uibModalInstance, modal, ui, $http, $rootScope, $location, $timeout) {
    $scope.alertMessage = true;
    $scope.ui  = ui;
    $scope.modal = modal;

    // AddNew Friends

    $scope.addFriend = function (_id) {
        $http
            .get('/user/'+ $rootScope.userId +'/friends/addProcess/'+_id);
        $scope.cancel();
        $location.path('/profile');
    };

    $scope.addFriendToFriends = function (_id) {
        $http
            .get('/user/'+ $rootScope.userId +'/friends/addFriend/'+_id);
        $scope.cancel();
        $location.path('/profile');
    };

    // Friends list
    $scope.allUsers = [];

    $http.get('/user').
    then(function (response) {
        // we stock ofs currents member and compare to all
        var idToCompare = [$rootScope.userId];

        for(var i = 0; i < $rootScope.data.all.friends.list.length; i++){
            idToCompare.push($rootScope.data.all.friends.list[i]._id);
        }

        for(var i in response.data){
            if(idToCompare.indexOf(response.data[i]._id) === -1){
                $scope.allUsers.push(response.data[i]);
            }
        }
    });

    // New post

    $scope.newPost = function (condition, post) {
        if(condition && post.title !== null && post.content !== null){
            $scope.currentPost = angular.copy(post);
            var req = {
                method: 'POST',
                url: '/user/'+$scope.userId +'/publish/add',
                data: { clientPost: $scope.currentPost }
            };
            $http(req).then(function successCallback(response) {
                var data = response.data;
                if(data.status === 200){
                    $location.path("/profile");
                    $scope.cancel();
                }
            });
        }
    };

    // Create Account

    $scope.createAccount = function (condition, post) {
        if(condition && post.email !== null && post.password !== null){
            $scope.currentPost = angular.copy(post);
            var req = {
                method: 'POST',
                url: '/process',
                data: { user: $scope.currentPost }
            };
            $http(req).then(function(response) {
                var data = response.data;
                $timeout(function () {
                    $scope.alertMessage = true;
                    $scope.cancel();
                }, 300);
            });
        }
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


// Head ctrl

app.controller('headerCtrl', function () {

});


// Footer ctrl

app.controller('footerCtrl', function () {

});


app.controller('TypeaheadPublishCtrl', function($scope, $http, $rootScope) {
    $scope.states = $rootScope.data.all.publications.list;
});

app.controller('TypeaheadMessageCtrl', function($scope, $http, $rootScope) {
    $scope.states = $rootScope.data.all.messages.received.concat($rootScope.data.all.messages.sended);
});

app.controller('TypeaheadFriendsCtrl', function($scope, $http, $rootScope) {
    $scope.states = $rootScope.data.all.friends.list;
});

app.controller('uploadCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var uploadUrl = "/upload";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
}]);