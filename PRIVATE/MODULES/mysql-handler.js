const mysql = require('mysql2');
const { err } = require('./errors');
require('dotenv').config();

/*
    ! CONNECTION VAR NEEDS TO BE UPDATED !
*/

const connection = mysql.createConnection({ //
  host: process.env.MYSQL_HOST,             //  UPDATE
  user: process.env.MYSQL_USER,             //  UPDATE
  database: process.env.MYSQL_DATABASE,     //  UPDATE
  password: process.env.MYSQL_PASSWORD      
});

connection.once('connection', stream => {
    console.log('Db connected');
})

module.exports = {
    getTableContents: (cb, options) => {
        if (options && cb) {
            if (options.table && options.columns && options.conditions) {
                let columnString = "";
                let conditionString = "";
                let i = 0;

                if (options.columns.length > 0) {
                    options.columns.forEach(e => {
                        columnString = columnString + (i>0 ? "," : "") + "\`" + e + "\`";
                        i++;
                    })
                } else {
                    columnString = '*'
                }

                if (options.conditions.length !== 0) {
                    i = 0;
                    options.conditions.forEach(e => {
                        conditionString = conditionString + (i>0 ? " AND " : "") + "\`" + e[0] + "\`" + e[1] + "\"" + e[2] + "\"";
                        i++;
                    })
                } else {
                    conditionString = " 1"
                }

                //console.log(`SELECT ${columnString} FROM \`${options.table}\` WHERE ${conditionString}`);
                connection.execute(`SELECT ${columnString} FROM \`${options.table}\` WHERE ${conditionString}`, [], (error, results) => {
                    if (results)
                        cb({err: new err('200'), results: results});
                    else
                        cb({err: new err('404'), results: undefined});
                })
            } else {
                cb({err: new err('404'), results: undefined});
            }
        } else {
            cb({err: new err('404'), results: undefined});
        }
    },
    tableAddRow: (cb, options) => {
        if (options && cb) {
            if (options.table && options.data) {
                let varString = "";
                let valString = "";
                let i = 0;

                //console.log(options);

                options.data.forEach(e => { // TODO: FUCKKKKKKSKADOJKASOIDAIUDIKUA
                    varString = varString + (i>0 ? "," : "(") + "\`" + e[0] + "\`";

                    if (e[1] instanceof Array) {
                        e.forEach(entries => {
                            let y = 0;
                            entries.forEach(value => {
                                valString = valString + (y>0 ? "," : "(") + "\'" + value + "\'";
                                y++;
                            })
                            valString = valString + ")"
                        })
                    } else {
                        valString = valString + (i>0 ? "," : "(") + "\'" + e[1] + "\'";
                    }
                    i++;
                });

                varString = varString + ")"
                valString = valString + ")"

                console.log(`INSERT INTO \`${options.table}\` ${varString} VALUES ${valString}`);

                if (varString !== ")") {
                    connection.execute(`INSERT INTO \`${options.table}\` ${varString} VALUES ${valString}`, [], (error, results) => {
                        if (results)
                            cb({err: new err('200'), results: true});
                        else
                            cb({err: new err('400'), results: undefined});
                    });
                } else {
                    cb({err: new err('400'), results: undefined});
                }
            } else if (options.table && options.data && options.columns) {
                let varString = "";
                let valString = "";

                let i = 0;
                options.columns.forEach(e => {
                    varString = varString + (i>0 ? "," : "(") + "\`" + e + "\`";
                    i++;    
                });

                let y = 0;
                options.data.forEach(e => {
                    i = 0;
                    e.forEach(entry => {
                        valString = valString + (i>0 ? "," : "(") + "\'" + entry + "\'";
                        i++;
                    });

                    valString = valString + (y===options.data.length-1 ? ")" : "),");

                    y++;
                    i++;
                });
            } 
            else {
                cb({err: new err('404'), results: undefined});
            }
        } else {
            cb({err: new err('404'), results: undefined});
        }
    },
    modifyTableContents: (cb, options) => { 
        if(cb && options) {
            if (options.table && options.mod && options.conditions) {
                let conditionString = "";
                let modificationsString = "";
                let i = 0;

                options.mod.forEach(e => {
                    modificationsString = modificationsString + (i>0 ? "," : "") + "\`" + e[0] + "\`=" + "\'" + e[1] + "\'";
                    i++;
                })

                if (options.conditions.length !== 0) {
                    i = 0;
                    options.conditions.forEach(e => {
                        conditionString = conditionString + (i>0 ? " AND " : "") + "\`" + e[0] + "\`" + e[1] + "\"" + e[2] + "\"";
                        i++;
                    })
                } else {
                    conditionString = " 1"
                }
                //console.log(`UPDATE ${options.table} SET ${modificationsString} WHERE ${conditionString}`);
                connection.execute(`UPDATE ${options.table} SET ${modificationsString} WHERE ${conditionString}`, [], (error, results) => {
                    //console.log(results);
                    if (results)
                        cb({err: new err('200'), results: true});
                    else
                        cb({err: new err('404'), results: undefined});
                })
            } else {
                cb({err: new err('404'), results: undefined});
            }
        } else {
            cb({err: new err('404'), results: undefined});
        }
    },
    removeTableRow: (cb, options) => {
        if (cb && options) {
            if (options.table && options.conditions) {
                let conditionString = "";
                let i = 0;

                if (options.conditions.length !== 0) {
                    i = 0;
                    options.conditions.forEach(e => {
                        conditionString = conditionString + (i>0 ? " AND " : "") + "\`" + e[0] + "\`" + e[1] + "\"" + e[2] + "\"";
                        i++;
                    })
                } else {
                    conditionString = " 1"
                }

                connection.execute(`DELETE FROM ${options.table} WHERE ${conditionString}`, [], (error, results) => {
                    //console.log(results);
                    cb({err: new err('200'), results: true});
                })
            } else {
                cb({err: new err('405'), results: undefined});
            }
        } else {
            cb({err: new err('404'), results: undefined});
        } 
    }
}