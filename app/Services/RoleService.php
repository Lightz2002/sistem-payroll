<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleService
{
  public function getAll()
  {
    return Role::selectRaw('id, name as value')->get();
  }


  // Service logic

}
