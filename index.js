import Pagination from "./components/Pagination.js";
import userProductModal from './components/userProductModal.js';

// const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;

// const { localize, loadLocaleFromURL } = VeeValidateI18n;
// loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');


const app = Vue.createApp({
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            allProducts: {},
            pageProducts: {},
            pagination: {},
            productTemp: {},
            loadingStatus: {
                id: "",
                deleteId: ""
            },
            cart: {},
            coupon: false,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            isLoading: false,
        }
    },
    methods: {
        // api functions
        getAllProducts() {
            axios.get(`${this.api.url}/api/${this.api.path}/products/all`)
                .then(res => {
                    this.allProducts = res.data.products;
                })
                .catch(err => {
                    alert(`${err.data.message}\n將返回登入頁。`);
                    delete axios.defaults.headers.common["Authorization"];
                    window.location = "./login.html";
                })
        },
        getPageProducts(page = 1) {
            axios.get(`${this.api.url}/api/${this.api.path}/products?page=${page}`)
                .then(res => {
                    this.pageProducts = res.data.products;
                    this.pagination = res.data.pagination;
                    console.log(this.pageProducts)
                })
                .catch(err => {
                    alert(`${err.data.message}\n將返回登入頁。`);
                    delete axios.defaults.headers.common["Authorization"];
                    window.location = "./login.html";
                })
        },
        getCart() {
            this.isLoading = true;
            axios.get(`${this.api.url}/api/${this.api.path}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                    console.log(res.data.data);
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 600)
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },

        getProduct(id) {
            this.loadingStatus.id = id;
            axios.get(`${this.api.url}/api/${this.api.path}/product/${id}`)
                .then((res) => {
                    this.loadingStatus.id = '';
                    this.productTemp = res.data.product;
                    this.$refs.userProductModal.openModal();
                }).catch((err) => {
                    alert(err.response.data.message);
                    this.loadingStatus.id = '';
                });
        },

        addToCart(id, qty = 1) {
            this.loadingStatus.id = id;
            const cart = {
                product_id: id,
                qty,
            };

            axios.post(`${this.api.url}/api/${this.api.path}/cart`, { data: cart })
                .then((res) => {
                    alert(res.data.message);
                    this.loadingStatus.id = '';
                    this.getCart();
                    this.$refs.userProductModal.hideModal();
                }).catch((err) => {
                    alert(err.response.data.message);
                    this.loadingStatus.id = '';
                });
        },
        updateCart(item) {
            this.loadingStatus.id = item.id;
            const data = {
                "product_id": item.product_id,
                "qty": item.qty
            }
            axios.put(`${this.api.url}/api/${this.api.path}/cart/${item.id}`, { data })
                .then((res) => {
                    alert(res.data.message);
                    this.loadingStatus.id = '';
                    this.getCart();
                }).catch((err) => {
                    alert(err.data.message);
                    this.loadingStatus.id = '';
                });
        },

        removeCartItem(id) {
            this.loadingStatus.deleteId = id;
            axios.delete(`${this.api.url}/api/${this.api.path}/cart/${id}`)
                .then((res) => {
                    alert(res.data.message);
                    this.loadingStatus.deleteId = "";
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message)
                    this.loadingStatus.deleteId;
                })
        },
        deleteAllCarts() {
            axios.delete(`${this.api.url}/api/${this.api.path}/carts`)
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        createOrder() {
            const order = this.form;
            axios.post(`${this.api.url}/api/${this.api.path}/order`, { data: order })
                .then((res) => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },

        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : '需要正確的手機號碼'
        }
    },
    watch: {
        isLoading(newVal) {
            if (newVal) {
                // 禁止滾動
                document.body.style.overflow = 'hidden';
            } else {
                // 恢復滾動許可
                document.body.style.overflow = '';
            }
        }
    },
    mounted() {
        this.isLoading = true;
        this.getAllProducts();
        this.getPageProducts();
        this.getCart();
    }
});

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

app.component('Pagination', Pagination);
app.component('userProductModal', userProductModal);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('loading', VueLoading.Component)

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount('#app');