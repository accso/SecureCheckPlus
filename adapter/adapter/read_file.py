import os


def get_file_as_string(file_dir: str, filename: str):
    absolute_path = os.path.join(file_dir, filename)
    report_file = open(absolute_path, "r", encoding="utf8")
    report_as_string = report_file.read()
    report_file.close()
    return report_as_string
