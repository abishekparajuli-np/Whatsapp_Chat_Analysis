from flask import render_template, request, jsonify
from main.preprocessor import preprocess
import os
from main import app
from main.helper import fetch_stats, busiest_user,word_cloud_words


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        chat_file = request.files.get('chat_file')

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], chat_file.filename)
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
    data = request.json
    selected_user = data.get('selected_user')
    chat_file_name = data.get('file_name')

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], chat_file_name)

 
    with open(filepath, 'r', encoding='utf-8') as f:
        chat_data = f.read()

 
    df = preprocess(chat_data)

    if selected_user == 'Overall':
        top_busiest_user_df = busiest_user(df)
        top_users = top_busiest_user_df['User'].tolist()
        message_share = top_busiest_user_df['Message_Share'].tolist()
    else:
        top_users = []
        message_share = []

    num_messages, num_words, num_medias, num_links,word_cloud,emoji_list,time_m,message_count_m,time_d,message_count_d,time_h,message_count_h,message_count_monthly,message_count_weekly,day_names,month_names,pivot= fetch_stats(selected_user, df)

    results = {
        'num_messages': num_messages,
        'num_words': num_words,
        'num_medias': num_medias,
        'num_links': num_links,
        'top_users': top_users,  
        'message_share': message_share,  
        'emoji_list':emoji_list,
        'time_m':time_m,
        'time_d':time_d,
        'time_h':time_h,
        'message_count_m':message_count_m,
        'message_count_d':message_count_d,
        'message_count_h':message_count_h,
        'message_count_mn':message_count_monthly,
        'message_count_dn':message_count_weekly,
        'day_name':day_names,
        'month_name':month_names,
        'heatmap_days': pivot.index.tolist(),     
        'heatmap_periods': pivot.columns.tolist(),  
        'heatmap_values': pivot.values.tolist()
    }
    return jsonify({'results': results})