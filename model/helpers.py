import string
import random


def generate_short_code():
    obsolete = 'lIO0'
    allowed = ''.join([('' if c in obsolete else c)
                      for c in string.ascii_letters + string.digits])
    short_code = ''.join(random.choices(allowed, k=6))
    return short_code
