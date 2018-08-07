/* Load infrastructure */
let vista = require('ewd-vista');
let fs = require('fs');
let path = require('path');
let exec = require('child_process').exec;

/* Set-up module.export.handlers structure */
module.exports          = {};
module.exports.handlers = {};

/* Sets up Symbol Table management
 * Called when module is loaded by QEWD */
module.exports.init = function() {
  vista.init.call(this);
};

// Pre handler security checks - security keys mainly
module.exports.beforeHandler = vista.beforeHandler;

module.exports.handlers.routineQuery = function(messageObj, session, send, finished) {
	var files = listRoutines(messageObj.params.prefix.toUpperCase());
	finished({files: files});
};

module.exports.handlers.getRoutine = function(messageObj, session, send, finished) {
	var result = getRoutine(messageObj.params.routinePath);
    finished({result: result});
};

module.exports.handlers.saveRoutine = function(messageObj, session, send, finished) {
	var result = saveRoutine(messageObj.params.routinePath,messageObj.params.routineText,messageObj.params.newRoutine);
    finished({result: result});
};

module.exports.handlers.buildRoutine = function(messageObj, session, send, finished) {
	buildRoutine(messageObj.params.routinePath,finished);
};

module.exports.handlers.checkRoutineName = function(messageObj, session, send, finished) {
	var result = checkRoutineName(messageObj.params.routineName.trim().toUpperCase());
	finished({result: result});
};

var listRoutines = function(routineName){
    var files = [];
    var count = 0;
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    var dirs = [];
    for(var i=1; i < rsplit.length; i++){
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
    }
    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i];
        fs.readdirSync(dir).forEach(function(name){
            if(count > 19){return files;}
            var stats = fs.statSync(dir + '/' + name);
            if(!stats.isDirectory()){
                if(name.indexOf(routineName) === 0){
                    count = count + 1;
                    files.push({
                        id: count,
                        path: dir + '/' + name,
                        text: name.split('.')[0]
                    });
                }
            }
        });
    }
    return files;
};
var getRoutine = function(routinePath){
    var result = {};
    result.error = '';
    var invalid = true;
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    var dirs = [];
    for(var i=1; i < rsplit.length; i++){
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
    }
    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i];
        if(routinePath.indexOf(dir) === 0){
            invalid = false;
        }
    }
    if(invalid){
        result.error = 'Invalid path to get routine.';
        return result;
    }
    if(fs.existsSync(routinePath)){
        var routineName = path.basename(routinePath);
        result.name = routineName.split('.')[0];
        result.path = routinePath;
        result.routine = fs.readFileSync(routinePath).toString();
    }else{
        result.error = 'Routine Path not given.'
    }
    return result;
};
var saveRoutine = function(routinePath,routineText,isNew){
    var result = {};
    result.error = '';
    var invalid = true;
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    var dirs = [];
    for(var i=1; i < rsplit.length; i++){
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
    }
    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i];
        if(routinePath.indexOf(dir) === 0){
            invalid = false;
        }
    }
    if(invalid){
        result.error = 'Invalid path to save routine.';
        return result;
    }
    if(fs.existsSync(routinePath) || isNew){
        fs.writeFileSync(routinePath, routineText);
        result.saved = true;
    }else{
        result.error = 'Routine Path not given.'
    }
    return result;
};
var buildRoutine = function(routinePath,finished){
    var result = {};
    result.error = '';
    var invalid = false;
    var objPath = '';
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    objPath = rsplit[0].trim();
    /*for(var i=1; i < rsplit.length; i++){
        var dirs = [];
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
        for(var j=0; j<dirs.length; j++){
            dir = dirs[j];
            if(routinePath.indexOf(dir) === 0){
                if(rsplit[i-1].indexOf(')')>=0){
                    objPath = rsplit[i-1].split(')')[1].trim();
                }else{
                    objPath = rsplit[0].trim();
                }
                invalid = false;
            }
        }
    }*/
    if(invalid){
        result.error = 'Invalid path to build routine.';
        finished({
            message: result
        });
        return;
    }
    if(fs.existsSync(routinePath)){
        var routineName = path.basename(routinePath);
        routineName = routineName.split('.')[0];
        var command = 'mumps -object=' + objPath + '/' + routineName + '.o ' + routinePath;
        var child = exec(command,
            function (error, stdout, stderr) {
                var result = {};
                result.output = '';
                if(stdout.toString()){
                    result.output = result.output + '\n' + stdout.toString();
                }
                if(stderr.toString()){
                    result.output = result.output + '\n' + stderr.toString();
                }
                result.build = true;
                finished({
                    message: result
                });
            });
    }else{
        result.error = 'Routine Path not given.';
        finished({
            message: result
        });
    }
};
var checkRoutineName = function(routineName){
    var result = {};
    result.check = false;
    result.error = '';
    var patt = /^[A-Z%][0-9A-Z]{0,7}$/i;
    if(patt.test(routineName)){
        var gtmRoutines = process.env.gtmroutines;
        var rsplit = gtmRoutines.split('(');
        result.dirs = [];
        for(var i=1; i < rsplit.length; i++){
            var idir = rsplit[i].split(')')[0].trim();
            if(idir.indexOf(' ')>0){
                var indirs = idir.split(' ');
                for(var i=0; i < indirs.length; i++){
                    result.dirs.push(indirs[i].trim() + '/');
                }
            }else{
                result.dirs.push(idir + '/');
            }
        }
        result.check = true;
        result.routine = routineName;
        for(var i=0; i < result.dirs.length; i++){
            var dir = result.dirs[i];
            fs.readdirSync(dir).forEach(function(name){
                var stats = fs.statSync(dir + name);
                if(!stats.isDirectory()){
                    if(name == (routineName + '.m')){
                        result.check = false;
                        result.error = 'Routine with this name already exists.';
                        return result;
                    }
                }
            });
        }
    }else{
        result.error = 'Invalid Routine Name.';
    }
    return result;
};