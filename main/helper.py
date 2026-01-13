from urlextract import URLExtract
import pandas as pd
import numpy as np
extractor=URLExtract()


def fetch_stats(selected_user,df):
    if selected_user != 'Overall':
        df=df[df['Users']==selected_user]
    num_messages=df.shape[0]
    n_words=num_words(df)
    n_medias=num_medias(df)
    n_links=num_links(df)

    return num_messages,n_words,n_medias,n_links



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
    user_counts = df['Users'].value_counts().head(15)
    message_share = np.round((user_counts / df.shape[0]) * 100,decimals=2)

    r_df = pd.DataFrame({
        'User': user_counts.index,
        'Message_Share': message_share.values
    })

    return r_df
