@echo off
set /p var=Please Enter a Commit:
echo %var%
git add .
git commit -am "%var%"
git push heroku master
heroku open