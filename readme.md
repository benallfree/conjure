# Laravel Conjure

Laravel Conjure is a complete Laravel frontend and backend setup, ready to create your new app.

Out of the box, Conjure has:

- Authentication (Passport)
- Versioned API routing
- Traditional page routing
- React
- Laravel routes exposed to frontend via Ziggy
- Semantic UI
- Deployment scripts
- Ubuntu 18LTS "fire and forget" server creation Bash script
- Laravel worker queues (Beanstalk)

## Quickstart

```
git clone --depth=1 git@github.com:benallfree/laravel-boilerplate.git
cp .env.example .env
# (edit .env)
# (Create an empty database)
composer install
yarn
./artisan key:generate
./artisan migrate
```
