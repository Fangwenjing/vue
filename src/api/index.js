import {LoginResource, LoginOutResource, MenuResource, AppResource, RecordResource} from './resources.js'

export default {
  login: (data) => {
    return LoginResource.save(data)
  },
  loginOut: () => {
    return LoginOutResource.get()
  },
  getMenus: () => {
    return MenuResource.get({controller: 'list'})
  },
  getApps: () => {
    return AppResource.get({controller: 'query'})
  },
  getRecord: (id) => {
    return RecordResource.get({id: id})
  },
  setRecordStatus: (id) => {
    return RecordResource.save({id: id, controller: 'setStatus'}, {})
  },
  delRecord: (id) => {
    return RecordResource.remove({id: id, controller: 'del'})
  },
  saveRecord: (record) => {
    return RecordResource.save({controller: 'save'}, record)
  }
}
