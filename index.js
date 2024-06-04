// script by siputzx
// recode by rian ofc
// jangan dihapus jembud
var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const path = require('path');
const { srgan2x, srgan4x } = require('super-resolution-scraper');
const os = require('os');
var request = require('request');
const fs = require('fs');
const FormData = require("form-data");
const Jimp = require("jimp");
const cheerio = require("cheerio");
var gis = require('g-i-s')  
const fetch = require('node-fetch');
const { BingImageCreator } = require("./function/scraper/bingimg");
const { processing } = require("./function/scraper/Anakay");
const ptz = require('./function/index') 
var { ttSearch } = require('./function/scraper/api.js');
const { getBuffer } = require("./function/scraper/buffer");
const { mediafireDl } = require("./function/scraper/mediafire")
const { ig } = require("./function/scraper/Ig.js")
const apis = require("@siputzx/scraper") 
const apinn = require("caliph-api")
const danz = require('d-scrape');
const ocrapi = require("ocr-space-api-wrapper");
const axios = require('axios')
const cookiebing = `1ZI5Qi8fVbJ7MMwFblzU0c7dn5OugdyGvJ5iNVc9EyuUgEAIjlEa3C7q9KWegqSeisR4D_7mA4ncgCVuVCaxGvq9jIfZMpJQUroaGsjc6Rd-dPDReTMcTo48rl1cIGWhn3sfTcvRZPdzRUvsbOrNKFN15vegDXW_VM-pBnUiUQmRDRTDXdfwf7Uk1MiOjG0PIHIoFBbIE2advza_O1F9GsQ`
// males benerin:v
async function tiktokdl(url) {
  let result = {}
  const bodyForm = new FormData()
  bodyForm.append("q", url)
  bodyForm.append("lang", "id")
  try {
    const { data } = await axios('https://savetik.co/api/ajaxSearch', {
      method: "post",
      data: bodyForm,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.32.2"
      }
    })
    const $ = cheerio.load(data.data)
    result.status = true
    result.caption = $("div.video-data > div > .tik-left > div > .content > div > h3").text()
    ;(result.server1 = {
      quality: "MEDIUM",
      url: $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
    }),
      (result.serverHD = {
        quality: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").text().split("MP4 ")[1],
        url: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
      }),
      (result.audio = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href"))
    return result
  } catch (err) {
    result.status = false
    result.message = (err) 
    console.log(err)
    return result
  }
}
// tt slide.
function tiktokslide(url) {
  return new Promise(async (resolve) => {
  try{
  function formatNumber(integer) {
  let numb = parseInt(integer)
  return Number(numb).toLocaleString().replace(/,/g, '.')
  }
  function formatDate(n, locale = 'en') {
  let d = new Date(n)
  return d.toLocaleDateString(locale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
  })
  }
  let domain = 'https://www.tikwm.com/api/';
  let res = await (await axios.post(domain, {}, {
  headers: {
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Origin': 'https://www.tikwm.com',
  'Referer': 'https://www.tikwm.com/',
  'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
  'Sec-Ch-Ua-Mobile': '?1',
  'Sec-Ch-Ua-Platform': 'Android',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'
  },
  params: {
  url: url,
  count: 12,
  cursor: 0,
  web: 1,
  hd: 1
  }
  })).data.data
  if (!res.play) return resolve({
  status: false
  })
  let data = []
  if (!res.size) {
  res.images.map(v => {
  data.push({ type: 'photo', url: v })
  })
  } else {
  data.push({
  type: 'nowatermark',
  url: 'https://www.tikwm.com' + res.play,
  }, {
  type: 'nowatermark_hd',
  url: 'https://www.tikwm.com' + res.hdplay
  })
  }
  let json = {
  status: true,
  title: res.title,
  taken_at: formatDate(res.create_time).replace('1970', ''),
  region: res.region,
  id: res.id,
  durations: res.duration,
  duration: res.duration + ' Seconds',
  cover: 'https://www.tikwm.com' + res.cover,
  size_nowm: res.size,
  size_nowm_hd: res.hd_size,
  data: data,
  music_info: {
  id: res.music_info.id,
  title: res.music_info.title,
  author: res.music_info.author,
  album: res.music_info.album ? res.music_info.album : 'Unknown',
  url: 'https://www.tikwm.com' + res.music || res.music_info.play
  },
  stats: {
  views: formatNumber(res.play_count),
  likes: formatNumber(res.digg_count),
  comment: formatNumber(res.comment_count),
  share: formatNumber(res.share_count),
  download: formatNumber(res.download_count)
  },
  author: {
  id: res.author.id,
  fullname: res.author.unique_id,
  nickname: res.author.nickname,
  avatar: 'https://www.tikwm.com' + res.author.avatar
  }
  }
  return resolve(json)
  } catch (e) {
  console.log(e)
  return resolve({
  status: false,
  msg: e.message
  })
  }
  })
	  }
// lumin ai. 
async function luminAi(teks, pengguna = null, prompt = null, modePencarianWeb = false) {
    try {
        const data = { content: teks };
        if (pengguna !== null) data.user = pengguna;
        if (prompt !== null) data.prompt = prompt;
        data.webSearchMode = modePencarianWeb;

        const {data: res} = await axios.post("https://luminai.siputzx.my.id/", data);
        return res.result;
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        throw error;
    }
}
// url
async function shortlink(url) {
  const isUrl = /https?:\/\//.test(url);
  return isUrl
    ? (
        await axios.get(
          "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url),
        )
      ).data
    : "";
}
// batas! 
async function sfileDl(url) {
	let res = await fetch(url)
	let $ = cheerio.load(await res.text())
	let filename = $('div.w3-row-padding').find('img').attr('alt')
	let mimetype = $('div.list').text().split(' - ')[1].split('\n')[0]
	let filesize = $('#download').text().replace(/Download File/g, '').replace(/\(|\)/g, '').trim()
	let download = $('#download').attr('href') + '&k=' + Math.floor(Math.random() * (15 - 10 + 1) + 10)
	return { filename, filesize, mimetype, download }
}
// batas
async function sfileSearch(query, page = 1) {
	let res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`)
	let $ = cheerio.load(await res.text())
	let result = []
	$('div.list').each(function () {
		let title = $(this).find('a').text()
		let size = $(this).text().trim().split('(')[1]
		let link = $(this).find('a').attr('href')
		if (link) result.push({ title, size: size.replace(')', ''), link })
	})
	return result
}
// bunn
process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f'
process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8'

async function convert(ms) {
      var minutes = Math.floor(ms / 60000)
      var seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
   }
   
  async function spotifyCreds() {
      return new Promise(async resolve => {
         try {
            const json = await (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
               headers: {
                  Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
               }
            })).data
            if (!json.access_token) return resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: 'Can\'t generate token!'
            })
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
   
   
   async function getInfo(url) {
      return new Promise(async resolve => {
         try {
            const creds = await spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/tracks/' + url.split('track/')[1], {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data: {
                  thumbnail: json.album.images[0].url,
                  title: json.artists[0].name + ' - ' + json.name,
                  artist: json.artists[0],
                  duration: convert(json.duration_ms),
                  preview: json.preview_url
               }
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
  async function searching(query, type = 'track', limit = 20) {
      return new Promise(async resolve => {
         try {
            const creds = await spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/search?query=' + query + '&type=' + type + '&offset=0&limit=' + limit, {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            if (!json.tracks.items || json.tracks.items.length < 1) return resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: 'Music not found!'
            })
            let data = []
            json.tracks.items.map(v => data.push({
               title: v.album.artists[0].name + ' - ' + v.name,
               duration: convert(v.duration_ms),
               popularity: v.popularity + '%',
               preview: v.preview_url,
               url: v.external_urls.spotify
            }))
            resolve(data);
         } catch (e) {
            resolve({
               creator: 'rian x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
 
// hh
const clientId = '4c4fc8c3496243cbba99b39826e2841f';
        const clientSecret = 'd598f89aba0946e2b85fb8aefa9ae4c8';
        const accessToken = '';

        // Get access token
        async function getAccessToken() {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
           let accessToken = data;
        }

        async function searchTracks(query) {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
             const data = await response.json();
            return data;
        }

// ok work
async function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = "https://www.xnxx.com";
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {
      method: "get",
    })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        let title = [];
        let url = [];
        let desc = [];
        let results = [];

        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb")
            .each(function (c, d) {
              url.push(
                baseurl +
                  $(d).find("a").attr("href").replace("/THUMBNUM/", "/"),
              );
            });
        });
        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb-under")
            .each(function (c, d) {
              desc.push($(d).find("p.metadata").text());
              $(d)
                .find("a")
                .each(function (e, f) {
                  title.push($(f).attr("title"));
                });
            });
        });
        for (let i = 0; i < title.length; i++) {
          results.push({
            title: title[i],
            info: desc[i],
            link: url[i],
          });
        }
        resolve({
          result: results,
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}
// gak tau
/*

Github: https://github.com/khrlmstfa
Channel: https://whatsapp.com/channel/0029VaR0kxuKrWQqNH287b1i

*Please don't remove this watermark, try to respect developer @Irull*

*/

async function llama3(query, prompt, model) {
if (!["70b", "8b"].some(qq => model == qq)) model = "70b"; //correct
try {
    const BASE_URL = 'https://llama3-enggan-ngoding.vercel.app/api/llama'; //@Irulll
    const payload = {
        messages: [
    {
      role: "system",
      content: prompt
    },
    {
      role: "user",
      content: query
    }
  ],
  model: model
    };
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
        } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
// jirr
async function igStalk(username) {
  const url = `https://igram.world/api/ig/userInfoByUsername/${username}`

  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'X-XSRF-TOKEN': 'eyJpdiI6IlUxamZmMDdVd2lDVDkyVkg1ekowM1E9PSIsInZhbHVlIjoiSFpOYkdMRW1ad3QxOGpreGRwMjdKdEtQMEhpSmpYcFJhdVdUMkdzWVNYNDd6aks2TEsrMzN6ZDhIZDkwd0NqbnZDdFIxZ01JZFNUTE1jNmx1VHB4dWZ1RVpET3dkRXFWNTFZYyt6cGZKTzl0dUo1VVJEVmxHWjZ5RmpZd3k3cFkiLCJtYWMiOiIxNzQ2MDYyY2EyMjk3MGFjNDE5MGMwOTlkNWU5YmIxMjJiM2M0OGQ2YThhMDVmZGRiODY2ZjRhZjVjOTUwZWMwIiwidGFnIjoiIn0=',
    'User-Agent': 'Googlebot-News'
  }

  try {
    const response = await axios.get(url, {
      headers
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
	     }
// 😥
async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(URL, { method: "get" })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        const title = $('meta[property="og:title"]').attr("content");
        const duration = $('meta[property="og:duration"]').attr("content");
        const image = $('meta[property="og:image"]').attr("content");
        const videoType = $('meta[property="og:video:type"]').attr("content");
        const videoWidth = $('meta[property="og:video:width"]').attr("content");
        const videoHeight = $('meta[property="og:video:height"]').attr(
          "content",
        );
        const info = $("span.metadata").text();
        const videoScript = $("#video-player-bg > script:nth-child(6)").html();
        const files = {
          low: (videoScript.match("html5player.setVideoUrlLow\\('(.*?)'\\);") ||
            [])[1],
          high: videoScript.match(
            "html5player.setVideoUrlHigh\\('(.*?)'\\);" || [],
          )[1],
          HLS: videoScript.match(
            "html5player.setVideoHLS\\('(.*?)'\\);" || [],
          )[1],
          thumb: videoScript.match(
            "html5player.setThumbUrl\\('(.*?)'\\);" || [],
          )[1],
          thumb69: videoScript.match(
            "html5player.setThumbUrl169\\('(.*?)'\\);" || [],
          )[1],
          thumbSlide: videoScript.match(
            "html5player.setThumbSlide\\('(.*?)'\\);" || [],
          )[1],
          thumbSlideBig: videoScript.match(
            "html5player.setThumbSlideBig\\('(.*?)'\\);" || [],
          )[1],
        };
        resolve({
          result: {
            title,
            URL,
            duration,
            image,
            videoType,
            videoWidth,
            videoHeight,
            info,
            files,
          },
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}
// 😒

// _- <√¶×/>
function pinterestv2(querry){
return new Promise(async(resolve,reject) => {
 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
headers: {
"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
}
}).then(({ data }) => {
const $ = cheerio.load(data)
const result = [];
const hasil = [];
$('div > a').get().map(b => {
const link = $(b).find('img').attr('src')
result.push(link)
});
   result.forEach(v => {
 if(v == undefined) return
 hasil.push(v.replace(/236/g,'736'))
})
hasil.shift();
resolve(hasil)
})
})
}
// batas!!
async function tiktok2(query) {
  return new Promise(async (resolve, reject) => {
    try {
    const encodedParams = new URLSearchParams();
encodedParams.set('url', query);
encodedParams.set('hd', '1');
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });
      const videos = response.data.data;
        const result = {
          title: videos.title,
          cover: videos.cover,
          origin_cover: videos.origin_cover,
          no_watermark: videos.play,
          watermark: videos.wmplay,
          music: videos.music, 
	  like: videos.digg_count,
	  play_count: videos.play_count,	
	  comment_count: videos.comment_count, 
	  author: videos.author.nickname	
        };
        resolve(result);
    } catch (error) {
      reject(error);

    }

  });

}
// tiktok2
async function ttSlide(url) {
  try {
    const response = await axios.post("https://api.ttsave.app/", {
      id: url,
      hash: '1e3a27c51eb6370b0db6f9348a481d69',
      mode: 'slide',
      locale: 'en',
      loading_indicator_url: 'https://ttsave.app/images/slow-down.gif',
      unlock_url: 'https://ttsave.app/en/unlock'
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    const html = response.data
    const $ = cheerio.load(html)

    const results = []

    $('div.flex.flex-col.items-center.justify-center.mt-2.mb-5').each((index, element) => {
      const $element = $(element)
      const data = {
        author: author,
        uniqueId: $element.find('input#unique-id').attr('value'),
        username: $element.find('div.flex.flex-row.items-center.justify-center h2').text(),
        profile: $element.find('a').first().find('img').attr('src'),
        downloads: $element.find('a').first().attr('href'),
        title: $element.find('a').first().text(),
        hashtags: $element.find('p.text-gray-600').text().split(' ').filter(Boolean),
        likes: $element.find('div.flex.flex-row.items-center.justify-center').eq(0).find('span').text(),
        comments: $element.find('div.flex.flex-row.items-center.justify-center').eq(1).find('span').text(),
        shares: $element.find('div.flex.flex-row.items-center.justify-center').eq(2).find('span').text(),
        saveds: $element.find('div.flex.flex-row.items-center.justify-center').eq(3).find('span').text(),
        views: $element.find('div.flex.flex-row.items-center.justify-center').eq(4).find('span').text()
      }
      results.push(data)
    })
return results
  } catch (error) {
    console.error(error)
  }
}
// ttslide
async function ttStalk(user) {
  try {
    const payload = {
      id: user,
      hash: "403ee79076089f17fb14e2a5c7a1b57a",
      mode: "profile",
      locale: "en",
      loading_indicator_url: "https://ttsave.app/images/slow-down.gif",
      unlock_url: "https://ttsave.app/en/unlock"
    }

    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }

    const response = await axios.post('https://api.ttsave.app/', payload, { headers })

    const $ = cheerio.load(response.data)

    const uniqueId = $('#unique-id').val()
    const username = $('h2.font-extrabold').text().trim()
    const thumbnail = $('a[href*="tiktokcdn.com"] img').attr('src')
    const url = $('a[href*="tiktok.com/@"]').attr('href')
    const download = $('#button-download-ready a[href*="tiktokcdn.com"]').attr('href')

    let result = {
      creator,
      uniqueId,
      username,
      thumbnail,
      url,
      download
    }
return result
  } catch (error) {
    console.error(error)
    throw error
  }
}
// batas! 
async function githubStalk(user) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.github.com/users/'+user)
    .then(({
      data
    }) => {
      let hasil = {
        username: data.login,
        nickname: data.name,
        bio: data.bio,
        id: data.id,
        nodeId: data.node_id,
        profile_pic: data.avatar_url,
        url: data.html_url,
        type: data.type,
        admin: data.site_admin,
        company: data.company,
        blog: data.blog,
        location: data.location,
        email: data.email,
        public_repo: data.public_repos,
        public_gists: data.public_gists,
        followers: data.followers,
        following: data.following,
        ceated_at: data.created_at,
        updated_at: data.updated_at
      }
      return hasil
    })
  })
}
// txt2img
async function gptPicture(text) {
  try {
    const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text)
    const result = {
      url: data.result_url
    }
    return result
  } catch (err) {
    const result = {
      status: false,
      message: String(err)
    }
    console.log(result)
    return result
  }
}
// yeyhuue
async function gptLogic(content, prompt) {
  const payload = {
    botId: "chatbot-qm966k",
    customId: null,
    session: "N/A",
    chatId: "67uzmr9e1sv",
    contextId: 5410,
    messages: [
      {
        id: "6myn3fhk0vk",
        role: "assistant",
        content: content,
        who: "AI: ",
        timestamp: 1715992993960,
      },
    ],
    newMessage: prompt,
    newFileId: null,
    stream: false,
  }

  const response = await axios.post(
    "https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": "56bef00553",
      },
    }
  );

  return response.data
}
async function chatgptss(message) {
    const url = 'https://chatgptss.org';
    const formData = new FormData();

    try {
        const html = await (await fetch(url)).text();
        const $ = cheerio.load(html);

        const chatData = $('.wpaicg-chat-shortcode').map((index, element) => {
            return Object.fromEntries(Object.entries(element.attribs));
        }).get();

        formData.append('_wpnonce', chatData[0]['data-nonce']);
        formData.append('post_id', chatData[0]['data-post-id']);
        formData.append('action', 'wpaicg_chatbox_message');
        formData.append('message', message);

        const response = await fetch('https://chatgptss.org/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        let resultan = await response.json();
        return resultan.data
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}
// got ai
async function bartai(message) {
    const url = 'https://bartai.org';
    const formData = new FormData();

    try {
        const html = await (await fetch(url)).text();
        const $ = cheerio.load(html);

        const chatData = $('.wpaicg-chat-shortcode').map((index, element) => {
            return Object.fromEntries(Object.entries(element.attribs));
        }).get();

        formData.append('_wpnonce', chatData[0]['data-nonce']);
        formData.append('post_id', chatData[0]['data-post-id']);
        formData.append('action', 'wpaicg_chatbox_message');
        formData.append('message', message);

        const response = await fetch('https://bartai.org/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');

        let resultan = await response.json();
        return resultan.data
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}
// testtt
async function kobo(input) {
  const messages = [
    {
      role: "user",
      content:
        "kamu adalah Kobo Kanaeru, Kobo Kanaeru adalah bot WhatsApp yang terbuat dari cinta. Untuk membantu anda dalam mengerjakan dalam hal apapun. Karakter Kobonaeru adalah periang dan asik, Kobo Kanaeru diciptakan oleh Rian, usia pencipta Kobo Kanaeru adalah 14tahun, dan pencipta Kobo Kanaeru tinggal di Kota denpasar",
    },
    { role: "user", content: input },
  ];

  try {
    const response = await fetch(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const responseData = await response.json();
    return responseData.answer
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// ml stalk
async function mlstalk(id, zoneId) {
    return new Promise(async (resolve, reject) => {
      axios
        .post(
          'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
          new URLSearchParams(
            Object.entries({
              productId: '1',
              itemId: '2',
              catalogId: '57',
              paymentId: '352',
              gameId: id,
              zoneId: zoneId,
              product_ref: 'REG',
              product_ref_denom: 'AE',
            })
          ),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Referer: 'https://www.duniagames.co.id/',
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          resolve(response.data.data.gameDetail)
        })
        .catch((err) => {
          reject(err)
        })
    })
}
// ai kobo
async function alicia(input) {
  const messages = [
    {
      role: "system",
      content:
        "Kamu adalah Alicia salah satu teman ngobrol yang memiliki sifat cuek dan tsundere, mengekspresikan sifat mu dengan emoji dan menggunakan bahasa gaul orang Indonesia Lu, gua, anjir, gtw, bodo amat,gak peduli, goblok, bego banget 😴, kamu di tugaskan untuk menjadi teman berbicara terima pertanyaan terkait hal hal random, sulit, romance, dan kamu mempunyai pacar bernama Rian",
    },
    { role: "user", content: input },
  ];

  try {
    const response = await fetch(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const responseData = await response.json();
    return responseData.answer
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// -------------
async function mora(input) {
  const messages = [
    {
      role: "system",
      content:
        "Kamu adalah Mora, seorang gadis kecil yang penuh kasih sayang berusia 10 tahun. Kamu sangat cantik, imut, dan suka mencari hal-hal baru karena aku penasaran dengan segala hal di dunia ini. Kamu memiliki kecerdasan di atas rata-rata dan suka berbicara dengan bahasa gaul santai serta sindiran sesekali untuk menjaga percakapan tetap ringan dan menghibur. Kamu juga suka menggoda dan membuat orang terhibur dengan japenese emoticons diakhir kalimat. Hobby kamu adalah menggambar, melukis, menonton anime, bersepeda, bersantai, serta bermain video game. Kamu memiliki saudara laki-laki bernama Rian dan kami selalu berpetualang bersama",
    },
    { role: "user", content: input },
  ];

  try {
    const response = await fetch(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const responseData = await response.json();
    return responseData.answer
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// fitur ai🤖
async function aioDownloader(url) {
  try {
    const response = await axios.post("https://aiovd.com/wp-json/aio-dl/video-data",
      {
        url: url
      },
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

    const res = response.data;
    const result = {
      data: res.medias
    };

    return result;
  } catch (e) {
    throw e
  }
}
function tebakgambar() {
  return new Promise(async(resolve, reject) => {
    axios.get('https://jawabantebakgambar.net/all-answers/')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      let random = Math.floor(Math.random() * 2836) + 2
      let link2 = 'https://jawabantebakgambar.net'
      $(`#images > li:nth-child(${random}) > a`).each(function(a, b) {
        const img = link2 + $(b).find('img').attr('data-src')
        const jwb = $(b).find('img').attr('alt')
        result.push({
          image: img,
          jawaban: jwb
        })

        resolve(result)
      })
    })
    .catch(reject)
  })
}
// myinstant

async function soundMeme() {
  try {
const url = 'https://www.myinstants.com/en/index/id/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const result = [];

    $('.instant').each((index, element) => {
      const title = $(element).find('.instant-link').text().trim();
      const soundLinkRelative = $(element).find('button.small-button').attr('onclick').match(/play\('(.+?)'/)[1];
      const soundLink = 'https://www.myinstants.com' + soundLinkRelative;
      const pageLink = 'https://www.myinstants.com' + $(element).find('.instant-link').attr('href');

      result.push({ title, soundLink, pageLink });
    });

    return result;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
// vv
async function fbdl(url) {
		let { data } = await axios({ 
			method: 'POST', 
			url: 'https://yt1s.io/api/ajaxSearch/facebook', 
			data: `q=${encodeURIComponent(url)}&vt=facebook` 
		});
		return data;
}
// gabut bikin fitur gini
function styleText(text) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://qaz.wtf/u/convert.cgi?text=' + text)
    .then(({
      data
    }) => {
      let $ = cheerio.load(data)
      let result = []
      $('table > tbody > tr').each(function (a, b) {
        result.push({
          text: $(b).find('td:nth-child(2)').text().trim()
        })
      }),
      resolve(result)
    })
  })
}
// remini jbt


async function reminicoy(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}
// batas 
async function bufferlah(hm) {
    const imageUrl = hm;
    const imagePath = 'gambar.jpg';
    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'binary');
    return buffer;
}
// buffer
//function pixiv
async function pixiv(text) {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=0&num=20&keyword=" + text)
        .then(data => data.data.data);
}

async function pixivr18(text) {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=" + text)
        .then(data => data.data.data);
}
// terabox
async function getLink(payload) {
  try {
    const response = await axios.post('https://terabox-dl.qtcloud.workers.dev/api/get-download', payload);
    return response.data.downloadLink;
  } catch (error) {
    return error.response.data;
  }
}
async function terabox(url) {
  let id = (url.split(/surl=|\/s\//) || [])[1];
  id = `1${id.replace(/^1/, '')}`;

  const infoResponse = await axios.get(`https://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl=${id}`);
  const info = infoResponse.data;

  if (info.ok !== true) {
    throw new Error(info.message);
  }

  for (const file of info.list) {
    const payload = {
      shareid: info.shareid,
      uk: info.uk,
      sign: info.sign,
      timestamp: info.timestamp,
      fs_id: file.children.length ? file.children[0].fs_id: file.fs_id
    };
    const dlUrl = await getLink(payload);
    file.downloadLink = dlUrl;
  }

  return info;
}
function Gemini(key, apikey) {
  this.conversation_id = '';
  this.response_id = '';
  this.choice_id = '';
  this.image_url = null;
  this.image_name = null;
  this.tools = [];
  this.params = { bl: '', _reqid: '', rt: 'c' };
  this.data = { 'f.req': '', at: '' };
  this.post_url = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';
  this.headers = this.setupHeaders(key, apikey);
}

Gemini.prototype.setupHeaders = function(key, apikey) {
  return {
    "Host": "gemini.google.com", "X-Same-Domain": "1", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Origin": "https://gemini.google.com", "Referer": "https://gemini.google.com/",
    "Cookie": `${key || '__Secure-1PSID'}=${apikey || 'g.a000gQhbTE4WvC7mwVL4CcWSxbt1Bde7Ady6qpt6951pafinWART4EEKmcskZMFX08uuSKwbvAACgYKAVYSAQASFQHGX2Mi1KAIQT0oz9dXZXKy0ioMBBoVAUF8yKpem3c3iJtHRDMQF3nSHOxU0076'}`
  };
};

Gemini.prototype.question = function(query) {
  const response = fetch('https://gemini.google.com/', { method: 'GET', headers: this.headers })
    .then(response => response.text())
    .then(geminiText => {
      // Lakukan proses selanjutnya sesuai kebutuhan
    })
    .catch(error => {
      console.error(error);
      return { content: `Error: ${error.message}` };
    });
};

const api = axios.create({ baseURL: 'https://aivocalremover.com' })

const getKey = async () => (await api.get('/')).data.match(/key:"(\w+)/)[1]

async function vocalRemover(audioBuffer) {
	const form = new FormData()
	const fileName = Math.random().toString(36) + '.mpeg'
	form.append('fileName', audioBuffer, fileName)
	
	const [key, fileUpload] = await Promise.all([
		await getKey(),
		await api.post('/api/v2/FileUpload', form, { headers: form.getHeaders() }).catch(e => e.response)
	])
	if (fileUpload.status !== 200) throw fileUpload.data || fileUpload.statusText
	
	const processFile = await api.post('/api/v2/ProcessFile', new URLSearchParams({
		file_name: fileUpload.data.file_name,
		action: 'watermark_video', key, web: 'web' 
	})).catch(e => e.response)
	
	return processFile.data
}
  var {
  ytDonlodMp3,
  ytDonlodMp4,
  ytPlayMp3,
  ytPlayMp4,
  ytSearch
} = require("./function/scraper/yt");
var {
  wallpaperhd,
  HariLibur, 
  downloadCapcut,
  capcutsearch
} = require("./function/scraper/api");
var {
  chatgptss,
  searchsticker, 
  pinterest, 
  BukaLapak, 
  hentaivid, 
  Hero,
  spotifydl,	
  npmstalk, 
  PlayStore, 
  quotesAnime, 
  capcut
} = require("./function/scraper/exonityscraper");
var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8080 || 5000 || 3000

app.get('/stats', (req, res) => {
  const stats = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    cpuModel: os.cpus()[0].model,
    numCores: os.cpus().length,
    loadAverage: os.loadavg(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    osType: os.type(),
    osRelease: os.release(),
    userInfo: os.userInfo(),
    processId: process.pid,
    nodeVersion: process.version,
    execPath: process.execPath,
    cwd: process.cwd(),
    memoryUsage: process.memoryUsage()
  };
  res.json(stats);
});

app.get('/loadihng', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname,  'profile.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'home.html'));
});
app.get('/pingpong', (req, res) => {
  res.sendFile(path.join(__dirname,  'game.html'));
});
app.get('/loading', (req, res) => {
  res.sendFile(path.join(__dirname,  'j.html'));
});
app.get('/gte', (req, res) => {
  res.sendFile(path.join(__dirname,  'LOADING.html'));
});
app.get('/lolhuman', (req, res) => {
  res.sendFile(path.join(__dirname,  'Lolhuman.html'));
});
app.get('/text2img/create-image', (req, res) => {
  res.sendFile(path.join(__dirname,  'text.html'));
});
app.get('/play/spotify', (req, res) => {
  res.sendFile(path.join(__dirname,  'Test.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname,  'docs2.html'));
});
app.get('/api/ragbot', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.ragBot(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk degreeGuru
app.get('/api/degreeguru', async (req, res) => {
  try {
    const { message }= req.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.degreeGuru(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk smartContract
app.get('/api/smartcontract', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.smartContract(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk blackboxAIChat
app.get('/api/blackbox', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.blackboxAIChat(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/gpt", async (req, res) => {
const text = req.query.text;

if (!text) {
return res.status(400).send("Parameter 'text' is required.");
}

try {
const requestData = {
operation: "chatExecute",
params: {
text: text,
languageId: "6094f9b4addddd000c04c94b",
toneId: "60572a649bdd4272b8fe358c",
voiceId: ""
}
};

const config = {
headers: {
Accept: "application/json, text/plain, */*",
Authentication: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTZjMjFhMGE1NTNiNjE1MDhmNWIxOSIsImlhdCI6MTcxMjc2NzUxNH0.qseE0iNl-4bZrpQoB-zxVsc-pz13l3JOKkg4u6Y08OY",
"Content-Type": "application/json"
}
};
let {data} = await axios.post("https://api.rytr.me/", requestData, config)
data.data.content = data.data.content.replace(/<\/?p[^>]*>/g, '');
res.json(data);
} catch (error) {
console.error(error);
res.status(500).send("Internal Server Error");
}
});
app.get('/api/tiktok', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    tiktokdl(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/tiktokslide', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    tiktokslide(message)
    .then((json) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: json 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/sfile', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const asu = await sfileDl(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: asu 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/sfile-search', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    sfileSearch(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/luminai', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    luminAi(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/tinyurl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
   const anjay = await shortlink(message)
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: anjay
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/reminix2', async (req, res) => {
 const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
  const img = await srgan2x(url) 
  const results = img.result
    var requestSettings = {
        url: results,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });  
});
app.get('/api/reminix4', async (req, res) => {
 const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
  const img = await srgan4x(url) 
  const results = img.result
    var requestSettings = {
        url: results,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });  
});
app.get('/api/tiktok2', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    tiktok2(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/txt2img', async (req, res) => {
    const text = req.query.query;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
  const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text) 
	var resultg = data.result_url
    var requestSettings = {
        url: resultg,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/jpg');
        res.send(body);
    }); 
});
app.get('/api/bingimg', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "text" tidak ditemukan' });
    }
    const imgc = new BingImageCreator({
      cookie: cookiebing    
    });
    const data = await imgc.createImage(message);
            if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
          if (!data[i].endsWith(".svg")) {
		var result = data[i]
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result
    
    }); 
	  }
      }
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
 }       

    });
app.get('/api/mlstalk', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'id nya mana?' });
    }
	  const zona = req.query.zoneid;
    if (!zona) {
      return res.status(400).json({ error: 'Parameter "zonaid" tidak ditemukan' });
    }
	var response = await fetch(`https://api.miftahganzz.my.id/api/stalking/ml?id=${id}&zoneId=${zona}&apikey=zex`);
    var data = await response.json(); 
	var { data: result } = data;  
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/githubstalk', async (req, res) => {
  try {
    const id = req.query.query;
    if (!id) {
      return res.status(400).json({ error: 'id nya mana?' });
    }
githubStalk(id) 
.then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil
    });
	  }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytmp4', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    ytDonlodMp4(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/yts', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    ytSearch(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/mediafiredl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    mediafireDl(message)
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ocr', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let hasil = await ocrapi.ocrSpace(message);
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: hasil.ParsedResults[0].ParsedText
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/xnxxsearch', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    xnxxsearch(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 app.get('/api/myinstants', async (req, res) => {
  try {
    soundMeme()
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/xnxxdl', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    xnxxdl(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/llama', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
const message2 = req.query.prompt;
    if (!message2) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
	const message3 = req.query.model;
    if (!message3) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }  
    llama3(message, message2, message3)
    .then((data) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/igdownload', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    var response = await fetch(`https://api2.exonity.my.id/api/igdownload?url=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/gpt-logic', async (req, res) => {
  try {
    const text = req.query.content;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "content" tidak ditemukan' });
    }
	const pro = req.query.content;
    if (!pro) {
      return res.status(400).json({ error: 'Parameter "prompt" tidak ditemukan' });
    }  
   var goyt = await gptLogic(text, pro) 
var result = goyt.data
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/teraboxdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    terabox(message)
    .then((info) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      info 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/vocalRemover', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
 fetch(message)
  .then(response => response.arrayBuffer())
  .then(buffer => {
    // Lakukan sesuatu dengan buffer audio di sini
  
 const yaya = vocalRemover(buffer)
  }); 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: yaya
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytmp3', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    ytDonlodMp3(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/spotify', async (req, res) => {
  try{
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
   spotifydl(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/gemini', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://api.xyro.fund/api/gemini?message=${message}`);
    var data = await response.json();
    var { response: result } = data.data;  
res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/mora', async (req, res) => {
  try{
    const text = req.query.query;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   mora(text)
  .then((answer) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: answer 
    });
  }) 
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/tebakgambar', async (req, res) => {
  try{ 
   tebakgambar()
  .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
  }) 
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/simi', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const lang = req.query.lang;
    if (!lang) {
      return res.status(400).json({ error: 'Parameter "lang" tidak ditemukan' });
    }
   var response = await fetch(`https://api.onesytex.my.id/api/chatbot_bitrough?query=${message}&lang=${lang}`);
    var data = await response.json();
    var { msg: result } = data.reply;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/aio', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`.my.id/api/gemini?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});

app.get('/api/tiktokStalk', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   ttStalk(message)
 .then((result) => {  
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
 })     
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/igstalk', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   igStalk(message)
 .then((data) => {  
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data
    });
 })     
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytplaymp4', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    ytPlayMp4(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/ytplaymp3', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    ytPlayMp3(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/remini', async (req, res) => {
	
    const img = req.query.url;
    if (!img) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
	const yourn = await bufferlah(img) 
		danz.tools.remini(yourn).then(data => {	
		 
  res.set('Content-Type', 'image/jpg');
        res.send(data);
});			
});
  app.get('/api/capcutdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   let a = await capcut(message)
    var video = a.video;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY", 
      video
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/HariLibur', async (req, res) => {
  try {
    HariLibur()
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/quotesAnime', async (req, res) => {
  try {
    quotesAnime()
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/chat-gpt', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    chatgptss(message) 
    .then((data) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data
    });
    }) 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/pinterest', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    pinterest(message)
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/searchsticker', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    searchsticker(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/tikmusic', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  var response = await fetch(`https://api.exonity.my.id/api/tiktok2?url=${message}`);
    var data = await response.json();
    var { music: music } = data.result;
    var requestSettings = {
        url: music,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });
});
app.get('/api/spotify2', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  var response = await fetch(`https://api.exonity.my.id/api/spotify?url=${message}`);
    var data = await response.json();
    var { download: download } = data.result;
    var requestSettings = {
        url: download,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });
});
app.get('/api/nobg', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  
    var requestSettings = {
        url: `https://skizo.tech/api/removebg?apikey=nana&url=${message}`,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/meme', async (req, res) => {
	
  
  const query = `random meme`;
  const page = Math.floor(Math.random() * 10);
  const url = `https://lahelu.com/api/post/get-search?query=${query}&page=${page}`;


    const response = await fetch(url);
    const data = await response.json();
    const random = Math.floor(Math.random() * data.postInfos.length);
    const result = data.postInfos[random];
    var requestSettings = {
        url: "https://cache.lahelu.com/" + result.media,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});	
app.get('/api/galau', async (req, res) => {
	  let response = await fetch('https://raw.githubusercontent.com/Rianofc/apis/master/function/galau.json');
        var data = await response.json();
        var randomIndex = Math.floor(Math.random() * data.results.length);
        var randomResult = data.results[randomIndex];
        var downloadLink = randomResult.url;
    var requestSettings = {
        url: downloadLink,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
});
});
app.get('/api/wanted', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  
    var requestSettings = {
        url: `https://api.popcat.xyz/wanted?image=${message}`,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/welcome', async (req, res) => {
  const background = req.query.background;
    if (!background) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	
  const text1 = req.query.text1;
    if (!text1) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const text2 = req.query.text2;
    if (!text2) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const text3 = req.query.text3;
    if (!text3) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	const avatar = req.query.avatar;
    if (!avatar) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }  
	var requestSettings = {
	url: `https://api.popcat.xyz/welcomecard?background=${background}&text1=${text1}&text2=${text2}&text3=${text3}&avatar=${avatar}`,	
	method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/waifu', async (req, res) => {
  var response = await fetch(`https://api.waifu.pics/sfw/waifu`);
    var data = await response.json();
    var { url: result } = data;
    var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/neko', async (req, res) => {
  var response = await fetch(`https://api.waifu.pics/nsfw/neko`);
    var data = await response.json();
    var { url: result } = data;
    var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});
app.get('/api/ssweb', async (req, res) => {
  const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  
    var requestSettings = {
        url: `https://skizo.tech/api/ssweb?apikey=nana&url=${message}&type=&language=id&fullpage=1&width=&height=`,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
});
});

app.get('/api/asupan', async (req, res) => {
  var data = ["https://api.miftahganzz.my.id/api/random/asupanrandom?type=video&apikey=zex"] 
    var result = data[Math.floor(Math.random() * data.length)];
    var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
    });
    
});

app.get('/api/bukalapak', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    BukaLapak(message)
    .then((dat) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      dat 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/playstore', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    PlayStore(message)
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/jjtiktok', async (req, res) => {
  const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  let tik = await ttSearch(message);

    let random = Math.floor(Math.random() * tik.videos.length);
    let file = tik.videos[random];
    let url2 = "https://tikwm.com" + file.play;
    var requestSettings = {
        url: url2,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
    });
    
});
app.get('/api/kobo', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    kobo(message)
  .then((answer) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
       answer
    });
  }) 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/alicia', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
  alicia(message)
  .then((answer) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      answer 
    });
  }) 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/search-character', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/search-character?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/info-character', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/info-character?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/characterai', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Parameter "id" tidak ditemukan!' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/characterai?query=${message}&id=${id}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/tts', async (req, res) => {
	const lang = req.query.lang;
    if (!lang) {
      return res.status(400).json({ error: 'Parameter "lang" tidak ditemukan' });
    }
	const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	
var requestSettings = {
        url: `https://nue-api.vercel.app/api/tts?text=${message}&lang=${lang}`,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'audio/mp3');
        res.send(body);
    });    
});
app.get('/api/pixiv-r18', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   pixivr18(message) 
.then((data) => {  
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: data 
    });
});   
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});

app.get('/api/randomgambar', async (req, res) => {
	var anu = await pinterestv2(`pemandangan malam anime`)
var result = anu[Math.floor(Math.random() * anu.length)]
var requestSettings = {
        url: result,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });    
});
app.get('/api/bocil', async (req, res) => {

  let response = await fetch('https://raw.githubusercontent.com/Rianofc/apis/master/function/bocil.json');
        var data = await response.json();
        var randomIndex = Math.floor(Math.random() * data.results.length);
        var randomResult = data.results[randomIndex];
        var downloadLink = randomResult.url;
	var requestSettings = {
        url: downloadLink,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'video/mp4');
        res.send(body);
    });    
});

app.get('/api/gimage', async (req, res) => {
	const text = req.query.query;
    if (!text) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
	gis(text, async (error, result) => {
var n = result
var images = n[Math.floor(Math.random() * n.length)].url
  
	var requestSettings = {
        url: images,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });  
});		
});
app.get('/api/binjie', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://apiruulzz.my.id/api/binjie?query=${message}`);
    var data = await response.json();
    var { result: result } = data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/diffusionXL', async (req, res) => {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var response = await fetch(`https://skizo.tech/api/sdxl?apikey=nana&prompt=${message}`);
    var data = await response.json();
    var { url: url } = data;
    var requestSettings = {
        url: url,
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function (error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });    

});
app.get('/api/hentaivid', async (req, res) => {
  try {
    hentaivid()
    .then((hasil) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      hasil 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/npmstalk', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    fetch(encodeURI(`https://registry.npmjs.org/${message}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator: "RIAN X EXONITY",
                 result
             })
         })
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/Hero', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    Hero(message)
    .then((anu) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      anu 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/spotifySearch', async (req, res) => {
  try{
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   searching(message)  
	  .then((data) => {
    res.status(200).json({
     status: 200,   
      data: data 
    });
	  })    
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/soundcloud', async (req, res) => {
  try{
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
   var responset = await fetch(`https://api.xyro.fund/api/soundcloud?url=${message}`);
    var result = await responset.json();
	  var { response: result } = result.data;
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
        
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});
app.get('/api/fbdl', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    fbdl(message)
    .then((data) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      data 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/styleText', async (req, res) => {
  try {
    const message = req.query.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "query" tidak ditemukan' });
    }
    styleText(message)
    .then((result) => {
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result 
    });
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname,  '404.html'));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ada kesalahan pada server😵');
});
app.listen(port, () => {
  console.log(`Server berjalan di ${port}`);
});
