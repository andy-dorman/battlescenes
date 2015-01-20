;(function(){
	angular.module('shop')
	.directive('productBreadcrumbs',function(){
		return {
			restrict: 'E',
			templateUrl: 'views/product.breadcrumbs.html',
			controller: function($scope) {
				$scope.saferize = function (str) {
					return str.replace(/\s/g, "-").toLowerCase();
				};
			}
		};

	});
})();