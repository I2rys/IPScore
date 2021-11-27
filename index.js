//Dependencies
const Puppeteer = require("puppeteer")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <ip>")
    process.exit()
}

console.log("Scanning the IP, please wait.")
void async function(){
    let browser = await Puppeteer.launch({ headless: false, args: ["--disable-setuid-sandbox", "--no-sandbox"] })
    let page = await browser.newPage()

    await page.goto("https://www.ip-score.com/", { waitUntil: "domcontentloaded" })
    await page.type("#custom-ip", Self_Args[0])
    await Promise.all([
        page.click("#app > div > div.navbar > div > div > div > div.check-form > div"),
        page.waitForNavigation({ waitUntil: "networkidle0" })
    ])
    
    let ip_score = await page.$eval("#score", element => element.textContent )
    let ip_location = await page.$eval("div > div.content > div > div:nth-of-type(1) > div:nth-of-type(1) > div > div > div.head-block__subtext", element => element.textContent )
    let ip_useragent = await page.$eval("div:nth-of-type(10) > div.card__value", element => element.textContent )
    let ip_isp = await page.$eval("div:nth-of-type(7) > div.card__value", element => element.textContent )
    let blacklist_spamhaus = await page.$eval("#spam > div > div > div:nth-of-type(1) > div:nth-of-type(2)", element => element.textContent )
    let blacklist_sorbsnet = await page.$eval("#spam > div > div > div:nth-of-type(2) > div:nth-of-type(2)", element => element.textContent )
    let blacklist_spamcop = await page.$eval("#spam > div > div > div:nth-of-type(3) > div:nth-of-type(2)", element => element.textContent )
    let blacklist_southkoreannbl = await page.$eval("#spam > div > div > div:nth-of-type(4) > div:nth-of-type(2)", element => element.textContent )
    let blacklist_barracuda_bbl = await page.$eval("#spam > div > div > div:nth-of-type(5) > div:nth-of-type(2)", element => element.textContent )

    console.log(`IP: ${Self_Args[0]}
IP score: ${ip_score}
IP location: ${ip_location}
IP useragent: ${ip_useragent}
IP isp: ${ip_isp}

Blacklist Spamhaus: ${blacklist_spamhaus}
Blacklist Sorbs.net: ${blacklist_sorbsnet}
Blacklist Spamcop: ${blacklist_spamcop}
Blacklist SouthKoreanNBL: ${blacklist_southkoreannbl}
Blacklist Barracuda BBL: ${blacklist_barracuda_bbl}`)

    await browser.close()
}()
