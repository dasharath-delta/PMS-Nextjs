// utils/response.js
import { NextResponse } from 'next/server';

export function apiResponse({
  success = true,
  message = 'Success',
  data = null,
  errors = null,
  status = 200,
}) {
  return NextResponse.json(
    {
      success,
      message,
      data,
      errors,
    },
    { status }
  );
}
