<template>
<div style="display: flex;"><button class="green" @click="$router.push('/')">Home</button></div>
<div class="payment-container">
        <div class="payment-content">
            <div style="font-size: 28px; font-weight: 700; text-align: left;">My Orders</div>
            <div v-if="orders.length == 0">No orders available</div>
            <div class="orders-wrapper" v-for="order in orders" :key="order.id">
                <div class="order">
                    <div style="font-size: 22px; font-weight: 700;">Kamar {{ order.idKamar }}</div>
                    <div>Metode pembayaran: {{ order.metodePembayaran }}</div>
                    <div>Tanggal Masuk: {{ order.dateMulai }}</div>
                    <div>Durasi: {{ order.durasi }} bulan</div>
                    <div>Tanggal Selesai: {{ order.dateSelesai }}</div>
                    <div>Status: {{ displayStatus(order.status) }}</div>
                    <div>Total <div style="font-size: 30px; font-weight: 700;" >Rp {{ toPrice(order.totalHarga) }}</div></div>
                </div>
                <div class="action">
                    <div>
                        <div v-if="isPaid(order.status)" style="font-style: italic; font-size: 16px; font-weight: 500;" >{{ order.status }}</div>
                        <div v-if="order.status == 'Cancelled'"><button class="red" id="deleteButt" @click="deleteOrder(order.id)">Delete</button></div>
                    </div>
                    <div v-if="!isPaid(order.status)"><button class="green" @click="routeTo(order.id)"> {{ order.status }}</button></div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default{
    data(){
        return{
            orders: [],
        }
    },
    methods:{
        getOrders(){
            axios.get('http://localhost:1337/getAllBooking', {
                params: {
                    userId: JSON.parse(localStorage.getItem('user')).id
                }
            }).then(res => {
                this.orders = res.data.orders
                console.log(this.orders)
                this.orders.forEach((order) => {
                    this.changeStatus(order)
                })
            }).catch(err => {
                console.log(err)
            })
        },
        toPrice(price) {
            var new_price = price.toString()
            new_price = new_price.split('')
            var n_dots = Math.floor(new_price.length / 3)
            var it = 1
            for(it; it<n_dots+1; it++){
                var pos = new_price.length+1-it-3*it
                new_price.splice(pos,0,'.')
            }
            return new_price.join('')
        },
        changeStatus(order){
            if(order.status == 'waiting_payment')
                order.status = "Proceed payment"
            else if(order.status == 'waiting_verification')
                order.status = 'Waiting Verification'
            else if(order.status == 'verified')
                order.status = 'Verified'
            else
                order.status = 'Cancelled'
        },
        displayStatus(status){
            if(status == 'Proceed payment')
                return "Please proceed the payment"
            else if(status == 'Waiting Verification')
                return "Waiting for verification from the admin"
            else if(status == 'Verified')
                return "Payment is verified. Please make an appointment with the Admin via available contacts"
            else
                return "Booking is cancelled"
        },
        isPaid(status){
            if (status == 'Proceed payment') return false
            return true
        },
        routeTo(orderId){
            this.$router.push('/payment/' + orderId)
        },
        deleteOrder(orderId){
            console.log(this.orders.length)
            for(var i=0; i<this.orders.length; i++){
                console.log(this.orders[i].id, orderId)
                if(this.orders[i].id == orderId){
                    this.orders.splice(i,1)
                    break
                }
            }
            console.log(this.orders.length)
            axios.delete('http://localhost:1337/deleteBooking', {
                params:{id: orderId}
            }).then(

            ).catch(err => {
                console.log(err)
            })
        }
    },
    mounted(){
        this.getOrders()
    },
}
</script>

<style>
.payment-container{
    padding: 20px 40px;
    width: 50%;
    margin: auto;
}
.payment-content{
    padding: 20px 20px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.094);
    margin-top: 10px;
    margin: auto;
    border-radius: 10px;
}
.orders-wrapper{
    text-align: left;
    padding: 10px 14px;
    margin: 14px 6px;
    border-radius: 10px;
    background-color: rgba(220, 198, 0, 0.177);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.action{
    border-left: 2px solid rgba(0, 0, 0, 0.304);
    display: flex;
    align-items: center;
    height: 160px;
    padding-left: 10px;
}
#deleteButt{
    margin: 0;
}
</style>