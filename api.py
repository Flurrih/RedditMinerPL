import praw
from flask import Flask
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

@app.route('/get', methods=['GET', 'OPTIONS'])
def say_hello():
    data = request.args.get('checkboxes')
    subreddit = request.args.get('subreddit')
    print("Recv:" + data)

    reddit = praw.Reddit(client_id='', \
                         client_secret='', \
                         user_agent='', \
                         username='', \
                         password='')

    apiReqData = data.split(";")

    subreddit = reddit.subreddit(subreddit)

    new_posts = subreddit.new(limit=30)

    wordDict = dict((el, 0) for el in apiReqData)

    for post in new_posts:
        for comment in post.comments.list():
            cmt = comment.body.lower().split();
            for word in apiReqData:
                wordDict[word] += cmt.count(word)

    return wordDict