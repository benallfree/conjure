<?php

namespace App\Serializers;

class MessageBagSerializer
{
  public static function serialize($o)
  {
    $ret = [];
    foreach ($o->keys() as $k) {
      $ret[$k] = $o->first($k);
    }
    return $ret;

  }
}
