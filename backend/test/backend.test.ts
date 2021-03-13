import { DeskbuddyServer } from "../src/server";
import supertest from "supertest";
import fs from 'fs';
import { IOffice } from "../src/interfaces/location.interface";

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

    it("POST /reservation", async done => {
        // todo
        done();
    });

    it("POST /reservation with malformed packet", async done => {
        // todo
        done();
    });

    it("POST /reservation duplicated", async done => {
        // todo
        done();
    });

    it("GET /reservation/upcoming", async done => {
        // todo
        done();
    });

    it("POST /reservation/upcoming/:date", async done => {
        // todo
        done();
    });

    it("GET /reservation/count/:officeID/:start/:end", async done => {
        // todo
        done();
    });

    it("DEL /reservation/:reservationID", async done => {
        // todo
        done();
    });
});

describe("Social feed endpoints tests", () => {
    it("dummy", () => {
        // todo
    });
});

describe("Mail manager endpoints tests", () => {
    it("dummy", () => {
        // todo
    });
});

describe("Miscellaneous tests", () => {
    it("GET /", async done => {
        const res = await request.get('/');
        expect(res.status).toBe(200);
        done();
    });
});

describe("Location endpoint tests", () => {
    it("POST /location", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(200);
        await locationDeleter(res);
        done();
    });

    it("POST /location with null city", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationMissingCity.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /location with missing address", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationMissingAddress.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(200);
        await locationDeleter(res);
        done();
    });

    it("POST /location with duplicate floor numbers", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationDuplicateFloors.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /location with duplicate desk IDs", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationDuplicateDesks.json");
        const res = await request.post('/location').send(body);
        expect(res.status).toBe(404);
        done();
    });

    // Maximum amount of offices for a single location (i.e. NV) is 100
    it("POST /location twice", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
        const resFirst = await request.post('/location').send(body);
        expect(resFirst.status).toBe(200);
        const resSecond = await request.post('/location').send(body);
        expect(resSecond.status).toBe(200);
        await locationDeleter(resFirst);
        await locationDeleter(resSecond);
        done();
    });
});

const locationDeleter = async (res: any) => {
    const result = JSON.parse(res.text).code;
    let cityCode;
    try {
        cityCode = result.split("-");
        await request.delete(`/location/${cityCode[0]}/${cityCode[1]}`);
    } catch (err) {
        throw new Error(err);
    }
}


const loadJSON = (path: string) => {
    const body: string = fs.readFileSync(path).toString();
    const jsonBody = JSON.parse(body);
    return jsonBody;
}