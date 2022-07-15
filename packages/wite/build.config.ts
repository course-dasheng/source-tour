import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/node/cli',
    'src/client/index',
  ],
  declaration: true,
  clean: true
})
