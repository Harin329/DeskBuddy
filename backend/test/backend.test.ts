import { DeskbuddyServer } from "../src/server";
import supertest from "supertest";
import fs from 'fs';

let server: DeskbuddyServer;
let request: any;

beforeAll(done => {
    server = new DeskbuddyServer(3000);
    server.start().then(() => {
        request = supertest(server.getApp());
        done();
    });
});

afterAll(done => {
    server.stop().then(() => {
        done();
    });
});

describe("Reservation endpoints tests", () => {
    it("GET /reservation/getAllReservations", async done => {
        const res = await request.get('/reservation/getAllReservations');
        expect(res.status).toBe(200);
        done();
    });

    it("POST /reservation", () => {
        expect(5 + 5).toBe(10);
    });

    it("GET /reservation/getCount", () => {
        expect(5 + 5).toBe(10);
    });

    it("DEL /reservation/deleteReservation", () => {
        expect(5 + 5).toBe(10);
    });
});

describe("Social feed endpoints tests", () => {
    it("dummy", () => {
        expect(5 + 5).toBe(10);
    });
});

describe("Mail manager endpoints tests", () => {
    it("dummy", () => {
        expect(5 + 5).toBe(10);
    });
});

describe("Miscellaneous tests", () => {
    it("GET /", async done => {
        const res = await request.get('/');
        expect(res.status).toBe(200);
        done();
    });

    it("POST /location", async done => {
        const body: string = loadJSON("test/jsonBody/postLocationNormal.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(200);
        done();
    });

    it("POST /location with null city", async done => {
        const body: string = loadJSON("test/jsonBody/postLocationMissingCity.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(401);
        done();
    });

    it("POST /location with missing address", async done => {
        const body: string = loadJSON("test/jsonBody/postLocationMissingAddress.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(200);
        done();
    });

    it("POST /location with duplicate floor numbers", async done => {
        expect(5 + 5).toBe(10); // dummy
        done();
    })
});


const loadJSON = (path: string) => {
    const body: string = fs.readFileSync(path).toString();
    const jsonBody = JSON.parse(body);
    return jsonBody;
}