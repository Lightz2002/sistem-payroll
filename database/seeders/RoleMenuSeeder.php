<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\RoleMenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $roles = Role::all();
        $menus = Menu::all();

        $roleMenuNames = [
            [
                'role' => 'manager',
                'menu' => 'employee'
            ],
            [
                'role' => 'manager',
                'menu' => 'salary'
            ],
            [
                'role' => 'manager',
                'menu' => 'absence'
            ],
            [
                'role' => 'admin',
                'menu' => 'absence'
            ],
            [
                'role' => 'admin',
                'menu' => 'salary'
            ],
            [
                'role' => 'collector',
                'menu' => 'absence'
            ],
            [
                'role' => 'collector',
                'menu' => 'salary'
            ],
            [
                'role' => 'surveyor',
                'menu' => 'absence'
            ],
            [
                'role' => 'surveyor',
                'menu' => 'salary'
            ],
            [
                'role' => 'warehouse',
                'menu' => 'absence'
            ],
            [
                'role' => 'warehouse',
                'menu' => 'salary'
            ],
            [
                'role' => 'sales',
                'menu' => 'absence'
            ],
            [
                'role' => 'sales',
                'menu' => 'salary'
            ],
            [
                'role' => 'helper',
                'menu' => 'absence'
            ],
            [
                'role' => 'helper',
                'menu' => 'salary'
            ],
        ];

        $roleMenuDatas = [];
        foreach ($roleMenuNames as $roleMenuName) {
            $roleMenuDatas[] = [
                'role_id' => $roles->firstWhere('name', $roleMenuName['role'])->id,
                "menu_id" => $menus->firstWhere('name', $roleMenuName['menu'])->id
            ];
        }

        DB::table('role_menus')->insert($roleMenuDatas);
    }
}
