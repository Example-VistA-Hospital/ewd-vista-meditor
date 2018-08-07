var meditor = {};

meditor.prep = function(EWD) {
  meditor.landingPage(EWD);
}; // ~prep

// Main set-up
meditor.landingPage = function(EWD) {
	$.getScript('/ewd-vista/assets/javascripts/cm.js')
      .done( () => {
        $.getScript('/ewd-vista/assets/javascripts/select2.js')
          .done( () => {
            $('<link>').appendTo('head').attr({
              type: 'text/css',
              rel:  'stylesheet',
              href: '/ewd-vista/assets/stylesheets/cm.css',
            });
			$('<link>').appendTo('head').attr({
              type: 'text/css',
              rel:  'stylesheet',
              href: '/ewd-vista/assets/stylesheets/select2.css',
            });
            let params = {
				service: 'ewd-vista-meditor',
				name: 'landing.html',
				targetId: 'main-content'
			};
			EWD.getFragment(params, function() {
				meditor.loadingPage(EWD);
			});
          });
      });
}; // ~landingPage

meditor.loadingPage = function(EWD) {
	$("#dynamic-options").append("<ul class='nav navbar-nav'> \
			<li class='dropdown'> \
				<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>File <span class='caret'></span></a> \
				<ul class='dropdown-menu' role='menu' id='mnuFile'> \
					<li><a href='#' style='word-spacing: 40px' id='mnuNew'>New Ctrl+R</a></li> \
					<li class='disabled'><a href='#' style='word-spacing: 40px' id='mnuSave'>Save Ctrl+S</a></li> \
				</ul> \
			</li> \
			<li class='dropdown' id='mnuEdit' style='display: none'> \
				<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Edit <span class='caret'></span></a> \
				<ul class='dropdown-menu' role='menu'> \
					<li><a href='#' id='mnuFullScreen'>Full Screen  (Ctrl+F11)</a></li>\
					<li class='dropdown dropdown-submenu'> \
						<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Bookmarks</a> \
						<ul class='dropdown-menu'> \
							<li><a href='#' id='mnuToggleBookmark'>Toggle Bookmark  Ctrl+F2</a></li> \
							<li><a href='#' id='mnuClearBookmark'>Clear Bookmarks  Ctrl+shift+F2</a></li> \
							<li><a href='#' style='word-spacing: 90px' id='mnuNextBookmark'>Next  F2</a></li> \
							<li><a href='#' style='word-spacing: 60px' id='mnuPreviousBookmark'>Previous  shift+F2</a></li> \
						</ul> \
					</li> \
				</ul> \
			</li> \
			<li class='dropdown' id='mnuBuild' style='display: none'> \
				<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Build <span class='caret'></span></a> \
				<ul class='dropdown-menu' role='menu'> \
					<li><a href='#' style='word-spacing: 40px' id='mnuCompile'>Compile Ctrl+F7</a></li> \
				</ul> \
			</li> \
			<li class='dropdown' id='mnuHelp'> \
				<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Help <span class='caret'></span></a> \
				<ul class='dropdown-menu' role='menu'> \
					<li><a href='#' id='mnuAbout'>About</a></li> \
				</ul> \
			</li> \
		</ul> \
		<form class='navbar-form navbar-left' role='search'> \
			<div class='form-group'> \
				<input type='hidden' id='selectedRoutine' placeholder='Select Routine' class='form-control' style='width:300px'> \
			</div> \
			<button type='submit' id='openBtn' class='btn btn-default'>Open</button> \
		</form> \
		<ul class='nav navbar-nav navbar-left'> \
			<li><a href='#' id='btnNew' data-toggle='tooltip' data-placement='bottom' title='New Routine (Ctrl+R)'><span class='glyphicon glyphicon-file' aria-hidden='true'></span></a></li> \
			<li><a href='#' id='btnSave' style='display: none' data-toggle='tooltip' data-placement='bottom' title='Save Routine (Ctrl+S)'><span class='glyphicon glyphicon-floppy-disk' aria-hidden='true'></span></a></li> \
			<li><a href='#' id='btnBuild' style='display: none'data-toggle='tooltip' data-placement='bottom' title='Compile Routine (Ctrl+F7)'><span class='glyphicon glyphicon-tag' aria-hidden='true'></span></a></li> \
			<li><a href='#' id='btnFullScreen' style='display: none'data-toggle='tooltip' data-placement='bottom' title='Full Screen (Ctrl+F11)'><span class='glyphicon glyphicon-fullscreen' aria-hidden='true'></span></a></li> \
		</ul>");
	$('#dynamic-options').removeClass('invisible');
	meditor.routines = {};
	meditor.saveonclosing = false;
	meditor.enableSelect2(EWD);
	$(document).on('keydown', function(event){
		// detect key pressed
		var key = event.keyCode;
		if (event.ctrlKey) {
			if (key === 82) {
				event.preventDefault();
				$('#btnNew').click();
			}
			if (key === 83) {
				event.preventDefault();
				$('#btnSave').click();
			}
			if (key === 122){
				event.preventDefault();
				$('#btnFullScreen').click();
			}
			if (key === 118) {
				event.preventDefault();
				$('#btnBuild').click();
			}
			if (key === 113) {
				event.preventDefault();
				$('#mnuToggleBookmark').click();
			}
			if (event.shiftKey){
				if (key === 113){
					event.preventDefault();
					$('#mnuClearBookmark').click();
				}
			}
		}else{
			if(event.shiftKey){
				if (key === 113){
					event.preventDefault();
					$('#mnuPreviousBookmark').click();
				}
			}else{
				if (key === 113){
					event.preventDefault();
					$('#mnuNextBookmark').click();
				}
			}
		}
	});
	$('body').on( 'click', '#openBtn', function(event) {
		event.preventDefault();
		if($('#selectedRoutine').select2('val')>0){
			var routineName = $('#selectedRoutine').select2('data').text;
			var routinePath = $('#selectedRoutine').select2('data').path;
			meditor.openRoutine(EWD,routineName,routinePath);
			$("#selectedRoutine").select2("val", "");
		}
	})
	.on('click','#btnSave', function(event){
		event.preventDefault();
		var routineName = $('.nav-tabs .active a').text().replace(' *','');
		if(!routineName){return;}
		meditor.saveRoutine(EWD,routineName);
	})
	.on('click','#mnuSave', function(event){
		event.preventDefault();
		var routineName = $('.nav-tabs .active a').text().replace(' *','');
		if(!routineName){return;}
		meditor.saveRoutine(EWD,routineName);
	})
	.on('click','#btnNew', function(event){
		meditor.newRoutine(event);
	})
	.on('click','#mnuNew', function(event){
		meditor.newRoutine(event);
	})
	.on('click','#btnBuild', function(event){
		meditor.buildRoutine(EWD,event);
	})
	.on('click','#mnuCompile', function(event){
		meditor.buildRoutine(EWD,event);
	})
	.on('click','#btnFullScreen', function(event){
		meditor.setEditorFullScreen(event);
	})
	.on('click','#mnuFullScreen',function(event){
		meditor.setEditorFullScreen(event);
	})
	.on('click','#mnuToggleBookmark', function(event){
		meditor.toggleBookmark(EWD,event);
	})
	.on('click','#mnuClearBookmark', function(event){
		meditor.clearBookmarks(event);
	})
	.on('click','#mnuNextBookmark', function(event){
		meditor.nextBookmark(event);
	})
	.on('click','#mnuPreviousBookmark', function(event){
		meditor.previousBookmark(event);
	})
	.on('click','#mnuAbout', function(event){
		meditor.showAbout(event);
	})
	.on('click','#btnNROK', function(event){
		var routineName = $('#txtNewRoutine').val();
		meditor.checkRoutineName(EWD,routineName);
	})
	.on('click','#btnSDOK', function(event){
		var dir = $('#selectDirectoryBody .active');
		if(dir.length > 0){
			$('#selectDirectoryModal').modal('hide');
			var routineName = $('#selDirRoutine').html();
			var routinePath = dir.html();
			routinePath = routinePath + routineName + '.m';
			meditor.createRoutineTab(routineName,routinePath,'',true);
		}else{
			alert('select directory from the list.');
		}
	})
	.on('click','#btnSCYes', function(event){
		$('#saveChnagesModal').modal('hide');
		var routineName = meditor.eltobeClosed.siblings('a').text().replace(' *','');
		var routineText = meditor.getText(routineName);
		var routinePath = meditor.routines[routineName].path;
		meditor.saveonclosing = true;
		meditor.saveRoutine(EWD,routineName);
		var anchor = meditor.eltobeClosed.siblings('a');
		$(anchor.attr('href')).remove();
		meditor.eltobeClosed.parent().remove();
		if($('.nav-tabs li').length > 0){
			$(".nav-tabs li").children('a').first().click();
		}else{
			meditor.setEditMode(false);
		}
		meditor.eltobeClosed = null;
	})
	.on('click','#btnSCNo', function(event){
		$('#saveChnagesModal').modal('hide');
		var anchor = meditor.eltobeClosed.siblings('a');
		$(anchor.attr('href')).remove();
		meditor.eltobeClosed.parent().remove();
		if($('.nav-tabs li').length > 0){
			$(".nav-tabs li").children('a').first().click();
		}else{
			meditor.setEditMode(false);
		}
		meditor.eltobeClosed = null;
	});
	$(".nav-tabs").on("click", "a", function (e) {
		e.preventDefault();
		$(this).tab('show');
		meditor.routines[$(this).text().replace(' *','')].editor.refresh();
		meditor.setEditMode(true);
	})
	.on("click", "span", function () {
		var routineName = $(this).siblings('a').text();
		if(routineName.indexOf('*')>=0){
			meditor.eltobeClosed = $(this);
			$('#saveChangesBody').html('Save changes to <b>' + routineName.replace(' *','') + '</b>.');
			$('#saveChnagesModal').modal({
				keyboard: false,
				backdrop: 'static'
			});
		}else{
			var anchor = $(this).siblings('a');
			$(anchor.attr('href')).remove();
			$(this).parent().remove();
			if($('.nav-tabs li').length > 0){
				$(".nav-tabs li").children('a').first().click();
			}else{
				meditor.setEditMode(false);
			}
		}
	});
};

meditor.enableSelect2 = function(EWD) {
	$("#selectedRoutine").select2({
		minimumInputLength: 1,
		query: function (query) {
			meditor.select2 = {
				callback: query.callback
			};
			let messageObj = {
				service: 'ewd-vista-meditor',
				type: 'routineQuery',
				params: {
					prefix: query.term
				}
			};
			EWD.send(messageObj, (res) => {
				if (res.message.files) {
					meditor.select2.results = res.message.files;
					meditor.select2.callback(meditor.select2);
				}
			});
		}
	});
};
meditor.setText = function(routine,text){
	meditor.routines[routine].editor.getDoc().setValue(text);
};
meditor.getText = function(routine){
	return meditor.routines[routine].editor.getDoc().getValue();
};
meditor.newRoutine = function(event){
	event.preventDefault();
	$('#txtNewRoutine').val('');
	$('#newRoutineModal').modal({
		keyboard: false,
		backdrop: 'static'
	});
};
meditor.openRoutine = function(EWD,routineName,routinePath){
	var found = false;
	$('.nav-tabs li').each(function(index, element) {
		if(routineName == $(element).find('a').text().replace(' *','')){
			found = true;
			$(element).find('a').click();
		}
	});
	if(!found) {
		let messageObj = {
			service: 'ewd-vista-meditor',
			type: 'getRoutine',
			params: {
				routinePath: routinePath
			}
		};
		EWD.send(messageObj, function(responseObj) {
			if(responseObj.message.result.error){
				alert(responseObj.message.result.error);
			}else{
				if(responseObj.message.result.routine){
					var routineName = responseObj.message.result.name;
					var routineText = responseObj.message.result.routine;
					var routinePath = responseObj.message.result.path;
					meditor.createRoutineTab(routineName,routinePath,routineText,false);
				}else{
					alert('Some error occurred while fething routine.');
				}
			}
		});
	}
};
meditor.saveRoutine = function(EWD,routineName){
	if(!routineName){return;}
	console.log(routineName);
	var routineText = meditor.getText(routineName);
	var routinePath = meditor.routines[routineName].path;
	var newRoutine = meditor.routines[routineName].new;
	let messageObj = {
		service: 'ewd-vista-meditor',
		type: 'saveRoutine',
		params: {
			routinePath: routinePath,
			routineText: routineText,
			newRoutine: newRoutine
		}
	};
	EWD.send(messageObj, function(responseObj) {
		if(responseObj.message.result.error){
			alert(responseObj.message.result.error);
		}else{
			if(responseObj.message.result.saved){
				if(meditor.saveonclosing){
					meditor.saveonclosing = false;
					return;
				}
				var routineName = $('.nav-tabs .active a').text().replace(' *','');
				$('.nav-tabs .active a').text(routineName);
				meditor.routines[routineName].editor.on("change",meditor.textChanged);
			}else{
				alert('Some error occurred in saving routine.');
			}
		}
	});
};
meditor.buildRoutine = function(EWD,event){
	event.preventDefault();
	var routineName = $('.nav-tabs .active a').text();
	if(!routineName){return;}
	if(routineName.indexOf('*')>=0){
		alert('Please save the routine first.');
		return;
	}
	var routinePath = meditor.routines[routineName].path;
	let messageObj = {
		service: 'ewd-vista-meditor',
		type: 'buildRoutine',
		params: {
			routinePath: routinePath
		}
	};
	EWD.send(messageObj, function(responseObj) {
		if(responseObj.message.error){
			alert(responseObj.message.message.error);
		}else{
			if(responseObj.message.message.build){
				if(responseObj.message.message.output){
					meditor.setResult(('Detected errors during compilation\n' + responseObj.message.message.output).split('\n'));
				}else{
					var routineName = $('.nav-tabs .active a').text().replace(' *','');
					meditor.setResult((routineName + ' compiled successfully.').split('\n'));
				}
			}else{
				alert('Some error occurred in saving routine.');
			}
		}
	});
};
meditor.checkRoutineName = function(EWD,routineName){
	let messageObj = {
		service: 'ewd-vista-meditor',
		type: 'checkRoutineName',
		params: {
			routineName: routineName
		}
	};
	EWD.send(messageObj, function(responseObj) {
		if(responseObj.message.result.error){
			alert(responseObj.message.result.error);
		}else{
			if(responseObj.message.result.check){
				$('#newRoutineModal').modal('hide');
				if(responseObj.message.result.dirs.length > 1){
					var dirHtml = '';
					for(var i=0; i < responseObj.message.result.dirs.length; i++){
						dirHtml = dirHtml + '<a href="#" class="list-group-item">' + responseObj.message.result.dirs[i] + '</a>'
					}
					$('#selDirRoutine').html(responseObj.message.result.routine);
					$('#selectDirectoryBody').html(dirHtml);
					$('#selectDirectoryBody a').click(function(e) {
						e.preventDefault();
						$(this).parent().find('a').removeClass('active');
						$(this).addClass('active');
					});
					$('#selectDirectoryModal').modal({
						keyboard: false,
						backdrop: 'static'
					});
				}else{
					var routineName = responseObj.message.result.routine;
					var routinePath = responseObj.message.result.dirs[0];
					if(routinePath){
						routinePath = routinePath + routineName + '.m';
						meditor.createRoutineTab(routineName,routinePath,'',true);
					}
				}
			}else{
				alert('error!');
			}
		}
	});
};
meditor.setResult = function(resultArray){
	var result = '';
	for(var i=0; i < resultArray.length; i++){
		result = result + resultArray[i] + '<br/>';
	}
	$('#content_results').html(result);
};
meditor.textChanged = function(instance,changeObj){
	instance.off("change",meditor.textChanged);
	if($('.nav-tabs .active a').text().indexOf('*')<0){
		$('.nav-tabs .active a').text($('.nav-tabs .active a').text() + ' *');
	}
};
meditor.setEditMode = function(mode){
	if(mode){
		$('#btnSave').show();
		$('#btnBuild').show();
		$('#btnFullScreen').show();
		$('#mnuEdit').show();
		$('#mnuBuild').show();
		$('#mnuSave').parents().removeClass('disabled');
	}else{
		$('#btnSave').hide();
		$('#btnBuild').hide();
		$('#btnFullScreen').hide();
		$('#mnuEdit').hide();
		$('#mnuBuild').hide();
		$('#mnuSave').parent().addClass('disabled');
		meditor.setResult([]);
	}
};
meditor.setEditorFullScreen = function(event){
	event.preventDefault();
	var routineName = $('.nav-tabs .active a').text().replace(' *','');
	if(!routineName){return;}
	meditor.routines[routineName].editor.setOption("fullScreen", !meditor.routines[routineName].editor.getOption("fullScreen"));
};
meditor.toggleBookmark = function(event){
	event.preventDefault();
	var routineName = $('.nav-tabs .active a').text().replace(' *','');
	if(!routineName){return;}
	var editor = meditor.routines[routineName].editor;
	var lineNumber = editor.getCursor().line;
	var found = false;
	editor.getDoc().findMarksAt({line: lineNumber, ch:0}).forEach(function(bookmark){
		bookmark.clear();
		found = true;
	});
	if(!found){
		var elem = document.createElement("span");
		elem.className = 'glyphicon glyphicon-bookmark';
		elem.setAttribute("aria-hidden", "true");
		var bm = editor.getDoc().setBookmark({line: lineNumber, ch:0},{widget: elem});
	}
};
meditor.clearBookmarks = function(event){
	event.preventDefault();
	var routineName = $('.nav-tabs .active a').text().replace(' *','');
	if(!routineName){return;}
	var editor = meditor.routines[routineName].editor;
	editor.getDoc().getAllMarks().forEach(function(bookmark){
		bookmark.clear();
	});
};
meditor.nextBookmark = function(event){
	event.preventDefault();
	var routineName = $('.nav-tabs .active a').text().replace(' *','');
	if(!routineName){return;}
	var editor = meditor.routines[routineName].editor;
	var cLine = editor.getDoc().getCursor().line;
	if(editor.getDoc().getAllMarks().length > 0){
		var found = false;
		for(var i=cLine +1; i<editor.getDoc().lineCount(); i++){
			if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
				editor.getDoc().setCursor({line: i, ch:0});
				found = true;
				return;
			}
		}
		if(!found){
			for(var i=0; i<editor.getDoc().lineCount(); i++){
				if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
					editor.getDoc().setCursor({line: i, ch:0});
					return;
				}
			}
		}
	}
};
meditor.previousBookmark = function(event){
	event.preventDefault();
	var routineName = $('.nav-tabs .active a').text().replace(' *','');
	if(!routineName){return;}
	var editor = meditor.routines[routineName].editor;
	var cLine = editor.getDoc().getCursor().line;
	if(editor.getDoc().getAllMarks().length > 0){
		var found = false;
		if(cLine === 0){
			cLine = editor.getDoc().lineCount() - 1;
		}
		for(var i=cLine - 1; i>=0; i--){
			if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
				editor.getDoc().setCursor({line: i, ch:0});
				found = true;
				return;
			}
		}
		if(!found){
			for(var i=editor.getDoc().lineCount() - 1; i>=0; i--){
				if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
					editor.getDoc().setCursor({line: i, ch:0});
					return;
				}
			}
		}
	}
};
meditor.createRoutineTab = function(routineName,routinePath,routineText,newRoutine){
	var rid = 'tab' + routineName;
	var li = '';
	if(routineText){
		li = '<li role="presentation"><a href="#' + rid + '">' + routineName + '</a> <span> x </span></li>';
	}else{
		li = '<li role="presentation"><a href="#' + rid + '">' + routineName + ' *</a> <span> x </span></li>';
	}
	$(".nav-tabs").append(li);
	var tid = 'txt' + routineName;
	var tarea = '<textarea id="' + tid + '" name="' + tid + '"></textarea>';
	$('.tab-content').append('<div class="tab-pane" id="' + rid + '">' + tarea + '</div>');
	var mc = $("#main_Container");
	var editor = CodeMirror.fromTextArea(document.getElementById(tid), {
		mode: "mumps",
		styleActiveLine: true,
		lineNumbers: true,
		lineWrapping: false,
		extraKeys: {
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		}
	});
	//editor.setSize(mc.width(), (mc.position().top + $('.navbar-fixed-bottom').position().top));
	editor.setSize(mc.width(), mc.height());
	$(".CodeMirror").css({"height": "100%"});
	meditor.routines[routineName] = {
		path: routinePath,
		new: newRoutine,
		editor: editor
	};
	console.log(meditor.routines);
	meditor.setText(routineName,routineText);
	editor.on("change",meditor.textChanged);
	$('.nav-tabs li:last-child a').click();
};
meditor.showAbout = function(event){
	event.preventDefault();
	//$('#txtNewRoutine').val('');
	//var mbody = '<script type="IN/MemberProfile" data-id="https://www.linkedin.com/in/faisalsami" data-format="inline" data-related="false"></script>';
	//$('#aboutModalSocial').html(mbody);
	$('#aboutModal').modal({
		keyboard: true,
		backdrop: 'static'
	});
};
