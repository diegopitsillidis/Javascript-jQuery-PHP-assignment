<?php
  $sData = $_GET["sourceData"];
  $filename = $_GET["sourceName"];

  $fullPath = "xml/".$filename.".xml";

  $xml = simplexml_load_file($fullPath);

  $json_array = json_decode($sData, true);

  $element = $xml->addChild($xml->children()->getName());

  foreach($json_array as $key => $value){
    $element->addChild($key, $value);
  }

  $dom = new DOMDocument('1.0');
  $dom->preserveWhiteSpace = false;
  $dom->formatOutput = true;
  $dom->loadXML($xml->asXML());
  $xml = new SimpleXMLElement($dom->saveXML());
  $xml->saveXML("xml/".$filename.".xml");

  echo json_encode($xml);
  return;
 ?>
