;(function() {
    "use strict";
    //var bsServices = angular.module("bsServices", [ "ngResource", "ngCookies", "firebase" ]);
    var bsServices = angular.module("bsServices", [ "ngResource", "ngCookies", "firebase" ]);

    bsServices.service("Filters",
        function() {
            return {
                category: "",
                searchTerm: "",
                subcategory: ""
            };
        });

    bsServices.constant("FIREBASE_URI", "https://shining-fire-4276.firebaseio.com");
    bsServices.constant("FIREBASE_PRODUCT_URI", "https://shining-fire-4276.firebaseio.com/products");
    bsServices.constant("FIREBASE_CATEGORIES_URI", "https://shining-fire-4276.firebaseio.com/categories");
    bsServices.constant("FIREBASE_ENQUIRIES_URI", "https://shining-fire-4276.firebaseio.com/enquiries");
    bsServices.constant("FIREBASE_PAGES_URI", "https://shining-fire-4276.firebaseio.com/pages");
    bsServices.constant("FIREBASE_SECTIONS_URI", "https://shining-fire-4276.firebaseio.com/sections");

    bsServices.service("SectionService", [ "$resource", "$firebase", "FIREBASE_URI",
    function($resource, $firebase, FIREBASE_URI) {
        var ref = new Firebase(FIREBASE_URI + "/sections"),
        sections = $firebase(ref),
        refByLive = new Firebase(FIREBASE_URI + "/sectionsByLive"),
        liveSections = $firebase(refByLive),
        refLiveSectionsWithPages = new Firebase(FIREBASE_URI + "/livePagesBySection"),
        liveSectionsWithPages = $firebase(refLiveSectionsWithPages);

        //var refByLiveCategory = new Firebase(FIREBASE_URI + "/productsLiveByCategory");
        //var liveCategories = new Firebase(FIREBASE_URI + "/productsLiveByCategory");

        var addSection = function(section) {
            sections.$add(section, function(err) {
                if(err) {
                    alert(err);
                }
            });
        };

        var getSection = function(sectionId) {
            return sections.$asArray().$getRecord("/" + sectionId);
        };

        var Section = {
            all: sections,
            live: liveSections,
            liveSectionsWithPages: liveSectionsWithPages,
            create: function(name, section) {
                return sections.$set(name, section).then(function(ref) {
                    var sectionId = ref.key();
                    if (section.live) {
                        liveSections.$set(name, section);
                    }
                    return sectionId;
                });
            },
            set: function(sectionId, section) {
                var sectionCopy = angular.copy(section);

                delete sectionCopy.$id;
                delete sectionCopy.$priority;
                //Get current live value stored against current prodId
                //
                var oldname = $firebase(refByLive.child(section.$id)).$asObject();
                //Get current product by current prodId
                //
                var currentSection = $firebase(ref.child(section.$id)).$asObject();

                // If the old ref doesn"t match the new one
                //
                if (oldname && oldname.$id !== sectionId || !section.live) {
                    liveSections.$remove(oldname.$id);
                }

                if (section.live) {
                    liveSections.$set(sectionId, angular.copy(sectionCopy));
                }

                if (currentSection.$id !== sectionId) {
                    sections.$remove(currentSection.$id);

                    return sections.$set(sectionId, angular.copy(sectionCopy));
                } else {
                    return sections.$asArray().$save(section);
                }
            },
            find: function(sectionId) {
                return $firebase(refByLive.child(sectionId)).$asObject();
            },
            delete: function(section) {
                var oldname = $firebase(refByLive.child(section.$id)).$asObject();
                if (oldname) {
                    liveSections.$remove(oldname.$id);
                }

                sections.$asArray().$remove(section);
            }
        };

        return Section;
    }
    ]);

    bsServices.service("PageService", [ "$resource", "$firebase", "FIREBASE_URI",
    function($resource, $firebase, FIREBASE_URI) {
        var ref = new Firebase(FIREBASE_URI + "/pages"),
            pages = $firebase(ref),
            pagesBySectionRef = new Firebase(FIREBASE_URI + "/pagesBySection"),
            pagesBySection = $firebase(pagesBySectionRef),
            livePagesBySectionRef = new Firebase(FIREBASE_URI + "/livePagesBySection"),
            livePagesBySection = $firebase(livePagesBySectionRef),
            refByLive = new Firebase(FIREBASE_URI + "/pagesByLive"),
            livePages = $firebase(refByLive);

        //var refByLiveCategory = new Firebase(FIREBASE_URI + "/productsLiveByCategory");
        //var liveCategories = new Firebase(FIREBASE_URI + "/productsLiveByCategory");

        var addPage = function(page) {
            pages.$add(page, function(err) {
                if(err) {
                    alert(err);
                }
            });
        };

        var getPage = function(pageId) {
            return pages.$asArray().$getRecord("/" + pageId);
        };

        var getLivePageBySection = function(section, pageId) {
            var path = FIREBASE_URI + "/livePagesBySection/" + section;
            if (pageId) {
                path += "/" + pageId;
            }
            var ref = new Firebase(path);
            return $firebase(ref);
        };

        var getPagesBySection = function(section, pageId) {
            var path = FIREBASE_URI + "/pagesBySection/" + section;
            if (pageId) {
                path += "/" + pageId;
            }
            var ref = new Firebase(path);
            return $firebase(ref);
        };

        var Page = {
            all: pages,
            live: livePages,
            create: function(name, page) {
                // Add the page to the page tree...
                //
                return pages.$set(name, page).then(function(ref) {
                    var pageId = ref.key(),
                        pageBySection = $firebase(new Firebase(FIREBASE_URI + "/pagesBySection/" + page.section));
                    // Add the page to the pageBySection tree...
                    //
                    pageBySection.$set(name, page);
                    // If it's live add it to the 'liveBy' trees...
                    //
                    if (page.live) {
                        livePages.$set(name, page);
                        var livePageBySection = $firebase(new Firebase(FIREBASE_URI + "/livePagesBySection/" + page.section));
                        livePageBySection.$set(name, page);
                    }
                    return pageId;
                });
            },
            set: function(pageId, page) {
                var pageCopy = angular.copy(page),
                    livePageBySection = $firebase(new Firebase(FIREBASE_URI + "/livePagesBySection/" + page.section));

                delete pageCopy.$id;
                delete pageCopy.$priority;
                //Get current live value stored against current pageId
                //
                var oldname = $firebase(refByLive.child(page.$id)).$asObject();
                //Get current product by current prodId
                //
                var currentPage = $firebase(ref.child(page.$id)).$asObject();

                // If the old ref doesn"t match the new one
                //
                if (oldname && oldname.$id !== pageId || !page.live) {
                    livePages.$remove(oldname.$id);
                    livePageBySection.$remove(oldname.$id);
                }

                if (page.live) {
                    livePages.$set(pageId, angular.copy(pageCopy));
                    livePageBySection.$set(pageId, angular.copy(pageCopy));
                }

                var pageBySection = $firebase(new Firebase(FIREBASE_URI + "/pagesBySection/" + page.section));
                if (currentPage.$id !== pageId) {
                    pages.$remove(currentPage.$id);
                    pageBySection.$remove(currentPage.$id);
                    pageBySection.$set(pageId, angular.copy(pageCopy));
                    return pages.$set(pageId, angular.copy(pageCopy));
                } else {
                    pageBySection.$asArray().$save(page);
                    return pages.$asArray().$save(page);
                }
            },
            find: function(pageId) {
                return $firebase(refByLive.child(pageId)).$asObject();
            },
            delete: function(page) {
                var oldname = $firebase(refByLive.child(page.$id)).$asObject();
                if (oldname) {
                    livePages.$remove(oldname.$id);
                }

                pages.$asArray().$remove(page);
            },
            getLivePageBySection: getLivePageBySection,
            getPagesBySection: getPagesBySection
            };

            return Page;
        }
    ]);

    bsServices.service("ProductService", [ "$resource", "$firebase", "FIREBASE_URI",
        function($resource, $firebase, FIREBASE_URI) {
            var ref = new Firebase(FIREBASE_URI + "/products");

            var products = $firebase(ref);
            var refByLive = new Firebase(FIREBASE_URI + "/productsByLive");

            var liveProducts = $firebase(refByLive);

            var refByLiveCategory = new Firebase(FIREBASE_URI + "/productsLiveByCategory");
            var liveCategories = new Firebase(FIREBASE_URI + "/productsLiveByCategory");

            var addProduct = function(product) {
                products.$add(product, function(err) {
                    if(err) {
                        alert(err);
                    }
                });
            };
            //sync.$loaded().then(function(){
            //    console.log("loaded records", sync.$id, sync["safename"]);
            //});
            /*sync.$loaded().then(function(){
                ref.child("safename").startAt("6mm-defence-bunker").endAt("6mm-defence-bunker").once("value", function(snap){
                    console.log(snap.val());
                })
            });*/

            var getProduct = function(productId) {
                return products.$asArray().$getRecord("/"+productId);
            };

            var Product = {
                all: products,
                live: liveProducts,
                refByLive: refByLive,
                ref: ref,
                create: function (name, product) {
                  return products.$set(name, product).then(function (ref) {
                    var productId = ref.key();
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
                    //console.log(oldname);
                    //Get current product by current prodId
                    //
                    var currentProduct = $firebase(ref.child(product.$id)).$asObject();
                    //console.log(currentProduct);
                    // If the old ref doesn"t match the new one
                    //
                    if (oldname && oldname.$id !== productId || !product.live) {
                        liveProducts.$remove(oldname.$id);
                    }

                    if(product.live) {
                        liveProducts.$set(productId, angular.copy(productCopy));
                    }

                    if(currentProduct.$id !== productId) {
                        products.$remove(currentProduct.$id);
                        return products.$set(productId, angular.copy(productCopy));
                    } else {
                        return products.$set(productId, productCopy);
                        /*
                        var productsArray = products.$asArray();
                        productsArray.$loaded().then(function(array) {
                            console.log(array.$save(product));
                            return array.$save(product);
                        });*/
                    }
                },
                find: function (productId) {
                  return $firebase(refByLive.child(productId)).$asObject();
                },
                findAll: function (productId) {
                    return $firebase(ref.child(productId)).$asObject();
                },
                delete: function (product) {
                    var oldname = $firebase(refByLive.child(product.$id)).$asObject();
                    if (oldname) {
                        liveProducts.$remove(oldname.$id);
                    }

                    products.$asArray().$remove(product);

                    /*var product = Product.find(productId);
                    product.deleted = true;
                    product.$on("loaded", function () {
                    liveProducts.$remove(product.name);
                    products.$child(productId).$set(product);
                    });*/
                }
              };
              return Product;
        }
    ]);

    bsServices.service("CategoryService", ["$resource", "$firebase", "FIREBASE_CATEGORIES_URI",
        function($resource, $firebase, FIREBASE_CATEGORIES_URI) {
            var ref = new Firebase(FIREBASE_CATEGORIES_URI);
            var sync = $firebase(ref);

            var categories = sync.$asArray();

            var addCategory = function(category) {
                //var safename = (category.key.replace(/\s/g, "-")).toLowerCase();
                var safename = (category.name.replace(/\s/g, "-")).toLowerCase();
                sync.$set(safename, category);
            };

            var addCategoryToParent = function(parentCategory, category) {
                //var safename = (category.key.replace(/\s/g, "-")).toLowerCase();
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
                        });
                    }
                });
            };

            return {
                categories: categories,
                addCategory: addCategory,
                addCategoryToParent: addCategoryToParent
            };
        }]);

    bsServices.factory("Products", ["$resource",
        function($resource) {
            return $resource("products/:productId.json", {}, {
                query: {
                    method: "GET",
                    params: { productId: "products" },
                    isArray: true
                    }
            });
        }]);

    bsServices.service("ContactService", ["$resource", "$firebase", "FIREBASE_ENQUIRIES_URI",
        function($resource, $firebase, FIREBASE_ENQUIRIES_URI) {
            var ref = new Firebase(FIREBASE_ENQUIRIES_URI);
            var sync = $firebase(ref);

            return {
                enqSync: sync
            };
        }]);

    bsServices.service("BasketService", ["$cookieStore", function($cookieStore) {
        var items = {};
        var Basket = {
            items : items,
            add : function(product, skipCookie) {
                var basketInitialisation = skipCookie || false;
                var productId = basketInitialisation ? product.id : product.$id;
                if(items[productId]) {
                    items[productId].count++;
                } else {
                    var image;
                    for (var img in product.images) {
                        image = img;
                        break;
                    }

                    var item = {
                        category: product.category,
                        count: product.count || 1,
                        name: product.name,
                        price: product.price,
                        id: productId
                    };

                    if(image !== undefined && image !== null) {
                        item.img = product.images[image].filename;
                    } else {
                        item.img = product.img || "";
                    }
                    items[productId] = item;
                }

                if(!skipCookie) {
                    var basketCookie = $cookieStore.get("basketCookie");
                    if(basketCookie === undefined || basketCookie === "") {
                        $cookieStore.put("basketCookie", []);
                        basketCookie = $cookieStore.get("basketCookie");
                    }
                    var itemAdded = false;
                    for (var i = 0; i < basketCookie.length; i++) {
                        if(basketCookie[i].id === productId) {
                            basketCookie.splice(i,1, items[productId]);
                            itemAdded = true;
                            break;
                        }
                    }
                    if(itemAdded === false) {
                        basketCookie.push(items[productId]);
                    }
                    $cookieStore.put("basketCookie", basketCookie);
                }
            },
            init: function(items) {
                for (var item in items) {
                    this.add(items[item], true);
                }
            },
            total: function() {
                var basket = items,
                    price = 0;
                for (var item in basket) {
                    if (basket[item] !== undefined) {
                        price += parseInt(basket[item].count) * parseFloat(basket[item].price);
                    }
                }
                return price;
            },
            count: function() {
                var basket = items,
                    count = 0;
                for (var item in basket) {
                    if (basket[item] !== undefined) {
                        count += basket[item].count;
                    }
                }
                return count;
            },
            basketText: function() {
                var text = this.total() > 0 ? "\xA3" + this.total().toFixed(2) + " - " + this.count() + (this.count() > 1 ? " items" : "item") : "empty";
                return text;
            },
            itemCount: function(product) {
                if (items[product.$id]) {
                    return items[product.$id].count;
                }
            },

            empty: function() {
                items = {};
                $cookieStore.remove("basketCookie");
            },

            contains: function(product) {
                return items[product.$id];
            }
        };

        return Basket;
    }
    ]);
})();
