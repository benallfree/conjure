<?php
namespace App;

use App\Traits\Recalculatable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use malkusch\lock\mutex\MySQLMutex;

class ModelBase extends Model
{
  use Recalculatable;

  protected $computed = [];
  public function __construct(array $attributes = [])
  {
    parent::__construct($attributes);
    $final = [];
    foreach ($this->getComputed() as $k => $serializers) {
      if (is_numeric($k)) {
        $k = $serializers;
        $parts = explode('_', $k);
        array_pop($parts);
        $relationName = camel_case(join('_', $parts));
        $serializers = function () use ($relationName) {
          return $this->$relationName()->count();
        };
      }
      if (!is_array($serializers)) {
        $valueGetter = $serializers;
        $serializers = [
          'serialize' => function ($context = []) use ($valueGetter) {
            $v = $valueGetter($context);
            if ($v instanceof Model) {
              return [
                'type' => 'eloquent.model',
                'data' => [
                  'class' => get_class($v),
                  'attributes' => $v->toArray(),
                ],
              ];
            }
            if ($v instanceof Relation) {
              $v = $v->get();
            }
            if ($v instanceof Collection) {
              return [
                'type' => 'eloquent.collection',
                'data' => $v->map(function ($item, $key) {
                  return [
                    'key' => $key,
                    'class' => get_class($item),
                    'attributes' => $item->toArray(),
                  ];
                }),
              ];
            }
            return ['type' => 'native', 'data' => $v];
          },
          'deserialize' => function ($serializeInfo) {
            extract($serializeInfo);
            switch ($type) {
              case 'eloquent.model':
                $o = new $data['class']();
                $o->forceFill($data['attributes']);
                return $o;
              case 'eloquent.collection':
                $c = new Collection();
                foreach ($data as $modelInfo) {
                  $o = new $modelInfo['class']();
                  $o->forceFill($modelInfo['attributes']);
                  $c->put($modelInfo['key'], $o);
                }
                return $c;
              default:
                return $data;
            }
          },
        ];
      }
      $final[$k] = $serializers;
    }
    $this->computed = $final;
  }

  public static function atomic($key, $cb)
  {
    $pdo = new \PDO(sprintf("mysql:host=%s;dbname=%s", env('DB_HOST'), env('DB_DATABASE')), env('DB_USERNAME'), env('DB_PASSWORD'));

    $mutex = new MySQLMutex($pdo, $key, 15);
    $mutex->synchronized($cb);
  }

  public function __call($method, $parameters)
  {
    foreach ($this->computed as $k => $v) {
      switch ($method) {
        case 'forget_' . $k:
          return $this->forgetCacheKey($k);
        case $k:
          $context = $parameters[0];
          return $this->getCachedValue($method, $context);

      }
    }

    return parent::__call($method, $parameters);
  }

  protected function getCachedValue($name, $context = [])
  {
    $context['name'] = $name;
    $key = $this->cacheKeyFor($this->id, $context);
    if (!array_key_exists($key, $this->keyCache)) {
      extract($this->computed[$name]);
      $serialized = \Cache::rememberForever($key, function () use ($serialize, $context) {
        $serialized = $serialize($context);
        return $serialized;
      });
      $this->keyCache[$key] = $deserialize($serialized);
    }

    return $this->keyCache[$key];

  }

  protected function getComputed()
  {
    return $this->computed;
  }

  public static function cacheKeyFor($id, $keys)
  {
    if (!is_array($keys)) {
      $keys = ['name' => $keys];
    }
    $keys['__id'] = $id;
    $keys['__class'] = get_called_class();
    ksort($keys);
    $joined = [];
    foreach ($keys as $k => $v) {
      $joined[] = join(':', [$k, $v]);
    }
    $key = join('|', $joined);
    return $key;
  }

  public static function forgetCacheKeyFor($id, $name)
  {
    $key = self::cacheKeyFor($id, $name);
    self::atomic($key, function () use ($key) {
      \Cache::forget($key);
    });
  }

  public function cacheKey($name)
  {
    return self::cacheKeyFor($this->id, $name);
  }

  public function forgetCacheKey($name)
  {
    return self::forgetCacheKeyFor($this->id, $name);
  }

  public function hasGetMutator($key)
  {
    if (array_key_exists($key, $this->computed)) {
      return true;
    }
    return parent::hasGetMutator($key);
  }

  protected $keyCache = [];
  protected function mutateAttribute($key, $value)
  {
    if (array_key_exists($key, $this->computed)) {
      return $this->getCachedValue($key);
    }
    return parent::mutateAttribute($key, $value);
  }
}
