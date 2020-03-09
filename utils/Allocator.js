/*

Only valid orders should be added to the job queue

TODO: Add transaction logs in case we do somehow get invalid orders

*/
const EventEmitter = require('events');
const fs = require('fs');
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const log = require('./logger');
const productDB = require('../api/routes/Product/product.model');
const jobDB = require('../api/job.model');
const lineDB = require('../data/models')('order_products');

class Allocator {
  constructor() {
    this.event = new EventEmitter();
    this.startedAt = Date.now();
    this.listing = []

    // Set up event listeners
    this.event.on('QueueProcessed', async () => {
      await allocator.watchQueue();
    });

    this.event.on('QueueRefreshed', async () => {
      console.log('new task found');
      await allocator.processQueue();
    });

    this.event.on('InventoryDepleted', async () => {
      await this.generateListing();
      process.exit();
    });

    process.on('SIGINT', async () => {
      await this.generateListing();
      // additional log / cleanup
      log.info('Allocator Interrupted.', 'allocator');
      process.exit();
    });
  }
  
  async getTask() {
    const task = await jobDB.getJob();

    // return next task to work on
    return task;
  }

  createOutputString(list) {
    let outputString = '';
    for (let product in this.inventory) {
      if (product === '__total') {
        continue
      }
      outputString += list[product] || 0;
    }

    return outputString;
  }

  async generateListing() {
    // Generate output listing from local buffer to save on db reads
    const outputListing = this.listing.reduce((previous, current) => {
      previous += current.header + ': ';
      previous += this.createOutputString(current.received) + ' : ';
      previous += this.createOutputString(current.fulfilled) + ' : ';
      previous += this.createOutputString(current.backordered);
      return previous + '\n';
    }, 'header: received : fulfilled : backordered\n-----\n');

    await writeFile("outputlisting.txt", outputListing)
    console.log(outputListing)
    // TODO: Save transaction for stopping allocator
  }

  addReceivedListing() {
    // save received status
    this.currentListing = {
      header: this.task.header,
      ...this.currentListing,
      received: this.task.lines.reduce((previous, current) => {
        previous[current.product] = current.quantity;
        return previous;
      }, {})
    }
  }

  updateListingStatus(status, line) {
    // update current listing fulfilled / backordered based on current line
    this.currentListing[status][line.product] = line.quantity;
  }

  async updateLineStatus(status, line) {
    // Update line item with new status
    await lineDB.update(line.id, {
      status,
    });

    this.updateListingStatus(status, line);
  }

  saveTransaction(data) {
    // save transaction for changes

    // TODO: Save to database, and update in-memory listing
  }

  async finishTask() {
    this.listing.push(this.currentListing);
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
      const { id: product_id } = await productDB.getBy({ name: product }).first();

      await productDB.update(product_id, {
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

      this.currentListing = {
        received: {},
        fulfilled: {},
        backordered: {},
      };

      this.addReceivedListing();

      // Loop over each line item in the order
      for (const line of this.task.lines) {
        // check if we can fulfill this line item
        const fulfilled = await this.fulfillLineItem(line);

        if (fulfilled) {
          await this.updateLineStatus('fulfilled', line);
          // TODO: log transaction?
          continue;
        }
        
        await this.updateLineStatus('backordered', line);
        // TODO: log transaction?
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
      console.log('waiting for new tasks')
      // Check the queue every 5 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.task = await this.getTask();
    }

    this.event.emit('QueueRefreshed');
  }

  async start() {
    // get initial inventory
    this.inventory = await productDB.getInventory();
    console.log('start', this.inventory);
    
    if (this.inventory.__total === 0) {
      this.event.emit('InventoryDepleted');
    }
    
    // set up initial task
    this.task = await this.getTask();

    // TODO: Save transaction for starting allocator
    this.processQueue();
  }
}

const allocator = new Allocator();
console.log('Started at:', allocator.startedAt);

allocator.start();
