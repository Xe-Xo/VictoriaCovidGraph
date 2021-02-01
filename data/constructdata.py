import pandas as pd
import numpy as np
from datetime import datetime

casesdf = pd.read_html('https://covidlive.com.au/report/daily-cases/vic')[1]


data = []
for cases, date in zip(casesdf['CASES'], casesdf['DATE']):
    try:
        date = np.datetime64(datetime.strptime(date, "%d %b %y"), 'h')
    except ValueError:
        continue
    
    data.append((date, cases))

data.sort()

dates, cases = [np.array(a) for a in zip(*data)]
new = np.diff(cases, prepend=0)


print(pd.DataFrame({'dates': dates, 'new': new}))
pd.DataFrame({'dates': dates, 'new': new}).to_json(r'data\data.json')

