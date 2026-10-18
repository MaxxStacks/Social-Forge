import {migrate,database} from '../src/database.js';
try{await migrate();console.log('SocialEngine database migrations complete.')}catch{console.error('Database migration failed. Verify DATABASE_URL and database access.');process.exitCode=1}finally{await database()?.end()}
