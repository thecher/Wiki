/* jQuery.fn.outerHTML = function() {
  return jQuery('<div />').append(this.eq(0).clone()).html();
};

var editBox = $("<textarea />", {
	id: "editBox"
}); */

$(function () {

	var newSectionContent = "<div id='newSectionInner'><div><h2>Insert New Section:</h2><span>Title:</span> <input type='text' id='title' /></div><div><span>Content:</span><textarea id='content'></textarea></div><div><span>Insert after</span><select><option value='Insert after...'>Insert after</option>{{ITEMS}}</select></div><div><input type='button' value='Insert' id='insert' /><input type='button' value='Close' id='close' /></div>";
	var newSection = $("<div />", {id: 'newSection'});


	$("#newSection #close").live('click', function() {
		closeNewSection();
	});
	//$("body").html(localStorage["bodyText"]);

	//make only articles editable, not headers; add articles, sort articles, save articles in local storage
	//require.js, define modules in 
	//contenteditable
	//small to large img on hover

	$("section p").attr('contenteditable','true');

	/* $("section p").live("dblclick", function() {
		dothestuff($(this));
	}); */
	$("#logIn div").hide();
	$("#logIn span").click( function() {
		$("#logIn div").slideToggle(500);
	});

	$.ajax ({
		url: "php/checklogin.php"
	}).done( function(data) {
		if (data == true) {
			$("#logIn span").html("Log out").off('click').addClass('');
		}
	});


	/* $( "#dialog" ).dialog({ autoOpen: false });
	$( "#accordion" ).accordion({ header: "header", heightStyle: "content", collapsible: "true" });
	$("#articleNavigation ul").menu().click( function() {
		$("#dialog").dialog("open");
	});
	$("input[type='submit']").button(); */

	$("[contenteditable='true']").keyup( function() {
		savePage();
	});

	$("#loginForm").submit ( function() {
		logIn();
	});

	$("#addSection").click( function() {
		console.log('clicked');
		var items = [];
		var newOpt = "<option value={numValue}>{html}</option>";
		$("#contents li a").each( function(i) {
			items[i] = newOpt.replace("{numValue}", $(this).attr('href')).replace("{html}", $(this).html());
		});
		console.log(items);
		newSectionContent = newSectionContent.replace("{{ITEMS}}", items);
		newSection.html(newSectionContent).appendTo("body").fadeIn(500);
	});
	$("#insert").live('click', function() {
		makeNewSection();
	});
});

function dothestuff(item) {
	var oldHTML = item.outerHTML();
	item.after(editBox.clone().html(oldHTML)).remove();
	$("#editBox").focus();
	$("#editBox").keypress("13",function(e) {
		if(e.ctrlKey) {
			var newHTML = $("#editBox").val();
			$("#editBox").after(newHTML).val("").remove();
		}
	});
	$("#editBox").blur( function() {
		if ($("#editBox")) {
			var newHTML = $("#editBox").val();
			$("#editBox").after(newHTML).val("").remove();
		}
	});
}

function savePage() {
	localStorage["bodyText"] = $("body").html();
}
function closeNewSection() {
	$("#newSection").fadeOut(500);
}
function logIn() {
	var un = $("#username").val();
	var pw = $("#password").val();
	console.log(un, pw);
	$.ajax ({
		type: "POST",
		url: "php/login.php",
		data: {
			un: un,
			pw: pw
		}
	}).done( function(data) {
		console.log(data)
		if (data == "logged in") {
			$("#logIn div").slideUp(500);
			$("#logIn span").html("Log out").off('click');
		}
	});
	//dummy username : dummyUser
	//dummy pw: thisIsPassword
	return false;
}
function makeNewSection() {
	var sectionTemplateContent = "<header><h3>{title}</h3></header><div>{content}</div>";
	var sectionTemplate = $("<section />", {contenteditable: 'true'});

	var title = $("#newSection #title").val();
	var content = $("#newSection #content").val();
	var afterWhich = $("#newSection select").val();
	var content = sectionTemplateContent.replace("{title}",title).replace("{content}", content);
	content = sectionTemplate.html(content);
	$(afterWhich).after(content);
	closeNewSection();
	savePage();
}