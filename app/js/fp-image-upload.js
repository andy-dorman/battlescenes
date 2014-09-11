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
					}
				});
	 
	 			var pushImage = function(imgObj) {
	 				if ( 	imgObj.data != null && imgObj.data != undefined ) {
	 					/*
	 					&& 	imgObj.thumbnail != null && imgObj.thumbnail != undefined
	 					&& 	imgObj.galleryImage != null && imgObj.galleryImage != undefined
	 					&& 	imgObj.galleryThumbnail != null && imgObj.galleryThumbnail != undefined) {*/
	 					var safename = imgObj.safename
	 					delete imgObj.safename;
	 					scope.images[safename] = imgObj;
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
/*
	            var generateGalleryImage = function( e, imgObj ) {
	                var canvas = document.createElement('canvas');
	                var img = new Image();
	                img.src = e.target.result;
	                img.onload = function() {
	                    canvas.id = "tmpCanvas";
	                    var thumbSize = '228';
	                    var scale = thumbSize/this.width;
	                    canvas.width = thumbSize;
	                    canvas.height = parseInt(this.height * scale, 10);

	                    if(canvas.getContext) {
	                        var context = canvas.getContext("2d");
	                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
	                        var dataUrl = canvas.toDataURL();
	                        //scope.image.galleryImage = dataUrl;
	                        imgObj.galleryImage = dataUrl;
	                        if( dataUrl != null && dataUrl != undefined ) {
	                            var newThumb = document.createElement('img');
	                            newThumb.src = dataUrl;
	                            document.getElementById('thumbHolder').appendChild(newThumb);
	                            pushImage(imgObj);
	                        }
	                    }
	                }
	            }

	            var generateGalleryThumbnail = function( e, imgObj ) {
	                var canvas = document.createElement('canvas');
	                var img = new Image();
	                img.src = e.target.result;
	                img.onload = function() {
	                    canvas.id = "tmpCanvas";
	                    var thumbSize = '50';
	                    var scale = thumbSize/this.width;
	                    canvas.width = thumbSize;
	                    canvas.height = parseInt(this.height * scale, 10);

	                    if(canvas.getContext) {
	                        var context = canvas.getContext("2d");
	                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
	                        var dataUrl = canvas.toDataURL();
	                        //scope.image.galleryImage = dataUrl;
	                        imgObj.galleryThumbnail = dataUrl;
	                        
							if( dataUrl != null && dataUrl != undefined ) {
	                            var newThumb = document.createElement('img');
	                            newThumb.src = dataUrl;
	                            document.getElementById('thumbHolder').appendChild(newThumb);
	                            pushImage(imgObj);
	                        }                
	                    }
	                }
	            }
	            */

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
/*
                        galleryReader.onload = (function(imgObj) {
                        	return function(evt) {
                        		generateGalleryImage( evt, imgObj );
                        	};
                        })(imgObj);

                        galleryReader.readAsDataURL(file);

                        galleryThumbReader.onload = (function(imgObj) {
                        	return function(evt) {
                        		generateGalleryThumbnail( evt, imgObj );
                        	};
                        })(imgObj);

                        galleryThumbReader.readAsDataURL(file);*/
                    }
	            }
	 
				element[0].onchange = function() {
					load_image(element[0]);
				};
			},
			restrict: 'A'
		};
	}]);
})();