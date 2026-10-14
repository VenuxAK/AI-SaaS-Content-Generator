import DashboardController from './DashboardController'
import GenerationController from './GenerationController'
import GenerationStreamController from './GenerationStreamController'
import ToneController from './ToneController'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    GenerationController: Object.assign(GenerationController, GenerationController),
    GenerationStreamController: Object.assign(GenerationStreamController, GenerationStreamController),
    ToneController: Object.assign(ToneController, ToneController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers