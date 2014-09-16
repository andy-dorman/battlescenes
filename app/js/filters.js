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
	})
	.filter('toRows', function(){
        return function(items, itemsPerRow) {
            var filtered = [];
            if(items) {
	            for(var i = 0; i < items.length; i+=2) {
	                var rowArray = [];
	                rowArray.push(items[i]);
	                if(items[i+1]) {
	                    rowArray.push(items[i+1]);
	                }
	                filtered.push(rowArray);
	            }
	        }
            return filtered;
        }
    });
})();