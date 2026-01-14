from flask import render_template, request, jsonify
from main.preprocessor import preprocess
import os
from main import app
from main.helper import fetch_stats, busiest_user,word_cloud_words

# Configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        chat_file = request.files.get('chat_file')

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], chat_file.filename)
        chat_file.save(filepath)  # Save the uploaded file

        # Read the contents of the file
        with open(filepath, 'r', encoding='utf-8') as f:
            data = f.read()

        # Preprocess the chat data
        df = preprocess(data)

        # Extract unique user list
        user_list = df['Users'].unique().tolist()
        if 'group_notification' in user_list:
            user_list.remove('group_notification')

        user_list.sort()
        user_list.insert(0, 'Overall')  # Add "Overall" as the first option

        return jsonify({'user_list': user_list})

    # Render the main page
    return render_template(
        'whatsapp_chat_analysis.html',
        title='Whatsapp Chat Analysis',
        user_list=[]
    )


@app.route('/fetch_stats', methods=['POST'])
def fetch():
    data = request.json
    selected_user = data.get('selected_user')
    chat_file_name = data.get('file_name')

    # Construct file path
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], chat_file_name)

    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        chat_data = f.read()

    # Preprocess chat data
    df = preprocess(chat_data)

    # If selected_user is 'Overall', compute busiest user stats
    if selected_user == 'Overall':
        top_busiest_user_df = busiest_user(df)
        top_users = top_busiest_user_df['User'].tolist()
        message_share = top_busiest_user_df['Message_Share'].tolist()
    else:
        top_users = []
        message_share = []

    # Fetch stats for the selected user
    num_messages, num_words, num_medias, num_links,word_cloud = fetch_stats(selected_user, df)

    # Prepare the results to send to the frontend
    results = {
        'num_messages': num_messages,
        'num_words': num_words,
        'num_medias': num_medias,
        'num_links': num_links,
        'top_users': top_users,  # Empty for non-'Overall' users
        'message_share': message_share,  # Empty for non-'Overall' users
        'word_cloud':word_cloud
    }

    return jsonify({'results': results})