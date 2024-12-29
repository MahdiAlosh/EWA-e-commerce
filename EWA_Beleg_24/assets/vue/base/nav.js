export default {
    data() {
        return {
            message: "",
            message: { showMsg: "false", text: ""},
            isAdmin: false
        };
    },
    methods: {
        msg(n) {
            this.message.text = n;
            this.message.showMsg = true;
        },
        deleteMessage(){
            this.message.text = "";
            this.message.showMsg = false;
        },
        chadmin(){
            this.isAdmin = true;
        },
        chadminOut(){
            this.isAdmin = false;
        },
        ckadmin(){
            fetch("assets/db/base_db.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: localStorage.getItem('tokenU'),
                  action: "ckadmin",
                }),
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // console.log(data.tokenisauth);
                // data.tokenisauth = true;
                // console.log(data.tokenisauth);
                if (data.tokenisauth === true) {
                    this.$root.$refs.NavComRef.chadmin();
                }
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
            });              
            //console.log("Halo dir");
        }
    },
    mounted() {
        this.deleteMessage();
        if(localStorage.getItem('tokenU')){
            this.ckadmin();
        }
    },
    template: `
    <div>
        <nav class="navbar navbar-expand navbar-dark bg-dark overflow-auto">
            <ul class="navbar-nav container">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li v-if="isAdmin" class="nav-item">
                    <router-link class="nav-link" to="/control/admin">Admin</router-link>
                </li>
            </ul>
        </nav>
        <div class="border d-flex justify-content-between bg-light" v-if="message.showMsg !== false">
            <span class="me-1 ms-2 py-1 overflow-auto fw-bold">{{message.text}}</span>
            <span class="btn btn-danger d-flex align-items-center" @click="deleteMessage"><i class="fa-solid fa-x"></i></span>
        </div>
    </div>
    `
};