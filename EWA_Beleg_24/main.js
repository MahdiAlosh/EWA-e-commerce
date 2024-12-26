import HomeCom from './assets/vue/page/home.js'
import AdminCom from './assets/vue/page/admin.js'
import ItemCom from './assets/vue/page/item.js'
import NotfoundCom from './assets/vue/page/404.js'

import KorbCom from './assets/vue/base/korb.js'
import LogCom from './assets/vue/base/log.js'
import NavCom from './assets/vue/base/nav.js'
import SearchCom from './assets/vue/base/search.js'

const routes = [
    { path: '/', component: HomeCom },
    { path: '/control/admin', component: AdminCom },
    { path: '/item/:value', component: ItemCom },
    { path: '/:path(.*)', component: NotfoundCom }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = Vue.createApp({
    components: {
        KorbCom,
        LogCom,
        NavCom,
        SearchCom
    }
});

app.use(router);
app.mount('#app');