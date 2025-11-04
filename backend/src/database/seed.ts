import * as fs from "node:fs";
import * as path from "node:path";
import { Pool } from "pg";

interface SeedItem {
	title: string;
	year: number | null;
	type: "film" | "television" | "video_game";
	role: string;
}

async function seedDatabase() {
	const pool = new Pool({
		host: process.env.POSTGRES_HOST || "localhost",
		port: Number(process.env.POSTGRES_PORT || "5432"),
		database: process.env.POSTGRES_DB || "autocomplete_db",
		user: process.env.POSTGRES_USER || "postgres",
		password: process.env.POSTGRES_PASSWORD || "postgres",
	});

	try {
		// Test connection
		await pool.query("SELECT NOW()");
		console.log("✅ Connected to database");

		// Read seed.json
		const seedFilePath = path.join(__dirname, "./seed.json");
		const seedData: SeedItem[] = JSON.parse(
			fs.readFileSync(seedFilePath, "utf-8"),
		);

		console.log(`📦 Found ${seedData.length} items to seed...`);

		// Clear existing data
		await pool.query("TRUNCATE TABLE search_items RESTART IDENTITY CASCADE");
		console.log("🗑️  Cleared existing data");

		// Insert all items
		let inserted = 0;
		for (const item of seedData) {
			const result = await pool.query(
				`INSERT INTO search_items (title, year, type, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
				[item.title, item.year, item.type, item.role || null],
			);
			if (result.rowCount && result.rowCount > 0) {
				inserted++;
			}
		}

		console.log(`\n✅ Successfully seeded ${inserted} items!`);

		// Verify
		const countResult = await pool.query("SELECT COUNT(*) FROM search_items");
		console.log(`📊 Total items in database: ${countResult.rows[0].count}`);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

seedDatabase();
