<?php

namespace App\Serializers;

class UserSerializer
{
  public static function serialize($o)
  {
    if (is_iterable($o)) {
      $res = [];
      foreach ($o as $obj) {
        $res[] = self::serialize($obj);
      }
      return $res;
    }
    $rec = [
      'id' => $o->id,
      'name' => $o->name,
      'email' => $o->email,
      'created_at' => $o->created_at->toRfc822String(),
      'updated_at' => $o->created_at->toRfc822String(),
    ];
    return $rec;
  }
}
