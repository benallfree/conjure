const mix = require('laravel-mix')
const Dotenv = require('dotenv-webpack')

mix.webpackConfig({
  plugins: [new Dotenv()],
})
mix
  .react('resources/assets/js/Kit/app.js', 'public/js')
  .sass('resources/assets/sass/app.scss', 'public/css')

if (mix.inProduction()) {
  mix.version()
}
