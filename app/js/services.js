;(function(){
    "use strict";
    var bsServices = angular.module('bsServices', ['ngResource', 'ngCookies', 'firebase']);

    bsServices.factory("Filters",
        function() {
            return {
                category: "",
                searchTerm: "",
                subcategory: ""
            }
        });

    bsServices.constant('FIREBASE_URI', 'https://shining-fire-4276.firebaseio.com');
    bsServices.constant('FIREBASE_PRODUCT_URI', 'https://shining-fire-4276.firebaseio.com/products');
    bsServices.constant('FIREBASE_CATEGORIES_URI', 'https://shining-fire-4276.firebaseio.com/categories');
    bsServices.constant('FIREBASE_ENQUIRIES_URI', 'https://shining-fire-4276.firebaseio.com/enquiries');

    bsServices.service("ProductService", ['$resource', '$firebase', 'FIREBASE_URI',
        function($resource, $firebase, FIREBASE_URI) {
            var ref = new Firebase(FIREBASE_URI + '/products');

            /*console.log(ref.child('safename').startAt('6mm-defence-bunker').endAt('6mm-defence-bunker').once(function(snap){
                console.log(snap.val());
            }));*/
            var products = $firebase(ref);
            var refByLive = new Firebase(FIREBASE_URI + '/productsByLive');
            
            var liveProducts = $firebase(refByLive);

            var refByLiveCategory = new Firebase(FIREBASE_URI + '/productsLiveByCategory');
            var liveCategories = new Firebase(FIREBASE_URI + '/productsLiveByCategory');

            var addProduct = function(product) {
                products.$add(product, function(err) {
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
                return products.$asArray().$getRecord("/"+productId);
            };

            var Product = {
                all: products,
                live: liveProducts,
                create: function (name, product) {
                  return products.$set(name, product).then(function (ref) {
                    var productId = ref.name();
                    if(product.live) {
                        liveProducts.$set(name, product);
                    }
                    return productId;
                  });
                },
                set: function(productId, product) {
                    var productCopy = angular.copy(product);

                    delete productCopy.$id;
                    delete productCopy.$priority;
                    //Get current live value stored against current prodId
                    //
                    var oldname = $firebase(refByLive.child(product.$id)).$asObject();
                    console.log(product.images.hedgeset1jpg.data == productCopy.images.hedgeset1jpg.data);
                    //Get current product by current prodId
                    //
                    var currentProduct = $firebase(ref.child(product.$id)).$asObject();
                    
                    // If the old ref doesn't match the new one
                    //
                    if (oldname && oldname.$id !== productId || !product.live) {
                        liveProducts.$remove(oldname.$id);
                    }

                    if(product.live) {
                        liveProducts.$set(productId, angular.copy(productCopy));
                    }

                    if(currentProduct.$id != productId) {
                        products.$remove(currentProduct.$id);

                        return products.$set(productId, angular.copy(productCopy));
                    } else {
                        return products.$asArray().$save(product);
                    } 
                },
                find: function (productId) {
                  return $firebase(refByLive.child(productId)).$asObject();
                },
                delete: function (product) {
                    var oldname = $firebase(refByLive.child(product.$id)).$asObject();
                    if (oldname) {
                        liveProducts.$remove(oldname.$id);
                    }

                    products.$asArray().$remove(product);

                    /*var product = Product.find(productId);
                    product.deleted = true;
                    product.$on('loaded', function () {
                    liveProducts.$remove(product.name);
                    products.$child(productId).$set(product);
                    });*/
                }
              };

              return Product;
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
                var safename = (category.name.replace(/\s/g, "-")).toLowerCase();
                sync.$set(safename, category);
            };
            
            var addCategoryToParent = function(parentCategory, category) {
                var safename = (category.name.replace(/\s/g, "-")).toLowerCase();
                var subCategories = [];
                subCategories[safename] = category;
                
                var ctgy = $firebase(ref.child(parentCategory + "/subCategories"));
                ctgy.$asArray().$loaded().then(function(val){
                    if( val.length > 0 ) {
                        ctgy.$set(safename, category);
                    } else {
                        ctgy = $firebase(ref.child(parentCategory));
                        ctgy.$asArray().$loaded().then(function(val){
                            ctgy.$set("subCategories", subCategories);
                        })
                    }
                })
            };

            return {
                categories: categories,
                addCategory: addCategory,
                addCategoryToParent: addCategoryToParent
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

    bsServices.service("ContactService", ['$resource', '$firebase', 'FIREBASE_ENQUIRIES_URI',
        function($resource, $firebase, FIREBASE_ENQUIRIES_URI) {
            var ref = new Firebase(FIREBASE_ENQUIRIES_URI);
            var sync = $firebase(ref);
            
            return {
                enqSync: sync
            }
        }]);

    bsServices.service("BasketService", ['$cookieStore', function($cookieStore) {
        var items = {};
        var $cookieStore = $cookieStore;
        var Basket = {
            items : items,
            add : function(product, skipCookie) {
                var skipCookie = skipCookie || false;
                var productId = skipCookie ? product.id : product.$id;
                if(items[productId]) {
                    items[productId].count++;
                } else {
                    var image;
                    for (var image in product.images) {
                        image = image;
                        break;
                    }
                    var item = {
                        category: product.category,
                        count: 1,
                        name: product.name,
                        price: product.price,
                        id : productId
                    };
                    if(image) {
                        item.img = product.images[image].filename
                    }
                    items[productId] = item;
                }
                if(!skipCookie) {
                    var basketCookie = $cookieStore.get('basketCookie');
                    if(basketCookie == undefined) {
                        $cookieStore.put('basketCookie', []);
                        basketCookie = $cookieStore.get('basketCookie');
                    }
                    basketCookie.push(items[product.$id]);
                    $cookieStore.put('basketCookie', basketCookie);
                }
            },
            init : function(items) {
                for(var item in items) {
                    this.add(items[item], true);
                }
            },
            total : function () {
                var basket = items;
                var price = 0;
                for(var item in basket) {
                    if(basket[item] != undefined) {
                        price += parseInt(basket[item].count) * parseFloat(basket[item].price);
                    }
                }
                return price;
            },
            count : function() {
                var basket = items;
                var count = 0;
                for(var item in basket) {
                    if(basket[item] != undefined) {
                        count += basket[item].count;
                    }
                }
                return count;
            },
            basketText : function() {
                var text = this.total() > 0 ? "\xA3" + this.total().toFixed(2) + " - " + this.count() + (this.count() > 1 ? " items" : "item") : "empty";
                return text;
            },
            itemCount: function(product) {
                if(items[product.$id]) {
                    return items[product.$id].count;
                }
            },

            empty : function() {
                items = {};
                $cookieStore.remove('basketCookie');
            },

            contains : function(product) {
                return items[product.$id];
            }
        }

        return Basket;
    }]);
})();
