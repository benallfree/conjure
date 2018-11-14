const mix = require('laravel-mix')

mix
  .react('resources/assets/js/Kit/app.js', 'public/js')
  .sass('resources/assets/sass/app.scss', 'public/css')

if (mix.inProduction()) {
  mix.version()
}
