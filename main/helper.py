from urlextract import URLExtract
import pandas as pd
import numpy as np
from collections import Counter
import re
import emoji
from collections import Counter
from wordcloud import STOPWORDS
extractor=URLExtract()


def fetch_stats(selected_user,df):
    if selected_user != 'Overall':
        df=df[df['Users']==selected_user]
    num_messages=df.shape[0]
    n_words=num_words(df)
    n_medias=num_medias(df)
    n_links=num_links(df)
    word_list=word_cloud_words(df)
    emoji_list=most_frequent_emoji(df)
    time_m,message_count_m,time_d,message_count_d=timeline_data(df)
    return num_messages,n_words,n_medias,n_links,word_list,emoji_list,time_m,message_count_m,time_d,message_count_d



def num_words(df):
    words=[]

    for message in df['Message']:
        words.extend(message.split())
    return len(words)

def num_medias(df):
    n_medias=df[df['Message'] == '<Media omitted>\n'].shape[0]
    return n_medias

def num_links(df):
    links=[]
    for message in df['Message']:
        links.extend(extractor.find_urls(message))
    return len(links)

def busiest_user(df):
    user_counts = df['Users'].value_counts().head(30)
    message_share = np.round((user_counts / df.shape[0]) * 100,decimals=2)

    r_df = pd.DataFrame({
        'User': user_counts.index,
        'Message_Share': message_share.values
    })

    return r_df

def word_cloud_words(msg_df):
    NEPALI_STOPWORDS = {
    "hai","nai","la","huss","hunxa","hola","haina","lai","xaina","tyo","pani","haru","chai","gara","tei"
    }

    SYSTEM_WORDS = {
        "media", "omitted", "message", "deleted",
        "joined", "left", "added", "removed",
        "changed", "created", "group"
    }

    word_list = []
    text = ""

    for msg in msg_df["Message"]:
        msg = str(msg).lower().strip()

        if "media omitted" in msg:
            continue

        msg = re.sub(r"http\S+", "", msg)

        msg = emoji.replace_emoji(msg, replace="")

        msg = re.sub(r"[^a-zA-Z\u0900-\u097F\s]", "", msg)

        text += msg + " "

    words = text.split()

    filtered_words = [
        word for word in words
        if (
            word not in STOPWORDS and
            word not in NEPALI_STOPWORDS and
            word not in SYSTEM_WORDS and
            len(word) > 2
        )
    ]

    word_freq = Counter(filtered_words)
    word_list = [[word, count] for word, count in word_freq.items()]
    return word_list

def most_frequent_emoji(msg_df):
    emojis=[]
    for msg in msg_df['Message']:
        for word in msg.split():
            if emoji.is_emoji(word):
                emojis.extend(word)
    emoji_freq=Counter(emojis)  
    emoji_list=[[emojim,count] for emojim,count in emoji_freq.items() ] 
    emoji_list.sort(key= lambda x : x[1],reverse=True)
    return emoji_list


def timeline_data(msg_df):
    timeline=msg_df.groupby(['Year','Month','Month_Num']).count()['Message'].reset_index()
    tm2=msg_df.groupby(msg_df['Date'].dt.date).count()['Message'].reset_index()
    time=[]
    for i in range(timeline.shape[0]):
        time.append(timeline['Month'][i]+'-'+str(timeline['Year'][i]))
    return time,timeline['Message'].tolist(),tm2['Date'].tolist(),tm2['Message'].tolist()