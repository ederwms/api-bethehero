const db = require('./_access')
const crypto = require('crypto')

const index = async () => {
  const ongs = await db.query('SELECT * FROM ongs')

  return ongs
}

const find = async (id) => {
  const ong = await db.queryFirstOrDefault(
    `SELECT * FROM ongs WHERE idong = ?`,
    [id]
  )

  if (!ong) {
    throw new Error('Nenhuma ONG encontrada com este ID.')
  } else {
    return ong
  }
}

const findForAuthentication = async (id) => {
  const ong = await db.queryFirstOrDefault(
    `SELECT * FROM ongs WHERE idong = ?`,
    [id]
  )

  if (!ong) {
    throw new Error('Nenhuma ONG encontrada com este ID.')
  } else {
    return ong
  }
}

const create = async ({ name, email, whatsapp, city, uf }) => {
  const ongAlreadyExists = await db.query(
    `SELECT * FROM ongs WHERE name = ?`,
    [ name ]
  )

  if (ongAlreadyExists.length > 0) {
    throw new Error('Já existe uma ONG cadastrada com este nome.')
  } else {
    const id = crypto.randomBytes(4).toString('HEX')

    await db.query(
      `INSERT INTO ongs (idong, name, email, whatsapp, city, uf) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, email, whatsapp, city, uf]
    )

    const newOng = await db.queryFirstOrDefault(
      `SELECT * FROM ongs WHERE name = ?`,
      [ name ]
    )

    return newOng
  }
}

module.exports = {
  index,
  find,
  findForAuthentication,
  create
}
