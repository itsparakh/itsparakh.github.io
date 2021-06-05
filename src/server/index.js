const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.use(express.json());

function collectInternalLinks($) {
    var foundPagesCount = [];
    var totalPagesCount = [];
  
    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        totalPagesCount.push($(this).attr('href'));
  
    });
  
    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function() {
        foundPagesCount.push($(this).attr('href'));
    });
  
    let obj = {
        'foundPagesCount': foundPagesCount.length,
        'totalPagesCount': totalPagesCount.length
    }
    return obj;
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return bodyText.split('\n');
}

app.post('/api/get/search', async (req, res) => {
    const { url, keyword } = req.body;
    console.log('url:',url)
    try {
        const result = await axios.get(url)
        console.log('pages:',result.data)
        if(result.data) {
            let pageHtml = cheerio.load(result.data);
            let pages = collectInternalLinks(pageHtml)
            let sentenceData = searchForWord(pageHtml,keyword)

            let matchedSentence = [];

            if(sentenceData) {
                sentenceData.map(obj => {
                    if(obj.includes(keyword)) {
                        matchedSentence.push(obj);
                    }
                })
            }

            res.send({pages:pages, bodyData: pageHtml.text(), sentenceData: matchedSentence});
        }
    } catch (error) {
        res.send(error);
    } 
});

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));