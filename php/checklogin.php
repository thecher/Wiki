<?php
	
	session_start();
	
	if(isset($_SESSION['un'])) {
		print true;
	}else {
		print false;
	}

?>