import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ApiKeyController::update
* @see app/Http/Controllers/Settings/ApiKeyController.php:38
* @route '/settings/api-keys'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/api-keys',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::update
* @see app/Http/Controllers/Settings/ApiKeyController.php:38
* @route '/settings/api-keys'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::update
* @see app/Http/Controllers/Settings/ApiKeyController.php:38
* @route '/settings/api-keys'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::update
* @see app/Http/Controllers/Settings/ApiKeyController.php:38
* @route '/settings/api-keys'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::update
* @see app/Http/Controllers/Settings/ApiKeyController.php:38
* @route '/settings/api-keys'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::test
* @see app/Http/Controllers/Settings/ApiKeyController.php:80
* @route '/settings/api-keys/test'
*/
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/settings/api-keys/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::test
* @see app/Http/Controllers/Settings/ApiKeyController.php:80
* @route '/settings/api-keys/test'
*/
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::test
* @see app/Http/Controllers/Settings/ApiKeyController.php:80
* @route '/settings/api-keys/test'
*/
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::test
* @see app/Http/Controllers/Settings/ApiKeyController.php:80
* @route '/settings/api-keys/test'
*/
const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ApiKeyController::test
* @see app/Http/Controllers/Settings/ApiKeyController.php:80
* @route '/settings/api-keys/test'
*/
testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
})

test.form = testForm

const apiKeys = {
    update: Object.assign(update, update),
    test: Object.assign(test, test),
}

export default apiKeys