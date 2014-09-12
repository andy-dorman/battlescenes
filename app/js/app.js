;
(function() {
    //var shop = angular.module('shop', ['bsServices', 'basket', 'ngResource', 'ngCookies', 'ui.router']);
    var shop = angular.module('shop',
        ['bsServices', 'basket', 'ngCookies', 'ui.router', 'firebase', 'stateSecurity', 'userService', 'bootstrapLightbox', 'shopFilters'])
    .constant('loginStateName', 'shop.login')
    .constant('alreadyLoggedInStateName', 'shop.addProduct');
    shop.config(['$stateProvider', '$urlRouterProvider', 'LightboxProvider', function ($stateProvider, $urlRouterProvider, LightboxProvider) {
        // set a custom template
        LightboxProvider.templateUrl = '/views/lightbox/lightbox.html';
        LightboxProvider.calculateModalDimensions = function (dimensions) {
            return {
              'width': Math.max(500, dimensions.imageDisplayWidth + 42),
              'height': Math.max(500, dimensions.imageDisplayHeight + 42)
            };
          };
        window.routes = {
            'shop' : 
            {
                url: '',
                views: {
                    '': {
                        templateUrl: 'views/navigation.html',
                        controller: 'NavigationController',

                    },
                    'content@shop': {
                        templateUrl: 'views/home.html',
                        controller: 'ShopController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Welcome to Battlescenes"}
                    }
                },
                
            },
            'shop.products' : 
            {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'ShopController',
            },
            'shop.product' : 
            {
                url: '/product/:productId',
                views: {
                    'content@shop': {
                        templateUrl: 'views/shop.product.html',
                        controller: 'ItemController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Products"}
                    }
                },
            },
            'shop.category' : 
            {
                url: '/category/:categoryId',
                views: {
                    'content@shop': {
                        templateUrl: 'views/home.html',
                        controller: 'ShopController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Products"}
                    }
                },
            },
            'shop.subcategory' : 
            {
                url: '/category/:categoryId/:subCategoryId',
                views: {
                    'content@shop': {
                        templateUrl: 'views/home.html',
                        controller: 'ShopController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Products"}
                    }
                },
            },
            'shop.about' :
            {
                url: '/about',
            },
            'shop.contact' :
            {
                url: '/contact',
            },
            'shop.login' : 
            {
                url: '/login',
                views: {
                    'content@shop': {
                        templateUrl: '/views/admin/login.html',
                        controller: 'LoginController'                    }
                }

            },
            'shop.admin' : 
            {
                url: '/admin',
                templateUrl: 'views/home.html',
                controller: 'ShopController',
                data: {
                    authRequired: true
                }
            },
            'shop.addProduct' :
            {
                url: '/add-product',
                views: {
                    '': { templateUrl: 'views/navigation.html' },
                    'content@shop': {
                        templateUrl: 'views/admin/products.html',
                        controller: 'ProductController'
                    }
                },
                
                data: {
                    authRequired: true
                    }
            },
            'shop.addCategory' :
            {
                url: '/add-category',
                views: {
                    '': { templateUrl: 'views/navigation.html' },
                    'content@shop': {
                        templateUrl: 'views/admin/category.html',
                        controller: 'CategoryController',
                    }
                },
                data: {
                    authRequired: true
                    }
            }
        };
        /*
            'otherwise' : 
            {
                url: '*path',
                templateUrl: 'views/404.html'
            }
        */
        for( var path in window.routes ) {
            $stateProvider.state(path, window.routes[path]);
        }
        $urlRouterProvider.otherwise('');
    }
    ]);

    shop.controller("RootController", ['$scope', '$location', 'UserService',
        function($scope, $location, UserService){
            $scope.userService = UserService;
            $scope.getCurrentUser = function() {
                $scope.userService.loginService.$getCurrentUser().then(function(user){
                    $scope.userService.currentUser = user;
                });
            }

            $scope.getCurrentUser();

            $scope.logout = function() {
                $scope.userService.loginService.$logout();
                $scope.userService.currentUser = null;
                $location.url("/");
            }
        }
    ]);

    shop.controller("NavigationController", ['$scope', '$location', 'Filters', 'title', 'Basket',
        function($scope, $location, Filters, title, basket){
            $scope.basket = basket;
            $scope.pages = [
                {
                    "link" : "shop.about",
                    "name" : "About"
                },
                {
                    "link" : "shop.contact",
                    "name" : "Contact"
                },
                {
                    "link" : "shop.addProduct",
                    "name" : "Add product",
                    "admin" : true    
                },
                {
                    "link" : "shop.addCategory",
                    "name" : "Add category",
                    "admin" : true
                }
            ];
            $scope.pageHeader = title.value;

            $scope.filters = Filters;
        }
    ]);
    
    shop.controller("LoginController", ['$scope', 'UserService',
        function($scope, UserService ){
          $scope.newUser = { email: '', password: '' };
          $scope.userService = UserService;
          $scope.login = function(email, password) {
            $scope.userService.loginService.$login('password', { email: email, password: password})
            .then(function(user){
                $scope.userService.currentUser = user;
                $scope.resetForm();
            });
          };

          $scope.resetForm = function(){
            $scope.newUser = {email: '', password: ''};
          };
        }
    ]);

    shop.controller("ShopController", ['$scope', '$http', '$state', '$stateParams', 'ProductService', 'UserService', 'Filters', 'Basket',
        function($scope, $http, $state, $stateParams, ProductService, UserService, Filters, Basket) {
            $scope.greeting = "Welcome to Battlescenes designs";
            $scope.userService = UserService;
            $scope.productService = ProductService;
            $scope.products = ProductService.getProducts;
            $scope.filters = Filters;
            $scope.basket = Basket;
            $scope.edit = [];

            $scope.toggleEdit = function (productId) {
                if($scope.edit.indexOf(productId) != -1) {
                    $scope.edit.splice($scope.edit.indexOf(productId), 1);
                } else {
                    $scope.edit.push(productId);
                }
            };

            $scope.save = function (product) {                
                $scope.products.$save(product);
                $scope.toggleEdit(product.$id);
            };

            $scope.canEdit = function (productId) {
                return $scope.edit.indexOf(productId) != -1;
            };

            $scope.search = function (item){
                var query = $scope.filters.searchTerm.toLowerCase();;
                var name = item.name.toLowerCase();
                var desc = item.description.toLowerCase();

                if($scope.userService.currentUser || item.live !== false) {
                    if($scope.filters.category == "" && query == "") {
                        return true;
                    }
                    if( $scope.filters.category == "" ) {
                        if( name.indexOf(query) != -1
                            || desc.indexOf(query) != -1 )
                        {
                           return true;
                        }
                    } else {
                        if( item.category.indexOf($scope.filters.category) != -1 && (name.indexOf(query) != -1
                            || desc.indexOf(query) != -1 ))
                        {
                           return true;
                        }
                    }
                }
                return false;
            };
        }
    ]);

    shop.controller("ItemController", ['$scope', '$http', '$state', '$stateParams', 'ProductService', 'UserService', 'Filters', 'Basket', 'Lightbox',
        function($scope, $http, $state, $stateParams, ProductService, UserService, Filters, Basket, Lightbox) {
            $scope.userService = UserService;
            $scope.productId = $stateParams.productId;
            ProductService.getProducts.$loaded().then(function(products){
                $scope.product = products.$getRecord($stateParams.productId);
                for ( var image in $scope.product.images ) {
                    var theImage = $scope.product.images[image];
                    var imageObj = {};
                    imageObj.url = theImage.data;
                    $scope.images.push(imageObj);
                }
            });
            $scope.filters = Filters;
            $scope.basket = Basket;
            $scope.images = [];
            
            $scope.breadcrumbResolver = function (defaultResolver, product) {
                console.log(product);
                if (isCurrent) {
                    return '"' + item.name + '"';
                }

                return defaultResolver(product);
            }

            $scope.openLightboxModal = function(index) {
                Lightbox.openModal($scope.images, index);
            }

            $scope.search = function (item){
                var query = $scope.filters.searchTerm.toLowerCase();;
                var name = item.name.toLowerCase();
                var desc = item.description.toLowerCase();

                if($scope.userService.currentUser || item.live !== false) {
                    if($scope.filters.category == "" && query == "") {
                        return true;
                    }
                    if( $scope.filters.category == "" ) {
                        if( name.indexOf(query) != -1
                            || desc.indexOf(query) != -1 )
                        {
                           return true;
                        }
                    } else {
                        if( item.category.indexOf($scope.filters.category) != -1 && (name.indexOf(query) != -1
                            || desc.indexOf(query) != -1 ))
                        {
                           return true;
                        }
                    }
                }
                return false;
            };
        }
    ]);

    shop.controller("CategoryController", ['$scope', 'ProductService', 'CategoryService', 'Filters',
        function($scope, ProductService, CategoryService, Filters) {
            $scope.categoryService = CategoryService;
            $scope.categories = CategoryService.categories;
            
            $scope.getCategoriesFromProducts = function(products) {
                var unique = {};
                var distinctCategories = {};
                for (var i in products) {
                    if (typeof(unique[products[i].category]) == "undefined" && products[i].category != undefined) {
                        distinctCategories[products[i].category] = 0;
                        //distinctCategories.push(products[i].category);
                        unique[products[i].category] = 0;
                    }
                    distinctCategories[products[i].category]++;
                }
                for(var category in distinctCategories) {
                    if(category == "undefined") {
                        delete distinctCategories[category];
                    }
                }
                return distinctCategories;
            };

            $scope.isSet = function(index) {
                return index == $scope.categoryIndex;
            };


            $scope.setCategory = function(category, index) {
                if($scope.categoryIndex == index) {
                    $scope.filters.category = "";
                    $scope.categoryIndex = -1;
                } else {
                    $scope.categoryIndex = index;
                    $scope.filters.category = category;
                }
            };

            $scope.newCategory = {
                name: ''
            };
            
            $scope.addCategory = function() {
                if($scope.parentCategory) {
                    $scope.categoryService.addCategoryToParent($scope.parentCategory, $scope.newCategory);
                } else {
                    $scope.categoryService.addCategory($scope.newCategory);
                }
                
                $scope.newCategory = {};
                $scope.parentCategory = "";
            };

            $scope.selectedIndex;
        }
    ]);

    shop.controller("BasketController", function() {
        $scope.basket = [];
        $scope.greeting = "Welcome to Battlescenes designs";
        $scope.addToBasket = function(product) {
            $scope.basket.push(product);
        };
        $scope.basketCount = function() {
            var basket = $scope.basket;
            return basket.length;
            //return basket.length > 0 ? basket.length + " item" + (basket.length > 1 ? "s" : "") + " in your basket" : "Basket empty";
        };
    });

    shop.controller("ProductController", ['$scope', 'ProductService', 'CategoryService',
        function($scope, ProductService, CategoryService) {
            $scope.productService = ProductService;
            $scope.categories = CategoryService.categories;
            $scope.subCategories = [];
            $scope.uploadingImages = true;
            var newProduct = {};
            $scope.newProduct = {
                    name: '',
                    price: '',
                    description: '',
                    qty: '',
                    live: ''
                }

            $scope.getSubCategories = function() {
                $scope.subCategories = $scope.categories.$getRecord($scope.newProduct.category).subCategories;
            }

            $scope.getSubCategories = function() {
                $scope.subCategories = $scope.categories.$getRecord($scope.newProduct.category).subCategories;
            }

            $scope.addProduct = function() {
                $scope.newProduct.images = $scope.images;

                var safename = ($scope.newProduct.category + "-" + $scope.newProduct.name.replace(/\s/g, "-")).toLowerCase();
                $scope.uploadingImages = false;
                //safename = imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");

                if(newProduct.name != "") {
                    $scope.productService.products.$set(safename, $scope.newProduct);
                }
                $scope.newProduct = {};
                $scope.images = {};
            }
        }
    ]);
})();
