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
                'role' => 'admin',
                'menu' => 'employee'
            ],
            [
                'role' => 'admin',
                'menu' => 'salary'
            ],
            [
                'role' => 'employee',
                'menu' => 'absence'
            ]
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
