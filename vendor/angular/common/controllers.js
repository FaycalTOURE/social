'use-strict';

// Main ctrl

app.controller('mainCtrl', function($scope, $rootScope, $uibModal, $log, $document, $window, $timeout, $q, $templateCache, $http){

    $rootScope.data = {
        all : null
    };

    // Récupérer les valeurs non initiés et initier avec la data
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
        // return data;
        // peux retourner nouveau tablea mettre code data[index] a la place de one[index] dans boucle 2
    };

    // Personnaliser valeurs de mon Tableau
    var initObj = function(inner, outer){
        for(var index in outer){
            inner[index] = outer[index];
        }
        //return inner
        // peux retourner nouveau tablea
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
        //reveivedTemplate = $templateCache.get(received.template);

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

app.controller('modalInstanceCtrl', function ($scope, $uibModalInstance, modal, ui) {
    $scope.ui  = ui;
    $scope.modal = modal;

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