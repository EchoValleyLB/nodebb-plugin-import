
var nconf = require('nconf');
var primaryDBName = nconf.get('database');
var extend = require('extend');


var db;
if (primaryDBName) {
	db = module.parent.require('../../../src/database.js');
} else {
	db = require('./db');
}

var async = require('async'),
	utils = require('../public/js/utils.js'),
	Meta = require('../../../src/meta.js'),
	User = require('../../../src/user.js'),
	Groups = require('../../../src/groups.js'),
	Topics = require('../../../src/topics.js'),
	Posts = require('../../../src/posts.js'),
	Categories = require('../../../src/categories.js'),

	DEFAULT_BATCH_SIZE = 100;


(function(Data) {

	/* _imported Operations */

	Data.db = db;

	Data.setUserImported = function(_uid, uid, user, callback) {
		return Data.setImported('_imported:_users', '_imported_user:', _uid, uid, user, callback);
	};

	Data.setGroupImported = function(_gid, gidOrGname, group, callback) {
		return Data.setImported('_imported:_groups', '_imported_group:', _gid, gidOrGname, group, callback);
	};

	Data.setRoomImported = function(_roomId, roomId, room, callback) {
		return Data.setImported('_imported:_rooms', '_imported_room:', _roomId, roomId, room, callback);
	};

	Data.setMessageImported = function(_mid, mid, message, callback) {
		return Data.setImported('_imported:_messages', '_imported_message:', _mid, mid, message, callback);
	};

	Data.setCategoryImported = function(_cid, cid, category, callback) {
		return Data.setImported('_imported:_categories', '_imported_category:', _cid, cid, category, callback);
	};

	Data.setTopicImported = function(_tid, tid, topic, callback) {
		return Data.setImported('_imported:_topics', '_imported_topic:', _tid, tid, topic, callback);
	};

	Data.setPostImported = function(_pid, pid, post, callback) {
		return Data.setImported('_imported:_posts', '_imported_post:', _pid, pid, post, callback);
	};

	Data.setVoteImported = function(_vid, vid, vote, callback){
		return Data.setImported('_imported:_votes', '_imported_vote:', _vid, vid, vote, callback);
	};

	Data.setBookmarkImported = function(_bid, bid, bookmark, callback){
		return Data.setImported('_imported:_bookmarks', '_imported_bookmark:', _bid, bid, bookmark, callback);
	};

	Data.setFavouriteImported = function(_fid, fid, favourite, callback){
		return Data.setImported('_imported:_favourites', '_imported_favourite:', _fid, fid, favourite, callback);
	};

	Data.isGroupImported = function(_gid, callback) {
		return Data.isImported('_imported:_groups', _gid, callback);
	};

	Data.isUserImported = function(_uid, callback) {
		return Data.isImported('_imported:_users', _uid, callback);
	};

	Data.isRoomImported = function(_roomId, callback) {
		return Data.isImported('_imported:_rooms', _roomId, callback);
	};

	Data.isMessageImported = function(_mid, callback) {
		return Data.isImported('_imported:_messages', _mid, callback);
	};

	Data.isCategoryImported = function(_cid, callback) {
		return Data.isImported('_imported:_categories', _cid, callback);
	};

	Data.isTopicImported = function(_tid, callback) {
		return Data.isImported('_imported:_topics', _tid, callback);
	};

	Data.isPostImported = function(_pid, callback) {
		return Data.isImported('_imported:_posts', _pid, callback);
	};

	Data.isVoteImported = function(_vid, callback) {
		return Data.isImported('_imported:_votes', _vid, callback);
	};

	Data.isBookmarkImported = function(_bid, callback) {
		return Data.isImported('_imported:_bookmarks', _bid, callback);
	};

	Data.isFavouriteImported = function(_fid, callback) {
		return Data.isImported('_imported:_favourites', _fid, callback);
	};

	Data.getImportedGroup = function(_gid, callback) {
		return Data.getImported('_imported:_groups', '_imported_group:', _gid, callback);
	};

	Data.getImportedUser = function(_uid, callback) {
		return Data.getImported('_imported:_users', '_imported_user:', _uid, callback);
	};

	Data.getImportedRoom = function(_roomId, callback) {
		return Data.getImported('_imported:_rooms', '_imported_room:', _roomId, callback);
	};

	Data.getImportedMessage = function(_mid, callback) {
		return Data.getImported('_imported:_messages', '_imported_message:', _mid, callback);
	};

	Data.getImportedCategory = function(_cid, callback) {
		return Data.getImported('_imported:_categories', '_imported_category:', _cid, callback);
	};

	Data.getImportedTopic = function(_tid, callback) {
		return Data.getImported('_imported:_topics', '_imported_topic:', _tid, callback);
	};

	Data.getImportedPost = function(_pid, callback) {
		return Data.getImported('_imported:_posts', '_imported_post:', _pid, callback);
	};

	Data.getImportedVote = function(_vid, callback) {
		return Data.getImported('_imported:_votes', '_imported_vote:', _vid, callback);
	};

	Data.getImportedBookmark = function(_bid, callback) {
		return Data.getImported('_imported:_bookmarks', '_imported_bookmark:', _bid, callback);
	};

	Data.getImportedFavourite = function(_fid, callback) {
		return Data.getImported('_imported:_favourites', '_imported_favourite:', _fid, callback);
	};

	Data.deleteImportedUser = function(_uid, callback) {
		return Data.deleteImported('_imported:_users', '_imported_user:', _uid, callback);
	};

	Data.deleteImportedGroup = function(_gid, callback) {
		return Data.deleteImported('_imported:_groups', '_imported_group:', _gid, callback);
	};

	Data.deleteImportedRoom = function(_roomId, callback) {
		return Data.deleteImported('_imported:_rooms', '_imported_room:', _roomId, callback);
	};

	Data.deleteImportedMessage = function(_mid, callback) {
		return Data.deleteImported('_imported:_messages', '_imported_message:', _mid, callback);
	};

	Data.deleteImportedCategory = function(_cid, callback) {
		return Data.deleteImported('_imported:_categories', '_imported_category:', _cid, callback);
	};

	Data.deleteImportedTopic = function(_tid, callback) {
		return Data.deleteImported('_imported:_topics', '_imported_topic:', _tid, callback);
	};

	Data.deleteImportedPost = function(_pid, callback) {
		return Data.deleteImported('_imported:_posts', '_imported_post:', _pid, callback);
	};

	Data.deleteImportedVote = function(_vid, callback) {
		return Data.deleteImported('_imported:_votes', '_imported_vote:', _vid, callback);
	};

	Data.deleteImportedBookmark = function(_bid, callback) {
		return Data.deleteImported('_imported:_bookmarks', '_imported_bookmark:', _bid, callback);
	};

	Data.deleteImportedFavourite = function(_fid, callback) {
		return Data.deleteImported('_imported:_favourites', '_imported_favourite:', _fid, callback);
	};

	Data.deleteImportedUsers = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_users', '_imported_user:', onProgress, callback);
	};

	Data.deleteImportedGroups = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_groups', '_imported_group:', onProgress, callback);
	};

	Data.deleteImportedRooms = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_rooms', '_imported_room:', onProgress, callback);
	};

	Data.deleteImportedMessages = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_messages', '_imported_message:', onProgress, callback);
	};

	Data.deleteImportedCategories = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_categories', '_imported_category:', onProgress, callback);
	};

	Data.deleteImportedTopics = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_topics', '_imported_topic:', onProgress, callback);
	};

	Data.deleteImportedPosts = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_posts', '_imported_post:', onProgress, callback);
	};

	Data.deleteImportedVotes = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_votes', '_imported_vote:', onProgress, callback);
	};

	Data.deleteImportedBookmarks = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_bookmarks', '_imported_bookmark:', onProgress, callback);
	};

	Data.deleteImportedFavourites = function(onProgress, callback) {
		return Data.deleteEachImported('_imported:_favourites', '_imported_favourite:', onProgress, callback);
	};

	Data.countImportedGroups = function(callback) {
		Data.count('_imported:_groups', callback);
	};

	Data.countImportedUsers = function(callback) {
		Data.count('_imported:_users', callback);
	};

	Data.countImportedRooms = function(callback) {
		Data.count('_imported:_rooms', callback);
	};

	Data.countImportedMessages = function(callback) {
		Data.count('_imported:_messages', callback);
	};

	Data.countImportedCategories = function(callback) {
		Data.count('_imported:_categories', callback);
	};

	Data.countImportedTopics = function(callback) {
		Data.count('_imported:_topics', callback);
	};

	Data.countImportedPosts = function(callback) {
		Data.count('_imported:_posts', callback);
	};

	Data.countImportedVotes = function(callback) {
		Data.count('_imported:_votes', callback);
	};

	Data.countImportedBookmarks = function(callback) {
		Data.count('_imported:_bookmarks', callback);
	};

	Data.countImportedFavourites = function(callback) {
		Data.count('_imported:_favourites', callback);
	};

	/* NodeBB Core records operations */

	Data.countUsers = function(callback) {
		Data.count('users:joindate', callback);
	};

	Data.countGroups = function(callback) {
		Data.count('groups:createtime', callback);
	};

	Data.countRooms = function(callback) {
		Data.keys('chat:room:*', function(err, keys) {
			if (err) {
				callback(err);
			}
			callback(err, keys.length)
		});
	};

	Data.countMessages = function(callback) {
		Data.keys('message:*', function(err, keys) {
			if (err) {
				callback(err);
			}
			callback(err, keys.length)
		});
	};

	Data.countCategories = function(callback) {
		Data.count('categories:cid', callback);
	};

	Data.countTopics = function(callback) {
		Data.count('topics:tid', callback);
	};

	Data.countPosts = function(callback) {
		Data.count('posts:pid', callback);
	};

	Data.eachUser = function(iterator, options, callback) {
		return Data.each('users:joindate', 'user:', iterator, options, callback);
	};

	Data.eachGroup = function(iterator, options, callback) {
		return Data.each('groups:createtime', 'group:', iterator, options, callback);
	};

	Data.eachRoom = function(iterator, options, callback) {
		options = options || {};
		var prefix = 'chat:room:';
		Data.keys(prefix + '*', function(err, keys) {
			if (err) {
				return callback(err);
			}
			async.mapLimit(keys, options.batch || DEFAULT_BATCH_SIZE, function(key, next) {
				db.getObject(key, function(err, room) {
					if (room) {
						room.roomId = key.replace(prefix, '');
					}
					iterator(room, next);
				});
			}, callback);
		});
	};

	Data.eachMessage = function(iterator, options, callback) {
		options = options || {};
		var prefix = 'message:';
		Data.keys(prefix + '*', function(err, keys) {
			if (err) {
				return callback(err);
			}
			async.mapLimit(keys, options.batch || DEFAULT_BATCH_SIZE, function(key, next) {
				db.getObject(key, function(err, message) {
					if (message) {
						message.mid = key.replace(prefix, '');
					}
					iterator(message, next);
				});
			}, callback);
		});
	};

	Data.eachCategory = function(iterator, options, callback) {
		return Data.each('categories:cid', 'category:', iterator, options, callback);
	};

	Data.eachTopic = function(iterator, options, callback) {
		return Data.each('topics:tid', 'topic:', iterator, options, callback);
	};

	Data.eachPost = function(iterator, options, callback) {
		return Data.each('posts:pid', 'post:', iterator, options, callback);
	};

  Data.eachImportedUser = function(iterator, options, callback) {
		return Data.each('_imported:_users', '_imported_user:', iterator, options, callback);
	};

	Data.eachImportedGroup = function(iterator, options, callback) {
		return Data.each('_imported:_groups', '_imported_group:', iterator, options, callback);
	};

	Data.eachImportedRoom = function(iterator, options, callback) {
		return Data.each('_imported:_rooms', '_imported_room:', iterator, options, callback);
	};

	Data.eachImportedMessage = function(iterator, options, callback) {
		return Data.each('_imported:_messages', '_imported_message:', iterator, options, callback);
	};

	Data.eachImportedCategory = function(iterator, options, callback) {
		return Data.each('_imported:_categories', '_imported_category:', iterator, options, callback);
	};

	Data.eachImportedTopic = function(iterator, options, callback) {
		return Data.each('_imported:_topics', '_imported_topic:', iterator, options, callback);
	};

	Data.eachImportedPost = function(iterator, options, callback) {
		return Data.each('_imported:_posts', '_imported_post:', iterator, options, callback);
	};

	Data.eachImportedVote = function(iterator, options, callback) {
		return Data.each('_imported:_votes', '_imported_vote:', iterator, options, callback);
	};

	Data.eachImportedBookmark = function(iterator, options, callback) {
		return Data.each('_imported:_bookmarks', '_imported_bookmark:', iterator, options, callback);
	};

	Data.eachImportedFavourite = function(iterator, options, callback) {
		return Data.each('_imported:_favourites', '_imported_favourite:', iterator, options, callback);
	};

	Data.processUsersSet = function(process, options, callback) {
		return Data.processSet('users:joindate', 'user:', process, options, callback);
	};

	Data.processGroupsSet = function(process, options, callback) {
		return Data.processSet('groups:createtime', 'group:', process, options, callback);
	};

	Data.processCategoriesSet = function(process, options, callback) {
		return Data.processSet('categories:cid', 'category:', process, options, callback);
	};

	Data.processTopicsSet = function(process, options, callback) {
		return Data.processSet('topics:tid', 'topic:', process, options, callback);
	};

	Data.processPostsSet = function(process, options, callback) {
		return Data.processSet('posts:pid', 'post:', process, options, callback);
	};

	Data.processUsersUidsSet = function(process, options, callback) {
		return Data.processIdsSet('users:joindate', process, options, callback);
	};

	Data.processGroupsNamesSet = function(process, options, callback) {
		return Data.processIdsSet('groups:createtime', process, options, callback);
	};

	Data.processCategoriesCidsSet = function(process, options, callback) {
		return Data.processIdsSet('categories:cid', process, options, callback);
	};

	Data.processTopicsTidsSet = function(process, options, callback) {
		return Data.processIdsSet('topics:tid', process, options, callback);
	};

	Data.processPostsPidsSet = function(process, options, callback) {
		return Data.processIdsSet('posts:pid', process, options, callback);
	};

	/*  General Functions */

	Data.init = function(callback) {
		if (primaryDBName) {
			callback();
		} else {
			db.init(callback);
		}
	};

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
		return Data.processIdsSet(
			setKey,
			function(err, ids, next) {
				var keys = ids.map(function(id) {
					return prefixEachId + id;
				});

        if (options.where) {
          options.where.keys = keys;
          Data.getObjectsWhere(options.where, function(err, objects) {
            process(err, objects, function(err) {
              if (err) {
                return next(err);
              }
              next();
            });
          });
        } else {
          db.getObjects(keys, function(err, objects) {
            process(err, objects, function(err) {
              if (err) {
                return next(err);
              }
              next();
            });
          });
        }
			},
			options,
			callback);
	};

	Data.processIdsSet = function(setKey, process, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		}

		callback = typeof callback === 'function' ? callback : function(){};
		options = options || {};

		if (typeof process !== 'function') {
			throw new Error(process + ' is not a function');
		}

		// custom done condition
		options.doneIf = typeof options.doneIf === 'function' ? options.doneIf : function(){};

		var batch = options.batch || DEFAULT_BATCH_SIZE;

		if (db.helpers.mongo && !utils.isNumber(options.alwaysStartAt)) {
			var cursor = db.client
        .collection('objects')
				.find({'_key': setKey})
				.sort({'score': 1})
				.project({'_id': 0, 'value': 1})
				.batchSize(batch);

			var ids = [];
			cursor.forEach(function(doc) {
				ids.push(doc.value);
				if (ids.length >= batch) {
					process(null, ids, function(err) {
						// do nothing
					});
					ids = [];
				}
			}, function(err) {
				if (err) {
					return callback(err);
				}
				if (ids.length) {
					return process(null, ids, callback);
				}
				callback(null);
			});

			return;
		}

		// always start at, useful when deleting all records
		// options.alwaysStartAt
		var start = 0;
		var end = batch;
		var done = false;

		async.whilst(
			function(err) {
				if (err) {
					return true;
				}
				return !done;
			},
			function(next) {
				db.getSortedSetRange(setKey, start, end, function(err, ids) {
					if (err) {
						return next(err);
					}
					if (!ids.length || options.doneIf(start, end, ids)) {
						done = true;
						return next();
					}
					process(err, ids, function(err) {
						if (err) {
							return next(err);
						}
						start += utils.isNumber(options.alwaysStartAt) ? options.alwaysStartAt : batch + 1;
						end = start + batch;
						next();
					});
				})
			},
			callback
		);
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

    // for redis
    utils.deleteNullUndefined(data);

    delete data._pictureBlob;
    delete data._attachmentsBlobs;

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
			Data.processIdsSet(setKey,
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

  Data.getObjectsWhere = (function() {
    return db.helpers.mongo ?
      function (params, callback) {
        var query = {};

        var keys = params.keys;
        if (keys && keys.length) {
          query._key = {$in: keys};
        }

        if (params.fields) {
          Object.keys(params.fields).forEach(function(field) {
            var where = params.fields[field];
            query[field] = {};
            if (where && typeof where === "object") {
              Object.keys(where).forEach(function(condition) {
                query[field]['$' + condition] = where[condition];
              });
            } else {
              query[field] = where;
            }
          });
        }
        db.client.collection('objects').find(query, {_id: 0, _key: 0}).toArray(callback);
      } :
      function (params, callback) {
        return db.getObjects(params.keys, callback);
      }
  })();

	// only allows wildcards i.e. "user:*"
	Data.keys = (function() {
		return db.helpers.mongo ? // if mongo
			function(key, callback) {
				key = key[0] == "*" ? key : "^" + key;
				var regex = new RegExp(key.replace(/\*/g, '.*'));

				db.client.collection('objects').find( { _key: { $regex: regex } }, function(err, result) {
					if (err) {
						return callback(err);
					}
					result.toArray(function(err, arr) {
						if (err) {
							return callback(err);
						}
						callback(null, !err && arr ? arr.map(function(v, i) {
							return v._key;
						}) : []);
					});

				});
			}
			: db.helpers.redis ? // if redis
			function(key, callback) {
				return db.client.keys(key, callback);
			}

			// if leveldb
			: db.helpers.level ?
			// https://github.com/rvagg/node-levelup/issues/285
			// todo: not tested :(
			function(key, callback) {
				var stream = db.client.createKeyStream({gte: key.replace(/\*/, '!'), lte: key.replace(/\*/, '~')});
				var keys = [];
				stream.on('data', function(key) {
					keys.push(key);
				});
				stream.on('end', function() {
					callback(null, keys);
				})
			}
			: null;
	})();

})(module.exports);
