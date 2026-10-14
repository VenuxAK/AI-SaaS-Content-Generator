import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ToneController::index
* @see app/Http/Controllers/ToneController.php:22
* @route '/tones'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ToneController::store
* @see app/Http/Controllers/ToneController.php:37
* @route '/tones'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ToneController::store
* @see app/Http/Controllers/ToneController.php:37
* @route '/tones'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ToneController::store
* @see app/Http/Controllers/ToneController.php:37
* @route '/tones'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ToneController::store
* @see app/Http/Controllers/ToneController.php:37
* @route '/tones'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ToneController::store
* @see app/Http/Controllers/ToneController.php:37
* @route '/tones'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ToneController::update
* @see app/Http/Controllers/ToneController.php:52
* @route '/tones/{tone}'
*/
export const update = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/tones/{tone}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ToneController::update
* @see app/Http/Controllers/ToneController.php:52
* @route '/tones/{tone}'
*/
update.url = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tone: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tone: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tone: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tone: typeof args.tone === 'object'
        ? args.tone.id
        : args.tone,
    }

    return update.definition.url
            .replace('{tone}', parsedArgs.tone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ToneController::update
* @see app/Http/Controllers/ToneController.php:52
* @route '/tones/{tone}'
*/
update.put = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ToneController::update
* @see app/Http/Controllers/ToneController.php:52
* @route '/tones/{tone}'
*/
const updateForm = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ToneController::update
* @see app/Http/Controllers/ToneController.php:52
* @route '/tones/{tone}'
*/
updateForm.put = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ToneController::destroy
* @see app/Http/Controllers/ToneController.php:69
* @route '/tones/{tone}'
*/
export const destroy = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tones/{tone}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ToneController::destroy
* @see app/Http/Controllers/ToneController.php:69
* @route '/tones/{tone}'
*/
destroy.url = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tone: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tone: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tone: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tone: typeof args.tone === 'object'
        ? args.tone.id
        : args.tone,
    }

    return destroy.definition.url
            .replace('{tone}', parsedArgs.tone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ToneController::destroy
* @see app/Http/Controllers/ToneController.php:69
* @route '/tones/{tone}'
*/
destroy.delete = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ToneController::destroy
* @see app/Http/Controllers/ToneController.php:69
* @route '/tones/{tone}'
*/
const destroyForm = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ToneController::destroy
* @see app/Http/Controllers/ToneController.php:69
* @route '/tones/{tone}'
*/
destroyForm.delete = (args: { tone: number | { id: number } } | [tone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const tones = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default tones