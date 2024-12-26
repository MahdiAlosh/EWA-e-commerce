<?php
    $session = $_GET['session_id'];
    $idCookie = $_GET['uID'];
    include 'assets/db/conn.php';

    $data = array(":NutzerID" => $idCookie, ":PaySession" => $session);
    $query = "SELECT RechnungID FROM rechnung WHERE NutzerID = :NutzerID AND PaySession = :PaySession"; 

    $statement = $connect->prepare($query);
    $res = $statement->execute($data);
    
    $res = $statement->fetch(PDO::FETCH_ASSOC);

    if ($res > 0) {
        $rID = $res['RechnungID'];

        try{
            $connect->beginTransaction();
            $data = array(":NutzerID" => $idCookie, ":rID" => $rID);
            $query= "INSERT INTO bestellung (RechnungID, ProduktID, Mwstsatz, PreisBrutto, Menge)
                        SELECT :rID, b.ProduktID, b.Mwstsatz, b.PreisBrutto, k.Menge
                        FROM buecher b
                        JOIN korb k
                        ON b.ProduktID = k.ProduktID
                        WHERE k.NutzerID = :NutzerID AND Menge > 0
                    ";
            $statement1=$connect->prepare($query);
            $res1 = $statement1->execute($data);
            
            if ($res1) {
                //delete korb
                $rowCount = $statement1->rowCount();
                if ($rowCount > 0) {
                    $data=array(":Token"=>$idCookie);
                    $query= "DELETE FROM korb WHERE NutzerID = :Token";
                    $statement2=$connect->prepare($query);
                    $res2 = $statement2->execute($data);
                    if($res2){

                        $data=array(":RechnungID"=>$rID);
                        $query= "UPDATE buecher bu JOIN bestellung be ON bu.ProduktID = be.ProduktID SET Lagerbestand = Lagerbestand - Menge WHERE RechnungID = :RechnungID";
                        $statement3=$connect->prepare($query);
                        $res3 = $statement3->execute($data);
                        if($res2){
                            $connect->commit();
                            $bodyres='<h1>Success</h1><span>Success ORDER ID: '. $rID .'</span>';
                        }else{
                            $connect->rollBack();
                            $bodyres='<h1>Error!</h1><span>Lagerbestand Error!</span>';
                        }
                    }else{
                        $connect->rollBack();
                        $bodyres='<h1>Error!</h1><span>Warenkorb Error!</span>';
                    }
                }else{
                    $connect->rollBack();
                    $bodyres='<h1>Abgelaufener Link</h1><span>Dieser Link ist abgelaufen. Das heißt, dass die Zahlung bereits verarbeitet wurde oder die Sitzung abgelaufen ist.</span>';
                }
            } else {
                $connect->rollBack();
                $bodyres='<h1>Unsuccess</h1><span>Unsuccess3 '. $session .'</span>';
            }
        } catch (PDOException $e) {
            $connect->rollBack();
            $bodyres='<h1>Unsuccess</h1><span>Unsuccess2 '. $session .'</span>';
        }
    }else{
        $bodyres='<h1>Unsuccess</h1><span>Unsuccess1: '. $session .'</span><br><span>idCookie: '. $idCookie .'</span>';   
    }
    $body= '
    <div class="container mt-3">
        <div>
            '. $bodyres .'
        </div>
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary w-50 mt-3 mb-4" onclick="reloadWithoutGetParams()">Back</button>
        </div>
    </div>
    
    <script>
        function reloadWithoutGetParams() {
            var urlWithoutParams = window.location.origin + window.location.pathname;
            window.location.href = urlWithoutParams;
        }
    </script>
    ';
?>