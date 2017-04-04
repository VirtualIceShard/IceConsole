<?php
$cplist = file_get_contents ( "cplist.xml" );
header ( "Cache-Control: no-cache" );
header ( "Pragma: no-cache" );
header ( "Access-Control-Allow-Origin: *" );
header ( "Content-type: text/xml" );
echo $cplist;
?>