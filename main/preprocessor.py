import re
import datetime as dt
import pandas as pd

def preprocess(text):
    pattern = '\d{1,2}/\d{1,2}/\d{2,4},\s\d{1,2}:\d{2}\s-\s'

    message=re.split(pattern,text)[1:]
    date=re.findall(pattern,text)

    msg_df=pd.DataFrame({'Date':date,'Message':message})

    msg_df['Date'] = pd.to_datetime(
    msg_df['Date'],
    format='%d/%m/%y, %H:%M - ')
    users=[]
    messages=[]
    for  message_n in msg_df['Message']:
        entry=re.split(r'([\w\W]+?):\s',message_n)
        if entry[1:]:
            users.append(entry[1])
            messages.append(entry[2])
        else:
            users.append('group_notification')
            messages.append(entry[0])
    msg_df['Users']=users
    msg_df['Message']=messages
    msg_df['Year']=msg_df['Date'].dt.year
    msg_df['Month']=msg_df['Date'].dt.month_name()
    msg_df['Month_Num']=msg_df['Date'].dt.month
    msg_df['Day']=msg_df['Date'].dt.day
    msg_df['Day_Week']=msg_df['Date'].dt.day_name()
    msg_df['Week_Num']=msg_df['Date'].dt.weekday
    msg_df['Hour']=msg_df['Date'].dt.hour
    msg_df['Minute']=msg_df['Date'].dt.minute

    period = []
    for hour in msg_df[['Day_Week', 'Hour']]['Hour']:
        if hour == 23:
            period.append(str(hour) + "-" + str('00'))
        elif hour == 0:
            period.append(str('00') + "-" + str(hour + 1))
        else:
            period.append(str(hour) + "-" + str(hour + 1))

    msg_df['Period'] = period

    return msg_df
    





    