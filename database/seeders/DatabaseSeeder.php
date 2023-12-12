<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Salary;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            MenuSeeder::class,
            RoleMenuSeeder::class,
        ]);

        // Salary::factory(5)
        //     ->for(User::factory()->state([
        //         'name' => 'admin1',
        //     ]))
        //     ->create();

        // Salary::factory(5)
        //     ->for(User::factory()->state([
        //         'name' => 'employee1',
        //     ]))
        //     ->create();
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
