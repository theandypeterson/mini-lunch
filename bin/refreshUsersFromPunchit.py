import urllib
import json
import psycopg2
import os
from pprint import pprint

offices = {1: 'AOGR', 2: 'AOA2', 3: 'DETROIT', 4: 'GLOBAL'}

def grabEmployeeData (employee) :
    employeeNamesList = employee["name"].split()

    if (len(employeeNamesList) == 2):
        # git blame Andy Peterson
        if (employeeNamesList[1] == 'William'):
            employeeNamesList[1] = 'Will'
        if (employeeNamesList[1] == 'Kimberly'):
            employeeNamesList[1] = 'Kim'
        employeeFormatedName = employeeNamesList[1] + " " + employeeNamesList[0][:-1]
    else:
        employeeFormatedName = employee["name"]

    return {
        'name': employeeFormatedName.replace("\'", "\'\'"),
        'id': employee["id"],
        'active': employee["active"],
        'full_time': employee["full_time"],
        'office': offices[employee["office"]["id"]]
    }

def generateSqlQueries (employee) :
    return """INSERT INTO users(user_id, name, active, full_time, office) VALUES ({0}, '{1}', {2}, {3}, '{4}') ON CONFLICT (user_id) DO UPDATE SET name = '{1}', active={2}, full_time={3}, office='{4}'""".format(employee['id'], employee['name'], employee['active'], employee['full_time'], employee['office'])

print "Requesting employees from punchit api..."
punchit_username = os.environ['PUNCHIT_USERNAME']
punchit_password = os.environ['PUNCHIT_PASSWORD']
print "https://{0}:{1}@punchit.atomicobject.com/api/employees".format(punchit_username, punchit_password)
data = json.load(urllib.urlopen("https://{0}:{1}@punchit.atomicobject.com/api/employees".format(punchit_username, punchit_password)))
print "Received employee data from punchit!"

print "Filtering the results to only active employees..."
modified_data = map(grabEmployeeData, data)
print "Generating SQL Queries..."
queries = map(generateSqlQueries, modified_data)

print "Inserting records into the database..."
try:
    # TODO: Create database connection based on contents of knexfile.js
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    map(cur.execute, queries)

    conn.commit()
    print "Process complete, exiting now..."
except Exception as e:
    print "--Issues inserting records into the database--"
    print e
