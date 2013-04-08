<?php

session_start();
if(isset($_POST['un']) && isset($_POST['pw'])){
	$un = $_POST['un'];
	$pw = $_POST['pw'];


	if($un == "dummyUser" && $pw == "password"){
		$_SESSION['user'] = $un;
		$msg = "logged in";
	}elseif ($un == "anotherDummy" && $pw == "password") {
		$_SESSION['user'] = $un;
		$msg = "logged in";
	}else {
		$msg = "not logged in";
	}

	print $msg;
}

?>