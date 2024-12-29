export default {
    data() {
        return {
            itemId: null,
            items: {
                ProduktID: "",
                Produktcode: "",
                Produkttitel: "Loading..",
                Mwstsatz: "0",
                PreisBrutto: "0",
                Lagerbestand: "0",
                BewertungStars: "0",
                BewertungCount: "0",
                BildURL: ""
            },
            buyForm: {
                id: "",
                menge: "1"
            }
        };
    },
    watch: {
        '$route.params.value': 'chLink'
    },
    methods: {
        chLink() {
            this.getItem();
            this.$root.$refs.SearchComRef.hidePopSearch();
            this.$root.$refs.KorbComRef.DisplayKorb.korbDisplay = false;
        },
        getItem() {
            this.itemId = this.$route.params.value;
            /* axios.post("assets/db/item_db.php",{
                ProduktID:this.itemId,
                action:"getItem"
            }).then(function(res){
                itemcom.items=res.data;
            }).catch((error) => {
                this.$root.$refs.NavComRef.msg(error);
            }); */

            fetch("assets/db/item_db.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ProduktID: this.itemId,
                    action: "getItem",
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.items = data;
                    document.title = this.items.Produkttitel;
                    //document.description = this.items.Kurzinhalt;
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });

        },
        getIdAU() {
            return fetch("assets/db/base_db.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "getIdOU",
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    const idOU = data.messageIdOU;
                    localStorage.setItem('tokenOU', idOU);
                    //console.log("set " + localStorage.getItem('tokenOU')); // testt
                    return idOU;
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                    return Promise.reject('error');
                });
        },
        async submitBuy(e) {
            e.preventDefault();
            let fsmenge = this.$root.$refs.KorbComRef.getItemMenge(this.items.ProduktID);
            let smenge;
            console.log(fsmenge);
            console.log(this.items.Lagerbestand);
            smenge = parseInt(this.buyForm.menge - 1) + parseInt(fsmenge);
            console.log("sm: " + smenge);
            if (smenge >= this.items.Lagerbestand) {
                console.log("no");
                this.$root.$refs.NavComRef.msg("Maximum Menge: " + this.items.Lagerbestand + ", Sie können noch " + parseInt(this.items.Lagerbestand - fsmenge) + " Stück im Warenkorb hinzufügen.");
            } else {
                console.log("yes");
                var token = null;
                if (localStorage.getItem('tokenU')) {
                    token = localStorage.getItem('tokenU');
                    //console.log(token);
                } else if (localStorage.getItem('tokenOU')) {
                    token = localStorage.getItem('tokenOU');
                    //console.log(token);
                } else {
                    token = await this.getIdAU();
                    //console.log("todb1 "+token);
                }

                //console.log("todb "+token);

                fetch("assets/db/item_db.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        NutzerID: token,
                        ProduktID: this.itemId,
                        Menge: this.buyForm.menge,
                        action: "buyItem",
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        this.buyForm.menge = "1";
                        this.$root.$refs.NavComRef.msg(data.msgBuyItem);
                        this.$root.$refs.KorbComRef.getKorb();
                    })
                    .catch((error) => {
                        this.$root.$refs.NavComRef.msg(error.message);
                    });
            }
        }
    },
    mounted() {
        //this.itemId = this.$el.getAttribute('data-itemid');
        this.getItem();
        this.$root.$refs.SearchComRef.hidePopSearch();

    },
    template: `
    
    <div class="container">
        <br><br>
		<div v-if="items.itemBuecherMsg !== false">
			<article class="row py-4">
				<div class="col-xl-3 col-md-4 col-sm-12">
					<div class="item-img">
						<div class="main-img-container">
							<img :src="'./assets/img/item/' + items.BildURL" class="main-img" :alt="items.Produkttitel">
						</div>
					</div>
				</div>
				<div class="col-xl-9 col-md-8 col-sm-12 mt-2">
					<div>
						<div class="text-secondary">
							<span>{{items.Produktcode}}</span>
							<span class="px-1">-</span>
							
                            <!--
                            <span>{{items.BewertungStars}} Sterne </span>
                            -->

                            <img class="product-rating-stars-item ms-2" 
                                :src="'./assets/img/ratings/rating-' + items.BewertungStars * 10 + '.png'" 
                                alt="Bewertung">

							<span class="px-1">-</span>
							<span>{{items.BewertungCount}} Bewertungen </span>
						</div>
						<h1 class="h2">{{items.Produkttitel}}</h1>
						<div class="h2">{{ parseFloat(items.PreisBrutto).toFixed(2) }}€</div>
						<!-- <div class="text-secondary">{{items.Kurzinhalt}}</div> -->
					</div>
					<div class="mt-3">
						<table class="table">
							<thead>
								<tr class="table-primary">
									<th scope="col">Description</th>
									<th scope="col" class="text-end">Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">Netto Preis</th>
									<td class="text-end">{{ (items.PreisBrutto * buyForm.menge * (1 / (1 + Number(items.Mwstsatz)))).toFixed(2) }}€</td>
								</tr>
								<tr>
									<th scope="row">{{ Math.round(items.Mwstsatz * 100) }}% Mwst</th>
									<td class="text-end">{{ ( buyForm.menge * (items.PreisBrutto - (items.PreisBrutto * (1 / (1 + Number(items.Mwstsatz))))) ).toFixed(2) }}€</td>
								</tr>
								<tr class="table-info">
									<th scope="row">Gesamtpreis</th>
									<td class="text-end fw-bold">{{ ( items.PreisBrutto * buyForm.menge ).toFixed(2) }}€</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<div>
						<div class="mb-1 ms-1 text-nowrap d-flex justify-content-start">
							<span v-if="items.Lagerbestand <= 0" class="text-danger fw-bold h5">Ausverkauft!</span>
							<div v-else>
								<span class="fw-bold text-danger me-1">Lagerbestand:</span>
								<span class="text-secondary">{{items.Lagerbestand}} übrig</span> 
							</div>
						</div>
						<form v-if="items.Lagerbestand > 0" class="input-group" @submit="submitBuy" method="post">
							<input aria-label="amount" type="number" v-model="buyForm.menge" class="form-control" :max="items.Lagerbestand" min="1" required>
							<input type="submit" value="In den Einkaufswagen" class="btn btn-info">
						</form>
					</div>
				</div>
			</article>
		</div>
		<div v-else>
			<p>kein Item!</p>
		</div>
	</div>

    `
};