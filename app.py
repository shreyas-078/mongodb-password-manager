from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
import json

# Add a json file with the name "mongo_uri.json" with your mongoDB Database connection string followed by a /<your_database_name>
with open("./mongo_uri.json", "r") as file:
    mongoData = json.load(file)

mongoUri = mongoData["MONGO-URI"]

app = Flask(__name__, static_folder="static", static_url_path="/static")
app.config["MONGO_URI"] = mongoUri
mongo = PyMongo(app)

collection = mongo.db.Password  # Edit according to your collection name


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


@app.route("/fetch-details", methods=["POST"])
def fetch_details():
    data = request.get_json()
    platform_name = data.get("platformName")
    result = collection.find({"platformName": platform_name})
    result_list = list(result)

    for record in result_list:
        record["_id"] = str(record["_id"])

    return jsonify(result_list)


@app.route("/add-platform", methods=["POST"])
def add_platform():
    data = request.get_json()
    platform_name = data.get("platformName")
    username = data.get("platformUserName")
    password = data.get("platformPass")

    platform_to_insert = {
        "platformName": platform_name,
        "platformUsername": username,
        "platformPass": password,
    }

    result = collection.find({"platformName": platform_name})
    result_list = list(result)

    if len(result_list) > 0:
        return jsonify({"error": "Platform Exists Already"})

    collection.insert_one(platform_to_insert)

    return jsonify({"message": "Platform Added!"})


@app.route("/fetch-all-platforms", methods=["GET"])
def fetch_all_platforms():
    all_records = collection.find()

    records_list = []
    for record in all_records:
        record["_id"] = str(record["_id"])
        records_list.append(record)

    return jsonify(records_list)


@app.route("/remove-details", methods=["POST"])
def remove_details():
    data = request.get_json()
    platform_name = data.get("platformName")

    collection.delete_one({"platformName": platform_name})

    return jsonify({"message": "Removal Successful!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
