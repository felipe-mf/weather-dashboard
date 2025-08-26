export function handleApiError(error: any, setErrorMessage: (msg: string) => void) {
  console.error('Error details', error)

  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 429:
        if (data.type === 'RATE_LIMIT_EXCEEDED') {
          setErrorMessage(`Too many requests. Please try again in ${data.retryAfter || '10 minutes'}.`)
        } else {
          setErrorMessage('Too many requests. Please try again later.')
        }
        break

      case 404:
        setErrorMessage('City not found. Please check the city name and try again.')
        break

      case 401:
        setErrorMessage('API authentication failed. Please try again later.')
        break

      case 500:
        setErrorMessage('Server error. Please try again later.')
        break

      default:
        setErrorMessage(data.error || 'An error occurred while fetching weather data.')
    }

  } else if (error.request) {
    setErrorMessage('Network error. Please check your connection and try again.')
  } else {
    setErrorMessage('An unexpected error occurred. Please try again.')
  }
}
