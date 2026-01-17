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
    return num_messages,n_words,n_medias,n_links,word_list,emoji_list,time_m,message_count_m,time_d,message_count_d,time_h,message_count_h



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
    """
    Generate timeline data for monthly and daily message counts
    Returns properly formatted strings for JSON serialization
    """
    # Monthly timeline
    timeline = msg_df.groupby(['Year', 'Month', 'Month_Num']).count()['Message'].reset_index()
    timeline = timeline.sort_values(by=['Year', 'Month_Num'])
    
    # Daily timeline
    tm2 = msg_df.groupby(msg_df['Date'].dt.date).count()['Message'].reset_index()
    tm2 = tm2.sort_values(by='Date')
    
    #Hourly timeline
    tm3=msg_df.groupby(msg_df['Date'].dt.hour).count()['Message'].reset_index()
    tm3=tm3.sort_value(by='Date')

    # Format monthly labels (e.g., "Jan-2024")
    time_monthly = []
    for i in range(timeline.shape[0]):
        time_monthly.append(f"{timeline['Month'].iloc[i]}-{timeline['Year'].iloc[i]}")
    
    # Format daily labels (e.g., "2024-01-15")
    time_daily = [str(date) for date in tm2['Date'].tolist()]
    time_hourly= [str(date) for date in tm3['Date'].tolist()]
    
    # Get message counts
    message_count_monthly = timeline['Message'].tolist()
    message_count_daily = tm2['Message'].tolist()
    message_count_hourly = tm3['Message'].tolist()
    
    return time_monthly, message_count_monthly, time_daily, message_count_daily,time_hourly,message_count_hourly