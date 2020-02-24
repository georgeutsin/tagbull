#!/usr/bin/python3

import csv
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

def create_project(server_url, project_name):
  url = "{}/projects".format(server_url)
  body = {"name": project_name}
  request = Request(url,
    method="POST",
    headers={
      "Content-Type": "application/json",
    },
    data=json.dumps(body).encode("utf-8")
  )
  response = urlopen(request).read().decode()
  return json.loads(response)["data"]["id"]

def parse_csv(csv_file):
  with open(csv_file, 'r') as f:
    reader = csv.DictReader(f)
    for entry in reader:
      yield {
        "name": entry["ImageID"],
        "url": entry["OriginalURL"]  
      }

def create_tasks(server_url, project_id, media):
  url = "{}/projects/{}/tasks".format(server_url, project_id)
  body = {
    "task_type": "DichotomyTask",
    "first": "Donut",
    "second": "Bagel",
    "parent_category": "Baked good",
    "media": list(media)
  }
  request = Request(url,
    method="POST",
    headers={
      "Content-Type": "application/json",
    },
    data=json.dumps(body).encode("utf-8")
  )
  response = urlopen(request).read().decode()
  return len(json.loads(response)["data"])

def main(args):
  expected_args = ["server url", "project name", "csv file"]
  if len(args) != len(expected_args):
    args_string = " ".join(["[{}]".format(arg) for arg in expected_args])
    print("usage: python3 create_bagels_donuts_project.py {}".format(args_string))
    sys.exit(1)

  server_url, project_name, csv_file = args

  project_id = create_project(server_url, project_name)
  print("Created new project with id {}.".format(project_id))

  media = parse_csv(csv_file)
  num_tasks = create_tasks(server_url, project_id, media)
  print("Created {} tasks for the new project.".format(num_tasks))


if __name__ == "__main__":
  main(sys.argv[1:])