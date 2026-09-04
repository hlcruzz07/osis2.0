<?php

namespace Database\Seeders;

use App\Models\SocioEconomicCategory;
use Illuminate\Database\Seeder;

class SocioEconomicCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['code' => 'PWD', 'name' => 'Person With Disability (PWD)', 'with_id' => true],
            ['code' => 'SOLO_PARENT_RAISED', 'name' => 'Raised by a Solo Parent', 'with_id' => true],
            ['code' => 'SOLO_PARENT', 'name' => 'A Solo Parent', 'with_id' => true],
            ['code' => 'FOUR_PS', 'name' => '4Ps Beneficiary', 'with_id' => true],
            ['code' => 'IP', 'name' => 'Member of Indigenous People (IP)'],
            ['code' => 'ORPHAN', 'name' => 'An Orphan', 'desc' => 'Please provide Affidavit or Certification from DSWD'],
            ['code' => 'GIDA', 'name' => 'Residing in geographically isolated and disadvantaged areas (GIDA)', 'desc' => 'Please provide Certificate of Residency'],
            ['code' => 'SUBSISTENCE_FARMER', 'name' => 'Child from families of subsistence farmers or fisherfolks', 'desc' => 'Please provide Certificate from DA, MAO, BFAR, or RSBSA registration (if applicable)'],
            ['code' => 'REBEL_RETURNEE', 'name' => 'Child of rebel returnee', 'desc' => 'Please provide Joint AFP-PNP validated Certificate of Surrender'],
            ['code' => 'BOTTOM_40', 'name' => 'From Households within the bottom 40% income bracket', 'desc' => 'Please provide the latest Income Tax Return (ITR) of parents or Certificate of No Filing'],
            ['code' => 'FIRST_GEN', 'name' => 'First Generation Student', 'desc' => 'Please provide Certificate that proves that you are a First-Generation Student'],

        ];

        foreach ($categories as $category) {
            SocioEconomicCategory::create($category);
        }
    }
}
