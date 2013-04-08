<?php
	
	session_start();
	
	if(isset($_SESSION['user'])) {
		print true;
	}else {
		print false;
	}

?>