const puppeteer = require('puppeteer');

const login = async (page) => {
  await page.goto('https://www.4628.jp/?module=top&rd=1')
  await page.type('input[name="y_companycd"]', 'livesense')
  await page.type('input[name="y_logincd"]', '000000')
  await page.type('input[name="password"]', 'xxxxxx')
  await page.click('#id_passlogin')
  await page.waitFor('.user_name')
}

const segueTargetMonthPage = async (page) => {
  const targetMonth = await page.evaluate(() => {
    const monthDom = document.querySelector('select[name="Date_Month"]')
    return monthDom.value
  })
  // 入力したい月
  // 今月じゃなくて、指定できてもいいかもしれない
  const thisMonth = new Date().getMonth() + 1

  if (thisMonth == targetMonth) return

  if (thisMonth - targetMonth > 0) {
    await page.click('#kensaku > table > tbody > tr > td:nth-child(1) > input[type=button]')
  } else {
    await page.click('#kensaku > table > tbody > tr > td:nth-child(3) > input[type=button]')
  }
  return await segueTargetMonthPage(page)
}

const segueEditPage = async (page, date) => {
  console.log('start segue edit page', date)
  const id = `browse_td_edit_${date}`
  page.click(`#${id} > input[type=image]`)
  await page.waitFor('#btn_preserve > input[type=image]', {timeout: 8000})
  console.log('end segue edit page', date)
}

const segueIndexPage = async (page, date) => {
  console.log('start segue index page', date)
  const id = `browse_td_edit_${date}`
  page.click('#btn_preserve > input[type=image]')
  await page.waitFor(`#${id}`, {timeout: 5000})
  console.log('end segue index page', date)
}

const recordAttend = async (page, date) => {
  console.log('start record attend', date)
  await segueEditPage(page, date)
  await segueIndexPage(page, date)
  console.log('end record attend', date)
}

const exec = async (dates) => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    devTools:true
  })

  const page = await browser.newPage()
  page.setViewport({width: 1200, height: 800})

  await login(page)

  await page.click('#header_menu > table > tbody > tr > td > table > tbody > tr.txt_10_2_center > td:nth-child(1) > a')
  await page.waitFor('#seal_list_title0')

  await segueTargetMonthPage(page)
  // await page.waitFor('#seal_list_title0')

  for (let date of dates) {
    await recordAttend(page, date)
  }
  await browser.close()
}

const dates = [
  '2019122',
  '2019123',
  '2019124',
  '2019125',
  '2019126',
  '2019129',
  '20191210',
  '20191211',
  '20191212',
  '20191213',
  '20191216',
  '20191217',
  '20191218',
  '20191219',
  '20191220',
  '20191223',
  '20191224',
  '20191225',
  '20191226',
  '20191227'
]

exec(dates)
