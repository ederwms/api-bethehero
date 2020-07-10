const db = require('./_access')

const index = async () => {
  const incidents = await db.query(`SELECT * FROM incidents`)

  return incidents
}

const create = async ({ title, description, value, idong }) => {
  if (!title) {
    throw new Error('É obrigatório informar o título do caso.')
  } else if (!description) {
    throw new Error('É obrigatório informar a descrição do caso.')
  } else if (!value) {
    throw new Error('É obrigatório informar o valor do caso.')
  } else if (!idong) {
    throw new Error('Não foi possível adicionar o caso.')
  } else {
    const incident = await db.query(
      `INSERT INTO incidents (title, description, value, idong) VALUES (?, ?, ?, ?)`,
      [title, description, value, idong]
    )

    const createdIncident = await db.queryFirstOrDefault(
      `SELECT * FROM incidents AS i INNER JOIN ongs AS o ON i.idong = o.idong WHERE idincident = ?`,
      [incident.insertId]
    )

    return {
      idincident: createdIncident.idincident,
      title: createdIncident.title,
      description: createdIncident.description,
      ong: {
        idong: createdIncident.idong,
        name: createdIncident.name,
        email: createdIncident.email,
        whatsapp: createdIncident.whatsapp,
        city: createdIncident.city,
        uf: createdIncident.uf
      }
    }
  }
}

const updateById = async ({ id, title, description, value }) => {
  const incidentExists = await db.queryFirstOrDefault(
    `SELECT * FROM incidents WHERE idincident = ?`,
    [id]
  )

  if (incidentExists) {
    try {
      await db.query(
        `UPDATE incidents SET title = ?, description = ?, value = ? WHERE idincident = ?`,
        [title, description, value, id]
      )

      const updatedIncident = db.queryFirstOrDefault(
        `SELECT * FROM incidents WHERE idincident = ?`,
        [id]
      )

      return updatedIncident
    } catch (e) {
      throw e
    }
  } else {
    throw new Error('Nenhum caso encontrado com este ID.')
  }
}

const deleteById = async (id) => {
  const incidentExists = await db.queryFirstOrDefault(
    `SELECT * FROM incidents WHERE idincident = ?`,
    [id]
  )

  if (!incidentExists) {
    throw new Error('Nenhum caso encontrado com este ID.')
  } else {
    try {
      const deletedIncident = await db.query(
        `DELETE FROM incidents WHERE idincident = ?`,
        [id]
      )

      if (deletedIncident.affectedRows > 0) {
        return { message: 'Caso excluído com sucesso!' }
      } else {
        throw new Error('Não foi possível excluir o registro')
      }
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  index,
  create,
  updateById,
  deleteById
}