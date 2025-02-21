export default {
    data() {
        return {
            DisplayKorb: { korbDisplay: false, KorbSchritt1: true, KorbSchritt2: false, KorbSchritt3: false, KorbSchritt4: false, KorbSchritt4a: true, KorbSchritt4b: false},
            korblist: "",
            historyRechnunglist: "",
            historyBestellunglist: "",
            nrRechnung: 0,
            isTokenUKorb: !!localStorage.getItem('tokenU'),
            korbSum: { KorbAnzahl: 0},
            mytoken: ""
        };
    },
    methods: {
        getKorbAnzahl(){
            this.korbSum.KorbAnzahl = this.calculateTotalMenge();
        },
        getKorb(){
            let nextstp = false;
            let iduser;
            
            if(localStorage.getItem('tokenU')){ // für user, der angemeldet bzw registiert
                nextstp = true;
                iduser = localStorage.getItem('tokenU');
            }else if(localStorage.getItem('tokenOU')){ // für user, der als Gast gekennzeichnet
                nextstp = true;
                iduser = localStorage.getItem('tokenOU');
            }

            if(nextstp){
                /* axios.post("assets/db/base_db.php",{
                    NutzerID:iduser,
                    action:"getKorb"
                }).then(function(res){
                    this.$root.$refs.KorbComRef.korblist=res.data;
                    this.$root.$refs.KorbComRef.getKorbAnzahl();
                }).catch((error) => {
                    this.$root.$refs.NavComRef.msg(error);
                }); */
                fetch("assets/db/base_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      NutzerID: iduser,
                      action: "getKorb",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.KorbComRef.korblist = data;
                    this.$root.$refs.KorbComRef.getKorbAnzahl();
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });
            }else{
                this.korblist = {messageKorb: false}
            }
        },
        getRechnung(){
            let nextstp = false;
            let iduser;
            
            if(localStorage.getItem('tokenU')){
                nextstp = true;
                iduser = localStorage.getItem('tokenU');
            }else if(localStorage.getItem('tokenOU')){
                nextstp = true;
                iduser = localStorage.getItem('tokenOU');
            }

            if(nextstp){
                fetch("assets/db/base_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      NutzerID: iduser,
                      action: "getRechnung",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.KorbComRef.historyRechnunglist = data;
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });                  
            }else{
                this.historyRechnunglist = {messageRechnung: false}
            }
        },
        getBestellung(rID, index){
            this.DisplayKorb.KorbSchritt4a = false;
            this.DisplayKorb.KorbSchritt4b = true;
            this.nrRechnung = index;

            let nextstp = false;
            let iduser;
            
            if(localStorage.getItem('tokenU')){
                nextstp = true;
                iduser = localStorage.getItem('tokenU');
            }else if(localStorage.getItem('tokenOU')){
                nextstp = true;
                iduser = localStorage.getItem('tokenOU');
            }

            if(nextstp){
                fetch("assets/db/base_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      NutzerID: iduser,
                      RechnungID: rID,
                      action: "getBestellung",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.KorbComRef.historyBestellunglist = data;
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });
            }else{
                this.historyBestellunglist = {messageBestellung: false}
            }
        },
        KDis1(){
            this.DisplayKorb.KorbSchritt1 = true;
            this.DisplayKorb.KorbSchritt2 = false;
            this.DisplayKorb.KorbSchritt3 = false;
            this.DisplayKorb.KorbSchritt4 = false;
        },
        KDis2(){
            this.DisplayKorb.KorbSchritt1 = false;
            this.DisplayKorb.KorbSchritt2 = true;
            this.DisplayKorb.KorbSchritt3 = false;
            this.DisplayKorb.KorbSchritt4 = false;
        },
        KDis3(){
            this.DisplayKorb.KorbSchritt1 = false;
            this.DisplayKorb.KorbSchritt2 = false;
            this.DisplayKorb.KorbSchritt3 = true;
            this.DisplayKorb.KorbSchritt4 = false;
            this.getNID();
        },
        KDis4(){
            this.DisplayKorb.KorbSchritt1 = false;
            this.DisplayKorb.KorbSchritt2 = false;
            this.DisplayKorb.KorbSchritt3 = false;
            this.DisplayKorb.KorbSchritt4 = true;
            this.getRechnung();
        },
        KDis4a(){
            this.DisplayKorb.KorbSchritt4a = true;
            this.DisplayKorb.KorbSchritt4b = false;
        },
        decrease(index){
            if(this.korblist[index].Menge > 0)
                this.changeKorb(index, -1);
        },
        increase(index){
            let smenge = this.$root.$refs.KorbComRef.getItemMenge(this.korblist[index].ProduktID);
            //console.log(smenge);
            //console.log(this.korblist[index].Lagerbestand);

            if (smenge >= this.korblist[index].Lagerbestand) {
                //console.log("no");
                this.$root.$refs.NavComRef.msg("Maximum Menge: " + this.korblist[index].Lagerbestand);
            }else{
                //console.log("yes");
                this.changeKorb(index, 1);
            }
        },
        changeKorb(index, menge){
            let nextstp = false;
            let iduser;
            
            if(localStorage.getItem('tokenU')){
                nextstp = true;
                iduser = localStorage.getItem('tokenU');
            }else if(localStorage.getItem('tokenOU')){
                nextstp = true;
                iduser = localStorage.getItem('tokenOU');
            }

            if(nextstp){
                fetch("assets/db/base_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ProduktID: this.korblist[index].ProduktID,
                      Menge: menge,
                      NutzerID: iduser,
                      action: "changeKorb",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.NavComRef.msg(data.msgChangeKorb);
                    this.$root.$refs.KorbComRef.getKorb();
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });
            }else{
                this.$root.$refs.NavComRef.msg("error");
            }
        },
        calculateTotal() {
            let total = 0;
            let ctPreisBrutto;
            let ctMenge;
            for (let i = 0; i < this.korblist.length; i++) {
                ctPreisBrutto = parseFloat(this.korblist[i].PreisBrutto);
                ctMenge = parseFloat(this.korblist[i].Menge);
                total += ctPreisBrutto * ctMenge;
            }
            return total.toFixed(2);
        },
        calculateTotalMenge(){
            let total = 0;
            for (let i = 0; i < this.korblist.length; i++) {
                total += parseFloat(this.korblist[i].Menge);
            }
            return total;
        },
        storageLog(){
            this.isTokenUKorb = !this.isTokenUKorb;
        },
        getNID(){
            if(this.isTokenUKorb){
                this.mytoken = localStorage.getItem('tokenU')
            }else{
                this.mytoken = localStorage.getItem('tokenOU')
            }
        },
        disPopupLogkb(){
            this.$root.$refs.LogComRef.disPopupLog();
        },
        disPopupKorb(){
            this.DisplayKorb.korbDisplay = !this.DisplayKorb.korbDisplay;
        },
        getItemMenge(id){
            let gmenge;
            if(this.korblist.messageKorb !== false){
                const selectedData = this.korblist.filter(item => item.ProduktID === id);
            
                if (selectedData.length == 0) {
                    gmenge = 0;
                }else{
                    gmenge = selectedData[0].Menge;
                }
            }else{
                gmenge = 0;
            }

            return gmenge;
        }
    },
    created() {
        this.getKorb();
    },
    template: `

    <div>
        <button class="btn btn-success position-relative me-1" @click="disPopupKorb">
            <i title="korb" class="fa-solid fa-bag-shopping"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{korbSum.KorbAnzahl}}
            </span>
        </button>
        <div v-if="DisplayKorb.korbDisplay !== false" class="popup-container">
            <div class="container popupKorb">
                <div class="d-flex justify-content-between mb-2">
                <div v-if="DisplayKorb.KorbSchritt4 !== false">
                    <span class="fw-bold btn btn-outline-info me-1" @click="KDis1">Warenkorb</span>
                    <span class="fw-bold btn btn-primary" @click="KDis4">Meine Bestellung</span>
                </div>
                <div v-else>
                    <span class="fw-bold btn btn-primary me-1" @click="KDis1">Warenkorb</span>
                    <span class="fw-bold btn btn-outline-info" @click="KDis4">Meine Bestellung</span>
                </div>
                <span class="btn" @click="disPopupKorb"><i class="fa-solid fa-x"></i></span>
                </div>
                
                <!-- probiere ohne den Teil ||.... -->
                <div v-if="korblist.messageKorb !== false || DisplayKorb.KorbSchritt4 !== false">
                
                    <!-- Display 1 -->
                    <div v-if="DisplayKorb.KorbSchritt1 !== false">
                        <div class="popupKorbbody" >
                            <article class="px-2 py-2 korb-artikel d-flex overflow-auto" v-for="(row, index) in korblist">
                                <div class="col-2">
                                <div class="main-img-container">
                                    <img :src="'./assets/img/item/' + row.BildURL" class="main-img" :alt="row.Produkttitel">
                                </div>
                                </div>
                                <div class="col-4">
                                <div class="ms-2">
                                    <router-link :to="'/item/' + row.ProduktID" class="text-decoration-none">
                                        <div class="fw-bold th_title-korb">{{row.Produkttitel}}</div>
                                    </router-link>
                                    <div class="d-flex overflow-auto">
                                    <button class="btn" v-on:click=decrease(index)>-</button>
                                    <div class="fw-bold d-flex align-items-center">{{row.Menge}}</div>
                                    <button class="btn" v-on:click=increase(index)>+</button>
                                    </div>
                                </div>
                                </div>
                                <div class="col-6">
                                <div class="ms-1 overflow-auto">
                                    <div class="text-nowrap"><span class="fw-bold">Preis: </span><span class="text-secondary">{{row.PreisBrutto}}€</span></div>
                                    <div class="text-nowrap"><span class="fw-bold">Anzahl: </span><span class="text-secondary">{{row.Menge}} Stück</span></div>
                                    <div class="text-nowrap"><span class="fw-bold">Total: </span><span class="text-secondary">{{(row.PreisBrutto * row.Menge).toFixed(2)}}€</span></div>
                                </div>
                                </div>
                            </article>
                        </div>
                        <div class="py-3 px-2 d-flex justify-content-end">
                            <span class="fw-bold me-2">Gesamtkosten: </span>
                            <span class="text-secondary fw-bold">{{ calculateTotal() }}€</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button v-if="!isTokenUKorb" @click="KDis2" class="btn btn-success">Zur Kasse <i class="fa-solid fa-chevron-right"></i></button> 
                            <!--"!isTokenUKorb" muss false sein-->
                            <button v-else @click="KDis3" class="btn btn-success">Zur Kasse <i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>

                    <!-- Display 2 -->
                    <div class="container" v-if="DisplayKorb.KorbSchritt2 !== false && !isTokenUKorb"> <!--"!isTokenUKorb" muss false sein-->
                        <div class="py-4">
                        <div>
                            <button class="btn btn-primary w-100 text-nowrap" @click="KDis3">Als Gast bestellen</button>
                        </div>
                        <div class="d-flex justify-content-center py-2">
                            <span class="px-3 fw-bold d-flex align-items-center">Oder</span>
                        </div>
                        <div>
                            <button class="btn btn-primary w-100" @click="disPopupLogkb()">Anmelden</button>
                        </div>
                        </div>
                        <div class="mt-3 d-flex justify-content-start">
                        <button class="me-1 btn btn-warning" @click="KDis1"><i class="fa-solid fa-chevron-left"></i> Zurück</button>
                        </div>
                    </div>

                    <!-- Display 3 -->
                    <div class="container" v-if="DisplayKorb.KorbSchritt3 !== false">
                        <form action="#/" method="POST">
                        <input type="hidden" name="uid" v-model="mytoken" required>

                        <!-- <div class="mb-1" v-if="!isTokenUKorb">
                            <input type="email" name="email" placeholder="email" class="form-control" required>
                        </div> -->

                        <div class="mb-1">
                            <input type="email" name="email" placeholder="email" class="form-control" required>
                        </div>

                        <div class="mb-1">
                            <input type="text" name="co" placeholder="c/o" class="form-control" required>
                        </div>

                        <div class="mb-1">
                            <input type="text" name="adresse" placeholder="Adresse" class="form-control" required>
                        </div>

                        <div class="mb-1 d-flex">
                            <input type="text" name="zip" placeholder="Zip" class="form-control" required>
                            <input type="text" name="ort" placeholder="Ort" class="form-control" required>
                        </div>

                        <div>
                            <input type="submit" value="Pay" class="btn btn-primary w-100">
                        </div>
                        </form>
                        <div class="mt-3">
                        <button v-if="!isTokenUKorb" class="me-1 btn btn-warning" @click="KDis2"><i class="fa-solid fa-chevron-left"></i> Back</button>
                        <!--Back für Anmelden-->
                        <button class="me-1 btn btn-warning" @click="KDis1"><i class="fa-solid fa-chevron-left"></i> Zurück</button>
                        <!--Zurück für Warenkorb-->
                        </div>
                    </div>

                    <!-- Display 4 -->
                    <div v-if="DisplayKorb.KorbSchritt4 !== false">
                        <div class="popupKorbbody" v-if="historyRechnunglist.messageRechnung !== false">
                        <span class="h5">Meine Bestellung</span>
                        <div v-if="DisplayKorb.KorbSchritt4a !== false">
                            <article v-for="(row, index) in historyRechnunglist">
                            <div class="text-nowrap px-2 py-2 korb-artikel d-flex overflow-auto btn" @click="getBestellung(row.RechnungID, index)">
                                <div>
                                <span class="fw-bold">ID: </span>
                                <span>{{row.RechnungID}}</span>
                                </div>
                                <div class="ms-2">
                                <span class="fw-bold">Zeit: </span>
                                <span>{{row.Zeit}}</span>
                                </div>
                                <div class="ms-2">
                                <span class="fw-bold">Total: </span>
                                <span>{{row.totalPreis}}€</span>
                                </div>
                            </div>
                            </article>
                        </div>
                        <div v-if="DisplayKorb.KorbSchritt4b !== false">
                            <ul>
                            <li><span class="fw-bold">ID:</span> {{historyRechnunglist[nrRechnung].RechnungID}}</li>
                            <li><span class="fw-bold">Datum:</span> {{historyRechnunglist[nrRechnung].Zeit}}</li>
                            <li><span class="fw-bold">Lieferung:</span>
                                <ul>
                                <li>{{historyRechnunglist[nrRechnung].Adresse}}</li>
                                <li>{{historyRechnunglist[nrRechnung].Zip}} - {{historyRechnunglist[nrRechnung].Ort}}</li>
                                </ul>
                            </li>
                            <li><span class="fw-bold">Gesamtpreis:</span> {{historyRechnunglist[nrRechnung].totalPreis}}€</li>
                            </ul>
                            <article class="mb-3 d-flex" v-for="(row, index) in historyBestellunglist">
                            <div class="col-3">
                                <div class="main-img-container">
                                <img :src="'./assets/img/item/' + row.BildURL" class="main-img" :alt="row.Produkttitel">
                                </div>
                            </div>
                            <div class="col-9">
                                <div class="ms-1 overflow-auto mt-1">
                                <router-link :to="'/item/' + row.ProduktID" class="text-decoration-none">
                                    <div class="fw-bold th_title-korb-history">{{row.Produkttitel}}</div>
                                </router-link>
                                <div class="text-nowrap"><span class="fw-bold">Preis: </span><span class="text-secondary">{{row.PreisBrutto}}€</span></div>
                                <div class="text-nowrap"><span class="fw-bold">Anzahl: </span><span class="text-secondary">{{row.Menge}} Stück</span></div>
                                <div class="text-nowrap"><span class="fw-bold">Total: </span><span class="text-secondary">{{(row.PreisBrutto * row.Menge).toFixed(2)}}€</span></div>
                                </div>
                            </div>
                            </article>
                        </div>
                        </div>
                        <div v-else>
                        <span class="fw-bold">Keine Bestellung!</span>
                        </div>
                        <div v-if="DisplayKorb.KorbSchritt4b !== false" class="mt-3 d-flex justify-content-start">
                        <button class="me-1 btn btn-warning" @click="KDis4a"><i class="fa-solid fa-chevron-left"></i> Zurück</button>
                        </div>
                    </div>
                
                </div>
                <div v-else>
                    <span class="fw-bold">Korb ist leer!</span>
                </div>
            </div>
        </div>
    </div>
    
    `
};