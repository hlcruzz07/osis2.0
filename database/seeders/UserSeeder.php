<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\HashService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'haroldlyndon.cruz@chmsu.edu.ph';
        $emailHash = HashService::make($email);
        $user = User::where('email_hash', $emailHash)->first()
            ?? User::where('email_hash', hash('sha256', $email))->first();

        if (!$user) {
            $user = new User;
        }

        $user->fill([
            'email_hash' => $emailHash,
            'email' => $email,
            'avatar' => null,
            'name' => 'Harold Lyndon Cruz',
            'name_hash' => HashService::make('Harold Lyndon Cruz'),
            'email_verified_at' => Carbon::now(),
        ])->save();

        $user->assignRole('super_administrator');

        // $admins = User::factory(25)->create();

        // foreach ($admins as $admin) {
        //     $admin->assignRole('administrator');
        // }
    }
}
