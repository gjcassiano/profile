const { datastore, IS_PROD } = require("./datastore");

const SESSION_KIND = "PokerSession";
const VOTE_KIND = "PokerVote";
const ROOM_KIND = "PokerRoom";

// ── In-memory store (used locally) ───────────────────────────────────────────
const memSessions = new Map(); // "roomId::name" → { name, lastSeen }
const memVotes = new Map(); // "roomId::name" → { name, vote, votedAt }
const memRooms = new Map(); // roomId → { status, resetAt }

// ── Helpers ───────────────────────────────────────────────────────────────────
function sessionKey(roomId, name) {
  return datastore.key([SESSION_KIND, `${roomId}::${name}`]);
}
function voteKey(roomId, name) {
  return datastore.key([VOTE_KIND, `${roomId}::${name}`]);
}
function roomKey(roomId) {
  return datastore.key([ROOM_KIND, roomId]);
}

// ── Room State ────────────────────────────────────────────────────────────────
async function getRoomState(roomId) {
  if (!IS_PROD) {
    return memRooms.get(roomId) || { status: 'voting', resetAt: 0 };
  }
  const [entity] = await datastore.get(roomKey(roomId));
  return entity ? { status: entity.status, resetAt: entity.resetAt } : { status: 'voting', resetAt: 0 };
}

async function setRoomState(roomId, status, resetAt = null) {
  const current = await getRoomState(roomId);
  const newResetAt = resetAt !== null ? resetAt : current.resetAt;

  if (!IS_PROD) {
    memRooms.set(roomId, { status, resetAt: newResetAt });
    return;
  }

  const entity = {
    key: roomKey(roomId),
    data: [
      { name: "status", value: status },
      { name: "resetAt", value: newResetAt }
    ],
  };
  await datastore.save(entity);
}

// ── Heartbeat (join / keep-alive) ─────────────────────────────────────────────
async function heartbeat(roomId, name, avatar) {
  const now = new Date();
  if (!IS_PROD) {
    memSessions.set(`${roomId}::${name}`, { name, avatar, lastSeen: now });
    return;
  }
  const entity = {
    key: sessionKey(roomId, name),
    data: [
      { name: "roomId", value: roomId },
      { name: "name", value: name },
      { name: "avatar", value: avatar || "" },
      { name: "lastSeen", value: now },
    ],
  };
  await datastore.save(entity);
}

// ── Get active users (seen in last 10s) ───────────────────────────────────────
async function getActiveUsers(roomId) {
  const cutoff = new Date(Date.now() - 10_000);

  if (!IS_PROD) {
    return [...memSessions.entries()]
      .filter(([k]) => k.startsWith(`${roomId}::`))
      .map(([, s]) => s)
      .filter((s) => s.lastSeen >= cutoff);
  }

  const query = datastore
    .createQuery(SESSION_KIND)
    .filter("roomId", "=", roomId)
    .filter("lastSeen", ">=", cutoff);

  const [entities] = await datastore.runQuery(query);
  return entities.map((e) => ({ name: e.name, avatar: e.avatar, lastSeen: e.lastSeen })).sort((a, b) => a.name.localeCompare(b.name));
}

// ── Save vote ─────────────────────────────────────────────────────────────────
async function saveVote(roomId, name, vote) {
  const now = new Date();
  if (!IS_PROD) {
    memVotes.set(`${roomId}::${name}`, { name, vote, votedAt: now });
    return;
  }
  const entity = {
    key: voteKey(roomId, name),
    data: [
      { name: "roomId", value: roomId },
      { name: "name", value: name },
      { name: "vote", value: vote },
      { name: "votedAt", value: now },
    ],
  };
  await datastore.save(entity);
}

// ── Get votes ─────────────────────────────────────────────────────────────────
async function getVotes(roomId) {
  if (!IS_PROD) {
    return [...memVotes.entries()]
      .filter(([k]) => k.startsWith(`${roomId}::`))
      .map(([, v]) => v);
  }

  const query = datastore
    .createQuery(VOTE_KIND)
    .filter("roomId", "=", roomId);

  const [entities] = await datastore.runQuery(query);
  return entities.map((e) => ({ name: e.name, vote: e.vote, votedAt: e.votedAt }));
}

// ── Reset votes ───────────────────────────────────────────────────────────────
async function resetVotes(roomId) {
  await setRoomState(roomId, 'voting', Date.now());

  if (!IS_PROD) {
    for (const k of [...memVotes.keys()]) {
      if (k.startsWith(`${roomId}::`)) memVotes.delete(k);
    }
    return;
  }

  const query = datastore
    .createQuery(VOTE_KIND)
    .filter("roomId", "=", roomId)
    .select("__key__");

  const [entities] = await datastore.runQuery(query);
  if (entities.length === 0) return;

  const keys = entities.map((e) => e[datastore.KEY]);
  await datastore.delete(keys);
}

module.exports = {
  getRoomState,
  setRoomState,
  heartbeat,
  getActiveUsers,
  saveVote,
  getVotes,
  resetVotes,
};

