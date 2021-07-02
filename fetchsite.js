const axios = require("axios");
const cheerio = require("cheerio");

const fetch = async (id, url) => {
  try {
    console.log("fetching url ....");
    const resp = await axios.get(url);
    const $ = cheerio.load(resp.data);
    const btn_text = $(`#${id}`);
    console.log(btn_text.text());
    return btn_text.text();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { fetch };
