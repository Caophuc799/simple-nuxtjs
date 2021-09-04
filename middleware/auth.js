export default function (context) {
    console.log('[Middleware] The auth middleware is running', context.store.getters.isAuthenticated)
    if (!context.store.getters.isAuthenticated) {
        context.redirect('/admin/auth')
    }
}