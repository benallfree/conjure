# Laravel Conjure

Laravel Conjure is a complete Laravel frontend and backend setup, ready to create your new web app.

Out of the box, Conjure has:

- Authentication (Passport)
- Versioned API routing
- Traditional page routing
- React
- Hot module reloading
- Laravel routes exposed to frontend via Ziggy
- Semantic UI
- Deployment scripts
- Ubuntu 18LTS "fire and forget" server creation Bash script
- Laravel worker queues (Beanstalk)
- VSCode PHP formatting
- Superior serialization strategies
- Mad asset cache-busting

## Quickstart

```
git clone --depth=1 git@github.com:benallfree/laravel-boilerplate.git
# (Create an empty database)
cp .env.example .env
# (edit .env)
composer install
yarn
./artisan key:generate
./artisan migrate
./artisan passport:install
```

## Usage Guide

### Creating a new top-level screen

Create `resources/assets/js/components/MyComponent/index.js`

```js
export { Main as MyComponent } from './Main'
```

Create `resources/assets/js/components/MyComponent/Main.js`

```js
import React, { Component } from 'react'
import _ from 'lodash'
import { Api } from '../~/Api'
import { AsyncBase } from '../AsyncBase'

class Main extends ComponentBase {
  loadState() {
    return Api.ping()
  }

  renderLoaded() {
    const { status, data } = this.state.data
    return (
      <div>
        {status}:{data}
      </div>
    )
  }
}

export { Main }
```

Edit `resources/assets/js/components/Root.js`

```jsx
import { MyComponent } from './MyComponent'
...
<Route exact path="/MyComponent" component={MyComponent} />
```

Edit `resources/views/layouts/app.blade.php`

```html
<li class="nav-item">
  <a class="nav-link" href="/MyComponent">MyComponent</a>
</li>
```

### Creating a new model

Create `resources/assets/js/Models/MyModel.js`

```js
import { ModelBase } from '~/Kit'

class MyModel extends ModelBase {}

export { MyModel }
```

### Creating a new API call

Edit `routes/api.php`

```php
Route::group(['prefix' => 'v1', 'as' => 'api.', 'middleware' => ['auth:api']], function () {

  Route::get('myApiCall', ['as' => 'myApiCall', 'uses' => function () {
    return [
      'status' => 'ok',
      'data' => [
        ['title'=>'result1',]
        ['title'=>'result2']
      ]
    ];
  }]);
});
```

Test API route naming, notice `api.myApiCall` named route:

```bash
php artisan route:list | grep api
...
|        | GET|HEAD                               | api/v1/myApiCall                             | api.myApiCall         | Closure                                                                   | api,auth:api |
```

Create an API binding by editing `resources/assets/js/Api.js`

```js
import { SearchResult } from './Models/SearchResult'

...

async myApiCall() {
  const response = await this.get(route('api.myApiCall'))
  const results = new SearchResult(response.data)
  return results
}
```

Finally, create `resources/assets/js/Models/SearchResult.js` to receive your API results

```js
import { ModelBase } from '~/Kit'

class SearchResult extends ModelBase {}

export { SearchResult }
```

### Secondary database connections

http://fideloper.com/laravel-multiple-database-connections

### Using ComponentBase

The `ComponentBase` class handles complex asynchronous operations for you with ease.

**`renderLoaded()` replaces `render`**

Instead of calling `render()` directly, call `renderLoaded()`. This ensures that all initialization operations have completed first, even if they are async.

**Type #1: Initializing with Async Data**

If your component can't be used without first loading some async data, override the `loadState()` method. Your `renderLoaded()`

**Type #2: Performing Async Operations**

Calling async methods is easy. All exceptions are caught and handled:

```js
this.async(Api.ping)
```

Then, in `renderLoaded()`:

```js
# isLoading - true when loading
# isLoaded - true after loading successfully
# error - non-null if an error occurred
# response - response after isLoaded=true
const {isLoading, isLoaded, error, response} = this.async()
```

**Type #3: Performing many async operations**

This is the real gold of the class. If you have many async operations to track, each which may have its own error state:

```js
this.async(Api.ping, 'someUniqueTrackingNameOrIndex')
```

Then, in `renderLoaded()`:

```js
# isLoading - true when loading
# isLoaded - true after loading successfully
# error - non-null if an error occurred
# response - response after isLoaded=true
const {isLoading, isLoaded, error, response} = this.async('someUniqueTrackingNameOrIndex')
```
