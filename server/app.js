const express = require("express");
const app = express();
const path = require("path");
const { getNote, saveNote } = require("./db/noteModel");
const { getRoomState, setRoomState, heartbeat, getActiveUsers, saveVote, getVotes, resetVotes } = require("./db/pokerModel");

app.set('trust proxy', true);
app.use(express.json());

// ── API Notes ─────────────────────────────────────────────────────────────────

// GET /api/note/:key → retorna a note
app.get("/api/note/:key", async (req, res) => {
  try {
    const note = await getNote(req.params.key);
    res.json({ key: req.params.key, value: note?.value ?? "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar note" });
  }
});

// POST /api/note/:key → salva/atualiza a note
app.post("/api/note/:key", async (req, res) => {
  try {
    const note = await saveNote(req.params.key, req.body.value ?? "");
    res.json({ ok: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar note" });
  }
});

// ── API Poker ─────────────────────────────────────────────────────────────────

// GET /api/poker/:room/state → estado da sala
app.get("/api/poker/:room/state", async (req, res) => {
  try {
    const state = await getRoomState(req.params.room);
    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar estado da sala" });
  }
});

// POST /api/poker/:room/state → atualiza estado (ex: revelar)
app.post("/api/poker/:room/state", async (req, res) => {
  try {
    const { status } = req.body;
    await setRoomState(req.params.room, status);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar estado da sala" });
  }
});

// POST /api/poker/:room/join → heartbeat/join
app.post("/api/poker/:room/join", async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    await heartbeat(req.params.room, name, avatar);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao entrar na sala" });
  }
});

// GET /api/poker/:room/users → lista usuários ativos
app.get("/api/poker/:room/users", async (req, res) => {
  try {
    const users = await getActiveUsers(req.params.room);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// POST /api/poker/:room/vote → salva voto
app.post("/api/poker/:room/vote", async (req, res) => {
  try {
    const { name, vote } = req.body;
    if (!name || vote == null) return res.status(400).json({ error: "name and vote required" });
    await saveVote(req.params.room, name, vote);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar voto" });
  }
});

// GET /api/poker/:room/votes → lista votos
app.get("/api/poker/:room/votes", async (req, res) => {
  try {
    const votes = await getVotes(req.params.room);
    res.json({ votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar votos" });
  }
});

// DELETE /api/poker/:room/votes → reseta votos
app.delete("/api/poker/:room/votes", async (req, res) => {
  try {
    await resetVotes(req.params.room);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao resetar votos" });
  }
});

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "/build")));

// Serve notes SPA para /note e /note/*
app.get(["/note", "/note/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "/build/note/index.html"));
});

// Serve poker SPA para /poker e /poker/*
app.get(["/poker", "/poker/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "/build/poker/index.html"));
});

app.get("/negao", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/sof/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

// ── Listen ────────────────────────────────────────────────────────────────────
const server = app.listen(8080, () => {
  const port = server.address().port;
  console.log(`listening at port http://localhost:${port}`);
});