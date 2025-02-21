<?php
// Session ID und Nutzer ID aus GET-Parametern abrufen
$session = $_GET['session_id'] ?? null;
$idCookie = $_GET['uID'] ?? null;

if (!$session || !$idCookie) {
    die('<h1>Fehler!</h1><p>Session ID oder Nutzer ID fehlt!</p>');
}

// Datenbankverbindung einbinden
include __DIR__ . '/../assets/db/conn.php';

try {
    // Rechnung anhand der Session ID und Nutzer ID abrufen
    $data = array(":NutzerID" => $idCookie, ":PaySession" => $session);
    $query = "SELECT RechnungID FROM rechnung WHERE NutzerID = :NutzerID AND PaySession = :PaySession";
    $statement = $connect->prepare($query);
    $statement->execute($data);
    $res = $statement->fetch(PDO::FETCH_ASSOC);

    if ($res) {
        $rID = $res['RechnungID'];

        // Transaktion starten
        $connect->beginTransaction();

        // Bestellung einfügen
        $data = array(":NutzerID" => $idCookie, ":rID" => $rID);
        $query = "INSERT INTO bestellung (RechnungID, ProduktID, Mwstsatz, PreisBrutto, Menge)
                  SELECT :rID, g.ProduktID, g.Mwstsatz, g.PreisBrutto, k.Menge
                  FROM gift_shop g
                  JOIN korb k ON g.ProduktID = k.ProduktID
                  WHERE k.NutzerID = :NutzerID AND k.Menge > 0";
        $statement1 = $connect->prepare($query);
        $statement1->execute($data);

        // Überprüfen, ob Bestellungen hinzugefügt wurden
        if ($statement1->rowCount() > 0) {
            // Warenkorb löschen
            $query = "DELETE FROM korb WHERE NutzerID = :NutzerID";
            $statement2 = $connect->prepare($query);
            $statement2->execute(array(":NutzerID" => $idCookie));

            // Lagerbestand aktualisieren
            $query = "UPDATE gift_shop g
                      JOIN bestellung b ON g.ProduktID = b.ProduktID
                      SET g.Lagerbestand = g.Lagerbestand - b.Menge
                      WHERE b.RechnungID = :RechnungID";
            $statement3 = $connect->prepare($query);
            $statement3->execute(array(":RechnungID" => $rID));

            // Transaktion abschließen
            $connect->commit();

            $bodyres = '<h1>Erfolg!</h1><p>Ihre Bestellung wurde erfolgreich verarbeitet.</p><p>Bestell-ID: ' . $rID . '</p>';
        } else {
            // Rollback bei Fehler
            $connect->rollBack();
            $bodyres = '<h1>Fehler!</h1><p>Es gab ein Problem beim Hinzufügen der Bestellung.</p>';
        }
    } else {
        $bodyres = '<h1>Fehler!</h1><p>Rechnung konnte nicht gefunden werden.</p>';
    }
} catch (PDOException $e) {
    // Rollback bei Datenbankfehlern
    $connect->rollBack();
    $bodyres = '<h1>Datenbankfehler!</h1><p>' . $e->getMessage() . '</p>';
} catch (Exception $e) {
    $bodyres = '<h1>Allgemeiner Fehler!</h1><p>' . $e->getMessage() . '</p>';
}

// HTML-Ausgabe
$body = '
<div class="container mt-3">
    <div>
        ' . $bodyres . '
    </div>
    <div class="d-flex justify-content-center">
        <button class="btn btn-primary w-50 mt-3 mb-4" onclick="reloadWithoutGetParams()">Zurück</button>
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
