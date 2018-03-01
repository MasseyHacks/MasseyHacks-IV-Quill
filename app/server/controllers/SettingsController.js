var Settings = require('../models/Settings');
var waveSend = require('../services/waveSend');

var SettingsController = {};

SettingsController.getWave = function(callback){
  Settings.getCurrentWave(callback, true);
}

/**
 * Update any field in the settings.
 * @param  {String}   field    Name of the field
 * @param  {Any}      value    Value to replace it to
 * @param  {Function} callback args(err, settings)
 */
SettingsController.updateField = function(field, value, callback){
  var update = {};
  update[field] = value;
  Settings
    .findOneAndUpdate({},{
      $set: update
    }, {new: true}, callback);
};

SettingsController.updateWave = function(wave, value, callback){
  var w = {};
  w[wave] = value;

  Settings.findOneAndUpdate({},
    {
      $set: w
    },
    {
      new: true
    },
    function(err, data) {
      waveSend.engageTimers(true);
      callback(err, data);
    });
};


/**
 * Update the list of whitelisted emails and email extensions.
 * @param  {[type]}   emails   [description]
 * @param  {Function} callback args(err, settings)
 */
SettingsController.updateWhitelistedEmails = function(emails, callback){
  Settings
    .findOneAndUpdate({},{
      $set: {
        whitelistedEmails: emails
      }
    }, {new: true})
    .select('whitelistedEmails')
    .exec(callback);
};

/**
 * Add new school to list.
 * @param  {[type]}   school   [school to be added]
 * @param  {Function} callback args(err, settings)
 */

SettingsController.addSchool = function(school, callback){
  if (school === undefined || school === null) {
    callback();
    return;
  }
  Settings
    .findOneAndUpdate({},{
      $push: { schools: school }
    }, {new: true}, callback);
};

SettingsController.getSchools = function(callback){
  Settings.getSchools(callback);
};



/**
 * Get the list of whitelisted emails.
 * Whitelist emails are by default not included in settings.
 * @param  {Function} callback args(err, emails)
 */
SettingsController.getWhitelistedEmails = function(callback){
  Settings.getWhitelistedEmails(callback);
};

SettingsController.setParticipants = function(participants, callback){

    console.log(participants);

    if (isNaN(participants) && parseInt(participants) > 1) {
        return callback({
            message: "Bro dis aint numba"
        });
    }

    var numInt = parseInt(participants);
    Settings.findOneAndUpdate({},{
        $set: {
            participants: numInt,
        }
     },{new: true},callback);
};

/**
 * Set the time window for registrations.
 * If either open or close are null, do not change that time.
 * @param  {Number}   open     Open time in ms
 * @param  {Number}   close    Close time in ms
 * @param  {Function} callback args(err, settings)
 */
SettingsController.updateRegistrationTimes = function(open, close, callback){
  var updatedTimes = {};

  if (close <= open){
    return callback({
      message: "Registration cannot close before or at exactly the same time it opens."
    });
  }

  if (open){
    updatedTimes.timeOpen = open;
  }

  if (close){
    updatedTimes.timeClose = close;
  }

  Settings
    .findOneAndUpdate({},{
      $set: updatedTimes
    }, {new: true}, callback);
};

/**
 * Update reimbursement class amounts.
 * @param  {Object}   reimbursementClass
 */
SettingsController.updateReimbClasses = function(reimbClasses, callback){
  Settings
    .findOneAndUpdate({},{
      $set: {
        reimbursementClass: reimbClasses
      }
    }, {new: true})
    .select('reimbursementClass')
    .exec(callback);
};

/**
 * Update show rejection.
 * @param  {Boolean}   showRejection
 */
SettingsController.showRejection = function(showRejection, callback){
  Settings
    .findOneAndUpdate({},{
      $set: {
        showRejection: showRejection
      }
    }, {new: true})
    .exec(callback);
};

/**
 * Get the open and close time for registration.
 * @param  {Function} callback args(err, times : {timeOpen, timeClose})
 */
SettingsController.getRegistrationTimes = function(callback){
  Settings.getRegistrationTimes(callback);
};

/**
 * Get all public settings.
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
SettingsController.getPublicSettings = function(callback){
    Settings.getPublicSettings(callback);
};

SettingsController.getPrivateSettings = function(callback){
    Settings.getPrivateSettings(callback);
};


module.exports = SettingsController;
