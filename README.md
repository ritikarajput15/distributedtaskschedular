# distributedtaskschedular
A distributed task scheduler using Node.js that can handle the scheduling and execution of tasks across multiple worker nodes. This system will be used to efficiently distribute and manage computational tasks across a network of machines.

SetUp Distributed Task schedular:
1. Start the server => npm run dev
2. Add Users in DB
3. Add Tasks in DB
4. create a priority queue through api
then check for scheduled task to execute by worker node server after every 6 Hour(default).

Brief Description :
Users and Task added to DB through center disctributed task schedular server.After adding tasks by users or client,need to create a priority queue that will be accessed by worker node server to execute task.
