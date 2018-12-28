# Motivation
Be notified for videos uploaded to YouTube relevant to selected terms.

# Mechanics
This is a script written in GoogleScript, controlled by a Google Spreadsheet, which executes daily and queries the YouTube Api for specific terms.
The results are emailed to a specified email account.

# Spreadsheet Specification
Column A is dedicated to the terms for which you are querying YouTube.
For each term you care, add a row in column A.

Column B describes the values of column C.
Column C specifies the parameters used to query YouTube and send the final email.

Cell B1 has the value "Number of Terms to Query" and cell C1 has the value 1000-COUNTBLANK(A1:A1000)
Cell B2 has the value "Email recipient" and cell C2 has the value e.g. "foo@bar.com"
Cell B3 has the value "Max Videos Per Term" and cell C3 has the value e.g. 5
Cell B4 has the value "Email Title: and cell C4 has the value e.g. "Daily Report from YouTube"

