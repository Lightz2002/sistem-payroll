<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $userSurveyor = new User();
    $userSurveyor->name = 'admin1';
    $userSurveyor->email = 'admin1@gmail.com';
    $userSurveyor->password = Hash::make('123');
    $userSurveyor->assignRole('admin');
    $userSurveyor->save();

    $userEmployee = new User();
    $userEmployee->name = 'employee1';
    $userEmployee->email = 'employee1@gmail.com';
    $userEmployee->password = Hash::make('123');
    $userEmployee->assignRole('employee');
    $userEmployee->save();
  }
}
