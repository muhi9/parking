./bin/console cache:clear -e prod;
./bin/console assets:install --relative --symlink -e prod && ./bin/console assetic:dump -e prod;
