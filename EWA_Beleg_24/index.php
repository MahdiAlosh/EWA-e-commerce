<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="#ffffff">
        <meta name="description" content="willkommen im G05-Laden">

        <link rel="stylesheet" type="text/css" href="./assets/css/style.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
        <!-- <link rel="stylesheet" type="text/css" href="./assets/css/style.css"> -->
        
        <link rel="icon" href="./assets/img/logo/favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="57x57" href="./assets/img/logo/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="./assets/img/logo/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="./assets/img/logo/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/logo/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="./assets/img/logo/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="./assets/img/logo/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="./assets/img/logo/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="./assets/img/logo/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="./assets/img/logo/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="./assets/img/logo/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="./assets/img/logo/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="./assets/img/logo/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="./assets/img/logo/favicon-16x16.png">
        <link rel="manifest" href="./assets/img/logo/manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="./assets/img/logo/ms-icon-144x144.png">

        <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
        <script src="https://unpkg.com/vue-router@4"></script>
        <script type="module" src="main.js"></script>
	</head>
    <body id="app">
        <header>
            <div class="headstick">
                <div class="d-flex px-2 py-3 container">
                    <div>
                        <router-link to="/">
                            <img class="mainlogo" src="./assets/img/logo/apple-icon-57x57.png" alt="g09">
                        </router-link>
                    </div>
                    <div class="d-flex align-items-center w-100 ms-2">
                        <search-com ref="SearchComRef"></search-com>
                        <div class="d-flex px-1">
                            <korb-com ref="KorbComRef"></korb-com>
                            <log-com ref="LogComRef"></log-com>
                        </div>
                    </div>
                </div>
                <nav-com ref="NavComRef"></nav-com>
            </div>
        </header>
        <main>
            <br><br>
            <noscript class="container d-flex justify-content-center">
                <p class="fw-bold text-danger h2">Your browser does not support JavaScript!</p>
            </noscript>
            <?php
                if ($_SERVER["REQUEST_METHOD"] == "POST") {
                    include 'payment/paymain.php';
                }else{
                    if((isset($_GET['res']) && ($_GET['res'] == 1))){
                        include 'payment/paysuccess.php';
                    }else if((isset($_GET['res']) && ($_GET['res'] == 0))){
                        include 'payment/paycancel.php';
                    }else{
                        $body = '<router-view></router-view>';
                    }
                }
                echo $body;
            ?>
        </main>
        <footer class="border-top mt-4">
            <div class="container mt-3">
                <span class="fw-bold text-secondary">© 2024 Shop G05. All rights reserved.</span>
            </div>
        </footer>
    </body>
</html>