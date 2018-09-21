<?php

namespace App\Serializers;

class UserSerializer extends SerializerBase
{
  public static function getFields($extra = [])
  {
    $fields = parent::getFields([
      'name',
      'email',
    ]);
    return $fields;
  }
}
