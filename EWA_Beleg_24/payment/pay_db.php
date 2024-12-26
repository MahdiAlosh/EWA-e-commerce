<?php
    $request_uri = $_SERVER['REQUEST_URI'];
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://';
    $domain = $protocol . $_SERVER['HTTP_HOST'];
    //$directory = dirname($request_uri);

    $linkDom = $domain . $request_uri;

    include 'assets/db/conn.php';

    $idCookie = $_POST['uid'];

    $data=array(":Token"=>$idCookie);
    
    $query= "SELECT * FROM korb k JOIN buecher b ON k.ProduktID = b.ProduktID WHERE NutzerID = :Token AND Menge > 0";
    $statement=$connect->prepare($query);
    $res = $statement->execute($data);
    if ($res > 0) {
        $books = array();
        $rowCount = $statement->rowCount();
        if ($rowCount > 0) {
            while($row=$statement->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    'name' => $row['Produkttitel'],
                    'description' => $row['Kurzinhalt'],
                    'images' => [$linkDom . 'assets/img/' . $row['LinkGrafikdatei']],
                    'amount' => $row['PreisBrutto'] * 100,
                    'currency' => 'eur',
                    'quantity' => $row['Menge']
                );
                $books[] = $item;
            }
        } else {
            exit;
        }
    } else {
        exit;
    }
?>