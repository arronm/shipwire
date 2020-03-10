#### Installation

1. `git clone https://github.com/arronm/shipwire`
1. `npm install`
1. `npx knex migrate:latest`
1. `npx knex seed:run`


### API Server
1. `npm run dev:server`

### Data Source
1. `node utils/DataSource.js`

### Allocator
1. `node utils/Allocator.js`

### Testing
The following options are available for testing:

- `npm test:watch`
- `npm test:coverage`
- `npm test:once`

