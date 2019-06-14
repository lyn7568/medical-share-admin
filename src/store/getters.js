const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userid: state => state.user.userid,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  citydata: state => state.city.citydata,
  departArrs: state => state.depart.departArrs
}
export default getters
