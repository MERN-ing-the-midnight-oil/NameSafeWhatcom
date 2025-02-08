const puppeteer = require("puppeteer");

async function scrapeRecords() {
	const browser = await puppeteer.launch({ headless: false }); // Set to true for production
	const page = await browser.newPage();

	// Step 1: Navigate to the Disclaimer Page
	await page.goto("https://recording.whatcomcounty.us/Disclaimer", {
		waitUntil: "networkidle2",
	});

	// Step 2: Click the "I Agree" Button
	console.log("✅ Clicking 'I Agree'...");
	await page.click('button[type="submit"].btn.btn-default');

	// Step 3: Wait for Navigation to Complete
	await page.waitForNavigation({ waitUntil: "networkidle2" });

	// Step 4: Enter Search Details
	const firstName = "Rhys";
	const lastName = "Smoker";
	console.log("⏳ Waiting for search form...");
	await page.waitForSelector("input#Criteria_Filter_LastName", {
		timeout: 10000,
	});
	await page.type("input#Criteria_Filter_LastName", lastName, { delay: 100 }); // Simulate human typing
	await page.type("input#Criteria_Filter_FirstName", firstName, { delay: 100 });

	// Step 5: Click "Search"
	console.log("🔍 Clicking 'Search'...");
	await Promise.all([
		page.click("button.btn.btn-primary"),
		page.waitForNavigation({ waitUntil: "networkidle2" }), // Wait for results to load
	]);

	// Step 6: Extract Document Details
	console.log("⏳ Extracting document details...");
	const documents = await page.evaluate(() => {
		// Map through all links and filter out those without an auditorFileNumber
		return Array.from(document.querySelectorAll("a.recording-link"))
			.map((link) => {
				const auditorFileNumber = link.innerText.trim(); // Extract the displayed Auditor File Number
				const href = link.getAttribute("href"); // Extract the relative URL
				return {
					auditorFileNumber,
					link: `https://recording.whatcomcounty.us${href}`, // Make the link absolute
				};
			})
			.filter((doc) => doc.auditorFileNumber !== ""); // Filter out empty Auditor File Numbers
	});

	console.log("📄 Found Documents:", documents);

	await browser.close();
	return documents;
}

// Run the scraper
scrapeRecords()
	.then((data) => console.log("✅ Scraper Completed:", data))
	.catch(console.error);
