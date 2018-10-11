<?php

namespace App\Traits;

trait Recalculatable
{
  protected $recalc_relations = [];

  public function recalc($should_save = true)
  {
    \Log::debug("Recalc " . get_class($this) . " {$this->id}");

    if (method_exists($this, '_recalc')) {
      $this->_recalc();
    }

    $methods = get_class_methods($this);
    foreach ($methods as $m) {
      if (substr($m, 0, 5) !== "calc_") {
        continue;
      }
      \Log::debug("$m");
      $this->$m();
    }

    if ($should_save) {
      $this->save();
    }

  }

  public static function recalc_all($should_save = true)
  {
    \Log::debug("Recalc all " . get_called_class());

    $q = self::query();
    if (method_exists(get_called_class(), '_recalc_all_query')) {
      $q = self::_recalc_all_query();
    }

    $all = $q->chunk(50, function ($all) use ($should_save) {
      foreach ($all as $u) {
        $u->recalc($should_save);
      }
    });
  }
}
