import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:21
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
* @see app/Http/Controllers/GenerationStreamController.php:21
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
* @see app/Http/Controllers/GenerationStreamController.php:21
* @route '/generate/{generation}/stream'
*/
stream.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:21
* @route '/generate/{generation}/stream'
*/
stream.head = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:21
* @route '/generate/{generation}/stream'
*/
const streamForm = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:21
* @route '/generate/{generation}/stream'
*/
streamForm.get = (args: { generation: number | { id: number } } | [generation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GenerationStreamController::stream
* @see app/Http/Controllers/GenerationStreamController.php:21
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

const GenerationStreamController = { stream }

export default GenerationStreamController