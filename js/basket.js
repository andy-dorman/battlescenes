;(function(){
    var basket = angular.module('basket', []);

    basket.factory("Basket", function() {
        var basket = [];
        var addToBasket = function(product) {
            basket.push(product);
        };
        var basketCount = function() {
            return basket.length;
            //return basket.length > 0 ? basket.length + " item" + (basket.length > 1 ? "s" : "") + " in your basket" : "Basket empty";
        };

        return {
            basket: basket,
            addToBasket: addToBasket,
            basketCount: basketCount
        };
    });

})();
