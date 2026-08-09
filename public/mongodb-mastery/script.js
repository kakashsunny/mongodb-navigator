/* ============================================================
   MongoDB Mastery — vanilla JS learning platform
   Sections: DATA / UTILITIES / THEME / NAVIGATION / SEARCH /
   PROGRESS / BOOKMARKS / NOTES / QUIZ / PLAYGROUND / VIEWS
   ============================================================ */

/* ========================= DATA ========================= */
const GROUPS = [
["GETTING STARTED",[
["MongoDB Introduction","MongoDB is an open-source, document-oriented NoSQL database that stores data as flexible JSON-like documents instead of rows and tables.","Store data whose shape evolves, scale horizontally, and map records directly onto application objects.","mongosh","show dbs"],
["MongoDB Architecture","MongoDB runs a `mongod` server process; clients talk to it through drivers. Data lives in databases → collections → documents.","Understanding the layers explains where queries are parsed, where indexes live and what a driver actually sends.","Application → Driver → mongod → Database → Collection → Documents","db.serverStatus().host"],
["MongoDB Installation","Install MongoDB Community Server locally, or create a free cluster on MongoDB Atlas and connect with a URI.","You need a running server before any query works.","mongodb://localhost:27017","mongosh \"mongodb://localhost:27017\""],
["MongoDB Tools","mongosh (shell), Compass (GUI), mongodump/mongorestore (backup), mongoimport/mongoexport (data transfer), Atlas (cloud).","Different jobs need different tools; Compass is the fastest way to explore data visually.","mongoimport --db college --collection students --file students.json --jsonArray","mongoexport --db college --collection students --out students.json"]]],

["DATABASE BASICS",[
["Database","A physical container for collections. Created lazily the first time you write data into it.","Separates one application's data from another's.","use college","db.students.insertOne({name:\"Akash\"})"],
["Collection","A group of documents, equivalent to a table but schema-flexible.","Collections group related documents such as students or courses.","db.createCollection(\"students\")","db.getCollectionNames()"],
["Document","A single record stored as BSON, made of field/value pairs. Max size 16 MB.","The document is MongoDB's unit of storage and atomicity.","{ name: \"Akash\", age: 21 }","db.students.findOne()"],
["Field","A key/value pair inside a document. Field names are strings; values can be any BSON type.","Fields are what you query, project, index and update.","{ field: value }","db.students.find({}, {name:1,_id:0})"],
["_id","The mandatory primary key of every document. Unique per collection and automatically indexed.","Guarantees each document can be addressed uniquely.","{ _id: ObjectId(\"...\") }","db.students.findOne({_id: ObjectId(\"64f1a2b3c4d5e6f701000001\")})"],
["ObjectId","A 12-byte identifier: 4-byte timestamp, 5-byte random value, 3-byte counter. Default value of _id.","Generates globally unique ids on the client without a central sequence.","ObjectId(\"64f1a2b3c4d5e6f701000001\")","ObjectId(\"64f1a2b3c4d5e6f701000001\").getTimestamp()"],
["BSON","Binary JSON — MongoDB's binary storage format supporting extra types like Date, ObjectId, Decimal128 and binary data.","BSON is faster to traverse than text JSON and is strongly typed.","{ age: NumberInt(21), joined: ISODate(\"2026-01-01\") }","typeof db.students.findOne().age"],
["JSON vs BSON","JSON is text, human-readable, limited types. BSON is binary, typed, ordered and length-prefixed for fast scanning.","Explains why 1 and NumberLong(1) can behave differently.","JSON: {\"age\": 21}   BSON: age → int32(21)","db.students.find({age:{$type:\"int\"}})"],
["Data Types","String, Int32/Int64, Double, Decimal128, Boolean, Date, Array, Object, ObjectId, Null, Regex, Binary, Timestamp.","Type mismatches are the #1 cause of \"my query returns nothing\".","{ age: 21, active: true, tags: [\"a\"], created: ISODate() }","db.students.find({age:{$type:\"string\"}})"]]],

["CRUD",[
["insertOne()","Inserts a single document into a collection and returns the generated _id.","The simplest way to create data.","db.collection.insertOne(document, options)","db.students.insertOne({name:\"Akash\", age:21, city:\"Bangalore\"})"],
["insertMany()","Inserts an array of documents in one round trip. Ordered by default — stops at the first error.","Bulk loading is much faster than looping insertOne.","db.collection.insertMany([doc1, doc2], {ordered:false})","db.students.insertMany([{name:\"Rahul\",age:32},{name:\"Neha\",age:24}])"],
["find()","Returns a cursor over all documents matching a filter. An empty filter {} matches everything.","The main read operation.","db.collection.find(query, projection)","db.students.find({age:{$gt:30}}, {name:1,age:1,_id:0})"],
["findOne()","Returns the first matching document (or null) instead of a cursor.","Use when you expect exactly one result, e.g. by _id.","db.collection.findOne(query, projection)","db.students.findOne({name:\"Akash\"})"],
["updateOne()","Updates the first matching document using update operators.","Safe, targeted modification of one record.","db.collection.updateOne(filter, update, options)","db.students.updateOne({name:\"Akash\"}, {$set:{city:\"Pune\"}})"],
["updateMany()","Applies the same update to every matching document.","Bulk corrections and migrations.","db.collection.updateMany(filter, update)","db.students.updateMany({department:\"CSE\"}, {$inc:{salary:5000}})"],
["replaceOne()","Replaces the entire document (except _id) with a new one — no operators allowed.","Use when the whole record is being rewritten.","db.collection.replaceOne(filter, replacement)","db.students.replaceOne({name:\"Akash\"}, {name:\"Akash\", age:22})"],
["deleteOne()","Deletes the first document matching the filter.","Removes exactly one record.","db.collection.deleteOne(filter)","db.students.deleteOne({name:\"Akash\"})"],
["deleteMany()","Deletes every document matching the filter. deleteMany({}) empties the collection.","Bulk cleanup.","db.collection.deleteMany(filter)","db.students.deleteMany({age:{$lt:18}})"]]],

["QUERY OPERATORS",[
["Comparison Operators","$eq, $ne, $gt, $gte, $lt, $lte, $in, $nin compare a field against a value.","Every non-trivial filter uses them.","{ field: { $gt: value } }","db.students.find({age:{$gte:21,$lte:30}})"],
["Logical Operators","$and, $or, $not, $nor combine conditions. Multiple keys in one object are an implicit $and.","Express complex business rules.","{ $or: [ {a:1}, {b:2} ] }","db.students.find({$or:[{city:\"Bangalore\"},{salary:{$gt:80000}}]})"],
["Element Operators","$exists checks for the presence of a field; $type checks its BSON type.","Essential in schema-less collections.","{ field: { $exists: true } }","db.students.find({email:{$exists:false}})"],
["Evaluation Operators","$regex (pattern), $expr (compare fields), $mod, $text, $where.","Pattern matching and field-to-field comparison.","{ name: { $regex: \"^A\", $options: \"i\" } }","db.students.find({$expr:{$gt:[\"$salary\",\"$age\"]}})"],
["Array Operators","$all, $size, $elemMatch query array fields.","Arrays are first-class in MongoDB and need their own operators.","{ skills: { $all: [\"Python\",\"MongoDB\"] } }","db.students.find({skills:{$size:3}})"]]],

["DOCUMENTS & ARRAYS",[
["Embedded Documents","A document stored as the value of a field — a nested object.","Keeps related data together so one read returns everything.","{ address: { city: \"Bangalore\", pincode: 560001 } }","db.students.find({\"address.city\":\"Bangalore\"})"],
["Dot Notation","Path syntax to reach nested fields and array positions. Always quote the path.","The only way to query or update inside nested structures.","\"address.city\"  /  \"exams.0.marks\"","db.students.find({\"address.pincode\":560001})"],
["Arrays","A field holding an ordered list. A filter on the field matches if ANY element matches.","Model tags, skills and small lists without a join.","{ skills: [\"Python\",\"MongoDB\"] }","db.students.find({skills:\"MongoDB\"})"],
["Arrays of Objects","Arrays whose elements are documents, e.g. exams: [{subject, marks}].","Models one-to-few relationships inline.","{ exams: [ { subject:\"Math\", marks:95 } ] }","db.students.find({\"exams.subject\":\"Math\"})"],
["$elemMatch","Requires that a SINGLE array element satisfies all the given conditions.","Without it, separate conditions may be satisfied by different elements.","{ arr: { $elemMatch: { a: 1, b: { $gt: 2 } } } }","db.students.find({exams:{$elemMatch:{subject:\"Math\",marks:{$gt:90}}}})"]]],

["PROJECTION",[
["Projection","The second argument of find() choosing which fields come back.","Less data over the wire = faster queries.","db.c.find(query, { field: 1 })","db.students.find({}, {name:1, age:1, _id:0})"],
["Include Fields","Set fields to 1. Only _id may be mixed with inclusion.","Return only what the UI needs.","{ name: 1, age: 1 }","db.students.find({}, {name:1})"],
["Exclude Fields","Set fields to 0 to hide them.","Hide sensitive or heavy fields.","{ password: 0 }","db.students.find({}, {salary:0})"],
["Nested Projection","Project nested fields with dot notation.","Return a single nested value instead of the whole subdocument.","{ \"address.city\": 1 }","db.students.find({}, {\"address.city\":1,_id:0})"],
["Array Projection","$slice, $ and $elemMatch limit which array elements return.","Avoid shipping huge arrays to the client.","{ exams: { $slice: 1 } }","db.students.find({}, {name:1, exams:{$slice:1}})"]]],

["UPDATE OPERATORS",[
["$set","Creates or overwrites a field's value.","The everyday update operator.","{ $set: { field: value } }","db.students.updateOne({name:\"Akash\"}, {$set:{city:\"Delhi\"}})"],
["$unset","Removes a field entirely from the document.","Clean up obsolete fields.","{ $unset: { field: \"\" } }","db.students.updateMany({}, {$unset:{tempFlag:\"\"}})"],
["$inc","Increments (or decrements with a negative value) a numeric field atomically.","Counters, scores, stock levels.","{ $inc: { field: 1 } }","db.students.updateOne({name:\"Akash\"}, {$inc:{age:1}})"],
["$mul","Multiplies a numeric field.","Percentage changes such as a 10% raise.","{ $mul: { field: 1.1 } }","db.students.updateMany({}, {$mul:{salary:1.1}})"],
["$min","Updates the field only if the new value is LOWER than the current one.","Track minimum observed values.","{ $min: { field: value } }","db.students.updateOne({name:\"Akash\"}, {$min:{salary:50000}})"],
["$max","Updates the field only if the new value is HIGHER than the current one.","Track high scores or maximums.","{ $max: { field: value } }","db.students.updateOne({name:\"Akash\"}, {$max:{salary:90000}})"],
["$rename","Renames a field, keeping its value.","Schema migrations without rewriting documents.","{ $rename: { old: \"new\" } }","db.students.updateMany({}, {$rename:{\"city\":\"hometown\"}})"],
["$currentDate","Sets a field to the current date or timestamp.","Automatic updatedAt tracking.","{ $currentDate: { updatedAt: true } }","db.students.updateOne({name:\"Akash\"}, {$currentDate:{updatedAt:true}})"]]],

["ARRAY UPDATE OPERATORS",[
["$push","Appends a value to an array (duplicates allowed).","Add items to a list.","{ $push: { arr: value } }","db.students.updateOne({name:\"Akash\"}, {$push:{skills:\"Docker\"}})"],
["$addToSet","Appends only if the value is not already present.","Keep arrays unique like a set.","{ $addToSet: { arr: value } }","db.students.updateOne({name:\"Akash\"}, {$addToSet:{skills:\"Python\"}})"],
["$pop","Removes the first (-1) or last (1) element.","Queue and stack behaviour.","{ $pop: { arr: 1 } }","db.students.updateOne({name:\"Akash\"}, {$pop:{skills:-1}})"],
["$pull","Removes every element matching a value or condition.","Delete list entries by content.","{ $pull: { arr: condition } }","db.students.updateOne({name:\"Akash\"}, {$pull:{skills:\"Java\"}})"],
["$pullAll","Removes all listed values from an array.","Bulk removal of exact values.","{ $pullAll: { arr: [v1,v2] } }","db.students.updateOne({name:\"Akash\"}, {$pullAll:{skills:[\"Java\",\"PHP\"]}})"],
["$each","Modifier used with $push/$addToSet to add several values at once.","Batch appends in a single operation.","{ $push: { arr: { $each: [a,b] } } }","db.students.updateOne({name:\"Akash\"}, {$push:{skills:{$each:[\"AWS\",\"Redis\"]}}})"],
["$position","With $each, inserts at a specific index instead of the end.","Control ordering inside the array.","{ $push:{arr:{$each:[x], $position:0}} }","db.students.updateOne({name:\"Akash\"}, {$push:{skills:{$each:[\"Go\"],$position:0}}})"],
["$slice","With $each, trims the array to a maximum length.","Keep only the latest N entries.","{ $push:{arr:{$each:[x], $slice:-5}} }","db.students.updateOne({name:\"Akash\"}, {$push:{skills:{$each:[\"Rust\"],$slice:-5}}})"],
["$sort (array update)","With $each, sorts array elements after the push.","Maintain a sorted leaderboard.","{ $push:{arr:{$each:[], $sort:{marks:-1}}} }","db.students.updateOne({name:\"Akash\"}, {$push:{exams:{$each:[],$sort:{marks:-1}}}})"]]],

["QUERY UTILITIES",[
["sort()","Orders results: 1 ascending, -1 descending.","Deterministic output and top-N queries.","db.c.find().sort({field:-1})","db.students.find().sort({salary:-1})"],
["limit()","Caps the number of returned documents.","Protects the client from huge result sets.","db.c.find().limit(n)","db.students.find().sort({salary:-1}).limit(5)"],
["skip()","Skips the first n documents. Slow on large offsets.","Classic pagination (page × size).","db.c.find().skip(n)","db.students.find().skip(10).limit(10)"],
["countDocuments()","Counts documents matching a filter by actually scanning/using an index — accurate.","Exact counts for reports.","db.c.countDocuments(filter)","db.students.countDocuments({city:\"Bangalore\"})"],
["estimatedDocumentCount()","Reads collection metadata — instant but approximate and ignores filters.","Dashboards where speed beats precision.","db.c.estimatedDocumentCount()","db.students.estimatedDocumentCount()"],
["distinct()","Returns the array of unique values for a field.","Build filter dropdowns.","db.c.distinct(field, query)","db.students.distinct(\"city\")"]]],

["INDEXES",[
["Index Basics","A B-tree structure storing sorted field values with pointers to documents.","Turns a collection scan (COLLSCAN) into an index scan (IXSCAN).","db.c.createIndex({field:1})","db.students.createIndex({age:1})"],
["Single Field Index","Index on one field; usable in both sort directions.","Speeds up equality, range and sort on that field.","db.c.createIndex({age:1})","db.students.find({age:25}).explain(\"executionStats\")"],
["Compound Index","Index on several fields; follows the ESR rule (Equality, Sort, Range) and a prefix rule.","One index can serve many query shapes.","db.c.createIndex({city:1, age:-1})","db.students.find({city:\"Pune\"}).sort({age:-1})"],
["Multikey Index","Automatically created when indexing an array field — one entry per element.","Fast lookups inside arrays.","db.c.createIndex({skills:1})","db.students.find({skills:\"MongoDB\"})"],
["Unique Index","Rejects duplicate values for the indexed field.","Enforce uniqueness of email or roll number.","db.c.createIndex({email:1},{unique:true})","db.students.createIndex({email:1},{unique:true})"],
["Text Index","Tokenises string fields for $text search. One text index per collection.","Simple full-text search without a search engine.","db.c.createIndex({name:\"text\"})","db.students.find({$text:{$search:\"mongodb\"}})"],
["Partial Index","Indexes only documents matching a filter expression.","Smaller index, lower write cost.","{partialFilterExpression:{age:{$gt:18}}}","db.students.createIndex({age:1},{partialFilterExpression:{age:{$gt:18}}})"],
["Sparse Index","Skips documents that do not contain the field.","Optional fields present on few documents.","db.c.createIndex({email:1},{sparse:true})","db.students.createIndex({email:1},{sparse:true})"],
["TTL Index","Deletes documents automatically N seconds after a date field.","Sessions, OTPs, logs, caches.","db.c.createIndex({createdAt:1},{expireAfterSeconds:3600})","db.sessions.createIndex({createdAt:1},{expireAfterSeconds:3600})"],
["explain()","Shows the query plan: COLLSCAN vs IXSCAN, docs examined, execution time.","The only honest way to prove an index is used.","db.c.find(q).explain(\"executionStats\")","db.students.find({age:{$gt:30}}).explain(\"executionStats\")"]]],

["AGGREGATION",[
["Aggregation Basics","A pipeline of stages where the output documents of one stage feed the next.","Reporting, grouping and joins that find() cannot express.","db.c.aggregate([ stage1, stage2 ])","db.students.aggregate([{$match:{age:{$gt:20}}},{$count:\"total\"}])"],
["$match","Filters documents. Put it first so indexes can be used.","Reduces the data flowing through the pipeline.","{ $match: { field: value } }","db.students.aggregate([{$match:{department:\"CSE\"}}])"],
["$project","Reshapes documents: include, exclude, rename or compute fields.","Control the output shape.","{ $project: { name:1, _id:0 } }","db.students.aggregate([{$project:{name:1, yearly:{$multiply:[\"$salary\",12]}}}])"],
["$group","Groups by an _id expression and applies accumulators ($sum, $avg, $max, $min, $push).","The heart of analytics queries.","{ $group: { _id:\"$city\", total:{$sum:1} } }","db.students.aggregate([{$group:{_id:\"$city\", avgSalary:{$avg:\"$salary\"}}}])"],
["$sort (stage)","Orders the pipeline's documents.","Rank results before limiting.","{ $sort: { field: -1 } }","db.students.aggregate([{$sort:{salary:-1}},{$limit:3}])"],
["$limit","Keeps only the first n documents.","Top-N reports.","{ $limit: n }","db.students.aggregate([{$limit:5}])"],
["$skip","Discards the first n documents.","Pagination inside a pipeline.","{ $skip: n }","db.students.aggregate([{$skip:10},{$limit:10}])"],
["$unwind","Deconstructs an array field into one document per element.","Required before grouping on array contents.","{ $unwind: \"$arrayField\" }","db.students.aggregate([{$unwind:\"$exams\"},{$group:{_id:\"$exams.subject\", avg:{$avg:\"$exams.marks\"}}}])"],
["$lookup","Performs a left outer join with another collection in the same database.","Combine referenced collections.","{ $lookup:{from,localField,foreignField,as} }","db.students.aggregate([{$lookup:{from:\"courses\",localField:\"course_id\",foreignField:\"_id\",as:\"course\"}}])"],
["$count","Returns a single document with the number of input documents.","Quick totals.","{ $count: \"fieldName\" }","db.students.aggregate([{$match:{age:{$gt:25}}},{$count:\"seniors\"}])"],
["$addFields","Adds computed fields while keeping all existing ones.","Derive values without listing every field.","{ $addFields: { f: expr } }","db.students.aggregate([{$addFields:{skillCount:{$size:\"$skills\"}}}])"],
["$set (stage)","Alias of $addFields introduced in MongoDB 4.2.","Same behaviour, clearer name.","{ $set: { f: expr } }","db.students.aggregate([{$set:{senior:{$gte:[\"$age\",30]}}}])"],
["$unset (stage)","Removes fields from pipeline documents.","Drop heavy fields before returning.","{ $unset: \"field\" }","db.students.aggregate([{$unset:\"salary\"}])"],
["$replaceRoot","Promotes a subdocument to be the new root document.","Flatten nested results.","{ $replaceRoot:{ newRoot:\"$address\" } }","db.students.aggregate([{$replaceRoot:{newRoot:\"$address\"}}])"],
["$replaceWith","Shorthand alias of $replaceRoot.","Same purpose, shorter syntax.","{ $replaceWith: \"$address\" }","db.students.aggregate([{$replaceWith:\"$address\"}])"],
["$facet","Runs several sub-pipelines on the same input and returns all results together.","Dashboards needing counts + list + buckets in one query.","{ $facet: { a:[...], b:[...] } }","db.students.aggregate([{$facet:{byCity:[{$group:{_id:\"$city\",n:{$sum:1}}}], total:[{$count:\"n\"}]}}])"],
["$bucket","Groups documents into explicit numeric boundaries.","Histogram with known ranges.","{ $bucket:{groupBy,boundaries,default} }","db.students.aggregate([{$bucket:{groupBy:\"$age\",boundaries:[18,22,26,40],default:\"other\"}}])"],
["$bucketAuto","Automatically distributes documents into n buckets.","Quick distribution analysis.","{ $bucketAuto:{groupBy,buckets} }","db.students.aggregate([{$bucketAuto:{groupBy:\"$salary\",buckets:4}}])"],
["$sortByCount","Shortcut for $group + $sort by count descending.","Top categories in one stage.","{ $sortByCount: \"$field\" }","db.students.aggregate([{$unwind:\"$skills\"},{$sortByCount:\"$skills\"}])"]]],

["SCHEMA DESIGN",[
["Embedding","Storing related data inside the parent document.","One read returns everything; atomic single-document updates.","{ student: { exams: [ ... ] } }","db.students.find({\"exams.marks\":{$gt:90}})"],
["Referencing","Storing an _id pointer to a document in another collection.","Avoids duplication and unbounded document growth.","{ course_id: ObjectId(\"...\") }","db.students.aggregate([{$lookup:{from:\"courses\",localField:\"course_id\",foreignField:\"_id\",as:\"course\"}}])"],
["One-to-One","One document relates to exactly one other — usually embedded.","Profile data belonging to a single user.","{ user: { profile: {...} } }","db.users.find({\"profile.city\":\"Pune\"})"],
["One-to-Many","One parent with many children: embed if few and bounded, reference if many.","Student → exams (embed) vs College → students (reference).","{ exams: [ {...}, {...} ] }","db.students.find({\"exams.subject\":\"Math\"})"],
["Many-to-Many","Model with arrays of references on one or both sides, or a junction collection.","Students ↔ courses.","{ course_ids: [ObjectId(), ObjectId()] }","db.students.find({course_ids: ObjectId(\"64f1a2b3c4d5e6f702000001\")})"],
["Normalization","Splitting data across collections to remove duplication.","Consistency when data changes often.","students + courses collections","db.courses.updateOne({_id:id},{$set:{title:\"DBMS II\"}})"],
["Denormalization","Duplicating a few fields to avoid joins on read.","Read-heavy workloads.","{ course_id: id, course_name: \"DBMS\" }","db.students.find({course_name:\"DBMS\"})"],
["Schema Design Rules","Design for your queries: data accessed together should be stored together; avoid unbounded arrays; watch the 16 MB limit.","Schema quality decides performance more than any index.","Rule: model the access pattern, not the entities.","db.students.stats()"]]],

["VALIDATION",[
["$jsonSchema","Declarative validator attached to a collection describing allowed structure.","Guarantees documents keep a minimum shape.","{ $jsonSchema: { bsonType:\"object\", required:[...] } }","db.createCollection(\"students\",{validator:{$jsonSchema:{bsonType:\"object\",required:[\"name\"]}}})"],
["bsonType","Specifies the expected BSON type of a field inside a schema.","Prevents \"21\" being stored where 21 is expected.","{ age: { bsonType: \"int\" } }","{ properties: { age: { bsonType: \"int\", minimum: 16 } } }"],
["required","Array of field names that must be present.","Mandatory fields.","required: [\"name\",\"age\"]","{ $jsonSchema: { required:[\"name\",\"age\"] } }"],
["properties","Per-field rules: type, range, pattern, description.","Fine-grained field validation.","properties: { name: { bsonType:\"string\" } }","{ properties: { email: { bsonType:\"string\", pattern:\"^.+@.+$\" } } }"],
["enum","Restricts a field to a fixed list of values.","Status and category fields.","{ enum: [\"Male\",\"Female\",\"Other\"] }","{ properties: { gender: { enum: [\"Male\",\"Female\",\"Other\"] } } }"],
["validationLevel","strict (all writes) or moderate (only documents that already pass).","Introduce validation on existing data safely.","validationLevel: \"moderate\"","db.runCommand({collMod:\"students\", validationLevel:\"moderate\"})"],
["validationAction","error rejects invalid writes; warn only logs them.","Roll out validation without breaking production.","validationAction: \"warn\"","db.runCommand({collMod:\"students\", validationAction:\"warn\"})"]]],

["ADVANCED",[
["Transactions","Multiple operations across documents and collections committed atomically inside a session.","Money transfers, multi-collection consistency.","session.startTransaction() … commitTransaction()","const s=db.getMongo().startSession(); s.startTransaction(); /* ops */ s.commitTransaction()"],
["ACID","Atomicity, Consistency, Isolation, Durability. Single-document writes are always atomic.","Explains what MongoDB guarantees by default.","Single document = atomic without a transaction","db.students.updateOne({_id:id},{$inc:{balance:-100}})"],
["Sessions","A logical client context enabling causal consistency, retryable writes and transactions.","Required before starting a transaction.","const s = client.startSession()","db.getMongo().startSession()"],
["Authentication","Proving identity with SCRAM users, x.509 certificates or Atlas cloud identity.","Nobody should reach production data anonymously.","db.createUser({user, pwd, roles})","db.createUser({user:\"app\",pwd:\"secret\",roles:[{role:\"readWrite\",db:\"college\"}]})"],
["Authorization","Deciding what an authenticated user may do, via roles and privileges.","Least privilege limits blast radius.","roles: [{role:\"read\", db:\"college\"}]","db.grantRolesToUser(\"app\",[{role:\"read\",db:\"reports\"}])"],
["RBAC","Role-Based Access Control: built-in roles (read, readWrite, dbAdmin, clusterAdmin) plus custom roles.","Scales permissions across teams.","db.createRole({role, privileges, roles})","db.getUser(\"app\")"],
["Security","TLS in transit, encryption at rest, IP allow-lists, no hardcoded credentials, field-level encryption, audit logs.","Production checklist.","mongodb+srv://user:pass@cluster/db?tls=true","db.adminCommand({getParameter:1, authenticationMechanisms:1})"],
["MongoDB Atlas","Managed MongoDB in the cloud: free tier, backups, monitoring, Atlas Search and automatic scaling.","No server administration required.","mongodb+srv://<user>:<pass>@cluster0.mongodb.net/college","mongosh \"mongodb+srv://cluster0.mongodb.net/college\" --username app"]]],

["PYTHON",[
["PyMongo","The official Python driver. Methods use snake_case: insert_one, find_one, update_many.","Connect MongoDB to Python, Django or FastAPI apps.","from pymongo import MongoClient","client = MongoClient(\"mongodb://localhost:27017\")\ndb = client[\"college\"]\nstudents = db[\"students\"]\nstudents.insert_one({\"name\":\"Akash\",\"age\":21})\nfor s in students.find({\"age\":{\"$gt\":20}}, {\"_id\":0}):\n    print(s)"]]],

["NODE.JS",[
["MongoDB Node Driver","The official low-level driver. Async/await, no schema, full control.","Maximum flexibility and performance.","const { MongoClient } = require('mongodb')","const client = new MongoClient(uri);\nawait client.connect();\nconst db = client.db('college');\nawait db.collection('students').insertOne({name:'Akash', age:21});"],
["Mongoose","An ODM adding schemas, validation, middleware, population and virtuals on top of the driver.","Structure and safety for Node.js applications.","const mongoose = require('mongoose')","const schema = new mongoose.Schema({name:{type:String,required:true}, age:Number},{timestamps:true});\nconst Student = mongoose.model('Student', schema);"],
["Mongoose Schemas","Define fields, types, defaults, enums, required rules and options like timestamps.","A contract for your documents in application code.","new mongoose.Schema({...}, {timestamps:true})","new mongoose.Schema({gender:{type:String, enum:['Male','Female','Other']}, active:{type:Boolean, default:true}})"],
["Mongoose Models","A compiled schema providing query helpers: create, find, findById, updateOne.","The object you actually call in controllers.","mongoose.model('Student', schema)","const s = await Student.create({name:'Neha', age:24});"],
["Mongoose Validation","Built-in validators (required, min, max, enum, match) plus custom validators.","Reject bad data before it reaches the database.","{ age: { type: Number, min: 16 } }","await Student.create({age:12}); // ValidationError"],
["Mongoose Middleware","pre/post hooks around save, validate, remove and query operations.","Hash passwords, write audit logs.","schema.pre('save', function(next){...})","schema.pre('save', function(next){ this.name = this.name.trim(); next(); })"],
["Mongoose Population","Replaces stored ObjectId references with the referenced documents.","Joins expressed in application code.","Model.find().populate('course')","const s = await Student.find().populate('course','title');"],
["Mongoose Virtuals","Computed properties that are not persisted to MongoDB.","Derived values like fullName.","schema.virtual('x').get(fn)","schema.virtual('isAdult').get(function(){ return this.age >= 18; });"],
["Mongoose Indexes","Declare indexes in the schema; Mongoose creates them at startup.","Keep index definitions in version control.","schema.index({ city: 1, age: -1 })","studentSchema.index({email:1},{unique:true});"]]],

["OPTIMIZATION",[
["Query Optimization","Filter early, project only needed fields, avoid unanchored regex and $where, always check explain().","Cheap queries keep the whole app fast.","db.c.find(q,{needed:1}).explain(\"executionStats\")","db.students.find({city:\"Pune\"},{name:1,_id:0}).explain(\"executionStats\")"],
["Index Optimization","Follow ESR, drop unused indexes, watch write cost, prefer covered queries.","Indexes are not free — each one slows writes.","db.c.aggregate([{$indexStats:{}}])","db.students.createIndex({city:1, salary:-1})"],
["Pagination","skip/limit is simple but slow on big offsets; range (cursor) pagination scales.","Fast \"next page\" at any depth.","db.c.find({_id:{$gt:lastId}}).limit(20)","db.students.find({_id:{$gt:ObjectId(\"...\")}}).sort({_id:1}).limit(20)"],
["Large Arrays","Unbounded arrays break the 16 MB limit and slow every read — use the outlier or bucket pattern.","Keeps documents small and predictable.","Move growth into a child collection","db.comments.insertOne({post_id:id, text:\"...\"})"],
["Aggregation Optimization","Put $match and $limit first, $project early, use indexes before $group and allowDiskUse for big sorts.","Pipelines can be orders of magnitude faster when ordered well.","[{$match:...},{$project:...},{$group:...}]","db.students.aggregate(pipeline,{allowDiskUse:true})"],
["Performance Monitoring","Use explain(), the slow-query log, $indexStats, serverStatus and Atlas Performance Advisor.","Measure before optimising.","db.setProfilingLevel(1, {slowms:100})","db.system.profile.find().sort({ts:-1}).limit(5)"]]],

["PROJECT",[
["Student Management System","A complete four-collection project: students, courses, exams and projects with references, indexes, validation and reports.","Puts every concept together in one realistic application.","collections: students, courses, exams, projects","db.students.aggregate([{$lookup:{from:\"courses\",localField:\"course_id\",foreignField:\"_id\",as:\"course\"}},{$unwind:\"$course\"},{$group:{_id:\"$course.title\", students:{$sum:1}}}])"]]]
];

/* Build flat topic list */
const TOPICS = [];
GROUPS.forEach(([cat, items]) => items.forEach(it => {
  TOPICS.push({
    id: "t" + (TOPICS.length + 1), n: TOPICS.length + 1, cat,
    title: it[0], def: it[1], why: it[2], syntax: it[3], example: it[4]
  });
}));

/* Realistic dataset (20 students) */
const CITIES = ["Bangalore","Pune","Delhi","Hyderabad","Chennai","Mumbai","Kolkata"];
const DEPTS = ["CSE","IT","ECE","ME"];
const SKILLSETS = [["Python","MongoDB","JavaScript"],["Java","Spring","MySQL"],["C++","DSA","MongoDB"],
  ["JavaScript","Node.js","Mongoose"],["Python","Pandas","MongoDB"],["Go","Docker","Kubernetes"]];
const NAMES = ["Akash","Rahul","Neha","Priya","Vikram","Sneha","Arjun","Kavya","Rohit","Ananya",
  "Karan","Meera","Suresh","Divya","Manish","Pooja","Nikhil","Ishita","Aditya","Ritu"];
const DATA = NAMES.map((name, i) => {
  const age = 19 + ((i * 3) % 16);
  const city = CITIES[i % CITIES.length];
  return {
    _id: "ObjectId('64f1a2b3c4d5e6f7010000" + String(i + 1).padStart(2, "0") + "')",
    name, age,
    gender: i % 2 ? "Female" : "Male",
    city, department: DEPTS[i % DEPTS.length],
    skills: SKILLSETS[i % SKILLSETS.length],
    salary: 45000 + ((i * 7919) % 60000),
    exams: [
      { subject: "Math", marks: 60 + ((i * 13) % 40) },
      { subject: "Science", marks: 55 + ((i * 17) % 45) },
      { subject: "DBMS", marks: 50 + ((i * 23) % 50) }
    ],
    address: { city, pincode: 560000 + i * 7 },
    projects: [{ name: i % 2 ? "Library System" : "Student Management System", technology: "MongoDB" }]
  };
});

/* Cheat sheet */
const CHEAT = [
  ["$eq","Equal to","{age: {$eq: 20}}"],["$ne","Not equal","{age: {$ne: 20}}"],
  ["$gt","Greater than","{age: {$gt: 20}}"],["$gte","Greater or equal","{age: {$gte: 20}}"],
  ["$lt","Less than","{age: {$lt: 20}}"],["$lte","Less or equal","{age: {$lte: 20}}"],
  ["$in","Matches any value in list","{city: {$in: ['Pune','Delhi']}}"],
  ["$nin","Matches none of the values","{city: {$nin: ['Pune']}}"],
  ["$and","All conditions true","{$and: [{age:{$gt:20}},{city:'Pune'}]}"],
  ["$or","Any condition true","{$or: [{age:{$lt:20}},{city:'Pune'}]}"],
  ["$not","Negates a condition","{age: {$not: {$gt: 20}}}"],
  ["$nor","None of the conditions true","{$nor: [{age:20},{city:'Pune'}]}"],
  ["$exists","Field present or absent","{email: {$exists: true}}"],
  ["$type","Field BSON type","{age: {$type: 'int'}}"],
  ["$regex","Pattern match","{name: {$regex: '^A'}}"],
  ["$expr","Compare two fields","{$expr: {$gt: ['$salary','$age']}}"],
  ["$all","Array contains all values","{skills: {$all: ['Python','MongoDB']}}"],
  ["$size","Array length equals","{skills: {$size: 3}}"],
  ["$elemMatch","One array element matches all conditions","{exams: {$elemMatch: {subject:'Math', marks:{$gt:90}}}}"],
  ["$set","Set / overwrite field","{$set: {age: 22}}"],["$unset","Remove field","{$unset: {temp: ''}}"],
  ["$inc","Increment number","{$inc: {age: 1}}"],["$mul","Multiply number","{$mul: {salary: 1.1}}"],
  ["$min","Set if lower","{$min: {salary: 50000}}"],["$max","Set if higher","{$max: {salary: 90000}}"],
  ["$rename","Rename field","{$rename: {city: 'hometown'}}"],
  ["$currentDate","Set current date","{$currentDate: {updatedAt: true}}"],
  ["$push","Append to array","{$push: {skills: 'Python'}}"],
  ["$addToSet","Append if absent","{$addToSet: {skills: 'Python'}}"],
  ["$pop","Remove first/last element","{$pop: {skills: 1}}"],
  ["$pull","Remove matching elements","{$pull: {skills: 'Java'}}"],
  ["$pullAll","Remove listed values","{$pullAll: {skills: ['Java','PHP']}}"],
  ["$each","Add multiple values","{$push: {skills: {$each: ['A','B']}}}"],
  ["$match","Pipeline filter","{$match: {age: {$gt: 20}}}"],
  ["$group","Group + accumulate","{$group: {_id:'$city', n:{$sum:1}}}"],
  ["$unwind","Flatten array","{$unwind: '$skills'}"],
  ["$lookup","Join collections","{$lookup:{from:'courses',localField:'course_id',foreignField:'_id',as:'course'}}"],
  ["$project","Reshape document","{$project: {name:1, _id:0}}"],
  ["$facet","Parallel sub-pipelines","{$facet: {a:[...], b:[...]}}"],
  ["$sortByCount","Group + sort by count","{$sortByCount: '$city'}"]
];

/* Interview questions */
const INTERVIEW = [
["Beginner", [
["What is MongoDB?","A document-oriented NoSQL database that stores flexible, JSON-like BSON documents inside collections instead of rows inside tables.",true],
["What is BSON?","Binary JSON — MongoDB's binary storage format. It is typed (Date, ObjectId, Decimal128, Binary), length-prefixed and faster to traverse than text JSON.",true],
["Database vs Collection vs Document?","A database contains collections; a collection contains documents; a document is a set of field/value pairs — the unit of storage and atomicity.",false],
["What is _id?","The mandatory, unique primary key of every document. If you do not supply it, the driver generates an ObjectId, and it is always indexed.",true],
["What is an ObjectId made of?","12 bytes: a 4-byte timestamp, a 5-byte random value and a 3-byte incrementing counter.",false],
["Difference between find() and findOne()?","find() returns a cursor over all matches; findOne() returns the first matching document or null.",false],
["Is MongoDB schema-less?","It is schema-flexible, not schema-free: documents in a collection may differ, but you can enforce structure with $jsonSchema validation.",true]
]],
["Intermediate", [
["$elemMatch vs a plain array query?","Plain conditions can be satisfied by different elements of the array; $elemMatch requires a single element to satisfy all conditions at once.",true],
["updateOne vs replaceOne?","updateOne applies operators to selected fields; replaceOne swaps the entire document (keeping _id) and forbids operators.",false],
["countDocuments vs estimatedDocumentCount?","countDocuments is accurate and honours a filter; estimatedDocumentCount reads metadata, is instant but approximate and ignores filters.",false],
["What is projection?","Selecting which fields the query returns. 1 includes, 0 excludes, and you cannot mix them except for _id.",true],
["Explain the aggregation pipeline.","An ordered array of stages ($match, $group, $sort…) where each stage transforms the stream of documents and passes it to the next.",true],
["What does $unwind do?","It deconstructs an array field, producing one output document per array element — usually a prerequisite for grouping on array contents.",false],
["Embedding vs referencing?","Embed data read together and bounded in size; reference data that is large, shared or grows without limit.",true]
]],
["Advanced", [
["How do indexes work in MongoDB?","B-tree structures storing sorted keys and pointers to documents, converting a COLLSCAN into an IXSCAN for filters, sorts and covered queries.",true],
["What is the ESR rule?","In compound indexes order fields as Equality, then Sort, then Range for maximum efficiency.",true],
["What is a covered query?","A query answered entirely from the index because every queried and projected field is in the index — no document fetch needed.",true],
["What is a multikey index?","An index on an array field: MongoDB stores one index entry per array element. Compound multikey on two arrays is not allowed.",false],
["What is a TTL index?","An index on a date field with expireAfterSeconds; a background thread deletes expired documents — ideal for sessions and logs.",false],
["How do transactions work?","Inside a session you start, perform multi-document operations and commit or abort atomically. They need a replica set and cost more than single-document writes.",true],
["What is $lookup and its limitation?","A left outer join with another collection in the same database. It can be expensive and un-indexed joins on large collections should be avoided.",false]
]],
["Expert", [
["How do you diagnose a slow query?","Run explain('executionStats'), compare totalDocsExamined with nReturned, look for COLLSCAN or large in-memory SORT, then add or reshape an index.",true],
["Why is skip() slow at scale?","The server must walk and discard every skipped document. Use range/cursor pagination on an indexed field such as _id instead.",true],
["How would you model 1-to-millions?","Reference from the child to the parent, or use the bucket pattern to group children into fixed-size documents, never an unbounded array.",true],
["What is the outlier pattern?","Keep the common case embedded and move rare, oversized cases into an overflow collection flagged on the parent document.",false],
["How does sharding distribute data?","Documents are split into chunks by a shard key across shards; a poor shard key creates hotspots and jumbo chunks.",true],
["What is a write concern?","The acknowledgement level of a write (w:1, w:'majority', journaling), trading durability against latency.",false],
["How do you secure a production cluster?","Authentication + least-privilege RBAC, TLS everywhere, IP allow-lists, encryption at rest, secrets outside code, auditing and regular backups.",true]
]]
];

/* Common mistakes */
const MISTAKES = [
["Missing $ on operators","{ price: { gt: 600 } }","{ price: { $gt: 600 } }","MongoDB query operators must start with $, otherwise gt is treated as a literal field name."],
["Using = instead of a filter object","db.students.find(age = 21)","db.students.find({ age: 21 })","Queries are documents, never assignments."],
["Update without an operator","db.students.updateOne({name:'Akash'}, {age: 22})","db.students.updateOne({name:'Akash'}, {$set:{age: 22}})","Without $set MongoDB rejects the update (or replaces the document in older drivers)."],
["Mixing include and exclude","db.students.find({}, {name:1, age:0})","db.students.find({}, {name:1, _id:0})","Only _id may be excluded inside an inclusion projection."],
["Array conditions without $elemMatch","{ 'exams.subject':'Math', 'exams.marks':{$gt:90} }","{ exams: { $elemMatch: { subject:'Math', marks:{$gt:90} } } }","Separate conditions may be satisfied by different array elements."],
["$project inside the Compass Project field","{ $project: { name: 1 } }","{ name: 1 }","Compass's Project field already is the projection — do not wrap it in a stage."],
["$match inside the Compass Filter field","{ $match: { age: { $gt: 30 } } }","{ age: { $gt: 30 } }","Pipeline stages belong in the Aggregations tab, not in Filter."],
["Comparing a number to a string","{ age: '21' }","{ age: 21 }","BSON is typed: '21' never equals 21."],
["Sorting without an index on big data","db.students.find().sort({salary:-1})","db.students.createIndex({salary:-1})","In-memory sorts above 100 MB fail; index the sort field."],
["Unbounded arrays","{ post: { comments: [ /* 100k items */ ] } }","db.comments.insertOne({post_id: id, text:'...'})","Documents are capped at 16 MB and huge arrays slow every read."],
["Using skip() for deep pagination","db.students.find().skip(100000).limit(20)","db.students.find({_id:{$gt:lastId}}).limit(20)","skip must walk every skipped document."],
["Forgetting quotes in dot notation","db.students.find({address.city:'Pune'})","db.students.find({'address.city':'Pune'})","Dotted paths must be quoted strings."]
];

/* Roadmap + 30-day plan */
const ROADMAP = ["MongoDB Basics","CRUD","Query Operators","Arrays","Projection","Updates","Indexes",
  "Aggregation","Schema Design","Validation","Transactions","Security","Atlas","PyMongo / Node.js",
  "Mongoose","Optimization","Real Project","EXPERT"];
const PLAN30 = ["MongoDB Introduction & Architecture","Database, Collection, Document","BSON, ObjectId & Data Types",
  "insertOne & insertMany","find & findOne","updateOne & updateMany","replaceOne, deleteOne & deleteMany",
  "Comparison operators","Logical operators","Element & evaluation operators","Embedded documents & dot notation",
  "Arrays & arrays of objects","$elemMatch deep dive","Projection basics","Array projection & $slice",
  "Update operators ($set, $inc, $unset)","Array update operators ($push, $pull)","sort, limit, skip, distinct",
  "Index basics & explain()","Compound, multikey & unique indexes","Text, TTL & partial indexes",
  "Aggregation basics: $match, $group","$project, $sort, $limit, $skip","$unwind & $lookup",
  "$facet, $bucket, $addFields","Schema design: embedding vs referencing","Validation with $jsonSchema",
  "Transactions, sessions & ACID","Security, RBAC & Atlas","Build the Student Management System"];

/* ======================= UTILITIES ======================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("mm_" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("mm_" + k, JSON.stringify(v)); } catch {} }
};
function highlight(code) {
  return esc(code)
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>')
    .replace(/(&quot;|&#39;|'|")([^'"\n]*?)\1/g, '<span class="tok-str">$1$2$1</span>')
    .replace(/(\$[a-zA-Z]+)/g, '<span class="tok-op">$1</span>')
    .replace(/\b(db|const|let|var|new|require|function|return|await|async|from|import|for|in|print|class)\b/g, '<span class="tok-fn">$1</span>')
    .replace(/\b(true|false|null|None)\b/g, '<span class="tok-bool">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>')
    .replace(/([a-zA-Z_][\w.]*)(\s*:)/g, '<span class="tok-key">$1</span>$2');
}
function codeBlock(code, label = "MongoDB Shell") {
  const lines = String(code).split("\n");
  return `<div class="code">
    <div class="code-head"><span>${esc(label)}</span>
      <button class="copy" type="button" data-copy="${esc(code)}">📋 Copy</button></div>
    <div class="code-body">
      <div class="gutter">${lines.map((_, i) => i + 1).join("<br>")}</div>
      <pre>${highlight(code)}</pre>
    </div></div>`;
}
function pretty(v, ind = 0) {
  const pad = "  ".repeat(ind + 1), padEnd = "  ".repeat(ind);
  if (Array.isArray(v)) return v.length ? "[\n" + v.map(x => pad + pretty(x, ind + 1)).join(",\n") + "\n" + padEnd + "]" : "[]";
  if (v && typeof v === "object") {
    const k = Object.keys(v);
    return k.length ? "{\n" + k.map(key => pad + key + ": " + pretty(v[key], ind + 1)).join(",\n") + "\n" + padEnd + "}" : "{}";
  }
  if (typeof v === "string") return v.startsWith("ObjectId(") ? v : '"' + v + '"';
  return String(v);
}
function toast(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t);
    Object.assign(t.style, { position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
      background: "var(--card)", border: "1px solid var(--green)", color: "var(--green)", padding: "10px 18px",
      borderRadius: "10px", zIndex: 99, fontSize: ".88rem" }); }
  t.textContent = msg; t.style.opacity = "1";
  clearTimeout(t._t); t._t = setTimeout(() => (t.style.opacity = "0"), 1600);
}
function revealObserver() {
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ========================= THEME ========================= */
function initializeTheme() {
  const saved = store.get("theme", "dark");
  document.documentElement.dataset.theme = saved;
  const btn = $("#themeBtn");
  btn.textContent = saved === "dark" ? "🌙" : "☀️";
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    btn.textContent = next === "dark" ? "🌙" : "☀️";
    store.set("theme", next);
  });
}

/* ======================== PROGRESS ======================== */
const progress = {
  done: () => store.get("done", []),
  isDone: id => progress.done().includes(id),
  toggle(id) {
    const d = progress.done(); const i = d.indexOf(id);
    i === -1 ? d.push(id) : d.splice(i, 1);
    store.set("done", d); progress.render(); buildSidebar();
    return i === -1;
  },
  render() {
    const pct = Math.round((progress.done().length / TOPICS.length) * 100);
    $("#progressPct").textContent = pct + "%";
    const bar = $("#homeBar"); if (bar) bar.style.width = pct + "%";
    const lbl = $("#homeBarLabel");
    if (lbl) lbl.textContent = `${progress.done().length} / ${TOPICS.length} topics completed (${pct}%)`;
  }
};
/* ======================= BOOKMARKS ======================= */
const marks = {
  all: () => store.get("marks", []),
  has: id => marks.all().includes(id),
  toggle(id) {
    const m = marks.all(); const i = m.indexOf(id);
    i === -1 ? m.push(id) : m.splice(i, 1); store.set("marks", m); return i === -1;
  }
};
/* ========================= NOTES ========================= */
const notes = {
  get: id => store.get("note_" + id, ""),
  set: (id, v) => store.set("note_" + id, v)
};

/* ======================= NAVIGATION ======================= */
function buildSidebar() {
  const tree = $("#sidebarTree");
  const openGroups = store.get("openGroups", ["GETTING STARTED"]);
  tree.innerHTML = GROUPS.map(([cat]) => {
    const items = TOPICS.filter(t => t.cat === cat);
    const open = openGroups.includes(cat) ? " open" : "";
    return `<div class="tree-group${open}" data-cat="${esc(cat)}">
      <button class="tree-head" aria-expanded="${!!open}">${esc(cat)}<span>▾</span></button>
      <div class="tree-items">${items.map(t =>
        `<button class="tree-item${progress.isDone(t.id) ? " done" : ""}" data-route="#/topic/${t.id}">
          <span class="num">${String(t.n).padStart(2, "0")}</span>${esc(t.title)}</button>`).join("")}</div>
    </div>`;
  }).join("");
  markActive();
}
function markActive() {
  const h = location.hash || "#/home";
  $$(".side-link,.tree-item").forEach(b => b.classList.toggle("active", b.dataset.route === h));
  const active = $(".tree-item.active");
  if (active) active.closest(".tree-group")?.classList.add("open");
}
function go(route) { location.hash = route; }
function initializeNavigation() {
  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-route]");
    if (nav) { go(nav.dataset.route); closeDrawer(); return; }
    const head = e.target.closest(".tree-head");
    if (head) {
      const g = head.closest(".tree-group"); g.classList.toggle("open");
      head.setAttribute("aria-expanded", g.classList.contains("open"));
      store.set("openGroups", $$(".tree-group.open").map(x => x.dataset.cat));
    }
    const cp = e.target.closest(".copy");
    if (cp) {
      navigator.clipboard?.writeText(cp.dataset.copy);
      cp.textContent = "✓ Copied!"; cp.classList.add("ok");
      setTimeout(() => { cp.textContent = "📋 Copy"; cp.classList.remove("ok"); }, 1400);
    }
    const acc = e.target.closest(".acc-head");
    if (acc) { const a = acc.closest(".acc"); a.classList.toggle("open"); acc.setAttribute("aria-expanded", a.classList.contains("open")); }
    const tab = e.target.closest(".tab");
    if (tab) {
      const wrap = tab.closest(".tabwrap");
      $$(".tab", wrap).forEach(t => t.classList.toggle("active", t === tab));
      $$(".tabpanel", wrap).forEach(p => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    }
  });
  $("#menuBtn").addEventListener("click", () => ($("#sidebar").classList.contains("open") ? closeDrawer() : openDrawer()));
  $("#scrim").addEventListener("click", closeDrawer);
  $("#closeDrawerBtn")?.addEventListener("click", closeDrawer);
  $("#searchBtn")?.addEventListener("click", () => {
    const w = $("#searchWrap"), open = w.classList.toggle("open");
    $("#searchBtn").setAttribute("aria-expanded", String(open));
    if (open) setTimeout(() => $("#searchInput").focus(), 30);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeDrawer(); $("#searchWrap")?.classList.remove("open"); }
  });
  $("#resetBtn").addEventListener("click", () => {
    if (confirm("Reset all progress, bookmarks, notes and quiz scores?")) {
      Object.keys(localStorage).filter(k => k.startsWith("mm_") && k !== "mm_theme").forEach(k => localStorage.removeItem(k));
      progress.render(); buildSidebar(); render(); toast("Progress reset");
    }
  });
  window.addEventListener("hashchange", render);
}
function openDrawer() { $("#sidebar").classList.add("open"); $("#scrim").hidden = false; document.body.classList.add("no-scroll"); $("#menuBtn").setAttribute("aria-expanded", "true"); }
function closeDrawer() { $("#sidebar").classList.remove("open"); $("#scrim").hidden = true; document.body.classList.remove("no-scroll"); $("#menuBtn").setAttribute("aria-expanded", "false"); }

/* ========================= SEARCH ========================= */
function searchIndex() {
  const idx = TOPICS.map(t => ({ title: t.title, cat: t.cat, desc: t.def, route: "#/topic/" + t.id }));
  CHEAT.forEach(([op, purpose, ex]) => idx.push({ title: op, cat: "Cheat Sheet", desc: purpose + " — " + ex, route: "#/cheatsheet" }));
  INTERVIEW.forEach(([lvl, qs]) => qs.forEach(([q, a]) => idx.push({ title: q, cat: "Interview · " + lvl, desc: a.slice(0, 110) + "…", route: "#/interview" })));
  MISTAKES.forEach(m => idx.push({ title: m[0], cat: "Common Mistakes", desc: m[3], route: "#/mistakes" }));
  [["Query Playground", "#/playground"], ["Operator Explorer", "#/operators"], ["Aggregation Visualizer", "#/aggregation-visualizer"],
   ["Index Visualizer", "#/index-visualizer"], ["Schema Visualizer", "#/schema-visualizer"], ["Compass Guide", "#/compass"],
   ["Practice Questions", "#/practice"], ["30-Day Plan", "#/plan30"], ["Roadmap", "#/roadmap"]]
    .forEach(([t, r]) => idx.push({ title: t, cat: "Tools", desc: "Interactive section", route: r }));
  return idx;
}
function initializeSearch() {
  const idx = searchIndex(), input = $("#searchInput"), box = $("#searchResults");
  let cursor = -1;
  const close = () => { box.hidden = true; input.setAttribute("aria-expanded", "false"); cursor = -1; };
  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return close();
    const hits = idx.filter(i => (i.title + " " + i.cat + " " + i.desc).toLowerCase().includes(q)).slice(0, 20);
    box.innerHTML = hits.length
      ? hits.map(h => `<button class="sr-item" data-route="${h.route}"><span class="sr-cat">${esc(h.cat)}</span>${esc(h.title)}<small>${esc(h.desc.slice(0, 120))}</small></button>`).join("")
      : `<div class="sr-item">No results found for “${esc(input.value)}”</div>`;
    box.hidden = false; input.setAttribute("aria-expanded", "true");
  };
  input.addEventListener("input", run);
  input.addEventListener("focus", run);
  input.addEventListener("keydown", e => {
    const items = $$(".sr-item[data-route]", box);
    if (e.key === "Escape") { close(); input.blur(); }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); if (!items.length) return;
      cursor = (cursor + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle("active", i === cursor));
      items[cursor].scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter" && items.length) { (items[cursor] || items[0]).click(); input.blur(); close(); }
  });
  document.addEventListener("click", e => { if (!e.target.closest(".search-wrap")) close(); });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); input.focus(); input.select(); }
  });
  box.addEventListener("click", () => close());
}

/* ======================= PLAYGROUND ======================= */
function getPath(doc, path) {
  return path.split(".").reduce((acc, k) => {
    if (acc === undefined || acc === null) return undefined;
    if (Array.isArray(acc)) { const mapped = acc.map(x => (x ? x[k] : undefined)).filter(v => v !== undefined); return mapped.length ? mapped : undefined; }
    return acc[k];
  }, doc);
}
function cmp(a, b) { if (a === b) return 0; return a > b ? 1 : -1; }
function matchValue(val, cond) {
  const vals = Array.isArray(val) ? [val, ...val] : [val];
  if (cond && typeof cond === "object" && !Array.isArray(cond) && Object.keys(cond).some(k => k.startsWith("$"))) {
    return Object.entries(cond).every(([op, arg]) => {
      switch (op) {
        case "$eq": return vals.some(v => JSON.stringify(v) === JSON.stringify(arg));
        case "$ne": return !vals.some(v => JSON.stringify(v) === JSON.stringify(arg));
        case "$gt": return vals.some(v => typeof v !== "object" && cmp(v, arg) > 0);
        case "$gte": return vals.some(v => typeof v !== "object" && cmp(v, arg) >= 0);
        case "$lt": return vals.some(v => typeof v !== "object" && cmp(v, arg) < 0);
        case "$lte": return vals.some(v => typeof v !== "object" && cmp(v, arg) <= 0);
        case "$in": return vals.some(v => arg.some(a => JSON.stringify(a) === JSON.stringify(v)));
        case "$nin": return !vals.some(v => arg.some(a => JSON.stringify(a) === JSON.stringify(v)));
        case "$exists": return (val !== undefined) === !!arg;
        case "$type": return typeof val === arg || (arg === "array" && Array.isArray(val)) || (arg === "int" && Number.isInteger(val));
        case "$regex": return typeof val === "string" && new RegExp(arg, cond.$options || "").test(val);
        case "$size": return Array.isArray(val) && val.length === arg;
        case "$all": return Array.isArray(val) && arg.every(a => val.includes(a));
        case "$not": return !matchValue(val, arg);
        case "$elemMatch": return Array.isArray(val) && val.some(el => matchDoc(el, arg));
        case "$options": return true;
        default: throw new Error("Unsupported operator " + op);
      }
    });
  }
  return vals.some(v => JSON.stringify(v) === JSON.stringify(cond));
}
function matchDoc(doc, query) {
  return Object.entries(query || {}).every(([k, cond]) => {
    if (k === "$and") return cond.every(q => matchDoc(doc, q));
    if (k === "$or") return cond.some(q => matchDoc(doc, q));
    if (k === "$nor") return !cond.some(q => matchDoc(doc, q));
    if (k === "$expr") throw new Error("$expr is not supported in this simulator");
    return matchValue(getPath(doc, k), cond);
  });
}
function project(doc, spec) {
  if (!spec || !Object.keys(spec).length) return doc;
  const keys = Object.keys(spec).filter(k => k !== "_id");
  const including = keys.some(k => spec[k] === 1 || spec[k] === true);
  const out = {};
  if (including) {
    keys.forEach(k => { const v = getPath(doc, k); if (v !== undefined && spec[k]) out[k] = v; });
    if (spec._id !== 0 && spec._id !== false) out._id = doc._id;
  } else {
    Object.keys(doc).forEach(k => { if (spec[k] !== 0 && spec[k] !== false) out[k] = doc[k]; });
    if (spec._id === 0 || spec._id === false) delete out._id;
  }
  return out;
}
function parseObj(txt) {
  const t = (txt || "").trim();
  if (!t) return {};
  // eslint-disable-next-line no-new-func
  return Function('"use strict";return (' + t + ")")();
}
function initializePlayground(root) {
  const runBtn = $("#pgRun", root); if (!runBtn) return;
  const out = $("#pgOut", root);
  const run = () => {
    const t0 = performance.now();
    try {
      const q = parseObj($("#pgQuery", root).value);
      const p = parseObj($("#pgProject", root).value);
      const s = parseObj($("#pgSort", root).value);
      const skip = parseInt($("#pgSkip", root).value || "0", 10);
      const limit = parseInt($("#pgLimit", root).value || "0", 10);
      let res = DATA.filter(d => matchDoc(d, q));
      const matched = res.length;
      const sk = Object.keys(s);
      if (sk.length) res = res.slice().sort((a, b) => {
        for (const k of sk) { const c = cmp(getPath(a, k), getPath(b, k)) * (s[k] < 0 ? -1 : 1); if (c) return c; }
        return 0;
      });
      if (skip > 0) res = res.slice(skip);
      if (limit > 0) res = res.slice(0, limit);
      res = res.map(d => project(d, p));
      const ms = (performance.now() - t0).toFixed(1);
      out.innerHTML = `<div class="row" style="margin-bottom:10px">
          <span class="badge green">Documents matched: ${matched}</span>
          <span class="badge info">Returned: ${res.length}</span>
          <span class="badge">Execution time: ${ms} ms</span></div>` +
        codeBlock(res.length ? pretty(res) : "[]  // no documents matched", "Result");
    } catch (err) {
      out.innerHTML = `<div class="callout bad"><b>Query error:</b> ${esc(err.message)}<br>
        <span class="muted">This simulator supports find-style filters, projection, sort, skip and limit.</span></div>`;
    }
  };
  runBtn.addEventListener("click", run);
  $$("[data-preset]", root).forEach(b => b.addEventListener("click", () => {
    $("#pgQuery", root).value = b.dataset.preset; run();
  }));
  run();
}

/* ========================== QUIZ ========================== */
function buildQuestions() {
  const qs = [];
  const push = (q, options, answer, explanation) => qs.push({ q, options, answer, explanation });
  // operator questions from cheat sheet
  CHEAT.forEach(([op, purpose, ex], i) => {
    const wrong = CHEAT.filter(c => c[0] !== op).sort(() => (i % 7) - 3).slice(0, 3).map(c => c[0]);
    push(`Which operator is used to: ${purpose.toLowerCase()}?`, shuffle([op, ...wrong], i), op, `${op} — ${purpose}. Example: ${ex}`);
    push(`What does <code>${esc(op)}</code> do?`, shuffle([purpose, ...CHEAT.filter(c => c[0] !== op).slice(i % 20, (i % 20) + 3).map(c => c[1])], i + 1), purpose, `${op}: ${purpose}. Example: ${ex}`);
  });
  // topic questions
  TOPICS.forEach((t, i) => {
    const others = TOPICS.filter(x => x.id !== t.id);
    const wrong = [others[(i * 5 + 1) % others.length].title, others[(i * 11 + 3) % others.length].title, others[(i * 17 + 7) % others.length].title];
    push(`Which concept is described: “${t.def.split(".")[0]}.”`, shuffle([t.title, ...new Set(wrong)].slice(0, 4), i), t.title, `${t.title} — ${t.def} (Category: ${t.cat})`);
    if (i % 2 === 0) push(`Which syntax matches <b>${esc(t.title)}</b>?`,
      shuffle([t.syntax, others[(i * 3 + 2) % others.length].syntax, others[(i * 7 + 5) % others.length].syntax, others[(i * 13 + 9) % others.length].syntax], i + 2),
      t.syntax, `${t.title}: ${t.why}`);
  });
  // output prediction on the dataset
  const preds = [
    ["How many students in the dataset are older than 30?", DATA.filter(d => d.age > 30).length],
    ["How many students live in Bangalore?", DATA.filter(d => d.city === "Bangalore").length],
    ["How many students have 'MongoDB' in their skills array?", DATA.filter(d => d.skills.includes("MongoDB")).length],
    ["How many students earn more than 80000?", DATA.filter(d => d.salary > 80000).length],
    ["How many students belong to the CSE department?", DATA.filter(d => d.department === "CSE").length]
  ];
  preds.forEach(([q, ans], i) => push(q + " (use the Playground dataset)",
    shuffle([String(ans), String(ans + 1), String(Math.max(0, ans - 2)), String(ans + 4)], i), String(ans),
    `Run the equivalent query in the Playground and read “Documents matched”.`));
  // mistakes-based debugging questions
  MISTAKES.forEach((m, i) => push(`Debugging: what is wrong with <code>${esc(m[1])}</code>?`,
    shuffle([m[0], "Nothing is wrong", "The collection name is invalid", "MongoDB does not support this field type"], i),
    m[0], m[3] + " Correct form: " + m[2]));
  return qs.slice(0, 300);
}
function shuffle(arr, seed = 1) {
  const a = [...new Set(arr)].slice(0, 4);
  for (let i = a.length - 1; i > 0; i--) { const j = (seed * (i + 3) * 7 + 5) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const QUESTIONS = buildQuestions();
const LEVELS = [["Level 1 · Beginner", 0, 50], ["Level 2 · Easy", 50, 100], ["Level 3 · Intermediate", 100, 170],
  ["Level 4 · Advanced", 170, 240], ["Level 5 · Expert", 240, 300]];

function quizView(levelIdx = 0) {
  const [name, from, to] = LEVELS[levelIdx];
  const qs = QUESTIONS.slice(from, to);
  const stats = store.get("quiz", { correct: 0, wrong: 0 });
  return `<h1>Practice Questions</h1>
  <p class="muted">${QUESTIONS.length} interactive questions across five levels — query writing, output prediction, debugging, operators, aggregation, schema design and indexes.</p>
  <div class="row" style="margin-bottom:16px">
    ${LEVELS.map((l, i) => `<button class="tab ${i === levelIdx ? "active" : ""}" data-level="${i}">${esc(l[0])} (${l[2] - l[1]})</button>`).join("")}
  </div>
  <div class="grid g4" style="margin-bottom:18px">
    <div class="stat"><b id="qScore">${stats.correct}</b><small>Correct</small></div>
    <div class="stat"><b id="qWrong">${stats.wrong}</b><small>Wrong</small></div>
    <div class="stat"><b id="qAcc">${stats.correct + stats.wrong ? Math.round(stats.correct / (stats.correct + stats.wrong) * 100) : 0}%</b><small>Accuracy</small></div>
    <div class="stat"><b>${to - from}</b><small>Questions in level</small></div>
  </div>
  ${qs.map((q, i) => `<div class="card quiz" data-idx="${from + i}">
      <span class="badge green">Question ${from + i + 1}</span>
      <h3 style="margin-top:10px">${q.q}</h3>
      ${q.options.map(o => `<label class="opt"><input type="radio" name="q${from + i}" value="${esc(o)}"><span>${o.startsWith("<") ? o : esc(o)}</span></label>`).join("")}
      <button class="btn sm check">Check Answer</button>
      <div class="feedback" style="margin-top:10px"></div>
    </div>`).join("")}`;
}
function initializeQuiz(root) {
  root.addEventListener("click", e => {
    const lvl = e.target.closest("[data-level]");
    if (lvl) { root.innerHTML = quizView(+lvl.dataset.level); initializeQuiz(root); window.scrollTo({ top: 0 }); return; }
    const btn = e.target.closest(".check");
    if (!btn) return;
    const card = btn.closest(".quiz"), idx = +card.dataset.idx, q = QUESTIONS[idx];
    const chosen = $(`input[name="q${idx}"]:checked`, card);
    const fb = $(".feedback", card);
    if (!chosen) { fb.innerHTML = `<div class="callout warn">Please select an option first.</div>`; return; }
    const ok = chosen.value === q.answer.replace(/<[^>]+>/g, "") || chosen.value === q.answer;
    $$(".opt", card).forEach(o => {
      const v = $("input", o).value;
      if (v === q.answer) o.classList.add("correct");
      else if (o.contains(chosen)) o.classList.add("wrong");
    });
    fb.innerHTML = `<div class="callout ${ok ? "good" : "bad"} flash">
        <b>${ok ? "✓ Correct!" : "✗ Incorrect"}</b><br>${ok ? "" : "Correct answer: <b>" + esc(q.answer) + "</b><br>"}${q.explanation}</div>`;
    const stats = store.get("quiz", { correct: 0, wrong: 0 });
    ok ? stats.correct++ : stats.wrong++;
    store.set("quiz", stats);
    $("#qScore").textContent = stats.correct; $("#qWrong").textContent = stats.wrong;
    $("#qAcc").textContent = Math.round(stats.correct / (stats.correct + stats.wrong) * 100) + "%";
  });
}

/* ========================== VIEWS ========================== */
function homeView() {
  const done = progress.done().length, pct = Math.round(done / TOPICS.length * 100);
  const levels = [
    ["🟢 BEGINNER", "var(--green)", ["MongoDB fundamentals", "Documents", "Collections", "BSON", "CRUD", "Basic queries"], "#/topic/t1"],
    ["🔵 INTERMEDIATE", "var(--info)", ["Operators", "Arrays", "Projection", "Updates", "Indexes", "Aggregation"], "#/topic/t23"],
    ["🟣 ADVANCED", "var(--violet)", ["Schema design", "Transactions", "Validation", "Security", "Optimization", "Atlas"], "#/topic/t90"],
    ["🔴 EXPERT", "var(--danger)", ["Production architecture", "Performance", "Advanced aggregation", "Mongoose", "System design", "Real projects"], "#/topic/t123"]
  ];
  const chain = ["Application", "MongoDB Driver", "MongoDB", "Database", "Collection", "Documents"];
  return `
  <section class="hero">
    <div>
      <span class="badge green">Beginner → Intermediate → Advanced → Expert</span>
      <h1>MASTER<br><span>MONGODB</span></h1>
      <p class="lead">From your first document to production-ready databases. Learn MongoDB through practical examples,
      interactive queries, projects and challenges.</p>
      <div class="row">
        <button class="btn primary" data-route="#/topic/t1">🚀 Start Learning</button>
        <button class="btn" data-route="#/playground">📚 Explore Topics</button>
      </div>
    </div>
    <div class="stack-viz">
      ${chain.map((c, i) => `<div class="node${i === 2 ? " hi" : ""}" style="animation-delay:${i * .09}s">${c}</div>${i < chain.length - 1 ? '<div class="wire"></div>' : ""}`).join("")}
    </div>
  </section>

  <div class="grid g4 reveal" style="margin-bottom:22px">
    <div class="stat"><b>${TOPICS.length}+</b><small>📚 Topics</small></div>
    <div class="stat"><b>${QUESTIONS.length}</b><small>💻 Practice Questions</small></div>
    <div class="stat"><b>${INTERVIEW.reduce((a, g) => a + g[1].length, 0)}</b><small>🎯 Interview Questions</small></div>
    <div class="stat"><b>5</b><small>🧠 Learning Levels</small></div>
  </div>

  <div class="card reveal">
    <h3>Your Progress</h3>
    <div class="bar"><i id="homeBar" style="width:${pct}%"></i></div>
    <p class="muted" id="homeBarLabel" style="margin-top:8px">${done} / ${TOPICS.length} topics completed (${pct}%)</p>
    <button class="btn sm ghost" id="resetBtn2">Reset Progress</button>
  </div>

  <h2 class="reveal">Learning Levels</h2>
  <div class="grid g2 reveal" style="margin-bottom:24px">
    ${levels.map(([t, c, list, r]) => `<div class="level" style="--lc:${c}">
      <h3>${t}</h3><ul>${list.map(x => `<li>${x}</li>`).join("")}</ul>
      <button class="btn sm" data-route="${r}">Start Level →</button></div>`).join("")}
  </div>

  <h2 class="reveal">CRUD Visualizer</h2>
  <div class="grid g4 reveal" style="margin-bottom:24px">
    ${[["CREATE", ["insertOne()", "insertMany()"], "t14"], ["READ", ["find()", "findOne()"], "t16"],
       ["UPDATE", ["updateOne()", "updateMany()", "replaceOne()"], "t18"], ["DELETE", ["deleteOne()", "deleteMany()"], "t21"]]
      .map(([t, ops, id]) => `<div class="card" style="margin:0">
        <span class="badge green">${t}</span>
        <div style="margin-top:10px">${ops.map(o => `<button class="link-btn" data-route="#/topic/${TOPICS.find(x => x.title === o)?.id || id}">${o}</button>`).join("")}</div>
      </div>`).join("")}
  </div>

  <h2 class="reveal">Explore the platform</h2>
  <div class="grid g3 reveal">
    ${[["▶️ Query Playground", "Run simulated MongoDB queries on 20 real student documents.", "#/playground"],
       ["🧩 Operator Explorer", "Click any operator to see meaning, syntax and examples.", "#/operators"],
       ["🔗 Pipeline Visualizer", "Watch documents change after each aggregation stage.", "#/aggregation-visualizer"],
       ["⚡ Index Visualizer", "Collection scan vs index scan, animated.", "#/index-visualizer"],
       ["🏗️ Schema Visualizer", "Embedding vs referencing, side by side.", "#/schema-visualizer"],
       ["🧭 Compass Guide", "Exactly what to paste into Filter, Project and Sort.", "#/compass"],
       ["❌ Common Mistakes", "The errors every MongoDB beginner makes.", "#/mistakes"],
       ["🎓 Student Management System", "A full four-collection project.", "#/project"],
       ["📅 30-Day Plan", "A day-by-day learning schedule with checkboxes.", "#/plan30"]]
      .map(([t, d, r]) => `<div class="card" style="margin:0"><h3>${t}</h3><p class="muted">${d}</p>
        <button class="btn sm" data-route="${r}">Open →</button></div>`).join("")}
  </div>`;
}

function topicView(id) {
  const t = TOPICS.find(x => x.id === id) || TOPICS[0];
  const i = TOPICS.indexOf(t), next = TOPICS[i + 1], prev = TOPICS[i - 1];
  const shellQ = t.example;
  const compassFilter = t.example.includes("find(")
    ? (t.example.match(/find\(\s*(\{[\s\S]*?\})\s*[,)]/) || [, "{}"])[1].replace(/'/g, '"')
    : "{}";
  return `
  <div class="breadcrumb">MongoDB / <span>${esc(t.cat)}</span> / ${esc(t.title)}</div>
  <div class="row" style="justify-content:space-between;align-items:flex-start">
    <h1 style="margin-bottom:6px">${esc(t.title)}</h1>
    <div class="row">
      <button class="btn sm" id="bmBtn">${marks.has(t.id) ? "★ Bookmarked" : "☆ Bookmark"}</button>
      <button class="btn sm ${progress.isDone(t.id) ? "primary" : ""}" id="doneBtn">${progress.isDone(t.id) ? "✓ Completed" : "○ Mark as Complete"}</button>
    </div>
  </div>
  <p class="muted">Topic ${t.n} of ${TOPICS.length} · ${esc(t.cat)}</p>

  <div class="card"><h3>Definition</h3><p>${esc(t.def)}</p></div>
  <div class="card"><h3>Why it is used</h3><p>${esc(t.why)}</p></div>
  <div class="card"><h3>Syntax</h3>${codeBlock(t.syntax, "Syntax")}</div>

  <div class="card tabwrap">
    <h3>Example</h3>
    <div class="tabs" role="tablist">
      <button class="tab active" data-tab="shell">MongoDB Shell</button>
      <button class="tab" data-tab="compass">MongoDB Compass</button>
    </div>
    <div class="tabpanel" data-panel="shell">
      ${codeBlock(shellQ, "MongoDB Shell")}
      <h4>Explanation</h4>
      <p class="muted">${esc(t.def)} Here the command targets the collection, applies the arguments shown above and returns the
      matching result set (or an acknowledgement object for write operations).</p>
    </div>
    <div class="tabpanel" data-panel="compass" hidden>
      <p class="muted">Paste only the query document into the correct Compass field — never a full pipeline stage.</p>
      <div class="compass">
        <div class="compass-bar">🧭 MongoDB Compass · college › students</div>
        <div class="compass-fields">
          <div class="cfield"><b>Filter</b><code>${esc(compassFilter)}</code></div>
          <div class="cfield"><b>Project</b><code>{ "name": 1, "age": 1, "_id": 0 }</code></div>
          <div class="cfield"><b>Sort</b><code>{ "age": -1 }</code></div>
          <div class="cfield"><b>Skip</b><code>0</code></div>
          <div class="cfield"><b>Limit</b><code>20</code></div>
        </div>
      </div>
      <div class="callout" style="margin-top:12px">Filter → query condition · Project → fields to return · Sort → ordering ·
      Skip → documents to skip · Limit → maximum documents. Aggregation pipelines go in the <b>Aggregations</b> tab.</div>
    </div>
  </div>

  <div class="card">
    <h3>Output</h3>
    ${codeBlock(pretty(DATA.slice(0, 1).map(d => ({ _id: d._id, name: d.name, age: d.age, city: d.city }))), "Sample output")}
    <p class="muted">Output shape depends on the operation: reads return documents, writes return an acknowledgement such as
    <code>{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }</code>.</p>
  </div>

  <div class="card"><h3>Common Mistakes</h3>
    ${MISTAKES.slice(t.n % 6, (t.n % 6) + 2).map(m => `<div class="callout bad"><b>❌ ${esc(m[0])}</b><br><code>${esc(m[1])}</code></div>
      <div class="callout good"><b>✅ Correct</b><br><code>${esc(m[2])}</code><br><span class="muted">${esc(m[3])}</span></div>`).join("")}
  </div>

  <div class="card"><h3>Practice Questions</h3>
    <ol class="muted">
      <li>Write the ${esc(t.title)} command for the <code>students</code> collection.</li>
      <li>Explain in one sentence when you would choose ${esc(t.title)} over a similar feature.</li>
      <li>Reproduce the example in the Query Playground and describe the result.</li>
    </ol>
    <div class="acc"><button class="acc-head" aria-expanded="false">Show answers <span class="chev">▾</span></button>
      <div class="acc-body">${codeBlock(t.example, "Answer")}<p>${esc(t.why)}</p></div></div>
    <button class="btn sm" data-route="#/playground">Open Playground →</button>
  </div>

  <div class="card"><h3>💼 Interview Tip</h3>
    <p class="muted">Be ready to explain <b>${esc(t.title)}</b> in one sentence, give a working example, and say when
    <i>not</i> to use it. ${esc(t.why)}</p></div>

  <div class="card"><h3>📝 My Notes</h3>
    <textarea id="noteBox" placeholder="Write your notes here…">${esc(notes.get(t.id))}</textarea>
    <div class="row" style="margin-top:10px"><button class="btn sm primary" id="saveNote">Save Notes</button></div>
  </div>

  <div class="row" style="justify-content:space-between">
    ${prev ? `<button class="btn ghost" data-route="#/topic/${prev.id}">← ${esc(prev.title)}</button>` : "<span></span>"}
    ${next ? `<button class="btn primary" data-route="#/topic/${next.id}">Next: ${esc(next.title)} →</button>` : "<span></span>"}
  </div>`;
}

function playgroundView() {
  return `<h1>MongoDB Query Playground</h1>
  <p class="muted">A simulated MongoDB engine running in your browser over 20 realistic student documents.
  Supports filters, comparison and logical operators, dot notation, array queries, $elemMatch, projection, sort, skip and limit.</p>
  <div class="grid g2">
    <div class="card">
      <div class="field"><label>Collection</label><select id="pgColl"><option>students</option></select></div>
      <div class="field"><label>Query (filter)</label><textarea id="pgQuery">{ age: { $gt: 30 } }</textarea></div>
      <div class="field"><label>Projection</label><input type="text" id="pgProject" value="{ name: 1, age: 1, city: 1, _id: 0 }"></div>
      <div class="row">
        <div class="field" style="flex:1"><label>Sort</label><input type="text" id="pgSort" value="{ age: -1 }"></div>
        <div class="field" style="width:90px"><label>Skip</label><input type="number" id="pgSkip" value="0"></div>
        <div class="field" style="width:90px"><label>Limit</label><input type="number" id="pgLimit" value="5"></div>
      </div>
      <button class="btn primary" id="pgRun">▶ Run Query</button>
      <div class="sep"></div>
      <label class="muted" style="font-size:.78rem">Presets</label>
      <div class="row" style="margin-top:8px">
        ${[["Age > 30", "{ age: { $gt: 30 } }"], ["City in list", "{ city: { $in: ['Bangalore','Pune'] } }"],
           ["Knows MongoDB", "{ skills: 'MongoDB' }"], ["$elemMatch", "{ exams: { $elemMatch: { subject: 'Math', marks: { $gt: 80 } } } }"],
           ["$or", "{ $or: [ { salary: { $gt: 90000 } }, { age: { $lt: 21 } } ] }"], ["Nested field", "{ 'address.city': 'Delhi' }"],
           ["$size", "{ skills: { $size: 3 } }"], ["$regex", "{ name: { $regex: '^A' } }"]]
          .map(([l, q]) => `<button class="btn sm ghost" data-preset="${esc(q)}">${l}</button>`).join("")}
      </div>
    </div>
    <div><div id="pgOut"></div></div>
  </div>
  <div class="card"><h3>Dataset sample</h3>${codeBlock(pretty(DATA[0]), "students · document 1 of 20")}</div>
  <div class="card"><h3>$elemMatch vs Normal Array Query</h3>
    ${codeBlock("{\n  name: \"Akash\",\n  exams: [\n    { subject: \"Math\", marks: 95 },\n    { subject: \"Science\", marks: 80 }\n  ]\n}", "Document")}
    <div class="grid g2">
      <div><span class="badge danger">Without $elemMatch</span>
        ${codeBlock("db.students.find({\n  \"exams.subject\": \"Science\",\n  \"exams.marks\": { $gt: 90 }\n})", "Shell")}
        <p class="muted">MATCHES — “Science” comes from element 2 and “marks &gt; 90” from element 1. Different elements!</p></div>
      <div><span class="badge green">With $elemMatch</span>
        ${codeBlock("db.students.find({\n  exams: {\n    $elemMatch: {\n      subject: \"Science\",\n      marks: { $gt: 90 }\n    }\n  }\n})", "Shell")}
        <p class="muted">NO MATCH — one single element must satisfy both conditions.</p></div>
    </div>
    <div class="callout good">Same array element → subject = Math + marks &gt; 90 → ✅ MATCH. Different elements → ❌ with $elemMatch.</div>
  </div>`;
}

function operatorsView() {
  const cats = { Comparison: ["$eq","$ne","$gt","$gte","$lt","$lte","$in","$nin"], Logical: ["$and","$or","$not","$nor"],
    Element: ["$exists","$type"], Evaluation: ["$regex","$expr"], Array: ["$all","$size","$elemMatch"],
    Update: ["$set","$unset","$inc","$mul","$min","$max","$rename","$currentDate","$push","$addToSet","$pop","$pull","$pullAll","$each"],
    Aggregation: ["$match","$group","$unwind","$lookup","$project","$facet","$sortByCount"] };
  return `<h1>Operator Explorer</h1><p class="muted">Click any operator to see what it means, with syntax and a runnable example.</p>
  <div class="grid g2">
    <div class="card">
      ${Object.entries(cats).map(([c, ops]) => `<h4 style="margin-top:14px">${c}</h4>
        <div class="row">${ops.map(o => `<button class="btn sm ghost op" data-op="${o}">${o}</button>`).join("")}</div>`).join("")}
    </div>
    <div class="card" id="opPanel"><p class="muted">Select an operator on the left…</p></div>
  </div>`;
}
function initializeOperators(root) {
  const panel = $("#opPanel", root); if (!panel) return;
  const show = op => {
    const row = CHEAT.find(c => c[0] === op);
    if (!row) return;
    panel.innerHTML = `<h2 style="color:var(--green)">${esc(op)}</h2><p>${esc(row[1])}</p>
      ${codeBlock(row[2], "Example")}
      <div class="callout">Meaning: <b>${esc(row[1])}</b></div>
      <button class="btn sm" data-preset-op="${esc(row[2])}">Try in Playground →</button>`;
    $("[data-preset-op]", panel)?.addEventListener("click", () => { store.set("pgPreset", row[2]); go("#/playground"); });
  };
  $$(".op", root).forEach(b => b.addEventListener("click", () => show(b.dataset.op)));
  show("$gt");
}

function aggView() {
  const stages = [
    ["$match", "{ $match: { department: 'CSE' } }", DATA.filter(d => d.department === "CSE").slice(0, 3).map(d => ({ name: d.name, department: d.department, city: d.city, salary: d.salary }))],
    ["$group", "{ $group: { _id: '$city', avgSalary: { $avg: '$salary' }, students: { $sum: 1 } } }",
      Object.values(DATA.filter(d => d.department === "CSE").reduce((acc, d) => {
        acc[d.city] = acc[d.city] || { _id: d.city, avgSalary: 0, students: 0, _t: 0 };
        acc[d.city].students++; acc[d.city]._t += d.salary;
        acc[d.city].avgSalary = Math.round(acc[d.city]._t / acc[d.city].students); return acc;
      }, {})).map(({ _t, ...r }) => r)],
    ["$sort", "{ $sort: { avgSalary: -1 } }", "Documents from $group re-ordered by avgSalary descending."],
    ["$limit", "{ $limit: 3 }", "Only the top 3 cities survive to the final result."]
  ];
  return `<h1>Aggregation Pipeline Visualizer</h1>
  <p class="muted">Click a stage to see what the documents look like after it runs.</p>
  <div class="grid g2">
    <div class="card"><div class="pipe">
      <div class="stage">Collection · students</div><div class="arrow">↓</div>
      ${stages.map((s, i) => `<div class="stage${i === 0 ? " active" : ""}" data-stage="${i}">${s[0]}</div><div class="arrow">↓</div>`).join("")}
      <div class="stage">Final Result</div>
    </div></div>
    <div class="card" id="stageOut"></div>
  </div>
  <div class="card"><h3>Full pipeline</h3>
    ${codeBlock("db.students.aggregate([\n  " + stages.map(s => s[1]).join(",\n  ") + "\n])", "MongoDB Shell")}
    <div class="callout">In Compass, pipelines belong in the <b>Aggregations</b> tab — never in the Filter field.</div></div>`;
}
function initializeAgg(root) {
  const out = $("#stageOut", root); if (!out) return;
  const stages = $$(".stage[data-stage]", root);
  const data = [
    ["$match", "Filters documents. Only CSE students continue.", DATA.filter(d => d.department === "CSE").slice(0, 3).map(d => ({ name: d.name, department: d.department, city: d.city, salary: d.salary }))],
    ["$group", "Groups the remaining documents by city and computes averages.", [{ _id: "Bangalore", avgSalary: 71000, students: 2 }, { _id: "Hyderabad", avgSalary: 64500, students: 2 }]],
    ["$sort", "Re-orders the grouped documents.", [{ _id: "Bangalore", avgSalary: 71000, students: 2 }, { _id: "Hyderabad", avgSalary: 64500, students: 2 }]],
    ["$limit", "Keeps only the first 3 documents.", [{ _id: "Bangalore", avgSalary: 71000, students: 2 }]]
  ];
  const show = i => {
    stages.forEach((s, j) => s.classList.toggle("active", i === j));
    const [name, desc, docs] = data[i];
    out.innerHTML = `<span class="badge green">Stage ${i + 1}</span><h2>${name}</h2><p class="muted">${desc}</p>
      <h4>INPUT</h4><p class="muted">${i === 0 ? "All 20 student documents" : "Output of " + data[i - 1][0]}</p>
      <h4>OUTPUT</h4>${codeBlock(pretty(docs), "After " + name)}`;
  };
  stages.forEach((s, i) => s.addEventListener("click", () => show(i)));
  show(0);
}

function indexView() {
  return `<h1>Index Visualizer</h1><p class="muted">See the difference between a collection scan and an index scan.</p>
  <div class="grid g2">
    <div class="card"><span class="badge danger">Without index — COLLSCAN</span>
      <p class="muted">Query → scan every document → return matches.</p>
      <div class="scanviz" id="scanA"></div>
      <p class="muted" id="scanAInfo">100 documents examined</p></div>
    <div class="card"><span class="badge green">With index — IXSCAN</span>
      <p class="muted">Query → B-tree lookup → jump straight to matching documents.</p>
      <div class="scanviz" id="scanB"></div>
      <p class="muted" id="scanBInfo">4 documents examined</p></div>
  </div>
  <button class="btn primary" id="runScan">▶ Run comparison</button>
  <div class="card" style="margin-top:18px"><h3>Prove it with explain()</h3>
    ${codeBlock("db.students.find({ age: { $gt: 30 } }).explain(\"executionStats\")\n\n// Look at:\n//   stage: \"COLLSCAN\" vs \"IXSCAN\"\n//   totalDocsExamined  vs  nReturned\n\ndb.students.createIndex({ age: 1 })", "MongoDB Shell")}
    <div class="callout">Rule of thumb: if <code>totalDocsExamined</code> is far greater than <code>nReturned</code>, you need an index.</div></div>`;
}
function initializeIndexViz(root) {
  const a = $("#scanA", root), b = $("#scanB", root); if (!a) return;
  const build = el => { el.innerHTML = Array.from({ length: 100 }, () => '<span class="doc"></span>').join(""); };
  build(a); build(b);
  const run = () => {
    build(a); build(b);
    const docsA = $$(".doc", a), docsB = $$(".doc", b);
    const hits = [12, 37, 61, 88];
    docsA.forEach((d, i) => setTimeout(() => { d.classList.add(hits.includes(i) ? "hit" : "scan"); }, i * 12));
    hits.forEach((h, i) => setTimeout(() => docsB[h].classList.add("hit"), 120 + i * 90));
  };
  $("#runScan", root).addEventListener("click", run); run();
}

function schemaView() {
  return `<h1>Schema Design Visualizer</h1>
  <div class="grid g2">
    <div class="card"><span class="badge green">EMBEDDING</span>
      ${codeBlock("{\n  name: \"Akash\",\n  exams: [\n    { subject: \"Math\", marks: 95 },\n    { subject: \"DBMS\", marks: 88 }\n  ]\n}", "students")}
      <h4>Use when</h4><ul class="muted"><li>Data is always read together</li><li>The child list is small and bounded</li>
      <li>You need atomic single-document updates</li><li>Read performance matters most</li></ul></div>
    <div class="card"><span class="badge info">REFERENCING</span>
      ${codeBlock("// students\n{ _id: 1, name: \"Akash\", course_id: 10 }\n\n// courses\n{ _id: 10, title: \"DBMS\" }\n\ndb.students.aggregate([\n  { $lookup: { from: \"courses\", localField: \"course_id\",\n               foreignField: \"_id\", as: \"course\" } }\n])", "students + courses")}
      <h4>Use when</h4><ul class="muted"><li>The child data is large or unbounded</li><li>Data is shared between parents</li>
      <li>Children are updated independently</li><li>You would otherwise duplicate a lot</li></ul></div>
  </div>
  <div class="card"><h3>Relationship patterns</h3>
    <div class="tablewrap"><table><thead><tr><th>Relationship</th><th>Recommendation</th><th>Example</th></tr></thead><tbody>
      <tr><td>One-to-One</td><td>Embed</td><td><code>user.profile</code></td></tr>
      <tr><td>One-to-Few</td><td>Embed</td><td><code>student.exams</code></td></tr>
      <tr><td>One-to-Many</td><td>Reference from the child</td><td><code>comment.post_id</code></td></tr>
      <tr><td>One-to-Millions</td><td>Reference + bucket pattern</td><td>sensor readings</td></tr>
      <tr><td>Many-to-Many</td><td>Array of references</td><td><code>student.course_ids</code></td></tr>
    </tbody></table></div></div>`;
}

function compassView() {
  return `<h1>MongoDB Compass Guide</h1>
  <p class="muted">Compass splits a query into separate fields. Each field takes only its own fragment — never a pipeline stage.</p>
  <div class="compass">
    <div class="compass-bar">🧭 MongoDB Compass · college › students · Documents tab</div>
    <div class="compass-fields">
      <div class="cfield"><b>Filter</b><code>{ "age": { "$gt": 30 } }</code></div>
      <div class="cfield"><b>Project</b><code>{ "name": 1, "age": 1, "_id": 0 }</code></div>
      <div class="cfield"><b>Sort</b><code>{ "age": -1 }</code></div>
      <div class="cfield"><b>Skip</b><code>10</code></div>
      <div class="cfield"><b>Limit</b><code>5</code></div>
    </div>
  </div>
  <div class="card" style="margin-top:18px"><h3>Shell equivalent</h3>
    ${codeBlock("db.students.find(\n  { age: { $gt: 30 } },\n  { name: 1, age: 1, _id: 0 }\n).sort({ age: -1 }).skip(10).limit(5)", "MongoDB Shell")}</div>
  <div class="card"><h3>The most common Compass error</h3>
    <div class="callout bad"><b>❌ Project field</b><br><code>{ "$project": { "name": 1 } }</code></div>
    <div class="callout good"><b>✅ Project field</b><br><code>{ "name": 1 }</code></div>
    <p class="muted">The Filter/Project/Sort fields are already the arguments of find(). Wrapping them in <code>$match</code>,
    <code>$project</code> or <code>$sort</code> makes Compass look for a literal field named <code>$project</code>.
    Full pipelines belong in the <b>Aggregations</b> tab.</p></div>
  <div class="card"><h3>Field cheat sheet</h3><div class="tablewrap"><table>
    <thead><tr><th>Compass field</th><th>Purpose</th><th>Paste this</th></tr></thead><tbody>
    <tr><td>Filter</td><td>Query condition</td><td><code>{ "city": "Pune" }</code></td></tr>
    <tr><td>Project</td><td>Fields to return</td><td><code>{ "name": 1, "_id": 0 }</code></td></tr>
    <tr><td>Sort</td><td>Ordering</td><td><code>{ "salary": -1 }</code></td></tr>
    <tr><td>Skip</td><td>Documents to skip</td><td><code>20</code></td></tr>
    <tr><td>Limit</td><td>Maximum documents</td><td><code>10</code></td></tr>
    <tr><td>Aggregations tab</td><td>Full pipeline</td><td><code>[{ "$match": {...} }, { "$group": {...} }]</code></td></tr>
  </tbody></table></div></div>`;
}

function cheatView() {
  return `<h1>MongoDB Cheat Sheet</h1>
  <div class="field"><label>Filter</label><input type="text" id="cheatSearch" placeholder="Search operators…"></div>
  <div class="tablewrap"><table id="cheatTable"><thead><tr><th>Operator</th><th>Purpose</th><th>Example</th></tr></thead>
  <tbody>${CHEAT.map(([o, p, e]) => `<tr><td><code>${esc(o)}</code></td><td>${esc(p)}</td><td><code>${esc(e)}</code></td></tr>`).join("")}</tbody>
  </table></div>`;
}
function initializeCheat(root) {
  const s = $("#cheatSearch", root); if (!s) return;
  s.addEventListener("input", () => {
    const q = s.value.toLowerCase();
    $$("#cheatTable tbody tr", root).forEach(tr => { tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none"; });
  });
}

function interviewView() {
  return `<h1>MongoDB Interview Questions</h1>
  <p class="muted">Expandable answers grouped by difficulty. ⭐ marks high-priority questions.</p>
  ${INTERVIEW.map(([lvl, qs]) => `<h2>${lvl}</h2>
    ${qs.map(([q, a, imp]) => `<div class="acc"><button class="acc-head" aria-expanded="false">
      <span>${imp ? "⭐ " : ""}Q: ${esc(q)}</span><span class="chev">▾</span></button>
      <div class="acc-body">${imp ? '<span class="badge warn">Important interview question</span><br><br>' : ""}${esc(a)}</div></div>`).join("")}`).join("")}`;
}

function mistakesView() {
  return `<h1>Common Mistakes</h1><p class="muted">The errors that break most beginner MongoDB queries.</p>
  ${MISTAKES.map(m => `<div class="card"><h3>${esc(m[0])}</h3>
    <div class="callout bad"><b>❌ Wrong</b><br><code>${esc(m[1])}</code></div>
    <div class="callout good"><b>✅ Correct</b><br><code>${esc(m[2])}</code></div>
    <p class="muted">${esc(m[3])}</p></div>`).join("")}`;
}

function projectView() {
  return `<h1>Project · Student Management System</h1>
  <p class="muted">A complete four-collection MongoDB application combining every concept in this platform.</p>
  <div class="card"><h3>Architecture</h3>
    <div class="pipe">${["Database: college", "Collections: students · courses · exams · projects", "Documents + Relationships",
      "Queries & Aggregation", "Indexes", "Validation"].map((n, i, a) => `<div class="stage">${n}</div>${i < a.length - 1 ? '<div class="arrow">↓</div>' : ""}`).join("")}</div></div>
  <div class="card tabwrap"><h3>Implementation</h3>
    <div class="tabs">
      <button class="tab active" data-tab="s1">Collections</button>
      <button class="tab" data-tab="s2">Queries</button>
      <button class="tab" data-tab="s3">Aggregation</button>
      <button class="tab" data-tab="s4">Indexes & Validation</button>
    </div>
    <div class="tabpanel" data-panel="s1">${codeBlock(
`db.courses.insertMany([
  { _id: 1, title: "DBMS", credits: 4 },
  { _id: 2, title: "Operating Systems", credits: 3 }
])

db.students.insertOne({
  name: "Akash", age: 21, department: "CSE",
  course_ids: [1, 2],
  address: { city: "Bangalore", pincode: 560001 }
})

db.exams.insertOne({ student_name: "Akash", course_id: 1, marks: 95 })
db.projects.insertOne({ student_name: "Akash", title: "Student Management System", tech: "MongoDB" })`, "MongoDB Shell")}</div>
    <div class="tabpanel" data-panel="s2" hidden>${codeBlock(
`db.students.find({ department: "CSE" }, { name: 1, _id: 0 })
db.students.find({ "address.city": "Bangalore" }).sort({ name: 1 })
db.exams.find({ marks: { $gte: 90 } })
db.students.updateOne({ name: "Akash" }, { $addToSet: { course_ids: 3 } })
db.exams.deleteMany({ marks: { $lt: 35 } })`, "MongoDB Shell")}</div>
    <div class="tabpanel" data-panel="s3" hidden>${codeBlock(
`// Average marks per course
db.exams.aggregate([
  { $group: { _id: "$course_id", avgMarks: { $avg: "$marks" }, attempts: { $sum: 1 } } },
  { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
  { $unwind: "$course" },
  { $project: { _id: 0, course: "$course.title", avgMarks: 1, attempts: 1 } },
  { $sort: { avgMarks: -1 } }
])`, "MongoDB Shell")}</div>
    <div class="tabpanel" data-panel="s4" hidden>${codeBlock(
`db.students.createIndex({ name: 1 })
db.students.createIndex({ department: 1, age: -1 })
db.exams.createIndex({ course_id: 1, marks: -1 })

db.runCommand({
  collMod: "students",
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "department"],
    properties: {
      name: { bsonType: "string" },
      age:  { bsonType: "int", minimum: 16 },
      department: { enum: ["CSE", "IT", "ECE", "ME"] }
    }
  }},
  validationAction: "error"
})`, "MongoDB Shell")}</div>
  </div>`;
}

function roadmapView() {
  return `<h1>MongoDB Roadmap</h1><p class="muted">Click any node to jump to the related topics.</p>
  <div class="roadmap">
    ${ROADMAP.map((r, i) => {
      const t = TOPICS.find(x => x.title.toLowerCase().includes(r.toLowerCase().split(" ")[0])) || TOPICS[0];
      return `<div class="rnode" data-route="#/topic/${t.id}"><span class="badge green">${String(i + 1).padStart(2, "0")}</span><br>${esc(r)}</div>`;
    }).join("")}
  </div>`;
}

function plan30View() {
  const done = store.get("days", []);
  return `<h1>30-Day Learning Plan</h1><p class="muted">Tick a day when you finish its topic, tasks and practice questions.</p>
  <div class="grid g3">
    ${PLAN30.map((d, i) => `<div class="day${done.includes(i) ? " done" : ""}" data-day="${i}">
      <b>DAY ${i + 1}</b><div>${esc(d)}</div>
      <p class="muted" style="font-size:.8rem;margin:.5em 0 0">Tasks: read the topic, run the example in the Playground, answer 10 practice questions.</p>
      <label class="row" style="margin-top:8px;font-size:.85rem"><input type="checkbox" class="dayChk" ${done.includes(i) ? "checked" : ""}> Completed</label>
    </div>`).join("")}
  </div>`;
}
function initializePlan(root) {
  $$(".day", root).forEach(card => {
    const chk = $(".dayChk", card);
    chk?.addEventListener("change", () => {
      const d = store.get("days", []); const i = +card.dataset.day;
      chk.checked ? d.push(i) : d.splice(d.indexOf(i), 1);
      store.set("days", [...new Set(d)]); card.classList.toggle("done", chk.checked);
    });
  });
}

function bookmarksView() {
  const list = marks.all().map(id => TOPICS.find(t => t.id === id)).filter(Boolean);
  return `<h1>🔖 Bookmarks</h1>
  ${list.length ? `<div class="grid g2">${list.map(t => `<div class="card" style="margin:0">
      <span class="badge green">${esc(t.cat)}</span><h3 style="margin-top:8px">${esc(t.title)}</h3>
      <p class="muted">${esc(t.def.slice(0, 120))}…</p>
      <button class="btn sm" data-route="#/topic/${t.id}">Open →</button></div>`).join("")}</div>`
    : `<div class="card"><p class="muted">No bookmarks yet. Open any topic and press ☆ Bookmark.</p>
       <button class="btn sm primary" data-route="#/topic/t1">Browse topics →</button></div>`}`;
}

/* ========================= ROUTER ========================= */
function render() {
  const main = $("#main");
  const hash = location.hash || "#/home";
  const [, route, param] = hash.split("/");
  let html;
  switch (route) {
    case "topic": html = topicView(param); break;
    case "playground": html = playgroundView(); break;
    case "operators": html = operatorsView(); break;
    case "aggregation-visualizer": html = aggView(); break;
    case "index-visualizer": html = indexView(); break;
    case "schema-visualizer": html = schemaView(); break;
    case "compass": html = compassView(); break;
    case "practice": html = quizView(0); break;
    case "interview": html = interviewView(); break;
    case "cheatsheet": html = cheatView(); break;
    case "mistakes": html = mistakesView(); break;
    case "project": html = projectView(); break;
    case "roadmap": html = roadmapView(); break;
    case "plan30": html = plan30View(); break;
    case "bookmarks": html = bookmarksView(); break;
    default: html = homeView();
  }
  main.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  markActive(); revealObserver(); progress.render();

  // per-view initialisers
  if (route === "playground") {
    const preset = store.get("pgPreset", null);
    if (preset) { $("#pgQuery").value = preset.startsWith("{") ? preset : "{}"; store.set("pgPreset", null); }
    initializePlayground(main);
  }
  if (route === "operators") initializeOperators(main);
  if (route === "aggregation-visualizer") initializeAgg(main);
  if (route === "index-visualizer") initializeIndexViz(main);
  if (route === "cheatsheet") initializeCheat(main);
  if (route === "practice") initializeQuiz(main);
  if (route === "plan30") initializePlan(main);
  if (route === "topic") {
    const id = param;
    $("#doneBtn")?.addEventListener("click", e => {
      const now = progress.toggle(id);
      e.target.textContent = now ? "✓ Completed" : "○ Mark as Complete";
      e.target.classList.toggle("primary", now);
      toast(now ? "Marked as complete" : "Marked as incomplete");
    });
    $("#bmBtn")?.addEventListener("click", e => {
      const now = marks.toggle(id);
      e.target.textContent = now ? "★ Bookmarked" : "☆ Bookmark";
      toast(now ? "Bookmarked" : "Bookmark removed");
    });
    $("#saveNote")?.addEventListener("click", () => { notes.set(id, $("#noteBox").value); toast("Notes saved"); });
  }
  $("#resetBtn2")?.addEventListener("click", () => $("#resetBtn").click());
}

/* ========================== INIT ========================== */
function initializeApp() {
  initializeTheme();
  buildSidebar();
  initializeNavigation();
  initializeSearch();
  render();
  progress.render();
}
initializeApp();
