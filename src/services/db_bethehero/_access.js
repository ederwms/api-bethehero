const mysql = require('mysql')

const beTheHeroPool = mysql.createPool({
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT
})

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    beTheHeroPool.getConnection((error, connection) => {
      connection.query(
        sql,
        params,
        (error, results, fields) => {
          connection.release()

          if (error) reject(error)

          resolve(results)
        }
      )
    })
  })
}

const queryFirstOrDefault = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    beTheHeroPool.getConnection((error, connection) => {
      connection.query(
        sql,
        params,
        (error, results, fields) => {
          connection.release()

          if (error) {
            reject(error)
          } else if (results.length > 0) {
            resolve(results[0])
          } else {
            resolve(null)
          }
        }
      )
    })
  })
}

module.exports = {
  beTheHeroPool,
  queryFirstOrDefault,
  query
}
