# Google personal and work calendars sysc

This repository contains a script that I wrote for myself.

## Problem: I have two calendars:

- one is my personal calendar linked to my Google account - x.xxxxx@gmail.com
- the second is my work calendar linked to my Google Workspace account

## Algorythm

I needed to synchronize the calendars as follows:

- I manage my personal calendar the way I want.
- Personal events are reflected in my work calendar as "free-busy" time blocks without details.
- Work events are reflected in my personal calendar with details.
- When changes are made to any events, they are updated in both calendars following these same rules.

Additionally, on different computers, I use two different languages—Russian and English.

This script:

- assigns a unique identifier to each event
- implements this synchronization algorithm

## Status

The script is functioning and currently updates all my events.

(c) Pliss Mikhail 27.09.2024"






