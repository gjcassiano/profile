const { datastore, IS_PROD } = require("./datastore");

const KIND = "Note";

// ── In-memory store (usado localmente) ───────────────────────────────────────
const memStore = new Map();

// ── Helpers Datastore ─────────────────────────────────────────────────────────
function noteKey(key) {
  return datastore.key([KIND, key]);
}

// ── getNote ───────────────────────────────────────────────────────────────────
async function getNote(key) {
  if (!IS_PROD) {
    return memStore.get(key) ?? null;
  }

  const [entity] = await datastore.get(noteKey(key));
  if (!entity) return null;

  return {
    key,
    value: entity.value,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

// ── saveNote ──────────────────────────────────────────────────────────────────
async function saveNote(key, value) {
  const now = new Date();

  if (!IS_PROD) {
    const existing = memStore.get(key);
    const note = {
      key,
      value,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    memStore.set(key, note);
    return note;
  }

  // Verifica se já existe para preservar o createdAt
  const [existing] = await datastore.get(noteKey(key));
  const createdAt = existing?.createdAt ?? now;

  const entity = {
    key: noteKey(key),
    data: [
      { name: "value",     value,     excludeFromIndexes: true },
      { name: "createdAt", value: createdAt },
      { name: "updatedAt", value: now },
    ],
  };

  await datastore.save(entity);

  return { key, value, createdAt, updatedAt: now };
}

module.exports = { getNote, saveNote };
