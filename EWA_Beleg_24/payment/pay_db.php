<?php
// Aktuelle URL und Domain abrufen
$request_uri = $_SERVER['REQUEST_URI'];
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://';
$domain = $protocol . $_SERVER['HTTP_HOST'];

$linkDom = $domain . $request_uri;

// Datenbankverbindung einbinden
include 'assets/db/conn.php';

// Nutzer-ID aus POST-Request abrufen
$idCookie = $_POST['uid'] ?? null;

if (!$idCookie) {
    die('<h1>Fehler!</h1><p>Keine Nutzer-ID gefunden.</p>');
}

// Warenkorb-Daten für den Nutzer abrufen
$data = array(":Token" => $idCookie);

$query = "SELECT 
            k.ProduktID,
            g.Produkttitel,
            g.PreisBrutto,
            g.Lagerbestand,
            k.Menge,
            g.BildURL
          FROM korb k 
          JOIN gift_shop g ON k.ProduktID = g.ProduktID
          WHERE k.NutzerID = :Token AND k.Menge > 0";

$statement = $connect->prepare($query);
$res = $statement->execute($data);

if ($res) {
    $books = array(); // Array für Stripe-Produkte
    $rowCount = $statement->rowCount();

    if ($rowCount > 0) {
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
            $item = array(
                'name' => $row['Produkttitel'], // Produktname
                'description' => 'Lagerbestand: ' . $row['Lagerbestand'], // Beschreibung (optional)
                'images' => [$linkDom . '/assets/img/' . $row['BildURL']], // Bild-URL
                'amount' => $row['PreisBrutto'] * 100, // Preis in Cent
                'currency' => 'eur', // Währung
                'quantity' => $row['Menge'] // Anzahl im Warenkorb
            );
            $books[] = $item;
        }
    } else {
        die('<h1>Fehler!</h1><p>Ihr Warenkorb ist leer.</p>');
    }
} else {
    die('<h1>Fehler!</h1><p>Datenbankabfrage fehlgeschlagen.</p>');
}
?>
