<?php

namespace App\Traits;

use App\Services\HashService;

trait HasHashedFields
{
    protected static function bootHasHashedFields(): void
    {
        \Log::info('bootHasHashedFields registered for '.static::class);

        static::saving(function ($model) {
            \Log::info('saving event fired for '.get_class($model));
            $model->applyHashedFields();
        });
    }

    /**
     * Populate *_hash columns for every field declared in $hashable.
     * Anything not listed (foreign keys, ids, timestamps, etc.) is left untouched.
     */
    public function applyHashedFields(): void
    {
        \Log::info('applyHashedFields called', ['hashable_count' => count($this->hashable ?? [])]);
        foreach ($this->hashable ?? [] as $field => $options) {
            if (is_int($field)) {
                $field = $options;
                $options = [];
            }

            // Explicit per-model exclusion (e.g. conditionally skip an FK-backed field)
            if (in_array($field, $this->hashExclude ?? [], true)) {
                continue;
            }

            // Only rehash if the source field actually changed (or the record is new)
            if ($this->exists && ! $this->isDirty($field)) {
                continue;
            }

            $hashColumn = $options['column'] ?? "{$field}_hash";

            // Skip silently if this model's table doesn't actually have that hash column
            if (! $this->hasHashColumn($hashColumn)) {
                continue;
            }

            $this->setAttribute($hashColumn, HashService::make($this->getAttribute($field)));
        }
    }

    protected function hasHashColumn(string $column): bool
    {
        static $cache = [];
        $table = $this->getTable();

        return $cache["{$table}.{$column}"] ??= \Schema::hasColumn($table, $column);
    }

    /**
     * Query scope: Student::whereHash('lname', 'Dela Cruz')
     */
    public function scopeWhereHash($query, string $field, ?string $value)
    {
        $options = $this->hashable[$field] ?? $this->hashable[array_search($field, $this->hashable ?? [], true)] ?? [];
        $column = is_array($options) ? ($options['column'] ?? "{$field}_hash") : "{$field}_hash";

        return $query->where($column, HashService::make($value));
    }
}
