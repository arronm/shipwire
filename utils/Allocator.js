/*

Only valid orders should be added to the job queue

TODO: Add transaction logs in case we do somehow get invalid orders

*/
const EventEmitter = require('events');
const productDB = require('../api/product.model');
const jobDB = require('../api/job.model');

class Allocator {
  constructor() {
    this.event = new EventEmitter();
    this.startedAt = Date.now();

    // this.totalInventory = undefined;
    this.task = undefined;

    // each task in queue should be an entire order of line items
    this.tmp = [
      [
        { "id": 1, "product": "A", "quantity": 5 },
        { "id": 2, "product": "B", "quantity": 5 },
      ],
      [
        { "id": 1, "product": "A", "quantity": 5 },
      ],
      [
        { "id": 2, "product": "B", "quantity": 3 },
        { "id": 3, "product": "C", "quantity": 2 },
      ],
      [
        { "id": 1, "product": "A", "quantity": 5 },
      ],
    ];

    // Set up event listeners
    this.event.on('QueueProcessed', async () => {
      await allocator.watchQueue();
    });

    this.event.on('QueueRefreshed', async () => {
      await allocator.processQueue();
    });

    this.event.on('InventoryDepleted', () => {
      this.generateListing();
      process.exit();
    });
  }
  
  async getTask() {
    this.task = await jobDB.getJob();
    console.log(this.task.lines);

    // Will need additional information when processing tasks (id)

    // {"header":1,"lines":[{"product":"A","quantity":1},{"product":"C","quantity":1}]}
    // Get next task to work on
    return this.tmp.shift();
  }

  generateListing() {
    // Generate listing output for all orders process during run time
    // Could alternatively keep a local version of listing to output
      // would decrease db queries (if constantly running out of inventory)
    console.log('Generate output listing');

    // TODO: Save transaction for stopping allocator
  }

  updateLineStatus(line) {
    // Update line item with new status
  }

  saveTransaction(data) {
    // save transaction for changes

    // TODO: Save to database, and update in-memory listing
  }

  fulfillLineItem({ id, product, quantity }) {
    // check product inventory
    const canFulfill = (this.inventory[product] - quantity) >= 0;

    if (canFulfill) {
      // fulfill line item
      this.inventory[product] -= quantity;
      // TODO: Update database and total inventory correctly
      this.inventory.__total -= quantity;
      return true;
    }

    // Backorder line item
    return false;
  }

  async processQueue() {
    while (this.task) {
      // Sleep 1 second between tasks
      await new Promise(resolve => setTimeout(resolve, 1000));
      // console.log('----', this.task, '----');

      /*

        {
          id: 1,  -- job id
          order_id: 1,
          header: '1',
          lines: [
            { id: 1, product: 'A', quantity: 1 }, -- line id
            { id: 2, product: 'C', quantity: 1 }
          ],
          priority: 0,
          stream: 1, -- stream id
          created_at: '2020-03-08 20:21:14'
        }

      */

      // Loop over each line item in the order
      for (const line of this.task) {
        const { id, product, quantity } = line;
        console.log(id, product, quantity);
        // check product inventory for this line item
        console.log('Pre Inventory:', this.inventory[product]);
        // try to fulfill this line item
        const fulfilled = this.fulfillLineItem(line);
        console.log('Post Inventory:', this.inventory[product]);

        if (fulfilled) {
          console.log('item fulfilled');
          // TODO: trigger updateLineStatus('fulfilled');
          // TODO: log transaction?
          continue;
        }
        
        // TODO: trigger updateLineStatus('unfulfilled');
        // TODO: log transaction?
        console.log('item backordered');
      }

      // check total inventory
      if (this.inventory.__total === 0) {
        this.event.emit('InventoryDepleted');
      }

      // get next task
      this.task = await this.getTask();
    }

    this.event.emit('QueueProcessed');
  }

  async watchQueue() {
    while (!this.task) {
      // Check the queue every 5 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.task = await this.getTask();
    }

    this.event.emit('QueueRefreshed');
  }

  async start() {
    // get total inventory
    // this.totalInventory = await productDB.getTotalInventory();
    this.inventory = await productDB.getInventory();
    console.log(this.inventory);
    // TODO: Save transaction for starting allocator

    // set up initial task
    this.task = await this.getTask();
    this.processQueue();
  }
}

const allocator = new Allocator();
console.log('Started at:', allocator.startedAt);

allocator.start();
