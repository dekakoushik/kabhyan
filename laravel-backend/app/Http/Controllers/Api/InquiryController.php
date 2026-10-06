<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class InquiryController extends Controller
{
    /**
     * Store a newly created enterprise inquiry.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:120',
            'email'   => 'required|email|max:150',
            'phone'   => 'nullable|string|max:30',
            'service' => 'required|string|max:100',
            'budget'  => 'nullable|string|max:100',
            'message' => 'required|string|min:10|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'status'  => 'validation_error',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $inquiry = Inquiry::create([
                'name'         => $request->input('name'),
                'email'        => $request->input('email'),
                'phone'        => $request->input('phone'),
                'service'      => $request->input('service'),
                'budget'       => $request->input('budget'),
                'message'      => $request->input('message'),
                'ip_address'   => $request->ip(),
                'user_agent'   => $request->userAgent(),
                'status'       => 'new'
            ]);

            // Dispatch notification or log entry
            Log::info("Enterprise inquiry received from: {$inquiry->email} for service: {$inquiry->service}");

            return response()->json([
                'success' => true,
                'status'  => 'success',
                'message' => 'Thank you for contacting Kabhyan Technologies. Our engineering leads will review your requirements and respond within 24 hours.',
                'data'    => [
                    'id'         => $inquiry->id,
                    'created_at' => $inquiry->created_at
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error("Failed to store inquiry: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'status'  => 'server_error',
                'message' => 'An error occurred while processing your request. Please email us directly at info@kabhyan.com.'
            ], 500);
        }
    }

    /**
     * List all inquiries (Admin / Protected Endpoint).
     */
    public function index()
    {
        $inquiries = Inquiry::latest()->paginate(20);
        return response()->json([
            'success' => true,
            'data'    => $inquiries
        ]);
    }
}
