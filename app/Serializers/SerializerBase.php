<?php

namespace App\Serializers;

class SerializerBase
{
  public static function getFields($extra = [])
  {
    return array_merge([
      'id',
      'created_at' => function ($k, $o) {return $o->$k->toRfc822String();},
      'updated_at' => function ($k, $o) {return $o->$k->toRfc822String();},
    ], $extra);
  }

  public static function serialize($o)
  {
    if (is_iterable($o)) {
      $res = [];
      foreach ($o as $obj) {
        $res[] = static::serialize($obj);
      }
      return $res;
    }
    $rec = [];
    $fields = static::getFields();
    foreach ($fields as $k => $v) {
      if (is_numeric($k)) {
        $k = $v;
        $v = function ($k, $o) {return $o->$k;};
      }
      $rec[$k] = $v($k, $o);
    }
    return $rec;
  }
}
