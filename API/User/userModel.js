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

function updateUser(user_id, login, password){
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                const fields = [];
                const values = [];
                if (login) {
                    fields.push('login = ?');
                    values.push(login);
                }

                if (password) {
                    fields.push('password_hash = ?');
                    values.push(password);
                }

                // Ensure at least one field is updated
                if (fields.length === 0) {
                    reject('No fields provided for update');
                }

                const sql = `UPDATE prodcli.users SET ${fields.join(', ')} WHERE id = ?`;
                values.push(user_id)
                connection.execute(sql, values, (error, results) => {
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
                reject(err)
            } else {
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

function getUsers() {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'SELECT * FROM prodcli.users;'
                connection.execute(sql, [], (error, results) => {
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

function deleteUser(user_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                connection.execute('DELETE FROM prodcli.user_product_visibility WHERE user_id = ?', [user_id], (error) => {
                    if (error) {
                        connection.release();
                        return reject(error);
                    }
                    connection.execute('DELETE FROM prodcli.users WHERE id = ?', [user_id], (error, results) => {
                        connection.release();
                        if (error) {
                            return reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                });
            }
        })
    });
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    getUsers,
    deleteUser
}