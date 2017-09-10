(function($) {
    $(document).ready(function() {
        console.log('test');
        var slider = $('input'),
            radispan = $('#brad');
            sides = $('.side');

         slider.change(function(){
             var radius = parseInt((slider.attr('value')),10);
             radispan.text(radius);
             sides.css('border-radius', radius);
         });
    });

})(jQuery);// JavaScript Document