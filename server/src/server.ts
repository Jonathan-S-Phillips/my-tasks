import "reflect-metadata";
import { argv } from "yargs";

import { Server, ServerOptions } from './conf/bootstrap';
import { Task } from './entity/task';
import { TaskService } from './services/task.service';

import { TASKS } from '../test/seed/tasks';

const DB = argv.db || 'mysql-db';
const PORT = 3000;

// Server options
const options: ServerOptions = {
    connectionName: DB,
    port: PORT
};

// Start the application
Server.init(options).then(app => {
    app.listen(PORT, async() => {

        // Load some data into the db if running the in-memory-db
        if(DB === 'in-memory-db') {
            console.log('adding seed data...');
            for(let i: number = 0; i < TASKS.length; i++) {
                let task:Task = await TaskService.save(TASKS[i]);
                if(TASKS[i].dateCompleted != null) {
                    task = await TaskService.complete(task.id, TASKS[i]);
                }
            }
            console.log('seed data added successfully');
        }

        console.log(`server using database connection: ${DB}`);
        console.log(`server started on port ${PORT}`);
    });
});
