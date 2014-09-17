;
(function() {
	angular.module('shop')
	.directive('fbSrc', ['$log', function ($log) {
		// Used to embed images stored in Firebase
		
		/*
		Required attributes:
			fp-src (The name of an image stored in Firebase)
		*/
		return {
			link: function (scope, elem, attrs) {
				var safename = attrs.fbSrc.replace(/\.|\#|\$|\[|\]|-|\//g, "");
				elem.attr('alt', attrs.fbSrc);
				var imgData = attrs.src;

	            var generateThumbnail = function( elem ) {
	                var canvas = document.createElement('canvas');
	                var imgEl = elem;
	                var img = new Image();
	                img.src = attrs.src;

	                img.onload = function() {
	                    canvas.id = "tmpCanvas";
	                    var thumbSize = attrs.width;
	                    if(thumbSize) {
	                    	var scale = thumbSize/this.width;
	                    	canvas.width = thumbSize;
	                    	canvas.height = parseInt(this.height * scale, 10);
	                    } else {
	                    	canvas.width = this.width;
	                    	canvas.height = this.height;
	                    }

	                    if(canvas.getContext) {
	                        var context = canvas.getContext("2d");
	                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
	                        var dataUrl = canvas.toDataURL();;

	                        if( dataUrl != null && dataUrl != undefined ) {	                            
	                            imgEl.attr('src', dataUrl);
	                        }
	                    }
	                }
	            }

	            //generateThumbnail(elem);
	            //console.log(attrs);
	            elem.attr('src', imgData);

                //reader.readAsDataURL(file);
				/*dataRef.once('value', function (snapshot) {
					var image = snapshot.val();
					if (!image) {
						$log.log('It appears the image ' + attrs.fbSrc + ' does not exist.');
					}else{
						elem.attr('src', image.data);
					}
				});*/
			},
			restrict: 'A'
		};
	}]);
})();