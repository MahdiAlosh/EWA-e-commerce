<?php 
    include 'conn.php';

    if($request_data->action=="getItem"){
        $dataArray=array(":ProduktID"=>$request_data->ProduktID);
        $query= "SELECT * FROM gift_shop WHERE ProduktID = :ProduktID";
        $statement=$connect->prepare($query);
        $res = $statement->execute($dataArray);
        
        if($res){
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                $result = $statement->fetch(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }else{
                $message = FALSE;
                $output=array("itemGiftShopMsg"=>$message);
                echo json_encode($output);
            }
        }else{
            $message = FALSE;
            $output=array("itemGiftShopMsg"=>$message);
            echo json_encode($output);
        }
    }
    if($request_data->action=="buyItem"){
        $data=array(":NutzerID"=>$request_data->NutzerID, ":ProduktID"=>$request_data->ProduktID , ":Menge"=>$request_data->Menge);
        
        try {
            $query= "INSERT INTO korb (NutzerID,ProduktID,Menge) VALUES(:NutzerID,:ProduktID,:Menge)";
            $statement2=$connect->prepare($query);
            $res2 = $statement2->execute($data);

            if ($res2) {
                $message = 'Artikel erfolgreich zum Einkaufswagen hinzugefügt!';
            } else {
                $message = 'Fehler beim Einfügen der Daten!';
            }
            $output=array("msgBuyItem"=>$message);
            echo json_encode($output);
        } catch (PDOException $e) {
            $query= "UPDATE korb SET Menge = :Menge + Menge where NutzerID = :NutzerID AND ProduktID = :ProduktID";
            $statement2a=$connect->prepare($query);
            $res2a = $statement2a->execute($data);
            if ($res2a) {
                $rowCount = $statement2a->rowCount();
                if ($rowCount > 0) {
                    $error_message = 'Artikel erfolgreich zum Einkaufswagen hinzugefügt!';
                }else{
                    $error_message = 'Error!, Bitte löschen Sie Ihren Cache und Ihre Websitedaten';
                }
            }
            $output = array("msgBuyItem" => $error_message);
            echo json_encode($output);
        }
    }
?>