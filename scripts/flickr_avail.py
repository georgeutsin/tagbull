import csv
from datetime import datetime
from io import BytesIO
import os
import sys
import requests


def parse_csv(csv_file):
  with open(csv_file, 'r') as f:
    reader = csv.DictReader(f)
    for entry in reader:
      yield {
        "name": entry["ImageID"],
        "url": entry["Thumbnail300KURL"]  
      }


def download_file(url):
    return BytesIO(requests.get(url).content)

def main(args):
    expected_args = ["csv file"]
    if len(args) != len(expected_args):
        args_string = " ".join(["[{}]".format(arg) for arg in expected_args])
        print("usage: python3 flickr_avail.py {}".format(args_string))
        sys.exit(1)

    csv_file = args[0]

    prefix = datetime.now().strftime("%Y-%m-%d-%H.%M.%S")

    entries = list(parse_csv(csv_file))

    outfile_name = "{}_{}".format(prefix, os.path.basename(csv_file))

    with open(outfile_name, "w") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=["name", "url"])
        writer.writeheader()
        
        total_entries = len(entries)
        for i, entry in enumerate(entries):
            filename = entry["url"]
            try:
                original = download_file(filename)
                writer.writerow({"name": entry["name"], "url": entry["url"]})
            except Exception:
                print("Failed to reupload {} at url {}".format(entry["name"], filename), file=sys.stderr)

    print(outfile_name)

if __name__ == "__main__":
    main(sys.argv[1:])
