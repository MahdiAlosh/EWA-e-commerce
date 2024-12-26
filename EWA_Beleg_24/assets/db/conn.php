<?php
    //if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $dbname = 'gift_shop';
            $user = 'root';
            $password = '';

            $connect = new PDO("mysql:host=localhost;dbname=$dbname", $user, $password);
            $request_data=json_decode(file_get_contents("php://input"));
        } catch (PDOException $e) {
            echo "Verbindung Error: " . $e->getMessage();
        }
    /* }else{
        echo 'Error!';
        exit;
    } */
?>