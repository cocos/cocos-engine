git checkout -- .
git pull fireball v1.4
git submodule update --init
gulp make-simulator
gulp make-prebuilt