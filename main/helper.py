def fetch_stats(selected_user,df):
    if selected_user == 'Overall':
        num_messages=df.shape[0]
        n_words=num_words(df)

        return num_messages,n_words
    
    else:
        new_df=df[df['Users']==selected_user]
        num_messages=new_df.shape[0]
        n_words=num_words(new_df)

        return num_messages,n_words



def num_words(df):
    words=[]

    for message in df['Message']:
        words.extend(message.split())
    return len(words)

