<?php
// Überprüfen, ob session_id gesetzt ist
$session = $_GET['session_id'] ?? null;

if ($session) {
    $bodyres = '<h1>Zahlung abgebrochen</h1>
                <p>Ihre Zahlung mit der Sitzungs-ID <strong>' . htmlspecialchars($session) . '</strong> wurde abgebrochen.</p>';
} else {
    $bodyres = '<h1>Fehler!</h1><p>Es konnte keine gültige Sitzungs-ID gefunden werden.</p>';
}

// HTML-Ausgabe
$body = '
<div class="container mt-3">
    <div>
        ' . $bodyres . '
    </div>
    <div class="d-flex justify-content-center">
        <a href="/EWA-e-commerce-git/EWA_Beleg_24/" class="btn btn-primary w-50 mt-3 mb-4">Zurück zur Startseite</a>
        <a href="/EWA-e-commerce-git/EWA_Beleg_24/korb.php" class="btn btn-secondary w-50 mt-3 mb-4 ms-2">Zurück zum Warenkorb</a>
    </div>
</div>

<script>
    function reloadWithoutGetParams() {
        var urlWithoutParams = window.location.origin + window.location.pathname;
        window.location.href = urlWithoutParams;
    }
</script>
';

echo $body;
?>
