# parse-times

## Format

```
# This is a comment, it's ignored
# White lines are also ignored

# Check-in
IN:Wed, 16 Nov 2016 19:13:14 +0100
# Check-out
OUT:Wed, 16 Nov 2016 19:13:36 +0100
# Discarding time block, this IN is now invalid
IN:Wed, 16 Nov 2016 19:14:17 +0100
DISCARD:Wed, 16 Nov 2016 19:14:32 +0100
```
