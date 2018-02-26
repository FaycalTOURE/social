app.controller('userCtrl', function ($scope, $http, $timeout, $rootScope, getUserinfos) {
    $scope.userId = $rootScope.userId;
    $scope.data = {
        all : null
    };

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
                                $scope.avatar = $scope.data.all.hasOwnProperty('admin') ? 'public/assets/user/' + $rootScope.data.all.admin.avatar.filename : 'https://s-media-cache-ak0.pinimg.com/originals/ca/14/3a/ca143acfbafaa5762c839eba433822f1.png';
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
        },
        message : function(){
            var loadMessages = function(){
                $scope.user.loadData.apply(null, ['/user/message/' + $scope.userId]).
                then(function(response){
                    console.log('messages', response);

                    for(var i = 0; i < response.data.length; i++){
                        if(response.data[i].message.logs.from === $scope.userId){
                            $scope.data.all.messages.sended.push(response.data[i]);
                        }
                        if(response.data[i].message.logs.to === $scope.userId){
                            $scope.data.all.messages.received.push(response.data[i]);
                        }
                    }
                });
            };
            $timeout(loadMessages, 300);
            return this;
        },
        friend : function () {
            var loadFriends = function () {
                for(var i = 0; i < $scope.data.all.friends.list.length; i++){
                    $http.get('/user/' + $scope.data.all.friends.list[i]).
                          then(function (response) {
                            console.log('friends', response);
                              if(response.data[0].hasOwnProperty('_id')){
                                    if($scope.data.all.friends.list.indexOf($scope.data.all.friends.list[i]) !== -1){
                                        $scope.data.all.friends.list.splice(0, $scope.data.all.friends.list.indexOf($scope.data.all.friends.list[i]));
                                    }
                                    $scope.data.all.friends.list.push(response.data[0]);
                              }
                        });
                }
                console.log('All =>  Datas =>', $scope.data.all);
            };
            $timeout(loadFriends, 400);
            return this;
        }
    };

    $scope.user.user().publish().recommandation().message().friend();
});