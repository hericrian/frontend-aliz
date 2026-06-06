export const ROUTES = {
  home: '/',
  products: '/produtos',
  grains: '/graos',
  livestock: '/pecuaria',
  produce: '/hortifruti',
  about: '/sobre',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password'
}

export const CATEGORY_ROUTE_MAP = {
  [ROUTES.products]: 'graos',
  [ROUTES.grains]: 'graos',
  [ROUTES.livestock]: 'pecuaria',
  [ROUTES.produce]: 'hortifruti'
}
