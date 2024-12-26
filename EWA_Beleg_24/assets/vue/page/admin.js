export default {
    data() {
        return {
            AdminArtikel:"",
            form:{
                ProduktID: "",
                Produktcode: "",
                Produkttitel: "",
                Mwstsatz: "",
                PreisBrutto: "",
                Lagerbestand: "",
                BewertungStars: "",
                BewertungCount: "",
                BildURL: "",
                isEdit:false,
                status:"add"
            },
            KundenRechnunglist: "",
            KundenBestellunglist: "",
            nrRechnung: null,
            displayBestellung: false
        };
    },
    methods:{
        getRechnung(){
            fetch("assets/db/admin_db.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem('tokenU'),
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
                this.KundenRechnunglist = data;
                console.log(this.KundenRechnunglist);
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
            });
        },
        getBestellung(rID, index){
            this.nrRechnung = index;
            fetch("assets/db/admin_db.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem('tokenU'),
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
                this.KundenBestellunglist = data;
                this.displayBestellung = true;
                console.log(this.KundenBestellunglist);
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
            });
        },
        submitData(e){
            e.preventDefault();
            var check = (this.form.Produktcode != "" && this.form.Produkttitel !="");
            if(check && !this.form.isEdit){
                // Save data
                fetch("assets/db/admin_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                        body: JSON.stringify({
                        token: localStorage.getItem('tokenU'),
                        Produktcode: this.form.Produktcode,
                        Produkttitel: this.form.Produkttitel,
                        Mwstsatz: this.form.Mwstsatz,
                        PreisBrutto: this.form.PreisBrutto,
                        Lagerbestand: this.form.Lagerbestand,
                        BewertungStars: this.form.BewertungStars,
                        BewertungCount: this.form.BewertungCount,
                        BildURL: this.form.BildURL,
                        action: "insert",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.NavComRef.msg(data.message);
                    if (data.errauth !== false) {
                    this.resetData();
                    this.getArtikel();
                    }
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });                  
            }else{
                this.$root.$refs.NavComRef.msg("fill all");
            }
            if(check && this.form.isEdit){
                // Update information
                fetch("assets/db/admin_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('tokenU'),
                        ProduktID: this.form.ProduktID,
                        Produktcode: this.form.Produktcode,
                        Produkttitel: this.form.Produkttitel,
                        Mwstsatz: this.form.Mwstsatz,
                        PreisBrutto: this.form.PreisBrutto,
                        Lagerbestand: this.form.Lagerbestand,
                        BewertungStars: this.form.BewertungStars,
                        BewertungCount: this.form.BewertungCount,
                        BildURL: this.form.BildURL,
                        action: "update",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.NavComRef.msg(data.message);
                    if (data.errauth !== false) {
                    this.resetData();
                    this.getArtikel();
                    }
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });                  
            }
        },
        resetData(e){
            this.form.ProduktID = "";
            this.form.Produktcode = "";
            this.form.Produkttitel = "";
            this.form.Mwstsatz = "";
            this.form.PreisBrutto = "";
            this.form.Lagerbestand = "";
            this.form.BewertungStars = "";
            this.form.BewertungCount = "";
            this.form.BildURL = "";

            this.form.status="add";
            this.form.isEdit=false;
        },
        getArtikel(){
            fetch("assets/db/admin_db.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: localStorage.getItem('tokenU'),
                  action: "getArtikel",
                }),
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.errauth !== false) {
                this.AdminArtikel = data;
                } else {
                this.$root.$refs.NavComRef.msg(data.message);
                }
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
            });
        },
        getEditArtikel(ProduktID){
            this.form.status="Update";
            this.form.isEdit=true;
            fetch("assets/db/admin_db.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: localStorage.getItem('tokenU'),
                  action: "getEditArtikel",
                  ProduktID: ProduktID,
                }),
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.errauth !== false) {
                    this.form.ProduktID = data.ProduktID;
                    this.form.Produktcode = data.Produktcode;
                    this.form.Produkttitel = data.Produkttitel;
                    this.form.Mwstsatz = data.Mwstsatz;
                    this.form.PreisBrutto = data.PreisBrutto;
                    this.form.Lagerbestand = data.Lagerbestand;
                    this.form.BewertungStars = data.BewertungStars;
                    this.form.BewertungCount = data.BewertungCount;
                    this.form.BildURL = data.BildURL;
                } else {
                this.$root.$refs.NavComRef.msg(data.message);
                }
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
            });              
        },
        deleteArtikel(ProduktID){
            if(confirm("Do you want to delete the Article? "+ProduktID+" or not?")){
                fetch("assets/db/admin_db.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      token: localStorage.getItem('tokenU'),
                      action: "deleteArtikel",
                      ProduktID: ProduktID,
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.errauth !== false) {
                    this.resetData();
                    this.getArtikel();
                    }
                    this.$root.$refs.NavComRef.msg(data.message);
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });                  
            }
        },
        disPopupBestellung(){
            this.displayBestellung = false;
        }
    },
    created(){
        this.getArtikel();
        this.getRechnung();
        document.title = "Admin G09";
        //document.description = "willkommen im Go9-Admin";
    },
    template: `
    
    <div class="container py-3">
		<h1 class="h2">Admin Panel</h1>
        <div class="py-3 admincontainer">
            <h2 class="h3">Rechnung</h2>
            <div v-if="KundenRechnunglist.messageRechnung !== false" class="py-3">
                <article v-for="(row, index) in KundenRechnunglist">
                    <div class="text-nowrap px-2 py-2 korb-artikel d-flex overflow-auto btn btn-outline-warning text-dark" @click="getBestellung(row.RechnungID, index)">
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
            <div v-else>
                <span class="fw-bold">keine Rechnung!</span>
            </div>
        </div>
        <div class="py-3 admincontainer" v-if="nrRechnung !== null && displayBestellung !== false">
            <div class="d-flex justify-content-between">
                <h2 class="h3">Bestellung List</h2>
                <span class="btn" @click="disPopupBestellung"><i class="fa-solid fa-x"></i></span>
            </div>
            <ul>
                <li><span class="fw-bold">Rechnung ID:</span> {{KundenRechnunglist[nrRechnung].RechnungID}}</li>
                <li class="overflow-auto"><span class="fw-bold">Nutzer ID:</span> {{KundenRechnunglist[nrRechnung].NutzerID}}</li>
                <li class="overflow-auto"><span class="fw-bold">Session Stripe:</span> {{KundenRechnunglist[nrRechnung].PaySession}}</li>
                <li><span class="fw-bold">Datum:</span> {{KundenRechnunglist[nrRechnung].Zeit}}</li>
                <li><span class="fw-bold">Lieferung:</span>
                    <ul>
                        <li>{{KundenRechnunglist[nrRechnung].Adresse}}</li>
                        <li>{{KundenRechnunglist[nrRechnung].Zip}} - {{KundenRechnunglist[nrRechnung].Ort}}</li>
                    </ul>
                </li>
                <li><span class="fw-bold">Gesamtpreis:</span> {{KundenRechnunglist[nrRechnung].totalPreis}}€</li>
            </ul>
            <article class="mb-3 d-flex" v-for="(row, index) in KundenBestellunglist">
                <div class="col-2">
                    <div class="main-img-container">
                    <img :src="'./assets/img/item/' + row.BildURL" class="main-img" :alt="row.Produkttitel">
                    </div>
                </div>
                <div class="col-10">
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
        <div class="py-3 admincontainer">
            <h2 class="h3">Item List</h2>
            <div class="overflow-auto mb-2 ap-itemtable">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ProduktID</th>
                            <th scope="col">Produktcode</th>
                            <th scope="col">Produkttitel</th>
                            <th scope="col">PreisBrutto</th>
                            <th scope="col">Mwstsatz</th>
                            <th scope="col">Lagerbestand</th>
                            <th scope="col">BewertungStars</th>
                            <th scope="col">BewertungCount</th>
                            <th scope="col">BildURL</th>

                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in AdminArtikel">
                            <th scope="row">{{row.ProduktID}}</th>
                            <td>{{row.Produktcode}}</td>
                            <td>{{row.Produkttitel}}</td>
                            <td>{{row.PreisBrutto}}</td>
                            <td>{{row.Mwstsatz}}</td>
                            <td>{{row.Lagerbestand}}</td>
                            <td>{{row.BewertungStars}}</td>
                            <td>{{row.BewertungCount}}</td>
                            <td>{{row.BildURL}}</td>
                            <td>
                                <button class="btn btn-primary" @click="getEditArtikel(row.ProduktID)">Update</button>
                            </td>
                            <td>
                                <button class="btn btn-warning" @click="deleteArtikel(row.ProduktID)">delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
		<div class="py-3 admincontainer">
            <h2 class="h3">Editor</h2>
            <div class="col-md-12">
                <form @submit="submitData" @reset="resetData" method="post">
                    <div>
                        <input type="hidden" v-model="form.ProduktID">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="Produktcode">Produktcode</label>
                        <input type="text" v-model="form.Produktcode" class="form-control" id="Produktcode">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="Produkttitel">Produkttitel</label>
                        <input type="text" v-model="form.Produkttitel" class="form-control" id="Produkttitel">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="Mwstsatz">Mwstsatz</label>
                        <input type="text" v-model="form.Mwstsatz" class="form-control" id="Mwstsatz">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="PreisBrutto">PreisBrutto</label>
                        <input type="text" v-model="form.PreisBrutto" class="form-control" id="PreisBrutto">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="Lagerbestand">Lagerbestand</label>
                        <input type="text" v-model="form.Lagerbestand" class="form-control" id="Lagerbestand">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="BewertungStars">BewertungStars</label>
                        <input type="text" v-model="form.BewertungStars" class="form-control" id="BewertungStars">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="BewertungCount">BewertungCount</label>
                        <input type="text" v-model="form.BewertungCount" class="form-control" id="BewertungCount">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="BildURL">BildURL</label>
                        <input type="text" v-model="form.BildURL" class="form-control" id="BildURL">
                    </div>
                    <div class="d-flex justify-content-between">
                        <input type="submit" v-model="form.status" class="btn btn-success">
                        <input type="reset" value="cancel" class="btn btn-danger">
                    </div>
                </form>
            </div>
        </div>
	</div>
    
    `
}