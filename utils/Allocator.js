/*

Only valid orders should be added to the job queue

TODO: Add transaction logs in case we do somehow get invalid orders

*/
const EventEmitter = require('events');
const productDB = require('../api/product.model');
const jobDB = require('../api/job.model');
const lineDB = require('../data/models')('order_products');

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
    const task = await jobDB.getJob();
    // console.log(this.task.lines);

    // Will need additional information when processing tasks (id)

    // {"header":1,"lines":[{"product":"A","quantity":1},{"product":"C","quantity":1}]}
    // return next task to work on
    return task;
  }

  generateListing() {
    // Generate listing output for all orders process during run time
    // Could alternatively keep a local version of listing to output
      // would decrease db queries (if constantly running out of inventory)
    console.log('Generate output listing');

    // TODO: Save transaction for stopping allocator
  }

  async updateLineStatus(status, line) {
    // Update line item with new status
    await lineDB.update(line.id, {
      status,
    });
  }

  saveTransaction(data) {
    // save transaction for changes

    // TODO: Save to database, and update in-memory listing
  }

  async finishTask() {
    // Log transaction prior to deletion?
    await jobDB.remove(this.task.id);
    // console.log(result);
  }

  async fulfillLineItem({ id, product, quantity }) {
    // check product inventory
    const canFulfill = (this.inventory[product] - quantity) >= 0;

    if (canFulfill) {
      // fulfill line item
      this.inventory[product] -= quantity;

      await productDB.update(id, {
        inventory: this.inventory[product],
      });

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
      for (const line of this.task.lines) {
        // const { id, product, quantity } = line;

        // check product inventory for this line item
        const fulfilled = await this.fulfillLineItem(line);

        if (fulfilled) {
          await this.updateLineStatus('fulfilled', line);
          // TODO: log transaction?
          continue;
        }
        
        await this.updateLineStatus('backordered', line);
        // TODO: log transaction?
        console.log('item backordered');
      }

      // complete this task
      await this.finishTask()

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
    this.inventory = await productDB.getInventory();
    
    // set up initial task
    this.task = await this.getTask();

    // TODO: Save transaction for starting allocator
    this.processQueue();
  }
}

const allocator = new Allocator();
console.log('Started at:', allocator.startedAt);

allocator.start();
