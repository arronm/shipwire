const PriorityQueue = require('./PriorityQueue');


// Set up job queue
const queue = new PriorityQueue(); // this can be changed to database table

// Get total inventory

// Pull next job from queue

// Process Order

// Push inventory to transaction after handled




/* ---------------- */


/*

Only valid orders should be added to the job queue

*/

const productDB = require('../api/product.model');

class Allocator {
  constructor() {
    this.startedAt = Date.now();
    this.inventory = null;
    this.tmp = ['one', 'two', 'three'];
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
    // Get inventory if hasn't been grabbed yet
    this.inventory = this.inventory || await productDB.getTotalInventory();
    let task = this.getTask();

    while (task) {
      // Sleep 1 second between tasks
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Handle task
      console.log('HANDLE TASK', task);

      // set next task
      task = this.getTask();
    }
  }

  async run() {
    while (true) {
      // process queue
      await this.processQueue();

      // recheck the queue every 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

const allocator = new Allocator();
console.log('Started at:', allocator.startedAt);

allocator.run();
// module.exports = Allocator;
