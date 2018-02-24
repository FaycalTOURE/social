app.filter('getName', function($http) {
        return function(id) {
            var value = '';
            var deferred = $q.defer();

            $http.get('/user/' + id).
            then(function(response){
                value = response.data[0].user.lastName + ', ' + response.data[0].user.firstName;
                deferred.resolve(value);
            });
        };
}).filter('to', function() {
    return function() {
        return;
    };
}).filter('recommanded', function() {
    return function() {
        return;
    };
});


//
// app.filter("testf", function($http, $log, $q) {
//     return function (id) {
//
//         var value = null, data = null;
//         var deferred = $q.defer();
//
//         var request = function(id){
//             $http.get('/user/' + id).
//             then(function(response){
//                 value = response.data[0].user.lastName + ', ' + response.data[0].user.firstName;
//                 console.log(value);
//                 deferred.resolve(value);
//             }, function(response){
//                 deferred.reject($log.info('Erreur lors du charmgement de donnée.'));
//                 throw "Erreur lors du charmgement de donnée.";
//             });
//             return deferred.promise;
//         };
//
//         var promise = request(id);
//
//         promise.then(function(result){
//              data = result;
//         });
//     }
// });


