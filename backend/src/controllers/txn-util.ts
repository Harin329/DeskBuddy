import mysql from 'mysql';

export const begin = async (con: mysql.Connection) => {
    const result = await beginTxn(con);
    return result;
}

const beginTxn = (con: mysql.Connection) => {
    return new Promise((resolve, reject) => {
        con.beginTransaction(err => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

export const end = async (con: mysql.Connection) => {
    const result = await endTxn(con);
    return result;
}

const endTxn = (con: mysql.Connection) => {
    return new Promise((resolve, reject) => {
        con.commit(err => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

export const rollback = async (con: mysql.Connection) => {
    const result = await rollbackTxn(con);
    return result;
}

const rollbackTxn = (con: mysql.Connection) => {
    return new Promise((resolve, reject) => {
        con.rollback(err => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}