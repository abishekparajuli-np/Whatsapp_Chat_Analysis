from flask import Flask,render_template,request
from main.preprocessor import preprocess
import os
import pandas as pd
from main import app
from main.helper import fetch_stats


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route('/', methods=['GET', 'POST'])
def main():
    chat_files = None
    user_list = []
    num_messages = num_words = None

    if request.method == 'POST':
        chat_files = request.files.get('chat_files')

        if chat_files and chat_files.filename != "":
            filepath = os.path.join(
                app.config['UPLOAD_FOLDER'],
                chat_files.filename
            )
            chat_files.save(filepath)

            with open(filepath, 'r', encoding='utf-8') as f:
                data = f.read()

            df = preprocess(data)

            user_list = df['Users'].unique().tolist()
            if 'group_notification' in user_list:
                user_list.remove('group_notification')

            user_list.sort()
            user_list.insert(0, 'Overall')

            selected_user = request.form.get('selected_user', 'Overall')
            num_messages, num_words = fetch_stats(selected_user, df)

    return render_template(
        'whatsapp_chat_analysis.html',
        title='Whatsapp Chat Analysis',
        user_list=user_list,
        num_messages=num_messages,
        num_words=num_words
    )