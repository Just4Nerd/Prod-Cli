const pool = require('../DB/db')

function createUser(login, password, role) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                sql = 'INSERT INTO prodcli.users (`login`, `password_hash`, `role`) VALUES (?, ?, ?)'
                connection.execute(sql, [login, password, role], (error, results) => {
                    if (error) {
                        console.error(error)
                        reject(error)
                    } else {
                        resolve(results)
                    }
                });
                connection.release();
            }
        })
    });
}

function getUser(login) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                // sql = 'INSERT INTO prodcli.users (`login`, `password_hash`, `role`) VALUES (?, ?, ?)'
                sql = 'SELECT * FROM prodcli.users WHERE login = ?;'
                connection.execute(sql, [login], (error, results) => {
                    if (error) {
                        console.error(error)
                        reject(error)
                    } else {
                        resolve(results)
                    }
                });
                connection.release();
            }
        })
    });
}

module.exports = {
    createUser,
    getUser
}