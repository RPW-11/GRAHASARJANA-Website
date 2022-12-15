/**
 * KamarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // create
  createKamar: async function(req, res){
    const params = req.allParams()
    if(!params) return res.badRequest({err: 'No data is sent'})

    // creating new user
    await Kamar.create({
        nomor: params.nomor,
        fasilitas: params.fasilitas,
        harga: params.harga,
    }, (err, result) => {
        if(err) return res.serverError(err)
        return res.ok(result)
    })
  },
  
  // get all kamar
  getAllKamar: async function(req, res){
    const allKamar = await Kamar.find()
    if(!allKamar) return res.badRequest({err: 'No room found'})
    return res.ok(allKamar)
  },

  // get specific kamar
  getKamar: async function(req, res){
    const params = req.allParams()
    if(!params) return res.badRequest({err: 'No data is sent'})
    
    // getting kamar by id
    const kamar = await Kamar.findOne({id: params.id})
    if(!kamar) return res.serverError({err: "Kamar doesn't exist"})
    return res.ok(kamar)
  }

};

