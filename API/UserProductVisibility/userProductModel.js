const pool = require('../DB/db')

function addUserProd(user_id, product_id, show_description, show_price, show_features ) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
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
                console.log("error")
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
                console.log("error")
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

function updateUserProd(user_prod_id, show_description, show_price, show_features, price) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                const fields = [];
                const values = [];
                if (show_description) {
                    fields.push('show_description = ?');
                    values.push(show_description);
                }

                if (show_price) {
                    fields.push('show_price = ?');
                    values.push(show_price);
                }

                
                if (show_features) {
                    fields.push('show_features = ?');
                    values.push(show_features);
                }

                // Ensure at least one field is updated
                if (fields.length === 0) {
                    reject('No fields provided for update');
                }

                const sql = `UPDATE prodcli.user_product_visibility SET ${fields.join(', ')} WHERE id = ?`;
                values.push(user_prod_id)
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

module.exports = {
    addUserProd,
    deleteUserProd,
    updateUserProd,
    getUserProdByUserId
}