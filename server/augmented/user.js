

// todo: how to warn?

(function(module) {

  var nbbRequire = require('nodebb-plugin-require');
  var async = require('async');
  var extend = require('extend');

  // nbb-core
  var User = nbbRequire('src/user');

  // custom
  var Data = require('../helpers/data.js');
  var utils = require('../../public/js/utils');
  var Groups = require('./groups');
  var File = require('./file');

  User.batchImport = function (array, options, progressCallback, batchCallback) {
    var index = 0;
    options = extend(true, {}, options);

    async.eachSeries(
      array,
      function (record, next) {
        User.import(record, options, function(err, data) {
          if (data._claimedOwnership) {
            options.adminTakeOwnership = false;
          }
          progressCallback(err, {data: data, index: ++index});

          // ignore errors:
          // let progressCallback throw an error or log a warning if it wants to.
          next();
        });
      },
      function (err) {
        batchCallback(err);
      });
  };

  User.import = function (data, options, callback) {
    if (typeof callback == 'undefined') {
      callback = options;
      options = {};
    }

    var uid;
    var createData = {};
    var confirmEmail = options.autoConfirmEmails || data._emailConfirmed;
    var flushed = options.flush || options.flushed;

    var done = function (uid, data, callback) {
      var d = extend(true, {}, data);
      User.setImported(data._uid, uid, d, function(err) {
        callback(err, d);
      });
    };

    async.series([
      function (next) {
        if (!data.uid) {
          return next();
        }
        done(uid, data, callback);
      },
      function (next) {
        if (!flushed) {
          return User.getImported(data._uid, function(err, _imported) {
            if (err || !_imported) {
              return next();
            }
            return callback(null, _imported);
          });
        }
        return next();
      },

      function (next) {
        if (options.adminTakeOwnership && (parseInt(data._uid, 10) === parseInt(options.adminTakeOwnership._uid, 10) || (data._username || '').toLowerCase() === options.adminTakeOwnership._username.toLowerCase())) {
          options.adminTakeOwnership = false;
          data._claimedOwnership = true;
          uid = 1;
          next();
        }
        next();
      },

      function(next) {
        if (uid) {
          return next();
        }

        createData = {
          username: pickAndCleanUsername(data._username, data._alternativeUsername) || data._email,
          email: data._email,
          password: options.passwordGen && options.passwordGen.enabled
            ? generateRandomString(options.passwordGen.len, options.passwordGen.chars)
            : data._password
        };

        var onCreate = function(err, newUid) {
          if (err && err.message === "[[error:email-taken]]" && options.importDuplicateEmails) {
            createData.email = User.incrementEmail(createData.email);
            User.create(createData, onCreate);
            return;
          }
          uid = newUid;
          next(err);
        };
        User.create(createData, onCreate);
      },

      function (next) {
          data.userslug = data._userslug || utils.slugify(createData.username || "");
          next();
      },

      function(next) {
        if (data._picture) {
          return User.setProfilePictureUrl(uid, data._picture, next);
        }
        if (data._pictureBlob) {
          User.setProfilePictureBlob(uid, data._pictureBlob, {filename: data._pictureFilename}, function(err, ret) {
            if (err) return next(err);

            data._picture = ret.url;
            next();
          });
        }
      },

      function(next) {
        var fields = {
          signature: data._signature || '',
          website: data._website || '',
          location: data._location || '',
          joindate: data._joindate || +new Date(),
          reputation: (data._reputation || 0) * (options.userReputationMultiplier || 1),
          profileviews: data._profileviews || 0,
          fullname: data._fullname || '',
          birthday: data._birthday || '',
          showemail: data._showemail ? 1 : 0,
          lastposttime: data._lastposttime || 0,

          'email:confirmed': confirmEmail ? 1 : 0,

          // we're importing, no one is online
          status: 'offline',
          // don't ban anyone now, ban them later
          banned: 0
        };

        if (data._lastonline) {
          fields.lastonline = data._lastonline;
        }

        // aint gonna stringify blobs
        delete data._pictureBlob;
        fields.__imported_original_data__ = JSON.stringify(data);

        User.setUserFields(uid, fields, next);
      },

      function (next) {
        if (data._reputation > 0) {
          return User.setReputation(uid, data._reputation, next);
        }
        next();
      },

      function(next) {

        var isModerator = false;
        var isAdministrator = false;

        var _groupNames = [].concat(data._groupNames)

          // backward compatible level field
          .concat((data._level || "").toLowerCase() == "administrator" ? "administrators" : [])
          .concat((data._level || "").toLowerCase() == "moderator" ? "moderators" : [])

          // filter out the moderator.
          .reduce(function (_groupNames, _groupName, index, arr) {
            if (_groupName.toLowerCase() == "moderators" && !isModerator) {
              isModerator = true;
              return _groupNames;
            }
            if (_groupName.toLowerCase() == "administrators" && !isAdministrator) {
              isAdministrator = true;
            }
            _groupNames.push(_groupName);
            return _groupNames;
          }, []);

        async.eachSeries(_groupNames, function (_groupName, next) {
          Groups.joinAt(uid, _groupName, data._joindate, next);
        }, next);
      },

      function(next) {
        var _gids = [].concat(data._groups).concat(data._gids);

        async.eachSeries(_gids, function (_gid, next) {
          Groups.getImported(_gid, function(err, group) {
            if (err || !group) {
              return;
            }
            Groups.joinAt(uid, group.name, data._joindate, next);
          });
        }, next);
      }

    ], function(err) {
      if (err) {
        return callback(err);
      }
      done(uid, data, callback);
    });
  };

  User.setImported = function (_uid, uid, user, callback) {
    return Data.setImported('_imported:_users', '_imported_user:', _uid, uid, user, callback);
  };

  User.getImported = function (_uid, callback) {
    return Data.getImported('_imported:_users', '_imported_user:', _uid, callback);
  };

  User.deleteImported = function (_uid, callback) {
    return Data.deleteImported('_imported:_users', '_imported_user:', _uid, callback);
  };

  User.deleteEachImported = function(onProgress, callback) {
    return Data.deleteEachImported('_imported:_users', '_imported_user:', onProgress, callback);
  };

  User.isImported = function (_uid, callback) {
    return Data.isImported('_imported:_users', _uid, callback);
  };

  User.eachImported = function (iterator, options, callback) {
    return Data.each('_imported:_users', '_imported_user:', iterator, options, callback);
  };

  // [potential-nodebb-core]
  User.count = function (callback) {
    Data.count('users:joindate', callback);
  };

  // [potential-nodebb-core]
  User.each = function (iterator, options, callback) {
    return Data.each('users:joindate', 'user:', iterator, options, callback);
  };

  // [potential-nodebb-core]
  User.processUidsSet = function(process, options, callback) {
    return Data.processIdsSet('users:joindate', process, options, callback);
  };

  // [potential-nodebb-core]
  User.processSet = function(process, options, callback) {
    return Data.processSet('users:joindate', 'user:', process, options, callback);
  };

  // [potential-nodebb-core]
  User.confirmEmail = function (uid, callback) {

    // todo: gonna need to confirmation-code somehow and delete it from the set
    async.series([
      async.apply(User.setUserField, uid, 'email:confirmed', 1)
    ], callback);
  };

  // [potential-nodebb-core]
  User.setReputation = function (uid, reputation, callback) {
    async.series([
      async.apply(db.sortedSetAdd, 'users:reputation', reputation, uid),
      async.apply(User.setUserField, uid, 'reputation', reputation),
    ], callback);
  };

  // [potential-nodebb-core]
  User.makeAdministrator = function (uid, joindate, callback) {
    Groups.joinAt('administrators', uid, joindate, callback);
  };

  // [potential-nodebb-core]
  User.makeModerator = function (uid, cid, joindate) {
    Groups.joinAt('cid:' + cid + ':privileges:mods:members', uid, joindate, callback);
  };

  // [potential-nodebb-core]
  User.setProfilePictureUrl = function (uid, url, callback) {
    return User.setUserFields(uid, {uploadedpicture: url, picture: url}, callback);
  };

  // [potential-nodebb-core]
  User.setProfilePictureBlob = function (uid, blob, options, callback) {
    callback = arguments[arguments.length - 1];

    var extension = options.extension || options.ext || '.png';
    var filename = options.filename || 'profile_picture_' + uid + extension;
    var folder = options.folder || 'profile_pictures';

    File.saveBlobToLocal(filename, folder, blob, function(err, ret) {
      if (err) return callback(err);

      User.setProfilePictureUrl(uid, ret.url, function(err) {
        if (err) return callback(err);
        callback(null, ret);
      });
    });
  };

  function pickAndCleanUsername () {
    var args = Array.prototype.slice(arguments, 0);

    if (!args.length) {
      return '';
    }

    var username = args[0];
    if (utils.isUserNameValid(username)) {
      return username;
    }

    // todo: i don't know what I'm doing HALP
    username = username
      .replace(/[^\u00BF-\u1FFF\u2C00-\uD7FF\-.*\w\s]/gi, '')
      .replace(/ /g,'')
      .replace(/\*/g, '')
      .replace(/æ/g, '')
      .replace(/ø/g, '')
      .replace(/å/g, '');

    if (utils.isUserNameValid(username)) {
      return username;
    }

    args.shift();

    return pickAndCleanUsername.apply(null, args);
  }

  function generateRandomString (len, chars) {
    var index = (Math.random() * (chars.length - 1)).toFixed(0);
    return len > 0 ? chars[index] + generateRandomString(len - 1, chars) : '';
  }


  module.exports = User;

}(module));

//
//var privileges = require('../../../src/privileges.js');
//var Meta = require('../../../src/meta.js');
//var Messaging = require('../../../src/messaging.js');
//var File = require('../../../src/file.js');
//var Topics = require('../../../src/topics.js');
//var Posts = require('../../../src/posts.js');
//var Categories = require('../../../src/categories.js');
//var db = module.parent.require('../../../src/database.js');
