<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST['email'];
    $co = $_POST['co'];
    $adresse = $_POST['adresse'];
    $zip = $_POST['zip'];
    $ort = $_POST['ort'];

    require('payment/api/init.php'); // Stripe-Bibliothek einbinden
    include 'payment/pay_db.php'; // Warenkorb-Daten laden

    \Stripe\Stripe::setApiKey('sk_test_51QefC2FTMsLUckIlRU7gp4bj6iq90RppXH7Zctpnaqiphqr2EsDSFcwmcD9UoM1sfYTyuw9TksVyxfbhR6JUE3Th00bT0sCO0C'); // Ihr Secret Key
    $public_key_for_js = "pk_test_51QefC2FTMsLUckIlborOV8IqzOFWjoasQn4qngwbGD0rm9f1uLXoDmztzLFSUtkJbwOfuLqroEQlul8JbGMkev7d00T4R7X1d2";

    try {
        // Stripe-Session erstellen
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => array_map(function ($item) {
                return [
                    'price_data' => [
                        'currency' => 'eur', // Währung
                        'product_data' => [
                            'name' => $item['name'], // Produktname
                            'description' => $item['description'], // Beschreibung
                            'images' => $item['images'], // Bild-URL
                        ],
                        'unit_amount' => $item['amount'], // Preis in Cent
                    ],
                    'quantity' => $item['quantity'], // Anzahl
                ];
            }, $books), // $books aus pay_db.php
            'mode' => 'payment',
            'success_url' => $linkDom . '/payment/paysuccess.php?res=1&uID=' . urlencode($idCookie) . '&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => $linkDom . '/payment/paycancel.php?res=0&uID=' . urlencode($idCookie) . '&session_id={CHECKOUT_SESSION_ID}',
        ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        die("Fehler beim Erstellen der Stripe-Session: " . $e->getMessage());
    }

    // Stripe-Session-ID
    $seID = $session['id'];

    // Rechnung in die Datenbank einfügen
    $data = array(
        ":NutzerID" => $idCookie,
        ":Email" => $email,
        ":Co" => $co,
        ":Adresse" => $adresse,
        ":Zip" => $zip,
        ":Ort" => $ort,
        ":PaySession" => $seID
    );

    $query = "INSERT INTO rechnung (NutzerID, Zeit, Email, Co, Adresse, Plz, Ort, PaySession) 
              VALUES (:NutzerID, CURRENT_TIMESTAMP, :Email, :Co, :Adresse, :Zip, :Ort, :PaySession)";
    $statement1 = $connect->prepare($query);
    $res1 = $statement1->execute($data);

    if ($res1) {
        $lastInsertedId = $connect->lastInsertId();
    } else {
        die("Fehler: Rechnung konnte nicht erstellt werden.");
    }

    // Weiterleitung zum Stripe-Checkout
    $body = <<<HTML
        <script src="https://js.stripe.com/v3/"></script>
        <div class="container mt-3">
            <h1>Shop</h1>
            <span>Sie werden zum Stripe-Checkout weitergeleitet...</span>
        </div>
        <script>
            var stripe = Stripe("{$public_key_for_js}");
            stripe.redirectToCheckout({
                sessionId: "{$session['id']}"
            }).then(function (result) {
                // Fehlerbehandlung, falls nötig
                console.error(result.error.message);
            });
        </script>
    HTML;
} else {
    $body = '<div class="container mt-3"><h1>Fehlerhafter Link!</h1></div>';
}

echo $body;
?>
