<?php
session_start();
$uniqueValues = md5($_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']); //add more/less/any "unique" values, see comments
$_SESSION['XSRF-TOKEN'] = sha1(uniqid(microtime() . $uniqueValues, true));
setcookie('XSRF-TOKEN', $_SESSION['XSRF-TOKEN']);
?>
