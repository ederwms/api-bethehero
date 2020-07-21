const db = require('./_access')

const create = async ({ name, size, key, url }) => {
  const insertFile = await db.query(
    'INSERT INTO files (`filename`, `filesize`, `filekey`, `fileurl`) VALUES (?, ?, ?, ?)',
    [name, size, key, url || `${process.env.APP_URL}/useruploads/${key}` ]
  )

  const { idfile, filename, filesize, filekey, fileurl } = await db.queryFirstOrDefault(
    'SELECT * FROM files WHERE idfile = ?',
    [insertFile.insertId]
  )

  return {
    id: idfile,
    name: filename,
    size: filesize,
    key: filekey,
    url: fileurl
  }
}

const deleteById = async (id) => {
  const fileExists = await db.queryFirstOrDefault(
    'SELECT * FROM files WHERE idfile = ?',
    [id]
  )

  if (!fileExists) {
    throw new Error('Este arquivo não existe.')
  } else {
    try {
      const deletedFile = await db.query(
        'DELETE FROM files WHERE idfile = ?',
        [id]
      )

      if (deletedFile.affectedRows > 0) {
        return { message: 'Arquivo exluído com sucesso.' }
      } else {
        throw new Error('Não foi possível excluir o arquivo.')
      }
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  create,
  deleteById
}