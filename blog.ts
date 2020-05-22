/**
 * 爬取阮一峰的bolg
 */

const axios = require('axios');
const cheerio = require('cheerio');

class Blog {
    URL: string;
    CONTENT: string;
    count: number;
    constructor(private url: string, private content: string) {
        this.URL = url;
        this.CONTENT = content;
        this.count = 1;
    }
    getHtml(url: string) {
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then((res) => {
                    console.log(url, '发送请求成功.');
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                    console.log(url, "发送请求错误.");
                });
        });
    }
    getOneBlogToolData(data: string) {
        let $ = cheerio.load(data, { decodeEntities: false });
        let goalDOM = $(`h2:contains(${this.CONTENT})`);
        let ret = [];
        let dom = goalDOM.next();
        while (dom.length && dom[0].name !== 'h2') {
            ret.push(`<p>${dom.html()}</p>`);
            dom = dom.next();
        }
        console.log('成功获取数据.');
        return ret;
    }
    getWeeklys(data: string) {
        let $ = cheerio.load(data);
        let weeklyDOMs = $("#alpha .module-list-item");
        let ret = [];
        for (let i = 0; i < weeklyDOMs.length; i++) {
            let weekDOM = weeklyDOMs.eq(i);
            let week = {
                name: weekDOM.find('a').text().trim(),
                href: weekDOM.find('a').attr('href').trim()
            }
            ret.push(week);
        }
        console.log('成功获取weeklys.', this.count++);
        return ret;
    }
    getEveryWeeklyBlogToolsContent(callback) {
        this.getHtml(this.URL)
            .then((data) => {
                let weeklys = this.getWeeklys(data);
                let countNum = 0;
                let timeOut = null;
                let timeNum = setInterval(() => {
                    let item = weeklys[countNum++];
                    this.getHtml(item.href)
                        .then((dataT) => {
                            let DOMContent = this.getOneBlogToolData(dataT);
                            let week = {
                                name: item.name,
                                href: item.href,
                                content: DOMContent
                            };
                            callback(week);
                            if(timeOut !== null) clearTimeout(timeOut);
                            timeOut = setTimeout(() => {
                                console.log('over half.')
                                clearInterval(timeNum);
                                return;
                            }, 10000);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    if(countNum >= weeklys.length) {
                        console.log('over.')
                        clearInterval(timeNum);
                        return;
                    }
                }, 1000)
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = Blog;