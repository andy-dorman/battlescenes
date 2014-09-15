<?php
//define("BSCENES_EMAIL", "battlescenedesigns@hotmail.co.uk");
define("BSCENES_EMAIL", "andydrman@yahoo.co.uk");
define("MY_EMAIL", "battlescenedesigns@hotmail.co.uk");
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
	$customerMsg = $_POST['message'];
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$customerHeaders = $headers . 'From: ' . BSCENES_EMAIL . "\r\n" .
    'Reply-To: ' . $customerEmail . "\r\n" .
    'cc:' . MY_EMAIL . "\r\n";
	$bscenesHeaders = $headers . 'From: ' . $customerEmail . "\r\n" .
    'Reply-To: ' . BSCENES_EMAIL . "\r\n" .
    'cc:' . MY_EMAIL . "\r\n";
    $thankyouMsg = "<p>Thank you for for enquiry.</p><p>We will be in touch shortly</p>";
	//mail(to,subject,message,headers,parameters)
	$customerEmailSuccess = mail(BSCENES_EMAIL, "New customer enquiry", $customerMsg, $bscenesHeaders);
	$thankyouEmailSuccess = mail($customerEmail, BSCENES_THANKS_SUBJECT, $thankyouMsg, $bscenesHeaders);
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