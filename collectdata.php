<?php
// create a random participant id 
$participant_id = strval(mt_rand(100000, 888888));
$debug_export = var_export($_POST, true);

// lookup the list of participant ids that have already been generated
$file_handle = fopen('results/participant_codes.txt', 'r');
$existing_participants = fread($file_handle, filesize('results/participant_codes.txt'));
fclose($file_handle);
$existing_participants = explode(",", $existing_participants);

// update name of the participant id until it doesn't match anything in the list
// (i.e. ensure uniqueness)
while(in_array($participant_id,$existing_participants)){
	$participant_id = strval(mt_rand(100000, 888888));
}

// print_r($existing_participants);
// print_r(in_array("844626", $existing_participants));

// write participant results file
$file_handle = fopen('results/'.$participant_id.'.txt', 'w');
fwrite($file_handle, $debug_export);
fclose($file_handle);

// write participant id to list of existing ids 
$file_handle = fopen('results/participant_codes.txt', 'a');
fwrite($file_handle, $participant_id.',');
fclose($file_handle);

echo("<b>Thanks for participating!</b> Your participation code is ".$participant_id.".<p>You may now close the screen.")

// header( 'Location: http://stanford.edu/~bwaldon/cgi-bin/lingexp/partcode.php' );   
?>
