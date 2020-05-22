const Blog = require('./blog.js')
const fs = require('fs')

const file = 'resources.html';
let count = 1;

function write(data) {
    fs.appendFileSync(file, data, (err) => {
        console('写入文件错误', count);
        return;
    })
    console.log('写入成功', count++);
}

const html1 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>blog</title>
</head>
<body>
<h1>BLOG</h1><br/>`;

const url = 'http://www.ruanyifeng.com/blog/weekly/';
const content = '资源';
let blog = new Blog(url, content);
fs.writeFileSync(file, '', () => {});
write(html1);
blog.getEveryWeeklyBlogToolsContent((week) => {
    const html = `<a href='${week.href}'><h2>${week.name}</h2></a>${week.content.join('')}<br/>`;
    write(html);
});