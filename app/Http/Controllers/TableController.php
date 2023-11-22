<?php

namespace App\Http\Controllers;

use App\Models\Salary;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
  //
  public function list($tableProps)
  {
    $search = request()->search;
    $sortBy = request()->sortBy ?? 'created_at';
    $sortDirection = request()->sortDirection ?? 'asc';
    $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);

    $requiredProps = [
      'search' => $search,
      'sortBy' => $sortBy,
      'sortDirection' => $sortDirection,
      'page' => $page,
      'dataRoute' => $tableProps['dataRoute'],
      'datas' => $tableProps['datas'],
      'columnDatas' => $tableProps['columnDatas'],
    ];

    return $requiredProps;
  }
}
