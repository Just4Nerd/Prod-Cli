const pool = require('../DB/db')

//an sql call to get all categories
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

//an sql call to update category name and layout_type by id
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

//an sql call to create a new category with provided name and layout_type
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