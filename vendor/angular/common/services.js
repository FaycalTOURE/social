app.factory('socket', function ($rootScope, $timeout) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $timeout(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $timeout(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.factory('$authentication', function (ipCookie) {
    var cookieName = "authCookie";

    return {
        clearAuthKey: function () {
            return ipCookie.remove(cookieName, {
                path: "/"
            });
        },
        getAuthKey: function () {

            return !!ipCookie(cookieName);

        },
        setAuthKey: function (key) {

            ipCookie(cookieName, key, {
                path: "/"
            });
        }
    }
});

app.factory('getUserinfos', function ($http, $log, $q, $timeout) {
    var deferred = $q.defer();

    return {
        byID: function (id) {
            var promise;

            var request = function(arg){
                $http.get('/user/' + arg)
                     .then(function(response){
                        deferred.resolve(response || '- - -');
                     }, function(){
                        deferred.reject($log.info('Erreur lors du charmgement de donnée.'));
                    });
                return deferred.promise;
            };

           promise = request(id);

           return promise;
        }
    }
});


// rootScope.$apply -> $timeout

// app.factory('myModal', function ($q) {
//     return {
//         loadTemplate : function(arg){
//             var deferred = $q.defer();
//
//             if(!arg){
//                 deferred.reject($log.info('Désolé'));
//                 return deferred.promise;
//             }
//             return $timeout(function(){
//                 $http
//                     .get(arg, { cache: $templateCache })
//                     .then(function(data){
//                         deferred.resolve(data);
//                         return deferred.promise;
//                     });
//             }, 0);
//         },
//         promise : this.loadTemplate(this.load.params.selfTemplate),
//         modalParams : function (params) {
//         },
//         modal : function () {
//         }
//     };
// });
//
// $scope.open = function (data) {
//     var modal = $scope.modal,
//         received = data ? data : '';
//     //reveivedTemplate = $templateCache.get(received.template);
//
//     var deferred = $q.defer();
//
//     var loadTemplate = function(arg){
//         if(!arg){
//             deferred.reject($log.info('Désolé'));
//             return deferred.promise;
//         }
//
//         return $timeout(function(){
//             $http
//                 .get(arg, { cache: $templateCache })
//                 .then(function(data){
//                     deferred.resolve(data);
//                     return deferred.promise;
//                 });
//         }, 0);
//     };
//
//     var promise = loadTemplate(received.template);
//
//     promise.then(function(){
//
//             modal.selfTemplate = received.template;
//             modal.selfTitle = data.title ? data.title : modal.selfTitle;
//             modal.class = data.class;
//             modal.glyph = data.glyph;
//
//             var modalInstance = $uibModal.open({
//                 animation: modal.animationsEnabled,
//                 templateUrl: modal.templateUrl,
//                 controller: modal.controller,
//                 size: received.size,
//                 windowClass: modal.class,
//                 resolve: modal.resolve
//             });
//
//             modalInstance.result.then(function (arg) {
//                 // arg success ex : $scope.selected = arg;
//             }, function () {
//                 // arg error ex : $log.info('Modal dismissed at: ' + new Date());
//             });
//
//         }, function(){
//             data = { template : '', title : 'Erreur de chargement...'};
//             modal.selfTitle = data.title;
//             modal.selfTemplate = '';
//
//             var modalInstance = $uibModal.open({
//                 animation: modal.animationsEnabled,
//                 templateUrl: modal.templateUrl,
//                 controller: modal.controller,
//                 windowClass: modal.class,
//                 resolve: modal.resolve
//             });
//         }
//     );
// };