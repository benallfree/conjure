let mix = require('laravel-mix')

mix
  .react('resources/assets/js/app.js', 'public/js')
  .version()
  .sass('resources/assets/sass/app.scss', 'public/css')
  .version()
