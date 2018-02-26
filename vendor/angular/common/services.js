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
        byID: function (id) {
            $http.get('/user/' + id)
                 .then(function(response){
                    deferred.resolve(response || '- - -');
                 }, function(){
                    deferred.reject($log.info('Erreur lors du charmgement de donnée.'));
                 });
           return deferred.promise;
        }
    }
});