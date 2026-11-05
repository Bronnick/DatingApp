const isProd = import.meta.env.PROD

export const environment = {
  production: isProd,
  apiUrl: isProd ? 'api/' : 'https://localhost:5001/api/',
  hubUrl: isProd ? 'hubs/' : 'https://localhost:5001/hubs/',
}
