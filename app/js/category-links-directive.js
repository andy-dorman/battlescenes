;
(function(){
	angular.module('shop')
	.directive('categoryLink',function(){
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var getUiSref = function(category){
	                if(category == scope.filters.category) {
	                    return "/";
	                } else {
	                    return "/#/category/" + category;
	                }
	            };
				elem.attr("href", getUiSref(scope.category));
			}
		}

	}).directive('subCategoryLink',function(){
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var scope = scope;
				var getUiSref = function(subcategory){
	                if(subcategory == scope.filters.subcategory) {
	                    return "/#/category/" + scope.category;
	                } else {
	                    return "/#/category/" + scope.category + "/" + subcategory;
	                }
	            };
				elem.attr("href", getUiSref(scope.subcategory));
			}
		}

	})
})();