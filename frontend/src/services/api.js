/**
 * Función genérica para realizar requests a la API.
 */
export default async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Error ${response.status}: ${response.statusText}`
    );
  }

  return data;
}