<?php

namespace App\Serializers;

function array_slice_assoc($array, $keys)
{
  return array_intersect_key($array, array_flip($keys));
}

class SerializerBase
{
  public static function getViews($extra = [])
  {
    $fields = static::getFields();
    return array_merge([
      'serialize' => array_keys($fields),
    ], $extra);
  }

  public static function getFields($extra = [])
  {
    $fields = array_merge([
      'id',
      'createdAt',
      'updatedAt',
    ], $extra);

    $final = [];
    foreach ($fields as $k => $v) {
      if (is_numeric($k)) {
        $k = $v;
        $v = function ($k, $o, $context, $viewName) {
          return $o->{snake_case($k)};};
      }
      $final[$k] = $v;
    }
    return $final;
  }

  public static function __callStatic($name, $arguments)
  {
    $views = static::getViews();
    if (!isset($views[$name])) {
      throw new \Exception("View {$name} is not a valid serialization view.");
    }
    $view = $views[$name];
    $allFields = static::getFields();
    $fields = array_slice_assoc($allFields, $view);
    array_unshift($arguments, $fields);
    array_unshift($arguments, $name);
    $class = get_called_class();
    return call_user_func_array(array($class, '_serialize'), $arguments);
  }

  public static function _serialize($viewName, $fields, $o, $context = [])
  {
    if (is_iterable($o)) {
      $res = [];
      foreach ($o as $obj) {
        $res[] = static::_serialize($viewName, $fields, $obj, $context);
      }
      return $res;
    }
    if (!$o) {
      return null;
    }

    $rec = [];
    foreach ($fields as $k => $v) {
      $rec[$k] = $v($k, $o, $context, $viewName);
      if (is_object($rec[$k])) {
        $class_name = get_class($rec[$k]);
        switch ($class_name) {
          case \Illuminate\Support\Carbon::class:
          case \Carbon\Carbon::class:
            $rec[$k] = (int) $rec[$k]->timestamp * 1000;
            break;
          default:
            throw new \Exception("Do no know how to serialize object ${class_name}");
        }
      }
    }
    return $rec;
  }
}
