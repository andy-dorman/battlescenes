<?php
session_start();
$uniqueValues = md5($_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']); //add more/less/any "unique" values, see comments
$_SESSION['XSRF-TOKEN'] = sha1(uniqid(microtime() . $uniqueValues, true));
setcookie('XSRF-TOKEN', $_SESSION['XSRF-TOKEN']);
?>
<!DOCTYPE html>
<html lang="en" ng-app="shop" ng-controller="RootController">
    <head>
        <base href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="css/battlescene.css" rel="stylesheet"/>
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
    <body class="container-fluid jumbotron" ng-class="{admin : userService.currentUser}">
        <div ui-view></div>
        <!--<script src="http://nervgh.github.io/js/es5-shim.min.js"></script>
        <script src="http://nervgh.github.io/js/es5-sham.min.js"></script>-->
        <script type="text/javascript" src="js/battlescene.js"></script>
    </body>

</html>
