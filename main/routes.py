from flask import Flask, render_template, request, jsonify
from main.preprocessor import preprocess
import os
import pandas as pd
from main import app
from main.helper import fetch_stats,busiest_user

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def main():
    user_list = []
    results = None

    if request.method == 'POST':
        chat_file = request.files.get('chat_file')

        if chat_file and chat_file.filename != "":
            filepath = os.path.join(
                app.config['UPLOAD_FOLDER'],
                chat_file.filename
            )
            chat_file.save(filepath)

            with open(filepath, 'r', encoding='utf-8') as f:
                data = f.read()

            df = preprocess(data)

            user_list = df['Users'].unique().tolist()
            if 'group_notification' in user_list:
                user_list.remove('group_notification')

            user_list.sort()
            user_list.insert(0, 'Overall')

            return jsonify({'user_list': user_list})

    return render_template(
        'whatsapp_chat_analysis.html',
        title='Whatsapp Chat Analysis',
        user_list=[]
    )

@app.route('/fetch_stats', methods=['POST'])
def fetch():
    num_messages = num_words = num_medias=num_links= None
    selected_user = request.json.get('selected_user')
    chat_file_name = request.json.get('file_name')

    filepath = os.path.join(
        app.config['UPLOAD_FOLDER'],
        chat_file_name
    )

    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()

    df = preprocess(data)
    if selected_user == 'Overall':
       top_busiest_user= busiest_user(df)


    num_messages, num_words, num_medias, num_links= fetch_stats(selected_user, df)
    results = {
        'num_messages': num_messages,
        'num_words': num_words,
        'num_medias':num_medias,
        'num_links':num_links,
    }
    return jsonify({'results': results})