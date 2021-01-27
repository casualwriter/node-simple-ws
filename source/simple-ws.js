//=============================================================================================
// This progrm is released under GPLv3 (GNU通用公共許可證)	https://www.gnu.org/licenses/gpl-3.0.txt
//
// Description: A simple web service program for gerneal purpose
//
// 2018/06: ck, initial version  
// 2021/01: ck, first release on https://github.com/casualwriter
//=============================================================================================
var http = require('http')
var url = require('url')
var fs = require('fs')
var port = 9000

var ADODB = require('node-adodb');

//=== Connect to datbase via OLEDB, e.g. MS Access 2003 (sample.mdb)
var connection = ADODB.open( 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=sample.mdb;' )

// start web server at 9080
http.createServer(function (request, response) {
   try {
     var reqUrl = url.parse(request.url, true)
     
     if (request.url != '/favicon.ico') {
        console.log( '>> req. url =', request.url )
        fs.appendFileSync( 'simple-ws.log', new Date().toISOString() + ": " + request.url + "\r\n" )
     }
      
     // search wsd for valid path, and compose SQL
     var sql=''
      
     for (var key in wsd) {
        if (reqUrl.pathname == '/'+key) {
          sql = wsd[key]
          break;
        }  
     }
     
     for ( key in reqUrl.query ) sql = sql.replace( new RegExp('{'+key+'}','g'), reqUrl.query[key] );
         
     // run sql
     if (sql > '' ) {
        connection.query( sql )
          .on('done', function(data) {
            response.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
            response.write( JSON.stringify(data, function(k,v){return (v==null?"":(typeof v=='number'?''+v:v))}, '  ') );
            response.end()
            })
          .on('fail', function(error) {
             response.writeHead(404)    
             response.write( 'Query Failed\n\nsql: '+sql+'\n\n' + JSON.stringify(error, null, '  ') );
             response.end()          
            });
     } else {
         response.writeHead(200)
         response.write( 'Missing web service definition for '+ reqUrl.pathname + ' !' );
         response.end()
     }
		 
   } catch(e) {
     response.writeHead(500)
     response.end()
     console.log(e.stack)
   }
	 
}).listen(port)

console.log("(Simple Web Service) listening on port "+port)

//======================== WS Definition ========================
var wsd = { name:'Webservice Definition' }

// http://localhost:9000/Categories
wsd.Categories = `select * from Categories`;

// http://localhost:9000/Customers
wsd.Customers	= `select * from Customers `;

// e.g. http://localhost:9000/Product?key=hot
wsd.Product	= `select * from Products where ProductName like '%{key}%' `;

// e.g. http://localhost:9000/Order?customer=Essen&country=Germany
wsd.Order	= `select a.* from Orders a, Customers b 
              where a.CustomerID=b.CustomerID 
                and b.CompanyName like '%{customer}%' 
                and ShipCountry like '%{country}%' 
            `;

