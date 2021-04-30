import puppeteer from "puppeteer";

async function generateImage() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	
	for(let weaponType of ["sword", "bow", "staff"]) {
		for(let i = 0; i < 120; ++i) {
			try {
				await page.goto(`http://localhost:8080/reaper/${weaponType}/${i}`);
				await page.setViewport({width: 1920, height: 1080});
				
				
				await page.evaluate(() => {
					document.querySelector('body').style.backgroundColor = "transparent";
					let header = document.querySelector('.header');
					header.parentNode.removeChild(header);
				});
				
				await page.waitForSelector('.reaper');
				const element = await page.$('.reaper');        // declare a variable with an ElementHandle
				await element.screenshot({path: `./reapers/${weaponType}_${i}.png`, omitBackground: true	}); // take screenshot element in puppeteer
				
				console.log(`Saved image to ./reapers/${weaponType}_${i}.png`);
				
				//await page.screenshot({path : `./debug.png`});
			} catch(e) {
				console.error(e);
			}
		}
	}
	await browser.close();
}

generateImage();