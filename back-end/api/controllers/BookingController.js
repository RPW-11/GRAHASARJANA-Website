/**
 * BookingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
    // create
    createBooking: async function(req, res){
      const params = req.allParams()
      if(!params) return res.badRequest({err: 'No data is sent'})

      // creating new booking
      try {
        const order = await Booking.create({
          namaPenghuni: params.namaPenghuni,
          noTelp: params.noTelp,
          noKerabat: params.noKerabat,
          dateMulai: params.dateMulai,
          durasi: params.durasi,
          dateSelesai : params.dateSelesai,
          totalHarga : params.totalHarga,
          ktp : params.ktp,
          metodePembayaran : params.metodePembayaran,
          idKamar : params.idKamar,
          userId : params.userId,
          status : params.status,
        }).fetch()
        return res.ok(order)
      } catch (error) {
        return res.serverError({err: error})
      }
      
    },
    
    // get all kamar
    getAllBooking: async function(req, res){
      const params = req.allParams()
      if(!params) return res.badRequest({err: 'No data is sent'})
      try {
          var certainBooking = await Booking.find({
              where: {userId : params.userId},
            });
            // no data
            if(!certainBooking.length) return res.serverError({err: 'No data found'})
            return res.ok({orders: certainBooking})
      }
      catch (error) {
          return res.badRequest({err: error})
      }
    },

    // get an order
    getCertainBooking: async function(req, res){
      const params = req.allParams()
      if(!params) return res.badRequest({err: 'No data is sent'})
      try {
          var certainBooking = await Booking.find({
              where: {id : params.id},
            });
            // no data
            if(!certainBooking.length) return res.serverError({err: 'No data found'})
            return res.ok({order: certainBooking})
      }
      catch (error) {
          return res.badRequest({err: error})
      }
    },

    //set booking status
    updateBookingStatus: async function(req, res){
      const params = req.allParams()
      if(!params) return res.badRequest({err: 'No data is sent'})
      try {
        await Booking.updateOne(
          { where : {
            id : params.id
            } 
          })
          .set({
            status : params.status
          })
          return res.ok()          
      }
      catch(error) {
        return res.badRequest({err: error})
      }
    },

    deleteBooking: async function(req, res) {
      const params = req.allParams()
      if(!params) return res.badRequest({err: 'No data is sent'})
      try {
        await Booking.destroyOne(
          { id : params.id })
          return res.ok(params)          
      }
      catch(error) {
        return res.badRequest({err: error})
      }
    },

    uploadFile: async function(req, res){
      req.file('file').upload({
        dirname: '../../ktp',
        maxByte: 100000
      }, function(err, file){
        if(err) console.log(err)
        res.json({status: 'File uploaded successfully', 'file':file})
      })
    },

    uploadBuktiBayar: async function(req, res){
      req.file('file').upload({
        dirname: '../../buktiBayar',
        maxByte: 100000
      }, function(err, file){
        if(err) console.log(err)
        res.json({status: 'File uploaded successfully', 'file':file})
      })
    },
    
  };
  
  