import puppeteer from "puppeteer";

async function generateImage() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	for (let weaponType of ["sword", "bow", "staff"]) {
		for (let i = 0; i < 120; ++i) {
			console.log(`Generating image for ${weaponType} #${i}...`);
			try {
				await page.goto(
					`http://localhost:5173/SlormBuilder/reaper/${weaponType}/${i}`
				);
				await page.setViewport({ width: 1920, height: 1080 });

				await page.evaluate(() => {
					document.querySelector("body").style.backgroundColor =
						"transparent";
				});

				await page.waitForSelector(".reaper");
				const element = await page.$(".reaper");
				await element.screenshot({
					path: `./reapers/${weaponType}_${i}.png`,
					omitBackground: true,
				});

				console.log(
					`  Saved image to ./reapers/${weaponType}_${i}.png`
				);
			} catch (e) {
				console.error(
					`Error generating image for ${weaponType} #${i}:`
				);
				console.error(e);
			}
		}
	}
	await browser.close();
}

generateImage();
