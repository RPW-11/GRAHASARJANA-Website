<template>
    <div style="display: flex;"><button class="white" @click="$router.go(-1)">Kembali</button></div>
    <div class="container">
            <div class="kiri">
                <div style="font-size: 32px; font-weight: bold; padding: 10px 0px;">FORM IDENTITAS</div>
                <div class="form-wrapper">
                    <div>
                        <label for="">
                            Nama Lengkap
                            <input type="text" required="true" placeholder="Masukkan Nama Lengkap..." v-model="form.nama_penghuni">
                        </label>
                        
                    </div>
                    <div>
                        <label for="">
                            Nomor Telepon
                            <input type="text" required="true" placeholder="Masukkan Nomor Telepon..." v-model="form.no_telp">
                        </label>
                        
                    </div>
                    <div>
                        <label for="">
                            Nomor Kerabat/Orang Tua
                            <input type="text" required="true" placeholder="Masukkan Nomor Kerabat/Orang Tua..." v-model="form.no_kerabat">
                        </label>
                        
                    </div>
                    <div>
                        <div>
                            <label for="">
                                Tanggal Masuk
                                <input type="date" required="true" v-model="form.date_mulai">
                            </label>
                            
                        </div>
                        <div style="margin-left: 10%;">
                            <label for="">
                                Durasi
                                <select name="durations" id="durations" v-model="form.durasi_kost" @change="updateHarga(form.durasi_kost)">
                                    <option value="1" >1 Bulan</option>
                                    <option value="12">1 Tahun</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div style="border: none;">
                        <label for="">
                            Unggah Foto KTP
                            <input type="file" required="true" id="file" style="border: none;" @change="onFileChange">
                        </label>
                    </div>
                    <div v-if="!isFilledOut" style="font-weight: 10px; color: red;">Make sure to fill out all required data</div>
                </div>
            </div>
            <div class="kanan">
                <div class="pembayaran">
                    <div style="font-size: 32px; font-weight: bold; padding: 10px 0px;">METODE PEMBAYARAN</div>
                    <div class="content">
                        <label for="">
                            Pilih Bank/Nomor Rekening
                            <select name="" id="" v-model="form.metode_pembayaran">
                                <option value="BNI/08222222">BNI/08222222</option>
                                <option value="BCA/08212429">BCA/08212429</option>
                            </select>
                            <div style="display: flex;">
                                <img src="../assets/bca.png" alt="">
                                <img src="../assets/bni.png" alt="">
                            </div>
                        </label>
                    </div>
                </div>
                <div class="detail-booking">
                    <div style="font-size: 32px; font-weight: bold; padding: 10px 0px;">DETAIL BOOKING</div>
                    <div style="display: flex;">
                        <div class="gambar">
                            <img src="../assets/kamar.jpg" alt="" id="kamar-pic">
                        </div>
                        <div style="text-align: left; padding: 10px 20px;">
                            Kamar {{kamar.nomor}}
                            <div style="font-size: 30px;">Rp {{harga}}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <button class="green" style="width: 90%; margin-top: 30px;" @click="sendForm()">BOOKING SEKARANG</button>
                </div>
            </div>
    </div>
</template>

<script>

import axios from 'axios';

export default{
    data(){
        return{
            kamar: {
                no_kamar:'4'
            },
            harga:'',
            total_harga:'',
            form: {
                nama_penghuni: '',
                no_telp: '',
                no_kerabat: '',
                date_mulai: '',
                durasi_kost: '1',
                foto_ktp: '',
                metode_pembayaran:'BNI/08222222',
                kamar_id:''
            },
            isFilledOut: true,
        }
    },
    methods:{
       async getRoom(){
            try {
                const res = await axios.get('http://localhost:1337/getKamar',{
                    params: {id: this.$route.params.roomId}
                })
                console.log(res.data)
                this.kamar = res.data
                this.harga = this.toPrice(this.kamar.harga)
                this.total_harga = this.kamar.harga
            } catch (err) {
                console.log('error')
            }
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
        onFileChange(e) {
            this.form.foto_ktp = e.target.files[0];
        },
        async sendForm(){
            try {
                if(this.formValidation()){
                    // attempt 1
                    var formData = new FormData();
                    var imagefile = document.querySelector('#file')
                    formData.append("file", imagefile.files[0])
                    console.log(formData)
                    await axios.post('http://localhost:1337/uploadFile', formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    }).then(res =>{
                        console.log(res.data)
                    }).catch(err => {
                        console.log(err)
                    })

                    // sending identity form
                    await axios.post('http://localhost:1337/createBooking',{
                        namaPenghuni: this.form.nama_penghuni,
                        noTelp: this.form.no_telp,
                        noKerabat: this.form.no_kerabat,
                        dateMulai: this.form.date_mulai,
                        durasi: this.form.durasi_kost,
                        dateSelesai : this.form.date_mulai,
                        totalHarga : this.total_harga,
                        ktp : 'params.ktp',
                        metodePembayaran : this.form.metode_pembayaran,
                        idKamar : this.$route.params.roomId,
                        userId : JSON.parse(localStorage.getItem('user')).id,
                        status : 'waiting_payment',
                    }).then(res =>{
                        console.log(res.data)
                        const order = res.data
                        this.$router.push('/payment/' + order.id)
                    }).catch(err => {
                        console.log(err)
                    })
                }
        
            } catch (error) {
                console.log(error)
            }
        },
        updateHarga(val){
            this.harga =  this.kamar.harga * val
            this.total_harga = this.harga
            this.harga = this.toPrice(this.harga)
        },
        formValidation(){
            var keys = Object.keys(this.form)
            for(var i=0; i<keys.length - 2; i++){
                if(this.form[keys[i]].length == 0){
                    this.isFilledOut = false
                    return false
                }
            }
            this.isFilledOut = true
            return true
        }
    },
    mounted(){
        this.getRoom()
    }
}

</script>

<style scoped>
.container{
    padding: 30px 30px;
    display: flex;
}
.kiri{
    width: 40%;
    padding: 20px 20px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.094);

}
.form-wrapper{
    font-weight: 550;
}
.form-wrapper > div{
    display: flex;
    padding:10px 10px;
}
.form-wrapper > div > div{
    display: flex;
}
.form-wrapper input{
    margin: 10px 0px;
}
.form-wrapper label{
    text-align: left;
    width: 100%;
}
select{
    display: block;
    margin: 10px 0px;
    padding: 5px 0px;
    padding-left: 10px;
    outline: none;
    border: 1px solid #aaa;
    border-radius: 5px;
    height: 38px;
    width: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

.kanan{
    font-weight: 550;
    width: 50%;
    margin-left: 50px;
}
.pembayaran{
    padding: 20px 20px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.094);
}
.content{
    text-align: left;
}
.detail-booking{
    margin-top: 40px;
    padding: 20px 20px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.094);
}

.gambar{
    width: 100px;
    height: 100px;
}
img{
    margin-left: 10px;
    width: 50px;
    height: auto;
}
#kamar-pic{
    margin: 0;
    width: 100%;
    height: 100%;
}

</style>