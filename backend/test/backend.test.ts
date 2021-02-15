import { DeskbuddyServer } from "../src/server";
import supertest from "supertest";

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
    it("dummy", () => {
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
});


