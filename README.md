# FEATURES : BACKEND

Some of the features of the code on Backend

## Local Mock Cache

A local mock cache prepared using in memory map. A class that extends Map<any, any> along with a method with time-to-life.

- Used at service layer at server/api/services/ for faster query times.
- Available at server/cache.ts

## Custom Logger

A logger class to implement and extend multiple types of loggers for our use case. We can use this to log into file, console or send it to a logger service via events on Kafka or api calls(not recommended for scale).

- Used at trpc server configuration file at server/apitrpc.ts
- Available at server/cache.ts

## Controllers (Not Used)

I personally felt separating controllers from routers defeats the purpose of trpc procedures. Hence the main control is implemented in trpc procedures as DUMB controllers, which use services to implement complex internal logic for each ENTITY.


# FEATURES : FRONTEND

Design being not the focus here, there are some exciting features on frontend for functionality.

## Local App State

A local database like service is provided with state/db functions provided to edit and update the app level state in web localStorage. Eases out the operations of app level state management. Easy state management without the setup of Redux. (Redux seemed an overkill here, additionally : trying it with Nextjs and trpc was difficult considering the assignment was primarily backend for me.)

- Used inside pages/*/ for global state
- Available at pages/local_data.ts

## Pagination bar

Dynamic pagination bar that handles the pages to show based on total pages.
