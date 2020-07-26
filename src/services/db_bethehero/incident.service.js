const db = require('./_access')
const fileService = require('./file.service')

const index = async (idong) => {
  const incidents = await db.query(
    `SELECT * FROM incidents AS i LEFT JOIN files AS f ON i.idfile = f.idfile WHERE idong = '${idong}';`
  )

  var results = []

  for (let i = 0; i < incidents.length; i++) {
    const incidentFile = {
      idfile: incidents[i].idfile,
      filename: incidents[i].filename,
      filesize: incidents[i].filesize,
      filekey: incidents[i].filekey,
      fileurl: incidents[i].fileurl
    }

    results.push({
      idincident: incidents[i].idincident,
      title: incidents[i].title,
      description: incidents[i].description,
      value: incidents[i].value,
      idong: incidents[i].idong,
      file: incidents[i].idfile !== null ? incidentFile : null
    })
  }

  return results
}

const create = async ({ title, description, value, idong, idfile }) => {
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
      `INSERT INTO incidents (title, description, value, idong, idfile) VALUES (?, ?, ?, ?, ?)`,
      [title, description, value, idong, idfile]
    )

    const createdIncident = await db.queryFirstOrDefault(
      `
        SELECT
        *
        FROM
        incidents AS i
        INNER JOIN ongs AS o ON i.idong = o.idong
        ${idfile !== null ? 'INNER JOIN files AS f ON f.idfile = i.idfile' : ''}
        WHERE idincident = ?
      `,
      [incident.insertId]
    )

    var image = {
      id: createdIncident.idfile,
      name: createdIncident.filename,
      size: createdIncident.filesize,
      key: createdIncident.filekey,
      url: createdIncident.fileurl
    }

    return {
      idincident: createdIncident.idincident,
      title: createdIncident.title,
      description: createdIncident.description,
      file: idfile !== null ? image : null,
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
    `SELECT * FROM incidents i WHERE idincident = ?`,
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

      if (incidentExists.idfile) {
        await fileService.deleteById(incidentExists.idfile)
      }

      if (deletedIncident.affectedRows > 0) {
        return { message: 'Caso excluído com sucesso!' }
      } else {
        throw new Error('Não foi possível excluir o caso.')
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