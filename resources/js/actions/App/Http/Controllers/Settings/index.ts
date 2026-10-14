import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import ApiKeyController from './ApiKeyController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    SecurityController: Object.assign(SecurityController, SecurityController),
    ApiKeyController: Object.assign(ApiKeyController, ApiKeyController),
}

export default Settings