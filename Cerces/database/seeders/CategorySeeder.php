<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => "men's clothing", 'description' => 'Vêtements hommes'],
            ['name' => 'jewelery', 'description' => 'Bijoux'],
            ['name' => 'electronics', 'description' => 'Électronique'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}

