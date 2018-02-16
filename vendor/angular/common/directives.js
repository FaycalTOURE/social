app.directive('dropDown', function($window, $document){
    return{
        templateUrl : function(element, iAttrs) {
            return iAttrs.dropDown || 'default.html';
        },
        replace : true,
        transclude : true,
        scope : { dropDown : '@', ngClass : '=icoSize'},
        link : function (scope, iElement, iAttrs) {
            iElement.on('click', function ($event) {
                if(!iElement.hasClass('open')){
                    iElement.addClass('open');
                }else{
                    iElement.removeClass('open');
                }
                $event.preventDefault();
            });
        }
    }
});