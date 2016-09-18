const models = require("../models");

module.exports.getArtistInformation = (request, reply) => {
  const mkid = request.params.mkid

  models.artist.findOne({
    where: {
      mkid: mkid
    }
  }).then((artist) => {

    let information = {
      name : artist.name,
      type : artist.type,
      summary : artist.summary
    }
    console.log(information)

  })

};
