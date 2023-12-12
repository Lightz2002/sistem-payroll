<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salary>
 */
class SalaryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $minSalary = 20000;
        $maxSalary = 200000;

        return [
            //
            'date' => $this->faker->unique()->dateTimeBetween($startDate = '-1 years', $endDate = 'now')->format('Y-m'),
            'salary_per_day' => $this->faker->numberBetween($minSalary, $maxSalary)
        ];
    }
}
