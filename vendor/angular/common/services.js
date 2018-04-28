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

app.factory('getUserinfos', function ($http, $log, $q) {
    var deferred = $q.defer();
    return {
        all: function () {
            $http.get('/user')
                 .then(function(response){
                    deferred.resolve(response || '- - -');
                 }, function(){
                    deferred.reject($log.info('Erreur lors du charmgement de donnée.'));
                 });
           return deferred.promise;
        },
        userId: function (_id) {
            $http.get('/user/' + _id)
                .then(function(response){
                    deferred.resolve(response || '- - -');
                }, function(){
                    deferred.reject($log.info('Erreur lors du charmgement de donnée.'));
                });
            return deferred.promise;
        }
    }
});

app.service('fileUpload', ['$http', '$window', '$rootScope', function ($http, $window, $rootScope) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        var fid = $rootScope.data.all._id;
        fd.append('file', file, fid);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },
            eventHandlers: {
                readystatechange: function(event) {
                    if(event.currentTarget.readyState === 4) {
                        $window.location.reload();
                        console.log("readyState=4: Server has finished extra work!");
                    }
                }
            },
            uploadEventHandlers: {
                progress: function(e) {
                    if (e.lengthComputable) {
                        $rootScope.progress = Math.round(e.loaded * 100 / e.total);
                        $rootScope.progressmax = Math.round(e.total);
                        $rootScope.progressvalue = Math.round(e.loaded);
                        console.log("progress: " + $rootScope.progress + "%");
                        if (e.loaded == e.total) {
                            console.log("File upload finished!");
                            $rootScope.goUpload = !$rootScope.goUpload;
                        }
                    }
                }
            }
        }).then(function () {});
    }
}]);