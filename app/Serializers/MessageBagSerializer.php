<?php

namespace App\Serializers;

class MessageBagSerializer extends SerializerBase
{
  public static function serialize($o, $context = [])
  {
    $ret = [];
    foreach ($o->keys() as $k) {
      $ret[$k] = $o->first($k);
    }
    return $ret;

  }
}
