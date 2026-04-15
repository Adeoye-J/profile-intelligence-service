import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("db.json")

const db = new Low(adapter, {
    profiles: []
})

await db.read()

db.data ||= {profiles: []}

export default db;