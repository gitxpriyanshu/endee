const { Endee, Precision } = require("endee");

const client = new Endee();

async function initDB() {
    try {
        await client.createIndex({
            name: "notes",
            dimension: 384,
            spaceType: "cosine",
            precision: Precision.INT8
        });
        console.log("Endee index 'notes' created");
    } catch (err) {
        if (err.message && err.message.includes("already exists")) {
            console.log("Endee index 'notes' already exists, continuing.");
        } else {
            console.error("Error creating index:", err);
        }
    }
    return await client.getIndex("notes");
}

module.exports = { initDB };
