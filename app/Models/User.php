<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombres_completos',
        'dni',
        'provincia_id',
        'es_responsable',
        'canton_id',
        'password',
        'activo',
        'user_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function scopeAllowed($query)
    {
        if (auth()->user()->hasRole('ADMIN')) {
            return $query;
        } else {
            return $query->where('user_id', auth()->id());
        }
    }

    public static function create(array $attributes = [])
    {
        $attributes['password'] = Hash::make($attributes['dni']);

        $attributes['user_id'] = auth()->id();

        $user = static::query()->create($attributes);

        return $user;
    }

    public function setPasswordAttribute($password)
    {
        return $this->attributes['password'] = Hash::needsRehash($password) ? Hash::make($password) : $password;
    }

    function scopeByProvinciaId(Builder $query, $provincia_id)
    {
        if ($provincia_id > 0) {
            return $query->where('u.provincia_id', $provincia_id);
        }
    }

    function scopeByCantonId(Builder $query, $canton_id)
    {
        if ($canton_id > 0) {
            return $query->where('u.canton_id', $canton_id);
        }
    }
}
