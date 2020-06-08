<?php

if (!isset($error)) {
	$error = new stdClass();
}

include "dbinfo.info.php";

try {
$pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password, [PDO:: ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
} catch (PDOException $e) {
	$error->code = "error";
	$error->message = "There was a problem connecting to the database";
	echo json_encode($error);
	$pdo = null;
	return;
}

$table = $_GET["tableName"];

$stmt = $pdo->prepare("SELECT * FROM {$table}");
$result = $stmt->execute();

if ($stmt->rowCount() > 0)
  {
	  $tableData = array();
	  $tableData[] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	  echo json_encode($tableData);
	}
	else
	{
	  $error->code = "error";
	  $error->message = "The table: ".$table." contains no rows.";
	  echo json_encode($error);
	}

	$stmt = null;
	$pdo = null;
?>
