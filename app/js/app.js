;
(function() {
    //var shop = angular.module('shop', ['bsServices', 'basket', 'ngResource', 'ngCookies', 'ui.router']);
    var shop = angular.module('shop',
        ['bsServices', 'basket', 'ngCookies', 'ui.keypress', 'ui.event', 'ui.router', 'firebase', 'angularFileUpload',  'stateSecurity', 'userService', 'bootstrapLightbox', 'shopFilters',
        function($httpProvider) {
          // Use x-www-form-urlencoded Content-Type
          $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
         
          /**
           * The workhorse; converts an object to x-www-form-urlencoded serialization.
           * @param {Object} obj
           * @return {String}
           */ 
          var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
              
            for(name in obj) {
              value = obj[name];
                
              if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                  subValue = value[i];
                  fullSubName = name + '[' + i + ']';
                  innerObj = {};
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + '&';
                }
              }
              else if(value instanceof Object) {
                for(subName in value) {
                  subValue = value[subName];
                  fullSubName = name + '[' + subName + ']';
                  innerObj = {};
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + '&';
                }
              }
              else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
              
            return query.length ? query.substr(0, query.length - 1) : query;
          };
         
          // Override $http service's default transformRequest
          $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
          }];
        }])
    .constant('loginStateName', 'shop.login')
    .constant('alreadyLoggedInStateName', 'shop.products');


    shop.config(['$stateProvider', '$urlRouterProvider', 'LightboxProvider', function ($stateProvider, $urlRouterProvider, LightboxProvider) {
        // set a custom template
        LightboxProvider.templateUrl = '/views/lightbox/lightbox.html';
        LightboxProvider.calculateModalDimensions = function (dimensions) {
            var imgWidth = dimensions.imageDisplayWidth;
            var imgHeight = dimensions.imageDisplayHeight;
            var winWidth = dimensions.windowWidth;
            var winHeight = dimensions.windowHeight;
            /*if(winWidth < winHeight) {
                //Portrait mode...
                //
                if(imgWidth > imgHeight) {
                    //lansdscape image
                    //
                    scale = imgHeight/imgWidth;
                    console.log("scale", scale);
                    return {
                        'width': Math.max(winWidth - 20, imgWidth + 42),
                        'height': Math.max((winHeight*scale) - 20, (imgHeight * scale) + 42)
                    };
                }
            } else {*/

                return {
                  'width': dimensions.imageDisplayWidth > winWidth ? winWidth - 22 : dimensions.imageDisplayWidth + 42,
                  'height': Math.max(dimensions.imageDisplayHeight + 72, dimensions.imageDisplayHeight + 72)
                };
            //}
          };
        LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
            return {
              'minWidth': 100,
              'minHeight': 100,
              'maxWidth': dimensions.windowWidth - 62,
              'maxHeight': dimensions.windowHeight - 102
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
                        templateUrl: 'views/shop.products.html',
                        controller: 'ShopController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Welcome to Battlescenes"}
                    }
                },
                
            },
            'shop.about' : 
            {
                url: '/about',
                views: {
                    'content@shop': {
                        templateUrl: 'views/shop.about.html',
                        controller: 'CategoryController'
                    }
                },
            },
            'shop.contact' : 
            {
                url: '/contact',
                views: {
                    'content@shop': {
                        templateUrl: 'views/shop.contact.html',
                        controller: 'CategoryController'
                    }
                },
            },
            'shop.products' : 
            {
                url: '/',
                templateUrl: 'views/shop.products.html',
                controller: 'ShopController',
            },
            'shop.search' : 
            {
                url: '/search/:query',
                views: {
                    'content@shop': {
                        templateUrl: 'views/shop.products.html',
                        controller: 'ShopController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Products"}
                    }
                },
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
                        templateUrl: 'views/shop.products.html',
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
                url: '/category/:categoryId/:subcategoryId',
                views: {
                    'content@shop': {
                        templateUrl: 'views/shop.products.html',
                        controller: 'ShopController'
                    }
                },
                resolve: {
                    title: function() {
                        return { value : "Products"}
                    }
                },
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
                templateUrl: 'views/shop.products.html',
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

    shop.controller("ContactCtrl", ['$scope', '$location', '$http', 'ContactService', 'Filters',
        function($scope, $location, $http, ContactService, Filters){
            $scope.Filters = Filters;
            $scope.http = $http;
            $scope.contactService = ContactService;
            $scope.contacts = $scope.contactService.enqSync;
            $scope.errors = [];
            $scope.msgSuccess = false;
            $scope.newContact = {
                name: "",
                email: "",
                message: ""
            };

            $scope.Filters.searchTerm = "";
            $scope.Filters.category = "";
            $scope.Filters.subcategory = "";

            $scope.sendMessage = function() {
                $scope.errors = [];

                $http.post("contact.php", $scope.newContact).error(function(err){
                    alert(err);
                }).success(function(data){
                    if(data.success) {
                        $scope.contacts.$push($scope.newContact);
                        $scope.newContact = {};
                        $scope.msgSuccess = true;
                    } else {
                        if(data.errors) {
                            for(var error in data.errors) {
                                $scope.errors.push({
                                    "name": error,
                                    "message": data.errors[error]
                                });
                            }
                        }
                    }

                });
            }
        }
    ]);

    shop.controller("NavigationController", ['$scope', '$location', '$state', 'Filters', 'title', 'Basket',
        function($scope, $location, $state, Filters, title, basket){
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

            $scope.doSearch = function() {
                $state.go('shop.search',{ query: $scope.filters.searchTerm});

            }
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

          /*$scope.resetPassword = function(email){
            $scope.userService.loginService.sendResetPasswordEmail(email, function(error) {
                $scope.error = error;
            });
          };*/

          $scope.resetForm = function(){
            $scope.newUser = {email: '', password: ''};
          };
        }
    ]);

    shop.controller("ShopController", ['$scope', '$http', '$state', '$stateParams', 'ProductService', 'CategoryService', 'UserService', 'Filters', 'Basket',
        function($scope, $http, $state, $stateParams, ProductService, CategoryService, UserService, Filters, Basket) {
            $scope.greeting = "Welcome to Battlescenes designs";
            $scope.userService = UserService;
            $scope.productService = ProductService;
            //$scope.products = ProductService.getProducts;

            UserService.authenticated.on("value", function(snap){
              if (snap.val() === true) {
                $scope.products = ProductService.all.$asArray();
              } else {
                $scope.products = ProductService.live.$asArray();
              }
            });
            
            $scope.filters = Filters;
            $scope.basket = Basket;
            $scope.edit = [];
            $scope.category = $stateParams.categoryId;
            $scope.subcategory = $stateParams.subcategoryId;
            $scope.filters.searchTerm = $stateParams.query || "";
            $scope.categories = CategoryService.categories;

            $scope.filters.category = $stateParams.categoryId || "";
            $scope.filters.subcategory = $stateParams.subcategoryId || "";

            $scope.toggleEdit = function (productId) {
                if($scope.edit.indexOf(productId) != -1) {
                    $scope.edit.splice($scope.edit.indexOf(productId), 1);
                } else {
                    $scope.edit.push(productId);
                }
            };

            $scope.save = function (product) {
                var safename = (product.category + "-" + product.name.replace(/\s/g, "-")).toLowerCase();
                $scope.toggleEdit(product.$id);
                $scope.productService.set(safename, product);
            };

            $scope.delete = function (product) {
                var removeProduct = confirm("Are you sure you want to remove \"" + product.name + "\" from the shop?");
                if(removeProduct) {
                    $scope.productService.delete(product);
                }
            };

            $scope.canEdit = function (productId) {
                return $scope.edit.indexOf(productId) != -1;
            };

            $scope.search = function (item){
                var query = $scope.filters.searchTerm.toLowerCase();
                var subcategory = $scope.filters.subcategory.toLowerCase();
                var category = $scope.filters.category.toLowerCase();
                var name = item.name.toLowerCase();
                var desc = item.description.toLowerCase();
                var itemCat = item.category.toLowerCase();
                var itemSub = item.subcategory ? item.subcategory.toLowerCase() : undefined;

                if($scope.userService.currentUser || item.live !== false) {
                    if($scope.filters.subcategory == "" && $scope.filters.category == "" && query == "") {
                        return true;
                    }
                    if( $scope.filters.category == "" && $scope.filters.subcategory == "") {
                        if( name.indexOf(query) != -1
                            || desc.indexOf(query) != -1 )
                        {
                           return true;
                        }
                    } else if ( category != "" && subcategory != "") {
                        if( ((itemSub != undefined && itemSub.indexOf(subcategory) != -1) && (itemCat.indexOf(category) != -1))
                            && (name.indexOf(query) != -1 || desc.indexOf(query) != -1 ))
                        {
                           return true;
                        }
                    } else {
                        if( ((item.subcategory != undefined && $scope.filters.subcategory != "" && item.subcategory.indexOf($scope.filters.subcategory) != -1) || ($scope.filters.category != "" && item.category.indexOf($scope.filters.category) != -1))
                            && (name.indexOf(query) != -1 || desc.indexOf(query) != -1 ))
                        {
                           return true;
                        }
                    }
                }
                return false;
            };

            $scope.getSubCategories = function(category) {
                if($scope.categories.$getRecord(category)) {
                    return $scope.categories.$getRecord(category).subCategories;
                }
                return false;
            }
        }
    ]);

    shop.controller("ItemController", ['$scope', '$http', '$state', '$stateParams', 'ProductService', 'CategoryService', 'UserService', 'Filters', 'Basket', 'Lightbox',
        function($scope, $http, $state, $stateParams, ProductService, CategoryService, UserService, Filters, Basket, Lightbox) {
            $scope.userService = UserService;
            $scope.productId = $stateParams.productId;
            /*ProductService.getProducts.$loaded().then(function(products){
                $scope.product = products.$getRecord($stateParams.productId);
                for ( var image in $scope.product.images ) {
                    var theImage = $scope.product.images[image];
                    var imageObj = {};
                    imageObj.url = theImage.data;
                    imageObj.caption = $scope.product.name + " " + parseInt($scope.images.length + 1, 0);
                    $scope.images.push(imageObj);
                }
            });*/
            $scope.product = ProductService.find($stateParams.productId);
            $scope.categories = CategoryService.categories;
            $scope.filters = Filters;
            $scope.basket = Basket;
            $scope.images = $scope.product.images;
            
            $scope.breadcrumbResolver = function (defaultResolver, product) {
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

    shop.controller("CategoryController", ['$scope', '$stateParams', 'ProductService', 'CategoryService', 'Filters',
        function($scope, $stateParams, ProductService, CategoryService, Filters) {
            $scope.category = $stateParams.categoryId;
            $scope.subcategory = $stateParams.subcategoryId;
            $scope.categoryService = CategoryService;
            $scope.categories = CategoryService.categories;
            //$scope.products = ProductService.getProducts;
            $scope.products;
            
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

            $scope.alphaSort = function(cat) {
                console.log(cat);
                return 1;
            };

            $scope.isSet = function(index) {
                return index == $scope.categoryIndex;
            };

            $scope.saferize = function (str) {
                return str.replace(/\s/g, "-").toLowerCase();
            }

            $scope.getSubCategoriesFromProducts = function(products) {
                var unique = {};
                var distinctSubCategories = {};
                for (var i in products) {
                    if (typeof(unique[products[i].subcategory]) == "undefined" && products[i].subcategory != undefined) {
                        distinctSubCategories[products[i].subcategory] = 0;
                        //distinctCategories.push(products[i].category);
                        unique[products[i].subcategory] = 0;
                    }
                    distinctSubCategories[products[i].subcategory]++;
                }
                for(var subcategory in distinctSubCategories) {
                    if(subcategory == "undefined") {
                        delete distinctSubCategories[subcategory];
                    }
                }
                return distinctSubCategories;
            };

            $scope.categoryIsSet = function(index) {
                return index == $scope.categoryIndex;
            };

            $scope.subcategoryIsSet = function(index, categoryIndex) {
                
                return index == $scope.subcategoryIndex;
            };

            $scope.setCategory = function(category, index) {
                $scope.filters.subcategory = "";
                $scope.subcategoryIndex = -1;
                if($scope.categoryIndex == index) {
                    $scope.filters.category = "";
                    $scope.categoryIndex = -1;
                } else {
                    $scope.categoryIndex = index;
                    $scope.filters.category = category;
                }
            };

            $scope.setsubcategory = function(subcategory, index) {
                $scope.subcategoryIndex = -1;
                console.log($scope.subcategoryIndex == index);
                if($scope.subcategoryIndex == index) {

                    $scope.filters.subcategory = "";
                    $scope.subcategoryIndex = -1;
                } else {
                    $scope.subcategoryIndex = index;
                    $scope.filters.subcategory = subcategory;
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

    shop.controller("ProductController", ['$scope', 'ProductService', 'CategoryService', 'FileUploader',
        function($scope, ProductService, CategoryService, FileUploader) {
            $scope.productService = ProductService;
            $scope.categories = CategoryService.categories;
            $scope.subCategories = [];
            $scope.images = {};
            var uploader = $scope.uploader = new FileUploader({
                url: 'upload.php'
            });
            // FILTERS

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onSuccessItem = function(fileItem, response, status, headers) {                
                var image = {};
                image.filename = fileItem._file.name;
                var safename = image.filename.replace(/\.|\#|\$|\[|\]|-|\//g, "");
                $scope.images[safename] = image;
            };

            $scope.uploadingImages = true;
            var newProduct = {};
            $scope.newProduct = {
                    name: '',
                    price: '',
                    description: '',
                    qty: '',
                    live: ''
                }
            $scope.productErrors = [];

            $scope.getSubCategories = function() {
                $scope.subCategories = $scope.categories.$getRecord($scope.newProduct.category).subCategories;
            }

            $scope.getSubCategories = function() {
                $scope.subCategories = $scope.categories.$getRecord($scope.newProduct.category).subCategories;
            }

            $scope.addProduct = function() {
                $scope.productErrors = [];

                if($scope.newProduct.name == "" || $scope.newProduct.name == undefined) {
                    var error = {};
                    error.name = "Name";
                    error.msg = "You need to enter a name for your product";
                    $scope.productErrors.push(error);
                }
                if(newProduct.price == "" || $scope.newProduct.price == undefined) {
                    var error = {};
                    error.name = "Price";
                    error.msg = "You need to enter a price for your product";
                    $scope.productErrors.push(error);
                }
                if(newProduct.description == "" || $scope.newProduct.description == undefined) {
                    var error = {};
                    error.name = "Description";
                    error.msg = "You need to enter a description for your product";
                    $scope.productErrors.push(error);
                }
                if(newProduct.qty == "" || $scope.newProduct.qty == undefined) {
                    var error = {};
                    error.name = "Qty";
                    error.msg = "You need to enter a qty for your product";
                    $scope.productErrors.push(error);
                }
                if(newProduct.category == "" || $scope.newProduct.category == undefined) {
                    var error = {};
                    error.name = "Category";
                    error.msg = "You need to provide a category for your product";
                    $scope.productErrors.push(error);
                }
                if($scope.productErrors.length > 0) {
                    return false;
                }
                $scope.newProduct.images = $scope.images;

                var safename = ($scope.newProduct.category + "-" + $scope.newProduct.name.replace(/\s/g, "-")).toLowerCase();
                $scope.uploadingImages = false;
                //safename = imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");

                    //$scope.productService.products.$set(safename, $scope.newProduct);
                $scope.productService.create(safename, $scope.newProduct);
                $scope.newProduct = {};
                $scope.images = {};
                $scope.uploader.clearQueue();
            }
        }
    ]);
})();
