import { ApiError, ApiRequestOptions, ApiResponse } from '@/types/api';
import { SecureStorageService } from '@/utils/storage';

// Replace with your production base API URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.lineageai.example.com/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Helper to build a query string from key-value parameters.
   */
  private buildQueryString(params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) return '';
    const parts = Object.entries(params).map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`
    );
    return `?${parts.join('&')}`;
  }

  /**
   * Primary fetch wrapper that coordinates token injection, headers, and error handling.
   */
  async request<T = any>(path: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, requireAuth = true, headers: customHeaders, ...fetchOptions } = options;
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}${path}${queryString}`;

    // 1. Set default headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    });

    // 2. Inject Authorization header if required
    if (requireAuth) {
      const token = await SecureStorageService.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    };

    // Logging for development mode
    if (__DEV__) {
      console.log(`[API Request] ${config.method || 'GET'} -> ${url}`);
    }

    try {
      const response = await fetch(url, config);
      
      if (__DEV__) {
        console.log(`[API Response] ${response.status} <- ${url}`);
      }

      // Check if response has no content
      if (response.status === 204) {
        return { success: true, data: null, status: 204 };
      }

      const json = await response.json();

      if (!response.ok) {
        const errorMsg = json?.message || `Request failed with status ${response.status}`;
        throw {
          message: errorMsg,
          statusCode: response.status,
          errors: json?.errors,
        } as ApiError;
      }

      return {
        success: true,
        data: json,
        status: response.status,
      };
    } catch (error: any) {
      console.error(`[API Error] Path: ${path} ->`, error);

      // Handle standard API error shapes
      const apiError: ApiError = {
        message: error?.message || 'A network error occurred. Please try again.',
        statusCode: error?.statusCode || 500,
        errors: error?.errors,
      };

      return {
        success: false,
        data: null,
        message: apiError.message,
        status: apiError.statusCode,
      };
    }
  }

  /**
   * GET Request
   */
  async get<T = any>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * POST Request
   */
  async post<T = any>(path: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT Request
   */
  async put<T = any>(path: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE Request
   */
  async delete<T = any>(path: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
