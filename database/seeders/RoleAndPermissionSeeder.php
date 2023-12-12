<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    Role::create(['name' => 'manager']);
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'collector']);
    Role::create(['name' => 'surveyor']);
    Role::create(['name' => 'helper']);
    Role::create(['name' => 'sales']);
    Role::create(['name' => 'warehouse']);
  }
}
