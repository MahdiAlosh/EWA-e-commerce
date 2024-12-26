export default {
    data() {
        return {
            messageLog: { msgLogIn: "Login Now", errorLogIn: false, msgSignUp: "Signup Now", errorSignUp: false},
            logForm:{
                username:"",
                passwort:""
            },
            inputLog: { passLogIn: "password", passSignUp: true},
            isTokenU: !!localStorage.getItem('tokenU'),
            DisplayLog: {logDisplay: false, inoutDisplay: true}
        };
    },
    methods: {
        login(e){
            e.preventDefault();
            this.messageLog.msgLogIn= "Loading...";
            fetch("assets/db/base_db.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  Nutzername: this.logForm.username,
                  Passwort: this.logForm.passwort,
                  action: "login",
                }),
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                this.$root.$refs.NavComRef.msg(data.msgLogIn);
                this.$root.$refs.LogComRef.messageLog.msgLogIn = data.msgLogIn;
                if (!data.errorLogIn) {
                    localStorage.setItem('tokenU', data.userID);
                    this.$root.$refs.LogComRef.disPopupLog();
                    this.$root.$refs.KorbComRef.KDis1();
                    this.$root.$refs.KorbComRef.getKorb();
                    this.$root.$refs.KorbComRef.storageLog();
                    this.$root.$refs.LogComRef.storageLog();
                    this.messageLog.msgLogIn = "Login Now";
                    if (data.userRolle === true) {
                        this.$root.$refs.NavComRef.chadmin();
                    }
                }
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
                this.$root.$refs.LogComRef.messageLog.msgLogIn = "Error";
            });
        },
        signup(e){
            e.preventDefault();
            this.messageLog.msgSignUp= "signup?";
            fetch("assets/db/base_db.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  Nutzername: this.logForm.username,
                  Passwort: this.logForm.passwort,
                  action: "signup",
                }),
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                this.$root.$refs.LogComRef.messageLog.msgSignUp = data.msgSignUp;
                this.$root.$refs.NavComRef.msg(data.msgSignUp);
            
                if (!data.errorSignUp) {
                    localStorage.setItem('tokenU', data.userID);
                    this.$root.$refs.LogComRef.disPopupLog();
                    this.$root.$refs.KorbComRef.KDis1();
                    this.$root.$refs.KorbComRef.getKorb();
                    this.$root.$refs.KorbComRef.storageLog();
                    this.$root.$refs.LogComRef.storageLog();
                    this.messageLog.msgSignUp = "Signup Now";
                }
            })
            .catch((error) => {
                this.$root.$refs.NavComRef.msg(error.message);
                this.$root.$refs.LogComRef.messageLog.msgSignUp = "Error";
            });
        },
        logout(){
            localStorage.removeItem('tokenU');
            this.$root.$refs.NavComRef.msg("Logged Out");
            this.$root.$refs.KorbComRef.KDis1();
            this.$root.$refs.KorbComRef.getKorb();
            this.$root.$refs.KorbComRef.storageLog();
            this.$root.$refs.LogComRef.storageLog();
            this.$root.$refs.KorbComRef.getKorbAnzahl();
            this.$root.$refs.NavComRef.chadminOut();
        },
        chLogin(){
            if(this.inputLog.passLogIn === "password"){
                this.inputLog.passLogIn = "text"
            }else{
                this.inputLog.passLogIn = "password"
            }
        },
        chSignup(){
            this.inputLog.passSignUp = !this.inputLog.passSignUp;
        },
        storageLog(){
            this.isTokenU = !this.isTokenU;
        },
        disPopupLog(){
            this.DisplayLog.logDisplay = !this.DisplayLog.logDisplay;
        },
        disinoutLog(){
            this.DisplayLog.inoutDisplay = !this.DisplayLog.inoutDisplay;
        }
    },
    template: `
    
    <div>
        <div v-if="isTokenU">
            <button class="btn btn-danger" @click="logout"><i title="logout" class="fa-solid fa-right-from-bracket"></i></button>
        </div>
        <div v-else>
            <button class="btn btn-primary" @click="disPopupLog"><i title="login" class="fa-solid fa-user"></i></button>
        </div>
        
        <div v-if="DisplayLog.logDisplay !== false" class="popup-container">
            <div class="popupLog container">
                <div v-if="DisplayLog.inoutDisplay === true" class="container">
                    <div class="d-flex justify-content-between">
                        <span class="h3">Login</span>
                        <button class="btn" @click="disPopupLog"><i class="fa-solid fa-x"></i></button>
                    </div>
                    <div class="text-secondary mt-1 mb-2 fw-bold">
                        {{messageLog.msgLogIn}}
                    </div>
                    
                    <form @submit="login" method="post">
                        <div class="mb-1">
                            <input type="text" v-model="logForm.username" class="form-control" placeholder="Username" required>
                        </div>
                        <div class="mb-1 d-flex">
                            <input :type="inputLog.passLogIn" v-model="logForm.passwort" class="form-control" placeholder="Password" required>
                            <span class="btn" @click="chLogin"><i class="fa-regular fa-eye"></i></span>
                        </div>
                        <div class="mb-1">
                            <input type="submit" value="Login" class="btn btn-primary w-100">
                        </div>
                    </form>
                    <div>
                        <span class="text-secondary">Konto erstellen</span>
                        <span class="text-danger fw-bold ms-1" @click="disinoutLog" role="button">Registrieren</span>
                    </div>
                </div>
                <div v-if="DisplayLog.inoutDisplay === false" class="container">
                    <div class="d-flex justify-content-between">
                        <span class="h3">Signup</span>
                        <button class="btn" @click="disPopupLog"><i class="fa-solid fa-x"></i></button>
                    </div>
                    <div class="text-secondary mt-1 mb-2 fw-bold">
                        {{messageLog.msgSignUp}}
                    </div>
                    <form @submit="signup" method="post">
                        <div class="mb-1">
                            <input type="text" v-model="logForm.username" class="form-control" placeholder="Username" required>
                        </div>
                        
                        <div class="mb-1 d-flex">
                            <input :type="inputLog.passSignUp ? 'password' : 'text'" v-model="logForm.passwort" class="form-control" placeholder="Password" required>
                            <span class="btn" @click="chSignup"><i class="fa-regular fa-eye"></i></span>
                        </div>

                        <div class="mb-1">
                            <input type="submit" value="SignUp" class="btn btn-primary w-100">
                        </div>
                    </form>
                    <div>
                        <span class="text-secondary">Sie haben bereits ein Konto?</span>
                        <span class="text-danger fw-bold ms-1" @click="disinoutLog" role="button">Anmelden</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};