/*

Only valid orders should be added to the job queue

*/
const EventEmitter = require('events');
const productDB = require('../api/product.model');

class Allocator {
  constructor() {
    this.startedAt = Date.now();
    this.inventory = undefined;
    this.task = undefined;
    this.event = new EventEmitter();
    this.tmp = ['one', 'two', 'three'];

    this.productInventory = {
      "A": 100,
      "B": 150,
    }

    this.event.on('QueueProcessed', async () => {
      await allocator.watchQueue();
    });

    this.event.on('QueueRefreshed', async () => {
      await allocator.processQueue();
    });
  }

  getTask() {
    // Get next task to work on
    return this.tmp.shift();
  }

  generateListing() {
    // Generate listing output for all orders process during run time
  }

  updateLine(line) {
    // Update line item with new status
  }

  saveTransaction(data) {
    // save transaction for changes
  }

  async processQueue() {
    while (this.task) {
      // Sleep 1 second between tasks
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Handle task
      console.log('HANDLE TASK', this.task);
      this.inventory -= 1;

      // set next task
      this.task = this.getTask();
    }

    this.event.emit('QueueProcessed');
  }

  async watchQueue() {
    while (!this.task) {
      // Check the queue every 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      this.task = this.getTask();
    }

    this.event.emit('QueueRefreshed');
  }

  async start() {
    // get total inventory
    this.inventory = await productDB.getTotalInventory();

    // set up initial task
    this.task = this.getTask();
    this.processQueue();
  }
}

const allocator = new Allocator();
console.log('Started at:', allocator.startedAt);

allocator.start();
