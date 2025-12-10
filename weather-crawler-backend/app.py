from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app = Flask(__name__)
CORS(app)
@app.route('/weather')
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'Missing city parameter'}), 400
    # 构造中国天气网城市天气页面URL
    url = f'https://www.weather.com.cn/weather/{city}.shtml'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.encoding = 'utf-8'
        soup = BeautifulSoup(resp.text, 'html.parser')
        # 解析天气信息（以7天天气为例）
        weather_list = []
        for li in soup.select('ul.t.clearfix > li'):
            day = li.find('h1').text if li.find('h1') else ''
            weather = li.find('p', class_='wea').text if li.find('p', class_='wea') else ''
            temp = li.find('p', class_='tem').text.replace('\n', '').strip() if li.find('p', class_='tem') else ''
            weather_list.append({'day': day, 'weather': weather, 'temp': temp})
        if not weather_list:
            return jsonify({'error': '未能获取天气信息'}), 500
        return jsonify({'city': city, 'weather': weather_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
