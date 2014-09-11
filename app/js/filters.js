;
(function() {
	angular.module('shopFilters', []).filter('obj2Arr', function() {
		return function(obj) {
	        if (typeof obj === 'object') {
	            var arr = [], i = 0, key;
	            for( key in obj ) {
	                arr[i] = obj[key];
	                i++;
	            }
	            return arr;
	        }
	        else {
	            return obj;
	        }

	    };
	});
})();