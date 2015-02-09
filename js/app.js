;(function() {
    //var shop = angular.module("shop", ["bsServices", "basket", "ngResource", "ngCookies", "ui.router"]);
    //"angularUtils.directives.dirPagination",
    var shop = angular.module("shop",
        //[ "hc.commonmark", "bsServices", "basket", "ngCookies", "ui.keypress", "ui.event", "ui.router", "firebase", "$upload",  "stateSecurity", "userService", "bootstrapLightbox", "shopFilters", "waitForAuth",
        [ "hc.commonmark", "bsServices", "basket", "ngCookies", "ui.keypress", "ui.event", "ui.router", "firebase", "angularFileUpload", "userService", "shopFilters", "angularUtils.directives.dirPagination",
        function($httpProvider) {
          // Use x-www-form-urlencoded Content-Type
          $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";

          /**
           * The workhorse; converts an object to x-www-form-urlencoded serialization.
           * @param {Object} obj
           * @return {String}
           */
          var param = function(obj) {
            var query = "", name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
              value = obj[name];

              if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                  subValue = value[i];
                  fullSubName = name + "[" + i + "]";
                  innerObj = {};
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + "&";
                }
              }
              else if(value instanceof Object) {
                for(subName in value) {
                  subValue = value[subName];
                  fullSubName = name + "[" + subName + "]";
                  innerObj = {};
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + "&";
                }
              }
              else if(value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
          };

          // Override $http service"s default transformRequest
          $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== "[object File]" ? param(data) : data;
          }];
        }])
    .constant("loginStateName", "shop.login")
    .constant("alreadyLoggedInStateName", "shop.products");

    // let's create a re-usable factory that generates the $firebaseAuth instance
    shop.factory("Auth", [ "$firebaseAuth", function($firebaseAuth) {
            var ref = new Firebase("https://shining-fire-4276.firebaseio.com");
            return $firebaseAuth(ref);
        }
    ]);
    shop.config([ "$stateProvider", "$urlRouterProvider", "$locationProvider",
    function($stateProvider, $urlRouterProvider, $locationProvider, $state) {
        //$locationProvider.html5Mode(true);
        window.routes = {
            "shop":
            {
                url: "",
                views: {
                    "": {
                        templateUrl: "views/navigation.html",
                        controller: "NavigationController"
                    },
                    "content@shop": {
                        templateUrl: "views/shop.products.html",
                        controller: "ShopController"
                    }
                },
                resolve: {
                    title: function() {
                        return { value: "Welcome to Battlescenes" };
                    },
                    currentAuth: [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            var authData = Auth.$waitForAuth();
                            return authData;
                        }
                    ]
                }
            },
            "shop.contact":
            {
                url: "/contact",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.contact.html"
                    }
                },
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.basket":
            {
                url: "/basket",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.basket.html",
                        controller: "BasketController"
                    }
                },
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.products":
            {
                url: "/",
                templateUrl: "views/shop.products.html",
                controller: "ShopController",
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.search":
            {
                url: "/search/:query",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.products.html",
                        controller: "ShopController"
                    }
                },
                resolve: {
                    title: function() {
                        return { value: "Products" };
                    },
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.product":
            {
                url: "/product/:productId",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.product.html",
                        controller: "ItemController"
                    }
                },
                resolve: {
                    title: function() {
                        return { value: "Products" };
                    },
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.category":
            {
                url: "/category/:categoryId",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.products.html",
                        controller: "ShopController"
                    }
                },
                resolve: {
                    title: function() {
                        return { value: "Products" };
                    },
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.subcategory":
            {
                url: "/category/:categoryId/:subcategoryId",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.products.html",
                        controller: "ShopController"
                    }
                },
                resolve: {
                    title: function() {
                        return { value: "Products" };
                    },
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.login":
            {
                url: "/login",
                views: {
                    "content@shop": {
                        templateUrl: "/views/admin/login.html",
                        controller: "LoginController"
                    }
                },
                resolve: {
                    "currentAuth": [ "Auth", function(Auth) {
                            // $waitForAuth returns a promise so the resolve
                            // waits for it to complete
                            return Auth.$waitForAuth();
                        }
                    ]
                }
            },
            "shop.admin":
            {
                url: "/admin",
                templateUrl: "views/shop.products.html",
                controller: "ShopController",
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [
                        "Auth",
                        function(Auth) {
                            // $requireAuth returns a promise so the resolve waits for it to complete
                            // If the promise is rejected, it will throw a $stateChangeError (see above)
                            return Auth.$requireAuth();
                        }
                    ]
                }
            },
            "shop.addProduct":
            {
                url: "/admin/products",
                views: {
                    "": { templateUrl: "views/navigation.html" },
                    "content@shop": {
                        templateUrl: "views/admin/products.html",
                        controller: "ProductController"
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [
                        "Auth",
                        function(Auth) {
                            // $requireAuth returns a promise so the resolve
                            // waits for it to complete
                            // If the promise is rejected, it will throw a
                            // $stateChangeError (see above)
                            return Auth.$requireAuth();
                        }
                    ]
                }
            },
            "shop.addCategory":
            {
                url: "/admin/categories",
                views: {
                    "": { templateUrl: "views/navigation.html" },
                    "content@shop": {
                        templateUrl: "views/admin/category.html",
                        controller: "CategoryController"
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [
                    "Auth",
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                    ]
                }
            },
            "shop.addPage":
            {
                url: "/admin/pages",
                views: {
                    "": { templateUrl: "views/navigation.html" },
                    "content@shop": {
                        templateUrl: "views/admin/pages.html",
                        controller: "PageAdminController"
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [
                    "Auth",
                    function(Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }
                    ]
                }
            },
            "shop.section":
            {
                url: "/:section",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.page.html",
                        controller: "PageController"
                    }
                },
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [ "Auth", function(Auth) {
                        // $waitForAuth returns a promise so the resolve
                        // waits for it to complete
                        return Auth.$waitForAuth();
                    }
                    ]
                }
            },
            "shop.page":
            {
                url: "/:section/:page",
                views: {
                    "content@shop": {
                        templateUrl: "views/shop.page.html",
                        controller: "PageController"
                    }
                },
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": [ "Auth", function(Auth) {
                        // $waitForAuth returns a promise so the resolve
                        // waits for it to complete
                        return Auth.$waitForAuth();
                    }
                    ]
                }
            }
        };
        /*
            "otherwise" :
            {
                url: "*path",
                templateUrl: "views/404.html"
            }
        */
        for ( var path in window.routes ) {
            $stateProvider.state(path, window.routes[path]);
        }
        $urlRouterProvider.otherwise("");
    }
    ])
    .run(function($rootScope, $state) {
        var self = $rootScope;
        $rootScope.$on("$stateChangeStart",
        function(event, toState, toParams, fromState, fromParams) {
            $("#navbar-collapse.in").each(function() {
                $(this).removeClass("in");
            });
        });
        $rootScope.$on("$stateChangeError",
            function(event, toState, toParams, fromState, fromParams, error) {
                // We can catch the error thrown when the $requireAuth promise is rejected
                // and redirect the user back to the home page
                self.targetPage = toState;
                if (error === "AUTH_REQUIRED") {
                    $state.go("shop.login");
                }
            });
        });
        //shop.controller("RootController", [ "$scope", "$location", "UserService", "BasketService", "$cookieStore",
        shop.controller("RootController", [ "$scope", "$location", "UserService", "BasketService", "$cookieStore", "Auth",
        //function($scope, $location, UserService, BasketService, $cookieStore) {
        function($scope, $location, UserService, BasketService, $cookieStore, Auth) {

            $scope.basket = BasketService;
            var basketCookie = $cookieStore.get("basketCookie");

            if (basketCookie !== undefined && basketCookie !== null && basketCookie !== "") {
                $scope.basket.init(basketCookie);
            }
            $scope.userService = UserService;

            $scope.getCurrentUser = function() {
                $scope.userService.loginService.$waitForAuth().then(function(user){
                    $scope.userService.currentUser = user;
                });
            };

            $scope.getCurrentUser();

            $scope.logout = function() {
                $scope.userService.firebaseRef.unauth();
                $scope.userService.currentUser = null;
                $location.url("/");
            };
        }
    ]);

    shop.controller("ContactCtrl", ["$scope", "$location", "$http", "ContactService", "Filters", "BasketService",
        function($scope, $location, $http, ContactService, Filters, BasketService){
            $scope.Filters = Filters;
            $scope.http = $http;
            $scope.contactService = ContactService;
            $scope.contacts = $scope.contactService.enqSync;
            $scope.errors = [];
            $scope.msgSuccess = false;
            $scope.basket = BasketService;
            $scope.newContact = {
                name: "",
                email: "",
                message: ""
            };

            if($scope.basket.count() > 0) {
                var basket = $scope.basket.items;
                for(var basketItem in basket) {
                    var item = basket[basketItem];
                    $scope.newContact.message += item.count + " x " + item.name + (item.count > 1 ? "s" : "") + " (" + item.category + ") - \u00a3" + ((parseFloat(item.price)*item.count).toFixed(2)) + "\n";
                }

                if($scope.newContact.message !== "") {
                    $scope.newContact.message = "Hi there,\n\nI'm interested in the following items:\n\n" + $scope.newContact.message + "\nTotal: \u00a3" + (parseFloat($scope.basket.total()).toFixed(2));
                }
            }

            $scope.Filters.searchTerm = "";
            $scope.Filters.category = "";
            $scope.Filters.subcategory = "";

            var capitalise = function (string)
            {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };
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
                                    "name": capitalise(error),
                                    "message": data.errors[error]
                                });
                            }
                        }
                    }

                });
            };
        }
    ]);

    shop.controller("NavigationController", ["$scope", "$location", "$state", "Filters", "title", "Basket", "currentAuth", "PageService", "UserService", "SectionService",
        function($scope, $location, $state, Filters, title, basket, currentAuth, PageService, UserService, SectionService){

            var sectionPages,
                sections,
                pages;
            if (UserService.currentUser) {
                sections = SectionService.liveSectionsWithPages.$asArray();
            } else {
                sections = SectionService.liveSectionsWithPages.$asArray();
            }
            sections.$loaded().then(function() {
                pages = [];
                $scope.sections = [];
                sectionPages = [];
                angular.forEach(sections, function(section) {
                    sectionPages.push({
                        "params": { section: section.$id },
                        "name": section.$id.replace(/-/g, " ")
                    });
                });
                $scope.sections = sectionPages;
                pages.push({
                    "link": "shop.contact",
                    "name": "Contact"
                });
                pages.push({
                    "link": "shop.addProduct",
                    "name": "Products",
                    "admin": true
                });
                pages.push({
                    "link": "shop.addCategory",
                    "name": "Categories",
                    "admin": true
                });
                pages.push({
                    "link": "shop.addPage",
                    "name": "Pages",
                    "admin": true
                });

                $scope.pageLocs = pages;
            });

            $scope.basket = basket;

            $scope.pageHeader = title.value;

            $scope.filters = Filters;
            $scope.searchTerm = $scope.filters.searchTerm;

            $scope.doSearch = function() {
                $state.go("shop.search",{ query: $scope.filters.searchTerm});
            };
        }
    ]);

    shop.controller("LoginController", [ "$scope", "$rootScope", "UserService", "$state",
        function($scope, $rootScope, UserService, $state ) {
          $scope.newUser = { email: "", password: "" };
          $scope.userService = UserService;
          $scope.login = function(email, password) {
            /*$scope.userService.loginService.$login("password", { email: email, password: password})
            .then(function(user){
                $scope.userService.currentUser = user;
                $scope.resetForm();
            });*/
            $scope.userService.firebaseRef.authWithPassword(
                { email: email, password: password },
                function(error, authData) {
                    if (error) {
                        switch (error.code) {
                        case "INVALID_EMAIL":
                        console.log("The specified user account email is invalid.");
                        break;
                        case "INVALID_PASSWORD":
                        console.log("The specified user account password is incorrect.");
                        break;
                        case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                        default:
                        console.log("Error logging user in:", error);
                        }
                    } else {
                        $scope.userService.currentUser = authData.uid;
                        $state.go($rootScope.targetPage || "shop.admin");
                        $rootScope.targetPage = "";
                        $scope.resetForm();
                    }
                });
          };

          /*$scope.resetPassword = function(email){
            $scope.userService.loginService.sendResetPasswordEmail(email, function(error) {
                $scope.error = error;
            });
          };*/

          $scope.resetForm = function(){
            $scope.newUser = { email: "", password: "" };
          };
        }
    ]);

    shop.controller("ShopController", [ "$scope", "$http", "$state", "$stateParams", "ProductService", "CategoryService", "UserService", "Filters", "BasketService", "currentAuth",
        function($scope, $http, $state, $stateParams, ProductService, CategoryService, UserService, Filters, BasketService, currentAuth) {
            $scope.greeting = "Welcome to Battlescenes designs";
            $scope.userService = UserService;
            $scope.productService = ProductService;
            $scope.pageSize = 10;

            $scope.filters = Filters;
            $scope.basket = BasketService;
            $scope.edit = [];
            $scope.category = $stateParams.categoryId;
            $scope.subcategory = $stateParams.subcategoryId;
            $scope.filters.searchTerm = $stateParams.query || "";
            $scope.categories = CategoryService.categories;

            $scope.filters.category = $stateParams.categoryId || "";
            $scope.filters.subcategory = $stateParams.subcategoryId || "";

            var products,
            queryRef;
            if (UserService.currentUser) {
                if ($scope.filters.searchTerm === "" && $scope.filters.category === "" && $scope.filters.subcategory ==="") {
                    products = [];
                    queryRef = ProductService.ref.orderByChild("createdAt");//.limitToLast(3);
                    queryRef.on("value", function(results) {
                        //products = results;
                        results.forEach(function(product) {
                            var prod = product.val();
                            prod.$id = (prod.category + "-" + prod.name.replace(/\s/g, "-")).toLowerCase();
                            products.unshift(prod);
                            // Returning true means that we will only loop through the forEach() one time
                        });
                        $scope.products = products;
                    });
                } else {
                    products = ProductService.all.$asArray();
                    products.$loaded().then(function() {
                        $scope.products = products;
                    });
                }
            } else {
                if ($scope.filters.searchTerm === "" && $scope.filters.category === "" && $scope.filters.subcategory ==="") {
                    products = [];
                    queryRef = ProductService.refByLive.orderByChild("createdAt");//.limitToLast(3);
                    queryRef.on("value", function(results) {
                        //products = results;
                        results.forEach(function(product) {
                            var prod = product.val();
                            prod.$id = (prod.category + "-" + prod.name.replace(/\s/g, "-")).toLowerCase();
                            products.unshift(prod);
                            // Returning true means that we will only loop through the forEach() one time
                        });
                        $scope.products = products;
                    });
                } else {
                    products = ProductService.live.$asArray();
                    products.$loaded().then(function() {
                        $scope.products = products;
                    });
                }
            }



            $scope.toggleEdit = function(productId) {
                if ($scope.edit.indexOf(productId) !== -1) {
                    $scope.edit.splice($scope.edit.indexOf(productId), 1);
                } else {
                    $scope.edit.push(productId);
                }
            };

            $scope.save = function(product) {
                var safename = (product.category + "-" + product.name.replace(/\s/g, "-")).toLowerCase();
                $scope.toggleEdit(product.$id);
                $scope.productService.set(safename, product);
            };

            $scope.delete = function(product) {
                var removeProduct = confirm("Are you sure you want to remove \"" + product.name + "\" from the shop?");
                if (removeProduct) {
                    $scope.productService.delete(product);
                }
            };

            $scope.canEdit = function(productId) {
                return $scope.edit.indexOf(productId) !== -1;
            };

            $scope.search = function(item) {
                var query = $scope.filters.searchTerm.toLowerCase(),
                    subcategory = $scope.filters.subcategory.toLowerCase(),
                    category = $scope.filters.category.toLowerCase(),
                    name = item.name ? item.name.toLowerCase() : undefined,
                    desc = item.description ? item.description.toLowerCase() : undefined,
                    itemCat = item.category ? item.category.toLowerCase() : undefined,
                    itemSub = item.subcategory ? item.subcategory.toLowerCase() : undefined;

                if ($scope.userService.currentUser || item.live !== false) {
                    if ($scope.filters.subcategory === "" && $scope.filters.category === "" && query === "") {
                        return true;
                    }
                    if ( $scope.filters.category === "" && $scope.filters.subcategory === "") {
                        if ( name.indexOf(query) !== -1 || desc.indexOf(query) !== -1 ) {
                           return true;
                        }
                    } else if ( category !== "" && subcategory !== "") {
                        if ( ((itemSub !== undefined && itemSub.indexOf(subcategory) !== -1) && (itemCat.indexOf(category) !== -1)) && (name.indexOf(query) !== -1 || desc.indexOf(query) !== -1 ))
                        {
                           return true;
                        }
                    } else {
                        if ( ((item.subcategory !== undefined && $scope.filters.subcategory !== "" && item.subcategory.indexOf($scope.filters.subcategory) !== -1) || ($scope.filters.category !== "" && item.category.indexOf($scope.filters.category) !== -1)) && (name.indexOf(query) !== -1 || desc.indexOf(query) !== -1 ))
                        {
                           return true;
                        }
                    }
                }
                return false;
            };

            $scope.getSubCategories = function(category) {
                if($scope.categories.$getRecord(category.replace(/\s/g, "-").toLowerCase())) {
                    return $scope.categories.$getRecord(category.replace(/\s/g, "-").toLowerCase()).subCategories;
                }
                return false;
            };
        }
    ]);

    shop.controller("ItemController", ["$scope", "$http", "$state", "$stateParams", "ProductService", "CategoryService", "UserService", "Filters", "BasketService", "$upload",
        function($scope, $http, $state, $stateParams, ProductService, CategoryService, UserService, Filters, BasketService, $upload) {
            $scope.userService = UserService;
            $scope.productId = $stateParams.productId;
            $scope.productService = ProductService;
            $scope.stateParams = $stateParams;
            $scope.saved = false;

            if (UserService.currentUser) {
                $scope.product = ProductService.findAll($stateParams.productId);
            } else {
                $scope.product = ProductService.find($stateParams.productId);
            }

            $scope.categories = CategoryService.categories;
            $scope.filters = Filters;
            $scope.basket = BasketService;
            $scope.images = [];
            $scope.newImages = {};
            var loadedImages = 0;
            $scope.imageLoaded = function( image ) {
                loadedImages++;
                if(UserService.currentUser === null) {
                    if (loadedImages === Object.keys($scope.product.images).length) {
                        if(typeof oldIE === "undefined" && Object.keys) {
                            baguetteBox.run(".gallery",
                            {
                                captions: true
                            });
                        }
                    }
                }
            };

            $scope.product.$watch(function() {
                loadImages();
            });

            var loadImages = function () {
                $scope.images = [];
                for ( var image in $scope.product.images ) {
                    var theImage = $scope.product.images[image];
                    var imageObj = {};
                    imageObj.$id = image;
                    imageObj.url = (window.location.host === "bscenes" ? "http://battlescene.aomegasolutions.com" : "") + "/uploads/" + theImage.filename;
                    imageObj.caption = $scope.product.name + " " + parseInt($scope.images.length + 1, 0);
                    $scope.images.push(imageObj);
                }
            };

            $scope.$watch("newImages", function() {
                for (var i = 0; i < $scope.newImages.length; i++) {
                    var file = $scope.newImages[i];
                    $scope.upload = $upload.upload({
                        url: "upload.php",
                        data: { myObj: $scope.myModelObj },
                        file: file
                    })
                    .progress(progress(file)).
                    success(success);
                }
            });
            var progress = function(file) {
                return function (evt) {
                    reportProgress(evt, file);
                };
            };
            var reportProgress = function(evt, file) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
            };
            var success = function(data, status, headers, config) {
                var image = {};
                image.filename = config.file.name;
                var safename = image.filename.replace(/\.|\#|\$|\[|\]|-|\//g, "");
                $scope.saved = false;
                if (!$scope.product.images) {
                    $scope.product.images = {};
                }
                $scope.product.images[safename] = image;
                loadImages();
            };

            $scope.breadcrumbResolver = function(defaultResolver, product) {
                if (isCurrent) {
                    return "'" + item.name + "'";
                }

                return defaultResolver(product);
            };
            $scope.removeImage = function(e, image) {
                if (UserService.currentUser) {
                    e.preventDefault();
                    var index = $scope.images.indexOf(image);
                    $scope.images.splice(index, 1);
                    delete $scope.product.images[image.$id];
                    $scope.saved = false;
                }
            };

            $scope.search = function(item) {
                var query = $scope.filters.searchTerm.toLowerCase(),
                    name = item.name.toLowerCase(),
                    desc = item.description.toLowerCase();

                if ($scope.userService.currentUser || item.live !== false) {
                    if ($scope.filters.category === "" && query === "") {
                        return true;
                    }
                    if ( $scope.filters.category !== "" ) {
                        if ( name.indexOf(query) !== -1 || desc.indexOf(query) !== -1 )
                        {
                           return true;
                        }
                    } else {
                        if ( item.category.indexOf($scope.filters.category) !== -1 && (name.indexOf(query) !== -1 || desc.indexOf(query) !== -1 ))
                        {
                           return true;
                        }
                    }
                }
                return false;
            };

            $scope.saveProduct = function(product) {
                var safename = (product.category + "-" + product.name.replace(/\s/g, "-")).toLowerCase();

                delete product.$id;
                delete product.$$conf;
                delete product.$priority;

                $scope.productService.all.$set(safename, product);
                if (product.live) {
                    $scope.productService.live.$set(safename, product);
                }
                $scope.newImages = {};
                $scope.saved = true;
            };
        }
    ]);

    shop.controller("CategoryController", ["$scope", "$stateParams", "ProductService", "CategoryService", "UserService", "Filters",
        function($scope, $stateParams, ProductService, CategoryService, UserService, Filters) {
            $scope.category = $stateParams.categoryId;
            $scope.subcategory = $stateParams.subcategoryId;
            $scope.categoryService = CategoryService;
            $scope.categories = CategoryService.categories;

            //$scope.products = ProductService.getProducts;
            //$scope.products = ProductService.products;

            UserService.authenticated.on("value", function(snap){
              if (snap.val() === true) {
                $scope.products = ProductService.all.$asArray();
              } else {
                $scope.products = ProductService.live.$asArray();
              }
            });

            $scope.filters = Filters;
            $scope.filters.category = $stateParams.categoryId || "";

            $scope.$watch('categories', function(){
                //console.log($scope.categories);
            });

            $scope.getCategoriesFromProducts = function (products) {
                var unique = {};
                var distinctCategories = {};
                for (var i in products) {
                    if (typeof(unique[products[i].category]) !== "undefined" && typeof(products[i].category) !== undefined) {
                        distinctCategories[products[i].category] = 0;
                        //distinctCategories.push(products[i].category);
                        unique[products[i].category] = 0;
                    }
                    distinctCategories[products[i].category]++;
                }
                for(var category in distinctCategories) {
                    if(category === "undefined") {
                        delete distinctCategories[category];
                    }
                }

                $scope.distinctCategories = distinctCategories;
                return distinctCategories;
            };

            $scope.getCategoryName = function(category) {
                for(var i=0;  i < CategoryService.categories.length; i++) {
                    if(CategoryService.categories[i].$id === category) {
                        return CategoryService.categories[i].name;
                    }
                }
            };

            $scope.alphaSort = function(cat) {
                return 1;
            };

            $scope.isSet = function(index) {
                return index !== $scope.categoryIndex;
            };

            $scope.saferize = function (str) {
                return str.replace(/\s/g, "-").toLowerCase();
            };

            $scope.getSubCategoriesFromProducts = function(products, category) {
                var unique = {};
                var distinctSubCategories = {};
                for (var i in products) {
                    //console.log(products[i].subcategory !== undefined && products[i].category === category);
                    if (products[i].subcategory !== undefined && products[i].category === category) {
                        distinctSubCategories[products[i].subcategory] = 0;
                        unique[products[i].subcategory] = 0;
                    }
                    distinctSubCategories[products[i].subcategory] += 1;
                }
                for(var subcategory in distinctSubCategories) {
                    if(subcategory === "undefined" || isNaN(distinctSubCategories[subcategory])) {
                        delete distinctSubCategories[subcategory];
                    }
                }
                return distinctSubCategories;
            };

            $scope.categoryIsSet = function(index) {
                return index !== $scope.categoryIndex;
            };

            $scope.subcategoryIsSet = function(index, categoryIndex) {

                return index !== $scope.subcategoryIndex;
            };

            $scope.setCategory = function(category, index) {
                $scope.filters.subcategory = "";
                $scope.subcategoryIndex = -1;
                if($scope.categoryIndex !== index) {
                    $scope.filters.category = "";
                    $scope.categoryIndex = -1;
                } else {
                    $scope.categoryIndex = index;
                    $scope.filters.category = category;
                }
            };

            $scope.setsubcategory = function(subcategory, index) {
                $scope.subcategoryIndex = -1;
                console.log($scope.subcategoryIndex !== index);
                if($scope.subcategoryIndex !== index) {

                    $scope.filters.subcategory = "";
                    $scope.subcategoryIndex = -1;
                } else {
                    $scope.subcategoryIndex = index;
                    $scope.filters.subcategory = subcategory;
                }
            };

            $scope.newCategory = {
                name: ""
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

            $scope.selectedIndex = "";
        }
    ]);

    shop.controller("BasketController", [ "$scope", "BasketService",
        function($scope, BasketService) {
            $scope.basket = BasketService;
        }
    ]);

    shop.controller("ProductController", [ "$scope", "ProductService", "CategoryService", "$upload", "currentAuth",
        function($scope, ProductService, CategoryService, $upload, currentAuth) {
            $scope.productService = ProductService;
            $scope.categories = CategoryService.categories;
            $scope.subCategories = [];
            $scope.productImages = {};
            $scope.$watch("images", function() {
                if($scope.images) {
                    for (var i = 0; i < $scope.images.length; i++) {
                        var file = $scope.images[i];
                        $scope.upload = $upload.upload({
                            url: "upload.php",
                            data: { myObj: $scope.myModelObj },
                            file: file
                        })
                        .progress(progress(file)).
                        success(success);
                    }
                }
            });
            var progress = function(file) {
                return function (evt) {
                    reportProgress(evt, file);
                };
            };
            var reportProgress = function(evt, file) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total);
            };
            var success = function(data, status, headers, config) {
                console.log("success");
                var image = {};
                image.filename = config.file.name;
                console.log(config);
                var safename = image.filename.replace(/\.|\#|\$|\[|\]|-|\//g, "");
                $scope.productImages[safename] = image;
            };

            var newProduct = {};
            $scope.newProduct = {
                    name: "",
                    price: "",
                    description: "",
                    qty: "",
                    live: ""
                };
            $scope.productErrors = [];

            $scope.getSubCategories = function() {
                $scope.subCategories = $scope.categories.$getRecord($scope.newProduct.category.replace(/\s/g, "-").toLowerCase()).subCategories;
            };

            $scope.addProduct = function() {
                $scope.productErrors = [];
                var error = {};
                if ($scope.newProduct.name === "" || $scope.newProduct.name === undefined) {
                    error = {};
                    error.name = "Name";
                    error.msg = "You need to enter a name for your product";
                    $scope.productErrors.push(error);
                }
                if (newProduct.price === "" || $scope.newProduct.price === undefined) {
                    error = {};
                    error.name = "Price";
                    error.msg = "You need to enter a price for your product";
                    $scope.productErrors.push(error);
                }
                if (newProduct.description === "" || $scope.newProduct.description === undefined) {
                    error = {};
                    error.name = "Description";
                    error.msg = "You need to enter a description for your product";
                    $scope.productErrors.push(error);
                }
                if (newProduct.qty === "" || $scope.newProduct.qty === undefined) {
                    error = {};
                    error.name = "Qty";
                    error.msg = "You need to enter a qty for your product";
                    $scope.productErrors.push(error);
                }
                if (newProduct.category === "" || $scope.newProduct.category === undefined) {
                    error = {};
                    error.name = "Category";
                    error.msg = "You need to provide a category for your product";
                    $scope.productErrors.push(error);
                }
                if ($scope.productErrors.length > 0) {
                    return false;
                }
                $scope.newProduct.images = $scope.productImages;
                $scope.newProduct.createdAt = Math.floor((new Date()).getTime());

                var safename = ($scope.newProduct.category + "-" + $scope.newProduct.name.replace(/\s/g, "-")).toLowerCase();
                $scope.productService.create(safename, $scope.newProduct);
                $scope.newProduct = {};
                $scope.productImages = {};
            };
        }
    ]);

    shop.controller("PageAdminController", [ "$scope", "PageService", "SectionService", "$upload", "currentAuth", "commonMark",
    function($scope, PageService, SectionService, $upload, currentAuth, commonMark) {
        $scope.pageService = PageService;
        $scope.sectionService = SectionService;
        var sections = SectionService.all.$asArray();
        sections.$loaded().then(function() {
            $scope.sections = sections;
        });
        $scope.images = {};
        $scope.$watch("images", function() {
            for (var i = 0; i < $scope.images.length; i++) {
                var file = $scope.images[i];
                $scope.upload = $upload.upload({
                    url: "upload.php",
                    data: { myObj: $scope.myModelObj },
                    file: file
                })
                .progress(progress(file)).
                success(success);
            }
        });
        var progress = function(file) {
            return function (evt) {
                reportProgress(evt, file);
            };
        };
        var reportProgress = function(evt, file) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        var success = function(data, status, headers, config) {
        };
        // FILTERS
        /*
        uploader.filters.push({
            name: "imageFilter",
            fn: function(item, options) {
                var type = "|" + item.type.slice(item.type.lastIndexOf("/") + 1) + "|";
                return "|jpg|png|jpeg|bmp|gif|".indexOf(type) !== -1;
            }
        });

        uploader.successItem = function(fileItem, response, status, headers) {
        var image = {};
        image.filename = fileItem._file.name;
        var safename = image.filename.replace(/\.|\#|\$|\[|\]|-|\//g, "");
        $scope.images[safename] = image;
        };
        */
        $scope.uploadingImages = true;
        var newPage = {};
        $scope.newPage = {
            title: "",
            content: "",
            live: "",
            createdAt: Math.floor((new Date()).getTime())
        };
        var newSection = {};
        $scope.newSection = {
            title: ""
        };
        $scope.pageErrors = [];

        /*
        $scope.getSubCategories = function() {
            $scope.subCategories = $scope.categories.$getRecord($scope.newProduct.category).subCategories;
        };
        */
        $scope.getPages = function() {
            var pages = PageService.getPagesBySection($scope.newPage.section).$asArray();

            pages.$loaded(function(data) {
                $scope.pages = data;
            });
        };

        $scope.setPage = function() {
            var page = $scope.pages[$scope.page];
            $scope.newPage = $scope.pages[$scope.page];
        };
        $scope.addSection = function() {
            var safename = ($scope.newSection.title.replace(/\s/g, "-")).toLowerCase();
            $scope.sectionService.create(safename, $scope.newSection);
            $scope.newPage.section = $scope.newSection.title;
            $scope.newSection = {
                title: ""
            };
        };

        $scope.addPage = function() {
            $scope.pageErrors = [];
            var error = {};
            if ($scope.newPage.title === "" || $scope.newPage.title === undefined) {
                error = {};
                error.name = "Title";
                error.msg = "You need to enter a title for your page";
                $scope.pageErrors.push(error);
            }
            if ($scope.newPage.content === "" || $scope.newPage.content === undefined) {
                error = {};
                error.name = "Content";
                error.msg = "You need to enter content for your page";
                $scope.pageErrors.push(error);
            }
            if ($scope.newPage.section === "" || $scope.newPage.section === undefined) {
                error = {};
                error.name = "Section";
                error.msg = "You need to provide a section for your page";
                $scope.pageErrors.push(error);
            }

            if ($scope.pageErrors.length > 0) {
                return false;
            }
            //$scope.newPage.images = $scope.images;

            //var safename = ($scope.newPage.section + "-" + $scope.newPage.title.replace(/\s/g, "-")).toLowerCase();
            var safename = ($scope.newPage.title.replace(/\s/g, "-")).replace(/\.|\#|\$|\[|\]|\//g, "").toLowerCase();
            //$scope.uploadingImages = false;
            //safename = imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");

            //$scope.productService.products.$set(safename, $scope.newProduct);
            if($scope.page) {
                $scope.pageService.set(safename, $scope.newPage);
            } else {
                $scope.pageService.create(safename, $scope.newPage);
            }
            $scope.newPage = {};
            $scope.page = null;
            $scope.images = {};
            //$scope.uploader.clearQueue();
        };
    }
    ]);

    shop.controller("PageController", [ "$scope", "$stateParams", "commonMark", "PageService",
        function($scope, $stateParams, commonMark, PageService) {
            var section = $stateParams.section,
                page = $stateParams.page ?
                PageService.getLivePageBySection(section, $stateParams.page).$asObject() :
                PageService.getLivePageBySection(section).$asArray(),
                pages;

            page.$loaded(function(data) {
                if ($stateParams.page) {
                    $scope.page = data;
                    pages = PageService.getLivePageBySection(section).$asArray().$loaded(function(data){
                        if (data.length > 1) {
                            data.sort(function(a, b) {
                                a = new Date(a.createdAt);
                                b = new Date(b.createdAt);
                                return a>b ? -1 : a<b ? 1 : 0;
                            });
                            $scope.pages = sortPages(data);
                        }
                    });
                } else {
                    data.sort(function(a, b) {
                        a = new Date(a.createdAt);
                        b = new Date(b.createdAt);
                        return a>b ? -1 : a<b ? 1 : 0;
                    });
                    $scope.page = data[0];
                    if (data.length > 1) {
                        $scope.pages = sortPages(data);
                    }
                }
            });

            var sortPages = function(data) {
                var pages = {},
                    month;
                angular.forEach(data, function(page) {
                    newMonth = new Date(page.createdAt).getMonth();
                    if (newMonth !== month) {
                        month = newMonth;
                        pages[month] = [];
                    }

                    pages[month].push(page);
                });
                return pages;
            };
        }
    ]);
})();
