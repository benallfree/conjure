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
    $fields = static::_getFields();
    return array_merge([
      'serialize' => array_keys($fields),
    ], $extra);
  }

  public static function getFields($extra = [])
  {
    return array_merge([
      'id',
      'created_at' => function ($k, $o, $context) {return $o->$k->toRfc822String();},
      'updated_at' => function ($k, $o, $context) {return $o->$k->toRfc822String();},
    ], $extra);
  }

  protected static function _getFields()
  {
    $fields = static::getFields();
    $final = [];
    foreach ($fields as $k => $v) {
      if (is_numeric($k)) {
        $k = $v;
        $v = function ($k, $o, $context, $viewName) {return $o->$k;};
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
    $allFields = static::_getFields();
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
    $rec = [];
    foreach ($fields as $k => $v) {
      $rec[$k] = $v($k, $o, $context, $viewName);
    }
    return $rec;
  }
}
