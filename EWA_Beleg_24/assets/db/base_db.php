<?php 
    include 'conn.php';

    if($request_data->action=="ckadmin"){
        
        $data = array(":token" => $request_data->token);
        $query = "SELECT Nutzername FROM nutzer WHERE NutzerID = :token AND Rolle = 1";
        $statement = $connect->prepare($query);
        $res = $statement->execute($data);
        
        $res = $statement->fetch(PDO::FETCH_ASSOC);
    
        if ($res > 0) {
            $output=array("tokenisauth"=>true);
        }else{
            $output=array("tokenisauth"=>false);
        }
        echo json_encode($output);
        exit;
    }

    if($request_data->action=="getKorb"){

        $dataIn=array(":NutzerID"=>$request_data->NutzerID);
        $query= "SELECT k.*, g.Produktcode, g.Produkttitel,
        g.PreisBrutto, g.BildURL
                  FROM korb k
                  JOIN gift_shop g ON k.ProduktID = g.ProduktID
                  WHERE k.NutzerID = :NutzerID AND k.Menge > 0";
        $statement=$connect->prepare($query);
        $res = $statement->execute($dataIn);
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                while($row=$statement->fetch(PDO::FETCH_ASSOC)){
                    $data[]=$row;
                }
                echo json_encode($data);
            } else {
                $message = FALSE;
                $output=array("messageKorb"=>$message);
                echo json_encode($output);
            }
        } else {
            $message = FALSE;
            $output=array("messageKorb"=>$message);
            echo json_encode($output);
        }
    }
    if($request_data->action=="getRechnung"){
        
        $dataIn=array(":NutzerID"=>$request_data->NutzerID);
        $query= "SELECT SUM(g.PreisBrutto * b.Menge) AS totalPreis, r.*
                  FROM rechnung r
                  JOIN bestellung b ON r.RechnungID = b.RechnungID
                  JOIN gift_shop g ON b.ProduktID = g.ProduktID
                  WHERE r.NutzerID = :NutzerID
                  GROUP BY r.RechnungID";
        $statement=$connect->prepare($query);
        $res = $statement->execute($dataIn);
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                while($row=$statement->fetch(PDO::FETCH_ASSOC)){
                    $data[]=$row;
                }
                echo json_encode($data);
            } else {
                $message = FALSE;
                $output=array("messageRechnung"=>$message);
                echo json_encode($output);
            }
        } else {
            $message = FALSE;
            $output=array("messageRechnung"=>$message);
            echo json_encode($output);
        }
    }
    if($request_data->action=="getBestellung"){

        $dataIn=array(":NutzerID"=>$request_data->NutzerID, ":rID"=>$request_data->RechnungID);
        
        $query= "SELECT r.*, b.*, g.Produktcode, g.Produkttitel, g.BildURL
                  FROM rechnung r
                  JOIN bestellung b ON r.RechnungID = b.RechnungID
                  JOIN gift_shop g ON g.ProduktID = b.ProduktID
                  WHERE r.NutzerID = :NutzerID AND r.RechnungID = :rID";
        $statement=$connect->prepare($query);
        $res = $statement->execute($dataIn);
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                while($row=$statement->fetch(PDO::FETCH_ASSOC)){
                    $data[]=$row;
                }
                echo json_encode($data);
            } else {
                $message = FALSE;
                $output=array("messageBestellung"=>$message);
                echo json_encode($output);
            }
        } else {
            $message = FALSE;
            $output=array("messageBestellung"=>$message);
            echo json_encode($output);
        }
    }

    function generateToken($payload) {
        $YOUR_SECRET_KEY="MYYBOOKSTORE123234221";
        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = base64_encode(json_encode($payload));
        $signature = base64_encode(hash_hmac('sha256', "$header.$payload", '$YOUR_SECRET_KEY', true));
        return "$header.$payload.$signature";
    }

    function generateRandomString() {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
    
        for ($i = 0; $i < 11; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
    
        return $randomString;
    }

    if($request_data->action=="getIdOU"){
        $code = generateRandomString();

        $token = generateToken(['code' => $code]);
        
        $data=array(":Token"=>$token);

        $query= "INSERT INTO nutzer (NutzerID,Rolle) VALUES (:Token, NULL)";
        $statement1=$connect->prepare($query);
        $res1 = $statement1->execute($data);
        
        if ($res1) {
            //$lastInsertedId = $connect->lastInsertId();
            $output=array("messageIdOU"=>$token);
            echo json_encode($output);
        } else {
            $message = FALSE;
            $output=array("messageIdOU"=>$message);
            echo json_encode($output);
            exit;
        }
    }

    if($request_data->action=="signup"){
        $username = $request_data->Nutzername;
        $passwort = password_hash($request_data->Passwort, PASSWORD_DEFAULT);

        $token = generateToken(['username' => $username, 'passwort' => $passwort]);
        
        $data=array(":Token"=>$token , ":Nutzername"=>$username , ":Passwort"=>$passwort);

        try{
            $query= "INSERT INTO nutzer (NutzerID,Nutzername,Passwort) VALUES(:Token,:Nutzername,:Passwort)";
            $statement=$connect->prepare($query);
            $res = $statement->execute($data);

            if ($res) {
                //$lastInsertedId = $connect->lastInsertId();
                $message = "Registrierung erfolgreich. Hallo $username";
                $msgError = false;

                /* if(isset($_COOKIE['OUserID'])){
                    $idCookieKorb = $_COOKIE['OUserID'];
                    $data=array(":NutzerID1"=>$idCookieKorb, ":NutzerID2"=>$lastInsertedId);
                    $query= "UPDATE korb SET NutzerID = :NutzerID2 WHERE NutzerID = :NutzerID1";
                    $statement=$connect->prepare($query);
                    $statement->execute($data);
                } */

                $output=array("msgSignUp"=>$message, "errorSignUp"=>$msgError, "userID"=>$token);
            } else {
                $message = 'Fehler beim Einfügen der Daten';
                $msgError = true;
                $output=array("msgSignUp"=>$message, "errorSignUp"=>$msgError);
            }
        } catch (PDOException $e) {
            $message = 'Benutzername bereits vergeben';
            $msgError = true;
            $output=array("msgSignUp"=>$message, "errorSignUp"=>$msgError);
        }
        echo json_encode($output);
    }
    if ($request_data->action == "login") {
        $inPass = $request_data->Passwort;

        $data = array(":Nutzername" => $request_data->Nutzername);
        $query = "SELECT NutzerID, Nutzername, Rolle, Passwort FROM nutzer WHERE Nutzername = :Nutzername";
        $statement = $connect->prepare($query);
        $res = $statement->execute($data);
        
        $res = $statement->fetch(PDO::FETCH_ASSOC);
    
        if ($res > 0) {
            $dbPass = $res['Passwort'];
            if (password_verify($inPass, $dbPass)) {
                $idUser = $res['NutzerID'];
                $nameUser = $res['Nutzername'];
                $roleUser = $res['Rolle'];

                if($roleUser == 1){
                    $roleUser = true;
                }else{
                    $roleUser = false;
                }
                
                /* if(isset($_COOKIE['OUserID'])){
                    $idCookieKorb = $_COOKIE['OUserID'];
                    $data=array(":NutzerID1"=>$idCookieKorb, ":NutzerID2"=>$idUser);
                    $query= "UPDATE korb SET NutzerID = :NutzerID2 WHERE NutzerID = :NutzerID1";
                    $statement=$connect->prepare($query);
                    $statement->execute($data);
                } */
                
                $message = "Anmeldung erfolgreich. Hallo $nameUser";
                $msgError = false;
                $output=array("msgLogIn"=>$message, "errorLogIn"=>$msgError, "userID"=>$idUser, "userRolle"=>$roleUser);
            }else{
                $message = 'Passwort ist falsch';
                $msgError = true;
                $output=array("msgLogIn"=>$message, "errorLogIn"=>$msgError);
            }
        } else {
            $message = 'Benutzername ist falsch';
            $msgError = true;
            $output=array("msgLogIn"=>$message, "errorLogIn"=>$msgError);
        }
        echo json_encode($output);
    }
    if($request_data->action=="getSearch"){
        $data = array(":Produkttitel" => '%' . $request_data->Produkttitel . '%');
        $query= "SELECT * FROM buecher WHERE Produkttitel LIKE :Produkttitel";
        $statement=$connect->prepare($query);
        $res = $statement->execute($data);
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                while($row=$statement->fetch(PDO::FETCH_ASSOC)){
                    $resData[]=$row;
                }
                echo json_encode($resData);
            } else {
                $message = FALSE;
                $output=array("messageSearch"=>$message);
                echo json_encode($output);
            }
        } else {
            $message = FALSE;
            $output=array("messageSearch"=>$message);
            echo json_encode($output);
        }
    }

    if($request_data->action=="changeKorb"){

        $data=array(":NutzerID"=>$request_data->NutzerID, ":ProduktID"=>$request_data->ProduktID , ":Menge"=>$request_data->Menge);
        
        $query= "UPDATE korb SET Menge = :Menge + Menge where NutzerID = :NutzerID AND ProduktID = :ProduktID";
        $statement=$connect->prepare($query);
        $res = $statement->execute($data);

        $message = "Artikelmenge erfolgreich geändert";
        $output = array("msgChangeKorb" => $message);
        echo json_encode($output);
    }
?>