;(function(){
	angular.module('shop')
	.directive('categoryLink',function(){
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var getUiSref = function(category){
	                if(category === scope.filters.category) {
	                    return "/";
	                } else {
	                    return "/#/category/" + category;
	                }
	            };
				elem.attr("href", getUiSref(scope.category));
			}
		};
	})
	.directive('subCategoryLink',function(){
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var getUiSref = function(subcategory){
	                if(subcategory === scope.filters.subcategory) {
	                    return "/#/category/" + scope.category;
	                } else {
	                    return "/#/category/" + scope.category + "/" + subcategory;
	                }
	            };
				elem.attr("href", getUiSref(scope.subcategory));
			}
		};
	})
	.directive('bscenesSrc', function(){
		return {
			restrict: 'A',
			link: function ( scope, elem, attrs ) {
				var getImgUrl = function(filename) {
					var imgUrl = "";

					if(window.location.host === "bscenes") {
						imgUrl = "http://battlescenedesigns.co.uk/uploads/" + filename;
					} else {
						imgUrl = "/uploads/" + filename;
					}

					return imgUrl;
				};
				elem.attr('src', getImgUrl(attrs.bscenesSrc));
			}
		};
	})
	.directive('productBreadcrumbs',function(){
		return {
			restrict: 'E',
			templateUrl: 'views/directives/product.breadcrumbs.html',
			controller: function($scope) {
				$scope.saferize = function (str) {
					return str.replace(/\s/g, "-").toLowerCase();
				};
			}
		};
	})
	.directive('categoryFilters', function(){
		return {
			restrict: 'E',
			templateUrl: 'views/directives/category.filters.html',
			controller: 'CategoryController'
		};
	})
	.directive('basketContents', function(){
		return {
			restrict: 'E',
			templateUrl: 'views/directives/basket.contents.html',
			controller: 'BasketController'
		};
	})
	.directive('basket', function(){
		return {
			restrict: 'E',
			templateUrl: 'views/directives/basket.html',
			controller: 'BasketController'
		};
	})
	.directive(
		"bnLoad",
		function() {
			// I bind the DOM events to the scope.
			function link( $scope, element, attributes ) {
				// I evaluate the expression in the currently
				// executing $digest - as such, there is no need
				// to call $apply().
				function handleLoadSync() {
					logWithPhase( "handleLoad - Sync" );
					$scope.$eval( attributes.bnLoad );
				}

				// I evaluate the expression and trigger a
				// subsequent $digest in order to let AngularJS
				// know that a change has taken place.
				function handleLoadAsync() {
					logWithPhase( "handleLoad - Async" );
					$scope.$apply(
						function() {
							handleLoadSync();
						}
					);
				}

				// I log the given value with the current scope
				// phase.
				function logWithPhase( message ) {
					//console.log( message, ":", $scope.$$phase );
				}

				// -------------------------------------- //
				// -------------------------------------- //
				// Check to see if the image has already loaded.
				// If the image was pulled out of the browser
				// cache; or, it was loaded as a Data URI,
				// then there will be no delay before complete.
				if ( element[ 0 ].src && element[ 0 ].complete ) {
					handleLoadSync();
					// The image will be loaded at some point in the
					// future (ie. asynchronous to link function).
				} else {
					element.on( "load.bnLoad", handleLoadAsync );
				}
				// For demonstration purposes, let's also listen
				// for the attribute interpolation to see which
				// phase the scope is in.
				attributes.$observe(
					"src",
					function( srcAttribute ) {
						logWithPhase( "$observe : " + srcAttribute );
					}
				);

				// For demonstration purposes, let's also watch
				// for changes in the image complete value. NOTE:
				// the directive should NOT know about this model
				// value; but, we are examining life cycles here.
				$scope.$watch(
					"( image || staticImage ).complete",
					function( newValue ) {
						logWithPhase( "$watch : " + newValue );
					}
				);

				// -------------------------------------- //
				// -------------------------------------- //

				// When the scope is destroyed, clean up.
				$scope.$on(
					"$destroy",
					function() {
						element.off( "load.bnLoad" );
					}
				);
			}

			// Return the directive configuration.

			return ({
				link: link,
				restrict: "A"
			});
		}
	)
	.directive(
		'viewTitle',
		['$rootScope', function ($rootScope) {
			return {
				restrict: 'EA',
				link: function (scope, iElement, iAttrs, controller, transcludeFn) {
					// If we've been inserted as an element then we detach from the DOM because the caller
					// doesn't want us to have any visual impact in the document.
					// Otherwise, we're piggy-backing on an existing element so we'll just leave it alone.
					var tagName = iElement[0].tagName.toLowerCase();
					if (tagName === 'view-title' || tagName === 'viewtitle') {
						iElement.remove();
					}

					scope.$watch(
						function () {
							return iElement.text();
						},
						function (newTitle) {
							$rootScope.viewTitle = newTitle;
						}
					);
					scope.$on(
						'$destroy',
						function () {
							delete $rootScope.viewTitle;
						}
					);
				}
			};
		}]
	)
	.directive(
		'viewHead',
		function () {
			var head = angular.element(document.head);
			return {
				restrict: 'A',
				link: function (scope, iElement, iAttrs, controller, transcludeFn) {
					// Move the element into the head of the document.
					// Although the physical location of the document changes, the element remains
					// bound to the scope in which it was declared, so it can refer to variables from
					// the view scope if necessary.
					head.append(iElement);

					// When the scope is destroyed, remove the element.
					// This is on the assumption that we're being used in some sort of view scope.
					// It doesn't make sense to use this directive outside of the view, and nor does it
					// make sense to use it inside other scope-creating directives like ng-repeat.
					scope.$on(
						'$destroy',
						function () {
							iElement.remove();
						}
					);
				}
			};
		}
	);
})();
