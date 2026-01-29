"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRoutes = noteRoutes;
const notes_controller_1 = require("./notes.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const controller = new notes_controller_1.NoteController();
async function noteRoutes(app) {
    app.addHook("preHandler", auth_middleware_1.authMiddleware);
    app.post("/notes", controller.create);
    app.get("/notes", (request, reply) => controller.listAll(request, reply));
    app.get("/leads/:id/notes", (request, reply) => controller.listByLead(request, reply));
    app.get("/clients/:id/notes", (request, reply) => controller.listByClient(request, reply));
    app.delete("/notes/:id", controller.delete);
}
