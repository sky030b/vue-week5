export default {
    template: '#userProductModal',
    props: {
        product: {
            type: Object,
            default() {
                return {
                }
            }
        },
        productTemp: {
            type: Object,
            default() {
                return {
                }
            }
        },
        addToCart: {
            type: Function
        },
    },
    data() {
        return {
            status: {},
            modal: '',
            qty: 1,
        };
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal, {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        openModal() {
            this.modal.show();
            this.qty = 1;
        },
        hideModal() {
            this.modal.hide();
            this.qty = 1;
        },
    },
}