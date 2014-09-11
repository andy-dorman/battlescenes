;(function(){
    "use strict";
    var bsServices = angular.module('bsServices', ['ngResource', 'firebase']);

    bsServices.factory("Filters",
        function() {
            return {
                category: "",
                searchTerm: ""
            }
        });

    bsServices.constant('FIREBASE_PRODUCT_URI', 'https://shining-fire-4276.firebaseio.com/products');
    bsServices.constant('FIREBASE_CATEGORIES_URI', 'https://shining-fire-4276.firebaseio.com/categories');

    bsServices.service("ProductService", ['$resource', '$firebase', 'FIREBASE_PRODUCT_URI',
        function($resource, $firebase, FIREBASE_PRODUCT_URI) {
            var ref = new Firebase(FIREBASE_PRODUCT_URI);

            /*console.log(ref.child('safename').startAt('6mm-defence-bunker').endAt('6mm-defence-bunker').once(function(snap){
                console.log(snap.val());
            }));*/
            var sync = $firebase(ref);

            var addProduct = function(product) {
                sync.$add(product, function(err) {
                    if(err) {
                        alert(err);
                    }
                });
            };
            //sync.$loaded().then(function(){
            //    console.log("loaded records", sync.$id, sync['safename']);
            //});
            /*sync.$loaded().then(function(){
                ref.child('safename').startAt('6mm-defence-bunker').endAt('6mm-defence-bunker').once('value', function(snap){
                    console.log(snap.val());
                })
            });*/

            var getProduct = function(productId) {
                console.log(sync.$asArray().$keyAt(0));
                return sync.$asArray().$getRecord("/"+productId);
            };

            return {
                addProduct: addProduct,
                products: sync,
                getProducts: sync.$asArray(),
                getProduct: getProduct
            }
        }]);

    bsServices.service("CategoryService", ['$resource', '$firebase', 'FIREBASE_CATEGORIES_URI',
        function($resource, $firebase, FIREBASE_CATEGORIES_URI) {
            var ref = new Firebase(FIREBASE_CATEGORIES_URI);
            var sync = $firebase(ref);

            var categories = sync.$asArray();

            var addCategory = function(category) {
                sync.$push(category, function(err) {
                    if(err) {
                       alert(err);
                    }
                });
            };

            return {
                categories: categories,
                addCategory: addCategory
            }
        }]);

    bsServices.factory("Products", ['$resource',
        function($resource) {
            return $resource('products/:productId.json', {}, {
                query: {
                    method: 'GET',
                    params: { productId: 'products' },
                    isArray: true
                    }
            });
        }]);
})();
