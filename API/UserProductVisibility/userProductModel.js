const pool = require('../DB/db')

function addUserProd(user_id, product_id, show_description, show_price, show_features ) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'INSERT INTO prodcli.user_product_visibility (`user_id`, `product_id`, `show_description`, `show_price`, `show_features`) VALUES (?, ?, ?, ?, ?)'
                connection.execute(sql, [user_id, product_id, show_description, show_price, show_features], (error, results) => {
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

function deleteUserProd(user_prod_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'DELETE FROM prodcli.user_product_visibility WHERE id = ?'
                connection.execute(sql, [user_prod_id], (error, results) => {
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

function getUserProdByUserId(user_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'Select * FROM prodcli.user_product_visibility WHERE user_id = ?'
                connection.execute(sql, [user_id], (error, results) => {
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

function getUserProdByProdId(prod_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'Select * FROM prodcli.user_product_visibility WHERE product_id = ?'
                connection.execute(sql, [prod_id], (error, results) => {
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

function getUserProd(user_id, prod_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'Select * FROM prodcli.user_product_visibility WHERE user_id = ? AND product_id = ?'
                connection.execute(sql, [user_id, prod_id], (error, results) => {
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

function updateUserProd(user_prod_id, show_description, show_price, show_features) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {

                const sql = `UPDATE prodcli.user_product_visibility SET show_description = ?, show_price = ?, show_features = ? WHERE id = ?`;
                connection.execute(sql, [show_description, show_price, show_features, user_prod_id], (error, results) => {
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

module.exports = {
    addUserProd,
    deleteUserProd,
    updateUserProd,
    getUserProdByUserId,
    getUserProdByProdId,
    getUserProd
}