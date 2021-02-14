import http from "http"
import { DeskbuddyServer } from "../src/server";
let server: DeskbuddyServer;

beforeAll(done => {
    server = new DeskbuddyServer(3000);
    server.start().then(() => {
        done();
    });
});

afterAll(done => {
    server.stop().then(() => {
        done();
    });
});

describe("Reservation endpoints tests", () => {
    it("GET /reservation", async done => {
        done()
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
    it("dummy", () => {
        expect(5 + 5).toBe(10);
    });
});


