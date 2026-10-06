<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InquiryController;

/*
|--------------------------------------------------------------------------
| API Routes for Kabhyan Technologies
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public Health Check Endpoint
    Route::get('/health', function () {
        return response()->json([
            'status'      => 'healthy',
            'company'     => 'Kabhyan Technologies Private Limited',
            'tagline'     => 'Intelligence. Innovation. Impact.',
            'version'     => '1.0.0',
            'timestamp'   => now()->toIso8601String()
        ]);
    });

    // Public Contact Form Submission (with rate limiting: max 10 requests per minute)
    Route::middleware('throttle:10,1')->post('/inquiries', [InquiryController::class, 'store']);

    // Admin Protected Inquiry Index
    Route::middleware('auth:sanctum')->get('/inquiries', [InquiryController::class, 'index']);
});
