$(function () {

	localStorage["noUser"] = $("body").html();

	var newSectionContent = "<div id='newSectionInner'><div><h2>Insert New Section:</h2><span>Title:</span> <input type='text' id='title' /></div><div><span>Content:</span><textarea id='content'></textarea></div><div><span>Insert after</span><select><option value='Insert after...'>Insert after</option>{{ITEMS}}</select></div><div><input type='button' value='Insert' id='insert' /><input type='button' value='Close' id='close' /></div>";
	var newSection = $("<div />", {id: 'newSection'});
	var sectionTemplateContent = "<header><h3>{title}</h3></header><div contenteditable='true'><p>{content}</p></div>";

	var sectionTemplate = $("<section />");
	var listItemTemplate = $("<li />");
	var listItemContents = "<a href='{{ID}}'>{{TITLE}}</a>";

	loadPage();

	$("#newSection #close").live('click', function() {
		closeNewSection();
	});

	$("#contents a").each( function(i) {
		var thisID = $(this).attr('href');
		var string = $(thisID).find('p').html().substring(0,80);
		string = string + "...";
		$(this).attr('title', string);
		$(this).tooltip();
	});


	$("section p").attr('contenteditable','true');

	$("#logIn div").hide();
	if ($("#logIn span").html() == "Log in") {
		$("#logIn span").click( function() {
			$("#logIn div").slideToggle(500);
		});

	}else if ($("#logIn span").html() == "Log out"){
		$("#logIn span").click( function() {
			console.log('log out')
			logOut();
		});
	}
	$("#loginForm").submit ( function() {
		logIn();
	});

	$.ajax ({
		url: "php/checklogin.php"
	}).done( function(data) {
		if (data == true) {
			$("#logIn span").html("Log out")
		}
	});

	$("[contenteditable='true']").keyup( function() {
		savePage();
	});


	$("#addSection").click( function() {
		var items = [];
		var newOpt = "<option value={numValue}>{html}</option>";
		$("#contents li a").each( function(i) {
			items[i] = newOpt.replace("{numValue}", $(this).attr('href')).replace("{html}", $(this).html());
		});
		newSectionContent = newSectionContent.replace("{{ITEMS}}", items);
		newSection.html(newSectionContent).appendTo("body").fadeIn(500);
	});
	$("#insert").live('click', function() {
		var title = $("#newSection #title").val();
		var content = $("#newSection #content").val();
		var afterWhich = $("#newSection select").val();
		var index = parseInt(afterWhich.indexOf('-'));
		var newNumber = [];
		for (i = 0; i < 3; i++) {
			newNumber[i] = Math.floor(Math.random()*10);
		}
		if (index != -1) {
			var linkid = afterWhich.substring(0, parseInt(index) + 1) + newNumber[0] + newNumber[2] + newNumber[1];
			var id = afterWhich.substring(1, parseInt(index)+1) + newNumber[0] + newNumber[2] + newNumber[1];
		}else {
			linkid = + newNumber[0] + newNumber[2] + newNumber[1];
			id = linkid;
			linkid = "#" + linkid;
		}
		var content = sectionTemplateContent.replace("{title}",title).replace("{content}", content);
		content = sectionTemplate.html($(content)).attr('id', id);
		$(afterWhich).after(content);
		var newListItem = listItemContents.replace("{{ID}}", linkid).replace("{{TITLE}}",title);
		newListItem = listItemTemplate.html(newListItem);
		$("#contents a[href="+afterWhich+"]").parent('li').after(newListItem)
		closeNewSection();
	});
});

function loadPage() {
	un = localStorage["user"];
	console.log(localStorage["user"]);
	if (un != "") {
		$("body").html(localStorage[un]);
	}else {
		$("body").html(localStorage["noUser"])
	}
}


function savePage() {
	un = localStorage["user"];
	if (un != "") {
		localStorage[un] = $("body").html();
	}
}
function closeNewSection() {
	$("#newSection").fadeOut(500).remove();
	savePage();
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
			$("#logIn span").html("Log out");
		}
	});
	//dummy username : dummyUser
	//dummy pw: thisIsPassword
	localStorage["user"] = un;
	loadPage();
	return false;
} 

function logOut() {
	$.ajax ({
		type: "POST",
		url: 'php/logout.php'
	});
	localStorage["user"] = "";
	loadPage();
}