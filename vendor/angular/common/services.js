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
            headers: {'Content-Type': undefined}
        }).then(function (resp) {
            if(resp.data.error_code === 0){
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% ';
        });
    }
}]);