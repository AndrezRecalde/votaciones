<?php

namespace App\Policies;

use App\Models\Acta;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ActaPolicy
{
    /**
     * Permite a los Administradores hacer cualquier cosa.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('ADMINISTRADOR')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can create models (digitar un acta).
     */
    public function create(User $user, Acta $acta): bool
    {
        if ($user->hasRole('DIGITADOR')) {
            // Si tiene cantón asignado, solo puede de ese cantón
            if ($user->canton_id !== null) {
                return $user->canton_id === $acta->canton_id;
            }
            // Si NO tiene cantón asignado, puede digitar de todos los cantones
            return true;
        }

        if ($user->hasRole('VEEDOR')) {
            // Veedor solo puede digitar de la junta que tiene asignada
            return $user->junta_id === $acta->junta_id;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model (modificar acta digitada).
     */
    public function update(User $user, Acta $acta): bool
    {
        return $this->create($user, $acta);
    }
}
