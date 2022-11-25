

let uid = 0
export function createAppAPI(render){
  return function createApp(rootComponent){
    const app = {
      _uid: uid++,
      mount(rootContainer){
        render()
      },
      use(){},
      provide(){},
      component(){}
    }
    return app
  }
}