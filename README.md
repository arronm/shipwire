### Prerequisites

 - Node installed

### Local Installation

1. `git clone https://github.com/arronm/shipwire`
1. `npm install`
1. `npm run data:latest`
1. `npm run data:seed`


### Initial State & Test

Initital inventory state is set up for the provided test. To change the initial state:

1. modify `data/seeds/001_product.js`
1. run `npx knex seed:run` (NOTE: this will reset the state of the database)

To complete the initial test, the API server and Data Source are not required:

1. after running `npx knex seed:run` the Allocator can be started
1. run `npm run allocator`
1. output listing will send to console and it will generate an outputlisting.txt file


### Server & DataSource

The data source will need the API server for streams to send orders to

1. run `npm run dev:server` to start the server proces
1. run `npm run streams` to start sending orders from streams
1. This will run 6 streams with randomly generated orders

Allocator can be run at any point, as long as it doesn't run out of inventory it will process any incoming orders from streams.

---

### API Server
1. `npm run dev:server`

### Data Source
1. `npm run streams`

### Allocator
1. `npm run allocator`

### Testing
The following options are available for testing:

- `npm test:watch`
- `npm test:coverage`
- `npm test:once`

