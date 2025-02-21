<?php
include 'conn.php';

function adminAuth($token)
{
    global $connect;
    $data = array(":token" => $token);
    $query = "SELECT Nutzername FROM nutzer WHERE NutzerID = :token AND Rolle = 1";
    $statement = $connect->prepare($query);
    $res = $statement->execute($data);

    $res = $statement->fetch(PDO::FETCH_ASSOC);

    if (!($res > 0)) {
        $output = array("errauth" => false, "message" => "Sie haben keine Autorisierung");
        echo json_encode($output);
        exit;
    }
}

if ($request_data->action == "getBestellung") {

    adminAuth($request_data->token);

    $dataIn = array(":rID" => $request_data->RechnungID);

    $query = "SELECT r.*, b.*, gs.Produktcode, gs.Produkttitel, gs.PreisBrutto 
                  FROM rechnung r 
                  JOIN bestellung b ON r.RechnungID = b.RechnungID 
                  JOIN gift_shop gs ON gs.ProduktID = b.ProduktID 
                  WHERE r.RechnungID = :rID";
    $statement = $connect->prepare($query);
    $res = $statement->execute($dataIn);
    if ($res > 0) {
        $rowCount = $statement->rowCount();
        if ($rowCount > 0) {
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            $message = FALSE;
            $output = array("messageBestellung" => $message);
            echo json_encode($output);
        }
    } else {
        $message = FALSE;
        $output = array("messageBestellung" => $message);
        echo json_encode($output);
    }
}

if ($request_data->action == "getRechnung") {

    adminAuth($request_data->token);

    $query = "SELECT SUM(gs.PreisBrutto * b.Menge) AS totalPreis, r.* 
                  FROM rechnung r 
                  JOIN bestellung b ON r.RechnungID = b.RechnungID 
                  JOIN gift_shop gs ON gs.ProduktID = b.ProduktID 
                  GROUP BY b.RechnungID";
    $statement = $connect->prepare($query);
    $res = $statement->execute();
    if ($res > 0) {
        $rowCount = $statement->rowCount();
        if ($rowCount > 0) {
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            $message = FALSE;
            $output = array("messageRechnung" => $message);
            echo json_encode($output);
        }
    } else {
        $message = FALSE;
        $output = array("messageRechnung" => $message);
        echo json_encode($output);
    }
}

if ($request_data->action == "insert") {

    adminAuth($request_data->token);

    $data = array(
        ":Produktcode" => $request_data->Produktcode,
        ":Produkttitel" => $request_data->Produkttitel,
        ":PreisBrutto" => $request_data->PreisBrutto,
        ":Mwstsatz" => $request_data->Mwstsatz,
        ":Lagerbestand" => $request_data->Lagerbestand,
        ":BewertungStars" => $request_data->BewertungStars,
        ":BewertungCount" => $request_data->BewertungCount,
        ":BildURL" => $request_data->BildURL
    );
    $query = "INSERT INTO gift_shop (
                Produktcode, 
                Produkttitel, 
                PreisBrutto, 
                Mwstsatz, 
                Lagerbestand, 
                BewertungStars, 
                BewertungCount, 
                BildURL
            )
            VALUES (
                :Produktcode, 
                :Produkttitel, 
                :PreisBrutto, 
                :Mwstsatz, 
                :Lagerbestand, 
                :BewertungStars, 
                :BewertungCount, 
                :BildURL
            )";
    $statement = $connect->prepare($query);
    $statement->execute($data);
    $output = array("message" => "Insert Complete");
    echo json_encode($output);
}
if ($request_data->action == "getArtikel") {
    adminAuth($request_data->token);
    $query = "SELECT * FROM gift_shop";
    $statement = $connect->prepare($query);
    $statement->execute();
    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }
    echo json_encode($data);
}
if ($request_data->action == "getEditArtikel") {
    adminAuth($request_data->token);
    $query = "SELECT * FROM gift_shop WHERE ProduktID = $request_data->ProduktID";
    $statement = $connect->prepare($query);
    $statement->execute();
    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        $data['ProduktID'] = $row['ProduktID'];
        $data['Produktcode'] = $row['Produktcode'];
        $data['Produkttitel'] = $row['Produkttitel'];
        $data['PreisBrutto'] = $row['PreisBrutto'];
        $data['Mwstsatz'] = $row['Mwstsatz'];
        $data['Lagerbestand'] = $row['Lagerbestand'];
        $data['BewertungStars'] = $row['BewertungStars'];
        $data['BewertungCount'] = $row['BewertungCount'];
        $data['BildURL'] = $row['BildURL'];
    }
    echo json_encode($data);
}

if ($request_data->action == "update") {
    adminAuth($request_data->token);
    $data = array(
        ":ProduktID" => $request_data->ProduktID,
        ":Produktcode" => $request_data->Produktcode,
        ":Produkttitel" => $request_data->Produkttitel,
        ":PreisBrutto" => $request_data->PreisBrutto,
        ":Mwstsatz" => $request_data->Mwstsatz,
        ":Lagerbestand" => $request_data->Lagerbestand,
        ":BewertungStars" => $request_data->BewertungStars,
        ":BewertungCount" => $request_data->BewertungCount,
        ":BildURL" => $request_data->BildURL
    );
    $query = "UPDATE gift_shop SET 
            Produktcode = :Produktcode, 
            Produkttitel = :Produkttitel, 
            PreisBrutto = :PreisBrutto, 
            Mwstsatz = :Mwstsatz, 
            Lagerbestand = :Lagerbestand, 
            BewertungStars = :BewertungStars, 
            BewertungCount = :BewertungCount, 
            BildURL = :BildURL
        WHERE ProduktID = :ProduktID";
    $statement = $connect->prepare($query);
    $statement->execute($data);
    $output = array("message" => "Update Complete");
    echo json_encode($output);
}

if ($request_data->action == "deleteArtikel") {
    adminAuth($request_data->token);
    $query = "DELETE FROM gift_shop WHERE ProduktID = $request_data->ProduktID";
    $statement = $connect->prepare($query);
    $statement->execute();
    
    /* um SQL-Injection zu vermeiden
    $query = "DELETE FROM gift_shop WHERE ProduktID = :ProduktID";
    $statement = $connect->prepare($query);
    $statement->execute(array(':ProduktID' => $request_data->ProduktID));
    */

    $output = array("message" => "Delete Complete");
    echo json_encode($output);
}
