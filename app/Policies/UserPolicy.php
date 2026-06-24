<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Permite a los Administradores hacer cualquier cosa.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('ADMINISTRADOR')) {
            return true;
        }

        return null; // Fall through to specific methods
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['RESPONSABLE', 'COORDINADOR']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        if ($user->hasRole('RESPONSABLE')) {
            return $user->canton_id === $model->canton_id;
        }

        if ($user->hasRole('COORDINADOR')) {
            return $user->recinto_id === $model->recinto_id;
        }

        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['RESPONSABLE', 'COORDINADOR']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        if ($user->hasRole('RESPONSABLE')) {
            return $user->canton_id === $model->canton_id && $model->hasRole('DIGITADOR');
        }

        if ($user->hasRole('COORDINADOR')) {
            return $user->recinto_id === $model->recinto_id && $model->hasRole('VEEDOR');
        }

        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        if ($user->hasRole('RESPONSABLE')) {
            return $user->canton_id === $model->canton_id && $model->hasRole('DIGITADOR');
        }

        if ($user->hasRole('COORDINADOR')) {
            return $user->recinto_id === $model->recinto_id && $model->hasRole('VEEDOR');
        }

        return false;
    }
}
