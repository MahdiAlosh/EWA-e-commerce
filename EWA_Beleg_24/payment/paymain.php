<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        $email = $_POST['email'];
        $co = $_POST['co'];
        $adresse = $_POST['adresse'];
        $zip = $_POST['zip'];
        $ort = $_POST['ort'];

        require('payment/api/init.php');
        
        include 'payment/pay_db.php';

        \Stripe\Stripe::setApiKey('sk_test_cFnCai0Ye9NM8Tn9CMo6k0fn00P0R9pt9u');

        $public_key_for_js="pk_test_aLcPqdtG2FDzxPWu5N9OBNOs00Yt0nKnhS";

        try {
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [$books],
                'success_url' => $linkDom . '?res=1&uID='. urlencode($idCookie) .'&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url'  => $linkDom . '?res=0&uID='. urlencode($idCookie) .'&session_id={CHECKOUT_SESSION_ID}',
            ]);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            echo "Error in Session::create()" . $e;
        }

        $seID = $session['id'];

        $data=array(":NutzerID"=>$idCookie , ":Email"=>$email, ":Co"=>$co, ":Adresse"=>$adresse, ":Zip"=>$zip, ":Ort"=>$ort, ":PaySession"=>$seID);

        $query= "INSERT INTO rechnung (NutzerID, Zeit, Email, Co, Adresse, Zip, Ort, PaySession) VALUES (:NutzerID, CURRENT_TIMESTAMP, :Email, :Co, :Adresse, :Zip, :Ort, :PaySession)";
        $statement1=$connect->prepare($query);
        $res1 = $statement1->execute($data);
        
        if ($res1) {
            $lastInsertedId = $connect->lastInsertId();
        } else {
            exit;
        }

        $body = <<<HTML
        <script src="https://js.stripe.com/v3/"></script><div class="container mt-3"><h1>Bookstore</h1><span>Sie werden zum Stripe-Checkout weitergeleitet....</span></div>
        HTML;
        $body .= "
            <script>
                var stripe = Stripe('". $public_key_for_js ."');
                stripe.redirectToCheckout({
                    sessionId: '". $session['id'] ."'
                }).then(function (result) {
                });
            </script>
        ";
    }else{
        $body = '<div class="container mt-3"><h1>Link Error!</h1></div>';
    }
?>