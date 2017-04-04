<?php
$xmlfile = file_get_contents ( 'php://input' );
$xml = new SimpleXMLElement ( $xmlfile );
$xml->asXML ( "cplist.xml" );
echo "Command-package list saved";
?>