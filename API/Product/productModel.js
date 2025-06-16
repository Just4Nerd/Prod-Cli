const pool = require('../DB/db')

//an sql call to get all products
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

//an sql call to get a specific product by ID
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

//an sql call to get all feature of a product by product ID
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

//an sql call to get all features
function getAllFeatures() {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'SELECT * FROM prodcli.product_features;'
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

//an sql call to create a new product
function createProduct(name, description, category_id, price) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
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

//an sql call to update a product by ID
function updateProduct(product_id, name, description, category_id, price) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {

                // Only fields that need to be updated are passed. 
                // Therefore check which are passed and add them to the sql string
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

//an sql call to delete a specific product by ID
function deleteProduct(product_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                // Delete all features that contain sais product
                connection.execute('DELETE FROM prodcli.product_features WHERE product_id = ?', [product_id], (error) => {
                    if (error) {
                        connection.release();
                        return reject(error);
                    }
                    // Delete all user-product-visiblity entries that contain said product
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

//an sql call to add features with specific product ID
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

//an sql call to delete features
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
    getFeatures,
    getAllFeatures
}