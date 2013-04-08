<?php
	
	session_start();
	
	unset ($_SESSION['user']);

	print "logged out";

?>