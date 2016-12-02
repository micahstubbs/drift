# round one
`lebab src/index.js -o src/index.js --transform arrow`
  failed
  resulted in terrible errors

`lebab src/index.js -o src/index.js --transform for-of`
  succeeded
  no actual changes apparently

`lebab src/index.js -o src/index.js --transform for-each`
  succeeded
  some `unable to tranform`s
  no actual changes apparently

`lebab src/index.js -o src/index.js --transform arg-rest`
  succeeded

`lebab src/index.js -o src/index.js --transform arg-spread`
  succeeded

`lebab src/index.js -o src/index.js --transform obj-method`
  succeeded

`lebab src/index.js -o src/index.js --transform obj-shorthand`
  succeeded

`lebab src/index.js -o src/index.js --transform no-strict`

