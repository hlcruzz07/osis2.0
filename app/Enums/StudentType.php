<?php

namespace App\Enums;

enum StudentType: string
{
    case REGULAR = 'Regular';
    case TRANSFEREE = 'Transferee';
    case RETURNEE = 'Returnee';
    case SHIFTEE = 'Shiftee';
    case RETURNEE_SHIFTEE = 'Returnee - Shiftee';
}
