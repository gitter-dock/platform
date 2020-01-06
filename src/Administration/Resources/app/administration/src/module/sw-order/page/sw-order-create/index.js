import template from './sw-order-create.html.twig';
import './sw-order-create.scss';
import swOrderState from '../../state/order.store';

const { Component, State, Mixin } = Shopware;
const { get } = Shopware.Utils;

Component.register('sw-order-create', {
    template,

    mixins: [
        Mixin.getByName('notification')
    ],

    data() {
        return {
            isLoading: false,
            isSaveSuccessful: false,
            orderId: null
        };
    },

    computed: {
        customer() {
            return State.get('swOrder').customer;
        },

        cart() {
            return State.get('swOrder').cart;
        },

        isSaveOrderValid() {
            return this.customer && this.cart.token && this.cart.lineItems.length;
        }
    },

    beforeCreate() {
        State.registerModule('swOrder', swOrderState);
    },

    created() {
        this.createdComponent();
    },

    beforeDestroy() {
        this.unregisterModule();
    },

    methods: {
        createdComponent() {
            this.checkFlagActive();
        },

        unregisterModule() {
            State.unregisterModule('swOrder');
        },

        checkFlagActive() {
            if (!this.next5515) this.redirectToOrderList();
        },

        redirectToOrderList() {
            this.$router.push({ name: 'sw.order.index' });
        },

        saveFinish() {
            this.isSaveSuccessful = false;
            this.$router.push({ name: 'sw.order.detail', params: { id: this.orderId } });
        },

        onSaveOrder() {
            if (this.isSaveOrderValid) {
                this.isLoading = true;
                this.isSaveSuccessful = false;

                State
                    .dispatch('swOrder/saveOrder', {
                        salesChannelId: this.customer.salesChannelId,
                        contextToken: this.cart.token
                    })
                    .then((response) => {
                        this.isSaveSuccessful = true;
                        this.orderId = get(response, 'data.data.id');
                    })
                    .catch(() => this.showError())
                    .finally(() => {
                        this.isLoading = false;
                    });
            } else {
                this.showError();
            }
        },

        onCancelOrder() {
            State
                .dispatch('swOrder/cancelCart', {
                    salesChannelId: this.customer.salesChannelId,
                    contextToken: this.cart.token
                })
                .then(() => this.redirectToOrderList());
        },

        showError() {
            this.createNotificationError({
                title: this.$tc('sw-order.create.titleSaveError'),
                message: this.$tc('sw-order.create.messageSaveError')
            });
        }
    }
});
