const pool = require('../DB/db')

function createUser(login, password, role_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                sql = 'INSERT INTO prodcli.users (`login`, `password_hash`, `role_id`) VALUES (?, ?, ?)'
                connection.execute(sql, [login, password, role_id], (error, results) => {
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

function updateUserRole(user_id, new_role){
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                sql = 'UPDATE `prodcli`.`users` SET `role_id` = ? WHERE (`id` = ?);'
                connection.execute(sql, [new_role, user_id], (error, results) => {
                    if (error) {
                        reject(error)
                    } else {
                        if (results['affectedRows'] == 0) {
                            reject('Error: no rows updated;')
                        } else {
                            resolve(results)
                        }
                    }
                });
                connection.release();
            }
        })
    })
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
    getUser,
    updateUserRole
}