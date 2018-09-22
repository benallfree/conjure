<?php
return [
  'enabled' => env('LOG_QUERIES', false),
  'file_path' => storage_path('logs/query_logger.log'),
];
