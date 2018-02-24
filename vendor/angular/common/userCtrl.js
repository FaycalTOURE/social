app.controller('userCtrl', function ($scope, $http, $timeout, $rootScope, getUserinfos) {

    $scope.data = {
        all : null,
        messages : null,
        recommandation : null,
        publish : null
    };

    $scope.user = {
        loadData : function(){
            var r_api = arguments[0];
            return $http.get(r_api);
        },
        user : function(){
            var loadUser = function(){
                $scope.user.loadData.apply(null, ['/user/5a8eee8cf0b30ec86430bc5f'])
                            .then(function(response){
                                console.log('user', response);
                                $scope.data.all = response.data[0];
                                $rootScope.data.all = response.data[0];
                            });
            };
            $timeout(loadUser, 0);
            return this;
        },
        publish : function(){
            var loadPublish = function(){
                $scope.user.loadData.apply(null, ['/user/publish/5a8eee8cf0b30ec86430bc5f'])
                    .then(function(response){
                        console.log('publish', response);
                        for(var i = 0; i < response.data.length; i++){
                            $scope.data.all.publications.list.push(response.data[i]);
                        }
                        console.log('all', $scope.data.all);
                        // $rootScope.$broadcast('publishLoaded',  "deedeeddede");
                    });
            };
            $timeout(loadPublish, 0);
            return this;
        },
        recommandation : function(){
            var loadRecommandation = function(){
                $scope.user.loadData.apply(null, ['/user/recommandation/5a8eee8cf0b30ec86430bc5f'])
                    .then(function(response){
                        var data = response.data;
                        data.forEach(function (result) {
                            // console.log('OK =>', result);
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
            $timeout(loadRecommandation, 0);
            return this;
        }
        // messages : function(){
        //     var loadMessages = function(){
        //         this.loadData.apply('/user/messages/').
        //         then(function(data){
        //             $scope.data.messages = data;
        //         });
        //     };
        //     $timeout(loadMessages, 0);
        // }
    };

    $scope.user.user().publish().recommandation();
});