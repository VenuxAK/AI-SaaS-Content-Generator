import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
export const stream = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/generate/{generation}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
stream.url = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return stream.definition.url
            .replace('{generation}', parsedArgs.generation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
stream.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
stream.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
const streamForm = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
streamForm.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:28
* @route '/generate/{generation}/stream'
*/
streamForm.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stream.form = streamForm

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
export const humanize = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: humanize.url(args, options),
    method: 'get',
})

humanize.definition = {
    methods: ["get","head"],
    url: '/generate/{generation}/humanize',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
humanize.url = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return humanize.definition.url
            .replace('{generation}', parsedArgs.generation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
humanize.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: humanize.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
humanize.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: humanize.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
const humanizeForm = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: humanize.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
humanizeForm.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: humanize.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::humanize
* @see app/Http/Controllers/GenerationStreamController.php:127
* @route '/generate/{generation}/humanize'
*/
humanizeForm.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: humanize.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

humanize.form = humanizeForm

const generate = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    stream: Object.assign(stream, stream),
    humanize: Object.assign(humanize, humanize),
}

export default generate