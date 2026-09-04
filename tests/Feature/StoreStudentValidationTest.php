<?php

use App\Http\Requests\StoreStudentRequest;
use Illuminate\Support\Facades\Validator;

test('student form rejects missing required data and consent', function () {
    $request = StoreStudentRequest::create('/form/store', 'POST', [
        'agree_accuracy' => false,
        'agree_data_privacy' => false,
    ]);
    $validator = Validator::make(
        $request->all(),
        $request->rules(),
        $request->messages(),
    );

    $request->withValidator($validator);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('fname'))->toBeTrue()
        ->and($validator->errors()->has('email'))->toBeTrue()
        ->and($validator->errors()->has('agree_accuracy'))->toBeTrue()
        ->and($validator->errors()->has('agree_data_privacy'))->toBeTrue();
});
