import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import apiKeys9055d4 from './api-keys'
/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
export const apiKeys = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiKeys.url(options),
    method: 'get',
})

apiKeys.definition = {
    methods: ["get","head"],
    url: '/settings/api-keys',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
apiKeys.url = (options?: RouteQueryOptions) => {
    return apiKeys.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
apiKeys.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiKeys.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
apiKeys.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiKeys.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
const apiKeysForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiKeys.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
apiKeysForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiKeys.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::apiKeys
* @see app/Http/Controllers/Settings/ApiKeyController.php:19
* @route '/settings/api-keys'
*/
apiKeysForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiKeys.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

apiKeys.form = apiKeysForm

const settings = {
    apiKeys: Object.assign(apiKeys, apiKeys9055d4),
}

export default settings