<?php

namespace App\Http\Controllers;

use App\Services\SalaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $salaryService;

    public function __construct()
    {
        $this->salaryService = new SalaryService();
    }
    //
    public function index()
    {
        /* manager */
        /* total paid salary last month */
        /* total paid salary all time */
        /* total absence this month */
        /* total employee */

        /* other roles */
        /* total present */
        /* total permission */
        /* total sick */
        /* total salary last month */
        /* total salary current month */
        $data = $this->salaryService->getDashboardData();
        return Inertia::render('Dashboard', ['data' => $data]);
    }
}
