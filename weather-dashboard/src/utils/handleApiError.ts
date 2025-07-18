import type { AxiosError } from 'axios'

export function handleApiError(error: AxiosError | any): string {
  console.error('Error details', error)

  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 404:
        return 'City not found. Please check the city name and try again.'
      case 401:
        return 'API authentication failed. Please check your API key.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return data?.message || 'An error occurred while fetching weather data.'
    }

  } else if (error.request) {
    return 'Network error. Please check your connection and try again.'
  } else {
    return 'An unexpected error occurred. Please try again.'
  }
}
