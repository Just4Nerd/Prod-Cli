const pool = require('../DB/db')

//an sql call to create a user-product visibility entry
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

//an sql call to delete a user-product visibility entry by ID
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

//an sql call to get all user-product visibility entries with a specific user ID
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

//an sql call to get all user-product visibility entries with a specific product ID
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

//an sql call to get all user-product visibility entry with a specific user and product IDs
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

//an sql call to update a specific user-product visibility entry
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