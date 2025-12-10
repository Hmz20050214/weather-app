# React Weather App (中国天气网爬虫版)

本项目为 React 天气预报应用，已改为通过 Python Flask 后端爬虫实时抓取中国天气网数据。

## 功能简介

- 前端：React 实现，输入英文城市名（如 beijing、shanghai），自动转换为中国天气网城市代码，展示天气信息。
- 后端：Python Flask + requests + BeautifulSoup，爬取中国天气网 7 天天气数据，提供 RESTful 接口。

## 运行方法

### 1. 启动后端爬虫服务

```bash
cd weather-crawler-backend
pip install flask requests beautifulsoup4 flask-cors
python app.py
```

默认监听 http://localhost:5000/weather?city=城市代码

### 2. 启动前端 React 项目

```bash
cd react-weather-app
npm install
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

默认访问 http://localhost:3000

## 输入说明

在首页输入英文城市名（如 beijing、shanghai、guangzhou），按回车即可获取天气。
如需支持更多城市，请补充 src/cityCodeMap.js 映射表。

## 截图

![screenshot of the app](https://raw.githubusercontent.com/alexkowsik/react-weather-app/master/src/images/screenshot.png)
