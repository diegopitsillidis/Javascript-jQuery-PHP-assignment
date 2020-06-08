$(function() {
	
  $("select[name='sources']").change(function()
  {
	var value = $(this).val();
	// XML IS SELECTED
	if(value == "XML")
	{
		$.getJSON("getXmlFilenames.php", function(data)
		{
			if (data["code"] == "error")
			{
				console.log(data["message"]);
				alert("Error! It seems that: " + data["message"])
			}
			else
			{
				console.log(data);
				var msg = '<option value=choose>Choose a Set</option>';
				for (i = 0; i < data.length; i++)
				{
					msg +='<option value=' + i + '>' + data[i] + '</option>';
				}
				$("select[name='sets']").eq(0).html(msg);
				$("#dataSetSection").css("display", "block");
			}
		});
	}
	//DATABASE SELECTED
	else if (value == "database")
	{
		console.log("database is selected")
		$.getJSON("getTableNames.php", function(data)
		{
			if (data["code"] == "error")
			{
				console.log(data["message"]);
				alert("Error! It seems that: " + data["message"])
			}
			else
			{
				console.log(data);
				var msg = '<option value=choose>Choose a Set</option>';
				for (i = 0; i < data.length; i++)
				{
					msg +='<option value=' + i + '>' + data[i] + '</option>';
				}
				$("select[name='sets']").eq(0).html(msg);
				$("#dataSetSection").css("display", "block");
			}
		});
	}
	$("#tableSection").css("display", "none");
	$("#searchSection").css("display", "none");
	$("#insertSection").css("display", "none");
  });
  
  //Second drop down, CHOOSE A DATA SET
  $("select[name='sets']").change(function()
  {
	var value = $(this).find('option:selected').text();
	console.log(value);
	if ($("select[name='sources'] :selected").text() == "XML")
	{
		$.getJSON("getXmlFile.php", {sourceName:value}, function(data){
		if (data["code"] == "error"){
			console.log(data["message"]);
		}
		else{
			// ---- same code
			$('tr').remove();
			$.each(data, function(index, element) {
				console.log(index);
				console.log(element);
				console.log(Array.isArray(element));
				console.log(element.length);
				var msg;
				var x;
				msg += "<tr>";
				for (x = 0; x < Object.values(element[0]).length; x++){;
					msg += "<th>" + Object.keys(element[0])[x] + "</th>";
					console.log(Object.keys(element[0]));
				}
				msg += "</tr>"
				
				var i;
				for (i = element.length-1; i >= 0; i--){
					console.log(Object.values(element[i]));
					msg += "<tr class='searchable'>";
					for (k = 0; k < Object.values(element[i]).length; k++){
						msg += "<td>" + Object.values(element[i])[k] + "</td>";
					}
					msg += "</tr>";
				}
				
				$('table').append(msg);
				
				//set column drop down values
				var msg = '<option value=choose>Any</option>';
				var insertText = '';
				for (i = 0; i < Object.values(element[0]).length; i++){
					msg += '<option value=' + i + '>' + Object.keys(element[0])[i] + '</option>';
					insertText += '<p>' + Object.keys(element[0])[i] + ':</p> <input type="text" name= "'
					+ Object.keys(element[0])[i] +'" id=insert'+ [i] +'><br>';
				}
				insertText += '<button type="button" id="submitButton" onclick="insertSubmit()">Submit</button>';
				$("select[name='columns']").eq(0).html(msg);
				$("form#insert").html(insertText);
				$(".searchable:odd").addClass('odd')
		  });
		} //end else
		}); //end getJSON
	}
	else if ($("select[name='sources'] :selected").text() == "Database")
	{
		$.getJSON("getTableContents.php", {tableName:value}, function(data){
		if (data["code"] == "error"){
		  console.log(data["message"]);
		}
		else{
			// ---- same code
			$('tr').remove();
			$.each(data, function(index, element) {
				console.log(index);
				console.log(element);
				console.log(Array.isArray(element));
				console.log(element.length);
				var msg;
				var x;
				msg += "<tr>";
				for (x = 0; x < Object.values(element[0]).length; x++){;
					msg += "<th>" + Object.keys(element[0])[x] + "</th>";
					console.log(Object.keys(element[0]));
				}
				msg += "</tr>"
				
				var i;
				for (i = element.length-1; i >= 0; i--){
					console.log(Object.values(element[i]));
					msg += "<tr class='searchable'>";
					for (k = 0; k < Object.values(element[i]).length; k++){
						msg += "<td>" + Object.values(element[i])[k] + "</td>";
					}
					msg += "</tr>";
				}
				
				$('table').append(msg);
				
				//set column drop down values
				var msg = '<option value=choose>Any</option>';
				var insertText = '';
				for (i = 0; i < Object.values(element[0]).length; i++){
					msg += '<option value=' + i + '>' + Object.keys(element[0])[i] + '</option>';
					//to avoid Id input due to autoincriment
					if (i != 0)
					{
						insertText += '<p>' + Object.keys(element[0])[i] + ':</p> <input type="text" name= "'
						+ Object.keys(element[0])[i] +'" id=insert'+ [i] +'><br>';
					}
				}
				insertText += '<button type="button" id="submitButton" onclick="insertSubmit()">Submit</button>';
				$("select[name='columns']").eq(0).html(msg);
				$("form#insert").html(insertText);
				$(".searchable:odd").addClass('odd')
		  });
		} //end else
		}); //end getJSON
	}
	$("#tableSection").css("display", "block");
	$("#searchSection").css("display", "block");
	$("#insertSection").css("display", "block");
	
  });
	
	// --- SEARCH
	// ---column search
	//does not work, always searches all columns
	$("select[name='columns']").change(function()
	{
		var value = $("select[name='columns'] :selected").text();
		console.log(value);

	});
	
	// SEARCH BOX
	$(document).ready(function(){
		$("#myInput").on("keyup", function() {
			var value = $(this).val().toLowerCase();
			console.log(value);
			//class searchable use so that heading are not filtered
			$("#myTable tr.searchable").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
			});
		});
	});
	
});

// --- INSERT
function insertSubmit() {
	console.log("submit clicked")
	if ($("select[name='sources'] :selected").text() == "XML") //for XML
	{
	  var formData = new Object();
	  var source = $("select[name='sets'] :selected").text();

	  
		var formData = new Object();
		var el = '';
		var elText = '';
		//for xml i is 0 because no autoincriment
		for (i = 0; i < $('th').length; i++)
		{
			//get heading by index
			el = $('th:eq('+i+')').text();
			elText = "#insert";
			elText += i;
			//create property with heading name
			formData[el] =$(elText).val();
		}

	  var jsonFormData = JSON.stringify(formData);
	  var sourceFile = source;

	  $.getJSON("insertXml.php", {sourceName:sourceFile, sourceData:jsonFormData}, function(data){
		console.log(data); 
		//add new record to table
		$("select[name='sets']").trigger("change");
	  });
	}
	else if ($("select[name='sources'] :selected").text() == "Database") //for Database
	{
		var addData = new Object();
		var el = '';
		var elText = '';
		//for database i is 1 because autoincriment
		for (i = 1; i < $('th').length; i++)
		{
			//get heading by index
			el = $('th:eq('+i+')').text();
			elText = "#insert";
			elText += i;
			//create property with heading name
			addData[el] =$(elText).val();
		}
	
		var jsonAddData = JSON.stringify(addData);
		console.log(jsonAddData);
		
		var tableName = $("select[name='sets'] :selected").text();
		console.log(tableName);
		
		
		$.getJSON("insertDatabase.php", {tableName:tableName, appendData:jsonAddData}, function(data){
		console.log(data);
		//add new record to table
		$("select[name='sets']").trigger("change");
		});
	}
}