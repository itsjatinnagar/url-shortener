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


def validateEmail(email):
    if len(email) <= 0:
        return 'Please, provide your Email'
    expression = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if re.search(expression, email) is None:
        return 'It is not a valid Email'

    return None


def validateAuthCode(user_input, auth_code):
    if len(user_input) <= 0:
        return 'Please, enter the code sent to you'
    elif user_input != auth_code:
        return 'Invalid sign in code'

    return None
