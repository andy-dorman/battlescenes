;
(function() {
	angular.module('shop')
	.directive('fbImageUpload', [function() {
		return {
			link: function(scope, element, attrs) {
				// Modified from https://developer.mozilla.org/en-US/docs/Web/API/FileReader
				
				var fileFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
				var wasUploading = false;
	 			
				scope.images = {};
				
				scope.$watch('uploadingImages', function () {
					var isUploading = scope.uploadingImages;
					if (isUploading && !wasUploading) {
						wasUploading = true;
					}else if (!isUploading && wasUploading) {
						wasUploading = false;
						element.parent().parent()[0].reset();
						var myNode = document.getElementById('thumbHolder');
						while (myNode.lastChild) {
						    myNode.removeChild(myNode.lastChild);
						}
						scope.uploadingImages = true;
					}
				});
	 
	 			var pushImage = function(imgObj) {
	 				if ( 	imgObj.data != null && imgObj.data != undefined ) {
	 					/*
	 					&& 	imgObj.thumbnail != null && imgObj.thumbnail != undefined
	 					&& 	imgObj.galleryImage != null && imgObj.galleryImage != undefined
	 					&& 	imgObj.galleryThumbnail != null && imgObj.galleryThumbnail != undefined) {*/
	 					var safename = imgObj.safename
	 					if(safename) {
		 					delete imgObj.safename;
		 					scope.images[safename] = imgObj;
		 				}
	 				}
	 			}

				var getImageData = function ( e, imgObj ) {
					//scope.$apply(function () {
						imgObj.data = e.target.result;
						pushImage(imgObj);
					//});
				};
	 
				var load_image = function(imageInput) {
					if (imageInput.files.length === 0) { 
						return;
					}
	 
					var files = imageInput.files;
	 				for ( var i = 0; i < files.length; i++ ) {

	 					var file = files[i];
	 					var fileReader = new FileReader();
	 					var image = {};
	 					fileReader.onload = (function(imgObj) {
	 						return function (evt) {
	 							getImageData(evt, imgObj)
	 						};
	 					})(image);


						image.filename = file.name;
		 				image.safename = file.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");
						if (!fileFilter.test(file.type)) { 
							scope.error = 'You must select a valid image!';
							//scope.image.valid = false;
							scope.$apply();
							return; 
						} else {
							scope.error = '';
							//scope.image.valid = true;
						}
		 
						fileReader.readAsDataURL(file);

						addThumbs(file, image);
					}

					scope.$apply();
				};

	            var generateThumbnail = function( e, imgObj ) {
	                var canvas = document.createElement('canvas');
	                var img = new Image();
	                img.src = e.target.result;
	                img.onload = function() {
	                    canvas.id = "tmpCanvas";
	                    var thumbSize = '128';
	                    var scale = thumbSize/this.width;
	                    canvas.width = thumbSize;
	                    canvas.height = parseInt(this.height * scale, 10);

	                    if(canvas.getContext) {
	                        var context = canvas.getContext("2d");
	                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
	                        var dataUrl = canvas.toDataURL();
	                        //scope.image.thumbnail = dataUrl;
	                        //imgObj.thumbnail = dataUrl;
	                        if( dataUrl != null && dataUrl != undefined ) {
	                            var newThumb = document.createElement('img');
	                            newThumb.src = dataUrl;
	                            document.getElementById('thumbHolder').appendChild(newThumb);
	                            pushImage(imgObj);
	                        }
	                    }
	                }
	            }

	            var addThumbs = function( file, imgObj ) {
                    var imageType = /image.*/;

                    if( !file.type.match(imageType) ) {
                        //<span id="IL_AD12" class="IL_AD">continue</span>;
                    }

                    var thumbReader = new FileReader();
                    //var galleryReader = new FileReader();
                    //var galleryThumbReader = new FileReader();

                    if( thumbReader != null) {
                        thumbReader.onload = (function(imgObj) {
                        	return function(evt) {
                        		generateThumbnail( evt, imgObj );
                        	};
                        })(imgObj);

                        thumbReader.readAsDataURL(file);
                    }
	            }
	 
				element[0].onchange = function() {
					load_image(element[0]);
				};
			},
			restrict: 'A'
		};
	}])
	.directive('ngThumb', ['$window', function($window) {
	    var helper = {
	        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
	        isFile: function(item) {
	            return angular.isObject(item) && item instanceof $window.File;
	        },
	        isImage: function(file) {
	            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
	            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	        }
	    };

	    return {
	        restrict: 'A',
	        template: '<canvas/>',
	        link: function(scope, element, attributes) {
	            if (!helper.support) return;

	            var params = scope.$eval(attributes.ngThumb);

	            if (!helper.isFile(params.file)) return;
	            if (!helper.isImage(params.file)) return;

	            var canvas = element.find('canvas');
	            var reader = new FileReader();

	            reader.onload = onLoadFile;
	            reader.readAsDataURL(params.file);

	            function onLoadFile(event) {
	                var img = new Image();
	                img.onload = onLoadImage;
	                img.src = event.target.result;
	            }

	            function onLoadImage() {
	                var width = params.width || this.width / this.height * params.height;
	                var height = params.height || this.height / this.width * params.width;
	                canvas.attr({ width: width, height: height });
	                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
	            }
	        }
	    };
	}]);
})();