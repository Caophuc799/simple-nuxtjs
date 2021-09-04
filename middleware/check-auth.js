export default function (context) {
    console.log('[Middleware] The Check auth middleware is running', process.client)
    context.store.dispatch('initAuth', context.req)
}