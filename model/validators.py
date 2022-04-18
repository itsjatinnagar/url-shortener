import re


def validateURL(long_url):
    if len(long_url) <= 0:
        return 'Please, provide a valid URL'
    if len(long_url) > 2000:
        return 'URL too looonng'
    expression = '[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'
    if re.search(expression, long_url) is None:
        return 'It is not a valid URL'

    return None
