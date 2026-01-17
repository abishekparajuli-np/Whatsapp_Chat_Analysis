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
    time_m,message_count_m,time_d,message_count_d,time_h,message_count_h=timeline_data(df)
    message_count_monthly,message_count_weekly,day_names,month_names=bar_data(df)
    pivot=heat_map(df)
    return num_messages,n_words,n_medias,n_links,word_list,emoji_list,time_m,message_count_m,time_d,message_count_d,time_h,message_count_h,message_count_monthly,message_count_weekly,day_names,month_names,pivot



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

    timeline = msg_df.groupby(['Year', 'Month', 'Month_Num']).count()['Message'].reset_index()
    timeline = timeline.sort_values(by=['Year', 'Month_Num'])

    tm2 = msg_df.groupby(msg_df['Date'].dt.date).count()['Message'].reset_index()
    tm2 = tm2.sort_values(by='Date')

    tm3=msg_df.groupby(msg_df['Date'].dt.hour).count()['Message'].reset_index()
    tm3=tm3.sort_values(by='Date')

    time_monthly = []
    for i in range(timeline.shape[0]):
        time_monthly.append(f"{timeline['Month'].iloc[i]}-{timeline['Year'].iloc[i]}")
 
    time_daily = [str(date) for date in tm2['Date'].tolist()]
    time_hourly= [str(date) for date in tm3['Date'].tolist()]
    
    message_count_monthly = timeline['Message'].tolist()
    message_count_daily = tm2['Message'].tolist()
    message_count_hourly = tm3['Message'].tolist()
    
    return time_monthly, message_count_monthly, time_daily, message_count_daily,time_hourly,message_count_hourly

def bar_data(msg_df):
    day_df=msg_df.groupby(['Day_Week','Week_Num']).count()['Message'].reset_index()
    day_df.sort_values(by=['Week_Num'],inplace=True)

    month_df=msg_df.groupby(['Month','Month_Num']).count()['Message'].reset_index()
    month_df.sort_values(by=['Month_Num'],inplace=True)
    
    message_count_weekly=day_df['Message'].tolist()
    message_count_monthly=month_df['Message'].tolist()
    
    day_names=day_df['Day_Week'].tolist()
    month_names=month_df['Month'].tolist()

    return message_count_monthly,message_count_weekly,day_names,month_names

def heat_map(msg_df):
    pivot = msg_df.pivot_table(
    index='Day_Week', 
    columns='Period', 
    values='Message', 
    aggfunc='count'
    ).fillna(0)
    return pivot