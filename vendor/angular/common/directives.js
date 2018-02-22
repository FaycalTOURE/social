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
                    iElement.toggleClass('open');
                }else{
                    iElement.removeClass('open');
                }
                $event.preventDefault();
            });
        }
    }
});

app.directive('stickyBlock', function($window){
    return{
        link : function(scope, el, attrs, ctrl){
            var target = $('.' + attrs.outerClass),
                targetHeader = target.offset();

            var spacer = attrs.verticalSpace,
                scroll = $window;

            angular.element(scroll).bind('scroll', function() {
                if (scroll.pageYOffset >= targetHeader.top
                    + (el.height()
                    + spacer !== undefined ? parseInt(spacer) : 0))
                {
                    el.addClass(attrs.innerClass);
                } else {
                    el.removeClass(attrs.innerClass);
                }
            });

            // // Hover Scroll
            // el.on('mouseenter', function() {
            //     $('html').css('overflow', 'hidden');
            // });
            // el.on('mouseleave', function() {
            //     $('html').css('overflow', 'auto');
            // });
        }
    }
});