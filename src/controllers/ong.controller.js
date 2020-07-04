const ong = (req, res) => {
  res.json({
    teste: req.body.teste,
    message: 'Ong do controller'
  })
}

module.exports = {
  ong
}
