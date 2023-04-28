#!/bin/sh
cw="$(realpath $0)";
cw="$(dirname $cw)";

cd $cw;

./composer.phar dump-autoload;
./composer.phar update;
./composer.phar install;
./bin/console cache:clear -e prod;
./bin/console doctrine:migrations:migrate -e prod;
./bin/console assets:install --relative --symlink -e prod;
./bin/console assetic:dump -e prod;
./bin/console cache:clear -e prod;

find web -name "*.gz" -type f -delete;
find web -name "*.js" -type f -exec ./bin/ngx_gz.sh \{\} \;
find web -name "*.css" -type f -exec ./bin/ngx_gz.sh \{\} \;

