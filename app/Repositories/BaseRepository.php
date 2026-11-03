<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    public function __construct(protected Model $model) {}

    /**
     * Query base. Herda o global scope 'tenant' da trait BelongsToTenant
     * (para Grupo A/F) ou o scope 'tenant_hibrido' (Grupo H).
     *
     * Repositórios concretos NÃO devem usar Model::query() direto —
     * sempre passar por este método (lint em 6.20).
     */
    protected function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function find(int $id): ?Model
    {
        return $this->query()->find($id);
    }

    public function findOrFail(int $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    public function all(): Collection
    {
        return $this->query()->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()->paginate($perPage);
    }

    public function create(array $data): Model
    {
        // O auto-preenchimento de id_empresa (Grupo A) é feito pela trait no creating.
        // Para Grupo F, id_filial tem que vir no $data.
        return $this->model->newQuery()->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $model = $this->findOrFail($id);
        $model->update($data);

        return $model->refresh();
    }

    public function delete(int $id): bool
    {
        return (bool) $this->findOrFail($id)->delete();
    }
}
