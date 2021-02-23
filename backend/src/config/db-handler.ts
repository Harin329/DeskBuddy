import mysql from 'mysql';
import dotenv from 'dotenv';

export default class DBCon {
    private static con: mysql.Connection;
    // tslint:disable-next-line:no-empty
    constructor() { }

    public static async createCon(): Promise<boolean> {
        dotenv.config();
        return new Promise((fullfill, reject) => {
            this.con = mysql.createConnection({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            });
            return this.con.connect(err => {
                if (err) {
                    reject(err);
                } else {
                    fullfill(true);
                }
            });
        });
    }

    public static getCon(): mysql.Connection {
        if (!this.con) {
            this.createCon().then(() => this.con);
        }
        return this.con;
    }

    public static closeDB(): Promise<boolean> {
        return new Promise((fulfill, reject) => {
            this.con?.end(err => {
                if (err) {
                    reject(err);
                } else {
                    fulfill(true);
                }
            });
        });
    }
}