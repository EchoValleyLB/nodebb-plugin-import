(function(module) {

  var nbbpath = require('../helpers/nbbpath.js');
  var db = require('../helpers/database');

  var async = require('async');

  // nbb-core
  var utils = nbbpath.require('../public/js/utils');
  var utils = nbbpath.require('./batch');

  var DEFAULT_BATCH_SIZE = 100;

  var Data = {};

  Data.count = function(setKey, callback) {
    db.sortedSetCard(setKey, callback);
  };

  Data.each = function(setKey, prefixEachId, iterator, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return Data.processSet(
      setKey,
      prefixEachId,
      function(err, records, nextBatch) {
        if (err) {
          return nextBatch(err);
        }
        if (options.async) {
          if (options.eachLimit) {
            async.eachLimit(records, options.eachLimit, iterator, nextBatch);
          } else {
            async.each(records, iterator, nextBatch);
          }
        } else {
          records.forEach(iterator);
          nextBatch();
        }
      },
      options,
      callback
    );
  };

  Data.processSet = function(setKey, prefixEachId, process, options, callback) {
    return batch.processSortedSet(
      setKey,
      function(err, ids, next) {
        var keys = ids.map(function(id) {
          return prefixEachId + id;
        });
        db.getObjects(keys, function(err, objects) {
          process(err, objects, function(err) {
            if (err) {
              return next(err);
            }
            next();
          });
        });
      },
      options,
      callback);
  };

  Data.isImported = function(setKey, _id, callback) {
    return db.isSortedSetMember(setKey, _id, function(err, result) {
      callback(err, result);
    });
  };

  Data.getImported = function(setKey, objPrefix, _id, callback) {
    Data.isImported(setKey, _id, function(err, result) {
      if (err || !result) {
        return callback(null, undefined);
      }
      db.getObject(objPrefix + _id, function(err, obj) {
        if (err || !obj) {
          return callback(null, null);
        }
        callback(null, obj);
      });
    });

  };

  Data.setImported = function(setKey, objPrefix, _id, score, data, callback) {
    delete data._typeCast;
    delete data.parse;
    delete data._key; // for mongo

    if (typeof score != "number" || isNaN(score)) {
      score = +new Date(); // for redis, zadd score must be a number
    }

    return db.setObject(objPrefix + _id, data, function(err) {
      if (err) {
        return callback(err);
      }
      db.sortedSetAdd(setKey, score, _id, callback);
    });
  };

  Data.deleteImported = function(setKey, objPrefix, _id, callback) {
    return db.sortedSetRemove(setKey, _id, function() {
      db.delete(objPrefix + _id, function () {
        // ignore errors
        callback();
      });
    });
  };

  Data.deleteEachImported = function(setKey, objPrefix, onProgress, callback) {
    Data.count(setKey, function(err, total) {
      var count = 1;
      batch.processSortedSet(setKey,
        function(err, ids, nextBatch) {
          async.mapLimit(ids, DEFAULT_BATCH_SIZE, function(_id, cb) {
            Data.deleteImported(setKey, objPrefix, _id, function(err, response) {
              onProgress(null, {total: total, count: count++, percentage: (count/total)});
              cb();
            });
          }, nextBatch);
        },
        {
          alwaysStartAt: 0
        },
        callback);
    });
  };

  module.exports = Data;

})(module);
