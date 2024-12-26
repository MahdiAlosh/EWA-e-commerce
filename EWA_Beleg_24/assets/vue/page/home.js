export default {
    data() {
        return {
            items:"",
        };
    },
    methods:{
        getAll(){
            fetch("assets/db/main_db.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  action: "getAll",
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
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
            });
        }
    },
    created() {
        this.getAll();
        document.title = "Home G05";
        //document.description = "willkommen im G05-Geschenkeshop";
    },
    template: `

    <div class="container mt-4">
        <div class="row" v-if="items.mainBuecherMsg !== false">
            <article class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6 mb-4" v-for="row in items">
                <div class="main-artikel px-2 py-3">
                    <router-link :to="'/item/' + row.ProduktID" class="text-decoration-none">
                        <div class="main-img-container">
                            <img :src="'./assets/img/item/' + row.BildURL" class="main-img" :alt="row.Produkttitel">
                        </div>
                        <div class="mt-3">
                            <h2 class="h5 th_title">{{row.Produkttitel}}</h2>
                            <div>
                                <span v-if="row.Lagerbestand <= 0" class="text-danger fw-bold">Ausverkauft!</span>
                                <!--
                                <span v-else class="preis-brutto text-secondary fw-bold">{{row.PreisBrutto}}€</span>
                                -->
                                <span v-else class="text-success fw-bold">{{row.PreisBrutto}}€</span>
                                
                            </div>
                        </div>
                    </router-link>
                </div>
            </article>
        </div>
        <div v-else>
            <span class="fw-bold">kein Item!</span>
        </div>
    </div>
    `
};
