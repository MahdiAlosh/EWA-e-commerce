<?php
    $session = $_GET['session_id'];
    $bodyres='<h1>Canceled</h1><span>Canceled '. $session .'</span>';

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