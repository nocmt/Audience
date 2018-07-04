import requests
import json
from bs4 import BeautifulSoup
import requests_html
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8'
}

# 获取云音乐飙升榜列表
def getToplist():
    response = requests.get(
        'https://music.163.com/discover/toplist?id=19723756', headers=headers)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'lxml')
    return json.loads(soup.find('textarea').text)


# 修正云音乐飙升榜列表
def reToplist(json_data):
    Topdict = {}
    i = 1
    for song in json_data:
        Topdict[str(i)] = {}
        s = Topdict[str(i)]
        # 歌曲id
        s['id'] = song.get('id')
        # 直链
        s['url'] = f"http://music.163.com/song/media/outer/url?id={s['id']}.mp3"
        # 歌曲标题
        # s['name'] = song.get('name')
        s['name'] = song.get('album').get('name')
        # 时长
        s['duration'] = song.get('duration')
        # 作者姓名
        s['artist_name'] = song.get('artists')[0].get('name')
        # 封面地址
        s['album_picUrl'] = song.get('album').get('picUrl')
        # 作者id: http://music.163.com/artist?id=5781
        s['artist_id'] = song.get('artists')[0].get('id')
        # 歌曲id: http://music.163.com/song?id=571340283
        i += 1
    return json.dumps(Topdict)


def main():
    json_data = '''
    
    '''
    json_data = json.loads(json_data)
    with open('toplist.json', 'w') as f:
        f.writelines(reToplist(json_data))


if __name__ == '__main__':
    main()
