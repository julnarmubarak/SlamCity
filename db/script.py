import json
import mysql.connector

# Load JSON data
with open('./tables.json', 'r') as file:
    data = json.load(file)

print("done 0")
# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=""
)

print("done 0.5")
cursor = db.cursor()

# Create Database
print("done 1")
cursor.execute("CREATE DATABASE IF NOT EXISTS j_basket")
print("done 2")
cursor.execute("USE j_basket")
print("done 3", len(data['tables'].items()))
# Create Tables
for table_name, table_info in data['tables'].items():
    columns = ", ".join([f"{col_name} {properties}" for col_name, properties in table_info['columns'].items()])
    create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns})"
    print(create_table_query)
    cursor.execute(create_table_query)

# Close Connection
cursor.close()
db.close()
