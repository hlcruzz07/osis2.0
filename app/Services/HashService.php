<?php

namespace App\Services;

class HashService
{
    /**
     * Deterministic hash for exact-match lookups (e.g. searching encrypted columns).
     * Normalizes case/whitespace so "Dela Cruz" and "dela cruz " hash the same.
     */
    public static function make(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return hash_hmac(
            'sha256',
            mb_strtolower(trim($value)),
            config('hashing.lookup_key', config('app.key'))
        );
    }

    /**
     * Build a [field_hash => hash] map for a given data array + list of fields.
     * Useful for raw DB::table()->insert() / bulk inserts where model events don't fire.
     */
    public static function forFields(array $data, array $fields): array
    {
        $hashes = [];

        foreach ($fields as $field => $options) {
            if (is_int($field)) {
                $field = $options;
                $options = [];
            }

            if (! array_key_exists($field, $data)) {
                continue;
            }

            $column = $options['column'] ?? "{$field}_hash";
            $hashes[$column] = static::make($data[$field]);
        }

        return $hashes;
    }

    /**
     * Prepare an array of rows (e.g. for Model::insert() or DB::table()->insert())
     * by appending hash columns to each row.
     */
    public static function prepareRowsForInsert(array $rows, array $fields): array
    {
        return array_map(
            fn (array $row) => array_merge($row, static::forFields($row, $fields)),
            $rows
        );
    }
}
