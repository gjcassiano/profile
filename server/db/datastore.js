const { Datastore } = require("@google-cloud/datastore");

// GAE_ENV é definido automaticamente pelo App Engine em produção.
// Localmente não existe, então usamos in-memory.
const IS_PROD = !!process.env.GAE_ENV;

let datastore = null;

if (IS_PROD) {
  datastore = new Datastore();
  console.log("[db] Conectado ao Google Cloud Datastore");
} else {
  console.log("[db] Modo local — usando armazenamento in-memory");
}

module.exports = { datastore, IS_PROD };
