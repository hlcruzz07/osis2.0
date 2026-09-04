<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleDriveService;
use Illuminate\Http\Request;

class ProofApiController extends Controller
{
    public function __construct(protected GoogleDriveService $googleDriveService) {}

    public function fetchImage(Request $request, string $fileId)
    {
        $etag = '"'.md5($fileId).'"';

        if ($request->headers->get('If-None-Match') === $etag) {
            return response('', 304)
                ->header('ETag', $etag)
                ->header('Cache-Control', 'private, max-age=86400');
        }

        $image = $this->googleDriveService->getImage($fileId);

        return response($image['contents'])
            ->header('Content-Type', $image['mimeType'])
            ->header('Content-Disposition', 'inline; filename="'.$image['name'].'"')
            ->header('ETag', $etag)
            ->header('Cache-Control', 'private, max-age=86400');
    }
}
