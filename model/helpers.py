import string
import random

from model.sql import check_code


def generate_short_code():
    obsolete = 'lIO0'
    allowed = ''.join([('' if c in obsolete else c)
                      for c in string.ascii_letters + string.digits])
    short_code = ''
    while True:
        short_code = ''.join(random.choices(allowed, k=6))
        checkResult = check_code(short_code)
        if checkResult is True:
            break
        elif checkResult is None:
            return None
    return short_code
