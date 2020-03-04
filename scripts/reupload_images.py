import csv
from datetime import datetime
from io import BytesIO
import os
import sys
from google.cloud import storage
from PIL import Image
import requests


BUCKET_NAME = "tagbull-bagels-donuts"


def parse_csv(csv_file):
  with open(csv_file, 'r') as f:
    reader = csv.DictReader(f)
    for entry in reader:
      yield {
        "name": entry["ImageID"],
        "url": entry["OriginalURL"]  
      }


def download_file(url):
    return BytesIO(requests.get(url).content)


def upload_file(bucket, name, f):
    blob = bucket.blob(name)
    blob.upload_from_file(f, rewind=True, content_type="image/jpeg")
    return blob.public_url


def make_name(prefix, filename):
    return "{}/{}".format(prefix, os.path.basename(filename))


def main(args):
    expected_args = ["csv file"]
    if len(args) != len(expected_args):
        args_string = " ".join(["[{}]".format(arg) for arg in expected_args])
        print("usage: python3 reupload_files.py {}".format(args_string))
        sys.exit(1)

    csv_file = args[0]

    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    prefix = datetime.now().strftime("%Y-%m-%d-%H.%M.%S")

    entries = list(parse_csv(csv_file))

    outfile_name = "{}_{}".format(prefix, os.path.basename(csv_file))

    with open(outfile_name, "w") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=["ImageID", "OriginalURL"])
        writer.writeheader()
        
        total_entries = len(entries)
        for i, entry in enumerate(entries):
            filename = entry["url"]
            try:
                original = download_file(filename)
                original_size = original.getbuffer().nbytes
                with Image.open(original) as img:
                    compressed = BytesIO()
                    img.save(compressed, format="JPEG", quality=65, optimize=True)
                    compressed_size = compressed.getbuffer().nbytes
                    new_name = make_name(prefix, filename)
                    new_url = upload_file(bucket, new_name, compressed)
                    print("Uploaded image {}/{}: {} ({}B original, {}B compressed, {:.2f}% ratio)".format(i+1, total_entries, entry["name"], original_size, compressed_size, 100 * compressed_size / original_size), file=sys.stderr)

                # Preserve column names so this CSV can be used in place of the original CSV
                writer.writerow({"ImageID": entry["name"], "OriginalURL": new_url)
            except Exception:
                print("Failed to reupload {} at url {}".format(entry["name"], filename), file=sys.stderr)

    print(outfile_name)

if __name__ == "__main__":
    main(sys.argv[1:])
