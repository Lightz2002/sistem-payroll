<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class RoleMenu extends Model
{
    use HasFactory;

    public static function getRoleMenus(Object $role)
    {
        return DB::table('role_menus')
            ->join('menus', 'menus.id', '=', 'role_menus.menu_id', 'inner')
            ->where('role_menus.role_id', '=', $role->id)
            ->selectRaw('LOWER(menus.name) as menu')
            ->pluck('menu');
    }
}
