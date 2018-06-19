from flask import Flask
from flask import render_template
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL(app)

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'project1-web'
app.config['MYSQL_DATABASE_PASSWORD'] = 'webpassword'
app.config['MYSQL_DATABASE_DB'] = 'project1'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


def get_data(sql, params=None):
    conn = mysql.connect()
    cursor = conn.cursor()
    print("getting data")
    try:
        print(sql)
        cursor.execute(sql, params)
    except Exception as e:
        print(e)
        return False

    result = cursor.fetchall()
    data = []
    for row in result:
        data.append(list(row))
    cursor.close()
    conn.close()

    return data


def set_data(sql, params=None):
    conn = mysql.connect()
    cursor = conn.cursor()
    print("Setting Data")
    # try:
    print(sql)
    cursor.execute(sql, params)
    conn.commit()
    # except Exception as e:
    # print(e)
    # return False

    # result = cursor.fetchall()
    # data = []
    # for row in result:
    # data.append(list(row))
    data = "Done"
    cursor.close()
    conn.close()

    return data


def get_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


@app.route('/')
def start():
    read_values()
    humid = give_value_humid()
    temp = give_value_temp()
    max_temp = get_data("SELECT MAX(value) from humid_temp WHERE kind_value = 1")
    max_humid = get_data("SELECT MAX(value) from humid_temp WHERE kind_value = 2")
    min_temp = get_data("SELECT MIN(value) from humid_temp WHERE kind_value = 1")
    min_humid = get_data("SELECT MIN(value) from humid_temp WHERE kind_value = 2")
    return render_template("Home.html", humid=humid, temp=temp, max_humid=max_humid, max_temp=max_temp,
                           min_temp=min_temp, min_humid=min_humid)


# @app.route('/calendar')
# def calendar():
#     titels = get_data("select column_name from information_schema.columns where table_name='afspraken'")
#     data = get_data("SELECT * FROM afspraken")
#     print(data)
#     return render_template("calendar.html", data = data, titels= titels)

@app.route('/weather')
def weather():
    return render_template("weather.html")


@app.route('/about')
def about():
    return render_template("About.html")


@app.route('/monitor')
def monitor():
    temp = give_value_temp()
    humid = give_value_humid()
    ip = get_ip()
    return render_template("monitor_scherm.html", ip=ip, temp=temp, humid=humid)


def read_values():
    import DHT11
    values = DHT11.temp_readout()
    humid = int(values["humidity"])
    temp = int(values["temperature"])
    set_data("INSERT INTO project1.humid_temp (Value,Kind_Value) VALUES((%s),1)", temp)
    set_data("INSERT INTO project1.humid_temp (Value,Kind_Value) VALUES((%s),2)", humid)


def give_value_temp():
    temp_list = []
    temp_value = get_data("SELECT value FROM humid_temp where kind_value = 1")

    temp_list.append(temp_value)
    for item in temp_list:
        return item[-1]


def give_value_humid():
    humid_list = []
    humid_value = get_data("SELECT value FROM humid_temp where kind_value = 2")
    humid_list.append(humid_value)
    for item in humid_list:
        return item[-1]


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
