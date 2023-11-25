<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Absence extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'type',
        'employee_id',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id', 'id');
    }

    public function scopeFilter($query, $search = '', $filters = [])
    {
        $user = Auth::user();

        $query = $query->join('users as employee', 'employee.id', '=', 'absences.employee_id')
            ->leftJoin('salaries as s', function ($join) use ($filters) {
                $join->on('s.employee_id', '=', 'absences.employee_id')
                    ->where(DB::raw("CONCAT(YEAR(absences.date), ' - ', MONTH(absences.date))"), '=', DB::raw("CONCAT(YEAR(s.date), ' - ', MONTH(s.date))"));
            })
            ->select(DB::raw("absences.*, DATE_FORMAT(absences.date, '%d %M %Y') date,s.status, employee.name as employee"))
            ->whereRaw("IFNULL(s.status, 'entry') = ?", [$filters['status']])
            ->where(function ($query) use ($search) {
                $query->where('employee.name', 'like', '%' . $search . '%')
                    ->orWhere('absences.date', 'like', '%' . $search . '%');
            })
            ->where(function ($query) use ($search, $filters, $user) {
                if ($filters['dateFrom'] && $filters['dateUntil']) {
                    $query->whereRaw('DATE_FORMAT(absences.date, "%Y-%m-%d") >= ? and DATE_FORMAT(absences.date, "%Y-%m-%d") <= ?', [$filters['dateFrom'], $filters['dateUntil']]);
                } else if ($filters['dateFrom'] && !$filters['dateUntil']) {
                    $query->whereRaw('DATE_FORMAT(absences.date, "%Y-%m-%d") >= ?', [$filters['dateFrom']]);
                } else if ($filters['dateUntil'] && !$filters['dateFrom']) {
                    $query->whereRaw('DATE_FORMAT(absences.date, "%Y-%m-%d") <= ?', [$filters['dateUntil']]);
                }

                $query->where('employee.name', 'like', '%' . $filters['employee'] . '%')
                    ->where('type', 'like', '%' . $filters['type'] . '%');

                if ($user->hasRole('manager') && $filters['salaryDate']) {
                    $query->whereRaw('DATE_FORMAT(absences.date, "%Y-%m") = ?', [$filters['salaryDate']]);
                }
            });

        /* If it's Employee, view his only absence */
        if (!$user->hasRole('manager')) {
            $query->where('absences.employee_id', $user->id);
        }

        /* select */

        return $query;
    }
}
