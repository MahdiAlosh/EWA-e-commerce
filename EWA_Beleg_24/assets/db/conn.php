<?php
    //if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            /* $dbname = 'g05';
            $user = 'g05';
            $password = 'ma47cpp'; */
            $dbname = 'gift_shop';
            $user = 'root';
            $password = '';

            $connect = new PDO("mysql:host=localhost;dbname=$dbname", $user, $password);
<<<<<<< HEAD
            // $connect = new mysqli("ivm108.informatik.htw-dresden.de", "g05", $passwort, "g05");
=======
            $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
>>>>>>> 812a9f3 (refactor database connection)
            $request_data=json_decode(file_get_contents("php://input"));
        } catch (PDOException $e) {
            http_response_code(500);
            die("Verbindung Error: " . $e->getMessage());
        }
    /* }else{
        echo 'Error!';
        exit;
    } */
?>