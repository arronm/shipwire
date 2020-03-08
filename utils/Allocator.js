/*

Only valid orders should be added to the job queue

*/
const EventEmitter = require('events');
const productDB = require('../api/product.model');

class Allocator {
  constructor() {
    this.event = new EventEmitter();
    this.startedAt = Date.now();

    this.totalInventory = undefined;
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

    // expect to get inventory for all products
    this.inventory = {
      "A": 100,
      "B": 150,
      "C": 0,
    }

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
  
  getTask() {
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
      this.totalInventory -= quantity;
      return true;
    }

    // Backorder line item
    return false;
  }

  async processQueue() {
    while (this.task) {
      // Sleep 1 second between tasks
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      if (this.totalInventory === 0) {
        this.event.emit('InventoryDepleted');
      }

      // get next task
      this.task = this.getTask();
    }

    this.event.emit('QueueProcessed');
  }

  async watchQueue() {
    while (!this.task) {
      // Check the queue every 5 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.task = this.getTask();
    }

    this.event.emit('QueueRefreshed');
  }

  async start() {
    // get total inventory
    this.totalInventory = await productDB.getTotalInventory();

    // TODO: Save transaction for starting allocator

    // set up initial task
    this.task = this.getTask();
    this.processQueue();
  }
}

const allocator = new Allocator();
console.log('Started at:', allocator.startedAt);

allocator.start();
