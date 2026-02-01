
git add -A
git commit -m "$*"
git push 

git checkout gh-pages
git merge main
git push

git checkout main