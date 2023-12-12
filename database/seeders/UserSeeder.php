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
    $userManager = new User();
    $userManager->name = 'manager1';
    $userManager->email = 'manager1@gmail.com';
    $userManager->password = Hash::make('123');
    $userManager->assignRole('manager');
    $userManager->save();

    $userAdmin = new User();
    $userAdmin->name = 'admin1';
    $userAdmin->email = 'admin1@gmail.com';
    $userAdmin->password = Hash::make('123');
    $userAdmin->assignRole('admin');
    $userAdmin->save();

    $userCollector = new User();
    $userCollector->name = 'collector1';
    $userCollector->email = 'collector1@gmail.com';
    $userCollector->password = Hash::make('123');
    $userCollector->assignRole('Collector');
    $userCollector->save();

    $userSurveyor = new User();
    $userSurveyor->name = 'surveyor1';
    $userSurveyor->email = 'surveyor1@gmail.com';
    $userSurveyor->password = Hash::make('123');
    $userSurveyor->assignRole('surveyor');
    $userSurveyor->save();

    $userHelper = new User();
    $userHelper->name = 'helper1';
    $userHelper->email = 'helper1@gmail.com';
    $userHelper->password = Hash::make('123');
    $userHelper->assignRole('helper');
    $userHelper->save();

    $userSales = new User();
    $userSales->name = 'sales1';
    $userSales->email = 'sales1@gmail.com';
    $userSales->password = Hash::make('123');
    $userSales->assignRole('sales');
    $userSales->save();

    $userWarehouse = new User();
    $userWarehouse->name = 'warehouse1';
    $userWarehouse->email = 'warehouse1@gmail.com';
    $userWarehouse->password = Hash::make('123');
    $userWarehouse->assignRole('warehouse');
    $userWarehouse->save();
  }
}
