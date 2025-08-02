#!/bin/bash
pm2 --name BookTrackerAPI start npm -- start --prefix ./api --watch
unset HOST
pm2 --name BookTracker start npm -- start --prefix ./book-tracker --watch