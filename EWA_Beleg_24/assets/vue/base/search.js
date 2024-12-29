export default {
    data() {
        return {
            searchlist: "",
            showSearch: false,
            searchTextItem: "",
            searchText: ""
        };
    },
    methods: {
        zuPreis() {
            this.searchlist.sort((a, b) => parseFloat(b.PreisBrutto) - parseFloat(a.PreisBrutto));
            //console.log("zuSort");
        },
        abPreis() {
            this.searchlist.sort((a, b) => parseFloat(a.PreisBrutto) - parseFloat(b.PreisBrutto));
            //console.log("abSort");
        },
        callSearchPop(e) {
            e.preventDefault();
            this.showPopSearch(this.searchText);
            this.searchText = "";
        },
        getSearch() {
            /* axios.post("assets/db/base_db.php",{
                Produkttitel:this.searchTextItem,
                action:"getSearch"
            }).then(function(res){
                this.$root.$refs.SearchComRef.searchlist=res.data;
            }).catch((error) => {
                this.$root.$refs.NavComRef.msg(error);
            }); */

            fetch("assets/db/base_db.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Produkttitel: this.searchTextItem,
                    action: "getSearch",
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.$root.$refs.SearchComRef.searchlist = data;
                    //console.log(this.searchlist);
                })
                .catch((error) => {
                    this.$root.$refs.NavComRef.msg(error.message);
                });
        },
        showPopSearch(text) {
            this.showSearch = true;
            this.searchTextItem = text;
            this.getSearch();
        },
        hidePopSearch() {
            this.showSearch = false;
        },
    },
    template: `
    <div class="w-100">
        <div class="w-100">
            <form class="input-group" @submit="callSearchPop" method="post">
                <input class="form-control" type="search" v-model="searchText" placeholder="Search item">
                <button type="submit" class="btn btn-danger"><i title="search" class="fa-solid fa-magnifying-glass"></i></button>
            </form>
        </div>
        <div v-if="showSearch" class="popup-container-v1">
            <div class="container popupSearch">
                <div class="d-flex justify-content-between">
                    <span class="h3">Search</span>
                    <span class="btn" @click="hidePopSearch"><i class="fa-solid fa-x"></i></span>
                </div>
                
                <div class="mb-2">
                    <input class="form-control" type="search" v-model="searchTextItem" @input="getSearch" placeholder="Search item">
                </div>
                
                <div v-if="searchlist.messageSearch !== false">
                    <div class="text-dark mb-2">
                        <span class="fw-bold btn btn-outline-secondary text-dark me-1" @click="zuPreis">Absteigend</span>
                        <span class="fw-bold btn btn-outline-secondary text-dark" @click="abPreis">Aufsteigend</span>
                    </div>
                    <div class="container-search-artikel">
                        <article class="border container mb-3" v-for="row in searchlist">
                            <router-link :to="'/item/' + row.ProduktID" class="text-decoration-none d-flex">
                                <div class="col-2">
                                    <div class="main-img-container">
                                        <img :src="'./assets/img/item/' + row.BildURL" class="main-img" :alt="row.Produkttitel">
                                    </div>
                                </div>
                                <div class="ms-2">
                                    <div class="se-title"><span class="fw-bold">{{row.Produkttitel}}</span></div>
                                    <div class="mt-2"><span class="text-secondary">{{row.PreisBrutto}}€</span></div>
                                </div>
                            </router-link>
                        </article>
                    </div>
                </div>
                <div v-else>
                    <span class="fw-bold">No Item found!</span>
                </div>
            </div>
        </div>
    </div>
    `
};