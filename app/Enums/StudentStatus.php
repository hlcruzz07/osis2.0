<?php

namespace App\Enums;

enum StudentStatus: int
{
    case REJECTED = 0;
    case PENDING = 1;
    case ACCEPTED = 2;
}
