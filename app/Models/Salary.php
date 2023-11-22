<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class Salary extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'employee_id',
        'salary_per_day',
        'total_amount',
    ];

    protected function date(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Carbon::parse($value)->startOfMonth(),
            get: fn (string $value) => Carbon::parse($value)->startOfMonth()->format('Y-m'),
        );
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id', 'id');
    }

    public function salary_deductions(): HasMany
    {
        return $this->HasMany(SalaryDeduction::class);
    }

    public function salary_bonus(): HasMany
    {
        return $this->HasMany(SalaryBonus::class);
    }

    public function scopeFilter($query, $search = '', $filters = [])
    {
        $query = $query->join('users as employee', 'employee.id', '=', 'salaries.employee_id')
            ->select(DB::raw('salaries.*, employee.name as employee'));

        if ($filters['dateFrom'] || $filters['dateUntil'] || $filters['employee']) {
            return $query
                ->where('employee.name', 'like', '%' . $filters['employee'] . '%')
                ->whereRaw('DATE_FORMAT(date, "%Y-%m") >= ? and DATE_FORMAT(date, "%Y-%m") <= ?', [$filters['dateFrom'], $filters['dateUntil']]);
        }

        return $query
            ->where('employee.name', 'like', '%' . $search . '%')
            ->orWhereRaw('DATE_FORMAT(date, "%Y-%m") LIKE ?', ['%' . $search . '%']);
    }

    public function scopeFilterDetail($query, $search = '', $table)
    {
        if (!$table) return $query;

        return $query->join("{$table} as child", 'child.salary_id', '=', 'salaries.id')
            ->select(DB::raw('child.*'))
            ->where('child.salary_id', $this->id)
            ->where('child.name', 'like', '%' . $search . '%')
            ->orWhere('child.amount', 'like', '%' . $search . '%');
    }
}
