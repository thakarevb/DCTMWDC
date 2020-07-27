(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "title",
            dataType: tableau.dataTypeEnum.string
        }
		, {
            id: "url",
            alias: "url",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "doc_type",
            alias: "Doc Type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Author",
            dataType: tableau.dataTypeEnum.string
        }
		];

        var tableSchema = {
            id: "DCTMFeed",
            alias: "DCTM Feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
	var formData = JSON.parse(tableau.connectionData);
	$.ajax({
  type: 'GET',
  url: formData["url"],
//data:formData["where"], //can be uncomment if required.add new place holder in html
  dataType: 'json',
  //crossDomain:true,
  

  beforeSend: function (xhr) {
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
	  xhr.setRequestHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
	  xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
	 xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
	
	   xhr.setRequestHeader ("Authorization", "Basic " + btoa(tableau.username + ":" + tableau.password));
},
  complete: function (resp) {
  
 
  
  
  
   var feat = resp,
                tableData = [];

var objJSON = JSON.parse(resp.responseText);


            for (var i = 0, len = objJSON.entries.length; i < len; i++) {
			
					
			var abc = objJSON.entries[i];
			
                tableData.push({
                    "title": abc.title,

					 "url": abc.id,
                    "doc_type": abc.summary,
                    "Author": abc.author[0].name
					
					
                });
			            }
			
			table.appendRows(tableData);
			
			            doneCallback();
			
			
  },
  error: function(jqXHR, status) {
  
  alert('error');

  }
 });
       
    };

    setupConnector = function setupConnector(){
	var  urlval = {"url":$('#urlid').val().trim()					
					}

	
	var username= $('#username').val().trim();
	
	var password= $('#password').val().trim();
	
	tableau.connectionName = "DCTM Feed"; // This will be the data source name in Tableau
			tableau.connectionData=JSON.stringify(urlval);
			tableau.username=username;
			tableau.password=password;
			//alert('value'+tableau.data);
			 tableau.submit();
	}

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
	
        $("#submitButton").click(function() {
		
            setupConnector();
        });
    });
})();