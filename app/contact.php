<?php
function verifyXSRF() {

    /*
    $headers = apache_request_headers();
    $headerToken = "";
    foreach ($headers as $header => $value) {
        if ($header == "X-XSRF-TOKEN") {
            $headerToken = $value;
            break;
        }
    }
    */

    //more efficient, see comments
    $headerToken = $_SERVER['HTTP_X_XSRF_TOKEN'];
    if ($headerToken != $_SESSION['XSRF-TOKEN']) return false;
    return true;
}

session_start();
if (!verifyXSRF()) {
	$errors['Cross site scripting'] = "Cross site scripting attack detected.";
	$data['success'] = false;
	$data['errors'] = $errors;

	die(json_encode($data));
}

/* TODO
	Implement csrf token - instantiated on index.html (index.php) and passed along with $http calls
	Bookmarked a method of doing this...
**/

//define("BSCENES_EMAIL", "andydorman@gmail.com");
define("BSCENES_EMAIL", "battlescenedesigns@hotmail.co.uk");
define("MY_EMAIL", "andydorman@gmail.com");
define("BSCENES_THANKS_SUBJECT", "Thank you for you enquiry");

$errors = array();
$data = array();

if(empty($_POST['name'])) {
	$errors['name'] = "You need to provide a name.";
}

if(empty($_POST['email'])) {
	$errors['email'] = "You need to provide an email address.";
}

if(empty($_POST['message'])) {
	$errors['message'] = "You need to provide a message.";
}

if(empty($errors)) {
	$data['success'] = true;
	$data['message'] = "Hooray!";

	$customerEmail = $_POST['email'];
	$customerName = $_POST['name'];
	$customerMsg = nl2br($_POST['message']);
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$customerHeaders = $headers . 'From: ' . BSCENES_EMAIL . "\r\n" .
    'Reply-To: ' . BSCENES_EMAIL . "\r\n" .
    'bcc:' . MY_EMAIL . "\r\n";
	$bscenesHeaders = $headers . 'From: ' . $customerEmail . "\r\n" .
    'Reply-To: ' . $customerEmail . "\r\n" .
    'bcc:' . MY_EMAIL . "\r\n";
    $thankyouMsg = "<p>Thank you for for enquiry.</p><p>We will be in touch shortly</p><p>Battlescene Designs</p>";
	//mail(to,subject,message,headers,parameters)
	$customerEmailSuccess = mail(BSCENES_EMAIL, "New customer enquiry", $customerMsg . "<p>" . $customerName . "</p>", $bscenesHeaders);
	$thankyouEmailSuccess = mail($customerEmail, BSCENES_THANKS_SUBJECT, $thankyouMsg, $customerHeaders);
	//mail($customerEmail, BSCENES_THANKS_SUBJECT, )

	$data['success'] == $customerEmailSuccess && $thankyouEmailSuccess;
	if(!$data['success']) {
		//send an email to battlescenes to check the online interface...
		//
	}
} else {
	$data['success'] = false;
	$data['errors'] = $errors;
}

echo json_encode($data);
?>
