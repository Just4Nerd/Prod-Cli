const pool = require('../DB/db')

function getCategories() {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'SELECT * FROM prodcli.categories;'
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

function updateCategory(id, name, layout_type) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'UPDATE prodcli.categories SET name = ?, layout_type = ? WHERE id = ?'
                connection.execute(sql, [name, layout_type, id], (error, results) => {
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

function createCategory(name, layout_type) {
    return new Promise((resolve, reject) => {
        pool.getConnection( function(err, connection) {
            if (err) {
                reject(err)
            } else {
                sql = 'INSERT prodcli.categories (name, layout_type) VALUES (?,?)'
                connection.execute(sql, [name, layout_type], (error, results) => {
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
    getCategories,
    updateCategory,
    createCategory
}