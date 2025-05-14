import pandas as pd

def preprocess(df):
    df = df.copy()
    df['CreatedDate'] = pd.to_datetime(df['CreatedDate'])
    df['order_hour'] = df['CreatedDate'].dt.hour
    df.drop('CreatedDate', axis=1, inplace=True)
    df.drop(columns=['nm_id', 'user_id'], inplace=True)
    return df