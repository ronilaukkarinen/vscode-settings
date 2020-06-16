<?php

// Replace this with your own email address
$siteOwnersEmail = 'contact@pesospay.com';
$error = [];

if($_POST) {

   $name = trim(stripslashes($_POST['contactName']));
   $email = trim(stripslashes($_POST['contactEmail']));
   $subject = trim(stripslashes($_POST['contactSubject']));
   $contact_message = trim(stripslashes($_POST['contactMessage']));

   // Check Name
	if (strlen($name) < 2) {
		$error['name'] = "Please enter your name.";
	}
	// Check Email
	if (!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is', $email)) {
		$error['email'] = "Please enter a valid email address.";
	}
	// Check Message
	if (strlen($contact_message) < 15) {
		$error['message'] = "Please enter your message. It should have at least 15 characters.";
	}
   // Subject
	if ($subject == '') { $subject = "Contact Form Submission"; }


	// Set Message
	$message = "Email from: " . $name . "<br />";
	$message .= "Email address: " . $email . "<br />";
	$message .= "Message: <br />";
	$message .= $contact_message;
	$message .= "<br /> ----- <br /> This email was sent from your site's contact form. <br />";

	// Set From: header
	$from =  $name . " <" . $email . ">";

	// Email Headers
	$headers = "From: " . $from . "\r\n";
	$headers .= "Reply-To: ". $email . "\r\n";
 	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";


	if (!$error) {

		ini_set("sendmail_from", $siteOwnersEmail); // for windows server
		$mail = mail($siteOwnersEmail, $subject, $message, $headers);

		if ($mail) { echo "OK"; }
      else { echo "Something went wrong. Please try again."; }
		
	} # end if - no validation error

	else {

		$response = (isset($error['name'])) ? $error['name'] . "<br /> \n" : null;
		$response .= (isset($error['email'])) ? $error['email'] . "<br /> \n" : null;
		$response .= (isset($error['message'])) ? $error['message'] . "<br />" : null;
		
		echo $response;

	} # end if - there was a validation error

}

?>

<?php

$to = "register@pesoshub.com";
$emailRegex = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i";

if (!empty($_POST)) {
  $fullName     = trim($_POST["fullName"]);
  $email        = trim($_POST["email"]);
  $phone        = trim($_POST["phone"]);
  $bankName     = trim($_POST["bankName"]);
  $accountName  = trim($_POST["accountName"]);
  $accountNo    = trim($_POST["accountNo"]);
  $plan         = $_POST["plan"];

  $subject = "New Registeration: ".$fullName;

  $errors = "";

  if(!$fullName)
    $errors .= "Full Name required!";

  if(!$email)
    $errors .= "Email required!";

  if($email && !preg_match($emailRegex, $email))
    $errors .= "Email address is not valid!";

  if(!$phone)
    $errors .= "Phone number required!";

  if(!$bankName)
    $errors .= "Account number required!";

  if(!$accountName)
    $errors .= "Account name required!";
  
  if(!$accountNo)
    $errors .= "Account number required!";

  if(!$errors) {
    // Email body
    $body = ""
        ."<b>Name:</b> ".$fullName."<br>"
        ."<b>Email:</b> ".$email."<br>"
        ."<b>Phone:</b> ".$phone."<br>"
        ."<b>Investment Plan:</b> ".$plan."<br>"
        ."<b>Bank Name:</b> ".$bankName."<br>"
        ."<b>Account Name:</b> ".$accountName."<br>"
        ."<b>Account Number:</b> ".$accountNo;

    $header = "From: ".$fullName." <".$email.">\r\n"
      ."Reply-To: ".$email."\r\n"
      ."MIME-Version: 1.0\r\n"
      ."Content-type: text/html; charset=UTF-8\r\n";

    if(mail($to, $subject, $body, $header))
      echo "OK";
    else
      echo "Could not send email, try again!";
    
  }
  else
    echo $errors;
}

?>
