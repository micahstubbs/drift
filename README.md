# drift

an ES2015 port of [h2o-flow](https://github.com/h2oai/h2o-flow)

## development

follow the [dev guide](https://github.com/h2oai/h2o-flow/blob/master/README.md#development-instructions) over at the [h2o-flow](https://github.com/h2oai/h2o-flow) repo  

in the same directory as [h2o-3](https://github.com/h2oai/h2o-3) and [h2o-flow](https://github.com/h2oai/h2o-flow):  
`git clone git@github.com:micahstubbs/drift.git`  

`cd drift`
`npm install`

generate a new `flow.js` bundle and copy it over to your local `h2o-3/h2o-web/...` directory with the command

`npm run build`