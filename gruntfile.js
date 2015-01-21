module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		bower: {
		  install: {
		    options: {
		      install: true,
		      copy: false,
		      targetDir: "./libs",
		      cleanTargetDir: true
		    }
		  }
		},
        jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				},
				reporter: require("jshint-stylish-ex")
			},
			all: [ "gruntfile.js", "js/*.js", "js/**/*.js" ]
		},
		/*karma: {
		  options: {
		    configFile: "config/karma.conf.js"
		  },
		  unit: {
		    singleRun: true
		  },

		  continuous: {
		    singleRun: false,
		    autoWatch: true
		  }
		},*/
		html2js: {
		  dist: {
		    src: [ "app/views/*.html", "app/directives/pagination/dirPagination.tpl.html" ],
		    dest: "tmp/views.js"
		  }
		},
		compass: {
			dist: {
				options: {
					sassDir: "sass",
					cssDir: "css",
                    environment: "production"
				}
			}
		},
		concat: {
			options: {
				separator: ";"
			},
			dist: {
				src: [
				"tmp/*.js",
				"libs/jquery/build/release.js",
				"libs/firebase/firebase.js",
				"libs/angular/angular.js",
				"libs/angularfire/dist/angularfire.min.js",
				"libs/angular-touch/angular-touch.js",
				"libs/angular-bootstrap/ui-bootstrap-tpls.js",
				"libs/angular-bootstrap/ui-bootstrap.js",
				"libs/angular-loading-bar/build/loading-bar.js",
				"libs/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js",
				"libs/angular-resource/angular-resource.js",
				"libs/ng-cookies/dist/ng-cookies.min.js",
				"libs/angular-ui-router/release/angular-ui-router.min.js",
				"libs/angular-ui-utils/modules/event/event.js",
				"libs/angular-ui-utils/modules/keypress/keypress.js",
				"libs/ng-file-upload/angular-file-upload.min.js",
				"libs/ng-file-upload-shim/angular-file-upload.min.js",
				"libs/angular-utils-pagination/dirPagination.js",
				//"libs/firebase-simple-login/firebase-simple-login.js",
				"libs/angular-commonmark/lib/commonmark.js",
				"libs/angular-commonmark/angular-CommonMark.js",
				"js/stateSecurity.js",
				"js/services/userService.js",
				"js/users/authenticationService.js",
				"js/services.js",
				"js/basket.js",
				"js/app.js",
				"js/filters.js",
				"js/directives.js",
				"js/fp-image-upload.js",
				"js/fp-src.js",
				],
				dest: "dist/js/battlescene.js"
			},
			app: {
			    src: [
					"libs/jquery/dist/jquery.js",
					"libs/firebase/firebase.js",
					"libs/angular/angular.js",
					"libs/baguettebox.js/dist/baguetteBox.min.js",
					"libs/angularfire/dist/angularfire.js",
					"libs/angular-touch/angular-touch.js",
					"libs/angular-bootstrap/ui-bootstrap-tpls.js",
					"libs/angular-bootstrap/ui-bootstrap.js",
					"libs/angular-loading-bar/build/loading-bar.js",
					"libs/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js",
					"libs/angular-utils-pagination/dirPagination.js",
					"libs/angular-resource/angular-resource.js",
					"node_modules/angular-cookies/angular-cookies.js",
					"libs/angular-ui-router/release/angular-ui-router.js",
					"libs/angular-ui-utils/modules/event/event.js",
					"libs/angular-ui-utils/modules/keypress/keypress.js",
					"libs/ng-file-upload/angular-file-upload.min.js",
					"libs/ng-file-upload-shim/angular-file-upload.min.js",
					//"libs/firebase-simple-login/firebase-simple-login.js",
					"libs/angular-commonmark/lib/commonmark.js",
					"libs/angular-commonmark/angular-CommonMark.js",
					"js/stateSecurity.js",
					"js/services/userService.js",
					"js/users/authenticationService.js",
					"js/services.js",
					"js/basket.js",
					"js/app.js",
					"js/filters.js",
					"js/directives.js",
					"js/fp-image-upload.js",
					"js/fp-src.js",
					"libs/bootstrap/dist/js/bootstrap.js",
					"tmp/*.js"
			     ],
			    dest: "app/js/battlescene.js"
			},
		},
        uglify: {
            all: {
                files: {
                    "app/js/battlescene.js": [
						"app/js/battlescene.js"
                    ]
                },
                options: {
		          mangle: false
		        }
            }
        },
		clean: {
		  temp: {
		    src: [ "tmp" ]
		  },
		  dist: {
		  	src: [ "dist" ]
		  }
		},
        cssmin: {
        	all: {
        		files: {
        			"app/css/battlescene.css": [
						"libs/bootstrap/dist/css/bootstrap.min.css",
        				"libs/bootstrap/dist/css/bootstrap-theme.css",
        				"libs/angular-loading-bar/build/loading-bar.css",
        				//"libs/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.css",
						"libs/baguettebox.js/dist/baguetteBox.min.css",
        				"css/battlescene.css"
        			]

        		}
        	}
        },
		watch: {
		  dev: {
		    files: [ "gruntfile.js", "./js/*.js", "*.html" ],
		    tasks: [ "jshint", "html2js:dist", "compass:dist", "concat:app", "cssmin", "clean:temp" ],
		    options: {
		      atBegin: true
		    }
		  },
		  min: {
		    files: [ "gruntfile.js", "./js/*.js", "*.html" ],
		    tasks: [ "jshint", "karma:unit", "html2js:dist", "compass:dist", "concat:app", "cssmin", "clean:temp", "uglify" ],
		    options: {
		      atBegin: true
		    }
		  }
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-html2js");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-bower-task");
	grunt.registerTask("default",[ "bower", "clean:dist", "jshint", "html2js:dist", "compass:dist", "concat:app", "uglify", "clean:temp", "cssmin", "watch:dev" ]);

};
