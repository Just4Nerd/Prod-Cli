const pool = require('../DB/db')

function getAllProducts() {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'SELECT products.id, products.name AS product_name, categories.id AS category_id, categories.name AS category_name, description, price, categories.layout_type FROM prodcli.products INNER JOIN prodcli.categories ON prodcli.categories.id = prodcli.products.category_id;'
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

function getProduct(product_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'SELECT products.id, products.name AS product_name, categories.id AS category_id, categories.name AS category_name, description, price, categories.layout_type FROM prodcli.products INNER JOIN prodcli.categories ON prodcli.categories.id = prodcli.products.category_id WHERE products.id = ?;'
                connection.execute(sql, [product_id], (error, results) => {
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

function getFeatures(product_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'SELECT * FROM prodcli.product_features WHERE product_id = ?;'
                connection.execute(sql, [product_id], (error, results) => {
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


function createProduct(name, description, category_id, price) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                sql = 'INSERT INTO prodcli.products (`name`, `description`, `category_id`, `price`) VALUES (?, ?, ?, ?)'
                connection.execute(sql, [name, description, category_id, price], (error, results) => {
                    if (error) {
                        console.error(error)
                        if (error.sqlMessage.includes('products.name_UNIQUE')) {
                            reject('Product Name already exists')
                        }
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

function updateProduct(product_id, name, description, category_id, price) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                const fields = [];
                const values = [];
                if (name) {
                    fields.push('name = ?');
                    values.push(name);
                }

                if (description) {
                    fields.push('description = ?');
                    values.push(description);
                }

                
                if (category_id) {
                    fields.push('category_id = ?');
                    values.push(category_id);
                }

                if (price) {
                    fields.push('price = ?');
                    values.push(price);
                }

                // Ensure at least one field is updated
                if (fields.length === 0) {
                    reject('No fields provided for update');
                }

                const sql = `UPDATE prodcli.products SET ${fields.join(', ')} WHERE id = ?`;
                values.push(product_id)
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

function deleteProduct(product_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                console.log("error")
                reject(err)
            } else {
                connection.execute('DELETE FROM prodcli.product_features WHERE product_id = ?', [product_id], (error) => {
                    if (error) {
                        connection.release();
                        return reject(error);
                    }
                    connection.execute('DELETE FROM prodcli.user_product_visibility WHERE product_id = ?', [product_id], (error) => {
                        if (error) {
                            connection.release();
                            return reject(error);
                        }

                        connection.execute('DELETE FROM prodcli.products WHERE id = ?', [product_id], (error, results) => {
                            connection.release();
                            if (error) {
                                return reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    });
                });
            }
        })
    });
}

function addFeature(product_id, features) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                features.forEach(feature => {
                    sql = 'INSERT INTO prodcli.product_features (`content`, `product_id`) VALUES (?, ?);'
                    connection.execute(sql, [feature, product_id], (error, results) => {
                        if (error) {
                            console.error(error)
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    });
                })
                connection.release();
            }
        })
    });
}

function deleteFeatures(features) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                features.forEach(feature_id => {
                    sql = 'DELETE FROM prodcli.product_features WHERE id = ?'
                    connection.execute(sql, [feature_id], (error, results) => {
                        if (error) {
                            console.error(error)
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    });
                })
                connection.release();
            }
        })
    });
}

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addFeature,
    deleteFeatures,
    getProduct,
    getFeatures
}