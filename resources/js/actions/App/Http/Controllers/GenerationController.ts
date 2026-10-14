import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/generate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::create
* @see app/Http/Controllers/GenerationController.php:28
* @route '/generate'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\GenerationController::store
* @see app/Http/Controllers/GenerationController.php:78
* @route '/generate'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GenerationController::store
* @see app/Http/Controllers/GenerationController.php:78
* @route '/generate'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationController::store
* @see app/Http/Controllers/GenerationController.php:78
* @route '/generate'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GenerationController::store
* @see app/Http/Controllers/GenerationController.php:78
* @route '/generate'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GenerationController::store
* @see app/Http/Controllers/GenerationController.php:78
* @route '/generate'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::index
* @see app/Http/Controllers/GenerationController.php:66
* @route '/history'
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
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
export const show = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/history/{generation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
show.url = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { generation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { generation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            generation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        generation: typeof args.generation === 'object'
        ? args.generation.id
        : args.generation,
    }

    return show.definition.url
            .replace('{generation}', parsedArgs.generation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
show.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
show.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
const showForm = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
showForm.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationController::show
* @see app/Http/Controllers/GenerationController.php:89
* @route '/history/{generation}'
*/
showForm.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\GenerationController::update
* @see app/Http/Controllers/GenerationController.php:105
* @route '/history/{generation}'
*/
export const update = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/history/{generation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GenerationController::update
* @see app/Http/Controllers/GenerationController.php:105
* @route '/history/{generation}'
*/
update.url = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { generation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { generation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            generation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        generation: typeof args.generation === 'object'
        ? args.generation.id
        : args.generation,
    }

    return update.definition.url
            .replace('{generation}', parsedArgs.generation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationController::update
* @see app/Http/Controllers/GenerationController.php:105
* @route '/history/{generation}'
*/
update.put = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GenerationController::update
* @see app/Http/Controllers/GenerationController.php:105
* @route '/history/{generation}'
*/
const updateForm = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GenerationController::update
* @see app/Http/Controllers/GenerationController.php:105
* @route '/history/{generation}'
*/
updateForm.put = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\GenerationController::destroy
* @see app/Http/Controllers/GenerationController.php:128
* @route '/history/{generation}'
*/
export const destroy = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/history/{generation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GenerationController::destroy
* @see app/Http/Controllers/GenerationController.php:128
* @route '/history/{generation}'
*/
destroy.url = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { generation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { generation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            generation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        generation: typeof args.generation === 'object'
        ? args.generation.id
        : args.generation,
    }

    return destroy.definition.url
            .replace('{generation}', parsedArgs.generation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationController::destroy
* @see app/Http/Controllers/GenerationController.php:128
* @route '/history/{generation}'
*/
destroy.delete = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GenerationController::destroy
* @see app/Http/Controllers/GenerationController.php:128
* @route '/history/{generation}'
*/
const destroyForm = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GenerationController::destroy
* @see app/Http/Controllers/GenerationController.php:128
* @route '/history/{generation}'
*/
destroyForm.delete = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const GenerationController = { create, store, index, show, update, destroy }

export default GenerationController