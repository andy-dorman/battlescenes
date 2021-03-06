<!DOCTYPE html>
<html lang="en" ng-app="shop" ng-controller="RootController">
    <head>
        <title ng-bind-template="Battlescene Designs - {{viewTitle}}">Home - Battlescene Designs</title>
        <base href="/">
        <meta name="google-site-verification" content="G20ybNMLVIRjTEjxRQSTyZEeBCka5yYits_6xF8nNz4"/>
        <meta name="google-site-verification" content="G20ybNMLVIRjTEjxRQSTyZEeBCka5yYits_6xF8nNz4"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="css/battlescene.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/png" href="http://battlescenedesigns.co.uk/img/favicon.png">
        <!--[if lte IE 9]>
        <script>
        document.createElement('header');
        document.createElement('nav');
        document.createElement('section');
        document.createElement('article');
        document.createElement('aside');
        document.createElement('footer');
        document.createElement('hgroup');
        </script>
        <script src="/js/old_browser_warning.js"></script><script>window.onload = function () { var is_root = location.pathname == "/"; if(is_root) { e("/img/browser_upgrade/") } }</script>
        <![endif]-->
    </head>
    <body data-status="{{status}}" class="container-fluid jumbotron" ng-class="{admin : userService.currentUser}">
        <div ui-view></div>
        <!--<script src="http://nervgh.github.io/js/es5-shim.min.js"></script>
        <script src="http://nervgh.github.io/js/es5-sham.min.js"></script>-->
        <script type="text/javascript" src="js/battlescene.js"></script>
    </body>

</html>
